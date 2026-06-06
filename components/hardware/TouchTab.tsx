
import React, { useState, useEffect, useRef } from 'react';
import { Translation } from '../../utils/i18n/types';

interface TouchTabProps {
    t: Translation['hardwareToolsModal'];
}

export const TouchTab: React.FC<TouchTabProps> = ({ t }) => {
    const [touchCount, setTouchCount] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
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

            touches.forEach((t, _id) => {
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
    }, [t.touch_instruction]);

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-xl overflow-hidden flex-1 relative shadow-inner border-2 border-slate-200 dark:border-slate-700 cursor-crosshair touch-none">
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-mono pointer-events-none select-none">
                    {t.touch_count}: {touchCount}
                </div>
            </div>
        </div>
    );
};
