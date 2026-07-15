
import { useState, useRef, useCallback } from 'react';

export type TestState = 'idle' | 'ping' | 'download' | 'upload' | 'done' | 'error';

export interface SpeedMetrics {
    ping: number | null;
    jitter: number | null;
    download: number | null;
    upload: number | null;
    current: number;
}

export interface TestConfig {
    backend: string;
    downloadSize: number;
    customUrl?: string;
}

export interface SpeedTestPreset {
    id: string;
    name: string;
    url: string;
    isDynamic: boolean;
    supportsUpload: boolean;
    // Map bytes (number) to filename string (e.g. 104857600 -> "100MB")
    // Used to replace {{size}} in url for static backends
    sizeMap?: Record<number, string>; 
}

// Common Sizes Constants
const SIZE_10MB = 10 * 1024 * 1024;
const SIZE_100MB = 100 * 1024 * 1024;
const SIZE_1GB = 1024 * 1024 * 1024;

// Pre-configured Speed Test Backends
export const SPEED_TEST_PRESETS: SpeedTestPreset[] = [
    // Global
    { 
        id: 'cloudflare', 
        name: 'Cloudflare (Global Anycast)', 
        url: 'https://speed.cloudflare.com/__down?bytes=', 
        isDynamic: true, 
        supportsUpload: true 
    },
    { 
        id: 'cachefly', 
        name: 'CacheFly (Global CDN)', 
        url: 'https://cachefly.cachefly.net/{{size}}.test', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_10MB]: '10mb',
            [SIZE_100MB]: '100mb'
        }
    },
    
    // East Asia (China focused)
    { 
        id: 'ustc_cn', 
        name: 'USTC Mirror (China/Hefei)', 
        url: 'https://mirrors.ustc.edu.cn/speedtest/{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100mb',
            [SIZE_1GB]: '1000mb'
        }
    },
    { 
        id: 'nju_cn', 
        name: 'NJU Mirror (China/Nanjing)', 
        url: 'https://mirrors.nju.edu.cn/speedtest/{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100mb',
            [SIZE_1GB]: '1000mb'
        }
    },
    
    // Russia & CIS
    { 
        id: 'selectel_ru', 
        name: 'Selectel (Russia/St. Petersburg)', 
        url: 'https://speedtest.selectel.ru/{{size}}', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_10MB]: '10MB',
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1GB'
        }
    },
    { 
        id: 'tele2_kz', 
        name: 'Tele2 (Kazakhstan/Almaty)', 
        url: 'https://speedtest.tele2.kz/{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB' // Note: Tele2 usually has 1000MB naming
        }
    },

    // Europe
    { 
        id: 'hetzner_de', 
        name: 'Hetzner (Germany/Falkenstein)', 
        url: 'https://fsn1-speed.hetzner.com/{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1GB'
        }
    },
    { 
        id: 'hetzner_fi', 
        name: 'Hetzner (Finland/Helsinki)', 
        url: 'https://hel1-speed.hetzner.com/{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1GB'
        }
    },
    { 
        id: 'scaleway_fr', 
        name: 'Scaleway (France/Paris)', 
        url: 'https://ping.online.net/{{size}}.dat', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100Mo',
            [SIZE_1GB]: '1000Mo'
        }
    },

    // North America
    { 
        id: 'vultr_nj', 
        name: 'Vultr (US East/New Jersey)', 
        url: 'https://nj-us-ping.vultr.com/vultr.com.{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB'
        }
    },
    { 
        id: 'vultr_la', 
        name: 'Vultr (US West/Los Angeles)', 
        url: 'https://lax-ca-us-ping.vultr.com/vultr.com.{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB'
        }
    },
    
    // Asia Pacific
    { 
        id: 'vultr_sg', 
        name: 'Vultr (Singapore)', 
        url: 'https://sgp-ping.vultr.com/vultr.com.{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB'
        }
    },
    { 
        id: 'vultr_tokyo', 
        name: 'Vultr (Japan/Tokyo)', 
        url: 'https://hnd-jp-ping.vultr.com/vultr.com.{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB'
        }
    },
    { 
        id: 'vultr_sydney', 
        name: 'Vultr (Australia/Sydney)', 
        url: 'https://syd-au-ping.vultr.com/vultr.com.{{size}}.bin', 
        isDynamic: false, 
        supportsUpload: false,
        sizeMap: {
            [SIZE_100MB]: '100MB',
            [SIZE_1GB]: '1000MB'
        }
    },
    
    // Custom
    { id: 'custom', name: 'Custom URL', url: '', isDynamic: false, supportsUpload: false }
];

const HISTORY_LENGTH = 60;

export const useSpeedTest = () => {
    const [testState, setTestState] = useState<TestState>('idle');
    const [metrics, setMetrics] = useState<SpeedMetrics>({
        ping: null,
        jitter: null,
        download: null,
        upload: null,
        current: 0
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [speedHistory, setSpeedHistory] = useState<number[]>(Array.from({ length: HISTORY_LENGTH }, () => 0));
    const [progress, setProgress] = useState(0);
    
    const abortControllerRef = useRef<AbortController | null>(null);

    const updateHistory = useCallback((speed: number) => {
        setMetrics(prev => ({ ...prev, current: speed }));
        setSpeedHistory(prev => [...prev.slice(1), speed]);
    }, []);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setTestState('idle');
        setMetrics(prev => ({ ...prev, current: 0 }));
        setProgress(0);
    }, []);

    const start = useCallback(async (config: TestConfig) => {
        if (testState !== 'idle' && testState !== 'done' && testState !== 'error') return;

        // Find backend configuration
        const backendConfig = SPEED_TEST_PRESETS.find(p => p.id === config.backend) || SPEED_TEST_PRESETS[0];

        // Validation
        if (config.backend === 'custom' && !config.customUrl) {
            setErrorMsg("Please enter a valid Custom URL");
            setTestState('error');
            return;
        }

        // Determine Download URL
        let downloadUrl: string;
        if (config.backend === 'custom') {
            downloadUrl = config.customUrl!;
        } else if (backendConfig.isDynamic) {
            // Cloudflare style: ?bytes=X
            downloadUrl = `${backendConfig.url}${config.downloadSize}`;
        } else if (backendConfig.sizeMap && backendConfig.url.includes('{{size}}')) {
            // Template substitution for static backends (e.g. 100MB.bin)
            const sizeString = backendConfig.sizeMap[config.downloadSize];
            // If the selected size isn't in the map (shouldn't happen via UI but for safety), fallback to 100MB
            const fallbackKey = Object.keys(backendConfig.sizeMap).find(k => Number(k) === 100*1024*1024) || Object.keys(backendConfig.sizeMap)[0];
            const sizeToUse = sizeString || backendConfig.sizeMap[Number(fallbackKey)];
            
            downloadUrl = backendConfig.url.replace('{{size}}', sizeToUse);
        } else {
            // Legacy/Direct Static file
            downloadUrl = backendConfig.url;
        }

        // Reset State
        setTestState('ping');
        setMetrics({ ping: null, jitter: null, download: null, upload: null, current: 0 });
        setErrorMsg(null);
        setSpeedHistory(Array.from({ length: HISTORY_LENGTH }, () => 0));
        setProgress(0);

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            // --- Phase 1: Latency (Ping) ---
            // Use the download URL but HEAD request (or small bytes for dynamic)
            // cache: 'no-store' is crucial here to measure real network latency, not disk/memory cache latency.
            const pingUrl = backendConfig.isDynamic 
                ? `${backendConfig.url}0` 
                : downloadUrl;

            const pings: number[] = [];
            const pingAttempts = 5;
            
            for (let i = 0; i < pingAttempts; i++) {
                if (signal.aborted) return;
                const start = performance.now();
                try {
                    await fetch(pingUrl, { cache: 'no-store', signal, method: 'HEAD', mode: 'cors' });
                } catch {
                    // Fallback for CORS opaque responses (timing might be slightly off but works for basic check)
                    await fetch(pingUrl, { cache: 'no-store', signal, mode: 'no-cors' });
                }
                const end = performance.now();
                pings.push(end - start);
                
                // Update Progress (0-5%)
                setProgress(((i + 1) / pingAttempts) * 5);
                
                await new Promise(r => setTimeout(r, 200));
            }

            if (pings.length > 0) {
                const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
                const variance = pings.reduce((a, b) => a + Math.pow(b - avgPing, 2), 0) / pings.length;
                setMetrics(prev => ({ ...prev, ping: avgPing, jitter: Math.sqrt(variance) }));
            }

            // --- Phase 2: Download ---
            if (signal.aborted) return;
            setTestState('download');

            // cache: 'no-store' is VITAL here.
            // 1. It ensures we are testing the network, not the disk cache.
            // 2. It prevents the browser from writing 100MB+ files to the disk cache, avoiding storage bloat.
            const dlResponse = await fetch(downloadUrl, { 
                signal, 
                cache: 'no-store',
                mode: 'cors' 
            });

            if (dlResponse.body) {
                const reader = dlResponse.body.getReader();
                let receivedLength = 0;
                const startTime = performance.now();
                let lastUpdate = startTime;
                
                // Target download percentage range: 5% -> 50%
                // If upload is unsupported, 5% -> 100%
                const progressStart = 5;
                const progressEnd = backendConfig.supportsUpload ? 50 : 100;
                const progressRange = progressEnd - progressStart;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    // value is a Uint8Array chunk. We don't store it, just count its length.
                    // The garbage collector will free 'value' immediately after this iteration.
                    receivedLength += value.length;

                    const now = performance.now();
                    // Update UI roughly every 100ms
                    if (now - lastUpdate > 100) {
                        const duration = (now - startTime) / 1000;
                        const bits = receivedLength * 8;
                        const mbps = (bits / duration) / 1000000;
                        updateHistory(mbps);
                        setMetrics(prev => ({ ...prev, download: mbps }));
                        lastUpdate = now;
                        
                        // Calculate Progress
                        const percentage = Math.min((receivedLength / config.downloadSize), 1);
                        setProgress(progressStart + (percentage * progressRange));
                    }
                }

                // Final Calculation
                const totalDuration = (performance.now() - startTime) / 1000;
                const finalMbps = ((receivedLength * 8) / totalDuration) / 1000000;
                setMetrics(prev => ({ ...prev, download: finalMbps }));
                updateHistory(0); // Reset for next phase
                setProgress(progressEnd);
            }

            // --- Phase 3: Upload ---
            // Only run upload if the backend explicitly supports it (mostly Cloudflare)
            if (backendConfig.supportsUpload && !signal.aborted) {
                setTestState('upload');

                // 10MB random data for upload
                // We create this buffer once. It will be GC'd when the function exits.
                const uploadSize = 10 * 1024 * 1024; 
                let uploadData: Uint8Array | null = new Uint8Array(uploadSize);
                for (let i = 0; i < uploadSize; i += 1024) uploadData[i] = Math.floor(Math.random() * 255);

                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'https://speed.cloudflare.com/__up', true);
                    
                    // FIX: Set text/plain to attempt preventing Preflight (OPTIONS) request
                    // This creates a "Simple Request" which some servers accept more readily cross-origin.
                    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');

                    const ulStartTime = performance.now();
                    let lastUlUpdate = ulStartTime;

                    xhr.upload.onprogress = (e) => {
                        if (signal.aborted) {
                            xhr.abort();
                            reject(new Error("Aborted"));
                            return;
                        }
                        if (e.lengthComputable) {
                            const now = performance.now();
                            if (now - lastUlUpdate > 100) {
                                const duration = (now - ulStartTime) / 1000;
                                const bits = e.loaded * 8;
                                const mbps = (bits / duration) / 1000000;
                                updateHistory(mbps);
                                setMetrics(prev => ({ ...prev, upload: mbps }));
                                lastUlUpdate = now;
                                
                                // Upload Progress: 50% -> 100%
                                const percentage = e.loaded / e.total;
                                setProgress(50 + (percentage * 50));
                            }
                        }
                    };

                    xhr.onload = () => {
                        const totalDuration = (performance.now() - ulStartTime) / 1000;
                        const finalMbps = ((uploadSize * 8) / totalDuration) / 1000000;
                        setMetrics(prev => ({ ...prev, upload: finalMbps }));
                        resolve();
                    };

                    xhr.onerror = () => {
                        console.warn("Upload test failed (likely CORS)");
                        setMetrics(prev => ({ ...prev, upload: 0 }));
                        // Don't fail the whole test, just the upload part
                        resolve(); 
                    };

                    xhr.send(uploadData);
                });
                
                // Explicit cleanup helper
                uploadData = null; 
            } else {
                // Skip upload for static backends or if unsupported
                setMetrics(prev => ({ ...prev, upload: 0 }));
            }

            setProgress(100);
            setTestState('done');
            setMetrics(prev => ({ ...prev, current: 0 }));

        } catch (e: unknown) {
            const errObj = e instanceof Error ? e : (typeof e === 'object' && e !== null ? e as Record<string, unknown> : {});
            if (errObj.name !== 'AbortError') {
                console.error("Speed test error", e);
                setTestState('error');
                setErrorMsg((errObj.message as string) || "Network Error");
            }
        }
    }, [testState, updateHistory]);

    return {
        testState,
        metrics,
        errorMsg,
        speedHistory,
        progress,
        start,
        stop
    };
};
