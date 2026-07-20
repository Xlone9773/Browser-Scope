// src/components/canvas-poisoning/FontsTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { runFontDiagnostic } from './diagnostics';

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

    const result = await runFontDiagnostic(t, addFontLog, setFontProgress);
    setFontStatus(result.status);
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
