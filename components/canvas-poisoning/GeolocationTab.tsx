// src/components/canvas-poisoning/GeolocationTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { runGeolocationDiagnostic } from './diagnostics';

interface GeolocationTabProps {
  t: PoisoningTranslations;
}

export const GeolocationTab: React.FC<GeolocationTabProps> = React.memo(({ t }) => {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geolocation_status');
      return val === 'running' ? 'idle' : (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [geoProgress, setGeoProgress] = useState<number>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geolocation_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [geoLogs, setGeoLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_geolocation_logs');
      return val ? JSON.parse(val) as string[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_geolocation_status', geoStatus);
      sessionStorage.setItem('browserscope_poisoning_geolocation_progress', String(geoProgress));
      sessionStorage.setItem('browserscope_poisoning_geolocation_logs', JSON.stringify(geoLogs));
    } catch (e) {
      console.error(e);
    }
  }, [geoStatus, geoProgress, geoLogs]);

  const addGeoLog = useCallback((msg: string) => {
    setGeoLogs((prev) => [...prev, msg]);
  }, []);

  const runGeoTest = async () => {
    setGeoStatus('running');
    setGeoProgress(0);
    setGeoLogs([]);

    const result = await runGeolocationDiagnostic(t, addGeoLog, setGeoProgress);
    setGeoStatus(result.status);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            {t.geolocation_detection_title || 'Geolocation Hook & Noise Detection'}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.geolocation_detection_desc || 'Analyzes high-precision positional drift, Laplace circular noise, and custom Userscript hook detection.'}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto border border-slate-700 shadow-inner">
        {geoLogs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {geoLogs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            geoStatus === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            geoStatus === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            geoStatus === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {geoStatus === 'idle' ? t.status_idle : 
             geoStatus === 'running' ? t.status_running : 
             geoStatus === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runGeoTest} disabled={geoStatus === 'running'} leftIcon={geoStatus === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {geoStatus === 'running' ? `${t.testing} (${geoProgress}%)` : (t.run_geolocation_test || 'Run Geolocation Test')}
        </Button>
      </div>
    </div>
  );
});

GeolocationTab.displayName = 'GeolocationTab';
