// hooks/useVideoDecodeTests.ts
import { useState, useEffect, useCallback } from 'react';
import {
    videoCodecs,
    videoResolutions,
    audioCodecs,
    audioConfigs,
    drmSystems,
    VideoCodecDefinition,
    AudioCodecDefinition
} from '../data/codecs';

export interface VideoTestResultItem {
    width: number;
    height: number;
    fps: number;
    bitrate: number;
    label: string;
    supported?: boolean;
    smooth?: boolean;
    efficient?: boolean;
    error?: string;
}

export interface VideoCodecRow {
    codec: string;
    profile: string;
    type: string;
    bitDepth: number;
    tag: VideoCodecDefinition['tag'];
    category: VideoCodecDefinition['category'];
    description?: string;
    tests: VideoTestResultItem[];
}

export interface AudioTestResultItem {
    channels: string;
    samplerate: number;
    bitrate: number;
    label: string;
    supported?: boolean;
    smooth?: boolean;
    efficient?: boolean;
    error?: string;
}

export interface AudioCodecRow {
    codec: string;
    label: string;
    type: string;
    tag: AudioCodecDefinition['tag'];
    category: AudioCodecDefinition['category'];
    tests: AudioTestResultItem[];
}

export interface DrmSystemItem {
    id: string;
    name: string;
    vendor: string;
    supported?: boolean;
    error?: boolean;
}

export interface WebCodecsSupportInfo {
    videoDecoder: boolean;
    videoEncoder: boolean;
    audioDecoder: boolean;
    audioEncoder: boolean;
    codecsHwStatus: {
        h264: boolean | null;
        vp9: boolean | null;
        av1: boolean | null;
        hevc: boolean | null;
    };
}

export interface VideoSummaryStats {
    hwCount: number;
    supportedCount: number;
    totalCount: number;
    maxSpec: string;
    webCodecsStatus: string;
}

const CACHE_KEY = 'videoDecodeTestCache_v3';

interface CachedData {
    video: VideoCodecRow[];
    audio: AudioCodecRow[];
    drm: DrmSystemItem[];
    webCodecs: WebCodecsSupportInfo;
}

const withTimeout = <T,>(promise: Promise<T>, ms: number, defaultValue: T): Promise<T> => {
    return new Promise<T>((resolve) => {
        const timer = setTimeout(() => {
            resolve(defaultValue);
        }, ms);
        promise
            .then((res) => {
                clearTimeout(timer);
                resolve(res);
            })
            .catch(() => {
                clearTimeout(timer);
                resolve(defaultValue);
            });
    });
};

const checkWebCodecs = async (): Promise<WebCodecsSupportInfo> => {
    const hasVideoDecoder = typeof window !== 'undefined' && 'VideoDecoder' in window;
    const hasVideoEncoder = typeof window !== 'undefined' && 'VideoEncoder' in window;
    const hasAudioDecoder = typeof window !== 'undefined' && 'AudioDecoder' in window;
    const hasAudioEncoder = typeof window !== 'undefined' && 'AudioEncoder' in window;

    const probeHw = async (codec: string): Promise<boolean | null> => {
        try {
            if (hasVideoDecoder && typeof VideoDecoder.isConfigSupported === 'function') {
                const res = await VideoDecoder.isConfigSupported({
                    codec,
                    codedWidth: 1920,
                    codedHeight: 1080,
                    hardwareAcceleration: 'prefer-hardware'
                });
                return !!res.supported;
            }
        } catch {
            return false;
        }
        return null;
    };

    const [h264, vp9, av1, hevc] = await Promise.all([
        probeHw('avc1.42E01E'),
        probeHw('vp09.00.10.08'),
        probeHw('av01.0.04M.08'),
        probeHw('hvc1.1.6.L93.B0')
    ]);

    return {
        videoDecoder: hasVideoDecoder,
        videoEncoder: hasVideoEncoder,
        audioDecoder: hasAudioDecoder,
        audioEncoder: hasAudioEncoder,
        codecsHwStatus: { h264, vp9, av1, hevc }
    };
};

const loadCache = (): CachedData | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached) as CachedData;
            if (parsed?.video?.length > 0 && parsed?.audio?.length > 0 && parsed?.drm?.length > 0) {
                return parsed;
            }
        }
    } catch {
        // Fallback gracefully
    }
    return null;
};

const saveCache = (data: CachedData) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // Storage limit exceeded or disabled
    }
};

export const useVideoDecodeTests = () => {
    const [cached] = useState<CachedData | null>(() => loadCache());
    const [videoResults, setVideoResults] = useState<VideoCodecRow[]>(() => cached?.video || []);
    const [audioResults, setAudioResults] = useState<AudioCodecRow[]>(() => cached?.audio || []);
    const [drmResults, setDrmResults] = useState<DrmSystemItem[]>(() => cached?.drm || []);
    const [webCodecsResult, setWebCodecsResult] = useState<WebCodecsSupportInfo | null>(() => cached?.webCodecs || null);
    const [progress, setProgress] = useState(() => (cached ? 100 : 0));
    const [isTesting, setIsTesting] = useState(false);

    const runTests = useCallback(async () => {
        setIsTesting(true);
        setProgress(0);

        try {
            const totalSteps =
                drmSystems.length +
                1 + // WebCodecs
                videoCodecs.length +
                audioCodecs.length;

            let completedSteps = 0;
            const updateProgress = () => {
                completedSteps += 1;
                setProgress(Math.min(100, Math.round((completedSteps / totalSteps) * 100)));
            };

            // 1. DRM System Tests
            const tempDrmResults = await Promise.all(
                drmSystems.map(async (sys): Promise<DrmSystemItem> => {
                    const runCheck = async (): Promise<DrmSystemItem> => {
                        try {
                            if (typeof navigator !== 'undefined' && 'requestMediaKeySystemAccess' in navigator) {
                                const config: MediaKeySystemConfiguration[] = [
                                    {
                                        initDataTypes: ['cenc'],
                                        videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
                                        audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }]
                                    }
                                ];
                                await navigator.requestMediaKeySystemAccess(sys.id, config);
                                return { ...sys, supported: true };
                            }
                            return { ...sys, supported: false, error: true };
                        } catch {
                            return { ...sys, supported: false };
                        }
                    };
                    return withTimeout(runCheck(), 1200, { ...sys, supported: false });
                })
            );
            setDrmResults(tempDrmResults);
            for (let i = 0; i < drmSystems.length; i++) {
                updateProgress();
            }

            // 2. WebCodecs Probe
            const wcSupport = await checkWebCodecs();
            setWebCodecsResult(wcSupport);
            updateProgress();

            // 3. Video Decoding Tests (Batched execution)
            const tempVideoResults: VideoCodecRow[] = [];
            for (const codec of videoCodecs) {
                const resPromises = videoResolutions.map(async (res): Promise<VideoTestResultItem> => {
                    const checkSingle = async (): Promise<VideoTestResultItem> => {
                        try {
                            if (typeof navigator !== 'undefined' && navigator.mediaCapabilities) {
                                const config: MediaDecodingConfiguration = {
                                    type: 'file',
                                    video: {
                                        contentType: codec.type,
                                        width: res.width,
                                        height: res.height,
                                        bitrate: res.bitrate,
                                        framerate: res.fps
                                    }
                                };

                                if (codec.hdrConfig && config.video) {
                                    Object.assign(config.video, codec.hdrConfig);
                                }

                                const info = await navigator.mediaCapabilities.decodingInfo(config);
                                return {
                                    ...res,
                                    supported: info?.supported ?? false,
                                    smooth: info?.smooth ?? false,
                                    efficient: info?.powerEfficient ?? false
                                };
                            }
                            return { ...res, error: 'API N/A' };
                        } catch {
                            return { ...res, supported: false };
                        }
                    };
                    return withTimeout(checkSingle(), 1500, { ...res, supported: false });
                });

                const testResults = await Promise.all(resPromises);
                tempVideoResults.push({
                    codec: codec.name,
                    profile: codec.profile,
                    type: codec.type,
                    bitDepth: codec.bitDepth,
                    tag: codec.tag,
                    category: codec.category,
                    description: codec.description,
                    tests: testResults
                });

                updateProgress();
                setVideoResults([...tempVideoResults]);
            }

            // 4. Audio Decoding Tests
            const tempAudioResults: AudioCodecRow[] = [];
            for (const codec of audioCodecs) {
                const audioPromises = audioConfigs.map(async (conf): Promise<AudioTestResultItem> => {
                    const checkAudio = async (): Promise<AudioTestResultItem> => {
                        try {
                            if (typeof navigator !== 'undefined' && navigator.mediaCapabilities) {
                                const config: MediaDecodingConfiguration = {
                                    type: 'file',
                                    audio: {
                                        contentType: codec.type,
                                        channels: conf.channels,
                                        bitrate: conf.bitrate,
                                        samplerate: conf.samplerate
                                    }
                                };
                                const info = await navigator.mediaCapabilities.decodingInfo(config);
                                return {
                                    ...conf,
                                    supported: info?.supported ?? false,
                                    smooth: info?.smooth ?? false,
                                    efficient: info?.powerEfficient ?? false
                                };
                            }
                            return { ...conf, error: 'API N/A' };
                        } catch {
                            return { ...conf, supported: false };
                        }
                    };
                    return withTimeout(checkAudio(), 1500, { ...conf, supported: false });
                });

                const testResults = await Promise.all(audioPromises);
                tempAudioResults.push({
                    codec: codec.name,
                    label: codec.label,
                    type: codec.type,
                    tag: codec.tag,
                    category: codec.category,
                    tests: testResults
                });

                updateProgress();
                setAudioResults([...tempAudioResults]);
            }

            // Cache all results
            saveCache({
                video: tempVideoResults,
                audio: tempAudioResults,
                drm: tempDrmResults,
                webCodecs: wcSupport
            });
        } catch (err) {
            console.error('Failed executing media decode tests:', err);
        } finally {
            setIsTesting(false);
            setProgress(100);
        }
    }, []);

    useEffect(() => {
        if (!cached) {
            runTests();
        }
    }, [cached, runTests]);

    // Compute Summary Stats
    const summaryStats: VideoSummaryStats = {
        hwCount: videoResults.filter((row) => row.tests.some((t) => t.supported && t.efficient)).length,
        supportedCount:
            videoResults.filter((row) => row.tests.some((t) => t.supported)).length +
            audioResults.filter((row) => row.tests.some((t) => t.supported)).length,
        totalCount: videoResults.length + audioResults.length,
        maxSpec: (() => {
            const has8K = videoResults.some((row) =>
                row.tests.some((t) => t.label.includes('8K') && t.supported)
            );
            if (has8K) return '8K 60fps';
            const has4k120 = videoResults.some((row) =>
                row.tests.some((t) => t.label.includes('120fps') && t.supported)
            );
            if (has4k120) return '4K 120fps';
            const has4K = videoResults.some((row) =>
                row.tests.some((t) => t.label === '4K' && t.supported)
            );
            if (has4K) return '4K UHD';
            const has2K = videoResults.some((row) =>
                row.tests.some((t) => t.label.includes('2K') && t.supported)
            );
            if (has2K) return '1440p (2K)';
            return '1080p FHD';
        })(),
        webCodecsStatus: webCodecsResult?.videoDecoder ? 'Supported' : 'Unavailable'
    };

    return {
        videoResults,
        audioResults,
        drmResults,
        webCodecsResult,
        progress,
        isTesting,
        summaryStats,
        runTests
    };
};
