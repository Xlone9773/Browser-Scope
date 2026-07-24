import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, AlertTriangle, Layers, Play, Square, TrendingUp, Microscope, Eye, Clock } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Select } from './ui/Select';
import { MATMUL_SHADER_F32, MATMUL_SHADER_F16 } from './compute/shaders';
import { ParticleSystem } from './compute/ParticleSystem';
import { Modal } from './ui/Modal';
import { getErrorMessage } from '../utils/error';

// WebGPU fallback types for environments without @webgpu/types
type GPUAdapter = ReturnType<typeof JSON.parse>;
type GPUDevice = ReturnType<typeof JSON.parse>;
type GPUComputePipeline = ReturnType<typeof JSON.parse>;

interface ComputeStressModalProps {
  onClose: () => void;
  t: Translation['computeStress'];
}

const HISTORY_LENGTH = 60;

export const ComputeStressModal: React.FC<ComputeStressModalProps> = ({ onClose, t }) => {
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [hasFp16Support, setHasFp16Support] = useState(false);
  const [useFp16, setUseFp16] = useState(false);
  const [adapterName, setAdapterName] = useState('Checking GPU...');
  
  const [backend, setBackend] = useState<'webgpu' | 'webgl' | 'cpu'>('webgpu');
  const [isRunning, setIsRunning] = useState(false);
  const [matrixSize, setMatrixSize] = useState(512); 
  const [gflops, setGflops] = useState(0);
  const [peakGflops, setPeakGflops] = useState(0);
  const [cpuCores, setCpuCores] = useState(4);
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerIntervalRef = useRef<any>(null);

  const formatTimeRemaining = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  
  const [graphData, setGraphData] = useState<number[]>(Array.from({ length: HISTORY_LENGTH }, () => 0));
  const [viewMode, setViewMode] = useState<'graph' | 'visual'>('graph');

  // Refs for loop access to avoid dependency churn and memory leaks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);

  const adapterRef = useRef<GPUAdapter | null>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const pipelineRef = useRef<GPUComputePipeline | null>(null);
  
  const animRef = useRef<number | null>(null); // For active loops
  const renderLoopRef = useRef<number | null>(null); // For UI render loop
  const isRunningRef = useRef(false);
  
  const visualizerRef = useRef<ParticleSystem | null>(null);
  const gflopsRef = useRef(0);
  const peakGflopsRef = useRef(0);
  const graphDataRef = useRef<number[]>([]);

  // CPU Multi-threaded Worker references
  const workersRef = useRef<Worker[]>([]);
  const accumulatedCpuOpsRef = useRef<number>(0);

  // WebGL context states
  const webglStateRef = useRef<{
      gl: WebGLRenderingContext | null;
      program: WebGLProgram | null;
      positionBuffer: WebGLBuffer | null;
      timeLoc: WebGLUniformLocation | null;
      resolutionLoc: WebGLUniformLocation | null;
      iterationsLoc: WebGLUniformLocation | null;
  }>({ gl: null, program: null, positionBuffer: null, timeLoc: null, resolutionLoc: null, iterationsLoc: null });

  // Sync state to refs for the animation loop
  useEffect(() => { gflopsRef.current = gflops; }, [gflops]);
  useEffect(() => { peakGflopsRef.current = peakGflops; }, [peakGflops]);
  useEffect(() => { graphDataRef.current = graphData; }, [graphData]);

  // CPU Workers control
  const startCpuWorkers = (numWorkers: number) => {
      stopCpuWorkers();
      accumulatedCpuOpsRef.current = 0;
      
      const workerBlobCode = `
          let isRunning = true;
          self.onmessage = function(e) {
              if (e.data.cmd === 'stop') {
                  isRunning = false;
                  self.close();
                  return;
              }
              
              let x0 = 1.0, x1 = 1.1, x2 = 1.2, x3 = 1.3, x4 = 1.4, x5 = 1.5, x6 = 1.6, x7 = 1.7;
              const opsPerBatch = 160;
              
              while (isRunning) {
                  for (let i = 0; i < 40000; i++) {
                      x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
                      x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
                      x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
                      x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

                      x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
                      x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
                      x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
                      x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

                      x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
                      x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
                      x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
                      x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

                      x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
                      x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
                      x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
                      x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;

                      x0 = x0 * 0.9999 + 0.0001; x1 = x1 * 0.9998 + 0.0002;
                      x2 = x2 * 0.9997 + 0.0003; x3 = x3 * 0.9996 + 0.0004;
                      x4 = x4 * 0.9995 + 0.0005; x5 = x5 * 0.9994 + 0.0006;
                      x6 = x6 * 0.9993 + 0.0007; x7 = x7 * 0.9992 + 0.0008;
                  }
                  self.postMessage({ cmd: 'progress', ops: 40000 * 5 * opsPerBatch });
              }
          };
      `;
      const blob = new Blob([workerBlobCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      
      const activeWorkers: Worker[] = [];
      for (let i = 0; i < numWorkers; i++) {
          const worker = new Worker(blobUrl);
          worker.onmessage = (e) => {
              if (e.data.cmd === 'progress') {
                  accumulatedCpuOpsRef.current += e.data.ops;
              }
          };
          worker.postMessage({ cmd: 'start' });
          activeWorkers.push(worker);
      }
      workersRef.current = activeWorkers;
      URL.revokeObjectURL(blobUrl);
  };

  const stopCpuWorkers = () => {
      workersRef.current.forEach(w => {
          w.postMessage({ cmd: 'stop' });
          w.terminate();
      });
      workersRef.current = [];
  };

  // WebGL GPGPU stress compiler
  const initWebGL = () => {
      const canvas = webglCanvasRef.current;
      if (!canvas) return false;
      
      let gl = canvas.getContext('webgl');
      if (!gl) {
          gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      }
      if (!gl) return false;
      
      const vsSource = `
          attribute vec2 position;
          void main() {
              gl_Position = vec4(position, 0.0, 1.0);
          }
      `;
      
      const fsSource = `
          precision highp float;
          uniform vec2 u_resolution;
          uniform float u_time;
          uniform int u_iterations;

          void main() {
              vec2 uv = gl_FragCoord.xy / u_resolution.xy;
              float x = uv.x * 3.0 - 1.5;
              float y = uv.y * 2.0 - 1.0;
              
              float d = 0.0;
              int limit = u_iterations;
              if (limit > 1500) limit = 1500;
              
              for (int i = 0; i < 1500; i++) {
                  if (i >= limit) break;
                  float nx = x * x - y * y + sin(u_time * 0.15) * 0.3;
                  float ny = 2.0 * x * y + cos(u_time * 0.1) * 0.25;
                  x = nx;
                  y = ny;
                  d += sin(x) * cos(y);
              }
              
              vec3 col = vec3(
                  sin(d + u_time * 1.0) * 0.4 + 0.6,
                  cos(d - u_time * 0.8) * 0.3 + 0.5,
                  sin(d * 1.5 + u_time * 1.2) * 0.2 + 0.8
              );
              gl_FragColor = vec4(col * (1.0 - length(uv - 0.5) * 0.5), 1.0);
          }
      `;
      
      const compileShader = (src: string, type: number) => {
          const shader = gl!.createShader(type);
          if (!shader) return null;
          gl!.shaderSource(shader, src);
          gl!.compileShader(shader);
          if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
              console.error(gl!.getShaderInfoLog(shader));
              return null;
          }
          return shader;
      };
      
      const vs = compileShader(vsSource, gl.VERTEX_SHADER);
      const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return false;
      
      const program = gl.createProgram();
      if (!program) return false;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program));
          return false;
      }
      
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1,
      ]), gl.STATIC_DRAW);
      
      const timeLoc = gl.getUniformLocation(program, 'u_time');
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
      const iterationsLoc = gl.getUniformLocation(program, 'u_iterations');
      
      webglStateRef.current = { gl, program, positionBuffer, timeLoc, resolutionLoc, iterationsLoc };
      return true;
  };

  const renderWebGLFrame = (time: number, iterations: number) => {
      const { gl, program, positionBuffer, timeLoc, resolutionLoc, iterationsLoc } = webglStateRef.current;
      if (!gl || !program) return;
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(program);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const posAttr = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posAttr);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
      
      gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLoc, time / 1000);
      gl.uniform1i(iterationsLoc, iterations);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  function stopTest() {
      isRunningRef.current = false;
      if (animRef.current) {
          cancelAnimationFrame(animRef.current);
          animRef.current = null;
      }
      if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
      }
      stopCpuWorkers();
      setIsRunning(false);
  }

  useEffect(() => {
      return () => {
          stopTest();
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
                    setAdapterName(adapter.name || 'WebGPU Adapter');
                    
                    const features = adapter.features;
                    const supportsF16 = features.has('shader-f16');
                    setHasFp16Support(supportsF16);
                    if (supportsF16) setUseFp16(true); 

                    const requiredFeatures = supportsF16 ? ['shader-f16'] : [];
                    const device = await adapter.requestDevice({ requiredFeatures });
                    deviceRef.current = device;
                    
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

        // Fallback checks
        if (!webgpuOk) {
            const canvas = document.createElement('canvas');
            const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
            if (gl) {
                setBackend('webgl');
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    setAdapterName(renderer || 'WebGL Graphics Context');
                } else {
                    setAdapterName('Standard WebGL Context');
                }
            } else {
                setBackend('cpu');
                setAdapterName('CPU Environment (Multi-threaded Fallback)');
            }
        }
    };
    init();
  }, []);

  // Initialize Pipeline based on settings
  const initPipeline = async () => {
      if (!deviceRef.current) return;
      
      const shaderCode = useFp16 && hasFp16Support ? MATMUL_SHADER_F16 : MATMUL_SHADER_F32;
      const device = deviceRef.current;
      const shaderModule = device.createShaderModule({ code: shaderCode });
      const pipeline = device.createComputePipeline({
          layout: 'auto',
          compute: {
              module: shaderModule,
              entryPoint: 'main',
          },
      });
      pipelineRef.current = pipeline;
  };

  // UI Render Loop (Graph / Visualizer)
  useEffect(() => {
      const loop = () => {
          if (viewMode === 'graph' && canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              const width = canvasRef.current.width;
              const height = canvasRef.current.height;
              const data = graphDataRef.current;
              const peak = peakGflopsRef.current;

              if (ctx) {
                  ctx.clearRect(0, 0, width, height);

                  // Grid Lines
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  for(let i=1; i<4; i++) {
                      const y = (height / 4) * i;
                      ctx.moveTo(0, y);
                      ctx.lineTo(width, y);
                  }
                  ctx.stroke();

                  if (data.some(v => v > 0)) {
                      const maxVal = Math.max(peak, 10) * 1.1; 
                      const stepX = width / (HISTORY_LENGTH - 1);

                      const gradient = ctx.createLinearGradient(0, 0, 0, height);
                      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); 
                      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                      ctx.beginPath();
                      ctx.moveTo(0, height);
                      data.forEach((val, i) => {
                          const x = i * stepX;
                          const y = height - (val / maxVal) * height;
                          ctx.lineTo(x, y);
                      });
                      ctx.lineTo(width, height);
                      ctx.closePath();
                      ctx.fillStyle = gradient;
                      ctx.fill();

                      ctx.beginPath();
                      data.forEach((val, i) => {
                          const x = i * stepX;
                          const y = height - (val / maxVal) * height;
                          if (i === 0) ctx.moveTo(x, y);
                          else ctx.lineTo(x, y);
                      });
                      ctx.strokeStyle = '#818cf8'; 
                      ctx.lineWidth = 2;
                      ctx.stroke();
                  }
              }
          }

          else if (viewMode === 'visual' && backend !== 'webgl' && visualizerCanvasRef.current) {
              if (!visualizerRef.current) {
                  visualizerRef.current = new ParticleSystem(1000, visualizerCanvasRef.current.width, visualizerCanvasRef.current.height);
              }
              const ctx = visualizerCanvasRef.current.getContext('2d');
              if (ctx) {
                  visualizerRef.current.update(gflopsRef.current, ctx);
              }
          }

          renderLoopRef.current = requestAnimationFrame(loop);
      };
      
      renderLoopRef.current = requestAnimationFrame(loop);
      
      return () => {
          if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
      };
  }, [viewMode, backend]);

  const updateGraph = (newVal: number) => {
      setGraphData(prev => [...prev.slice(1), newVal]);
  };

  const runTest = async () => {
      if (isRunning) return;
      
      setIsRunning(true);
      setGflops(0);
      setPeakGflops(0);
      setGraphData(Array.from({ length: HISTORY_LENGTH }, () => 0));
      isRunningRef.current = true;

      if (selectedDuration > 0) {
          setTimeLeft(selectedDuration);
          let currentLeft = selectedDuration;
          if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
          }
          timerIntervalRef.current = setInterval(() => {
              currentLeft -= 1;
              setTimeLeft(currentLeft);
              if (currentLeft <= 0) {
                  stopTest();
              }
          }, 1000);
      }

      let startTime = performance.now();
      let frames = 0;
      accumulatedCpuOpsRef.current = 0;

      if (backend === 'webgpu') {
          if (!deviceRef.current) {
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }
          await initPipeline();
          if (!pipelineRef.current) {
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }
          
          const device = deviceRef.current;
          const pipeline = pipelineRef.current;

          // Matrix Setup
          const firstMatrix = new Float32Array(Array(matrixSize * matrixSize).fill(0).map(() => Math.random()));
          const secondMatrix = new Float32Array(Array(matrixSize * matrixSize).fill(0).map(() => Math.random()));
          
          const createBuffer = (arr: Float32Array, usage: number) => {
              const desc = new Float32Array([matrixSize, matrixSize, 0, 0]);
              const buffer = device.createBuffer({
                  size: desc.byteLength + arr.byteLength,
                  usage,
                  mappedAtCreation: true,
              });
              const dst = new ArrayBuffer(buffer.size);
              new Float32Array(dst).set(desc);
              new Float32Array(dst, desc.byteLength).set(arr);
              new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(dst));
              buffer.unmap();
              return buffer;
          };
          const USAGE_STORAGE = window.GPUBufferUsage?.STORAGE || 128;

          const gpuBufferFirstMatrix = createBuffer(firstMatrix, USAGE_STORAGE);
          const gpuBufferSecondMatrix = createBuffer(secondMatrix, USAGE_STORAGE);
          const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix.length);
          const resultMatrixBuffer = device.createBuffer({
              size: resultMatrixBufferSize,
              usage: USAGE_STORAGE
          });
          const bindGroup = device.createBindGroup({
              layout: pipeline.getBindGroupLayout(0),
              entries: [
                  { binding: 0, resource: { buffer: gpuBufferFirstMatrix } },
                  { binding: 1, resource: { buffer: gpuBufferSecondMatrix } },
                  { binding: 2, resource: { buffer: resultMatrixBuffer } },
              ],
          });

          const webgpuLoop = async () => {
              if (!isRunningRef.current) return;
              const commandEncoder = device.createCommandEncoder();
              const passEncoder = commandEncoder.beginComputePass();
              passEncoder.setPipeline(pipeline);
              passEncoder.setBindGroup(0, bindGroup);
              const workgroupCount = Math.ceil(matrixSize / 8);
              passEncoder.dispatchWorkgroups(workgroupCount, workgroupCount);
              passEncoder.end();
              device.queue.submit([commandEncoder.finish()]);
              await device.queue.onSubmittedWorkDone();

              frames++;
              const now = performance.now();
              const elapsed = now - startTime;

              if (elapsed >= 200) { 
                  const N = matrixSize;
                  const operationsPerDispatch = 2 * N * N * N;
                  const totalOps = operationsPerDispatch * frames;
                  const seconds = elapsed / 1000;
                  const gflopsVal = (totalOps / seconds) / 1e9;
                  
                  setGflops(gflopsVal);
                  setPeakGflops(prev => Math.max(prev, gflopsVal));
                  updateGraph(gflopsVal);

                  startTime = now;
                  frames = 0;
              }
              animRef.current = requestAnimationFrame(webgpuLoop);
          };
          animRef.current = requestAnimationFrame(webgpuLoop);

      } else if (backend === 'webgl') {
          const ok = initWebGL();
          if (!ok) {
              console.error("WebGL initialization failed");
              setIsRunning(false);
              isRunningRef.current = false;
              return;
          }
          
          const iterations = Math.max(128, Math.floor(matrixSize / 2));
          
          const webglLoop = () => {
              if (!isRunningRef.current) return;
              
              const now = performance.now();
              renderWebGLFrame(now, iterations);
              
              frames++;
              const elapsed = now - startTime;
              
              if (elapsed >= 200) {
                  const opsPerFrame = 600 * 256 * iterations * 40;
                  const totalOps = opsPerFrame * frames;
                  const seconds = elapsed / 1000;
                  const gflopsVal = (totalOps / seconds) / 1e9;
                  
                  setGflops(gflopsVal);
                  setPeakGflops(prev => Math.max(prev, gflopsVal));
                  updateGraph(gflopsVal);
                  
                  startTime = now;
                  frames = 0;
              }
              animRef.current = requestAnimationFrame(webglLoop);
          };
          animRef.current = requestAnimationFrame(webglLoop);

      } else if (backend === 'cpu') {
          const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
          let numWorkers = 4;
          if (matrixSize === 256) {
              numWorkers = Math.max(1, Math.round(cores * 0.25));
          } else if (matrixSize === 512) {
              numWorkers = Math.max(1, Math.round(cores * 0.50));
          } else if (matrixSize === 1024) {
              numWorkers = Math.max(1, Math.round(cores * 0.75));
          } else {
              numWorkers = cores;
          }
          
          startCpuWorkers(numWorkers);
          setCpuCores(numWorkers);
          
          const cpuLoop = () => {
              if (!isRunningRef.current) return;
              
              const now = performance.now();
              const elapsed = now - startTime;
              
              if (elapsed >= 200) {
                  const totalOps = accumulatedCpuOpsRef.current;
                  accumulatedCpuOpsRef.current = 0;
                  const seconds = elapsed / 1000;
                  const gflopsVal = (totalOps / seconds) / 1e9;
                  
                  setGflops(gflopsVal);
                  setPeakGflops(prev => Math.max(prev, gflopsVal));
                  updateGraph(gflopsVal);
                  
                  startTime = now;
              }
              animRef.current = requestAnimationFrame(cpuLoop);
          };
          animRef.current = requestAnimationFrame(cpuLoop);
      }
  };

  const stability = peakGflops > 0 ? Math.round((gflops / peakGflops) * 100) : 100;

  return (
    <Modal
        title={t.title}
        icon={<Cpu size={24} />}
        onClose={handleClose}
        size="3xl"
    >
        <div className="flex flex-col gap-6 relative">
            {/* Warning Banner */}
            {!isRunning && (
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={18} />
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
                        title="Performance Graph"
                    >
                        <TrendingUp size={14} />
                    </button>
                    <button 
                        onClick={() => setViewMode('visual')}
                        className={`p-1.5 rounded transition-colors ${viewMode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Visualizer"
                    >
                        <Eye size={14} />
                    </button>
                </div>

                {/* Graph Layer */}
                <canvas 
                    ref={canvasRef} 
                    width={600} height={256} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === 'graph' ? 'opacity-100 pointer-events-none' : 'opacity-0'}`} 
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
                                <Activity size={12} /> {t.status_active}
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

            {/* Config & Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intensity & Backend Selection */}
                <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-4">
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
                                setBackend(val as 'webgpu' | 'webgl' | 'cpu');
                                stopTest();
                            }}
                            disabled={isRunning}
                            color="indigo"
                        />
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                            {backend === 'cpu' ? (t.cpu_cores_prefix || "Active Cores:") : t.intensity}
                        </div>
                        <Select 
                            value={matrixSize}
                            options={backend === 'cpu' ? [
                                { id: 256, label: 'Light (25% CPU Cores)' },
                                { id: 512, label: 'Moderate (50% CPU Cores)' },
                                { id: 1024, label: 'Heavy (75% CPU Cores)' },
                                { id: 2048, label: 'Max Saturated (100% CPU Cores)' }
                            ] : [
                                { id: 256, label: 'Low (256x256)' },
                                { id: 512, label: 'Medium (512x512)' },
                                { id: 1024, label: 'High (1024x1024)' },
                                { id: 2048, label: 'Extreme (2048x2048)' }
                            ]}
                            onChange={(val) => setMatrixSize(Number(val))}
                            disabled={isRunning}
                            color="indigo"
                        />
                    </div>

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
                    
                    {/* FP16 Toggle (Only for WebGPU) */}
                    {backend === 'webgpu' && (
                        <label className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${useFp16 ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/50' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'} ${hasFp16Support ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                                    <Microscope size={12} className={useFp16 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'} /> 
                                    {t.use_fp16}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t.fp16_desc}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${useFp16 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={useFp16} 
                                    onChange={(e) => setUseFp16(e.target.checked)} 
                                    disabled={!hasFp16Support || isRunning}
                                    className="opacity-0 w-full h-full absolute cursor-pointer"
                                />
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${useFp16 ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </label>
                    )}
                </div>
                
                {/* Backend Status Details */}
                <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/5 flex flex-col justify-center gap-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Backend Status</div>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                        {backend === 'webgpu' && (
                            <>
                                <Layers size={14} className="text-emerald-600 dark:text-green-400" />
                                {t.backend_webgpu}
                            </>
                        )}
                        {backend === 'webgl' && (
                            <>
                                <Zap size={14} className="text-amber-500 dark:text-amber-400 animate-pulse" />
                                {t.backend_fallback || "Backend: WebGL Graphics"}
                            </>
                        )}
                        {backend === 'cpu' && (
                            <>
                                <Cpu size={14} className="text-indigo-500" />
                                {`Backend: CPU Multi-core Stress (${cpuCores} Threads)`}
                            </>
                        )}
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />
                    
                    {/* Device Info */}
                    <div className="text-[10px] text-slate-500 font-mono break-all leading-tight">
                        {backend === 'cpu' 
                            ? `Logical Processors: ${navigator.hardwareConcurrency || 'Unknown'} | Active Stress Threads: ${cpuCores}` 
                            : adapterName}
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
