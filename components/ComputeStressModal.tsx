import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Cpu, Zap, Activity, AlertTriangle, Layers, Play, Square, TrendingUp, Microscope, Eye, Clock, HelpCircle, HardDrive, ShieldAlert, Cpu as CpuIcon } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Select } from './ui/Select';
import {
  MATMUL_SHADER_F32,
  MATMUL_SHADER_F16,
  ALU_SIMD_SHADER_F32,
  ALU_SIMD_SHADER_F16,
  CACHE_MATMUL_SHADER_F32,
  CACHE_MATMUL_SHADER_F16
} from './compute/shaders';
import { ParticleSystem } from './compute/ParticleSystem';
import { Modal } from './ui/Modal';
import { getErrorMessage } from '../utils/error';
import { resolvePreset, describePreset, type PresetId } from './compute/presets';
import { pipelineCacheKey } from './compute/flops';
import { runWebGpuBenchmark, type RunPhase } from './compute/engines/webgpuBenchmark';
import { runWebGlBenchmark } from './compute/engines/webglBenchmark';
import { runCpuBenchmark } from './compute/engines/cpuBenchmark';
import { resolveCpuWorkerCount, type CpuComputeMode } from './compute/cpu/cpuFlops';
import { getWasmSimdRunner } from './compute/cpu/wasmSimdKernel';
import type { TimingSource } from './compute/webgl/webglTimer';
import type {
  GPUAdapter,
  GPUDevice,
  GPUBuffer,
  GPUComputePipeline,
} from '../types/browser';

interface ComputeStressModalProps {
  onClose: () => void;
  t: Translation['computeStress'];
}

const HISTORY_LENGTH = 60;
const UI_TELEMETRY_INTERVAL_MS = 250;

export const ComputeStressModal: React.FC<ComputeStressModalProps> = ({ onClose, t }) => {
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [hasFp16Support, setHasFp16Support] = useState(false);
  const [adapterName, setAdapterName] = useState(t.checking_gpu || 'Checking GPU...');

  const [backend, setBackend] = useState<'webgpu' | 'webgl' | 'cpu'>('webgpu');
  const [isRunning, setIsRunning] = useState(false);
  const [matrixSize, setMatrixSize] = useState(512);
  const [gflops, setGflops] = useState(0);
  const [peakGflops, setPeakGflops] = useState(0);
  const [sustainedGflops, setSustainedGflops] = useState(0);
  const [runPhase, setRunPhase] = useState<RunPhase>('idle');
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'passed' | 'failed' | 'skipped'>('unverified');
  const [cpuCores, setCpuCores] = useState(4);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // New Upgraded Control State Variables
  const [testMode, setTestMode] = useState<'quick' | 'expert'>('quick');
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('standard');
  const [workloadType, setWorkloadType] = useState<'gemm' | 'alu_simd'>('gemm');
  const [precision, setPrecision] = useState<'fp32' | 'fp16' | 'fp64'>('fp32');
  const [memoryMode, setMemoryMode] = useState<'hybrid' | 'cache'>('hybrid');

  const formatTimeRemaining = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [graphData, setGraphData] = useState<number[]>(Array.from({ length: HISTORY_LENGTH }, () => 0));
  const [viewMode, setViewMode] = useState<'graph' | 'visual'>('graph');
  const [webglVersion, setWebglVersion] = useState<'WebGL 2.0' | 'WebGL 1.0' | null>(null);
  const [webglTimingSource, setWebglTimingSource] = useState<TimingSource | null>(null);
  const [effectiveGridSize, setEffectiveGridSize] = useState<number | null>(null);
  const [cpuBatchIterations, setCpuBatchIterations] = useState<number | null>(null);
  const [cpuComputeMode, setCpuComputeMode] = useState<CpuComputeMode | null>(null);
  const hasWasmSimdSupport = useMemo(() => getWasmSimdRunner() !== null, []);

  // Refs for loop access to avoid dependency churn and memory leaks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewModeRef = useRef<'graph' | 'visual'>('graph');

  const adapterRef = useRef<GPUAdapter | null>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const pipelineRef = useRef<GPUComputePipeline | null>(null);
  const pipelineCacheRef = useRef<Map<string, GPUComputePipeline>>(new Map());
  const verifiedKeysRef = useRef<Map<string, boolean>>(new Map());
  const activeBuffersRef = useRef<GPUBuffer[]>([]);
  const runIdRef = useRef(0);
  const [gpuError, setGpuError] = useState<string | null>(null);

  const animRef = useRef<number | null>(null); // For active loops
  const renderLoopRef = useRef<number | null>(null); // For particle visual rAF loop
  const isRunningRef = useRef(false);

  const visualizerRef = useRef<ParticleSystem | null>(null);
  const gflopsRef = useRef(0);
  const lastUiSampleTimeRef = useRef(0);

  // Sync state to refs for particle animation & async compute loops
  useEffect(() => { gflopsRef.current = gflops; }, [gflops]);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

  // Keep active CPU thread count preview aligned with intensity & hardware concurrency
  useEffect(() => {
    const logicalCores =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
    setCpuCores(resolveCpuWorkerCount(matrixSize, logicalCores));
  }, [matrixSize]);

  // Sync Preset selections in Quick Mode
  useEffect(() => {
    if (testMode === 'quick' && backend === 'webgpu') {
      const preset = resolvePreset(selectedPreset, hasFp16Support);
      setWorkloadType(preset.workloadType);
      setMemoryMode(preset.memoryMode);
      setPrecision(preset.precision);
      setMatrixSize(preset.matrixSize);
      setSelectedDuration(preset.duration);
    }
  }, [testMode, selectedPreset, hasFp16Support, backend]);

  const destroyActiveBuffers = () => {
      activeBuffersRef.current.forEach(buffer => buffer.destroy());
      activeBuffersRef.current = [];
  };

  function stopTest() {
      // Bump the run id so any in-flight loop iteration (mid-await) sees itself
      // as stale and exits instead of rescheduling.
      runIdRef.current += 1;
      isRunningRef.current = false;
      if (animRef.current) {
          cancelAnimationFrame(animRef.current);
          animRef.current = null;
      }
      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
      destroyActiveBuffers();
      setIsRunning(false);
      setRunPhase('idle');
  }

  useEffect(() => {
      return () => {
          stopTest();
          pipelineCacheRef.current.clear();
          deviceRef.current?.destroy();
          deviceRef.current = null;
      };
  }, []);

  const handleClose = () => {
    stopTest();
    onClose();
  };

  // Init WebGPU & Check Features & detect Fallbacks
  useEffect(() => {
    const init = async () => {
        let webgpuOk = false;
        if (navigator.gpu) {
            try {
                const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
                if (adapter) {
                    adapterRef.current = adapter;
                    const info = adapter.info;
                    const resolvedName = info?.description || adapter.name || t.backend_webgpu_info || 'WebGPU Adapter';
                    setAdapterName(resolvedName);

                    const features = adapter.features;
                    const supportsF16 = features.has('shader-f16');
                    setHasFp16Support(supportsF16);
                    if (supportsF16) {
                        setPrecision('fp16');
                    } else {
                        setPrecision('fp32');
                    }

                    const requiredFeatures = supportsF16 ? ['shader-f16'] : [];
                    const device = await adapter.requestDevice({ requiredFeatures });
                    deviceRef.current = device;

                    device.lost.then((lostInfo) => {
                        if (deviceRef.current !== device) return;
                        console.error('WebGPU device lost:', lostInfo.reason, lostInfo.message);
                        stopTest();
                        deviceRef.current = null;
                        pipelineRef.current = null;
                        pipelineCacheRef.current.clear();
                        setGpuError(t.error_device_lost || 'The GPU device was lost. Please reopen this test to continue.');
                    });

                    setIsWebGPUSupported(true);
                    setBackend('webgpu');
                    webgpuOk = true;
                } else {
                    setIsWebGPUSupported(false);
                }
            } catch (e: unknown) {
                console.error("WebGPU Init Error", getErrorMessage(e));
                setIsWebGPUSupported(false);
            }
        } else {
            setIsWebGPUSupported(false);
        }

        // Fallback checks (prefer WebGL2, immediately release probe context)
        if (!webgpuOk) {
            const canvas = document.createElement('canvas');
            const gl = (
                canvas.getContext('webgl2') ||
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')
            ) as WebGLRenderingContext | null;
            if (gl) {
                setBackend('webgl');
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    setAdapterName(renderer || t.backend_webgl_info || 'WebGL Graphics Context');
                } else {
                    setAdapterName(t.backend_webgl_info || 'Standard WebGL Context');
                }
                const loseCtx = gl.getExtension('WEBGL_lose_context');
                loseCtx?.loseContext();
            } else {
                setBackend('cpu');
                setMatrixSize(2048);
                setAdapterName(t.backend_cpu_info_prefix || 'CPU Environment (Multi-threaded Fallback)');
            }
        }
    };
    init();
  }, []);

  // Initialize Pipeline based on settings. Pipelines are cached per (workload,
  // memory mode, precision) combination since the shader source is static for
  // each — no need to recompile on every run.
  const initPipeline = async (): Promise<boolean> => {
      const device = deviceRef.current;
      if (!device) return false;

      const isF16 = precision === 'fp16' && hasFp16Support;
      const cacheKey = pipelineCacheKey(workloadType, memoryMode, isF16);
      const cached = pipelineCacheRef.current.get(cacheKey);
      if (cached) {
          pipelineRef.current = cached;
          return true;
      }

      let shaderCode: string;
      if (workloadType === 'alu_simd') {
          shaderCode = isF16 ? ALU_SIMD_SHADER_F16 : ALU_SIMD_SHADER_F32;
      } else { // gemm
          if (memoryMode === 'cache') {
              shaderCode = isF16 ? CACHE_MATMUL_SHADER_F16 : CACHE_MATMUL_SHADER_F32;
          } else {
              shaderCode = isF16 ? MATMUL_SHADER_F16 : MATMUL_SHADER_F32;
          }
      }

      device.pushErrorScope('validation');
      const shaderModule = device.createShaderModule({ code: shaderCode });
      let pipeline: GPUComputePipeline | null = null;
      try {
          pipeline = await device.createComputePipelineAsync({
              layout: 'auto',
              compute: {
                  module: shaderModule,
                  entryPoint: 'main',
              },
          });
      } catch (e: unknown) {
          console.error('WebGPU pipeline creation failed', getErrorMessage(e));
      }
      const validationError = await device.popErrorScope();

      if (validationError || !pipeline) {
          console.error('WebGPU shader validation error', validationError?.message);
          setGpuError(t.error_shader_compile || 'Failed to compile the compute shader for this configuration.');
          return false;
      }

      pipelineCacheRef.current.set(cacheKey, pipeline);
      pipelineRef.current = pipeline;
      return true;
  };

  // Reactive Graph Renderer: redraws strictly on telemetry updates (4Hz) with zero rAF loop
  useEffect(() => {
      if (viewMode !== 'graph' || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < 4; i++) {
          const y = (height / 4) * i;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (graphData.some((v) => v > 0)) {
          const maxVal = Math.max(peakGflops, 10) * 1.1;
          const stepX = width / (HISTORY_LENGTH - 1);

          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(0, height);
          graphData.forEach((val, i) => {
              const x = i * stepX;
              const y = height - (val / maxVal) * height;
              ctx.lineTo(x, y);
          });
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          graphData.forEach((val, i) => {
              const x = i * stepX;
              const y = height - (val / maxVal) * height;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2;
          ctx.stroke();
      }
  }, [viewMode, graphData, peakGflops]);

  // Particle Visualizer rAF Loop: active ONLY while viewing 'visual' mode on non-WebGL & running
  useEffect(() => {
      if (viewMode !== 'visual' || backend === 'webgl' || !visualizerCanvasRef.current) {
          return;
      }

      if (!visualizerRef.current) {
          visualizerRef.current = new ParticleSystem(
              1000,
              visualizerCanvasRef.current.width,
              visualizerCanvasRef.current.height,
          );
      }

      const ctx = visualizerCanvasRef.current.getContext('2d');
      if (!ctx) return;

      if (!isRunning) {
          visualizerRef.current.update(0, ctx);
          return;
      }

      const loop = () => {
          if (!isRunningRef.current || viewModeRef.current !== 'visual') {
              renderLoopRef.current = null;
              return;
          }
          visualizerRef.current?.update(gflopsRef.current, ctx);
          renderLoopRef.current = requestAnimationFrame(loop);
      };

      renderLoopRef.current = requestAnimationFrame(loop);

      return () => {
          if (renderLoopRef.current) {
              cancelAnimationFrame(renderLoopRef.current);
              renderLoopRef.current = null;
          }
      };
  }, [viewMode, backend, isRunning]);

  const updateGraph = (newVal: number) => {
      setGraphData(prev => [...prev.slice(1), newVal]);
  };

  // Decouple React telemetry state & graph repaint from fast compute batches or display rAF
  const commitUiSample = (val: number, peak: number, sustained: number) => {
      const now = performance.now();
      if (
          lastUiSampleTimeRef.current !== 0 &&
          now - lastUiSampleTimeRef.current < UI_TELEMETRY_INTERVAL_MS
      ) {
          return;
      }
      lastUiSampleTimeRef.current = now;
      setGflops(val);
      setPeakGflops(peak);
      setSustainedGflops(sustained);
      updateGraph(val);
  };

  const runTest = async () => {
      if (isRunning) return;

      runIdRef.current += 1;
      const myRunId = runIdRef.current;

      setGpuError(null);
      setIsRunning(true);
      setGflops(0);
      setPeakGflops(0);
      setSustainedGflops(0);
      setVerificationStatus('unverified');
      setCpuComputeMode(null);
      lastUiSampleTimeRef.current = 0;
      setGraphData(Array.from({ length: HISTORY_LENGTH }, () => 0));
      isRunningRef.current = true;

      const startDurationTimer = () => {
          if (selectedDuration <= 0 || runIdRef.current !== myRunId || !isRunningRef.current) return;
          setTimeLeft(selectedDuration);
          // Track an absolute deadline rather than decrementing a counter
          // each tick: background tabs throttle setInterval to as little as
          // once/minute, and a counter would only lose one "second" per
          // throttled tick, leaving the test running long after it should
          // have stopped. Deriving remaining time from the deadline means
          // whenever the tick does fire, it immediately reflects real
          // elapsed wall time and stops promptly.
          const deadline = performance.now() + selectedDuration * 1000;
          if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
          }
          timerIntervalRef.current = setInterval(() => {
              const remaining = Math.ceil((deadline - performance.now()) / 1000);
              setTimeLeft(Math.max(0, remaining));
              if (remaining <= 0) {
                  stopTest();
              }
          }, 1000);
      };

      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
      if (selectedDuration > 0) {
          setTimeLeft(selectedDuration);
      }

      if (backend === 'webgpu') {
          if (!deviceRef.current) {
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }
          const pipelineReady = await initPipeline();
          if (runIdRef.current !== myRunId) return; // superseded while awaiting pipeline
          if (!pipelineReady || !pipelineRef.current || !deviceRef.current) {
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }

          const device = deviceRef.current;
          const pipeline = pipelineRef.current;
          const isF16 = precision === 'fp16' && hasFp16Support;

          runWebGpuBenchmark(
              device,
              pipeline,
              { matrixSize, workloadType, memoryMode, isF16 },
              verifiedKeysRef.current,
              () => runIdRef.current !== myRunId,
              () => !isRunningRef.current,
              {
                  onPhaseChange: (phase) => {
                      setRunPhase(phase);
                      if (phase === 'running') {
                          startDurationTimer();
                      }
                  },
                  onVerification: setVerificationStatus,
                  onBuffersCreated: (buffers) => { activeBuffersRef.current.push(...buffers); },
                  onSample: commitUiSample,
                  onError: (kind) => {
                      const message = kind === 'verification'
                          ? (t.error_verification_failed || 'The GEMM correctness check failed on this GPU. Results would not be trustworthy, so the test was aborted.')
                          : (t.error_shader_compile || 'Failed to allocate GPU buffers for this configuration.');
                      setGpuError(message);
                      setIsRunning(false);
                      isRunningRef.current = false;
                      setRunPhase('idle');
                      destroyActiveBuffers();
                  },
              },
          );

      } else if (backend === 'webgl') {
          const canvas = webglCanvasRef.current;
          if (!canvas) {
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }

          setWebglVersion(null);
          setWebglTimingSource(null);
          setEffectiveGridSize(null);

          runWebGlBenchmark(
              canvas,
              {
                  matrixSize,
                  shouldRenderPreview: () => viewModeRef.current === 'visual',
              },
              () => runIdRef.current !== myRunId,
              () => !isRunningRef.current,
              {
                  onPhaseChange: (phase) => {
                      setRunPhase(phase);
                      if (phase === 'running') {
                          startDurationTimer();
                      }
                  },
                  onVerification: setVerificationStatus,
                  onCapabilityDetected: ({ glVersion, timingSource, effectiveGridSize: resolvedGrid }) => {
                      setWebglVersion(glVersion);
                      setWebglTimingSource(timingSource);
                      setEffectiveGridSize(resolvedGrid);
                  },
                  onSample: commitUiSample,
                  onError: (kind) => {
                      const message = kind === 'verification'
                          ? (t.error_webgl_verification_failed || 'The WebGL ALU correctness check failed on this GPU. Results would not be trustworthy, so the test was aborted.')
                          : kind === 'device-lost'
                              ? (t.error_device_lost || 'The GPU device was lost. Please reopen this test to continue.')
                              : (t.error_shader_compile || 'Failed to compile or allocate GPU resources for this configuration.');
                      setGpuError(message);
                      stopTest();
                  },
              },
          );

      } else if (backend === 'cpu') {
          setCpuBatchIterations(null);

          runCpuBenchmark(
              { matrixSize },
              () => runIdRef.current !== myRunId,
              () => !isRunningRef.current,
              {
                  onPhaseChange: (phase) => {
                      setRunPhase(phase);
                      if (phase === 'running') {
                          startDurationTimer();
                      }
                  },
                  onVerification: setVerificationStatus,
                  onWorkersReady: ({ activeWorkers, batchIterations, computeMode }) => {
                      setCpuCores(activeWorkers);
                      setCpuBatchIterations(batchIterations);
                      setCpuComputeMode(computeMode);
                  },
                  onSample: commitUiSample,
                  onError: (kind) => {
                      const message = kind === 'verification'
                          ? (t.error_cpu_verification_failed || 'The CPU arithmetic correctness check failed across worker threads. Results would not be trustworthy, so the test was aborted.')
                          : (t.error_cpu_worker_failed || 'One or more CPU worker threads failed to initialize or crashed during execution.');
                      setGpuError(message);
                      stopTest();
                  },
              },
          );
      }
  };

  const stability = peakGflops > 0 ? Math.round((sustainedGflops / peakGflops) * 100) : 100;

  const activeCpuMode: CpuComputeMode =
      cpuComputeMode ?? (hasWasmSimdSupport ? 'wasm-simd' : 'scalar-js');

  const presetInfo = describePreset(selectedPreset, t);

  const phaseLabel = runPhase === 'calibrating' ? (t.status_calibrating || 'Calibrating')
      : runPhase === 'verifying' ? (t.status_verifying || 'Verifying')
      : runPhase === 'warmup' ? (t.status_warmup || 'Warming Up')
      : t.status_active;

  return (
    <Modal
        title={t.title}
        icon={<Cpu size={24} />}
        onClose={handleClose}
        size="4xl"
    >
        <div className="flex flex-col gap-6 relative">
            {/* GPU Error Banner */}
            {gpuError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-red-800 dark:text-red-200 text-xs leading-relaxed font-medium">
                        {gpuError}
                    </p>
                </div>
            )}

            {/* Warning Banner */}
            {!isRunning && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-amber-800 dark:text-amber-200 text-xs leading-relaxed font-medium">
                        {t.warning}
                    </p>
                </div>
            )}

            {/* Main Visualizer Area */}
            <div className="h-64 bg-black rounded-xl border border-slate-200 dark:border-indigo-900/50 relative overflow-hidden shadow-inner flex flex-col group">

                {/* View Switcher Tabs (Overlay Top Right) */}
                <div className="absolute top-2 right-2 z-30 flex gap-1 bg-black/50 p-1 rounded-lg backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => setViewMode('graph')}
                        className={`p-1.5 rounded transition-colors ${viewMode === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title={t.perf_graph || "Performance Graph"}
                    >
                        <TrendingUp size={14} />
                    </button>
                    <button
                        onClick={() => setViewMode('visual')}
                        className={`p-1.5 rounded transition-colors ${viewMode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title={t.visualizer || "Visualizer"}
                    >
                        <Eye size={14} />
                    </button>
                </div>

                {/* Graph Layer */}
                <canvas
                    ref={canvasRef}
                    width={600} height={256}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === 'graph' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Visualizer Layer (Particles) */}
                <canvas
                    ref={visualizerCanvasRef}
                    width={600} height={256}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === 'visual' && backend !== 'webgl' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* WebGL Stress Render Layer */}
                <canvas
                    ref={webglCanvasRef}
                    width={600} height={256}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === 'visual' && backend === 'webgl' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Metrics Overlay (Always visible) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 flex-col">
                    <div className="text-center mix-blend-difference">
                        <div className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                            {formatNumber(gflops, 2)}
                        </div>
                        <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1">{t.metric_gflops}</div>
                    </div>
                </div>

                {/* Sub Metrics */}
                <div className="mt-auto p-3 flex justify-between items-end relative z-20 bg-gradient-to-t from-black/90 to-transparent w-full">
                    <div className="text-xs font-mono text-slate-400">
                        <div>{t.peak}: <span className="text-white font-bold">{formatNumber(peakGflops, 2)}</span></div>
                        <div>{t.stability}: <span className={`font-bold ${stability > 90 ? 'text-green-400' : 'text-amber-400'}`}>{stability}%</span></div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        {isRunning && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs font-bold text-red-400 animate-pulse">
                                <Activity size={12} /> {phaseLabel}
                            </div>
                        )}
                        {isRunning && selectedDuration > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded text-[10px] font-mono font-bold text-indigo-300">
                                <Clock size={11} className="animate-pulse" />
                                {t.time_remaining || "Time Remaining"}: {formatTimeRemaining(timeLeft)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Config & Controls Panel with Quick/Expert Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Control Panel: Settings & Mode Selection (Spans 2 columns) */}
                <div className="md:col-span-2 bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-4">

                    {/* Mode Toggle Switcher */}
                    {backend === 'webgpu' && (
                        <div className="flex bg-slate-200/50 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-300/30 dark:border-white/5">
                            <button
                                onClick={() => setTestMode('quick')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                    testMode === 'quick'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                                disabled={isRunning}
                            >
                                <Zap size={14} />
                                {t.mode_quick || 'Quick Presets'}
                            </button>
                            <button
                                onClick={() => setTestMode('expert')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                    testMode === 'expert'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                                disabled={isRunning}
                            >
                                <Microscope size={14} />
                                {t.mode_expert || 'Expert Settings'}
                            </button>
                        </div>
                    )}

                    {/* QUICK PRESET MODE VIEW */}
                    {testMode === 'quick' && backend === 'webgpu' ? (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold flex items-center gap-1">
                                    <Layers size={12} className="text-indigo-500" />
                                    {t.preset_label || "Select Stress Preset"}
                                </div>
                                <Select
                                    value={selectedPreset}
                                    options={[
                                        { id: 'standard', label: t.preset_standard || 'Standard Run (Matrix)' },
                                        { id: 'peak', label: t.preset_peak || 'Peak ALU Compute (SIMD)' },
                                        { id: 'fp16', label: t.preset_fp16 || 'FP16 Extreme (Tensor Core)' },
                                        { id: 'thermal', label: t.preset_thermal || 'Thermal Throttle Burn' }
                                    ]}
                                    onChange={(val) => {
                                        setSelectedPreset(val as PresetId);
                                    }}
                                    disabled={isRunning}
                                    color="indigo"
                                />
                            </div>

                            {/* Preset Description Card */}
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl p-3.5 space-y-2">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                    <HelpCircle size={13} className="text-indigo-400 shrink-0" />
                                    {presetInfo.title}
                                </h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {presetInfo.desc}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-200/40 dark:border-white/5">
                                    {presetInfo.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        /* EXPERT MODE / FALLBACK MODE VIEW */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">

                            {/* Compute Engine */}
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                    {t.engine_label || "Compute Engine"}
                                </div>
                                <Select
                                    value={backend}
                                    options={[
                                        { id: 'webgpu', label: t.engine_webgpu || 'GPU: WebGPU (Tensor Core)', disabled: isWebGPUSupported === false },
                                        { id: 'webgl', label: t.engine_webgl || 'GPU: WebGL (Fragment Shader)' },
                                        { id: 'cpu', label: t.engine_cpu || 'CPU: Multi-threaded Workload' }
                                    ]}
                                    onChange={(val) => {
                                        const nextBackend = val as 'webgpu' | 'webgl' | 'cpu';
                                        const prevBackend = backend;
                                        setBackend(nextBackend);
                                        if (nextBackend === 'cpu') {
                                            setMatrixSize(2048);
                                        } else if (prevBackend === 'cpu' && matrixSize === 2048) {
                                            setMatrixSize(512);
                                        }
                                        setVerificationStatus('unverified');
                                        setWebglVersion(null);
                                        setWebglTimingSource(null);
                                        setEffectiveGridSize(null);
                                        setCpuBatchIterations(null);
                                        setCpuComputeMode(null);
                                        setGpuError(null);
                                        stopTest();
                                    }}
                                    disabled={isRunning}
                                    color="indigo"
                                />
                            </div>

                            {/* Load Intensity / Grid Size */}
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                    {backend === 'cpu' ? (t.cpu_cores_prefix || "Active Cores:") : t.intensity}
                                </div>
                                <Select
                                    value={matrixSize}
                                    options={backend === 'cpu' ? [
                                        { id: 256, label: t.intensity_cpu_light || 'Light (25% CPU Cores)' },
                                        { id: 512, label: t.intensity_cpu_moderate || 'Moderate (50% CPU Cores)' },
                                        { id: 1024, label: t.intensity_cpu_heavy || 'Heavy (75% CPU Cores)' },
                                        { id: 2048, label: t.intensity_cpu_max || 'Max Saturated (100% CPU Cores)' }
                                    ] : [
                                        { id: 256, label: t.intensity_gpu_low || 'Low (256x256)' },
                                        { id: 512, label: t.intensity_gpu_medium || 'Medium (512x512)' },
                                        { id: 1024, label: t.intensity_gpu_high || 'High (1024x1024)' },
                                        { id: 2048, label: t.intensity_gpu_extreme || 'Extreme (2048x2048)' }
                                    ]}
                                    onChange={(val) => setMatrixSize(Number(val))}
                                    disabled={isRunning}
                                    color="indigo"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                    {t.timer_label || "Test Duration"}
                                </div>
                                <Select
                                    value={selectedDuration}
                                    options={[
                                        { id: 0, label: t.timer_unlimited || 'Infinite' },
                                        { id: 10, label: t.timer_10s || '10 Seconds' },
                                        { id: 30, label: t.timer_30s || '30 Seconds' },
                                        { id: 60, label: t.timer_1m || '1 Minute' },
                                        { id: 120, label: t.timer_2m || '2 Minutes' },
                                        { id: 300, label: t.timer_5m || '5 Minutes' },
                                        { id: 600, label: t.timer_10m || '10 Minutes' }
                                    ]}
                                    onChange={(val) => setSelectedDuration(Number(val))}
                                    disabled={isRunning}
                                    color="indigo"
                                />
                            </div>

                            {/* Workload Type (Only WebGPU) */}
                            {backend === 'webgpu' && (
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                        {t.workload_label || "Workload Type"}
                                    </div>
                                    <Select
                                        value={workloadType}
                                        options={[
                                            { id: 'gemm', label: t.workload_gemm || 'Matrix Multiply (GEMM)' },
                                            { id: 'alu_simd', label: t.workload_alu || 'Vector ALU SIMD (FMA Loops)' }
                                        ]}
                                        onChange={(val) => setWorkloadType(val as 'gemm' | 'alu_simd')}
                                        disabled={isRunning}
                                        color="indigo"
                                    />
                                </div>
                            )}

                            {/* Memory Mode (Only WebGPU & GEMM) */}
                            {backend === 'webgpu' && workloadType === 'gemm' && (
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                        {t.memory_label || "Memory / Cache Mode"}
                                    </div>
                                    <Select
                                        value={memoryMode}
                                        options={[
                                            { id: 'hybrid', label: t.memory_hybrid || 'Compute + Memory Hybrid' },
                                            { id: 'cache', label: t.memory_cache || 'Register Cache Prioritized' }
                                        ]}
                                        onChange={(val) => setMemoryMode(val as 'hybrid' | 'cache')}
                                        disabled={isRunning}
                                        color="indigo"
                                    />
                                </div>
                            )}

                            {/* Floating Point Precision (Only WebGPU) */}
                            {backend === 'webgpu' && (
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                                        {t.precision_label || "Float Precision"}
                                    </div>
                                    <Select
                                        value={precision}
                                        options={[
                                            { id: 'fp32', label: t.precision_fp32 || 'FP32 (Single Precision)' },
                                            {
                                                id: 'fp16',
                                                label: hasFp16Support
                                                    ? (t.precision_fp16 || 'FP16 (Half Precision)')
                                                    : (t.precision_fp16_unsupported || 'FP16 (Unsupported)') ,
                                                disabled: !hasFp16Support
                                            },
                                            {
                                                id: 'fp64',
                                                label: t.precision_fp64_unsupported || 'FP64 (Standard/GPU Unsupported)',
                                                disabled: true
                                            }
                                        ]}
                                        onChange={(val) => setPrecision(val as 'fp32' | 'fp16' | 'fp64')}
                                        disabled={isRunning}
                                        color="indigo"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Advanced Backend Status Metrics */}
                <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Activity size={13} className="text-indigo-400" />
                            {t.backend_status || "Backend Status"}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                            {backend === 'webgpu' && (
                                <>
                                    <Layers size={14} className="text-emerald-500 shrink-0" />
                                    <span>{t.backend_webgpu_info || "WebGPU (Next-Gen Graphics)"}</span>
                                </>
                            )}
                            {backend === 'webgl' && (
                                <>
                                    <Zap size={14} className="text-amber-500 animate-pulse shrink-0" />
                                    <span>{t.backend_webgl_info || "WebGL (Legacy Shader GPGPU)"}</span>
                                </>
                            )}
                            {backend === 'cpu' && (
                                <>
                                    <CpuIcon size={14} className="text-indigo-500 shrink-0" />
                                    <span>{t.backend_cpu_info_prefix || "CPU Multi-thread"} ({cpuCores} {t.cores_suffix || "Cores"})</span>
                                </>
                            )}
                        </div>

                        <div className="h-px bg-slate-200 dark:bg-white/10" />

                        {/* Status Details List */}
                        <div className="space-y-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                            <div className="flex justify-between">
                                <span>{t.label_precision || "Precision"}:</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold uppercase">
                                    {backend === 'webgpu'
                                        ? precision
                                        : backend === 'webgl'
                                            ? (t.precision_fp32_simulated || 'FP32 (Simulated)')
                                            : activeCpuMode === 'wasm-simd'
                                                ? (t.precision_fp32_wasm_simd || 'FP32 (Wasm SIMD v128)')
                                                : (t.precision_fp64_native || 'FP64 (Native)')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t.label_workload || "Workload"}:</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">
                                    {backend === 'webgpu'
                                        ? (workloadType === 'gemm' ? (t.workload_gemm_short || 'GEMM Matrix') : (t.workload_simd_short || 'SIMD FMA Vector'))
                                        : backend === 'cpu'
                                            ? (activeCpuMode === 'wasm-simd'
                                                ? (t.workload_cpu_simd_short || 'Multi-thread SIMD v128 FMA')
                                                : (t.workload_cpu_short || 'Multi-thread FP64 FMA'))
                                            : (t.workload_shader_short || 'Shader Raster')}
                                </span>
                            </div>
                            {backend === 'webgpu' && (
                                <div className="flex justify-between">
                                    <span>{t.label_access_mode || "Access Mode"}:</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                                        {workloadType === 'alu_simd' ? (t.access_register || 'Register Compute') : (memoryMode === 'cache' ? (t.access_cache || 'Cache Local') : (t.access_global || 'Global Bandwidth'))}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>{t.label_grid_size || "Grid Size"}:</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">
                                    {backend === 'cpu'
                                        ? `${t.active_workers_prefix || 'Active Workers'}: ${cpuCores}`
                                        : backend === 'webgl' && effectiveGridSize
                                            ? `${effectiveGridSize} x ${effectiveGridSize}`
                                            : `${matrixSize} x ${matrixSize}`}
                                </span>
                            </div>
                            {backend === 'cpu' && (
                                <div className="flex justify-between">
                                    <span>{t.timing_source_label || "Timing Method"}:</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 font-bold">
                                        {t.timing_cpu_channel || 'MessageChannel (Unclamped)'}
                                    </span>
                                </div>
                            )}
                            {backend === 'cpu' && cpuBatchIterations !== null && (
                                <div className="flex justify-between">
                                    <span>{t.cpu_batch_size_label || "Batch / Thread"}:</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                                        {cpuBatchIterations.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {backend === 'webgl' && webglVersion && (
                                <div className="flex justify-between">
                                    <span>{t.webgl_version_label || "API Version"}:</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">{webglVersion}</span>
                                </div>
                            )}
                            {backend === 'webgl' && webglTimingSource && (
                                <div className="flex justify-between">
                                    <span>{t.timing_source_label || "Timing Method"}:</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 font-bold">
                                        {webglTimingSource === 'gpu-timer'
                                            ? (t.timing_gpu_timer || 'GPU Hardware Timer')
                                            : webglTimingSource === 'fence-sync'
                                                ? (t.timing_fence_sync || 'WebGL2 Sync Fence')
                                                : (t.timing_readback_sync || 'Readback Barrier')}
                                    </span>
                                </div>
                            )}
                            {backend !== 'cpu' && (
                                <div className="flex justify-between">
                                    <span>{t.label_total_threads || "Total Threads"}:</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                                        {((backend === 'webgl' && effectiveGridSize ? effectiveGridSize : matrixSize) ** 2).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>{t.verify_label || "Correctness Check"}:</span>
                                <span className={`font-bold ${
                                    verificationStatus === 'passed' ? 'text-green-500'
                                    : verificationStatus === 'failed' ? 'text-red-500'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {verificationStatus === 'passed' ? (t.verify_passed || 'Passed')
                                        : verificationStatus === 'failed' ? (t.verify_failed || 'Failed')
                                        : verificationStatus === 'skipped' ? (t.verify_skipped || 'N/A (no ground truth)')
                                        : (t.status_unknown || 'Unknown')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                        {/* Device Info */}
                        <div className="text-[9px] text-slate-400 font-mono break-all leading-tight flex items-start gap-1">
                            <HardDrive size={10} className="shrink-0 mt-0.5 text-indigo-400/70" />
                            <span>{backend === 'cpu' ? `${t.logical_cores_prefix || 'Logical cores'}: ${navigator.hardwareConcurrency || (t.status_unknown || 'Unknown')}` : adapterName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Button */}
            <button
                onClick={isRunning ? stopTest : runTest}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group ${
                    isRunning
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                }`}
            >
                {isRunning ? (
                    <>
                        <Square size={20} fill="currentColor" />
                        {t.stop}
                    </>
                ) : (
                    <>
                        <Play size={20} fill="currentColor" className="group-hover:text-white" />
                        {t.start}
                        <Zap size={16} className="text-yellow-300 animate-bounce" />
                    </>
                )}
            </button>

        </div>
    </Modal>
  );
};
