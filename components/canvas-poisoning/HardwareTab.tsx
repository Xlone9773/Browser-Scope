// src/components/canvas-poisoning/HardwareTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity, Cpu, HardDrive } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { runHardwareDiagnostic } from './diagnostics';

interface HardwareTabProps {
  t: PoisoningTranslations;
}

interface BenchmarkResult {
  concurrency: number;
  ops: number;
  speedup: number;
}

const workerCode = `
  self.onmessage = function(e) {
    const duration = e.data || 50;
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < duration) {
      ops += Math.sin(ops) + Math.cos(ops);
    }
    self.postMessage(ops);
  };
`;

export const HardwareTab: React.FC<HardwareTabProps> = React.memo(({ t }) => {
  const [hwStatus, setHwStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_hardware_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [hwProgress, setHwProgress] = useState(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_hardware_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [hwLogs, setHwLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_hardware_logs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkResult[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_hardware_benchmarkData');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [detectedCores, setDetectedCores] = useState<number | null>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_hardware_detectedCores');
      return val ? parseInt(val, 10) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_hardware_status', hwStatus);
      sessionStorage.setItem('browserscope_poisoning_hardware_progress', String(hwProgress));
      sessionStorage.setItem('browserscope_poisoning_hardware_logs', JSON.stringify(hwLogs));
      sessionStorage.setItem('browserscope_poisoning_hardware_benchmarkData', JSON.stringify(benchmarkData));
      sessionStorage.setItem('browserscope_poisoning_hardware_detectedCores', detectedCores !== null ? String(detectedCores) : '');
    } catch (e) {
      console.error(e);
    }
  }, [hwStatus, hwProgress, hwLogs, benchmarkData, detectedCores]);

  const addHwLog = useCallback((msg: string) => {
    setHwLogs((prev) => [...prev, msg]);
  }, []);

  const runHardwareTest = async () => {
    setHwStatus('running');
    setHwProgress(0);
    setHwLogs([]);
    setBenchmarkData([]);
    setDetectedCores(null);

    const result = await runHardwareDiagnostic(
      t,
      addHwLog,
      setHwProgress,
      setBenchmarkData,
      setDetectedCores
    );
    setHwStatus(result.status);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Intro info box */}
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.hardware_detection_title || 'Core Hardware Configuration & Multithreading Inflection Point Probing'}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.hardware_detection_desc}
          </p>
        </div>
      </div>

      {/* Grid showing declared specifications */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Cpu size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block">{t.hardware_cores || 'Declared CPU Cores'}</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{navigator.hardwareConcurrency || (t.hardware_unknown_spec || 'Unknown')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <HardDrive size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block">{t.hardware_memory || 'Declared Memory'}</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {(navigator as unknown as { deviceMemory?: number }).deviceMemory ? `${(navigator as unknown as { deviceMemory?: number }).deviceMemory} ${t.hardware_memory_gb || 'GB'}` : (t.hardware_unknown_spec || 'Unknown')}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart of the Speedup Curve */}
      {benchmarkData.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
            <Activity size={14} className="text-indigo-500" />
            {t.hardware_benchmark_result || 'Web Worker Multithreading Concurrency Throughput (Relative Speedup Curve)'}
          </h5>
          <div className="space-y-3">
            {benchmarkData.map((data) => {
              // Calculate width percentage based on speedup vs ideal linear scale or max speedup
              const percentage = Math.max(5, Math.min(100, (data.speedup / 12) * 100));
              const realCores = navigator.hardwareConcurrency || 4;
              const isOverDeclaredCores = data.concurrency > realCores;

              return (
                <div key={data.concurrency} className="flex items-center gap-3 text-xs">
                  <div className="w-12 text-right font-medium text-slate-500 dark:text-slate-400 shrink-0">
                    {data.concurrency} {t.hardware_thrs || 'Thrs'}
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-5 rounded-md overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${
                        isOverDeclaredCores && data.speedup > realCores * 1.15
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500' // highlights spoofing
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="absolute inset-y-0 left-2.5 flex items-center font-mono text-[10px] text-slate-700 dark:text-slate-300 font-semibold drop-shadow-sm">
                      {(t.hardware_speedup_label || '{speedup}x speedup').replace('{speedup}', data.speedup.toFixed(2))}
                    </span>
                  </div>
                  <div className="w-24 text-right font-mono text-[10px] text-slate-400 truncate">
                    {(t.hardware_ops_label || '{ops} ops').replace('{ops}', data.ops.toLocaleString())}
                  </div>
                </div>
              );
            })}
          </div>
          {detectedCores !== null && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t.hardware_detected_saturation || 'Benchmark Detected Saturation Core Count:'}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                {(t.hardware_physical_cores || '~{cores} Physical Cores').replace('{cores}', String(detectedCores))}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Logs and Terminal Output */}
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-48 overflow-y-auto border border-slate-700 shadow-inner">
        {hwLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {hwLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      {/* Bottom control bar with Status */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            hwStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            hwStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            hwStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {hwStatus === 'idle' ? t.status_idle : 
             hwStatus === 'running' ? t.status_running : 
             hwStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runHardwareTest} disabled={hwStatus === 'running'} leftIcon={hwStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {hwStatus === 'running' ? `${t.testing} (${hwProgress}%)` : (t.run_hardware_test || 'Run Hardware Test')}
        </Button>
      </div>
    </div>
  );
});

HardwareTab.displayName = 'HardwareTab';
