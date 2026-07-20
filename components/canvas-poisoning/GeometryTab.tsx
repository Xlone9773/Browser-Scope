// src/components/canvas-poisoning/GeometryTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { runGeometryDiagnostic } from './diagnostics';

interface GeometryTabProps {
  t: PoisoningTranslations;
}

export const GeometryTab: React.FC<GeometryTabProps> = React.memo(({ t }) => {
  const [geomStatus, setGeomStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geometry_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [geomProgress, setGeomProgress] = useState(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geometry_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [geomLogs, setGeomLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geometry_logs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_geometry_status', geomStatus);
      sessionStorage.setItem('browserscope_poisoning_geometry_progress', String(geomProgress));
      sessionStorage.setItem('browserscope_poisoning_geometry_logs', JSON.stringify(geomLogs));
    } catch (e) {
      console.error(e);
    }
  }, [geomStatus, geomProgress, geomLogs]);

  const addGeomLog = useCallback((msg: string) => {
    setGeomLogs((prev) => [...prev, msg]);
  }, []);

  const runGeometryTest = async () => {
    setGeomStatus('running');
    setGeomProgress(0);
    setGeomLogs([]);

    const result = await runGeometryDiagnostic(t, addGeomLog, setGeomProgress);
    setGeomStatus(result.status);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.geometry_detection_title || 'Geometry & DOMRect Poisoning Detection'}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.geometry_detection_desc}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
        {geomLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {geomLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            geomStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            geomStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            geomStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {geomStatus === 'idle' ? t.status_idle : 
             geomStatus === 'running' ? t.status_running : 
             geomStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runGeometryTest} disabled={geomStatus === 'running'} leftIcon={geomStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {geomStatus === 'running' ? `${t.testing} (${geomProgress}%)` : (t.run_geometry_test || 'Run Geometry Test')}
        </Button>
      </div>
    </div>
  );
});

GeometryTab.displayName = 'GeometryTab';
