// src/components/canvas-poisoning/AllTab.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Activity, 
  Tv, 
  Type, 
  Video, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Terminal,
  ArrowRight,
  Search,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { isHooked, checkAudioHooks, renderAudio } from './utils';

interface AllTabProps {
  t: PoisoningTranslations;
}

interface ModuleResult {
  status: 'clean' | 'poisoned' | 'warning' | 'info';
  title: string;
  desc: string;
  logs: string[];
  summary: string;
}

interface AllResults {
  render_audio: ModuleResult;
  fonts: ModuleResult;
  geometry: ModuleResult;
  media: ModuleResult;
  hardware: ModuleResult;
}

const workerCode = `
  self.onmessage = function(e) {
    const duration = e.data || 40;
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < duration) {
      ops += Math.sin(ops) + Math.cos(ops);
    }
    self.postMessage(ops);
  };
`;

export const AllTab: React.FC<AllTabProps> = React.memo(({ t }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'completed') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [activeStep, setActiveStep] = useState<number>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_activeStep');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [currentModuleText, setCurrentModuleText] = useState<string>(() => {
    try {
      return sessionStorage.getItem('browserscope_poisoning_all_currentModuleText') || '';
    } catch {
      return '';
    }
  });
  const [globalProgress, setGlobalProgress] = useState<number>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_globalProgress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [runningLogs, setRunningLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_runningLogs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [results, setResults] = useState<AllResults | null>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_results');
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });
  const [selectedResultModule, setSelectedResultModule] = useState<keyof AllResults | null>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_all_selectedResultModule');
      return (val as keyof AllResults | null) || null;
    } catch {
      return null;
    }
  });
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [copiedLogModule, setCopiedLogModule] = useState<string | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_all_status', status);
      sessionStorage.setItem('browserscope_poisoning_all_activeStep', String(activeStep));
      sessionStorage.setItem('browserscope_poisoning_all_currentModuleText', currentModuleText);
      sessionStorage.setItem('browserscope_poisoning_all_globalProgress', String(globalProgress));
      sessionStorage.setItem('browserscope_poisoning_all_runningLogs', JSON.stringify(runningLogs));
      sessionStorage.setItem('browserscope_poisoning_all_results', results ? JSON.stringify(results) : '');
      sessionStorage.setItem('browserscope_poisoning_all_selectedResultModule', selectedResultModule || '');
    } catch (e) {
      console.error(e);
    }
  }, [status, activeStep, currentModuleText, globalProgress, runningLogs, results, selectedResultModule]);

  const addGlobalLog = useCallback((msg: string) => {
    setRunningLogs((prev) => {
      const updated = [...prev, msg];
      // Auto scroll
      setTimeout(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, 0);
      return updated;
    });
  }, []);

  const runAllDiagnostics = async () => {
    setStatus('running');
    setGlobalProgress(0);
    setRunningLogs([]);
    setResults(null);
    setSelectedResultModule(null);

    // ==========================================
    // STEP 1: Render & Audio Diagnostics (0% -> 20%)
    // ==========================================
    setActiveStep(1);
    setCurrentModuleText(t.tab_render_audio || 'Render & Audio');
    addGlobalLog('🚀 [1/5] ' + (t.start_log || 'Starting Canvas & WebGL Poisoning Test...'));
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    const renderAudioLogs: string[] = [];
    const rLog = (m: string) => {
      renderAudioLogs.push(m);
      addGlobalLog(`  [Render/Audio] ${m}`);
    };

    let renderAudioPoisoned = false;

    // Viewport & screen check
    rLog(t.testing_viewport || 'Testing Viewport & Screen Dimensions stability...');
    const lastW = window.innerWidth;
    const lastH = window.innerHeight;
    const probeDiv = document.createElement('div');
    probeDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none;z-index:-9999;';
    document.body.appendChild(probeDiv);
    const lastDivW = probeDiv.clientWidth;
    const lastDivH = probeDiv.clientHeight;
    
    for (let i = 0; i < 5; i++) {
      if (window.innerWidth !== lastW || window.innerHeight !== lastH || probeDiv.clientWidth !== lastDivW || probeDiv.clientHeight !== lastDivH) {
        renderAudioPoisoned = true;
        rLog(t.viewport_poisoned || '❌ Viewport dimensions are unstable (dynamic fluctuation detected).');
        break;
      }
      await new Promise<void>(res => setTimeout(res, 10));
    }
    document.body.removeChild(probeDiv);
    if (!renderAudioPoisoned) {
      rLog(t.viewport_stable || '✅ Viewport and screen dimensions are stable.');
    }
    setGlobalProgress(10);

    // Audio Hooks
    const audioHookInfo = checkAudioHooks();
    if (audioHookInfo.hooked) {
      renderAudioPoisoned = true;
      rLog((t.audio_hooked || '❌ Web Audio API Hook detected on: {name}').replace('{name}', audioHookInfo.name || ''));
    }

    // Audio Hash check
    rLog(t.testing_audio || 'Analyzing Audio Buffer channel stability across queries...');
    const buffer1 = await renderAudio();
    const buffer2 = await renderAudio();
    if (buffer1 && buffer2) {
      let matched = true;
      for (let i = 0; i < buffer1.length; i++) {
        if (buffer1[i] !== buffer2[i]) {
          matched = false;
          break;
        }
      }
      if (!matched) {
        renderAudioPoisoned = true;
        rLog(t.audio_poisoned || '❌ Dynamic Audio Buffer noise injection detected.');
      } else {
        rLog(t.audio_stable || '✅ Audio buffer fingerprint is highly stable.');
      }
    } else {
      rLog(t.audio_unsupported || '⚠️ Audio Context rendering is blocked or unsupported.');
    }
    setGlobalProgress(20);

    // ==========================================
    // STEP 2: Fonts & Farbling Diagnostics (20% -> 40%)
    // ==========================================
    setActiveStep(2);
    setCurrentModuleText(t.tab_font_farbling || 'Fonts & Farbling');
    addGlobalLog('🚀 [2/5] ' + (t.testing_fonts || 'Starting Fonts & Font Farbling Diagnostics...'));
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    const fontLogs: string[] = [];
    const fLog = (m: string) => {
      fontLogs.push(m);
      addGlobalLog(`  [Fonts] ${m}`);
    };

    let fontPoisoned = false;

    // document.fonts hook
    try {
      const fontsProto = Object.getPrototypeOf(document.fonts);
      const isForEachHooked = isHooked(document.fonts.forEach as unknown as (...args: never[]) => unknown) || 
                              (fontsProto && isHooked(fontsProto.forEach as unknown as (...args: never[]) => unknown));
      if (isForEachHooked) {
        fontPoisoned = true;
        fLog(t.fonts_hooked || '❌ Suspicious Proxy/Hook detected on core Font/Document APIs.');
      }
    } catch {}

    // Font width fluctuation
    fLog(t.testing_fonts || 'Detecting high-precision font width farbling (jitter)...');
    const fontContainer = document.createElement('div');
    fontContainer.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:nowrap;font-size:72px;font-family:"Times New Roman", Times, serif;';
    const fontSpan = document.createElement('span');
    fontSpan.textContent = 'Farbling Jitter Check: High-Precision Font Widths Fluctuation Testing !!! @#$%^&*()';
    fontContainer.appendChild(fontSpan);
    document.body.appendChild(fontContainer);

    const measurements: number[] = [];
    let jitterDetected = false;
    for (let i = 0; i < 10; i++) {
      measurements.push(fontSpan.getBoundingClientRect().width);
      await new Promise<void>(res => setTimeout(res, 10));
    }
    const firstW = measurements[0];
    for (let i = 1; i < measurements.length; i++) {
      if (Math.abs(measurements[i] - firstW) > 0.00001) {
        jitterDetected = true;
        break;
      }
    }
    if (jitterDetected) {
      fontPoisoned = true;
      fLog(t.font_farbling_detected || '❌ Font Farbling detected (high-precision width measurement fluctuates in static state).');
    } else {
      fLog(t.font_widths_stable || '✅ High-precision font width measurements are stable.');
    }
    setGlobalProgress(30);

    // Font shielding
    const measureFont = (family: string) => {
      const s = document.createElement('span');
      s.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      s.style.fontFamily = family;
      fontContainer.appendChild(s);
      const width = s.getBoundingClientRect().width;
      fontContainer.removeChild(s);
      return width;
    };
    const wSans = measureFont('sans-serif');
    const wSerif = measureFont('serif');
    const wMono = measureFont('monospace');
    const wGeorgia = measureFont('Georgia, serif');
    const wFake = measureFont('NonexistentFakeFontAlphaOmega, sans-serif');

    const hasDifferentSystemFonts = (wGeorgia !== wFake);
    if (!hasDifferentSystemFonts && wSans === wSerif && wSans === wMono) {
      fontPoisoned = true;
      fLog(t.font_shielding_detected || '❌ Font Shielding detected (all exotic fonts have identical widths to the fallback).');
    } else {
      fLog(t.font_differentiation_detected || '✅ Font differentiation detected (local font library access behaves normally).');
    }
    document.body.removeChild(fontContainer);
    setGlobalProgress(40);

    // ==========================================
    // STEP 3: Geometry & Layout Diagnostics (40% -> 60%)
    // ==========================================
    setActiveStep(3);
    setCurrentModuleText(t.tab_geometry || 'Geometry & Layout');
    addGlobalLog('🚀 [3/5] ' + (t.testing_geometry || 'Starting Geometry & Layout DOMRect Diagnostics...'));
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    const geomLogs: string[] = [];
    const gLog = (m: string) => {
      geomLogs.push(m);
      addGlobalLog(`  [Geometry] ${m}`);
    };

    let geomPoisoned = false;

    // Hook check
    try {
      const getBoundingClientRectHooked = isHooked(Element.prototype.getBoundingClientRect as unknown as (...args: never[]) => unknown);
      if (getBoundingClientRectHooked) {
        geomPoisoned = true;
        gLog(t.rects_hooked || '❌ Suspicious Proxy/Hook detected on getBoundingClientRect.');
      }
    } catch {}

    // Nested geometry farbling
    gLog(t.testing_geometry || 'Testing high-frequency nested geometry measurements and poisoning...');
    const geomContainer = document.createElement('div');
    geomContainer.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:300px;height:300px;perspective:100px;transform-style:preserve-3d;visibility:hidden;pointer-events:none;';
    const svgNS = "http://www.w3.org/2000/svg";
    const svgEl = document.createElementNS(svgNS, "svg");
    svgEl.setAttribute("width", "200");
    svgEl.setAttribute("height", "200");
    svgEl.style.cssText = "transform: scale(1.2) translate3d(5px, 5px, 5px);";
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M5 5 H 95 V 95 H 5 Z");
    svgEl.appendChild(path);
    geomContainer.appendChild(svgEl);
    document.body.appendChild(geomContainer);

    const geomMeasurements: { left: number; top: number }[] = [];
    let geomFarbled = false;
    for (let i = 0; i < 10; i++) {
      const r = path.getBoundingClientRect();
      geomMeasurements.push({ left: r.left, top: r.top });
      await new Promise<void>(res => setTimeout(res, 10));
    }
    const firstGeom = geomMeasurements[0];
    for (let i = 1; i < geomMeasurements.length; i++) {
      if (Math.abs(geomMeasurements[i].left - firstGeom.left) > 0.00001 || Math.abs(geomMeasurements[i].top - firstGeom.top) > 0.00001) {
        geomFarbled = true;
        break;
      }
    }
    if (geomFarbled) {
      geomPoisoned = true;
      gLog(t.rect_farbling_detected || '❌ ClientRects/DOMRect Farbling detected (geometry measurements fluctuate dynamically).');
    } else {
      gLog(t.geometry_stable || '✅ High-precision consecutive geometry measurements are stable.');
    }
    document.body.removeChild(geomContainer);
    setGlobalProgress(60);

    // ==========================================
    // STEP 4: Media Devices Diagnostics (60% -> 80%)
    // ==========================================
    setActiveStep(4);
    setCurrentModuleText(t.tab_media || 'Media Devices');
    addGlobalLog('🚀 [4/5] ' + (t.testing_media || 'Starting Media Devices & ID Farbling Diagnostics...'));
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    const mediaLogs: string[] = [];
    const mLog = (m: string) => {
      mediaLogs.push(m);
      addGlobalLog(`  [Media] ${m}`);
    };

    let mediaPoisoned = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      mLog(t.media_not_supported || '⚠️ navigator.mediaDevices is not supported by your current browser.');
    } else {
      // Hook check
      try {
        if (isHooked(navigator.mediaDevices.enumerateDevices as unknown as (...args: never[]) => unknown)) {
          mediaPoisoned = true;
          mLog(t.media_hooked || '❌ Suspicious Proxy/Hook detected on enumerateDevices.');
        }
      } catch {}

      // Consecutive reads
      mLog(t.testing_media || 'Testing media device enumeration stability across consecutive reads...');
      let listFluctuation = false;
      const deviceRuns: string[][] = [];
      let hasError = false;

      for (let i = 0; i < 4; i++) {
        try {
          const list = await navigator.mediaDevices.enumerateDevices();
          deviceRuns.push(list.map(d => `${d.kind}:${d.deviceId}`));
        } catch {
          hasError = true;
        }
        await new Promise<void>(res => setTimeout(res, 15));
      }

      if (hasError) {
        mLog(t.media_error || '⚠️ Error occurred while calling enumerateDevices.');
      } else if (deviceRuns.length > 0 && deviceRuns[0].length > 0) {
        const firstRun = deviceRuns[0];
        mLog((t.media_found_count || 'Found {count} media devices in initial query.').replace('{count}', String(firstRun.length)));
        for (let i = 1; i < deviceRuns.length; i++) {
          if (deviceRuns[i].length !== firstRun.length || JSON.stringify(deviceRuns[i]) !== JSON.stringify(firstRun)) {
            listFluctuation = true;
            break;
          }
        }
        if (listFluctuation) {
          mediaPoisoned = true;
          mLog(t.media_poisoned_detected || '❌ Media Device ID Farbling/Poisoning detected (device IDs fluctuate dynamically).');
        } else {
          mLog(t.media_stable || '✅ Media device enumeration and deviceId hashes are stable.');
        }
      } else {
        mLog(t.media_empty || 'ℹ️ No media devices found or permission not granted.');
      }
    }
    setGlobalProgress(80);

    // ==========================================
    // STEP 5: Hardware Specifications Diagnostics (80% -> 100%)
    // ==========================================
    setActiveStep(5);
    setCurrentModuleText(t.tab_hardware || 'Hardware Config');
    addGlobalLog('🚀 [5/5] ' + (t.testing_hardware || 'Starting Hardware specifications and Web Worker Concurrency load curve testing...'));
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    const hwLogs: string[] = [];
    const hLog = (m: string) => {
      hwLogs.push(m);
      addGlobalLog(`  [Hardware] ${m}`);
    };

    let hwPoisoned = false;

    // Hook check
    try {
      const hcProto = Object.getPrototypeOf(navigator);
      const isHcHooked = isHooked(Object.getOwnPropertyDescriptor(hcProto, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown) ||
                          isHooked(Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency')?.get as unknown as (...args: never[]) => unknown);
      if (isHcHooked) {
        hwPoisoned = true;
        hLog(t.hardware_concurrency_hooked || '❌ Suspicious Proxy/Hook detected on hardwareConcurrency.');
      }
    } catch {}

    const declaredCores = navigator.hardwareConcurrency || 1;
    const declaredMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 0;
    const memoryString = declaredMemory ? `${declaredMemory} ${t.hardware_memory_gb || 'GB'}` : (t.hardware_unknown_spec || 'Unknown');
    hLog((t.hardware_declared_specs || '📊 Declared Specs: CPU Cores = {cores}, Memory = {memory}')
      .replace('{cores}', String(declaredCores))
      .replace('{memory}', memoryString));

    let maxSpeedup = 1.0;
    let detectedSat = 1;

    if (!window.Worker) {
      hLog(t.hardware_workers_not_supported || '⚠️ Web Workers not supported.');
    } else {
      // Benchmark concurrency levels
      const levels = [1, 2, 4, 8, 12, 16];
      const runConcurrency = (C: number): Promise<number> => {
        return new Promise((resolve) => {
          const workers: Worker[] = [];
          let completed = 0;
          let totalOps = 0;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const url = URL.createObjectURL(blob);
          
          for (let i = 0; i < C; i++) {
            const worker = new Worker(url);
            worker.onmessage = (e) => {
              totalOps += e.data;
              completed++;
              worker.terminate();
              if (completed === C) {
                URL.revokeObjectURL(url);
                resolve(totalOps);
              }
            };
            worker.onerror = () => {
              completed++;
              worker.terminate();
              if (completed === C) {
                URL.revokeObjectURL(url);
                resolve(totalOps);
              }
            };
            workers.push(worker);
          }
          workers.forEach(w => w.postMessage(40)); // 40ms duration
        });
      };

      const speedups: { concurrency: number; speedup: number }[] = [];
      let baseOps = 1;
      
      for (let i = 0; i < levels.length; i++) {
        const c = levels[i];
        setGlobalProgress(80 + Math.floor((i / levels.length) * 18));
        hLog((t.hardware_testing_concurrency || 'Benchmarking with: {concurrency}...').replace('{concurrency}', String(c)));
        const ops = await runConcurrency(c);
        if (c === 1) {
          baseOps = ops || 1;
        }
        const speedup = ops / baseOps;
        speedups.push({ concurrency: c, speedup });
        
        const compLog = (t.hardware_concurrency_completed || '   -> Concurrency {concurrency}: Completed {ops} ops, Relative speedup: {speedup}x')
          .replace('{concurrency}', String(c))
          .replace('{ops}', ops.toLocaleString())
          .replace('{speedup}', speedup.toFixed(2));
        hLog(compLog);
        await new Promise<void>(res => setTimeout(res, 10));
      }

      // Analyze physical core saturation
      const maxResult = speedups.reduce((max, r) => r.speedup > max.speedup ? r : max, speedups[0]);
      maxSpeedup = maxResult.speedup;
      const threshold = maxSpeedup * 0.82;
      detectedSat = speedups.find(r => r.speedup >= threshold)?.concurrency || 1;

      if (declaredCores > 4 && detectedSat <= declaredCores / 2 && maxSpeedup < declaredCores * 0.7) {
        hwPoisoned = true;
        hLog((t.hardware_performance_capped || '❌ Performance severely capped: Declared CPU cores is {declared}, but speedup saturated early at ~{detected} cores.')
          .replace('{declared}', String(declaredCores))
          .replace('{detected}', String(detectedSat))
          .replace('{speedup}', maxSpeedup.toFixed(1)));
      } else {
        hLog(t.hardware_concurrency_normal || '✅ Multi-threaded scaling performance matches declared CPU core count.');
      }
    }

    setGlobalProgress(100);
    await new Promise<void>(resolve => setTimeout(resolve, 200));

    // Compile results
    const compiledResults: AllResults = {
      render_audio: {
        status: renderAudioPoisoned ? 'poisoned' : 'clean',
        title: t.tab_render_audio || 'Render & Audio',
        desc: t.tab_render_audio || 'Render & Audio',
        logs: renderAudioLogs,
        summary: renderAudioPoisoned 
          ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') 
          : (t.clean_log || '✅ High-precision rendering is perfectly stable, consistent, and unaltered.')
      },
      fonts: {
        status: fontPoisoned ? 'poisoned' : 'clean',
        title: t.tab_font_farbling || 'Fonts & Farbling',
        desc: t.tab_font_farbling || 'Fonts & Farbling',
        logs: fontLogs,
        summary: fontPoisoned 
          ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).')
          : (t.font_widths_stable || '✅ High-precision width measurements are stable.')
      },
      geometry: {
        status: geomPoisoned ? 'poisoned' : 'clean',
        title: t.tab_geometry || 'Geometry & Layout',
        desc: t.tab_geometry || 'Geometry & Layout',
        logs: geomLogs,
        summary: geomPoisoned 
          ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).')
          : (t.geometry_stable || '✅ Geometry boundaries and DOMRect measurements are perfectly stable.')
      },
      media: {
        status: mediaPoisoned ? 'poisoned' : 'clean',
        title: t.tab_media || 'Media Devices',
        desc: t.tab_media || 'Media Devices',
        logs: mediaLogs,
        summary: mediaPoisoned 
          ? (t.media_poisoned_detected || '❌ Media Device ID Farbling/Poisoning detected.')
          : (t.media_stable || '✅ Media device enumeration and deviceId hashes are stable.')
      },
      hardware: {
        status: hwPoisoned ? 'poisoned' : 'clean',
        title: t.tab_hardware || 'Hardware Config',
        desc: t.tab_hardware || 'Hardware Config',
        logs: hwLogs,
        summary: hwPoisoned 
          ? (t.hardware_performance_capped || '❌ Performance severely capped / spoofed.')
            .replace('{declared}', String(declaredCores))
            .replace('{detected}', String(detectedSat))
            .replace('{speedup}', maxSpeedup.toFixed(1))
          : (t.hardware_concurrency_normal || '✅ Multi-threaded scaling performance matches declared CPU core count.')
      }
    };

    setResults(compiledResults);
    setStatus('completed');
  };

  const getGlobalShieldStatus = () => {
    if (!results) return { level: 'NONE', color: 'text-green-600 dark:text-green-400', label: t.status_clean_env || 'Clean Environment' };
    const poisonedCount = Object.values(results).filter(r => r.status === 'poisoned').length;
    if (poisonedCount === 0) {
      return { 
        level: 'NONE', 
        color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900', 
        label: t.fonts_stable || '✅ Clean Environment' 
      };
    }
    if (poisonedCount <= 2) {
      return { 
        level: 'MEDIUM', 
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900', 
        label: t.shield_medium || '🛡️ Privacy Protection Active' 
      };
    }
    return { 
      level: 'HIGH', 
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900', 
      label: t.shield_high || '🚀 Anti-Fingerprint Shield Active' 
    };
  };

  const shield = getGlobalShieldStatus();

  const handleCopyLogs = (moduleKey: keyof AllResults) => {
    if (!results) return;
    const logText = results[moduleKey].logs.join('\n');
    navigator.clipboard.writeText(logText).then(() => {
      setCopiedLogModule(moduleKey);
      setTimeout(() => setCopiedLogModule(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Tab intro heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm relative overflow-hidden">
        <div className="space-y-1 z-10 max-w-2xl">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {t.all_detection_title || 'Full-Stack Noise & Spoofing Diagnostics'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.all_detection_desc || 'Concurrently runs all five diagnostic scan modules...'}
          </p>
        </div>
        <div className="shrink-0 z-10 flex items-center">
          {status !== 'running' ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden group shadow-md"
              onClick={runAllDiagnostics}
            >
              <span className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
              <span className="relative flex items-center justify-center gap-2">
                <Play size={16} className="fill-current" />
                <span>{t.run_all_tests || 'Run All Diagnostics'}</span>
              </span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 font-medium px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-600">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">{t.testing_all_steps?.replace('{activeStep}', String(activeStep)).replace('{totalSteps}', '5') || 'Running Diagnostics...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* IDLE VIEW */}
      {status === 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { id: 'render_audio', icon: <Tv size={20} className="text-indigo-500" />, title: t.tab_render_audio || 'Render & Audio' },
            { id: 'fonts', icon: <Type size={20} className="text-amber-500" />, title: t.tab_font_farbling || 'Fonts & Farbling' },
            { id: 'geometry', icon: <ShieldAlert size={20} className="text-rose-500" />, title: t.tab_geometry || 'Geometry & Layout' },
            { id: 'media', icon: <Video size={20} className="text-emerald-500" />, title: t.tab_media || 'Media Devices' },
            { id: 'hardware', icon: <Cpu size={20} className="text-blue-500" />, title: t.tab_hardware || 'Hardware Config' }
          ].map((m, index) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/40 text-center flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-1 hover:shadow-md group cursor-pointer"
              onClick={runAllDiagnostics}
            >
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {m.icon}
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">{m.title}</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase font-semibold">{t.status_pending || 'Pending Scan'}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* RUNNING VIEW */}
      {status === 'running' && (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 animate-pulse relative">
                  <div className="absolute inset-0 rounded-xl bg-indigo-500/10 animate-ping" />
                  <Activity size={20} className="relative z-10" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {t.testing_all_steps?.replace('{activeStep}', String(activeStep)).replace('{totalSteps}', '5') || 'Running integrated diagnostics...'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.currently_scanning || 'Currently scanning:'} <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{currentModuleText}</span>
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {globalProgress}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden relative">
              <motion.div 
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                animate={{ width: `${globalProgress}%` }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Console / Terminal Logs */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-80">
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold tracking-wider">
                <Terminal size={14} className="text-indigo-400" />
                <span>{t.diagnostic_core_logs || 'DIAGNOSTIC CORE LOGS'}</span>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            </div>
            <div 
              ref={logContainerRef}
              className="p-4 font-mono text-[11px] overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-800 select-all"
            >
              {runningLogs.map((log, index) => (
                <div key={index} className={`whitespace-pre-wrap leading-relaxed border-l-2 pl-2 ${
                  log.includes('❌') 
                    ? 'text-rose-400 border-rose-500/50' 
                    : log.includes('✅') 
                    ? 'text-emerald-400 border-emerald-500/50' 
                    : log.includes('⚠️') 
                    ? 'text-amber-400 border-amber-500/50' 
                    : 'text-slate-300 border-slate-800'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED VIEW - INTERACTIVE BENTO REPORT */}
      {status === 'completed' && results && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Global Shield status banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden transition-all duration-500 ${shield.color}`}>
            <div className="space-y-1.5 z-10">
              <span className="text-xs font-bold tracking-wider uppercase font-mono px-2.5 py-0.5 rounded-full bg-white/40 dark:bg-black/20">
                {t.diagnostic_outcome || 'Diagnostic Outcome'}
              </span>
              <h4 className="text-base sm:text-lg font-bold tracking-tight">
                {t.all_test_summary_title || 'Fingerprint Poisoning & Spoofing Evaluation Summary'}
              </h4>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
                {shield.label} - {(t.poisoned_count_msg || 'Found {count} poisoned component(s) out of 5.').replace('{count}', String(Object.values(results).filter(r => r.status === 'poisoned').length))}
              </p>
            </div>
            <div className="shrink-0 text-3xl sm:text-4xl font-black font-mono tracking-tight z-10 bg-white/10 dark:bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              {t.level_label || 'LEVEL'} {shield.level}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Bento modules list (3 cols on LG) */}
            <div className="lg:col-span-3 space-y-4">
              {[
                { key: 'render_audio', icon: <Tv size={18} />, title: t.tab_render_audio || 'Render & Audio' },
                { key: 'fonts', icon: <Type size={18} />, title: t.tab_font_farbling || 'Fonts & Farbling' },
                { key: 'geometry', icon: <ShieldAlert size={18} />, title: t.tab_geometry || 'Geometry & Layout' },
                { key: 'media', icon: <Video size={18} />, title: t.tab_media || 'Media Devices' },
                { key: 'hardware', icon: <Cpu size={18} />, title: t.tab_hardware || 'Hardware Config' }
              ].map(({ key, icon, title }, idx) => {
                const item = results[key as keyof AllResults];
                const isPoisoned = item.status === 'poisoned';
                const isSelected = selectedResultModule === key;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedResultModule(isSelected ? null : (key as keyof AllResults))}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm relative overflow-hidden select-none group ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-400 dark:bg-indigo-950/10 scale-[1.01]' 
                        : 'border-slate-100 bg-white dark:border-slate-700/50 dark:bg-slate-800 hover:border-indigo-300 hover:translate-x-1 dark:hover:border-indigo-800'
                    }`}
                  >
                    {/* Left Accent Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 dark:bg-indigo-400" />
                    )}

                    <div className="flex items-center gap-4 z-10">
                      <div className={`p-3 rounded-xl transition-all ${
                        isPoisoned 
                          ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400' 
                          : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400'
                      }`}>
                        {icon}
                      </div>
                      <div className="space-y-1 max-w-[200px] sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">{title}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 z-10">
                      {isPoisoned ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 font-semibold text-[10px] sm:text-xs">
                          <AlertTriangle size={12} />
                          <span>{t.status_poisoned || 'Poisoned'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40 font-semibold text-[10px] sm:text-xs">
                          <CheckCircle size={12} />
                          <span>{t.status_clean || 'Stable'}</span>
                        </div>
                      )}
                      <ArrowRight size={14} className={`text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform ${isSelected ? 'rotate-90 text-indigo-500 dark:text-indigo-400' : ''}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Deep diagnostics details panel (2 cols on LG) - Sticky Container */}
            <div className="lg:col-span-2 lg:sticky lg:top-4">
              <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-[520px]">
                {selectedResultModule ? (
                  <>
                    {/* Header */}
                    <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* macOS Window Controls */}
                        <div className="flex gap-1.5 mr-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
                          <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
                        </div>
                        <span className="text-slate-400 font-mono text-xs font-semibold tracking-wider">
                          {t.logs_label || 'LOGS:'} {results[selectedResultModule].title.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLogs(selectedResultModule)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono border border-transparent hover:border-slate-700"
                          title="Copy Logs"
                        >
                          {copiedLogModule === selectedResultModule ? (
                            <>
                              <Check size={13} className="text-emerald-400" />
                              <span className="text-emerald-400">{t.copied_label || 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>{t.copy_label || 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Filter / Search Bar */}
                    <div className="bg-slate-900/40 px-3 py-2 border-b border-slate-800/50 flex items-center gap-2">
                      <Search size={14} className="text-slate-500 shrink-0" />
                      <input
                        type="text"
                        placeholder={t.filter_placeholder || 'Filter log lines...'}
                        value={logSearchQuery}
                        onChange={(e) => setLogSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none focus:ring-0 text-xs font-mono text-slate-300 w-full placeholder-slate-600"
                      />
                      {logSearchQuery && (
                        <button 
                          onClick={() => setLogSearchQuery('')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-400 hover:text-white"
                        >
                          {t.clear_label || 'Clear'}
                        </button>
                      )}
                    </div>

                    {/* Logs Area */}
                    <div className="p-4 font-mono text-[11px] overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-800 select-all">
                      {results[selectedResultModule].logs
                        .filter(log => log.toLowerCase().includes(logSearchQuery.toLowerCase()))
                        .map((log, index) => (
                          <div 
                            key={index} 
                            className={`whitespace-pre-wrap leading-relaxed border-l-2 pl-2 ${
                              log.includes('❌') 
                                ? 'text-rose-400 border-rose-500/50' 
                                : log.includes('✅') 
                                ? 'text-emerald-400 border-emerald-500/50' 
                                : log.includes('⚠️') 
                                ? 'text-amber-400 border-amber-500/50' 
                                : 'text-slate-300 border-slate-800'
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                      {results[selectedResultModule].logs.filter(log => log.toLowerCase().includes(logSearchQuery.toLowerCase())).length === 0 && (
                        <div className="text-slate-500 text-center py-8 font-sans text-xs">
                          {(t.no_matching_logs || 'No matching logs found for "{query}"').replace('{query}', logSearchQuery)}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-5 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 shadow-inner border border-slate-800/80">
                      <Terminal size={32} />
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <h5 className="text-sm font-semibold text-slate-200">{t.inspect_logs_title || 'Inspect Deep Logs'}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.inspect_logs_desc || 'Select any of the five system components on the left to review their cryptographic noise injection logs, spoof vectors, and stable checks.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

AllTab.displayName = 'AllTab';
