// components/video/LiveBenchmarkCard.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Square, Activity, Gauge, AlertCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface LiveBenchmarkCardProps {
    t: Translation['hardwareToolsModal'];
}

interface BenchmarkResult {
    fps: number;
    droppedFrames: number;
    avgFrameTime: number;
    stability: number;
    rating: 'excellent' | 'good' | 'poor';
}

export const LiveBenchmarkCard: React.FC<LiveBenchmarkCardProps> = ({ t }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFps, setCurrentFps] = useState<number | null>(null);
    const [result, setResult] = useState<BenchmarkResult | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const benchmarkDataRef = useRef<{
        startTime: number;
        lastFrameTime: number;
        frameCount: number;
        droppedCount: number;
        frameTimes: number[];
    }>({
        startTime: 0,
        lastFrameTime: 0,
        frameCount: 0,
        droppedCount: 0,
        frameTimes: []
    });

    const stopBenchmark = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }

        const data = benchmarkDataRef.current;
        const totalDuration = (performance.now() - data.startTime) / 1000;

        if (totalDuration > 0.5 && data.frameCount > 10) {
            const calculatedFps = Math.round((data.frameCount / totalDuration) * 10) / 10;
            const avgTime =
                data.frameTimes.length > 0
                    ? Math.round((data.frameTimes.reduce((a, b) => a + b, 0) / data.frameTimes.length) * 10) / 10
                    : 16.6;

            const onTimeFrames = data.frameTimes.filter((t) => t < 22).length;
            const stability = Math.round((onTimeFrames / (data.frameTimes.length || 1)) * 100);

            let rating: 'excellent' | 'good' | 'poor' = 'poor';
            if (calculatedFps >= 55 && data.droppedCount <= 2 && stability >= 90) {
                rating = 'excellent';
            } else if (calculatedFps >= 45 && stability >= 75) {
                rating = 'good';
            }

            setResult({
                fps: calculatedFps,
                droppedFrames: data.droppedCount,
                avgFrameTime: avgTime,
                stability,
                rating
            });
        }

        setIsRunning(false);
        setProgress(100);
    }, []);

    const startBenchmark = () => {
        setResult(null);
        setIsRunning(true);
        setProgress(0);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const durationMs = 5000;
        const startTime = performance.now();
        benchmarkDataRef.current = {
            startTime,
            lastFrameTime: startTime,
            frameCount: 0,
            droppedCount: 0,
            frameTimes: []
        };

        let lastFpsUpdate = startTime;
        let framesSinceLastUpdate = 0;

        const renderLoop = (now: number) => {
            const elapsed = now - startTime;
            if (elapsed >= durationMs) {
                stopBenchmark();
                return;
            }

            setProgress(Math.min(100, Math.round((elapsed / durationMs) * 100)));

            const delta = now - benchmarkDataRef.current.lastFrameTime;
            benchmarkDataRef.current.lastFrameTime = now;
            benchmarkDataRef.current.frameCount += 1;
            benchmarkDataRef.current.frameTimes.push(delta);

            if (delta > 26) {
                benchmarkDataRef.current.droppedCount += 1;
            }

            framesSinceLastUpdate += 1;
            if (now - lastFpsUpdate >= 500) {
                const liveFps = Math.round((framesSinceLastUpdate / ((now - lastFpsUpdate) / 1000)) * 10) / 10;
                setCurrentFps(liveFps);
                framesSinceLastUpdate = 0;
                lastFpsUpdate = now;
            }

            // Procedural complex stress rendering
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);

            const timeSec = now * 0.003;
            const rings = 8;
            for (let i = 0; i < rings; i++) {
                const radius = 20 + i * 16 + Math.sin(timeSec + i) * 6;
                const angle = timeSec * (i % 2 === 0 ? 1 : -1) + (i * Math.PI) / 4;
                ctx.beginPath();
                ctx.arc(centerX + Math.cos(angle) * 20, centerY + Math.sin(angle) * 20, Math.max(2, radius), 0, Math.PI * 2);
                ctx.strokeStyle = `hsl(${(timeSec * 40 + i * 35) % 360}, 85%, 65%)`;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }

            // Central rotating star
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(timeSec * 2);
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const r = j % 2 === 0 ? 30 : 12;
                const theta = (j * Math.PI) / 3;
                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            animFrameRef.current = requestAnimationFrame(renderLoop);
        };

        animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    useEffect(() => {
        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                        <Activity size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            {t.live_benchmark_title || 'Live Rendering & Decode Stress Test'}
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                                {t.benchmark_stress_badge || '5s Stress'}
                            </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.live_benchmark_desc || 'Benchmarks real-time rendering throughput, frame stability, and drop rate under high load.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    {!isRunning ? (
                        <button
                            onClick={startBenchmark}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Play size={12} fill="currentColor" />
                            {t.btn_start_benchmark || 'Run Benchmark'}
                        </button>
                    ) : (
                        <button
                            onClick={stopBenchmark}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 bg-rose-600 border-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-95 cursor-pointer"
                        >
                            <Square size={12} fill="currentColor" />
                            {t.btn_stop_benchmark || 'Stop'}
                        </button>
                    )}
                </div>
            </div>

            {/* Benchmark Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Visual Canvas Stage */}
                <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video max-h-40 flex items-center justify-center border border-slate-700/60 shadow-inner">
                    <canvas ref={canvasRef} width={320} height={180} className="w-full h-full object-contain" />
                    {isRunning && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {currentFps ? `${currentFps} FPS` : (t.benchmark_testing || 'Testing...')}
                        </div>
                    )}
                    {isRunning && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                            <div className="h-full bg-indigo-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                        </div>
                    )}
                    {!isRunning && !result && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] text-slate-400 text-xs gap-1.5">
                            <Gauge size={20} className="text-slate-500" />
                            <span>{t.benchmark_status_idle || 'Ready to Test'}</span>
                        </div>
                    )}
                </div>

                {/* Metrics Display */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Actual FPS */}
                    <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {t.benchmark_fps || 'Actual FPS'}
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {result ? `${result.fps}` : isRunning ? `${currentFps || '--'}` : '--'}
                        </div>
                    </div>

                    {/* Dropped Frames */}
                    <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <AlertCircle size={10} className="text-rose-400" />
                            {t.benchmark_dropped || 'Dropped Frames'}
                        </div>
                        <div className={`text-lg font-bold mt-0.5 ${result && result.droppedFrames > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {result ? result.droppedFrames : '--'}
                        </div>
                    </div>

                    {/* Avg Frame Time */}
                    <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock size={10} />
                            {t.benchmark_avg_time || 'Avg Frame Time'}
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {result ? `${result.avgFrameTime} ms` : '--'}
                        </div>
                    </div>

                    {/* Pacing Stability */}
                    <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {t.benchmark_stability || 'Stability'}
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {result ? `${result.stability}%` : '--'}
                        </div>
                    </div>

                    {/* Rating Banner if result exists */}
                    {result && (
                        <div className="col-span-2 sm:col-span-4 p-2 rounded-lg border flex items-center justify-between text-xs font-semibold bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-200">
                            <span className="flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-500" />
                                {result.rating === 'excellent'
                                    ? t.benchmark_rating_excellent || 'Excellent (Smooth HW)'
                                    : result.rating === 'good'
                                    ? t.benchmark_rating_good || 'Good (Minor Jitter)'
                                    : t.benchmark_rating_poor || 'Poor (Frame Drops Detected)'}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px] opacity-80">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                {t.benchmark_pass_badge || 'Pass'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
