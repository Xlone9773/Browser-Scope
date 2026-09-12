import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HardDrive, Play, Square, AlertTriangle, FileText, Download, Trash2, Cpu, Sparkles, RefreshCw, CheckCircle2, Database } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { formatNumber } from '../utils/formatters';
import { useStorageCleanup } from '../hooks/useStorageCleanup';
import { useToast } from '../hooks/useToast';
import { Spinner } from './ui/Spinner';

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
  const [sizeMB, setSizeMB] = useState(10); // 10, 50, 100, 500
  const [chunkSizeKB, setChunkSizeKB] = useState(1024); // 64, 256, 1024, 4096
  const [state, setState] = useState<TestState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [logs, setLogs] = useState<ResultLog[]>([]);
  const [opfsSupported] = useState(() => {
    return typeof window !== 'undefined' && navigator.storage && typeof navigator.storage.getDirectory === 'function';
  });
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const toast = useToast();
  const { isCleaning, isScanning, residueSummary, storageUsage, scanResidues, clearResidues } = useStorageCleanup();

  const workerRef = useRef<Worker | null>(null);

  const stopTest = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' });
    } else {
      setState('idle');
      setProgress(0);
      setCurrentSpeed(0);
    }
  }, []);

  const handleClose = () => {
    stopTest();
    onClose();
  };

  const handleManualCleanup = async (targetToClean: 'all' | 'idb' | 'cache' | 'opfs' = 'all') => {
    if (state === 'writing' || state === 'reading') {
      return;
    }
    try {
      const result = await clearResidues(targetToClean);
      if (result.success) {
        if (result.cleanedItems > 0) {
          toast.success(t.cleanup_success);
        } else {
          toast.info(t.no_residues_found);
        }
      } else {
        toast.error(result.error || t.cleanup_error);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : t.cleanup_error;
      toast.error(errorMsg);
    }
  };

  const runTest = async () => {
    if (state === 'writing' || state === 'reading') return;

    setState('writing');
    setProgress(0);
    setCurrentSpeed(0);

    // Clean up existing worker if any
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Create the worker
    const worker = new Worker(new URL('../services/storage.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const data = e.data;
      if (data.type === 'progress') {
        setState(data.phase);
        setProgress(data.progress);
        setCurrentSpeed(data.speed);
      } else if (data.type === 'result') {
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now() + (data.op === 'Read' ? 1 : 0),
            timestamp: Date.now(),
            op: data.op,
            target: target.toUpperCase(),
            size: `${sizeMB} MB`,
            chunkSize: `${chunkSizeKB} KB`,
            throughput: data.throughput,
            avgLatency: data.avgLatency,
            peakLatency: data.peakLatency,
            duration: data.duration,
          },
        ]);
      } else if (data.type === 'done') {
        setState('done');
        setProgress(100);
        // Refresh residue status
        scanResidues();
      } else if (data.type === 'stopped') {
        setState('idle');
        setProgress(0);
        setCurrentSpeed(0);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
        // Refresh residue status
        scanResidues();
      } else if (data.type === 'error') {
        console.error('Worker error details:', data.message);
        setState('idle');
        setProgress(0);
        setCurrentSpeed(0);
        // Refresh residue status
        scanResidues();
      }
    };

    worker.postMessage({
      target,
      sizeMB,
      chunkSizeKB,
      origin: window.location.origin,
    });
  };

  // Terminate worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleExportCSV = async () => {
    if (logs.length === 0) return;

    // Add UTF-8 BOM for Excel compatibility
    const headers = '\uFEFFTimestamp,Target,Operation,Size,ChunkSize,Throughput(MB/s),AvgLatency(ms),PeakLatency(ms),Duration(ms)\n';
    const rows = logs
      .map((log) => {
        const time = new Date(log.timestamp).toISOString();
        return `${time},${log.target},${log.op},${log.size},${log.chunkSize},${log.throughput.toFixed(2)},${log.avgLatency.toFixed(2)},${log.peakLatency.toFixed(2)},${log.duration.toFixed(2)}`;
      })
      .join('\n');
    const csvContent = headers + rows;

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(csvContent);
        copied = true;
      }
    } catch {
      // Ignore clipboard error
    }

    try {
      // Attempt standard HTML5 download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `storage_benchmark_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus(copied ? 'Copied & Exported' : 'Exported');
    } catch {
      // Fallback to data URI in new window if download blocked by iframe sandbox
      try {
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        window.open(dataUri, '_blank');
        setExportStatus(copied ? 'Copied to clipboard' : 'Opened in new tab');
      } catch {
        setExportStatus(copied ? 'Copied to clipboard' : 'Export Failed');
      }
    }
    setTimeout(() => setExportStatus(null), 3000);
  };

  const handleClearLogs = () => {
    setLogs([]);
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
      {({ close: _close }) => (
        <div className="flex flex-col h-full p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          {/* Warning & Storage Status Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-sm text-amber-800 dark:text-amber-200 flex-1">
              <AlertTriangle size={18} className="shrink-0" />
              <span>{t.warning}</span>
            </div>

            {/* Manual Residue Cleanup Button & Quick Status */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleManualCleanup('all')}
                disabled={isCleaning || state === 'writing' || state === 'reading'}
                title={t.cleanup_tooltip}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  residueSummary.hasAny
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isCleaning ? (
                  <Spinner size={14} />
                ) : residueSummary.hasAny ? (
                  <Sparkles size={14} className="text-amber-500 animate-pulse" />
                ) : (
                  <Trash2 size={14} />
                )}
                <span>{isCleaning ? t.cleaning : t.cleanup_btn}</span>
                {residueSummary.hasAny && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => scanResidues()}
                disabled={isScanning || isCleaning || state === 'writing' || state === 'reading'}
                title="Rescan storage"
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Controls */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 h-fit">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t.target_label}
                  </label>
                  <Select
                    value={target}
                    options={[
                      { id: 'idb', label: t.idb },
                      { id: 'cache', label: t.cache },
                      { id: 'opfs', label: opfsSupported ? t.opfs : `${t.opfs} (Unsupported)` },
                    ]}
                    onChange={(val) => setTarget(val as TargetType)}
                    disabled={state === 'writing' || state === 'reading' || (target === 'opfs' && !opfsSupported)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t.size_label}
                  </label>
                  <Select
                    value={sizeMB}
                    options={[
                      { id: 10, label: '10 MB' },
                      { id: 50, label: '50 MB' },
                      { id: 100, label: '100 MB' },
                      { id: 500, label: '500 MB (High Load)' },
                    ]}
                    onChange={(val) => setSizeMB(Number(val))}
                    disabled={state === 'writing' || state === 'reading'}
                    color="purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.chunk_size}
                </label>
                <Select
                  value={chunkSizeKB}
                  options={[
                    { id: 64, label: t.chunk_size_64 },
                    { id: 256, label: t.chunk_size_256 },
                    { id: 1024, label: t.chunk_size_1024 },
                    { id: 4096, label: t.chunk_size_4096 },
                  ]}
                  onChange={(val) => setChunkSizeKB(Number(val))}
                  disabled={state === 'writing' || state === 'reading'}
                  color="blue"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={state === 'writing' || state === 'reading' ? stopTest : runTest}
                  className={`flex-1 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    state === 'writing' || state === 'reading'
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  {state === 'writing' || state === 'reading' ? (
                    <Square size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  {state === 'writing' || state === 'reading' ? t.stop : t.start}
                </button>

                <button
                  type="button"
                  onClick={() => handleManualCleanup(target)}
                  disabled={isCleaning || state === 'writing' || state === 'reading'}
                  className="px-3 py-3 rounded-lg font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  title={`${t.cleanup_btn} (${target.toUpperCase()})`}
                >
                  {isCleaning ? <Spinner size={14} /> : <Trash2 size={14} />}
                  <span>{target.toUpperCase()}</span>
                </button>
              </div>

              {/* Live Storage & Residue Diagnostic Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Database size={13} className="text-slate-400" />
                  <span>
                    {t.storage_used}:{' '}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {storageUsage ? storageUsage.formattedUsage : '--'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      residueSummary.idb
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
                    }`}
                  >
                    IDB {residueSummary.idb ? '●' : '✓'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      residueSummary.cache
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
                    }`}
                  >
                    Cache {residueSummary.cache ? '●' : '✓'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      residueSummary.opfs
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
                    }`}
                  >
                    OPFS {residueSummary.opfs ? `(${residueSummary.opfsCount})` : '✓'}
                  </span>
                </div>
              </div>
            </div>

            {/* Gauge Area */}
            <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 shadow-inner flex flex-col items-center justify-center p-8 relative overflow-hidden group min-h-[250px]">
              {/* Web Worker Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] font-medium text-indigo-400 select-none">
                <Cpu size={12} className="animate-spin duration-3000" />
                <span>{t.worker_status}</span>
              </div>

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
              <svg
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
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
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
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
                      {exportStatus ? exportStatus : t.export_csv}
                    </button>
                    <button
                      onClick={handleClearLogs}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg transition-colors font-medium"
                    >
                      <Trash2 size={12} />
                      {t.clear_logs}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold w-20">{t.table_time}</th>
                    <th className="px-5 py-3 font-semibold w-24">{t.table_target}</th>
                    <th className="px-5 py-3 font-semibold w-20">{t.table_op}</th>
                    <th className="px-5 py-3 font-semibold w-20">{t.table_chunk}</th>
                    <th className="px-5 py-3 font-semibold">{t.table_speed}</th>
                    <th className="px-5 py-3 font-semibold text-right">{t.table_latency || t.latency}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400 italic">
                        {'No benchmarks run yet.'}
                      </td>
                    </tr>
                  )}
                  {logs
                    .slice()
                    .reverse()
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                          {formatTime(log.timestamp)}
                        </td>
                        <td className="px-5 py-3 font-bold text-slate-700 dark:text-slate-300">{log.target}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                              log.op === 'Write'
                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            }`}
                          >
                            {log.op === 'Write' ? t.op_write : t.op_read}
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
                          <span className="text-slate-700 dark:text-slate-300 font-bold">
                            {log.avgLatency.toFixed(1)}
                          </span>
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

