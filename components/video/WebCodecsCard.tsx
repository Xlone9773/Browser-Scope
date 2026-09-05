// components/video/WebCodecsCard.tsx
import React from 'react';
import { Cpu, CheckCircle2, XCircle, Zap, Info } from 'lucide-react';
import { WebCodecsSupportInfo } from '../../hooks/useVideoDecodeTests';
import { Translation } from '../../utils/i18n/types';

interface WebCodecsCardProps {
    data: WebCodecsSupportInfo | null;
    t: Translation['hardwareToolsModal'];
}

export const WebCodecsCard: React.FC<WebCodecsCardProps> = ({ data, t }) => {
    const apis = [
        { name: t.webcodecs_video_decoder || 'VideoDecoder', supported: data?.videoDecoder ?? false },
        { name: t.webcodecs_video_encoder || 'VideoEncoder', supported: data?.videoEncoder ?? false },
        { name: t.webcodecs_audio_decoder || 'AudioDecoder', supported: data?.audioDecoder ?? false },
        { name: t.webcodecs_audio_encoder || 'AudioEncoder', supported: data?.audioEncoder ?? false }
    ];

    const hwCodecs = [
        { name: 'H.264 (AVC)', status: data?.codecsHwStatus?.h264 },
        { name: 'VP9', status: data?.codecsHwStatus?.vp9 },
        { name: 'AV1', status: data?.codecsHwStatus?.av1 },
        { name: 'HEVC (H.265)', status: data?.codecsHwStatus?.hevc }
    ];

    return (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {t.webcodecs_title || 'WebCodecs API Low-Latency Decoding'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.webcodecs_desc || 'Direct frame-by-frame GPU decoding for cloud gaming and WebAssembly.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                    <Info size={12} />
                    <span>{t.webcodecs_standard_badge || 'W3C Standard'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Core API Interfaces */}
                <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        {t.webcodecs_core_interfaces || 'Core API Interfaces'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {apis.map((api) => (
                            <div
                                key={api.name}
                                className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                                    api.supported
                                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-slate-800 dark:text-slate-200'
                                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
                                }`}
                            >
                                <span className="font-mono font-medium">{api.name}</span>
                                {api.supported ? (
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                ) : (
                                    <XCircle size={14} className="text-slate-400 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Direct Hardware Acceleration Probes */}
                <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Zap size={12} className="text-amber-500" />
                        {t.webcodecs_hw_accel || 'Direct GPU Acceleration'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {hwCodecs.map((item) => (
                            <div
                                key={item.name}
                                className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                                    item.status === true
                                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/60 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-200'
                                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
                                }`}
                            >
                                <span className="font-medium">{item.name}</span>
                                {item.status === true ? (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                        {t.webcodecs_hw_badge || 'HW'}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-mono text-slate-400">{t.webcodecs_sw_na || 'SW / N/A'}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
