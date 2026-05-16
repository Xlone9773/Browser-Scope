
import React, { useState, useRef, useEffect } from 'react';
import { Database, HardDrive, Play, Square, AlertTriangle, FileText, ArrowRight, Download, Trash2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { formatNumber } from '../utils/formatters';

interface StorageBenchmarkModalProps {
  onClose: () => void;
  t: Translation['storageBenchmark'];
}

type TargetType = 'idb' | 'cache' | 'opfs';
type TestState = 'idle' | 'writing' | 'reading' | 'done';

interface ResultLog {
    id: number;
    timestamp: number;
    op: 'Write' | 'Read';
    target: string;
    size: string;
    chunkSize: string;
    throughput: number; // MB/s
    avgLatency: number; // ms
    peakLatency: number; // ms
    iops?: number;
    duration: number; // ms
}

export const StorageBenchmarkModal: React.FC<StorageBenchmarkModalProps> = ({ onClose, t }) => {
  const [target, setTarget] = useState<TargetType>('idb');
  const [sizeMB, setSizeMB] = useState(10); // 10, 50, 100
  const [chunkSizeKB, setChunkSizeKB] = useState(1024); // 64, 256, 1024, 4096
  const [state, setState] = useState<TestState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [logs, setLogs] = useState<ResultLog[]>([]);
  const [opfsSupported, setOpfsSupported] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Check OPFS Support
  useEffect(() => {
      if (navigator.storage && navigator.storage.getDirectory) {
          setOpfsSupported(true);
      }
  }, []);

  const handleClose = () => {
      if (state !== 'idle' && state !== 'done') {
          if (abortControllerRef.current) abortControllerRef.current.abort();
      }
      onClose();
  };

  const generateData = (size: number): Blob => {
      // Create random-ish data
      const arr = new Uint8Array(size);
      for(let i=0; i<size; i+=1024) arr[i] = i % 255;
      return new Blob([arr]);
  };

  const runTest = async () => {
      if (state === 'writing' || state === 'reading') return;
      
      setState('writing');
      setProgress(0);
      setCurrentSpeed(0);
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const totalBytes = sizeMB * 1024 * 1024;
      const CHUNK_SIZE = chunkSizeKB * 1024;
      const chunks = Math.ceil(totalBytes / CHUNK_SIZE);
      const filename = `bench_${Date.now()}.bin`;

      let writeLatencies: number[] = [];
      let readLatencies: number[] = [];

      try {
          // --- WRITE PHASE ---
          const startWrite = performance.now();
          
          if (target === 'idb') {
              const db = await openDB();
              for(let i=0; i<chunks; i++) {
                  if (signal.aborted) throw new Error("Aborted");
                  const chunk = generateData(CHUNK_SIZE); 
                  
                  const txStart = performance.now();
                  const tx = db.transaction('store', 'readwrite');
                  const store = tx.objectStore('store');

                  await new Promise<void>((resolve, reject) => {
                      const req = store.put({ id: filename, chunk: i, data: chunk });
                      req.onsuccess = () => resolve();
                      req.onerror = () => reject(req.error);
                  });
                  writeLatencies.push(performance.now() - txStart);
                  
                  // Update UI
                  const now = performance.now();
                  const elapsed = (now - startWrite) / 1000;
                  const written = (i + 1) * CHUNK_SIZE;
                  setCurrentSpeed((written / 1024 / 1024) / elapsed);
                  setProgress(((i + 1) / chunks) * 50); // Write is 0-50%
                  
                  // Yield to event loop
                  await new Promise(r => setTimeout(r, 0));
              }
          } 
          else if (target === 'cache') {
              const cache = await caches.open('bench-cache');
              const data = generateData(totalBytes); 
              const response = new Response(data);
              
              const txStart = performance.now();
              await cache.put(filename, response);
              writeLatencies.push(performance.now() - txStart);
              
              await new Promise(r => setTimeout(r, 0));
          } 
          else if (target === 'opfs') {
              const root = await navigator.storage.getDirectory();
              const handle = await root.getFileHandle(filename, { create: true });
              // @ts-ignore
              const writable = await handle.createWritable();
              
              for(let i=0; i<chunks; i++) {
                  if (signal.aborted) throw new Error("Aborted");
                  const chunk = generateData(CHUNK_SIZE);
                  
                  const txStart = performance.now();
                  await writable.write(chunk);
                  writeLatencies.push(performance.now() - txStart);
                  
                  const now = performance.now();
                  const elapsed = (now - startWrite) / 1000;
                  const written = (i + 1) * CHUNK_SIZE;
                  setCurrentSpeed((written / 1024 / 1024) / elapsed);
                  setProgress(((i + 1) / chunks) * 50);
                  
                  await new Promise(r => setTimeout(r, 0));
              }
              await writable.close();
          }

          const endWrite = performance.now();
          const writeDuration = endWrite - startWrite;
          const writeSpeed = (totalBytes / 1024 / 1024) / (writeDuration / 1000);
          
          // Calculate write stats
          const avgWriteLat = writeLatencies.length > 0 ? writeLatencies.reduce((a,b)=>a+b,0)/writeLatencies.length : 0;
          const peakWriteLat = writeLatencies.length > 0 ? Math.max(...writeLatencies) : 0;

          setLogs(prev => [...prev, {
              id: Date.now(),
              timestamp: Date.now(),
              op: 'Write',
              target: target.toUpperCase(),
              size: `${sizeMB} MB`,
              chunkSize: `${chunkSizeKB} KB`,
              throughput: writeSpeed,
              avgLatency: avgWriteLat,
              peakLatency: peakWriteLat,
              duration: writeDuration
          }]);

          setProgress(50);
          setState('reading');

          // --- READ PHASE ---
          const startRead = performance.now();

          if (target === 'idb') {
              const db = await openDB();
              
              for(let i=0; i<chunks; i++) {
                  if (signal.aborted) throw new Error("Aborted");
                  
                  const txStart = performance.now();
                  const tx = db.transaction('store', 'readonly');
                  const store = tx.objectStore('store');

                  await new Promise<void>((resolve, reject) => {
                      const req = store.get([filename, i]);
                      req.onsuccess = () => resolve();
                      req.onerror = () => reject(req.error);
                  });
                  readLatencies.push(performance.now() - txStart);

                  // Update UI
                  const now = performance.now();
                  const elapsed = (now - startRead) / 1000;
                  const read = (i + 1) * CHUNK_SIZE;
                  setCurrentSpeed((read / 1024 / 1024) / elapsed);
                  setProgress(50 + (((i + 1) / chunks) * 50));

                  await new Promise(r => setTimeout(r, 0));
              }
          }
          else if (target === 'cache') {
              const cache = await caches.open('bench-cache');
              const txStart = performance.now();
              const res = await cache.match(filename);
              if (res) await res.blob(); // Read body
              readLatencies.push(performance.now() - txStart);
          }
          else if (target === 'opfs') {
              const root = await navigator.storage.getDirectory();
              const handle = await root.getFileHandle(filename);
              const file = await handle.getFile();
              // Read stream
              const reader = file.stream().getReader();
              let readBytes = 0;
              while(true) {
                  const chunkStart = performance.now();
                  const { done, value } = await reader.read();
                  if (done) break;
                  readLatencies.push(performance.now() - chunkStart); // Approx chunk read time
                  readBytes += value.length;
                  
                  const now = performance.now();
                  const elapsed = (now - startRead) / 1000;
                  if (elapsed > 0.1) setCurrentSpeed((readBytes / 1024 / 1024) / elapsed);
                  setProgress(50 + ((readBytes / totalBytes) * 50));
              }
          }

          const endRead = performance.now();
          const readDuration = endRead - startRead;
          const readSpeed = (totalBytes / 1024 / 1024) / (readDuration / 1000);

          // Calculate read stats
          const avgReadLat = readLatencies.length > 0 ? readLatencies.reduce((a,b)=>a+b,0)/readLatencies.length : 0;
          const peakReadLat = readLatencies.length > 0 ? Math.max(...readLatencies) : 0;

          setLogs(prev => [...prev, {
              id: Date.now() + 1,
              timestamp: Date.now(),
              op: 'Read',
              target: target.toUpperCase(),
              size: `${sizeMB} MB`,
              chunkSize: `${chunkSizeKB} KB`,
              throughput: readSpeed,
              avgLatency: avgReadLat,
              peakLatency: peakReadLat,
              duration: readDuration
          }]);

          setState('done');
          setProgress(100);
          
          // Cleanup
          cleanup(filename, target);

      } catch (e: any) {
          if (e.message !== 'Aborted' && e.name !== 'AbortError') {
              console.error(e);
          }
          setState('idle');
      }
  };

  const stopTest = () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setState('idle');
      setProgress(0);
      setCurrentSpeed(0);
  };

  const handleExportCSV = () => {
      if (logs.length === 0) return;
      
      const headers = "Timestamp,Target,Operation,Size,ChunkSize,Throughput(MB/s),AvgLatency(ms),PeakLatency(ms),Duration(ms)\n";
      const rows = logs.map(log => {
          const time = new Date(log.timestamp).toISOString();
          return `${time},${log.target},${log.op},${log.size},${log.chunkSize},${log.throughput.toFixed(2)},${log.avgLatency.toFixed(2)},${log.peakLatency.toFixed(2)},${log.duration.toFixed(2)}`;
      }).join("\n");
      
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `storage_benchmark_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
      setLogs([]);
  };

  // Helpers
  const openDB = (): Promise<IDBDatabase> => {
      return new Promise((resolve, reject) => {
          const req = indexedDB.open('BrowserScopeBench', 1);
          req.onupgradeneeded = (e: any) => {
              const db = e.target.result;
              if (!db.objectStoreNames.contains('store')) {
                  db.createObjectStore('store', { keyPath: ['id', 'chunk'] });
              }
          };
          req.onsuccess = (e: any) => resolve(e.target.result);
          req.onerror = () => reject(req.error);
      });
  };

  const cleanup = async (filename: string, tgt: TargetType) => {
      try {
          if (tgt === 'idb') {
              const req = indexedDB.deleteDatabase('BrowserScopeBench');
          } else if (tgt === 'cache') {
              caches.delete('bench-cache');
          } else if (tgt === 'opfs') {
              const root = await navigator.storage.getDirectory();
              await root.removeEntry(filename);
          }
      } catch (e) { console.warn("Cleanup failed", e); }
  };

  const formatTime = (ts: number) => {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Modal
        title={t.title}
        icon={<HardDrive size={24} />}
        onClose={handleClose}
        size="3xl"
        fullHeight
    >
        {({ close }) => (
            <div className="flex flex-col h-full p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
                
                {/* Warning */}
                <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-sm text-amber-800 dark:text-amber-200">
                    <AlertTriangle size={18} className="shrink-0" />
                    {t.warning}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    {/* Controls */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 h-fit">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.target_label}</label>
                                <Select 
                                    value={target}
                                    options={[
                                        { id: 'idb', label: t.idb },
                                        { id: 'cache', label: t.cache },
                                        { id: 'opfs', label: opfsSupported ? t.opfs : `${t.opfs} (Unsupported)` }
                                    ]}
                                    onChange={setTarget}
                                    disabled={state === 'writing' || state === 'reading' || (target === 'opfs' && !opfsSupported)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.size_label}</label>
                                <Select 
                                    value={sizeMB}
                                    options={[
                                        { id: 10, label: '10 MB' },
                                        { id: 50, label: '50 MB' },
                                        { id: 100, label: '100 MB' },
                                        { id: 500, label: '500 MB (High Load)' }
                                    ]}
                                    onChange={(val) => setSizeMB(Number(val))}
                                    disabled={state === 'writing' || state === 'reading'}
                                    color="purple"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.chunk_size || "Chunk Size"}</label>
                            <Select 
                                value={chunkSizeKB}
                                options={[
                                    { id: 64, label: t.chunk_size_64 || '64 KB (High IOPS)' },
                                    { id: 256, label: t.chunk_size_256 || '256 KB' },
                                    { id: 1024, label: t.chunk_size_1024 || '1 MB (Balanced)' },
                                    { id: 4096, label: t.chunk_size_4096 || '4 MB (High Throughput)' }
                                ]}
                                onChange={(val) => setChunkSizeKB(Number(val))}
                                disabled={state === 'writing' || state === 'reading'}
                                color="blue"
                            />
                        </div>
                        
                        <button 
                            onClick={state === 'writing' || state === 'reading' ? stopTest : runTest}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                state === 'writing' || state === 'reading'
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                            }`}
                        >
                            {state === 'writing' || state === 'reading' ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                            {state === 'writing' || state === 'reading' ? t.stop : t.start}
                        </button>
                    </div>

                    {/* Gauge Area */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 shadow-inner flex flex-col items-center justify-center p-8 relative overflow-hidden group min-h-[250px]">
                        {/* Speed Text */}
                        <div className="relative z-10 text-center">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                                {state === 'writing' ? t.write : state === 'reading' ? t.read : 'Ready'}
                            </div>
                            <div className="text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-xl">
                                {currentSpeed.toFixed(1)}
                            </div>
                            <div className="text-lg font-medium text-indigo-400 mt-1">{t.mbps}</div>
                        </div>

                        {/* Progress Ring Background */}
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 L100 100 L100 80 L0 80 Z" fill="url(#grad)" />
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Progress Bar at bottom */}
                        <div className="absolute bottom-0 left-0 h-1.5 bg-slate-800 w-full">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={14} />
                            {t.results}
                        </h3>
                        <div className="flex gap-2">
                            {logs.length > 0 && (
                                <>
                                    <button 
                                        onClick={handleExportCSV}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors font-medium"
                                    >
                                        <Download size={12} />
                                        {t.export_csv || "Export"}
                                    </button>
                                    <button 
                                        onClick={handleClearLogs}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors font-medium"
                                    >
                                        <Trash2 size={12} />
                                        {t.clear_logs || "Clear"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 font-semibold w-20">{t.table_time || "Time"}</th>
                                    <th className="px-5 py-3 font-semibold w-24">{t.table_target || "Target"}</th>
                                    <th className="px-5 py-3 font-semibold w-20">{t.table_op || "Type"}</th>
                                    <th className="px-5 py-3 font-semibold w-20">{t.table_chunk || "Chunk"}</th>
                                    <th className="px-5 py-3 font-semibold">{t.table_speed || "Throughput"}</th>
                                    <th className="px-5 py-3 font-semibold text-right">{t.table_latency || t.latency || "Latency (Avg/Peak)"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-400 italic">
                                            No benchmarks run yet.
                                        </td>
                                    </tr>
                                )}
                                {logs.slice().reverse().map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-5 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                                            {formatTime(log.timestamp)}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300">
                                            {log.target}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${log.op === 'Write' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                                                {log.op === 'Write' ? (t.op_write || 'Write') : (t.op_read || 'Read')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                                            {log.chunkSize}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                                                    {formatNumber(log.throughput, 1)}
                                                </span>
                                                <span className="text-xs text-slate-400">MB/s</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right text-xs font-mono">
                                            <span className="text-slate-700 dark:text-slate-300 font-bold">{log.avgLatency.toFixed(1)}</span>
                                            <span className="text-slate-400 mx-1">/</span>
                                            <span className="text-slate-500 dark:text-slate-400">{log.peakLatency.toFixed(1)} ms</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )}
    </Modal>
  );
};
