
import { FingerprintScore, ScoreFactor } from '../types';

export interface ScoreInput {
    canvasHash: string;
    webglHash: string;
    userAgent: string;
    cpu: string | number;
    memory: string | number;
    gpuRenderer: string;
    battery: string;
    screenRes: string;
    pixelRatio: number;
    colorDepth: number;
    audioRate: string;
    webRTC: string;
    drmCount: number;
    touchPoints: number;
    clientHints?: {
        architecture?: string;
        bitness?: string;
        model?: string;
        platformVersion?: string;
        fullVersionList?: { brand: string; version: string }[];
    };
    hdr: boolean;
    timezone?: string;
    languages?: string;
    fontsCount?: number;
    doNotTrack?: string | null;
    gamepads?: number;
    orientation?: string;
    networkType?: string;
}

const COMMON_RESOLUTIONS = new Set([
    '1920x1080', '1920 x 1080',
    '1366x768', '1366 x 768',
    '1440x900', '1440 x 900',
    '1536x864', '1536 x 864',
    '1280x720', '1280 x 720',
    '1280x800', '1280 x 800',
    '1600x900', '1600 x 900',
    '2560x1440', '2560 x 1440',
    '3840x2160', '3840 x 2160'
]);

const DEDICATED_GPU_PATTERNS = /(nvidia|geforce|rtx|gtx|radeon|rx\s*\d|apple\s*m\d|adreno\s*[678]\d\d|mali-g\d\d)/i;
const GENERIC_GPU_PATTERNS = /(software\s*rasterizer|swiftshader|llvmpipe|generic|unknown|microsoft\s*basic)/i;

const isPrivateIp = (ip: string): boolean => {
    if (!ip) return false;
    const trimmed = ip.trim();
    return (
        trimmed.startsWith('192.168.') ||
        trimmed.startsWith('10.') ||
        trimmed.startsWith('172.16.') ||
        trimmed.startsWith('172.17.') ||
        trimmed.startsWith('172.18.') ||
        trimmed.startsWith('172.19.') ||
        trimmed.startsWith('172.20.') ||
        trimmed.startsWith('172.21.') ||
        trimmed.startsWith('172.22.') ||
        trimmed.startsWith('172.23.') ||
        trimmed.startsWith('172.24.') ||
        trimmed.startsWith('172.25.') ||
        trimmed.startsWith('172.26.') ||
        trimmed.startsWith('172.27.') ||
        trimmed.startsWith('172.28.') ||
        trimmed.startsWith('172.29.') ||
        trimmed.startsWith('172.30.') ||
        trimmed.startsWith('172.31.') ||
        trimmed.startsWith('127.') ||
        trimmed.startsWith('fe80:') ||
        trimmed.startsWith('fc00:') ||
        trimmed.startsWith('fd00:')
    );
};

export const calculateFingerprintScore = (input: ScoreInput): FingerprintScore => {
    const factors: ScoreFactor[] = [];
    
    const weights = {
        hardware: 0.30,
        browser: 0.30,
        network: 0.15,
        media: 0.15,
        screen: 0.10
    };

    const addFactor = (
        id: string, 
        value: string | number, 
        score: number, 
        maxScore: number, 
        category: 'hardware' | 'browser' | 'screen' | 'media' | 'network', 
        description: string
    ) => {
        const weight = weights[category];
        const weightedScore = parseFloat((score * weight).toFixed(2));
        const weightedMaxScore = parseFloat((maxScore * weight).toFixed(2));
        factors.push({
            id,
            value,
            score,
            maxScore,
            weightedScore,
            weightedMaxScore,
            description,
            category
        });
    };

    // Category buckets (0-100 scale for each)
    let catHardware = 0;
    let catBrowser = 0;
    let catScreen = 0;
    let catMedia = 0;
    let catNetwork = 0;

    // =========================================================================
    // 1. BROWSER CATEGORY (Max 100)
    // =========================================================================

    // Canvas Hash (Max 25 pts) - High entropy rendering differences
    if (input.canvasHash && input.canvasHash !== 'Error' && input.canvasHash !== 'Not Supported' && input.canvasHash.trim().length > 0) {
        catBrowser += 25;
        addFactor('canvas_hash', 'val_unique', 25, 25, 'browser', 'desc_canvas_unique');
    } else {
        addFactor('canvas_hash', 'val_generic', 0, 25, 'browser', 'desc_canvas_generic');
    }

    // WebGL Hash (Max 25 pts) - GPU shader & pipeline rendering nuances
    if (input.webglHash && input.webglHash !== 'Error' && input.webglHash !== 'Not Supported' && input.webglHash.trim().length > 0) {
        catBrowser += 25;
        addFactor('webgl_hash', 'val_unique', 25, 25, 'browser', 'desc_webgl_unique');
    } else {
        addFactor('webgl_hash', 'val_generic', 0, 25, 'browser', 'desc_webgl_generic');
    }
    
    // Installed Fonts (Max 20 pts) - High entropy font enumeration
    const fontCount = typeof input.fontsCount === 'number' ? input.fontsCount : 0;
    if (fontCount > 0) {
        let fontScore = 4;
        let fontDesc = 'desc_generic';
        if (fontCount >= 120) {
            fontScore = 20;
            fontDesc = 'desc_hardware_unique';
        } else if (fontCount >= 60) {
            fontScore = 15;
            fontDesc = 'desc_hardware_unique';
        } else if (fontCount >= 20) {
            fontScore = 8;
            fontDesc = 'desc_generic';
        }
        catBrowser += fontScore;
        addFactor('installed_fonts', `${fontCount} Fonts`, fontScore, 20, 'browser', fontDesc);
    } else {
        // Unknown or 0 fonts: baseline generic value, 0 entropy added
        addFactor('installed_fonts', 'Unknown', 0, 20, 'browser', 'desc_generic');
    }

    // Timezone & Locale (Max 15 pts total: Timezone 8 pts + Language 7 pts)
    if (input.timezone && input.timezone !== 'Unknown' && input.timezone.trim().length > 0) {
        catBrowser += 8;
        addFactor('system_timezone', input.timezone, 8, 8, 'browser', 'desc_locale_unique');
    } else {
        addFactor('system_timezone', 'Unknown', 0, 8, 'browser', 'desc_generic');
    }

    if (input.languages && input.languages.includes(',')) {
        catBrowser += 7;
        addFactor('language_preferences', 'val_specific', 7, 7, 'browser', 'desc_locale_unique');
    } else if (input.languages && input.languages !== 'Unknown' && input.languages.trim().length > 0) {
        catBrowser += 3;
        addFactor('language_preferences', input.languages, 3, 7, 'browser', 'desc_generic');
    } else {
        addFactor('language_preferences', 'Unknown', 0, 7, 'browser', 'desc_generic');
    }

    // User Agent & Client Hints (Max 12 pts)
    if (input.userAgent && input.userAgent.length > 30) {
        let uaScore = 6;
        let uaDesc = 'desc_ua_unique';
        if (input.clientHints && (input.clientHints.model || input.clientHints.architecture || input.clientHints.bitness)) {
            uaScore = 12;
            uaDesc = 'desc_ua_ch';
        } else if (input.userAgent.length > 80) {
            uaScore = 8;
        }
        catBrowser += uaScore;
        addFactor('user_agent', 'val_specific', uaScore, 12, 'browser', uaDesc);
    } else {
        addFactor('user_agent', 'val_generic', 0, 12, 'browser', 'desc_generic');
    }

    // Do Not Track (Max 3 pts) - DNT enabled is a rare minority flag (DNT paradox)
    if (input.doNotTrack === "1" || input.doNotTrack === "true" || input.doNotTrack === "yes") {
        catBrowser += 3;
        addFactor('dnt_enabled', 'val_specific', 3, 3, 'browser', 'desc_dnt_unique');
    } else {
        addFactor('dnt_enabled', 'val_generic', 0, 3, 'browser', 'desc_dnt_generic');
    }

    // =========================================================================
    // 2. HARDWARE CATEGORY (Max 100)
    // =========================================================================

    // GPU Renderer (Max 35 pts)
    if (input.gpuRenderer && input.gpuRenderer !== 'Unknown' && input.gpuRenderer.length > 5) {
        if (GENERIC_GPU_PATTERNS.test(input.gpuRenderer)) {
            catHardware += 5;
            addFactor('gpu_renderer', input.gpuRenderer, 5, 35, 'hardware', 'desc_hardware_generic');
        } else if (DEDICATED_GPU_PATTERNS.test(input.gpuRenderer) || input.gpuRenderer.length > 25) {
            catHardware += 35;
            addFactor('gpu_renderer', input.gpuRenderer, 35, 35, 'hardware', 'desc_gpu_unique');
        } else {
            catHardware += 20;
            addFactor('gpu_renderer', input.gpuRenderer, 20, 35, 'hardware', 'desc_hardware_generic');
        }
    } else {
        addFactor('gpu_renderer', 'Unknown', 0, 35, 'hardware', 'desc_generic');
    }

    // Concurrency & Memory (Max 30 pts)
    const rawCpu = parseInt(String(input.cpu), 10);
    const rawMem = parseInt(String(input.memory), 10);
    const validCpu = !isNaN(rawCpu) && rawCpu > 0;
    const validMem = !isNaN(rawMem) && rawMem > 0;

    if (validCpu && validMem) {
        let hwScore = 14;
        let hwDesc = 'desc_hardware_generic';
        if (rawCpu >= 16 || rawMem >= 32) {
            hwScore = 30;
            hwDesc = 'desc_hardware_unique';
        } else if ((rawCpu % 2 !== 0 && rawCpu > 1) || rawCpu > 8 || rawMem > 16) {
            hwScore = 24;
            hwDesc = 'desc_hardware_unique';
        }
        catHardware += hwScore;
        addFactor('hardware_concurrency', `${input.cpu} Cores, ${input.memory}GB RAM`, hwScore, 30, 'hardware', hwDesc);
    } else if (validCpu) {
        catHardware += 8;
        addFactor('hardware_concurrency', `${input.cpu} Cores`, 8, 30, 'hardware', 'desc_hardware_generic');
    } else {
        addFactor('hardware_concurrency', 'Unknown', 0, 30, 'hardware', 'desc_generic');
    }

    // Touch Support (Max 15 pts)
    if (input.touchPoints > 0) {
        const touchScore = Math.min(15, 8 + Math.min(input.touchPoints, 7));
        catHardware += touchScore;
        addFactor('touch_support', `${input.touchPoints} Points`, touchScore, 15, 'hardware', 'desc_hardware_unique');
    } else {
        addFactor('touch_support', '0 Points', 0, 15, 'hardware', 'desc_generic');
    }

    // Battery Status (Max 10 pts) - Ephemeral side-channel
    if (input.battery && input.battery !== 'Unknown' && input.battery !== 'Not Supported' && input.battery !== 'N/A' && input.battery !== '-') {
        catHardware += 10;
        addFactor('battery_status', 'val_readable', 10, 10, 'hardware', 'desc_battery_unique');
    } else {
        addFactor('battery_status', 'val_generic', 0, 10, 'hardware', 'desc_battery_generic');
    }

    // Gamepads (Max 10 pts) - Rare external hardware peripheral
    if (input.gamepads && input.gamepads > 0) {
        catHardware += 10;
        addFactor('gamepads_connected', `${input.gamepads} Connected`, 10, 10, 'hardware', 'desc_hardware_unique');
    } else {
        addFactor('gamepads_connected', '0 Connected', 0, 10, 'hardware', 'desc_generic');
    }

    // =========================================================================
    // 3. SCREEN CATEGORY (Max 100)
    // =========================================================================

    // Resolution (Max 45 pts)
    const rawRes = input.screenRes ? input.screenRes.trim() : '';
    if (rawRes && rawRes !== 'Unknown' && rawRes !== '0x0' && rawRes !== '0 x 0') {
        const parts = rawRes.split(/[xX*]/).map(p => parseInt(p.trim(), 10));
        const width = parts[0] || 0;
        const height = parts[1] || 0;

        let resScore: number;
        let resDesc: string;

        if (COMMON_RESOLUTIONS.has(rawRes) || (width === 1920 && height === 1080)) {
            resScore = 18;
            resDesc = 'desc_generic';
        } else if (width >= 3840 || width / (height || 1) > 2.2 || width / (height || 1) < 1.2) {
            // Ultrawide, 4K/8K, or unusual aspect ratio
            resScore = 38;
            resDesc = 'desc_res_unique';
        } else if (width % 10 !== 0 || height % 10 !== 0) {
            // Non-standard windowed/custom resolution
            resScore = 45;
            resDesc = 'desc_res_unique';
        } else {
            resScore = 25;
            resDesc = 'desc_res_unique';
        }
        catScreen += resScore;
        addFactor('resolution', input.screenRes, resScore, 45, 'screen', resDesc);
    } else {
        addFactor('resolution', 'Unknown', 0, 45, 'screen', 'desc_generic');
    }
    
    // Pixel Ratio, Color Depth & HDR (Max 35 pts)
    const dpr = input.pixelRatio || 1;
    const depth = input.colorDepth || 24;
    let advScore = 10;
    
    if (dpr > 1) {
        advScore += (dpr % 1 === 0 ? 12 : 20); // Fractional DPR scaling has higher entropy
    }
    if (depth > 24) advScore += 5;
    if (input.hdr) advScore += 5;

    advScore = Math.min(35, Math.max(advScore, depth > 0 ? 5 : 0));
    catScreen += advScore;
    addFactor(
        'screen_advanced', 
        `DPR ${dpr}${input.hdr ? ', HDR' : ''}`, 
        advScore, 
        35, 
        'screen', 
        advScore > 15 ? 'desc_screen_advanced' : 'desc_generic'
    );

    // Screen Orientation (Max 20 pts)
    const orientation = input.orientation ? input.orientation.toLowerCase() : '';
    if (orientation.includes('secondary') || orientation.includes('portrait')) {
        catScreen += 18;
        addFactor('screen_orientation', input.orientation || 'val_specific', 18, 20, 'screen', 'desc_screen_advanced');
    } else if (orientation.length > 0) {
        catScreen += 6;
        addFactor('screen_orientation', input.orientation || 'Landscape', 6, 20, 'screen', 'desc_generic');
    } else {
        catScreen += 6;
        addFactor('screen_orientation', 'val_generic', 6, 20, 'screen', 'desc_generic');
    }

    // =========================================================================
    // 4. MEDIA CATEGORY (Max 100)
    // =========================================================================

    // Audio Context (Max 50 pts)
    const audioRateStr = input.audioRate ? input.audioRate.trim() : '';
    const numericRate = parseInt(audioRateStr, 10);
    if (audioRateStr && audioRateStr !== 'Unknown' && !isNaN(numericRate) && numericRate > 0) {
        let audioScore: number;
        let audioDesc: string;
        if (numericRate >= 96000) {
            audioScore = 50;
            audioDesc = 'desc_audio_unique';
        } else if (numericRate !== 44100 && numericRate !== 48000) {
            audioScore = 38;
            audioDesc = 'desc_audio_unique';
        } else {
            audioScore = 20; // 44.1k / 48k are mainstream standards
            audioDesc = 'desc_generic';
        }
        catMedia += audioScore;
        addFactor('audio_context', input.audioRate, audioScore, 50, 'media', audioDesc);
    } else {
        addFactor('audio_context', 'Unknown', 0, 50, 'media', 'desc_generic');
    }

    // DRM Support (Max 50 pts)
    const drmCount = typeof input.drmCount === 'number' ? input.drmCount : 0;
    if (drmCount > 0) {
        let drmScore = 15; // 1 DRM (Widevine) is standard across Chromium
        if (drmCount >= 4) {
            drmScore = 50;
        } else if (drmCount >= 2) {
            drmScore = 35;
        }
        catMedia += drmScore;
        addFactor('drm_support', `${drmCount} ${drmCount === 1 ? 'System' : 'Systems'}`, drmScore, 50, 'media', drmScore > 15 ? 'desc_drm_unique' : 'desc_generic');
    } else {
        addFactor('drm_support', '0 Systems', 0, 50, 'media', 'desc_generic');
    }

    // =========================================================================
    // 5. NETWORK CATEGORY (Max 100)
    // =========================================================================

    // WebRTC Leak (Max 75 pts)
    const rtcStr = input.webRTC ? input.webRTC.trim() : '';
    const rtcLower = rtcStr.toLowerCase();
    const isSafeRtc = !rtcStr ||
        rtcLower.includes('hidden') ||
        rtcLower.includes('timeout') ||
        rtcLower.includes('not supported') ||
        rtcLower.includes('protected') ||
        rtcLower.includes('n/a') ||
        rtcLower.endsWith('.local') ||
        rtcStr === 'Unknown';

    if (!isSafeRtc) {
        const isPrivate = isPrivateIp(rtcStr);
        const rtcScore = isPrivate ? 45 : 75; // Public IP leak has absolute highest tracking hazard
        catNetwork += rtcScore;
        addFactor('webrtc_leak', input.webRTC, rtcScore, 75, 'network', 'desc_webrtc_leak');
    } else {
        addFactor('webrtc_leak', 'val_protected', 0, 75, 'network', 'desc_webrtc_safe');
    }
    
    // Network Connection Type (Max 25 pts)
    const netType = input.networkType ? input.networkType.toLowerCase() : '';
    if (netType && netType !== 'unknown') {
        let netScore = 10;
        if (netType.includes('5g') || netType.includes('ethernet') || netType.includes('bluetooth')) {
            netScore = 22;
        }
        catNetwork += netScore;
        addFactor('network_type', input.networkType || 'val_specific', netScore, 25, 'network', 'desc_generic');
    } else {
        addFactor('network_type', 'val_generic', 0, 25, 'network', 'desc_generic');
    }

    // Normalize Categories to 0-100
    const normalize = (val: number) => Math.min(Math.round(val), 100);
    const scores = {
        hardware: normalize(catHardware),
        browser: normalize(catBrowser),
        screen: normalize(catScreen),
        media: normalize(catMedia),
        network: normalize(catNetwork)
    };

    // Weighted Average Total Score
    let calculatedTotal = 0;
    calculatedTotal += scores.hardware * weights.hardware;
    calculatedTotal += scores.browser * weights.browser;
    calculatedTotal += scores.network * weights.network;
    calculatedTotal += scores.media * weights.media;
    calculatedTotal += scores.screen * weights.screen;
    
    const totalScore = Math.min(100, Math.max(0, Math.round(calculatedTotal)));

    let rating = 'Low';
    if (totalScore >= 75) rating = 'Critical';
    else if (totalScore >= 50) rating = 'High';
    else if (totalScore >= 25) rating = 'Medium';

    return { 
        totalScore, 
        rating, 
        factors, 
        categoryScores: scores 
    };
};

