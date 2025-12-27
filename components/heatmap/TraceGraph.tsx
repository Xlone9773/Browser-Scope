
import React, { useEffect, useRef } from 'react';

interface TraceGraphProps {
    data: (number | null)[]; // null represents timeout/loss
    height?: number;
    color?: string;
}

export const TraceGraph: React.FC<TraceGraphProps> = ({ data, height = 200, color = '#6366f1' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const h = canvas.height;

        // Clear
        ctx.clearRect(0, 0, width, h);

        // Find range
        const validValues = data.filter(v => v !== null) as number[];
        const maxVal = validValues.length > 0 ? Math.max(...validValues, 100) * 1.2 : 200;
        const minVal = validValues.length > 0 ? Math.min(...validValues) * 0.8 : 0;
        const range = maxVal - minVal || 100;

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=1; i<5; i++) {
            const y = (h / 5) * i;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        if (data.length < 2) return;

        const stepX = width / (data.length - 1);

        // Draw Line
        ctx.beginPath();
        let started = false;

        data.forEach((val, i) => {
            const x = i * stepX;
            
            if (val === null) {
                // Draw a gap or marker for loss?
                // Let's break the line to indicate loss
                started = false; 
            } else {
                const y = h - ((val - minVal) / range) * (h - 20) - 10; // 10px padding
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Loss Markers (Red dots at bottom)
        ctx.fillStyle = '#ef4444';
        data.forEach((val, i) => {
            if (val === null) {
                const x = i * stepX;
                ctx.beginPath();
                ctx.rect(x - 2, h - 10, 4, 10);
                ctx.fill();
            }
        });

        // Draw Dots for points
        ctx.fillStyle = color;
        data.forEach((val, i) => {
            if (val !== null) {
                const x = i * stepX;
                const y = h - ((val - minVal) / range) * (h - 20) - 10;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI*2);
                ctx.fill();
            }
        });

    }, [data, height, color]);

    return (
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={height} 
            className="w-full h-full"
        />
    );
};
