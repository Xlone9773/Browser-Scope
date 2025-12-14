
import React, { useState, useEffect, useRef } from 'react';
import { X, Smartphone, Hand } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface HardwareToolsModalProps {
  onClose: () => void;
  t: Translation['hardwareToolsModal'];
}

export const HardwareToolsModal: React.FC<HardwareToolsModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<'vibrate' | 'touch'>('vibrate');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [touchCount, setTouchCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Start animation on mount, increased delay for reliability
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

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
            isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
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
        <div className="flex bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <button onClick={() => setActiveTab('vibrate')} className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'vibrate' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.tab_vibrate}
            </button>
            <button onClick={() => setActiveTab('touch')} className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'touch' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.tab_touch}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
            
            {activeTab === 'vibrate' && (
                <div className="flex flex-col gap-4 h-full justify-center max-w-sm mx-auto">
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
                <div className="h-full flex flex-col">
                    <div className="bg-slate-900 rounded-xl overflow-hidden flex-1 relative shadow-inner border-2 border-slate-200 dark:border-slate-700 cursor-crosshair touch-none">
                        <canvas ref={canvasRef} className="w-full h-full block" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-mono pointer-events-none select-none">
                            {t.touch_count}: {touchCount}
                        </div>
                    </div>
                </div>
            )}

        </div>

      </div>
    </div>
  );
};
