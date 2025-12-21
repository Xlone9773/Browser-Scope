
import React, { useState, useEffect } from 'react';
import { Film, Battery, Zap, Check, X, MonitorPlay, Sun } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface VideoTabProps {
    t: Translation['hardwareToolsModal'];
}

export const VideoTab: React.FC<VideoTabProps> = ({ t }) => {
    const [results, setResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const [isTesting, setIsTesting] = useState(false);

    // Advanced codec list including HDR/10-bit profiles
    // Note: Codec strings are specific. 
    // HEVC Main 10: hvc1.2.4.L153.B0 (Profile 2, Tier High, Level 5.1)
    // VP9 Profile 2 (10-bit): vp09.02.51.10.01.09.16.09.01
    // AV1 Main 10-bit: av01.0.12M.10 (Main Profile, Level 5.0, 10-bit)
    const codecs = [
        { 
            name: 'H.264 (AVC)', 
            profile: 'High Profile (8-bit)',
            type: 'video/mp4; codecs="avc1.640033"', // High Profile Level 5.1
            hdr: false 
        },
        { 
            name: 'HEVC (H.265)', 
            profile: 'Main (8-bit)',
            type: 'video/mp4; codecs="hvc1.1.6.L150.B0"', // Main Profile Level 5.0
            hdr: false 
        },
        { 
            name: 'HEVC (H.265)', 
            profile: 'Main 10 (10-bit HDR)',
            type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
            hdr: true 
        },
        { 
            name: 'VP9', 
            profile: 'Profile 0 (8-bit)',
            type: 'video/webm; codecs="vp09.00.51.08.01.01.01.01.00"', 
            hdr: false 
        },
        { 
            name: 'VP9', 
            profile: 'Profile 2 (10-bit HDR)',
            type: 'video/webm; codecs="vp09.02.51.10.01.09.16.09.01"', 
            hdr: true 
        },
        { 
            name: 'AV1', 
            profile: 'Main (8-bit)',
            type: 'video/mp4; codecs="av01.0.09M.08"', 
            hdr: false 
        },
        { 
            name: 'AV1', 
            profile: 'Main (10-bit HDR)',
            type: 'video/mp4; codecs="av01.0.12M.10"', 
            hdr: true 
        },
        { 
            name: 'Ogg Theora', 
            profile: 'Theora',
            type: 'video/ogg; codecs="theora"', 
            hdr: false 
        },
    ];

    const resolutions = [
        { label: '1080p 60', width: 1920, height: 1080, fps: 60, bitrate: 8000000 },
        { label: '4K 30', width: 3840, height: 2160, fps: 30, bitrate: 20000000 },
        { label: '4K 60', width: 3840, height: 2160, fps: 60, bitrate: 35000000 },
        { label: '8K 30', width: 7680, height: 4320, fps: 30, bitrate: 60000000 },
    ];

    useEffect(() => {
        const runTests = async () => {
            setIsTesting(true);
            const tempResults = [];
            let done = 0;
            const total = codecs.length * resolutions.length;

            // Process codecs sequentially to update UI row by row, but resolutions in parallel
            for (const codec of codecs) {
                const row = { 
                    codec: codec.name, 
                    profile: codec.profile, 
                    isHdr: codec.hdr, 
                    tests: [] as any[] 
                };

                // Create promises for all resolutions of this codec
                const resPromises = resolutions.map(async (res) => {
                    try {
                        // @ts-ignore
                        if (navigator.mediaCapabilities) {
                            const config = {
                                type: 'file', 
                                video: {
                                    contentType: codec.type,
                                    width: res.width,
                                    height: res.height,
                                    bitrate: res.bitrate,
                                    framerate: res.fps,
                                    // Add HDR metadata if needed
                                    ...(codec.hdr ? {
                                        transferFunction: 'pq', // Perceptual Quantizer (HDR10)
                                        colorGamut: 'rec2020'
                                    } : {})
                                }
                            };
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

                // Wait for all resolutions for this codec
                const resResults = await Promise.all(resPromises);
                row.tests = resResults;
                tempResults.push(row);
                
                // Update progress
                done += resolutions.length;
                setProgress(Math.round((done / total) * 100));
                
                // Update state incrementally to show progress
                setResults([...tempResults]);
            }
            setIsTesting(false);
        };

        runTests();
    }, []);

    return (
        <div className="h-full overflow-y-auto animate-in fade-in duration-300">
            <div className="mb-4 flex items-center justify-between sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 py-2 border-b border-slate-200 dark:border-slate-800">
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

            <div className="space-y-3 pb-4">
                {results.map((row, rIdx) => (
                    <div key={rIdx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        {/* Row Header */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Film size={14} className="text-slate-400" />
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{row.codec}</h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">({row.profile})</span>
                            </div>
                            {row.isHdr && (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-800/50">
                                    <Sun size={10} /> HDR
                                </span>
                            )}
                        </div>
                        
                        {/* Results Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-700">
                            {row.tests.map((test: any, idx: number) => (
                                <div key={idx} className={`p-3 flex flex-col gap-1.5 items-center justify-center text-center transition-colors ${test.supported ? '' : 'bg-slate-50/50 dark:bg-slate-800/30 opacity-60'}`}>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{test.label}</span>
                                    
                                    {test.error ? (
                                        <span className="text-xs text-red-400">API Error</span>
                                    ) : !test.supported ? (
                                        <span className="text-xs font-bold text-slate-300 dark:text-slate-600">Not Supported</span>
                                    ) : (
                                        <div className="flex gap-2">
                                            {/* Efficient (Battery) */}
                                            <div 
                                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${test.efficient ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800'}`} 
                                                title={test.efficient ? 'Hardware Accelerated (Efficient)' : 'Software Decoding (Power Hungry)'}
                                            >
                                                {test.efficient ? <Battery size={12} /> : <Zap size={12} />}
                                                <span className="text-[10px] font-medium hidden sm:inline">{test.efficient ? 'HW' : 'SW'}</span>
                                            </div>
                                            
                                            {/* Smooth */}
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
            
            <div className="mt-2 flex gap-4 text-[10px] text-slate-400 justify-center pb-4">
                <div className="flex items-center gap-1"><Battery size={12} className="text-green-500" /> {t.video_efficient}</div>
                <div className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> Software (High Power)</div>
                <div className="flex items-center gap-1"><Check size={12} className="text-blue-500" /> {t.video_smooth}</div>
            </div>
        </div>
    );
};
