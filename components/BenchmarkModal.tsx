
import React, { useState, useEffect } from 'react';
import { X, Play, Cpu, Zap, Activity, Code, Box, Image as ImageIcon, Calculator, CheckCircle2, Loader2, Hourglass, Database } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

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
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mainStatus, setMainStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  
  const [tests, setTests] = useState<TestItem[]>([
      { id: 'cpu', name: t.cpu_test, icon: Cpu, status: 'pending', score: null },
      { id: 'math', name: t.math_test, icon: Calculator, status: 'pending', score: null },
      { id: 'memory', name: t.memory_test, icon: Box, status: 'pending', score: null },
      { id: 'dom', name: t.dom_test, icon: Code, status: 'pending', score: null },
      { id: 'gpu', name: t.gpu_test, icon: ImageIcon, status: 'pending', score: null },
      { id: 'storage', name: t.storage_test, icon: Database, status: 'pending', score: null }
  ]);

  useEffect(() => {
    // Increased delay to ensure animation triggers correctly
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const updateTestStatus = (id: string, status: TestStatus, score: number | null = null) => {
      setTests(prev => prev.map(test => 
          test.id === id ? { ...test, status, score } : test
      ));
  };

  const runBenchmark = async () => {
      setMainStatus('running');
      setProgress(0);
      setTotalScore(0);
      
      // Reset tests
      setTests(prev => prev.map(t => ({...t, status: 'pending', score: null})));

      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

      // 1. CPU Prime Test
      updateTestStatus('cpu', 'running');
      await wait(100);
      const startCPU = performance.now();
      let count = 0;
      for (let i = 2; i <= 200000; i++) {
          let isPrime = true;
          for (let j = 2; j <= Math.sqrt(i); j++) {
              if (i % j === 0) { isPrime = false; break; }
          }
          if (isPrime) count++;
      }
      const endCPU = performance.now();
      const cpuScore = Math.min(Math.round(200000 / (endCPU - startCPU) * 10), 2000);
      updateTestStatus('cpu', 'done', cpuScore);
      setProgress(16);

      // 2. Math Operations
      updateTestStatus('math', 'running');
      await wait(50);
      const startMath = performance.now();
      for (let i = 0; i < 2000000; i++) {
          Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      }
      const endMath = performance.now();
      const mathScore = Math.min(Math.round(300000 / (endMath - startMath) * 10), 2000);
      updateTestStatus('math', 'done', mathScore);
      setProgress(32);

      // 3. Memory Array Ops
      updateTestStatus('memory', 'running');
      await wait(50);
      const startMem = performance.now();
      const arr = new Uint32Array(5000000);
      for(let i=0; i<arr.length; i++) arr[i] = i;
      // Reverse
      for(let i=0; i<arr.length/2; i++) {
          const temp = arr[i];
          arr[i] = arr[arr.length-1-i];
          arr[arr.length-1-i] = temp;
      }
      const endMem = performance.now();
      const memScore = Math.min(Math.round(400000 / (endMem - startMem) * 10), 2000);
      updateTestStatus('memory', 'done', memScore);
      setProgress(48);

      // 4. DOM Operations
      updateTestStatus('dom', 'running');
      await wait(50);
      const startDom = performance.now();
      const container = document.createElement('div');
      for(let i=0; i<5000; i++) {
          const div = document.createElement('div');
          div.textContent = 'test';
          container.appendChild(div);
      }
      // Remove
      while(container.firstChild) {
          container.removeChild(container.firstChild);
      }
      const endDom = performance.now();
      const domScore = Math.min(Math.round(150000 / (endDom - startDom) * 10), 2000);
      updateTestStatus('dom', 'done', domScore);
      setProgress(64);

      // 5. GPU Canvas Render
      updateTestStatus('gpu', 'running');
      await wait(50);
      const startGpu = performance.now();
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          for(let i=0; i<2000; i++) {
              ctx.fillStyle = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
              ctx.fillRect(Math.random()*800, Math.random()*600, 50, 50);
          }
      }
      const endGpu = performance.now();
      const gpuScore = Math.min(Math.round(250000 / (endGpu - startGpu) * 10), 2000);
      updateTestStatus('gpu', 'done', gpuScore);
      setProgress(80);

      // 6. Storage I/O (IndexedDB)
      updateTestStatus('storage', 'running');
      await wait(50);
      let storageScore = 0;
      try {
          const startStorage = performance.now();
          const dbName = 'bench_db_' + Date.now();
          await new Promise<void>((resolve, reject) => {
              const req = indexedDB.open(dbName, 1);
              req.onupgradeneeded = (e: any) => {
                  const db = e.target.result;
                  db.createObjectStore('store');
              };
              req.onsuccess = (e: any) => {
                  const db = e.target.result;
                  const tx = db.transaction('store', 'readwrite');
                  const store = tx.objectStore('store');
                  for(let i=0; i<500; i++) {
                      store.add(new Array(1000).fill('a').join(''), i);
                  }
                  tx.oncomplete = () => {
                      db.close();
                      const deleteReq = indexedDB.deleteDatabase(dbName);
                      deleteReq.onsuccess = () => resolve();
                      deleteReq.onerror = () => resolve(); // proceed anyway
                  };
                  tx.onerror = () => reject();
              };
              req.onerror = () => reject();
          });
          const endStorage = performance.now();
          storageScore = Math.min(Math.round(5000 / (endStorage - startStorage) * 100), 2000);
          updateTestStatus('storage', 'done', storageScore);
      } catch(e) {
          console.error("Storage benchmark failed", e);
          updateTestStatus('storage', 'done', 0);
      }
      setProgress(100);

      // Finalize
      const total = Math.round((cpuScore + mathScore + memScore + domScore + gpuScore + storageScore) / 6 * 10);
      setTotalScore(total);
      setMainStatus('done');
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center max-h-[75vh] overflow-y-auto">
            {/* Improved Gauge / Score Circle */}
            <div className="relative w-48 h-48 mb-6 shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                    <defs>
                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo 500 */}
                            <stop offset="100%" stopColor="#a855f7" /> {/* Purple 500 */}
                        </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
                    <circle 
                        cx="100" cy="100" r="90" 
                        fill="none" 
                        stroke="url(#score-gradient)" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeDasharray={2 * Math.PI * 90}
                        strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {mainStatus === 'done' ? (
                        <>
                            <span className="text-5xl font-black text-slate-800 dark:text-white tracking-tight animate-in fade-in zoom-in duration-300">{totalScore}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">PTS</span>
                        </>
                    ) : (
                        <Zap size={48} className={`text-indigo-500 ${mainStatus === 'running' ? 'animate-pulse' : ''}`} />
                    )}
                </div>
            </div>

            {/* Test List */}
            <div className="w-full space-y-3 mb-6">
                {tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                test.status === 'running' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' :
                                test.status === 'done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                'bg-white dark:bg-slate-800 text-slate-400'
                            }`}>
                                <test.icon size={18} />
                            </div>
                            <span className={`text-sm font-medium ${test.status === 'pending' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                {test.name}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {test.score !== null && (
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
                                    {test.score}
                                </span>
                            )}
                            
                            {test.status === 'pending' && <Hourglass size={16} className="text-slate-300" />}
                            {test.status === 'running' && <Loader2 size={16} className="text-indigo-500 animate-spin" />}
                            {test.status === 'done' && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </div>
                    </div>
                ))}
            </div>

            {mainStatus !== 'running' && (
                <button 
                    onClick={runBenchmark}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Play size={20} fill="currentColor" />
                    {mainStatus === 'idle' ? t.start_btn : t.start_btn}
                </button>
            )}
            
            {mainStatus === 'running' && (
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse py-2">
                    {t.running}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
