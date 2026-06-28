import React, { useState, useRef } from 'react';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface CanvasPoisoningModalProps {
  onClose: () => void;
  t: any;
}

export const CanvasPoisoningModal: React.FC<CanvasPoisoningModalProps> = ({ onClose, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'poisoned' | 'clean'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, offset: number) => {
    ctx.clearRect(0, 0, 200, 50);
    // Draw some complex gradients and texts
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
    addLog(t?.start_log || 'Starting Canvas & WebGL Poisoning Test...');
    
    let poisoned = false;
    
    // Canvas Test
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        addLog(t?.testing_canvas || 'Testing 2D Canvas stability...');
        let lastHash = '';
        for (let i = 0; i < 10; i++) {
          drawCanvas(ctx, 0); // Always draw exact same thing
          const dataURL = canvas.toDataURL();
          const hash = hashString(dataURL);
          if (i > 0 && hash !== lastHash) {
            poisoned = true;
            addLog(`❌ Canvas mismatch at iteration ${i}: ${lastHash} != ${hash}`);
            break;
          }
          lastHash = hash;
          setProgress((prev) => prev + 5);
          await new Promise(r => setTimeout(r, 50));
        }
        if (!poisoned) addLog('✅ Canvas appears stable (no random noise).');
      }
    }
    
    if (poisoned) {
       setStatus('poisoned');
       setProgress(100);
       return;
    }
    
    // WebGL Test
    const webgl = webglRef.current;
    if (webgl) {
      const gl = webgl.getContext('webgl');
      if (gl) {
        addLog(t?.testing_webgl || 'Testing WebGL stability...');
        let lastHash = '';
        for (let i = 0; i < 10; i++) {
          drawWebGL(gl, 0);
          const dataURL = webgl.toDataURL();
          const hash = hashString(dataURL);
          if (i > 0 && hash !== lastHash) {
            poisoned = true;
            addLog(`❌ WebGL mismatch at iteration ${i}: ${lastHash} != ${hash}`);
            break;
          }
          lastHash = hash;
          setProgress((prev) => prev + 5);
          await new Promise(r => setTimeout(r, 50));
        }
        if (!poisoned) addLog('✅ WebGL appears stable (no random noise).');
      }
    }
    
    setProgress(100);
    setStatus(poisoned ? 'poisoned' : 'clean');
    addLog(poisoned ? (t?.poisoned_log || '⚠️ Environment is likely poisoned (Noise Injection detected).') : (t?.clean_log || '✅ Environment appears clean.'));
  };

  return (
    <Modal
      title={t?.title || "Canvas & WebGL Noise & Poisoning Detection"}
      onClose={onClose}
      size="md"
    >
      <div className="space-y-4 p-2">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
          <ShieldAlert className="text-indigo-500 shrink-0" size={24} />
          <div className="text-sm">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t?.desc_title || "Noise Injection Detection"}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {t?.desc || "Repeatedly renders complex geometric patterns and texts, then compares pixel hashes frame-by-frame. Variances in static renders indicate artificial noise injection (common in privacy extensions)."}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center py-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">2D Canvas</span>
              <canvas ref={canvasRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-white shadow-sm" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block text-center">WebGL</span>
              <canvas ref={webglRef} width={200} height={50} className="border border-slate-300 dark:border-slate-600 rounded bg-black shadow-sm" />
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 h-48 overflow-y-auto border border-slate-700 shadow-inner">
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${log.includes('❌') || log.includes('⚠️') ? 'text-rose-400' : log.includes('✅') ? 'text-emerald-400' : ''}`}>
              {log}
            </div>
          ))}
          {logs.length === 0 && <span className="text-slate-600">{t?.waiting || "Waiting to start test..."}</span>}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t?.status || "Status"}:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              status === 'clean' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              status === 'poisoned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
              status === 'running' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {status === 'idle' ? (t?.status_idle || "IDLE") : 
               status === 'running' ? (t?.status_running || "RUNNING") : 
               status === 'poisoned' ? (t?.status_poisoned || "POISONED") : 
               (t?.status_clean || "CLEAN")}
            </span>
          </div>
          <Button onClick={runTest} disabled={status === 'running'} leftIcon={status === 'running' ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}>
            {status === 'running' ? `${t?.testing || "Testing"} (${progress}%)` : (t?.run_test || "Run Poisoning Test")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
