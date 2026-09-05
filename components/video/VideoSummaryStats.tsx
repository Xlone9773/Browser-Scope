// components/video/VideoSummaryStats.tsx
import React from 'react';
import { Zap, Film, Cpu, Tv } from 'lucide-react';
import { VideoSummaryStats as StatsType } from '../../hooks/useVideoDecodeTests';
import { Translation } from '../../utils/i18n/types';

interface VideoSummaryStatsProps {
    stats: StatsType;
    t: Translation['hardwareToolsModal'];
    isTesting: boolean;
}

export const VideoSummaryStats: React.FC<VideoSummaryStatsProps> = ({ stats, t, isTesting }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* HW Accelerated Codecs */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                    <Zap size={20} className={isTesting ? 'animate-pulse' : ''} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        {t.stat_hw_supported || 'HW Accelerated'}
                    </div>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
                        {stats.hwCount}
                        <span className="text-xs font-normal text-slate-400">{t.stat_codecs_unit || 'codecs'}</span>
                    </div>
                </div>
            </div>

            {/* Total Formats Supported */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center shrink-0">
                    <Film size={20} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        {t.stat_total_codecs || 'Total Supported'}
                    </div>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
                        {stats.supportedCount}
                        <span className="text-xs font-normal text-slate-400">/ {stats.totalCount}</span>
                    </div>
                </div>
            </div>

            {/* Highest Spec Capable */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center shrink-0">
                    <Tv size={20} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        {t.stat_max_res || 'Max Specification'}
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {stats.maxSpec}
                    </div>
                </div>
            </div>

            {/* WebCodecs API Status */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/40 flex items-center justify-center shrink-0">
                    <Cpu size={20} />
                </div>
                <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        {t.stat_webcodecs || 'WebCodecs API'}
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${stats.webCodecsStatus === 'Supported' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {stats.webCodecsStatus === 'Supported' ? (t.stat_supported_status || 'Supported') : (t.stat_unavailable_status || 'Unavailable')}
                    </div>
                </div>
            </div>
        </div>
    );
};
