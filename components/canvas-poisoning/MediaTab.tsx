// src/components/canvas-poisoning/MediaTab.tsx

import React, { useState, useCallback } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { isHooked } from './utils';

interface MediaTabProps {
  t: PoisoningTranslations;
}

export const MediaTab: React.FC<MediaTabProps> = React.memo(({ t }) => {
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaLogs, setMediaLogs] = useState<string[]>([]);

  const addMediaLog = useCallback((msg: string) => {
    setMediaLogs((prev) => [...prev, msg]);
  }, []);

  const runMediaTest = async () => {
    setMediaStatus('running');
    setMediaProgress(0);
    setMediaLogs([]);

    addMediaLog(t.testing_media || 'Testing media device enumeration stability and proxy hooks...');
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    setMediaProgress(20);

    let isPoisoned = false;

    // 1. Hook detection on navigator.mediaDevices.enumerateDevices
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        addMediaLog(t.media_not_supported || '⚠️ navigator.mediaDevices is not supported by your current browser environment.');
        setMediaStatus('idle');
        setMediaProgress(100);
        return;
      }

      const enumerateDevicesFn = navigator.mediaDevices.enumerateDevices;
      if (isHooked(enumerateDevicesFn as unknown as (...args: never[]) => unknown)) {
        isPoisoned = true;
        addMediaLog(t.media_hooked || '❌ Suspicious Proxy/Hook detected on navigator.mediaDevices.enumerateDevices method.');
      }
    } catch {
      // Ignore
    }

    setMediaProgress(40);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    // 2. Query enumerateDevices multiple times to check for dynamic randomization/ordering changes (Farbling)
    interface SimpleDevice {
      kind: string;
      deviceId: string;
      label: string;
    }
    const runs: SimpleDevice[][] = [];
    let hasError = false;

    for (let i = 0; i < 5; i++) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        runs.push(devices.map(d => ({ kind: d.kind, deviceId: d.deviceId, label: d.label })));
      } catch {
        hasError = true;
      }
      await new Promise<void>(resolve => setTimeout(resolve, 30));
      setMediaProgress(40 + (i + 1) * 8); // Progress up to 80%
    }

    if (hasError) {
      addMediaLog(t.media_error || '⚠️ Error occurred while calling enumerateDevices.');
    }

    if (runs.length === 0 || runs[0].length === 0) {
      addMediaLog(t.media_empty || 'ℹ️ No media devices found or media access permissions are not granted.');
    } else {
      const firstRun = runs[0];
      addMediaLog((t.media_runs_log || '📊 Retrieved device list across consecutive queries ({count} runs).').replace('{count}', String(runs.length)));
      addMediaLog((t.media_initial_query_log || '🔍 Initial query: Found {count} devices ({devices})').replace('{count}', String(firstRun.length)).replace('{devices}', firstRun.map(d => `${d.kind}:${d.deviceId.substring(0, 6)}...`).join(', ')));

      // Compare consecutive runs
      let dynamicFluctuation = false;
      for (let i = 1; i < runs.length; i++) {
        const currentRun = runs[i];
        if (currentRun.length !== firstRun.length) {
          dynamicFluctuation = true;
          addMediaLog((t.media_run_count_changed || '❌ Run {i}: Device count changed from {firstCount} to {currentCount}.').replace('{i}', String(i + 1)).replace('{firstCount}', String(firstRun.length)).replace('{currentCount}', String(currentRun.length)));
          break;
        }
        for (let j = 0; j < firstRun.length; j++) {
          if (firstRun[j].deviceId !== currentRun[j].deviceId || firstRun[j].kind !== currentRun[j].kind) {
            dynamicFluctuation = true;
            addMediaLog((t.media_run_device_changed || '❌ Run {i}: Device at index {index} changed from [{firstKind}:{firstId}] to [{currentKind}:{currentId}].').replace('{i}', String(i + 1)).replace('{index}', String(j)).replace('{firstKind}', firstRun[j].kind).replace('{firstId}', firstRun[j].deviceId.substring(0, 6)).replace('{currentKind}', currentRun[j].kind).replace('{currentId}', currentRun[j].deviceId.substring(0, 6)));
            break;
          }
        }
        if (dynamicFluctuation) break;
      }

      if (dynamicFluctuation) {
        isPoisoned = true;
        addMediaLog(t.media_poisoned_detected || '❌ Media Device ID Farbling/Poisoning detected (device IDs or device order fluctuates dynamically between consecutive reads, typical of anti-fingerprinting browsers).');
      } else {
        addMediaLog(t.media_stable_reading || '✅ High-frequency consecutive deviceId and order readings are perfectly stable.');
      }

      // 3. Persistent ID comparison via localStorage (设备 ID 固化比对)
      try {
        const serializedFirstRun = JSON.stringify(firstRun.map(d => ({ kind: d.kind, deviceId: d.deviceId })));
        const storedFirstRun = localStorage.getItem('browserscope_first_media_devices');
        if (storedFirstRun) {
          const parsedStored: { kind: string; deviceId: string }[] = JSON.parse(storedFirstRun);
          let match = true;
          if (parsedStored.length !== firstRun.length) {
            match = false;
          } else {
            for (let j = 0; j < firstRun.length; j++) {
              if (parsedStored[j].deviceId !== firstRun[j].deviceId || parsedStored[j].kind !== firstRun[j].kind) {
                match = false;
                break;
              }
            }
          }

          if (!match) {
            const hasActualIdPrev = parsedStored.some(d => d.deviceId && d.deviceId !== 'default');
            const hasActualIdCurr = firstRun.some(d => d.deviceId && d.deviceId !== 'default');
            
            if (hasActualIdPrev && hasActualIdCurr) {
              isPoisoned = true;
              addMediaLog(t.media_persistent_mismatch || '❌ Persistent Device ID mismatch detected: Current deviceIds/order differ from the originally stored fingerprint in localStorage, indicating ID reset or randomization across refreshes (typically Brave/Cromite farbling).');
            } else {
              addMediaLog(t.media_persistent_info_changed || 'ℹ️ Media device IDs differ from previous run, but this might be due to a change in permission state or no active device ID present.');
              if (hasActualIdCurr) {
                localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
                addMediaLog(t.media_persistent_saved || '💾 Saved active media devices fingerprint to localStorage for future session comparisons.');
              }
            }
          } else {
            addMediaLog(t.media_persistent_match || '✅ Current Media Device fingerprint matches originally stored localStorage baseline perfectly.');
          }
        } else {
          localStorage.setItem('browserscope_first_media_devices', serializedFirstRun);
          addMediaLog(t.media_persistent_no_baseline || '💾 No prior baseline found in localStorage. Saved current media devices fingerprint for future session comparisons.');
        }
      } catch {
        // Ignore storage errors
      }
    }

    setMediaProgress(100);

    if (isPoisoned) {
      setMediaStatus('poisoned');
      addMediaLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setMediaStatus('clean');
      addMediaLog(t.media_stable || '✅ Media device enumeration and deviceId hashes are stable, no poisoning or hooks detected.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.media_detection_title || 'Media Devices Enumeration & ID Poisoning Detection'}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.media_detection_desc}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
        {mediaLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : 'text-slate-300'}`}>
            {log}
          </div>
        ))}
        {mediaLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            mediaStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            mediaStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            mediaStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {mediaStatus === 'idle' ? t.status_idle : 
             mediaStatus === 'running' ? t.status_running : 
             mediaStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runMediaTest} disabled={mediaStatus === 'running'} leftIcon={mediaStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {mediaStatus === 'running' ? `${t.testing} (${mediaProgress}%)` : (t.run_media_test || 'Run Media Test')}
        </Button>
      </div>
    </div>
  );
});

MediaTab.displayName = 'MediaTab';
