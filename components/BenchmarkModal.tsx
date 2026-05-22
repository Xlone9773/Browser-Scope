
import React, { useState, useEffect, useRef } from 'react';
import { Play, Cpu, Zap, Activity, Code, Box, Image as ImageIcon, Calculator, Database, RotateCw, Loader2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Modal } from './ui/Modal';

interface BenchmarkModalProps {
  onClose: () => void;
  t: Translation['benchmarkModal'];
}

type TestStatus = 'pending' | 'running' | 'done';

interface TestItem {
    id: 'cpu' | 'math' | 'memory' | 'dom' | 'gpu' | 'storage';
    name: string;
    icon: React.ElementType;
    status: TestStatus;
    score: number | null;
    details?: string;
}

// Configuration for tests - Multipliers scaled up for 6-digit scores
const TEST_CONFIG = {
    // Target: ~50k-100k per test for a total of ~300k-600k
    cpu: { primeMax: 150000, multiplier: 12000000 }, 
    math: { ops: 2000000, multiplier: 15000000 },    
    memory: { size: 4000000, multiplier: 18000000 }, 
    dom: { elements: 4000, multiplier: 10000000 },   
    gpu: { rects: 3000, multiplier: 15000000 },      
    storage: { writes: 200, multiplier: 40000000 }   
};

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ onClose, t }) => {
  // 'idle' | 'running' | 'done'
  const [globalStatus, setGlobalStatus] = useState<'idle' | 'running' | 'done'>('idle');
  // 'all' = running full suite, 'single' = running one specific test
  const [runningMode, setRunningMode] = useState<'all' | 'single' | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const isRunningRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const workerCode = `
      self.onmessage = function(e) {
          const { id, config } = e.data;
          const start = performance.now();
          
          try {
              if (id === 'cpu') {
                  let count = 0;
                  const max = config.primeMax;
                  for (let i = 2; i <= max; i++) {
                      let isPrime = true;
                      const limit = Math.sqrt(i);
                      for (let j = 2; j <= limit; j++) {
                          if (i % j === 0) { isPrime = false; break; }
                      }
                      if (isPrime) count++;
                  }
                  const duration = Math.max(performance.now() - start, 1);
                  const score = Math.floor(config.multiplier / duration);
                  const details = count + ' primes (' + duration.toFixed(0) + 'ms)';
                  self.postMessage({ id, score, details, success: true });
              } else if (id === 'math') {
                  const ops = config.ops;
                  for (let i = 0; i < ops; i++) {
                      Math.sqrt(i) * Math.sin(i) * Math.cos(i);
                  }
                  const duration = Math.max(performance.now() - start, 1);
                  const score = Math.floor(config.multiplier / duration);
                  const details = (ops/1000000).toFixed(1) + 'M ops (' + duration.toFixed(0) + 'ms)';
                  self.postMessage({ id, score, details, success: true });
              } else if (id === 'memory') {
                  const size = config.size;
                  const arr = new Uint32Array(size);
                  // Write
                  for(let i=0; i<size; i++) arr[i] = i;
                  // Read/Write Sparse
                  for(let i=0; i<size; i+=8) arr[i] = arr[size - 1 - i];
                  arr.reverse();
                  
                  const duration = Math.max(performance.now() - start, 1);
                  const mbProcessed = (size * 4 * 2.5) / (1024 * 1024); 
                  const throughput = (mbProcessed / (duration / 1000)).toFixed(0);
                  const score = Math.floor(config.multiplier / duration);
                  const details = throughput + ' MB/s (' + duration.toFixed(0) + 'ms)';
                  self.postMessage({ id, score, details, success: true });
              }
          } catch (err) {
              self.postMessage({ id, success: false, error: err.message });
          }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const [tests, setTests] = useState<TestItem[]>([
      { id: 'cpu', name: t.cpu_test, icon: Cpu, status: 'pending', score: null },
      { id: 'math', name: t.math_test, icon: Calculator, status: 'pending', score: null },
      { id: 'memory', name: t.memory_test, icon: Box, status: 'pending', score: null },
      { id: 'dom', name: t.dom_test, icon: Code, status: 'pending', score: null },
      { id: 'gpu', name: t.gpu_test, icon: ImageIcon, status: 'pending', score: null },
      { id: 'storage', name: t.storage_test, icon: Database, status: 'pending', score: null }
  ]);

  const handleClose = () => {
    if (isRunningRef.current) return; // Prevent closing while running
    onClose();
  };

  const updateTestState = (id: string, updates: Partial<TestItem>) => {
      setTests(prev => prev.map(test => 
          test.id === id ? { ...test, ...updates } : test
      ));
  };

  // Recalculate total score based on SUM of all completed tests
  const recalcTotalScore = (currentTests: TestItem[]) => {
      const completed = currentTests.filter(t => t.score !== null);
      if (completed.length === 0) return 0;
      // Summation logic for bigger, more satisfying numbers
      const sum = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
      return sum;
  };

  // --- Core Benchmark Logic ---
  const runBenchmarkTask = async (id: TestItem['id']): Promise<{score: number, details: string}> => {
      await new Promise(r => setTimeout(r, 50)); // UI Breath
      
      const start = performance.now();
      let score = 0;
      let details = "";

      try {
          switch (id) {
              case 'cpu':
              case 'math':
              case 'memory': {
                  if (!workerRef.current) {
                      throw new Error("Web Worker not initialized");
                  }
                  const resultPlan = await new Promise<{score: number, details: string}>((resolve, reject) => {
                      const worker = workerRef.current;
                      if (!worker) {
                          resolve({ score: 0, details: "No worker active" });
                          return;
                      }
                      
                      const handleMessage = (e: MessageEvent) => {
                          if (e.data.id === id) {
                              worker.removeEventListener('message', handleMessage);
                              if (e.data.success) {
                                  resolve({ score: e.data.score, details: e.data.details });
                              } else {
                                  reject(new Error(e.data.error || "Web Worker execution failed"));
                              }
                          }
                      };
                      
                      worker.addEventListener('message', handleMessage);
                      worker.postMessage({ id, config: TEST_CONFIG[id] });
                  });
                  score = resultPlan.score;
                  details = resultPlan.details;
                  break;
              }
              case 'dom': {
                  const count = TEST_CONFIG.dom.elements;
                  const container = document.createElement('div');
                  container.style.display = 'none';
                  document.body.appendChild(container);
                  const fragment = document.createDocumentFragment();

                  // Create
                  for(let i=0; i<count; i++) {
                      const el = document.createElement('div');
                      el.textContent = 'benchmark';
                      fragment.appendChild(el);
                  }
                  container.appendChild(fragment);
                  
                  // Read/Modify
                  const children = container.children;
                  for(let i=0; i<children.length; i+=2) {
                      (children[i] as HTMLElement).style.color = 'red';
                  }

                  // Clear
                  container.innerHTML = '';
                  document.body.removeChild(container);

                  const duration = Math.max(performance.now() - start, 1);
                  score = Math.floor(TEST_CONFIG.dom.multiplier / duration);
                  details = `${count} Nodes (${duration.toFixed(0)}ms)`;
                  break;
              }
              case 'gpu': {
                  const rects = TEST_CONFIG.gpu.rects;
                  const canvas = document.createElement('canvas');
                  canvas.width = 800; 
                  canvas.height = 600;
                  const ctx = canvas.getContext('2d', { alpha: false }); 
                  if (!ctx) throw new Error("No Context");

                  for(let i=0; i<rects; i++) {
                      ctx.fillStyle = `rgba(${i%255},${(i*5)%255},${(i*10)%255},0.5)`;
                      ctx.fillRect(Math.random()*800, Math.random()*600, 60, 60);
                      ctx.beginPath();
                      ctx.arc(Math.random()*800, Math.random()*600, 20, 0, Math.PI*2);
                      ctx.fill();
                  }
                  
                  const duration = Math.max(performance.now() - start, 1);
                  score = Math.floor(TEST_CONFIG.gpu.multiplier / duration);
                  details = `Canvas Render (${duration.toFixed(0)}ms)`;
                  break;
              }
              case 'storage': {
                  const writes = TEST_CONFIG.storage.writes;
                  const dbName = `bench_db_${Date.now()}_${Math.random()}`;
                  
                  await new Promise<void>((resolve, reject) => {
                      const req = indexedDB.open(dbName, 1);
                      req.onupgradeneeded = (e: any) => {
                          e.target.result.createObjectStore('store');
                      };
                      req.onsuccess = (e: any) => {
                          const db = e.target.result;
                          const tx = db.transaction('store', 'readwrite');
                          const store = tx.objectStore('store');
                          
                          for(let i=0; i<writes; i++) {
                              store.add({ id: i, payload: 'x'.repeat(2048) }, i);
                          }
                          
                          tx.oncomplete = () => {
                              db.close();
                              indexedDB.deleteDatabase(dbName);
                              resolve();
                          };
                          tx.onerror = () => reject();
                      };
                      req.onerror = () => reject();
                  });

                  const duration = Math.max(performance.now() - start, 1);
                  const iops = (writes / (duration/1000)).toFixed(0);
                  score = Math.floor(TEST_CONFIG.storage.multiplier / duration);
                  details = `${iops} IOPS (${duration.toFixed(0)}ms)`;
                  break;
              }
          }
      } catch (e) {
          console.error(e);
          return { score: 0, details: "Failed" };
      }

      return { score, details };
  };

  const handleRunSingle = async (id: TestItem['id']) => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      
      setGlobalStatus('running');
      setRunningMode('single');
      updateTestState(id, { status: 'running', details: 'Running...' });

      const result = await runBenchmarkTask(id);
      
      setTests(prev => {
          const newTests = prev.map(t => t.id === id ? { ...t, status: 'done' as const, score: result.score, details: result.details } : t);
          setTotalScore(recalcTotalScore(newTests));
          return newTests;
      });

      setGlobalStatus('done');
      setRunningMode(null);
      isRunningRef.current = false;
  };

  const handleRunAll = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      setGlobalStatus('running');
      setRunningMode('all');
      setTotalScore(0);
      setProgress(0);

      // Reset
      setTests(prev => prev.map(t => ({ ...t, status: 'pending', score: null, details: undefined })));

      for (let i = 0; i < tests.length; i++) {
          const test = tests[i];
          updateTestState(test.id, { status: 'running', details: 'Running...' });
          
          const result = await runBenchmarkTask(test.id);
          
          setTests(prev => {
              const updated = prev.map(t => t.id === test.id ? { ...t, status: 'done' as const, score: result.score, details: result.details } : t);
              setTotalScore(recalcTotalScore(updated));
              return updated;
          });

          setProgress(Math.round(((i + 1) / tests.length) * 100));
      }

      setGlobalStatus('done');
      setRunningMode(null);
      isRunningRef.current = false;
  };

  return (
    <Modal
        title={t.title}
        icon={<Activity size={24} />}
        onClose={handleClose}
        size="lg"
    >
        <div className="flex flex-col items-center">
            {/* Gauge / Score Circle */}
            <div className="relative w-52 h-52 mb-8 shrink-0">
                {/* Rotated SVG for the ring */}
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    <defs>
                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                    {/* Background Ring */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-700" />
                    
                    {/* Progress Ring */}
                    {runningMode !== 'single' && (
                        <circle 
                            cx="100" cy="100" r="90" 
                            fill="none" 
                            stroke="url(#score-gradient)" 
                            strokeWidth="6" 
                            strokeLinecap="round" 
                            strokeDasharray={2 * Math.PI * 90}
                            strokeDashoffset={2 * Math.PI * 90 * (1 - (runningMode === 'all' ? progress : (totalScore > 0 ? 100 : 0)) / 100)}
                            className="transition-all duration-300 ease-out"
                        />
                    )}

                    {/* Spinner Ring for Single Test */}
                    {runningMode === 'single' && (
                        <circle 
                            cx="100" cy="100" r="90" 
                            fill="none" 
                            stroke="url(#score-gradient)" 
                            strokeWidth="6" 
                            strokeLinecap="round" 
                            strokeDasharray={2 * Math.PI * 90 * 0.25} 
                            className="animate-[spin_1.5s_linear_infinite]"
                        />
                    )}
                </svg>
                
                {/* TEXT CONTAINER - No Rotation Here! */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {runningMode === 'single' ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Activity size={32} className="text-indigo-500 mb-2" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Running...</span>
                        </div>
                    ) : runningMode === 'all' ? (
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                        </div>
                    ) : totalScore > 0 ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            {/* Vertical text layout for score */}
                            <span className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter" style={{writingMode: 'horizontal-tb'}}>
                                {formatNumber(totalScore)}
                            </span>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{t.score}</div>
                        </div>
                    ) : (
                        <Zap size={48} className="text-slate-200 dark:text-slate-600" />
                    )}
                </div>
            </div>

            {/* Web Worker Performance Accent */}
            <div className="flex items-center gap-2 mb-6 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/40 rounded-full text-[11px] font-medium text-indigo-600 dark:text-indigo-400 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>{t.worker_status}</span>
            </div>

            {/* Test List */}
            <div className="w-full space-y-3 mb-6">
                {tests.map((test) => (
                    <div key={test.id} className="group flex flex-col p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl transition-all hover:border-slate-200 dark:hover:border-slate-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${
                                    test.status === 'running' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' :
                                    test.status === 'done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    'bg-white dark:bg-slate-800 text-slate-400'
                                }`}>
                                    <test.icon size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-semibold ${test.status === 'pending' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {test.name}
                                    </span>
                                    {test.details && (
                                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px] sm:max-w-xs">{test.details}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {test.score !== null && (
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
                                        {formatNumber(test.score)}
                                    </span>
                                )}
                                
                                {test.status === 'running' ? (
                                    <Loader2 size={16} className="text-indigo-500 animate-spin" />
                                ) : (
                                    <button 
                                        onClick={() => handleRunSingle(test.id)}
                                        disabled={globalStatus === 'running'}
                                        className={`p-1.5 rounded-md transition-all ${
                                            test.status === 'done' 
                                            ? 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30' 
                                            : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                        } disabled:opacity-0 cursor-pointer`}
                                        title="Run single test"
                                    >
                                        {test.status === 'done' ? <RotateCw size={14} /> : <Play size={14} fill="currentColor" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Action Button */}
            <button 
                onClick={handleRunAll}
                disabled={globalStatus === 'running'}
                className={`
                    w-full py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2
                    ${globalStatus === 'running' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95'}
                `}
            >
                {globalStatus === 'running' ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        {t.running}
                    </>
                ) : (
                    <>
                        <Zap size={20} fill="currentColor" />
                        {t.start_btn}
                    </>
                )}
            </button>
            
        </div>
    </Modal>
  );
};
