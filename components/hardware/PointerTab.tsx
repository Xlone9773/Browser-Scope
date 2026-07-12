
import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, RefreshCw, PenTool, Hand } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { formatNumber } from '../../utils/formatters';

interface PointerTabProps {
    t: Translation['hardwareToolsModal'];
}

export const PointerTab: React.FC<PointerTabProps> = ({ t }) => {
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

        const pointers = new Map<number, { lastX: number, lastY: number }>();

        const handlePointerDown = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            const lastX = e.clientX - rect.left;
            const lastY = e.clientY - rect.top;
            
            pointers.set(e.pointerId, { lastX, lastY });
            
            // Capture for dragging outside canvas
            canvas.setPointerCapture(e.pointerId);
            
            updateData(e);
        };

        const handlePointerMove = (e: PointerEvent) => {
            updateData(e);
            
            const pointer = pointers.get(e.pointerId);
            if (!pointer) return;
            
            // Handle hover state
            if (e.pointerType === 'mouse' && e.buttons === 0) {
                return;
            }
            if (e.pointerType !== 'mouse' && e.pressure === 0) {
                pointer.lastX = e.clientX - canvas.getBoundingClientRect().left;
                pointer.lastY = e.clientY - canvas.getBoundingClientRect().top;
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Use reported pressure, or default 0.5 for mouse if button pressed
            let p = e.pressure;
            if (e.pointerType === 'mouse' && e.buttons === 1) p = 0.5;
            
            drawLine(pointer.lastX, pointer.lastY, x, y, p, e.pointerType);
            pointer.lastX = x;
            pointer.lastY = y;
        };

        const handlePointerUp = (e: PointerEvent) => {
            pointers.delete(e.pointerId);
            updateData(e); // keep final data visible
        };

        const handlePointerCancel = (e: PointerEvent) => {
            pointers.delete(e.pointerId);
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

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointercancel', handlePointerCancel);
        
        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointercancel', handlePointerCancel);
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
                        <span className="font-mono text-xs w-8 text-right">{formatNumber(pointerData.pressure, 2, 2)}</span>
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
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-200">{formatNumber(pointerData.width, 0)}x{formatNumber(pointerData.height, 0)} px</div>
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
