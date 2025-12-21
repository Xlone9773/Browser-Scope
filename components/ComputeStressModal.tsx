
import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, AlertTriangle, Layers, Play, Square, TrendingUp, Microscope, Eye } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Select } from './ui/Select';
import { MATMUL_SHADER_F32, MATMUL_SHADER_F16 } from './compute/shaders';
import { ParticleSystem } from './compute/ParticleSystem';
import { Modal } from './ui/Modal';

interface ComputeStressModalProps {
  onClose: () => void;
  t: Translation['computeStress'];
}

const HISTORY_LENGTH = 60;

export const ComputeStressModal: React.FC<ComputeStressModalProps> = ({ onClose, t }) => {
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [hasFp16Support, setHasFp16Support] = useState(false);
  const [useFp16, setUseFp16] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [matrixSize, setMatrixSize] = useState(512); 
  const [gflops, setGflops] = useState(0);
  const [peakGflops, setPeakGflops] = useState(0);
  
  const [graphData, setGraphData] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  const [viewMode, setViewMode] = useState<'graph' | 'visual'>('graph');

  // Refs for loop access to avoid dependency churn and memory leaks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const adapterRef = useRef<any>(null);
  const deviceRef = useRef<any>(null);
  const pipelineRef = useRef<any>(null);
  
  const animRef = useRef<number | null>(null); // For WebGPU loop
  const renderLoopRef = useRef<number | null>(null); // For UI render loop
  
  const visualizerRef = useRef<ParticleSystem | null>(null);
  const gflopsRef = useRef(0);
  const peakGflopsRef = useRef(0);
  const graphDataRef = useRef<number[]>([]);

  // Sync state to refs for the animation loop
  useEffect(() => { gflopsRef.current = gflops; }, [gflops]);
  useEffect(() => { peakGflopsRef.current = peakGflops; }, [peakGflops]);
  useEffect(() => { graphDataRef.current = graphData; }, [graphData]);

  const handleClose = () => {
    stopTest();
    onClose();
  };

  // Init WebGPU & Check Features
  useEffect(() => {
    const init = async () => {
        if (!(navigator as any).gpu) {
            setIsWebGPUSupported(false);
            return;
        }
        try {
            const adapter = await (navigator as any).gpu.requestAdapter({ powerPreference: 'high-performance' });
            if (!adapter) {
                setIsWebGPUSupported(false);
                return;
            }
            adapterRef.current = adapter;
            
            // Check for shader-f16 feature
            const features = adapter.features;
            const supportsF16 = features.has('shader-f16');
            setHasFp16Support(supportsF16);
            if (supportsF16) setUseFp16(true); 

            const requiredFeatures = supportsF16 ? ['shader-f16'] : [];
            const device = await adapter.requestDevice({ requiredFeatures });
            deviceRef.current = device;
            
            setIsWebGPUSupported(true);
        } catch (e) {
            console.error("WebGPU Init Error", e);
            setIsWebGPUSupported(false);
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
  // This loop uses Refs to avoid re-binding and memory leaks
  useEffect(() => {
      const loop = () => {
          // Mode 1: Graph
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

          // Mode 2: Visualizer
          // Strictly execute only if viewMode is visual
          else if (viewMode === 'visual' && visualizerCanvasRef.current) {
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
      
      // Start Loop
      renderLoopRef.current = requestAnimationFrame(loop);
      
      // Cleanup previous loop on unmount or mode change
      return () => {
          if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
      };
  }, [viewMode]); // Only restart loop if viewMode changes (isRunning is not needed here as we want graph to persist)

  const updateGraph = (newVal: number) => {
      setGraphData(prev => [...prev.slice(1), newVal]);
  };

  const runTest = async () => {
      if (!deviceRef.current || isRunning) return;
      
      await initPipeline();
      if (!pipelineRef.current) return;

      setIsRunning(true);
      setGflops(0);
      setPeakGflops(0);
      setGraphData(new Array(HISTORY_LENGTH).fill(0));

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

      const USAGE_STORAGE = (window as any).GPUBufferUsage?.STORAGE || 128;

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

      // Compute Loop
      let startTime = performance.now();
      let frames = 0;

      const loop = async () => {
          if (!animRef.current && frames > 0) return; // Stopped

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

          // Update metrics every ~200ms
          if (elapsed >= 200) { 
              // FLOPs for MatMul: 2 * N * N * N
              // N = matrixSize
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

          animRef.current = requestAnimationFrame(loop);
      };

      animRef.current = requestAnimationFrame(loop);
  };

  const stopTest = () => {
      if (animRef.current) {
          cancelAnimationFrame(animRef.current);
          animRef.current = null;
      }
      setIsRunning(false);
  };

  // Calculate Stability
  const stability = peakGflops > 0 ? Math.round((gflops / peakGflops) * 100) : 100;

  return (
    <Modal
        title={t.title}
        icon={<Cpu size={24} />}
        onClose={handleClose}
        size="3xl"
        className="bg-slate-950 border border-indigo-900/50" // Dark theme override
    >
        <div className="flex flex-col gap-6 relative">
            {/* Warning Banner */}
            {!isRunning && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-amber-200 text-xs leading-relaxed font-mono">
                        {t.warning}
                    </p>
                </div>
            )}

            {/* Main Visualizer Area */}
            <div className="h-64 bg-black rounded-xl border border-indigo-900/50 relative overflow-hidden shadow-inner flex flex-col">
                
                {/* View Switcher Tabs (Overlay Top Right) */}
                <div className="absolute top-2 right-2 z-30 flex gap-1 bg-black/50 p-1 rounded-lg backdrop-blur-md border border-white/10">
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
                
                {/* Visualizer Layer */}
                <canvas 
                    ref={visualizerCanvasRef} 
                    width={600} height={256} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === 'visual' ? 'opacity-100' : 'opacity-0'}`} 
                />
                
                {/* Metrics Overlay (Always visible) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 flex-col">
                    <div className="text-center mix-blend-difference">
                        <div className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl glitch-effect">
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
                    {isRunning && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs font-bold text-red-400 animate-pulse">
                            <Activity size={12} /> {t.status_active}
                        </div>
                    )}
                </div>
            </div>

            {/* Config & Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intensity & FP16 Toggle */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                    <div>
                        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">{t.intensity}</div>
                        <Select 
                            value={matrixSize}
                            options={[
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
                    
                    {/* FP16 Toggle */}
                    <label className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${useFp16 ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700'} ${hasFp16Support ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Microscope size={12} /> {t.use_fp16}
                            </span>
                            <span className="text-[10px] text-slate-400">{t.fp16_desc}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${useFp16 ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                            <input 
                                type="checkbox" 
                                checked={useFp16} 
                                onChange={(e) => setUseFp16(e.target.checked)} 
                                disabled={!hasFp16Support || isRunning}
                                className="opacity-0 w-full h-full absolute cursor-pointer"
                            />
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${useFp16 ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                    </label>
                </div>
                
                {/* Backend Status */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col justify-center gap-2">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Backend Status</div>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        {isWebGPUSupported === true && (
                            <>
                                <Layers size={14} className="text-green-400" />
                                {t.backend_webgpu}
                            </>
                        )}
                        {isWebGPUSupported === false && (
                            <>
                                <AlertTriangle size={14} className="text-amber-400" />
                                {t.error_webgpu}
                            </>
                        )}
                        {isWebGPUSupported === null && <Activity size={14} className="animate-spin text-slate-500" />}
                    </div>

                    <div className="h-px bg-white/10 my-1" />
                    
                    {/* Device Info */}
                    <div className="text-[10px] text-slate-500 font-mono break-all">
                        {adapterRef.current ? adapterRef.current.name : 'Checking GPU...'}
                    </div>
                </div>
            </div>

            {/* Main Button */}
            <button 
                onClick={isRunning ? stopTest : runTest}
                disabled={isWebGPUSupported === false}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group ${
                    isRunning 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/30' 
                    : isWebGPUSupported === false 
                        ? 'bg-slate-700 cursor-not-allowed opacity-50'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
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
                        <Zap size={16} className={`${isWebGPUSupported ? 'text-yellow-300' : 'text-slate-400'}`} />
                    </>
                )}
            </button>

        </div>
    </Modal>
  );
};
