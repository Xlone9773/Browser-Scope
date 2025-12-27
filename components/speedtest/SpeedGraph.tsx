
import React, { useEffect, useRef } from 'react';
import { TestState } from '../../hooks/useSpeedTest';

interface SpeedGraphProps {
    data: number[];
    testState: TestState;
    height?: number;
}

export const SpeedGraph: React.FC<SpeedGraphProps> = ({ data, testState, height = 256 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const h = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, h);

            // Grid Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=1; i<5; i++) {
                const y = (h / 5) * i;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Draw Speed Line
            if (data.some(s => s > 0)) {
                const maxVal = Math.max(...data, 10) * 1.2; // 20% headroom
                const stepX = width / (data.length - 1);

                // Gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, testState === 'upload' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(16, 185, 129, 0.5)'); // Purple for UP, Green for Down
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.moveTo(0, h);
                
                data.forEach((val, i) => {
                    const x = i * stepX;
                    const y = h - (val / maxVal) * h;
                    ctx.lineTo(x, y);
                });

                ctx.lineTo(width, h);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();

                // Stroke Line
                ctx.beginPath();
                data.forEach((val, i) => {
                    const x = i * stepX;
                    const y = h - (val / maxVal) * h;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.strokeStyle = testState === 'upload' ? '#a855f7' : '#10b981';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);
        
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [data, testState]);

    return (
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={height} 
            className="absolute inset-0 w-full h-full opacity-50" 
        />
    );
};
