// src/components/canvas-poisoning/MediaTab.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations } from './types';
import { runMediaDiagnostic } from './diagnostics';

interface MediaTabProps {
  t: PoisoningTranslations;
}

export const MediaTab: React.FC<MediaTabProps> = React.memo(({ t }) => {
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_media_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [mediaProgress, setMediaProgress] = useState(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_media_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [mediaLogs, setMediaLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_media_logs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_media_status', mediaStatus);
      sessionStorage.setItem('browserscope_poisoning_media_progress', String(mediaProgress));
      sessionStorage.setItem('browserscope_poisoning_media_logs', JSON.stringify(mediaLogs));
    } catch (e) {
      console.error(e);
    }
  }, [mediaStatus, mediaProgress, mediaLogs]);

  const addMediaLog = useCallback((msg: string) => {
    setMediaLogs((prev) => [...prev, msg]);
  }, []);

  const runMediaTest = async () => {
    setMediaStatus('running');
    setMediaProgress(0);
    setMediaLogs([]);

    const result = await runMediaDiagnostic(t, addMediaLog, setMediaProgress);
    setMediaStatus(result.status);
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
