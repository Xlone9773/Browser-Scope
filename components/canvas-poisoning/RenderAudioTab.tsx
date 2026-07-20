// src/components/canvas-poisoning/RenderAudioTab.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations, ExtendedWindow } from './types';
import { runRenderAudioDiagnostic } from './diagnostics';

interface RenderAudioTabProps {
  t: PoisoningTranslations;
}

export const RenderAudioTab: React.FC<RenderAudioTabProps> = React.memo(({ t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_renderaudio_status');
      if (val === 'running') return 'idle';
      return (val as 'idle' | 'running' | 'poisoned' | 'clean') || 'idle';
    } catch {
      return 'idle';
    }
  });
  const [progress, setProgress] = useState(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_renderaudio_progress');
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [logs, setLogs] = useState<string[]>(() => {
    try {
      const val = sessionStorage.getItem('browserscope_poisoning_renderaudio_logs');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('browserscope_poisoning_renderaudio_status', status);
      sessionStorage.setItem('browserscope_poisoning_renderaudio_progress', String(progress));
      sessionStorage.setItem('browserscope_poisoning_renderaudio_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [status, progress, logs]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg]);
  }, []);

  const drawCanvas = (ctx: CanvasRenderingContext2D, offset: number) => {
    ctx.clearRect(0, 0, 200, 50);
    const gradient = ctx.createLinearGradient(0, 0, 200, 50);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.5, '#00ff00');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Arial", sans-serif';
    ctx.fillText('Noise Test ' + offset, 10, 30);
    ctx.beginPath();
    ctx.arc(150, 25, 10, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawWebGL = (gl: WebGLRenderingContext, offset: number) => {
    gl.clearColor(0.2, 0.4 + offset / 100, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const runTest = async () => {
    setStatus('running');
    setProgress(0);
    setLogs([]);

    const result = await runRenderAudioDiagnostic(t, addLog, setProgress, canvasRef.current, webglRef.current);
    setStatus(result.status);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
        <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
        <div className="text-sm">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t.desc_title}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.desc}
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center py-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">{t.label_2d_canvas || '2D Canvas'}</span>
          <canvas ref={canvasRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-white shadow-sm" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">{t.label_webgl || 'WebGL'}</span>
          <canvas ref={webglRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-black shadow-sm" />
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-48 overflow-y-auto border border-slate-700 shadow-inner">
        {logs.map((log, i) => (
          <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
            {log}
          </div>
        ))}
        {logs.length === 0 ? <span className="text-slate-600">{t.waiting}</span> : null}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.status}:</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            status === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            status === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
            status === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {status === 'idle' ? t.status_idle : 
             status === 'running' ? t.status_running : 
             status === 'poisoned' ? t.status_poisoned : 
             t.status_clean}
          </span>
        </div>
        <Button onClick={runTest} disabled={status === 'running'} leftIcon={status === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
          {status === 'running' ? `${t.testing} (${progress}%)` : t.run_test}
        </Button>
      </div>
    </div>
  );
});

RenderAudioTab.displayName = 'RenderAudioTab';
