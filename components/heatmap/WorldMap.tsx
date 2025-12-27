
import React from 'react';
import { LatencyRegion, LatencyResult } from '../../services/detectors/globalLatency.ts';

interface WorldMapProps {
    regions: LatencyRegion[];
    results: Record<string, LatencyResult>;
    onRegionSelect?: (region: LatencyRegion) => void;
    className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ regions, results, onRegionSelect, className = "" }) => {
    const getColor = (latency?: number) => {
        if (latency === undefined) return 'fill-slate-300 dark:fill-slate-600';
        if (latency < 100) return 'fill-emerald-500 stroke-emerald-300';
        if (latency < 200) return 'fill-yellow-500 stroke-yellow-300';
        if (latency < 300) return 'fill-orange-500 stroke-orange-300';
        return 'fill-red-500 stroke-red-300';
    };

    const getGlow = (latency?: number) => {
        if (latency === undefined) return '';
        if (latency < 100) return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]';
        if (latency < 200) return 'drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]';
        return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    };

    return (
        <div className={`w-full h-full flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 1000 500"
                className="w-full h-full max-h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* World Map Silhouette - Simplified Geometry for Compliance & Aesthetics */}
                <g className="fill-slate-300 dark:fill-slate-700 stroke-white dark:stroke-slate-800 stroke-[0.5]">
                    {/* North America */}
                    <path d="M 50 50 L 250 50 L 300 150 L 200 250 L 100 200 L 50 100 Z" className="opacity-0" /> 
                    {/* Simplified Paths */}
                    
                    {/* Americas */}
                    <path d="M165,58 C165,58 290,27 347,79 C347,79 337,138 308,168 C308,168 318,187 330,195 C330,195 352,250 328,328 C328,328 300,420 278,395 C278,395 250,330 260,255 C260,255 240,230 245,210 C245,210 180,180 155,120 Z" />
                    
                    {/* Eurasia & Africa */}
                    <path d="M430,90 C430,90 550,60 750,70 C750,70 850,80 900,90 C900,90 920,150 850,200 C850,200 800,230 780,250 C780,250 750,300 720,290 C720,290 680,280 650,250 C650,250 630,300 600,350 C600,350 550,380 530,330 C530,330 480,280 450,220 C450,220 420,180 430,90 Z" />
                    
                    {/* Australia */}
                    <path d="M820,330 C820,330 920,320 940,360 C940,360 900,420 850,400 C850,400 800,380 820,330 Z" />

                    {/* Islands */}
                    {/* UK */}
                    <circle cx="475" cy="115" r="8" />
                    {/* Japan */}
                    <path d="M870,160 L890,140 L885,170 Z" />
                    {/* Taiwan */}
                    <circle cx="840" cy="195" r="4" className="fill-slate-300 dark:fill-slate-700" />
                    {/* Hainan */}
                    <circle cx="805" cy="210" r="3" className="fill-slate-300 dark:fill-slate-700" />
                    {/* Madagascar */}
                    <path d="M630,330 L650,350 L630,370 Z" />
                </g>

                {/* Nodes */}
                {regions.map((region) => {
                    const res = results[region.id];
                    const isActive = res?.status === 'pending';
                    const latency = res?.latency;
                    
                    // Map percentages to SVG coords (1000x500)
                    const cx = region.coordinates.x * 10;
                    const cy = region.coordinates.y * 5;

                    return (
                        <g 
                            key={region.id} 
                            onClick={() => onRegionSelect && onRegionSelect(region)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            {/* Pulse Effect for Active */}
                            {isActive && (
                                <circle cx={cx} cy={cy} r="20" className="fill-indigo-500 opacity-20 animate-ping pointer-events-none" />
                            )}
                            
                            {/* Hit Area (Larger) */}
                            <circle cx={cx} cy={cy} r="15" className="fill-transparent" />

                            {/* Node Dot */}
                            <circle 
                                cx={cx} 
                                cy={cy} 
                                r={isActive ? 6 : 4} 
                                className={`transition-all duration-500 ${getColor(latency)} ${getGlow(latency)}`} 
                            />
                            
                            {/* Label on Hover */}
                            <title>{region.name} {latency ? `(${latency}ms)` : ''}</title>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
