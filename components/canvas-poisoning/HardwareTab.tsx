// src/components/canvas-poisoning/HardwareTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity, Cpu, HardDrive } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { isHooked } from './utils';

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

    addHwLog(t.testing_hardware || 'Initializing Core Hardware Spec & Concurrency Detection...');
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    setHwProgress(5);

    let isPoisoned = false;

    // 1. Hook detection on hardwareConcurrency and deviceMemory
    try {
      const hcProto = Object.getPrototypeOf(navigator);
      const isHcHooked = isHooked(Object.getOwnPropertyDescriptor(hcProto, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown) ||
                          isHooked(Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown);
      const isDmHooked = isHooked(Object.getOwnPropertyDescriptor(hcProto, 'deviceMemory')?.get as unknown as (...args: never[]) => unknown) ||
                          isHooked(Object.getOwnPropertyDescriptor(navigator, 'deviceMemory')?.get as unknown as (...args: never[]) => unknown);
      if (isHcHooked || isDmHooked) {
        isPoisoned = true;
        addHwLog(t.hardware_concurrency_hooked || '❌ Suspicious Proxy/Hook detected on hardwareConcurrency or deviceMemory properties.');
      }
    } catch {
      // Ignore
    }

    const declaredCores = navigator.hardwareConcurrency || 1;
    const declaredMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0;

    const unknownText = t.hardware_unknown_spec || 'Unknown';
    const memoryString = declaredMemory ? `${declaredMemory} ${t.hardware_memory_gb || 'GB'}` : unknownText;
    const declaredLog = (t.hardware_declared_specs || '📊 Declared Specs: CPU Cores = {cores}, Memory = {memory}')
      .replace('{cores}', String(declaredCores))
      .replace('{memory}', memoryString);
    addHwLog(declaredLog);
    
    // 2. Concurrency tests using multi-threading Web Workers
    if (!window.Worker) {
      addHwLog(t.hardware_workers_not_supported || '⚠️ Web Workers are not supported in this browser, skipping benchmark.');
      setHwStatus('idle');
      setHwProgress(100);
      return;
    }

    const concurrencyLevels = [1, 2, 4, 8, 12, 16];
    const durationMs = 60; // 60ms duration per run to ensure reliable sampling
    const tempResults: BenchmarkResult[] = [];
    let baseOps = 1;

    // Run parallel worker loads for each concurrency level
    for (let cIdx = 0; cIdx < concurrencyLevels.length; cIdx++) {
      const c = concurrencyLevels[cIdx];
      const stepProgress = 10 + Math.floor((cIdx / concurrencyLevels.length) * 80);
      setHwProgress(stepProgress);

      const levelTemplate = t.hardware_testing_concurrency || 'Benchmarking with Web Worker concurrency: {concurrency}...';
      addHwLog(levelTemplate.replace('{concurrency}', String(c)));

      const runConcurrency = (C: number, duration: number): Promise<number> => {
        return new Promise((resolve) => {
          const workers: Worker[] = [];
          let completedCount = 0;
          let totalOps = 0;
          
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const workerUrl = URL.createObjectURL(blob);
          
          for (let i = 0; i < C; i++) {
            const worker = new Worker(workerUrl);
            worker.onmessage = (e) => {
              totalOps += e.data;
              completedCount++;
              worker.terminate();
              if (completedCount === C) {
                URL.revokeObjectURL(workerUrl);
                resolve(totalOps);
              }
            };
            worker.onerror = () => {
              completedCount++;
              worker.terminate();
              if (completedCount === C) {
                URL.revokeObjectURL(workerUrl);
                resolve(totalOps);
              }
            };
            workers.push(worker);
          }
          
          // Trigger execution
          workers.forEach(w => w.postMessage(duration));
        });
      };

      const ops = await runConcurrency(c, durationMs);
      if (c === 1) {
        baseOps = ops || 1;
      }
      const speedup = ops / baseOps;
      tempResults.push({ concurrency: c, ops, speedup });
      
      const compLog = (t.hardware_concurrency_completed || '   -> Concurrency {concurrency}: Completed {ops} ops, Relative speedup: {speedup}x')
        .replace('{concurrency}', String(c))
        .replace('{ops}', ops.toLocaleString())
        .replace('{speedup}', speedup.toFixed(2));
      addHwLog(compLog);
      await new Promise<void>(resolve => setTimeout(resolve, 30));
    }

    setBenchmarkData(tempResults);
    setHwProgress(90);

    // Inflection point / saturation detection logic
    // We look for the point at which we reach 85% of the max throughput speedup
    const maxSpeedupResult = tempResults.reduce((max, r) => r.speedup > max.speedup ? r : max, tempResults[0]);
    const maxSpeedup = maxSpeedupResult.speedup;
    const threshold = maxSpeedup * 0.82;
    
    let detected = 1;
    for (const r of tempResults) {
      if (r.speedup >= threshold) {
        detected = r.concurrency;
        break;
      }
    }

    // Sometimes the saturation is between levels. If the speedup at 4 is high (e.g. 3.5) and 8 is high (e.g. 6.8), the saturation might be 8.
    // Let's refine based on the real core counts:
    if (detected === 12 && maxSpeedupResult.concurrency === 16 && maxSpeedupResult.speedup > 10) {
      detected = 16;
    } else if (detected === 8 && maxSpeedupResult.concurrency === 12 && maxSpeedupResult.speedup > 8) {
      detected = 12;
    } else if (detected === 4 && maxSpeedupResult.concurrency === 8 && maxSpeedupResult.speedup > 5.5) {
      detected = 8;
    } else if (detected === 2 && maxSpeedupResult.concurrency === 4 && maxSpeedupResult.speedup > 2.8) {
      detected = 4;
    }

    setDetectedCores(detected);
    const benchmarkCompleteLog = (t.hardware_benchmark_complete || '📈 Multi-threading Benchmark Complete. Max speedup: {speedup}x, Calculated saturation threshold: ~{detected} threads.')
      .replace('{speedup}', maxSpeedup.toFixed(2))
      .replace('{detected}', String(detected));
    addHwLog(benchmarkCompleteLog);

    // 3. Spoofing Verification
    // A. Concurrency Spoofing
    let concurrencyPoisoned = false;
    // Brave / Cromite or others spoofing cores to 4 or 8.
    // If declared is 4, but we can easily achieve 6x speedup or higher, it is physically impossible to be on 4 cores.
    if (maxSpeedup >= declaredCores * 1.35 && declaredCores <= 8) {
      concurrencyPoisoned = true;
      const suspiciousTemplate = t.hardware_concurrency_suspicious || '❌ Concurrency mismatch detected: Declared cores is {declared}, but real multithreading benchmark achieved {detected}x speedup. navigator.hardwareConcurrency is spoofed (manually restricted/hardcoded).';
      addHwLog(suspiciousTemplate.replace('{declared}', String(declaredCores)).replace('{detected}', maxSpeedup.toFixed(1)));
    } else if (declaredCores >= 8 && detected <= 4 && maxSpeedup < 4.5) {
      // High declared core count but actual performance is extremely capped, suggesting heavy thread restrictions or parameter spoofing (up-scaling)
      concurrencyPoisoned = true;
      const performanceCappedLog = (t.hardware_performance_capped || '❌ Performance severely capped: Declared CPU cores is {declared}, but speedup saturated early at ~{detected} cores with max speedup of {speedup}x. Core count specifications are inconsistent with actual compute capabilities.')
        .replace('{declared}', String(declaredCores))
        .replace('{detected}', String(detected))
        .replace('{speedup}', maxSpeedup.toFixed(2));
      addHwLog(performanceCappedLog);
    } else {
      addHwLog(t.hardware_concurrency_normal || '✅ Multi-threaded scaling performance is consistent with the declared CPU core count.');
    }

    // B. Memory Spoofing Check
    let memoryPoisoned = false;
    if (declaredMemory === 8) {
      // Standard anti-fingerprint setting is to set deviceMemory = 8
      // While 8 is extremely common, we flags a subtle privacy alert if concurrency is spoofed as well
      if (concurrencyPoisoned) {
        memoryPoisoned = true;
        const memorySuspiciousTemplate = t.hardware_memory_suspicious || '❌ Device memory is reported as 8GB, but core hardware parameters are spoofed. Both CPU and Memory values are highly likely artificially hardcoded to standard static values (e.g. 8GB / 4 Cores) for anti-fingerprinting protection.';
        addHwLog(memorySuspiciousTemplate.replace('{memory}', String(declaredMemory)));
      } else {
        addHwLog(t.hardware_memory_normal || '✅ Memory parameter is reported as 8GB, matching typical modern environments.');
      }
    } else if (declaredMemory > 0 && declaredMemory < 2) {
      addHwLog(t.hardware_low_memory_detected || '⚠️ Very low deviceMemory detected. If this is a modern high-end computer, memory may be artificially spoofed/restricted for privacy.');
    } else {
      addHwLog(t.hardware_memory_normal_log || '✅ Device memory appears to be reported normally.');
    }

    if (concurrencyPoisoned || memoryPoisoned) {
      isPoisoned = true;
    }

    setHwProgress(100);
    setHwStatus(isPoisoned ? 'poisoned' : 'clean');
    addHwLog(isPoisoned ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') : (t.clean_log || '✅ Environment appears clean.'));
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
