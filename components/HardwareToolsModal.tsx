
import React, { useState, useEffect, useRef } from 'react';
import { X, Smartphone, Hand, Keyboard, MousePointer2, RefreshCw, PenTool, Film, Battery, Zap, Check, MonitorPlay } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface HardwareToolsModalProps {
  onClose: () => void;
  t: Translation['hardwareToolsModal'];
}

interface KeyLog {
    key: string;
    code: string;
    timestamp: number;
}

// --- Pointer Logic Sub-Component ---
const PointerVisualizer = ({ t }: { t: Translation['hardwareToolsModal'] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointerData, setPointerData] = useState({
        type: 'mouse',
        pressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Clear only once
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-slate-50') || '#f8fafc'; // simple clear
        // We will clear on "clear" button, but initially transparent/cleared.

        const getStrokeColor = (type: string) => {
            if (type === 'pen') return '#8b5cf6'; // Violet
            if (type === 'touch') return '#10b981'; // Emerald
            return '#3b82f6'; // Blue
        };

        const drawLine = (x1: number, y1: number, x2: number, y2: number, pressure: number, type: string) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            // Pressure modulates width: Min 1px, Max 20px
            const width = Math.max(1, pressure * 20); 
            ctx.lineWidth = width;
            ctx.strokeStyle = getStrokeColor(type);
            ctx.stroke();
        };

        let lastX = 0;
        let lastY = 0;
        let isDrawing = false;

        const handlePointerDown = (e: PointerEvent) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
            
            // Capture for dragging outside canvas
            canvas.setPointerCapture(e.pointerId);
            
            updateData(e);
        };

        const handlePointerMove = (e: PointerEvent) => {
            updateData(e);
            
            if (!isDrawing) return;
            // if (e.pressure === 0 && e.pointerType !== 'mouse') return; // Some pens report 0 on hover

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Use reported pressure, or default 0.5 for mouse if button pressed
            let p = e.pressure;
            if (e.pointerType === 'mouse' && e.buttons === 1) p = 0.5;
            
            drawLine(lastX, lastY, x, y, p, e.pointerType);
            lastX = x;
            lastY = y;
        };

        const handlePointerUp = (e: PointerEvent) => {
            isDrawing = false;
            updateData(e); // keep final data visible
        };

        const updateData = (e: PointerEvent) => {
            setPointerData({
                type: e.pointerType,
                pressure: e.pressure,
                tiltX: e.tiltX,
                tiltY: e.tiltY,
                twist: e.twist,
                width: e.width,
                height: e.height
            });
        };

        const clearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);
        // Clean button external ref if needed, but for now simple internal logic
        
        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 animate-in fade-in duration-300">
            {/* HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{t.pointer_type}</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200 capitalize flex items-center gap-2">
                        {pointerData.type === 'pen' && <PenTool size={14} className="text-violet-500" />}
                        {pointerData.type === 'touch' && <Hand size={14} className="text-emerald-500" />}
                        {pointerData.type === 'mouse' && <MousePointer2 size={14} className="text-blue-500" />}
                        {pointerData.type}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{t.pointer_pressure}</div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-75" style={{ width: `${pointerData.pressure * 100}%` }}></div>
                        </div>
                        <span className="font-mono text-xs w-8 text-right">{pointerData.pressure.toFixed(2)}</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{t.pointer_tilt}</div>
                    <div className="font-mono text-sm text-slate-700 dark:text-slate-200">
                        {pointerData.tiltX}° / {pointerData.tiltY}°
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Dimensions</div>
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-200">{pointerData.width.toFixed(0)}x{pointerData.height.toFixed(0)} px</div>
                    </div>
                    <button onClick={clear} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border-2 border-dashed border-slate-200 dark:border-slate-700 relative touch-none">
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block cursor-crosshair touch-none"
                    style={{ touchAction: 'none' }}
                />
                <div className="absolute bottom-4 left-4 pointer-events-none select-none text-xs text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded backdrop-blur-sm">
                    {t.pointer_instruction}
                </div>
            </div>
        </div>
    );
};

// --- Video Matrix Sub-Component ---
const VideoCapabilityMatrix = ({ t }: { t: Translation['hardwareToolsModal'] }) => {
    const [results, setResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);

    const codecs = [
        { name: 'H.264 (AVC)', type: 'video/mp4; codecs="avc1.42E01E"' }, // High Profile
        { name: 'VP9', type: 'video/webm; codecs="vp9"' },
        { name: 'AV1', type: 'video/mp4; codecs="av01.0.05M.08"' }, // Main Profile
        { name: 'HEVC (H.265)', type: 'video/mp4; codecs="hvc1.1.6.L93.B0"' }, // Main Profile
    ];

    const resolutions = [
        { label: '1080p 30fps', width: 1920, height: 1080, fps: 30, bitrate: 5000000 },
        { label: '1080p 60fps', width: 1920, height: 1080, fps: 60, bitrate: 8000000 },
        { label: '4K 30fps', width: 3840, height: 2160, fps: 30, bitrate: 15000000 },
        { label: '4K 60fps', width: 3840, height: 2160, fps: 60, bitrate: 25000000 },
        { label: '8K 30fps', width: 7680, height: 4320, fps: 30, bitrate: 40000000 },
    ];

    useEffect(() => {
        const runTests = async () => {
            const tempResults = [];
            let done = 0;
            const total = codecs.length * resolutions.length;

            for (const codec of codecs) {
                const row = { codec: codec.name, tests: [] as any[] };
                for (const res of resolutions) {
                    try {
                        // @ts-ignore
                        if (navigator.mediaCapabilities) {
                            const config = {
                                type: 'file', // 'file' or 'media-source'
                                video: {
                                    contentType: codec.type,
                                    width: res.width,
                                    height: res.height,
                                    bitrate: res.bitrate,
                                    framerate: res.fps
                                }
                            };
                            // @ts-ignore
                            const info = await navigator.mediaCapabilities.decodingInfo(config);
                            row.tests.push({
                                ...res,
                                supported: info.supported,
                                smooth: info.smooth,
                                efficient: info.powerEfficient
                            });
                        } else {
                            row.tests.push({ ...res, error: 'API N/A' });
                        }
                    } catch (e) {
                        row.tests.push({ ...res, supported: false });
                    }
                    done++;
                    setProgress(Math.round((done / total) * 100));
                }
                tempResults.push(row);
            }
            setResults(tempResults);
        };

        runTests();
    }, []);

    return (
        <div className="h-full overflow-y-auto animate-in fade-in duration-300">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MonitorPlay size={16} />
                    {t.video_instruction}
                </div>
                {progress < 100 && (
                    <div className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{progress}%</div>
                )}
            </div>

            <div className="space-y-4">
                {results.map((row) => (
                    <div key={row.codec} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <Film size={14} className="text-slate-400" />
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{row.codec}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-700">
                            {row.tests.map((test: any, idx: number) => (
                                <div key={idx} className={`p-3 flex flex-col gap-1 items-center justify-center text-center transition-colors ${test.supported ? '' : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-60'}`}>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{test.label}</span>
                                    
                                    {test.error ? (
                                        <span className="text-xs text-red-400">API Error</span>
                                    ) : !test.supported ? (
                                        <span className="text-xs font-bold text-slate-400">Not Supported</span>
                                    ) : (
                                        <div className="flex gap-2 mt-1">
                                            {/* Efficient (Battery) */}
                                            <div className={`p-1.5 rounded-full ${test.efficient ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`} title={test.efficient ? t.video_efficient : 'Software Decoding (High Power)'}>
                                                {test.efficient ? <Battery size={14} /> : <Zap size={14} />}
                                            </div>
                                            {/* Smooth */}
                                            <div className={`p-1.5 rounded-full ${test.smooth ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`} title={test.smooth ? t.video_smooth : 'Drops Frames'}>
                                                {test.smooth ? <Check size={14} /> : <X size={14} />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 flex gap-4 text-[10px] text-slate-400 justify-center">
                <div className="flex items-center gap-1"><Battery size={12} className="text-green-500" /> {t.video_efficient}</div>
                <div className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> Software Decoding</div>
                <div className="flex items-center gap-1"><Check size={12} className="text-blue-500" /> {t.video_smooth}</div>
            </div>
        </div>
    );
};


// --- Main Component ---
export const HardwareToolsModal: React.FC<HardwareToolsModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'vibrate' | 'touch' | 'keyboard' | 'mouse' | 'pointer' | 'video'>('vibrate');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Touch State
  const [touchCount, setTouchCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keyboard State
  const [lastKey, setLastKey] = useState<KeyLog | null>(null);
  const [keyHistory, setKeyHistory] = useState<string[]>([]);
  const keyboardInputRef = useRef<HTMLInputElement>(null);

  // Mouse State
  const [mouseRate, setMouseRate] = useState(0);
  const [peakRate, setPeakRate] = useState(0);
  const mouseTimestamps = useRef<number[]>([]);
  const mouseRaf = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        onClose();
    }, 300);
  };

  const vibrate = (pattern: number | number[]) => {
      if (navigator.vibrate) {
          navigator.vibrate(pattern);
      }
  };

  // Keyboard Logic - Refactored to use input handler
  const handleKeyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const keyName = e.code || e.key;
      setLastKey({
          key: e.key,
          code: e.code,
          timestamp: Date.now()
      });
      setKeyHistory(prev => {
          if (!prev.includes(keyName)) {
              return [...prev, keyName];
          }
          return prev;
      });
  };

  // Helper to format timestamp
  const formatKeyTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString([], { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          fractionalSecondDigits: 3 
      } as any);
  };

  // Auto-focus input when tab switches to keyboard
  useEffect(() => {
      if (activeTab === 'keyboard' && keyboardInputRef.current) {
          setTimeout(() => {
              keyboardInputRef.current?.focus();
          }, 100);
      }
  }, [activeTab]);

  // Touch Logic
  useEffect(() => {
      if (activeTab !== 'touch') return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const touches = new Map<number, {x: number, y: number, color: string}>();
      const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

      const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Instruction bg
          ctx.font = "14px Inter";
          ctx.fillStyle = "#64748b";
          ctx.textAlign = "center";
          if (touches.size === 0) {
              ctx.fillText(t.touch_instruction, canvas.width/2, canvas.height/2);
          }

          touches.forEach((t, id) => {
              ctx.beginPath();
              ctx.arc(t.x, t.y, 40, 0, Math.PI * 2);
              ctx.fillStyle = t.color;
              ctx.fill();
              ctx.strokeStyle = "white";
              ctx.lineWidth = 3;
              ctx.stroke();
          });
          
          requestAnimationFrame(draw);
      };
      
      const updateTouch = (e: TouchEvent) => {
          e.preventDefault();
          touches.clear();
          for (let i=0; i<e.touches.length; i++) {
              const t = e.touches[i];
              const rect = canvas.getBoundingClientRect();
              touches.set(t.identifier, {
                  x: t.clientX - rect.left,
                  y: t.clientY - rect.top,
                  color: colors[i % colors.length]
              });
          }
          setTouchCount(e.touches.length);
      };

      canvas.addEventListener('touchstart', updateTouch, {passive: false});
      canvas.addEventListener('touchmove', updateTouch, {passive: false});
      canvas.addEventListener('touchend', updateTouch, {passive: false});
      canvas.addEventListener('touchcancel', updateTouch, {passive: false});

      const anim = requestAnimationFrame(draw);

      return () => {
          window.removeEventListener('resize', resize);
          cancelAnimationFrame(anim);
      };
  }, [activeTab, t.touch_instruction]);

  // Mouse Rate Logic
  const handleMouseMove = (e: React.MouseEvent) => {
      const now = performance.now();
      mouseTimestamps.current.push(now);
      
      // Keep only last 1 second of samples
      const oneSecondAgo = now - 1000;
      mouseTimestamps.current = mouseTimestamps.current.filter(t => t > oneSecondAgo);
      
      // Calculate rate
      if (!mouseRaf.current) {
          mouseRaf.current = requestAnimationFrame(() => {
              const count = mouseTimestamps.current.length;
              setMouseRate(count);
              setPeakRate(prev => Math.max(prev, count));
              mouseRaf.current = null;
          });
      }
  };

  const resetMouseStats = () => {
      setMouseRate(0);
      setPeakRate(0);
      mouseTimestamps.current = [];
  };

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
            isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Smartphone className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('vibrate')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'vibrate' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Smartphone size={16} />
                <span className="hidden sm:inline">{t.tab_vibrate}</span>
            </button>
            <button onClick={() => setActiveTab('touch')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'touch' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Hand size={16} />
                <span className="hidden sm:inline">{t.tab_touch}</span>
            </button>
            <button onClick={() => setActiveTab('keyboard')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'keyboard' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Keyboard size={16} />
                <span className="hidden sm:inline">{t.tab_keyboard}</span>
            </button>
            <button onClick={() => setActiveTab('mouse')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'mouse' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <MousePointer2 size={16} />
                <span className="hidden sm:inline">{t.tab_mouse}</span>
            </button>
            <button onClick={() => setActiveTab('pointer')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'pointer' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <PenTool size={16} />
                <span className="hidden sm:inline">{t.tab_pointer}</span>
            </button>
            <button onClick={() => setActiveTab('video')} className={`flex-1 min-w-[80px] py-3 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'video' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                <Film size={16} />
                <span className="hidden sm:inline">{t.tab_video}</span>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
            
            {activeTab === 'vibrate' && (
                <div className="flex flex-col gap-4 h-full justify-center max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
                    { !('vibrate' in navigator) && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center mb-4">
                            {t.vibrate_not_supported}
                        </div>
                    )}
                    <button onClick={() => vibrate(200)} className="py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-medium text-slate-700 dark:text-slate-200">
                        {t.vibrate_short}
                    </button>
                    <button onClick={() => vibrate(500)} className="py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-medium text-slate-700 dark:text-slate-200">
                        {t.vibrate_medium}
                    </button>
                    <button onClick={() => vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100])} className="py-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all active:scale-95 font-bold">
                        {t.vibrate_pattern}
                    </button>
                </div>
            )}

            {activeTab === 'touch' && (
                <div className="h-full flex flex-col animate-in fade-in duration-300">
                    <div className="bg-slate-900 rounded-xl overflow-hidden flex-1 relative shadow-inner border-2 border-slate-200 dark:border-slate-700 cursor-crosshair touch-none">
                        <canvas ref={canvasRef} className="w-full h-full block" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-mono pointer-events-none select-none">
                            {t.touch_count}: {touchCount}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'keyboard' && (
                <div className="h-full flex flex-col animate-in fade-in duration-300 gap-4">
                    {/* Last Key Display */}
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 shadow-sm">
                        {lastKey ? (
                            <>
                                {/* Large Font for emphasis */}
                                <div className="text-8xl md:text-9xl font-black text-indigo-600 dark:text-indigo-400 mb-6 animate-in zoom-in duration-100">
                                    {lastKey.key === ' ' ? 'Space' : lastKey.key}
                                </div>
                                <div className="flex gap-4 text-xs font-mono text-slate-500">
                                    <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                                        Code: {lastKey.code}
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                                        Time: {formatKeyTime(lastKey.timestamp)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-400 text-center opacity-50">
                                <Keyboard size={64} className="mx-auto mb-4" />
                                <p className="text-lg font-medium">{t.key_instruction}</p>
                            </div>
                        )}
                    </div>

                    {/* History */}
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 h-[100px] overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2 sticky top-0 bg-slate-100 dark:bg-slate-800/0 backdrop-blur-sm pb-1 flex justify-between">
                            <span>{t.key_history} ({keyHistory.length})</span>
                            {keyHistory.length > 0 && (
                                <button onClick={() => setKeyHistory([])} className="text-[10px] text-indigo-500 hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {keyHistory.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm animate-in zoom-in duration-200">
                                    {k === ' ' ? 'Space' : k}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="relative">
                        <input
                            ref={keyboardInputRef}
                            type="text"
                            placeholder={t.key_input_placeholder || "Type here..."}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium shadow-sm transition-all"
                            onKeyDown={handleKeyInput}
                            autoComplete="off"
                            autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Keyboard size={18} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'mouse' && (
                <div className="h-full flex flex-col animate-in fade-in duration-300">
                    <div 
                        onMouseMove={handleMouseMove}
                        className="flex-1 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-none flex flex-col items-center justify-center p-8 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <MousePointer2 size={32} className="text-indigo-300 dark:text-indigo-800 mb-4 opacity-50" />
                        <p className="text-slate-400 text-sm text-center max-w-xs mb-8 pointer-events-none select-none">
                            {t.mouse_instruction}
                        </p>

                        <div className="grid grid-cols-2 gap-8 w-full max-w-md pointer-events-none select-none relative z-10">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">{mouseRate}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.mouse_rate} (Hz)</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">{peakRate}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.mouse_peak} (Hz)</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button onClick={resetMouseStats} className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                            <RefreshCw size={12} />
                            Reset Stats
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'pointer' && (
                <PointerVisualizer t={t} />
            )}

            {activeTab === 'video' && (
                <VideoCapabilityMatrix t={t} />
            )}

        </div>

      </div>
    </div>
  );
};
