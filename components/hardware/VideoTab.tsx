
import React, { useState, useEffect } from 'react';
import { Film, Battery, Zap, Check, X, MonitorPlay, Sun, Music, Speaker, Tv } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface VideoTabProps {
    t: Translation['hardwareToolsModal'];
    values: Translation['values'];
    labels: Translation['labels'];
}

export const VideoTab: React.FC<VideoTabProps> = ({ t, values, labels }) => {
    const [videoResults, setVideoResults] = useState<any[]>([]);
    const [audioResults, setAudioResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const [isTesting, setIsTesting] = useState(false);

    // --- Video Configuration ---
    const videoCodecs = [
        // Standard SDR
        { 
            name: 'H.264 (AVC)', 
            profile: 'High Profile',
            type: 'video/mp4; codecs="avc1.640033"', 
            bitDepth: 8,
            tag: 'SDR'
        },
        { 
            name: 'HEVC (H.265)', 
            profile: 'Main',
            type: 'video/mp4; codecs="hvc1.1.6.L150.B0"', 
            bitDepth: 8,
            tag: 'SDR'
        },
        { 
            name: 'VP9', 
            profile: 'Profile 0',
            type: 'video/webm; codecs="vp09.00.51.08.01.01.01.01.00"', 
            bitDepth: 8,
            tag: 'SDR'
        },
        { 
            name: 'AV1', 
            profile: 'Main',
            type: 'video/mp4; codecs="av01.0.09M.08"', 
            bitDepth: 8,
            tag: 'SDR'
        },
        
        // HDR Standards
        { 
            name: 'HEVC (H.265)', 
            profile: 'Main 10 (HDR10)',
            type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
            hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'HDR10'
        },
        { 
            name: 'HEVC (H.265)', 
            profile: 'Main 10 (HLG)',
            type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
            hdrConfig: { transferFunction: 'hlg', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'HLG'
        },
        { 
            name: 'VP9', 
            profile: 'Profile 2 (HDR10)',
            type: 'video/webm; codecs="vp09.02.51.10.01.09.16.09.01"', 
            hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'HDR10'
        },
        { 
            name: 'AV1', 
            profile: 'Main 10 (HDR10)',
            type: 'video/mp4; codecs="av01.0.12M.10"', 
            hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'HDR10'
        },

        // Dolby Vision
        { 
            name: 'Dolby Vision', 
            profile: 'Profile 5 (HEVC)',
            type: 'video/mp4; codecs="dvhe.05.06"', 
            // DV often implies its own color management, but specifying PQ helps some browsers
            hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'Dolby'
        },
        { 
            name: 'Dolby Vision', 
            profile: 'Profile 8 (HEVC)',
            type: 'video/mp4; codecs="dvhe.08.06"', 
            hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
            bitDepth: 10,
            tag: 'Dolby'
        },

        // Legacy
        { 
            name: 'Ogg Theora', 
            profile: 'Theora',
            type: 'video/ogg; codecs="theora"', 
            bitDepth: 8,
            tag: 'Legacy' 
        },
    ];

    const videoResolutions = [
        { label: '1080p', width: 1920, height: 1080, fps: 60, bitrate: 8000000 },
        { label: '4K', width: 3840, height: 2160, fps: 60, bitrate: 35000000 },
        { label: '8K', width: 7680, height: 4320, fps: 30, bitrate: 60000000 },
    ];

    // --- Audio Configuration ---
    const audioCodecs = [
        // Common Web
        { name: 'AAC (LC)', type: 'audio/mp4; codecs="mp4a.40.2"', label: 'AAC', tag: 'Web' },
        { name: 'MP3', type: 'audio/mpeg', label: 'MP3', tag: 'Web' },
        { name: 'Opus', type: 'audio/webm; codecs="opus"', label: 'Opus', tag: 'Web' },
        
        // High Fidelity / Lossless
        { name: 'FLAC', type: 'audio/flac', label: 'FLAC', tag: 'Hi-Res' },
        { name: 'WAV (PCM)', type: 'audio/wav; codecs="1"', label: 'PCM', tag: 'Hi-Res' },
        
        // Cinema / Surround
        { name: 'Dolby Digital', type: 'audio/mp4; codecs="ac-3"', label: 'AC-3', tag: 'Dolby' },
        { name: 'Dolby Digital+', type: 'audio/mp4; codecs="ec-3"', label: 'E-AC-3', tag: 'Dolby' },
        { name: 'DTS', type: 'audio/mp4; codecs="dtsc"', label: 'DTS', tag: 'DTS' },
    ];

    const audioConfigs = [
        { label: 'Stereo', channels: '2', bitrate: 192000, samplerate: 48000 },
        { label: '5.1', channels: '5.1', bitrate: 448000, samplerate: 48000 },
        { label: '7.1', channels: '7.1', bitrate: 768000, samplerate: 48000 },
    ];

    useEffect(() => {
        const runTests = async () => {
            setIsTesting(true);
            const tempVideoResults: any[] = [];
            const tempAudioResults: any[] = [];
            
            let done = 0;
            const total = (videoCodecs.length * videoResolutions.length) + (audioCodecs.length * audioConfigs.length);

            // --- Run Video Tests ---
            for (const codec of videoCodecs) {
                const row = { 
                    codec: codec.name, 
                    profile: codec.profile, 
                    bitDepth: codec.bitDepth,
                    tag: codec.tag, 
                    tests: [] as any[] 
                };

                const resPromises = videoResolutions.map(async (res) => {
                    try {
                        // @ts-ignore
                        if (navigator.mediaCapabilities) {
                            const config: any = {
                                type: 'file', 
                                video: {
                                    contentType: codec.type,
                                    width: res.width,
                                    height: res.height,
                                    bitrate: res.bitrate,
                                    framerate: res.fps,
                                }
                            };

                            // Add HDR config if present
                            if ((codec as any).hdrConfig) {
                                Object.assign(config.video, (codec as any).hdrConfig);
                            }

                            // @ts-ignore
                            const info = await navigator.mediaCapabilities.decodingInfo(config);
                            return {
                                ...res,
                                supported: info.supported,
                                smooth: info.smooth,
                                efficient: info.powerEfficient
                            };
                        } else {
                            return { ...res, error: 'API N/A' };
                        }
                    } catch (e) {
                        return { ...res, supported: false };
                    }
                });

                const resResults = await Promise.all(resPromises);
                row.tests = resResults;
                tempVideoResults.push(row);
                
                done += videoResolutions.length;
                setProgress(Math.round((done / total) * 100));
                setVideoResults([...tempVideoResults]);
            }

            // --- Run Audio Tests ---
            for (const codec of audioCodecs) {
                const row = {
                    codec: codec.name,
                    label: codec.label,
                    tag: codec.tag,
                    tests: [] as any[]
                };

                const audioPromises = audioConfigs.map(async (conf) => {
                    try {
                        // @ts-ignore
                        if (navigator.mediaCapabilities) {
                            const config = {
                                type: 'file',
                                audio: {
                                    contentType: codec.type,
                                    channels: conf.channels,
                                    bitrate: conf.bitrate,
                                    samplerate: conf.samplerate
                                }
                            };
                            // @ts-ignore
                            const info = await navigator.mediaCapabilities.decodingInfo(config);
                            return {
                                ...conf,
                                supported: info.supported,
                                smooth: info.smooth,
                                efficient: info.powerEfficient
                            };
                        } else {
                            return { ...conf, error: 'API N/A' };
                        }
                    } catch (e) {
                        return { ...conf, supported: false };
                    }
                });

                const audResults = await Promise.all(audioPromises);
                row.tests = audResults;
                tempAudioResults.push(row);

                done += audioConfigs.length;
                setProgress(Math.round((done / total) * 100));
                setAudioResults([...tempAudioResults]);
            }

            setIsTesting(false);
        };

        runTests();
    }, []);

    const getTagColor = (tag: string) => {
        switch(tag) {
            case 'HDR10': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
            case 'HLG': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
            case 'Dolby': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50';
            case 'DTS': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
            case 'Hi-Res': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
            case 'SDR': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
        }
    };

    return (
        <div className="h-full overflow-y-auto animate-in fade-in duration-300 custom-scrollbar pb-4">
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MonitorPlay size={16} />
                    {isTesting ? t.video_instruction : t.tab_video}
                </div>
                {isTesting ? (
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{progress}%</span>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <Check size={14} /> Done
                    </span>
                )}
            </div>

            {/* Video Section */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                    <Film size={14} />
                    {labels.video_codecs}
                </h3>
                <div className="space-y-3">
                    {videoResults.map((row, rIdx) => (
                        <div key={rIdx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 whitespace-nowrap">{row.codec}</h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 truncate">({row.profile})</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${row.bitDepth === 10 ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                                        {row.bitDepth}-bit
                                    </span>
                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTagColor(row.tag)}`}>
                                        {row.tag === 'Dolby' ? 'Vision' : row.tag}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700">
                                {row.tests.map((test: any, idx: number) => (
                                    <div key={idx} className={`p-3 flex flex-col gap-1.5 items-center justify-center text-center transition-colors ${test.supported ? '' : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-60'}`}>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{test.label}</span>
                                        
                                        {test.error ? (
                                            <span className="text-xs text-red-400">API Error</span>
                                        ) : !test.supported ? (
                                            <span className="text-xs font-bold text-slate-300 dark:text-slate-600">{values.not_supported}</span>
                                        ) : (
                                            <div className="flex gap-2">
                                                <div 
                                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${test.efficient ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800'}`} 
                                                    title={test.efficient ? 'Hardware Accelerated (Efficient)' : 'Software Decoding (Power Hungry)'}
                                                >
                                                    {test.efficient ? <Battery size={12} /> : <Zap size={12} />}
                                                    <span className="text-[10px] font-medium hidden sm:inline">{test.efficient ? 'HW' : 'SW'}</span>
                                                </div>
                                                <div 
                                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${test.smooth ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800'}`} 
                                                    title={test.smooth ? t.video_smooth : 'May Drop Frames'}
                                                >
                                                    {test.smooth ? <Check size={12} /> : <X size={12} />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Audio Section */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                    <Music size={14} />
                    {labels.audio_codecs}
                </h3>
                <div className="space-y-3">
                    {audioResults.map((row, rIdx) => (
                        <div key={rIdx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Speaker size={14} className="text-slate-400" />
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{row.codec}</h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 hidden sm:inline">({row.label})</span>
                                </div>
                                <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTagColor(row.tag)}`}>
                                    {row.tag === 'Dolby' && <Tv size={10} />}
                                    {row.tag}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700">
                                {row.tests.map((test: any, idx: number) => (
                                    <div key={idx} className={`p-3 flex flex-col gap-1 items-center justify-center text-center transition-colors ${test.supported ? '' : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-60'}`}>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{test.label}</span>
                                        
                                        {!test.supported ? (
                                            <span className="text-xs font-bold text-slate-300 dark:text-slate-600">{values.not_supported}</span>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <div 
                                                    className={`flex items-center justify-center w-6 h-6 rounded-full ${test.supported ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600'}`}
                                                >
                                                    {test.supported ? <Check size={12} /> : <X size={12} />}
                                                </div>
                                                {test.efficient && (
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50 px-1.5 rounded">HW</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex gap-4 text-[10px] text-slate-400 justify-center pb-2 flex-wrap">
                <div className="flex items-center gap-1"><Battery size={12} className="text-green-500" /> {t.video_efficient}</div>
                <div className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> Software</div>
                <div className="flex items-center gap-1"><Check size={12} className="text-blue-500" /> {t.video_smooth}</div>
            </div>
        </div>
    );
};
