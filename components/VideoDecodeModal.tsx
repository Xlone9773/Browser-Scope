
import React, { useState, useEffect } from 'react';
import { Film, Battery, Zap, Check, X, MonitorPlay, Filter, Music, Speaker, Tv, ShieldCheck, ShieldAlert, RotateCcw } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { videoCodecs, videoResolutions, audioCodecs, audioConfigs } from '../data/codecs';
import { Modal } from './ui/Modal';

const CACHE_KEY = 'videoDecodeTestCache';

const loadCache = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            if (data.video && data.audio && data.drm) {
                return data;
            }
        }
    } catch (e) {}
    return null;
};

const saveCache = (video: any[], audio: any[], drm: any[]) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ video, audio, drm }));
    } catch (e) {}
};

let memCache = loadCache();
let cachedVideoResults: any[] | null = memCache?.video || null;
let cachedAudioResults: any[] | null = memCache?.audio || null;
let cachedDrmResults: any[] | null = memCache?.drm || null;

interface VideoDecodeModalProps {
    onClose: () => void;
    // We pass the relevant translations. Using HardwareToolsModal translation slice 
    // as it contains all the necessary strings.
    t: Translation['hardwareToolsModal'];
    values: Translation['values'];
    labels: Translation['labels'];
}

export const VideoDecodeModal: React.FC<VideoDecodeModalProps> = ({ onClose, t, values, labels }) => {
    const [videoResults, setVideoResults] = useState<any[]>(cachedVideoResults || []);
    const [audioResults, setAudioResults] = useState<any[]>(cachedAudioResults || []);
    const [drmResults, setDrmResults] = useState<any[]>(cachedDrmResults || []);
    const [progress, setProgress] = useState(cachedVideoResults ? 100 : 0);
    const [isTesting, setIsTesting] = useState(false);
    const [showSupportedOnly, setShowSupportedOnly] = useState(false);

    const runTests = async () => {
        setIsTesting(true);
        setProgress(0);
        const tempVideoResults: any[] = [];
        const tempAudioResults: any[] = [];
        
        let done = 0;
            const total = (videoCodecs.length * videoResolutions.length) + (audioCodecs.length * audioConfigs.length) + 3; // 3 DRM systems

            // --- Run DRM Tests ---
            const drms = [
                { id: 'com.widevine.alpha', name: 'Widevine' },
                { id: 'com.apple.fps.1_0', name: 'FairPlay' },
                { id: 'com.apple.fps.2_0', name: 'FairPlay v2' },
                { id: 'com.apple.fps.3_0', name: 'FairPlay v3' },
                { id: 'com.microsoft.playready', name: 'PlayReady' }
            ];
            
            const tempDrmResults = await Promise.all(drms.map(async (sys) => {
                try {
                    // @ts-ignore
                    if (navigator.requestMediaKeySystemAccess) {
                        const config = [{
                            initDataTypes: ['cenc'],
                            videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
                            audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }]
                        }];
                        // @ts-ignore
                        await navigator.requestMediaKeySystemAccess(sys.id, config);
                        return { ...sys, supported: true };
                    }
                    return { ...sys, supported: false, error: true };
                } catch (e) {
                    return { ...sys, supported: false };
                }
            }));
            setDrmResults(tempDrmResults);
            done += 3;

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

            cachedVideoResults = tempVideoResults;
            cachedAudioResults = tempAudioResults;
            cachedDrmResults = tempDrmResults;
            saveCache(tempVideoResults, tempAudioResults, tempDrmResults);
            setIsTesting(false);
        };

    useEffect(() => {
        if (!cachedVideoResults || !cachedAudioResults || !cachedDrmResults) {
            runTests();
        }
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

    const getFilteredResults = (results: any[]) => {
        if (!showSupportedOnly) return results;
        return results.map(row => ({
            ...row,
            tests: row.tests.filter((t: any) => t.supported)
        })).filter(row => row.tests.length > 0);
    };

    const filteredVideo = getFilteredResults(videoResults);
    const filteredAudio = getFilteredResults(audioResults);
    const filteredDrm = showSupportedOnly ? drmResults.filter(Sys => Sys.supported) : drmResults;

    return (
        <Modal
            title={t.tab_video}
            icon={<Film size={24} />}
            onClose={onClose}
            size="5xl"
            fullHeight
            noPadding
        >
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
                
                {/* Header Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MonitorPlay size={16} />
                        {isTesting ? t.video_instruction : t.video_title}
                    </div>
                    {isTesting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{progress}%</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={runTests}
                                className="text-xs font-medium px-2 py-1 rounded border transition-colors flex items-center gap-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                <RotateCcw size={12} />
                                {t.action_retest || "Retest"}
                            </button>
                            <button 
                                onClick={() => setShowSupportedOnly(!showSupportedOnly)}
                                className={`text-xs font-medium px-2 py-1 rounded border transition-colors flex items-center gap-1 ${showSupportedOnly ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}
                            >
                                <Filter size={12} />
                                {t.filter_supported}
                            </button>
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                <Check size={14} /> {t.status_done}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-4">
                    
                    {/* DRM Section */}
                    {filteredDrm.length > 0 && (
                        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ShieldCheck size={14} />
                                {t.drm_title || "DRM Capabilities"}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {filteredDrm.map((sys, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border flex items-center gap-3 ${sys.supported ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50' : 'border-slate-100 bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                        {sys.supported ? <ShieldCheck size={18} className="text-emerald-500" /> : <ShieldAlert size={18} className="opacity-50" />}
                                        <div>
                                            <div className="text-sm font-bold">{sys.name}</div>
                                            <div className="text-[10px] font-mono opacity-70">{sys.id.split('.').pop()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Section */}
                    {filteredVideo.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                                <Film size={14} />
                                {labels.video_codecs}
                            </h3>
                            {/* Updated layout: 1 col (mobile), 2 cols (lg), 3 cols (xl) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredVideo.map((row, rIdx) => (
                                    <div key={rIdx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm h-full">
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
                                                        <span className="text-xs text-red-400">{t.status_api_error}</span>
                                                    ) : !test.supported ? (
                                                        <span className="text-xs font-bold text-slate-300 dark:text-slate-600">{values.not_supported}</span>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <div 
                                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${test.efficient ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800'}`} 
                                                                title={test.efficient ? t.tooltip_hw : t.tooltip_sw}
                                                            >
                                                                {test.efficient ? <Battery size={12} /> : <Zap size={12} />}
                                                                <span className="text-[10px] font-medium hidden sm:inline">{test.efficient ? t.status_hw : t.status_sw}</span>
                                                            </div>
                                                            <div 
                                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${test.smooth ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800'}`} 
                                                                title={test.smooth ? t.video_smooth : t.tooltip_drop}
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
                    )}

                    {/* Audio Section */}
                    {filteredAudio.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                                <Music size={14} />
                                {labels.audio_codecs}
                            </h3>
                            {/* Updated layout: 1 col (mobile), 2 cols (lg), 3 cols (xl) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredAudio.map((row, rIdx) => (
                                    <div key={rIdx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm h-full">
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
                                                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/50 px-1.5 rounded">{t.status_hw}</span>
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
                    )}
                    
                    {/* Legend */}
                    <div className="mt-4 flex gap-4 text-[10px] text-slate-400 justify-center pb-2 flex-wrap">
                        <div className="flex items-center gap-1"><Battery size={12} className="text-green-500" /> {t.video_efficient}</div>
                        <div className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> {t.status_software}</div>
                        <div className="flex items-center gap-1"><Check size={12} className="text-blue-500" /> {t.video_smooth}</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
