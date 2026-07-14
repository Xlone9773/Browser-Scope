// src/components/canvas-poisoning/RenderAudioTab.tsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { PoisoningTranslations, ExtendedWindow } from './types';
import { hashString, checkAudioHooks, renderAudio } from './utils';

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
    addLog(t.start_log || 'Starting Canvas & WebGL Poisoning Test...');
    
    let poisoned = false;

    // 1. Viewport & Screen Dimension Tampering (e.g., Cromite viewport fingerprinter protection)
    addLog(t.testing_viewport || 'Testing Viewport & Screen Dimensions stability...');
    let viewportPoisoned = false;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    let lastAvailW = screen.availWidth;
    let lastAvailH = screen.availHeight;
    
    // Create a temporary hidden full-viewport element to check clientWidth / clientHeight stability
    const probeDiv = document.createElement('div');
    probeDiv.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;visibility:hidden;pointer-events:none;z-index:-9999;';
    document.body.appendChild(probeDiv);
    let lastDivW = probeDiv.clientWidth;
    let lastDivH = probeDiv.clientHeight;
    
    for (let i = 0; i < 10; i++) {
      const currentW = window.innerWidth;
      const currentH = window.innerHeight;
      const currentAvailW = screen.availWidth;
      const currentAvailH = screen.availHeight;
      const currentDivW = probeDiv.clientWidth;
      const currentDivH = probeDiv.clientHeight;
      
      if (
        currentW !== lastW || 
        currentH !== lastH || 
        currentAvailW !== lastAvailW || 
        currentAvailH !== lastAvailH ||
        currentDivW !== lastDivW ||
        currentDivH !== lastDivH
      ) {
        viewportPoisoned = true;
        poisoned = true;
        addLog(
          `${t.viewport_mismatch || '❌ Viewport dimension fluctuation detected:'} ` +
          `[W:${lastW}, H:${lastH}, Div:${lastDivW}x${lastDivH}, Avail:${lastAvailW}x${lastAvailH}] -> ` +
          `[W:${currentW}, H:${currentH}, Div:${currentDivW}x${currentDivH}, Avail:${currentAvailW}x${currentAvailH}]`
        );
      }
      lastW = currentW;
      lastH = currentH;
      lastAvailW = currentAvailW;
      lastAvailH = currentAvailH;
      lastDivW = currentDivW;
      lastDivH = currentDivH;
      
      setProgress((prev) => Math.min(95, prev + 2));
      await new Promise<void>((resolve) => {
        setTimeout(() => { resolve(); }, 40);
      });
    }
    
    if (document.body.contains(probeDiv)) {
      document.body.removeChild(probeDiv);
    }
    
    if (viewportPoisoned) {
      addLog(t.viewport_poisoned || '❌ Viewport/Screen dimension tampering detected (dynamic noise/micro-fluctuations active).');
    } else {
      addLog(t.viewport_stable || '✅ Viewport and screen dimensions are stable, no dynamic dimension noise detected.');
    }
    
    // 2. Canvas Test
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        addLog(t.testing_canvas || 'Testing 2D Canvas stability...');
        let lastHash = '';
        let canvasPoisoned = false;
        for (let i = 0; i < 10; i++) {
          drawCanvas(ctx, 0);
          const dataURL = canvas.toDataURL();
          const hash = hashString(dataURL);
          if (i > 0 && hash !== lastHash) {
            canvasPoisoned = true;
            poisoned = true;
            const mismatchTemplate = t.canvas_mismatch || '❌ 2D Canvas mismatch at iteration {i}: {lastHash} != {hash}';
            addLog(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
          }
          lastHash = hash;
          setProgress((prev) => Math.min(95, prev + 3));
          await new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 40);
          });
        }
        if (!canvasPoisoned) {
          addLog(t.canvas_stable || '✅ 2D Canvas appears stable (no random noise).');
        }
      }
    }
    
    // 3. WebGL Test
    const webgl = webglRef.current;
    if (webgl) {
      const gl = webgl.getContext('webgl');
      if (gl) {
        addLog(t.testing_webgl || 'Testing WebGL stability...');
        let lastHash = '';
        let webglPoisoned = false;
        for (let i = 0; i < 10; i++) {
          drawWebGL(gl, 0);
          const dataURL = webgl.toDataURL();
          const hash = hashString(dataURL);
          if (i > 0 && hash !== lastHash) {
            webglPoisoned = true;
            poisoned = true;
            const mismatchTemplate = t.webgl_mismatch || '❌ WebGL mismatch at iteration {i}: {lastHash} != {hash}';
            addLog(mismatchTemplate.replace('{i}', String(i)).replace('{lastHash}', lastHash).replace('{hash}', hash));
          }
          lastHash = hash;
          setProgress((prev) => Math.min(95, prev + 3));
          await new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 40);
          });
        }
        if (!webglPoisoned) {
          addLog(t.webgl_stable || '✅ WebGL appears stable (no random noise).');
        }
      }
    }
    
    // 4. Audio & Latency Test
    addLog(t.testing_audio || 'Testing Web Audio stability and latency...');
    
    // A. Hook detection
    const hookResult = checkAudioHooks();
    if (hookResult.hooked) {
      poisoned = true;
      addLog(t.audio_hooked || `❌ Suspicious Proxy/Hook detected on core Audio APIs (${hookResult.name}).`);
    }
    
    // B. Dynamic rendering noise detection
    let lastAudioHash = '';
    let audioStable = true;
    for (let i = 0; i < 10; i++) {
      const samples = await renderAudio();
      if (samples) {
        let sampleStr = '';
        for (let s = 0; s < samples.length; s += 5) {
          sampleStr += samples[s].toFixed(5) + ',';
        }
        const hash = hashString(sampleStr);
        if (i > 0 && hash !== lastAudioHash) {
          audioStable = false;
          const audioMismatchTemplate = t.audio_mismatch || '❌ Audio buffer mismatch at iteration {i}: {lastAudioHash} != {hash}';
          addLog(audioMismatchTemplate.replace('{i}', String(i)).replace('{lastAudioHash}', lastAudioHash).replace('{hash}', hash));
        }
        lastAudioHash = hash;
      }
      setProgress((prev) => Math.min(95, prev + 3));
      await new Promise<void>((resolve) => {
        setTimeout(() => { resolve(); }, 40);
      });
    }

    // C. Latency bounds check
    try {
      const extWindow = window as unknown as ExtendedWindow;
      const AudioContextClass = window.AudioContext || extWindow.webkitAudioContext;
      if (AudioContextClass) {
        const tempCtx = new AudioContextClass();
        const baseLat = tempCtx.baseLatency;
        const outLat = tempCtx.outputLatency;
        
        if (typeof baseLat === 'number' && (baseLat < 0 || baseLat > 2.0)) {
          audioStable = false;
          const suspBaseLatTemplate = t.suspicious_base_latency || '❌ Suspicious baseLatency value: {baseLat}';
          addLog(suspBaseLatTemplate.replace('{baseLat}', String(baseLat)));
        }
        if (typeof outLat === 'number' && (outLat < 0 || outLat > 2.0)) {
          audioStable = false;
          const suspOutLatTemplate = t.suspicious_output_latency || '❌ Suspicious outputLatency value: {outLat}';
          addLog(suspOutLatTemplate.replace('{outLat}', String(outLat)));
        }
        tempCtx.close();
      }
    } catch {
      // Ignore initialization errors for context if not supported in the sandbox
    }

    if (!audioStable) {
      poisoned = true;
      addLog(t.audio_poisoned || '❌ Audio buffer or latency tampering detected (anti-fingerprinting active).');
    } else {
      addLog(t.audio_stable || '✅ Audio APIs stable, no waveform or latency tampering detected.');
    }
    
    setProgress(100);
    setStatus(poisoned ? 'poisoned' : 'clean');
    addLog(poisoned ? (t.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') : (t.clean_log || '✅ Environment appears clean.'));
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
