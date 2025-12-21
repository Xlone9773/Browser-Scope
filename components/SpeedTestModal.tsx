
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Wifi, ArrowDown, ArrowUp, Activity, Globe, AlertCircle, Settings2 } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { formatNumber } from '../utils/formatters';
import { Select } from './ui/Select';

interface SpeedTestModalProps {
  onClose: () => void;
  t: Translation['speedTest'];
}

type TestState = 'idle' | 'ping' | 'download' | 'upload' | 'done' | 'error';

const HISTORY_LENGTH = 60; // For graph

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [testState, setTestState] = useState<TestState>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Settings
  const [downloadSize, setDownloadSize] = useState(25000000); // Default 25MB
  const [backend, setBackend] = useState<'cloudflare' | 'custom'>('cloudflare');
  const [customUrl, setCustomUrl] = useState('');

  const [speedHistory, setSpeedHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Animation Loop for Graph
  useEffect(() => {
      const drawGraph = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const width = canvas.width;
          const height = canvas.height;

          // Clear
          ctx.clearRect(0, 0, width, height);

          // Grid Lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for(let i=1; i<5; i++) {
              const y = (height / 5) * i;
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
          }
          ctx.stroke();

          // Draw Speed Line
          if (speedHistory.some(s => s > 0)) {
              const maxVal = Math.max(...speedHistory, 10) * 1.2; // 20% headroom
              const stepX = width / (HISTORY_LENGTH - 1);

              // Gradient
              const gradient = ctx.createLinearGradient(0, 0, 0, height);
              gradient.addColorStop(0, testState === 'upload' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(16, 185, 129, 0.5)'); // Purple for UP, Green for Down
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

              ctx.beginPath();
              ctx.moveTo(0, height);
              
              speedHistory.forEach((val, i) => {
                  const x = i * stepX;
                  const y = height - (val / maxVal) * height;
                  ctx.lineTo(x, y);
              });

              ctx.lineTo(width, height);
              ctx.closePath();
              ctx.fillStyle = gradient;
              ctx.fill();

              // Stroke Line
              ctx.beginPath();
              speedHistory.forEach((val, i) => {
                  const x = i * stepX;
                  const y = height - (val / maxVal) * height;
                  if (i === 0) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
              });
              ctx.strokeStyle = testState === 'upload' ? '#a855f7' : '#10b981';
              ctx.lineWidth = 2;
              ctx.stroke();
          }

          animationRef.current = requestAnimationFrame(drawGraph);
      };

      animationRef.current = requestAnimationFrame(drawGraph);
      return () => {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
  }, [speedHistory, testState]);

  const updateHistory = (speed: number) => {
      setCurrentSpeed(speed);
      setSpeedHistory(prev => [...prev.slice(1), speed]);
  };

  const stopTest = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
      setTestState('idle');
      setCurrentSpeed(0);
  };

  const startTest = async () => {
      if (testState !== 'idle' && testState !== 'done' && testState !== 'error') return;
      
      // Validate Custom URL
      if (backend === 'custom' && !customUrl) {
          setErrorMsg("Please enter a valid Custom URL");
          setTestState('error');
          return;
      }

      setTestState('ping');
      setPing(null);
      setJitter(null);
      setDownloadSpeed(null);
      setUploadSpeed(null);
      setCurrentSpeed(0);
      setErrorMsg(null);
      setSpeedHistory(new Array(HISTORY_LENGTH).fill(0));
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
          // --- Phase 1: Latency (Ping) ---
          // Using Cloudflare Speed Test Endpoint (Small payload)
          // Previously cdn-cgi/trace caused CORS issues on some networks
          // If custom backend, try HEAD request to custom URL for latency
          const pings: number[] = [];
          const pingUrl = backend === 'custom' ? customUrl : 'https://speed.cloudflare.com/__down?bytes=0';
          
          for (let i = 0; i < 5; i++) {
              if (signal.aborted) return;
              const start = performance.now();
              // For custom, use no-cors to avoid blocking if headers missing, but timing might be opaque?
              // Actually for timing, we need CORS or we get opaque response which resolves but...
              // Let's assume standard fetch behavior.
              try {
                  await fetch(pingUrl, { cache: 'no-store', signal, method: 'HEAD', mode: 'cors' });
              } catch {
                  // Fallback for custom if HEAD fails (maybe generic GET) or opaque
                  await fetch(pingUrl, { cache: 'no-store', signal, mode: 'no-cors' }); 
              }
              const end = performance.now();
              pings.push(end - start);
              await new Promise(r => setTimeout(r, 200)); // Small delay between pings
          }
          
          if (pings.length > 0) {
              const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
              const variance = pings.reduce((a, b) => a + Math.pow(b - avgPing, 2), 0) / pings.length;
              setPing(avgPing);
              setJitter(Math.sqrt(variance));
          }

          // --- Phase 2: Download ---
          if (signal.aborted) return;
          setTestState('download');
          
          let dlUrl = '';
          if (backend === 'cloudflare') {
              dlUrl = `https://speed.cloudflare.com/__down?bytes=${downloadSize}`;
          } else {
              dlUrl = customUrl;
          }

          const dlResponse = await fetch(dlUrl, { signal });
          
          if (dlResponse.body) {
              const reader = dlResponse.body.getReader();
              let receivedLength = 0;
              
              const startTime = performance.now();
              let lastUpdate = startTime;

              while(true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  
                  receivedLength += value.length;
                  
                  const now = performance.now();
                  // Update graph every ~100ms
                  if (now - lastUpdate > 100) {
                      const duration = (now - startTime) / 1000; // seconds
                      const bits = receivedLength * 8;
                      const mbps = (bits / duration) / 1000000;
                      updateHistory(mbps);
                      setDownloadSpeed(mbps); // Update live indicator
                      lastUpdate = now;
                  }
              }
              
              // Final Calc
              const totalDuration = (performance.now() - startTime) / 1000;
              const finalMbps = ((receivedLength * 8) / totalDuration) / 1000000;
              setDownloadSpeed(finalMbps);
              updateHistory(0); // Reset line for next phase
          }

          // --- Phase 3: Upload ---
          // Skip upload for custom backend unless we implement a specific way
          if (backend === 'cloudflare') {
              if (signal.aborted) return;
              setTestState('upload');
              
              // Upload needs XHR for progress event
              // Use smaller size for upload test generally (10MB)
              const uploadSize = 10 * 1024 * 1024; 
              const uploadData = new Uint8Array(uploadSize); 
              for(let i=0; i<uploadSize; i+=1024) uploadData[i] = Math.floor(Math.random()*255);
              
              await new Promise<void>((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', 'https://speed.cloudflare.com/__up', true);
                  
                  const ulStartTime = performance.now();
                  let lastUlUpdate = ulStartTime;

                  xhr.upload.onprogress = (e) => {
                      if (signal.aborted) {
                          xhr.abort();
                          reject(new Error("Aborted"));
                          return;
                      }
                      if (e.lengthComputable) {
                          const now = performance.now();
                          if (now - lastUlUpdate > 100) {
                              const duration = (now - ulStartTime) / 1000;
                              const bits = e.loaded * 8;
                              const mbps = (bits / duration) / 1000000;
                              updateHistory(mbps);
                              setUploadSpeed(mbps);
                              lastUlUpdate = now;
                          }
                      }
                  };

                  xhr.onload = () => {
                      const totalDuration = (performance.now() - ulStartTime) / 1000;
                      const finalMbps = ((uploadSize * 8) / totalDuration) / 1000000;
                      setUploadSpeed(finalMbps);
                      resolve();
                  };

                  xhr.onerror = () => {
                      console.warn("Upload test failed (likely CORS)");
                      setUploadSpeed(0);
                      resolve();
                  };

                  xhr.send(uploadData);
              });
          } else {
              // Mark upload as skipped/NA for custom
              setUploadSpeed(0);
          }

          setTestState('done');
          setCurrentSpeed(0);

      } catch (e: any) {
          if (e.name !== 'AbortError') {
              console.error("Speed test error", e);
              setTestState('error');
              setErrorMsg(e.message || "Network Error");
          }
      }
  };

  const handleClose = () => {
    stopTest();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getStatusText = () => {
      switch(testState) {
          case 'idle': return t.status_idle;
          case 'ping': return t.status_ping;
          case 'download': return t.status_down;
          case 'upload': return t.status_up;
          case 'done': return t.status_done;
          case 'error': return "Error";
          default: return '';
      }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Activity className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 flex flex-col gap-6">
            
            {/* Settings Area (Visible when idle) */}
            {testState === 'idle' && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Settings2 size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuration</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Backend Selector */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.backend}</label>
                            <Select 
                                value={backend} 
                                options={[
                                    { id: 'cloudflare', label: t.backend_cloudflare },
                                    { id: 'custom', label: t.backend_custom }
                                ]}
                                onChange={(val) => setBackend(val)}
                                color="indigo"
                            />
                        </div>

                        {/* Size Selector (Only Cloudflare) */}
                        {backend === 'cloudflare' && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.test_size}</label>
                                <Select 
                                    value={downloadSize} 
                                    options={[
                                        { id: 10000000, label: '10 MB' },
                                        { id: 25000000, label: '25 MB (Default)' },
                                        { id: 50000000, label: '50 MB' },
                                        { id: 100000000, label: '100 MB' },
                                        { id: 200000000, label: '200 MB' }
                                    ]}
                                    onChange={(val) => setDownloadSize(Number(val))}
                                    color="indigo"
                                />
                            </div>
                        )}
                    </div>

                    {/* Custom URL Input */}
                    {backend === 'custom' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.custom_url}</label>
                            <input 
                                type="text"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                placeholder={t.custom_placeholder}
                                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-shadow"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">{t.cors_note}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {testState === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Failed to connect. {errorMsg}</span>
                </div>
            )}

            {/* Top Stats: Ping & Jitter */}
            <div className="flex gap-4">
                <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wifi size={18} className="text-indigo-500" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.ping}</span>
                    </div>
                    <div className="font-mono font-bold text-slate-800 dark:text-white">
                        {ping !== null ? `${formatNumber(ping, 0)} ms` : '--'}
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-indigo-500" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.jitter}</span>
                    </div>
                    <div className="font-mono font-bold text-slate-800 dark:text-white">
                        {jitter !== null ? `${formatNumber(jitter, 0)} ms` : '--'}
                    </div>
                </div>
            </div>

            {/* Main Gauge Area */}
            <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-700 flex items-center justify-center">
                {/* Canvas Graph Background */}
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={256} 
                    className="absolute inset-0 w-full h-full opacity-50" 
                />
                
                {/* Central Speed Text */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-lg">
                        {formatNumber(currentSpeed, 1)}
                    </div>
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-2">{t.mbps}</div>
                    
                    <div className="mt-6 px-4 py-1.5 bg-black/40 rounded-full backdrop-blur-md text-xs font-medium text-slate-300 border border-white/10 flex items-center gap-2">
                        {testState === 'download' && <ArrowDown size={12} className="text-emerald-400 animate-bounce" />}
                        {testState === 'upload' && <ArrowUp size={12} className="text-purple-400 animate-bounce" />}
                        {testState === 'ping' && <Wifi size={12} className="text-amber-400 animate-pulse" />}
                        {getStatusText()}
                    </div>
                </div>
                
                {/* Provider Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <Globe size={12} />
                    {backend === 'cloudflare' ? t.server : 'Custom'}
                </div>
            </div>

            {/* Bottom Stats: Download & Upload */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border transition-all ${testState === 'download' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDown size={18} className="text-emerald-500" />
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t.download}</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {downloadSpeed !== null ? formatNumber(downloadSpeed, 1) : '--'} <span className="text-xs font-normal text-slate-400">Mbps</span>
                    </div>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${testState === 'upload' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 shadow-md ring-1 ring-purple-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUp size={18} className="text-purple-500" />
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{t.upload}</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {uploadSpeed !== null ? formatNumber(uploadSpeed, 1) : '--'} <span className="text-xs font-normal text-slate-400">Mbps</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button 
                onClick={testState === 'idle' || testState === 'done' || testState === 'error' ? startTest : stopTest}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    testState === 'idle' || testState === 'done' || testState === 'error' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' 
                    : 'bg-slate-700 hover:bg-slate-800'
                }`}
            >
                {testState === 'idle' || testState === 'done' || testState === 'error' ? <Play size={20} fill="currentColor" /> : <Square size={20} fill="currentColor" />}
                {testState === 'idle' || testState === 'done' || testState === 'error' ? t.start : t.stop}
            </button>

        </div>
      </div>
    </div>
  );
};
