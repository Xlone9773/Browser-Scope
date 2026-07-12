
import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Move, Minus } from 'lucide-react';

interface FloatingWindowProps {
    title: string;
    onClose: () => void; // Docks back
    children: React.ReactNode;
    initialWidth?: number;
    initialHeight?: number;
}

type DragMode = 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se';

export const FloatingWindow: React.FC<FloatingWindowProps> = ({ 
    title, 
    onClose, 
    children, 
    initialWidth = 600, 
    initialHeight = 400 
}) => {
    // Initial position centered
    const [rect, setRect] = useState({
        x: typeof window !== 'undefined' ? Math.max(50, window.innerWidth / 2 - initialWidth / 2) : 50,
        y: typeof window !== 'undefined' ? Math.max(50, window.innerHeight / 2 - initialHeight / 2) : 50,
        w: initialWidth,
        h: initialHeight
    });

    const windowRef = useRef<HTMLDivElement | null>(null);
    const dragModeRef = useRef<DragMode | null>(null);
    const startPosRef = useRef({ x: 0, y: 0 });
    const startRectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, mode: DragMode) => {
        if (dragModeRef.current !== null) {
            return null;
        }

        e.preventDefault();
        e.stopPropagation();
        
        const target = e.currentTarget;
        target.setPointerCapture(e.pointerId);
        
        dragModeRef.current = mode;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        
        if (windowRef.current !== null) {
            const rectDOM = windowRef.current.getBoundingClientRect();
            startRectRef.current = { 
                x: rectDOM.left, 
                y: rectDOM.top, 
                w: rectDOM.width, 
                h: rectDOM.height 
            };
        } else {
            startRectRef.current = { ...rect };
        }

        document.body.style.userSelect = 'none';
        document.body.style.cursor = mode === 'move' ? 'move' : (mode.includes('nw') || mode.includes('se') ? 'nwse-resize' : 'nesw-resize');

        const handleMove = (ev: PointerEvent) => {
            if (dragModeRef.current === null) {
                return null;
            }
            ev.preventDefault();

            const dx = ev.clientX - startPosRef.current.x;
            const dy = ev.clientY - startPosRef.current.y;
            const s = startRectRef.current;
            const currentMode = dragModeRef.current;

            const newRect = { ...s };
            const minSize = 300;

            if (currentMode === 'move') {
                newRect.x = s.x + dx;
                newRect.y = s.y + dy;
            } else {
                if (currentMode.includes('e')) {
                    newRect.w = Math.max(minSize, s.w + dx);
                }
                if (currentMode.includes('s')) {
                    newRect.h = Math.max(minSize, s.h + dy);
                }
                if (currentMode.includes('w')) {
                    const newW = Math.max(minSize, s.w - dx);
                    newRect.w = newW;
                    newRect.x = s.x + (s.w - newW);
                }
                if (currentMode.includes('n')) {
                    const newH = Math.max(minSize, s.h - dy);
                    newRect.h = newH;
                    newRect.y = s.y + (s.h - newH);
                }
            }

            // Direct DOM manipulation for zero-latency dragging
            if (windowRef.current !== null) {
                windowRef.current.style.left = `${newRect.x}px`;
                windowRef.current.style.top = `${newRect.y}px`;
                windowRef.current.style.width = `${newRect.w}px`;
                windowRef.current.style.height = `${newRect.h}px`;
            }
            
            return null;
        };

        const handleUp = (ev: PointerEvent) => {
            target.releasePointerCapture(ev.pointerId);
            dragModeRef.current = null;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('pointercancel', handleUp);
            
            if (windowRef.current !== null) {
                setRect({
                    x: parseFloat(windowRef.current.style.left) || startRectRef.current.x,
                    y: parseFloat(windowRef.current.style.top) || startRectRef.current.y,
                    w: parseFloat(windowRef.current.style.width) || startRectRef.current.w,
                    h: parseFloat(windowRef.current.style.height) || startRectRef.current.h,
                });
            }
            
            return null;
        };

        window.addEventListener('pointermove', handleMove, { passive: false });
        window.addEventListener('pointerup', handleUp);
        window.addEventListener('pointercancel', handleUp);
        
        return null;
    }, [rect]);

    const handleStopPropagation = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        return null;
    };

    return typeof document !== 'undefined' ? createPortal(
        <div 
            ref={windowRef}
            contentEditable={false}
            className="fixed z-[9999] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 transition-shadow duration-200"
            style={{
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.w}px`,
                height: `${rect.h}px`,
                boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
        >
            {/* Header / Drag Handle */}
            <div 
                className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-3 cursor-move touch-none select-none shrink-0 group"
                onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
                <div className="flex items-center gap-2 text-slate-300">
                    <Move size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold tracking-wide uppercase">{title}</span>
                </div>
                <div className="flex items-center gap-1" onPointerDown={handleStopPropagation}>
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                        title="Dock back to settings"
                    >
                        <Minus size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative bg-slate-950 flex flex-col">
                {children}
            </div>

            {/* Resize Handles */}
            <div 
                className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize touch-none z-50 opacity-0 hover:opacity-100 bg-white/10 transition-opacity rounded-br"
                onPointerDown={(e) => handlePointerDown(e, 'resize-nw')}
            />
            <div 
                className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize touch-none z-50 opacity-0 hover:opacity-100 bg-white/10 transition-opacity rounded-bl"
                onPointerDown={(e) => handlePointerDown(e, 'resize-ne')}
            />
            <div 
                className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize touch-none z-50 opacity-0 hover:opacity-100 bg-white/10 transition-opacity rounded-tr"
                onPointerDown={(e) => handlePointerDown(e, 'resize-sw')}
            />
            
            <div 
                className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize touch-none z-50 flex items-end justify-end p-1 hover:bg-white/5"
                onPointerDown={(e) => handlePointerDown(e, 'resize-se')}
            >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-slate-500">
                    <path d="M8 8H0L8 0V8Z" fill="currentColor" opacity="0.5"/>
                </svg>
            </div>
        </div>,
        document.body
    ) : null;
};

