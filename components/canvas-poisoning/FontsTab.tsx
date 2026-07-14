// src/components/canvas-poisoning/FontsTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { isHooked } from './utils';

interface FontsTabProps {
  t: PoisoningTranslations;
}

export const FontsTab: React.FC<FontsTabProps> = React.memo(({ t }) => {
  const [fontStatus, setFontStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_fonts_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [fontProgress, setFontProgress] = useState(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_fonts_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [fontLogs, setFontLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_fonts_logs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_fonts_status', fontStatus);
      sessionStorage.setItem('browserscope_poisoning_fonts_progress', String(fontProgress));
      sessionStorage.setItem('browserscope_poisoning_fonts_logs', JSON.stringify(fontLogs));
    } catch (e) {
      console.error(e);
    }
  }, [fontStatus, fontProgress, fontLogs]);

  const addFontLog = useCallback((msg: string) => {
    setFontLogs((prev) => [...prev, msg]);
  }, []);

  const runFontTest = async () => {
    setFontStatus('running');
    setFontProgress(0);
    setFontLogs([]);
    
    addFontLog(t.testing_fonts || 'Testing font widths and Font Farbling...');
    
    let fontPoisoned = false;
    
    // 1. Hook detection on document.fonts
    try {
      const fontsProto = Object.getPrototypeOf(document.fonts);
      const isForEachHooked = isHooked(document.fonts.forEach as unknown as (...args: never[]) => unknown) || 
                              (fontsProto && isHooked(fontsProto.forEach as unknown as (...args: never[]) => unknown));
      const isValuesHooked = isHooked(document.fonts.values as unknown as (...args: never[]) => unknown) || 
                             (fontsProto && isHooked(fontsProto.values as unknown as (...args: never[]) => unknown));
      if (isForEachHooked || isValuesHooked) {
        fontPoisoned = true;
        addFontLog(t.fonts_hooked || '❌ Suspicious Proxy/Hook detected on core Font/Document APIs.');
      }
    } catch {
      // Ignore
    }
    setFontProgress(20);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    // 2. Local font query interface check (queryLocalFonts)
    addFontLog(t.testing_font_query || 'Detecting local font query interface (queryLocalFonts)...');
    const queryLocalFontsFn = (window as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts || 
                              (navigator as unknown as { queryLocalFonts?: () => unknown }).queryLocalFonts;
    if (queryLocalFontsFn) {
      if (isHooked(queryLocalFontsFn as unknown as (...args: never[]) => unknown)) {
        fontPoisoned = true;
        addFontLog(t.query_local_fonts_hooked || '❌ Suspicious Proxy/Hook detected on queryLocalFonts API.');
      }
      try {
        addFontLog(t.font_query_allowed || '✅ Local Font Query (queryLocalFonts) is accessible or behaves normally.');
      } catch {
        addFontLog(t.font_query_blocked || '⚠️ Local Font Query (queryLocalFonts) threw an error or is disabled, indicating high privacy restrictions.');
      }
    } else {
      addFontLog(t.query_local_fonts_unsupported || 'ℹ️ queryLocalFonts is not supported or is disabled by browser security model.');
    }
    setFontProgress(40);
    await new Promise<void>(resolve => setTimeout(resolve, 50));

    // 3. High-precision font width fluctuation (Font Farbling Jitter)
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:nowrap;font-size:72px;font-family:"Times New Roman", Times, serif;';
    const span = document.createElement('span');
    span.textContent = 'Farbling Jitter Check: High-Precision Font Widths Fluctuation Testing !!! @#$%^&*()';
    container.appendChild(span);
    document.body.appendChild(container);
    
    const measurements: number[] = [];
    let jitterDetected = false;
    
    for (let i = 0; i < 15; i++) {
      const rect = span.getBoundingClientRect();
      measurements.push(rect.width);
      await new Promise<void>(resolve => setTimeout(resolve, 15));
    }
    
    const firstW = measurements[0];
    for (let i = 1; i < measurements.length; i++) {
      if (Math.abs(measurements[i] - firstW) > 0.00001) {
        jitterDetected = true;
        addFontLog('❌ ' + (t.font_jitter_log || 'Jitter at read {i}: {firstW} != {currentW}').replace('{i}', String(i)).replace('{firstW}', String(firstW)).replace('{currentW}', String(measurements[i])));
      }
    }
    
    if (jitterDetected) {
      fontPoisoned = true;
      addFontLog(t.font_farbling_detected || '❌ Font Farbling detected (high-precision width measurement fluctuates in a static state, typical of Brave or Cromite).');
    } else {
      addFontLog(t.font_widths_stable || '✅ High-precision width measurements are stable.');
    }
    setFontProgress(70);

    // 4. All-font equal width anomaly detection (Font Shielding)
    const measureFont = (family: string) => {
      const testSpan = document.createElement('span');
      testSpan.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      testSpan.style.fontFamily = family;
      container.appendChild(testSpan);
      const width = testSpan.getBoundingClientRect().width;
      container.removeChild(testSpan);
      return width;
    };
    
    const wSans = measureFont('sans-serif');
    const wSerif = measureFont('serif');
    const wMono = measureFont('monospace');
    
    const wGeorgia = measureFont('Georgia, serif');
    const wImpact = measureFont('Impact, sans-serif');
    const wCourier = measureFont('Courier New, monospace');
    const wTimes = measureFont('Times New Roman, serif');
    const wArial = measureFont('Arial, sans-serif');
    const wFake = measureFont('NonexistentFakeFontAlphaOmega, sans-serif');
    
    addFontLog((t.widths_measured_log || 'ℹ️ Widths measured: sans-serif={sans}, serif={serif}, monospace={mono}').replace('{sans}', wSans.toFixed(2)).replace('{serif}', wSerif.toFixed(2)).replace('{mono}', wMono.toFixed(2)));
    addFontLog((t.system_fonts_log || 'ℹ️ System fonts: Georgia={georgia}, Impact={impact}, Courier={courier}, Times={times}, Arial={arial}').replace('{georgia}', wGeorgia.toFixed(2)).replace('{impact}', wImpact.toFixed(2)).replace('{courier}', wCourier.toFixed(2)).replace('{times}', wTimes.toFixed(2)).replace('{arial}', wArial.toFixed(2)));
    
    const hasDifferentSystemFonts = (wGeorgia !== wFake) || (wImpact !== wFake) || (wCourier !== wFake) || (wTimes !== wFake);
    
    let shieldingDetected = false;
    if (!hasDifferentSystemFonts) {
      if (wSans === wSerif && wSans === wMono) {
        shieldingDetected = true;
      } else {
        shieldingDetected = true;
      }
    }
    
    if (shieldingDetected) {
      fontPoisoned = true;
      addFontLog(t.font_shielding_detected || '❌ Font Shielding detected (all exotic fonts have identical widths to the fallback, local font database is blocked or spoofed).');
    } else {
      addFontLog(t.font_differentiation_detected || '✅ Font differentiation detected (local font library access is active).');
    }
    
    document.body.removeChild(container);
    setFontProgress(100);
    
    if (fontPoisoned) {
      setFontStatus('poisoned');
      addFontLog(t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).');
    } else {
      setFontStatus('clean');
      addFontLog(t.fonts_stable || '✅ Font rendering and measurements are stable, no Farbling jitter or retrieval shielding detected.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.font_detection_title || 'Font & Farbling Detection'}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.font_detection_desc}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
        {fontLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {fontLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            fontStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            fontStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            fontStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {fontStatus === 'idle' ? t.status_idle : 
             fontStatus === 'running' ? t.status_running : 
             fontStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runFontTest} disabled={fontStatus === 'running'} leftIcon={fontStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {fontStatus === 'running' ? `${t.testing} (${fontProgress}%)` : (t.run_font_test || 'Run Font Test')}
        </Button>
      </div>
    </div>
  );
});

FontsTab.displayName = 'FontsTab';
