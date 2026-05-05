
import React, { useEffect, useState } from 'react';
import { Cpu, Loader2 } from 'lucide-react';

export const ModalLoading: React.FC<{ initializingText?: string, loadingText?: string }> = ({ 
    initializingText = "Initializing", 
    loadingText = "Loading Module Resource" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation frame to ensure the transition happens after mount
    // Using double RAF to ensure browser paint cycle has registered the initial state
    const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]"
    >
        <div 
            className={`
                relative bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl shadow-2xl 
                border border-white/20 dark:border-indigo-500/30 
                flex flex-col items-center gap-6 
                transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}
            `}
        >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 blur-xl rounded-2xl pointer-events-none" />

            {/* Central Tech Spinner */}
            <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-100 dark:border-slate-700" />
                
                {/* Spinning Segment */}
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                
                {/* Inner Pulsing Core */}
                <div className="relative z-10 w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
                    <Cpu className="text-indigo-500 animate-pulse" size={28} />
                </div>

                {/* Satellite Particle */}
                <div className="absolute -inset-2 animate-[spin_3s_linear_infinite_reverse]">
                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)] absolute top-0 left-1/2 -translate-x-1/2" />
                </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-2">
                    {initializingText}
                    <span className="flex gap-1">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                    </span>
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
                    {loadingText}
                </p>
            </div>

            {/* Bottom Progress Bar Decoration */}
            <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-[200%] animate-[shimmer_2s_infinite_linear]" />
            </div>
        </div>
    </div>
  );
};
