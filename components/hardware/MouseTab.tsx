
import React, { useState, useRef } from 'react';
import { MousePointer2, RefreshCw } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { formatNumber } from '../../utils/formatters';

interface MouseTabProps {
    t: Translation['hardwareToolsModal'];
}

export const MouseTab: React.FC<MouseTabProps> = ({ t }) => {
    const [mouseRate, setMouseRate] = useState(0);
    const [peakRate, setPeakRate] = useState(0);
    const mouseTimestamps = useRef<number[]>([]);
    const mouseRaf = useRef<number | null>(null);

    const handleMouseMove = (_e: React.MouseEvent) => {
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
                        <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">{formatNumber(mouseRate)}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{t.mouse_rate} (Hz)</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">{formatNumber(peakRate)}</div>
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
    );
};
