
import { FingerprintScore, ScoreFactor } from '../types';

interface ScoreInput {
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
}

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
        id: string, value: string | number, score: number, maxScore: number, 
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

    // --- BROWSER CATEGORY (Max 100) ---
    // Canvas Hash (20)
    if (input.canvasHash && input.canvasHash !== 'Error' && input.canvasHash !== 'Not Supported') {
        catBrowser += 20;
        addFactor('canvas_hash', 'val_unique', 20, 20, 'browser', 'desc_canvas_unique');
    } else {
        addFactor('canvas_hash', 'val_generic', 0, 20, 'browser', 'desc_canvas_generic');
    }

    // WebGL Hash (20)
    if (input.webglHash && input.webglHash !== 'Error' && input.webglHash !== 'Not Supported') {
        catBrowser += 20;
        addFactor('webgl_hash', 'val_unique', 20, 20, 'browser', 'desc_webgl_unique');
    } else {
        addFactor('webgl_hash', 'val_generic', 0, 20, 'browser', 'desc_webgl_generic');
    }
    
    // Fonts (15)
    if (input.fontsCount && input.fontsCount > 0) {
        const fontScore = Math.min(15, (input.fontsCount / 100) * 15);
        catBrowser += fontScore;
        addFactor('installed_fonts', `${input.fontsCount} Fonts`, Math.round(fontScore), 15, 'browser', 'desc_hardware_unique');
    } else {
        catBrowser += 15;
        addFactor('installed_fonts', 'Unknown', 15, 15, 'browser', 'desc_generic');
    }

    // Languages & Timezone (20 combined)
    if (input.timezone) {
        catBrowser += 10;
        addFactor('system_timezone', input.timezone, 10, 10, 'browser', 'desc_locale_unique');
    }
    if (input.languages && input.languages.includes(',')) {
        catBrowser += 10;
        addFactor('language_preferences', 'val_specific', 10, 10, 'browser', 'desc_locale_unique');
    }

    // User Agent & Hints (20)
    if (input.userAgent.length > 50) {
        let uaScore = 10;
        let uaDesc = 'desc_ua_unique';
        if (input.clientHints && input.clientHints.model) {
            uaScore += 10; 
            uaDesc = 'desc_ua_ch';
        }
        catBrowser += uaScore;
        addFactor('user_agent', 'val_specific', uaScore, 20, 'browser', uaDesc);
    }

    // Do Not Track (5)
    if (input.doNotTrack === "1" || input.doNotTrack === "true" || input.doNotTrack === "yes") {
        catBrowser += 5;
        addFactor('dnt_enabled', 'val_specific', 5, 5, 'browser', 'desc_dnt_unique');
    } else {
        addFactor('dnt_enabled', 'val_generic', 0, 5, 'browser', 'desc_dnt_generic');
    }

    // --- HARDWARE CATEGORY (Max 100) ---
    // Concurrency & Memory (25)
    if (input.cpu !== 'Unknown' && input.memory !== 'Unknown') {
        catHardware += 25;
        addFactor('hardware_concurrency', `${input.cpu} Cores, ${input.memory}GB RAM`, 25, 25, 'hardware', 'desc_hardware_unique');
    } else {
        addFactor('hardware_concurrency', 'Unknown', 0, 25, 'hardware', 'desc_generic');
    }

    // GPU Renderer (35)
    if (input.gpuRenderer && input.gpuRenderer !== 'Unknown' && input.gpuRenderer.length > 10) {
        catHardware += 35;
        addFactor('gpu_renderer', input.gpuRenderer, 35, 35, 'hardware', 'desc_gpu_unique');
    } else {
        addFactor('gpu_renderer', 'Unknown', 0, 35, 'hardware', 'desc_generic');
    }

    // Battery (15)
    if (input.battery && input.battery !== 'Unknown' && input.battery !== 'Not Supported') {
        catHardware += 15;
        addFactor('battery_status', 'val_readable', 15, 15, 'hardware', 'desc_battery_unique');
    } else {
        addFactor('battery_status', 'val_generic', 0, 15, 'hardware', 'desc_battery_generic');
    }

    // Touch (15)
    if (input.touchPoints > 0) {
        catHardware += 15;
        addFactor('touch_support', `${input.touchPoints} Points`, 15, 15, 'hardware', 'desc_hardware_unique');
    } else {
        addFactor('touch_support', '0 Points', 0, 15, 'hardware', 'desc_generic');
    }

    // Gamepads (10)
    if (input.gamepads && input.gamepads > 0) {
        catHardware += 10;
        addFactor('gamepads_connected', `${input.gamepads} Connected`, 10, 10, 'hardware', 'desc_hardware_unique');
    } else {
        addFactor('gamepads_connected', '0 Connected', 0, 10, 'hardware', 'desc_generic');
    }

    // --- SCREEN CATEGORY (Max 100) ---
    // Resolution (40)
    if (input.screenRes && input.screenRes !== 'Unknown') {
        catScreen += 40;
        addFactor('resolution', input.screenRes, 40, 40, 'screen', 'desc_res_unique');
    } else {
        addFactor('resolution', 'Unknown', 0, 40, 'screen', 'desc_generic');
    }
    
    // Depth & Pixel Ratio (40)
    if (input.colorDepth > 24 || input.pixelRatio > 1 || input.hdr) {
        catScreen += 40;
        addFactor('screen_advanced', `DPR ${input.pixelRatio}`, 40, 40, 'screen', 'desc_screen_advanced');
    } else {
        addFactor('screen_advanced', 'Generic', 0, 40, 'screen', 'desc_generic');
    }

    // Remaining 20 points for multi-monitor/orientation
    catScreen += 20; 
    addFactor('screen_orientation', 'val_specific', 20, 20, 'screen', 'desc_screen_advanced');

    // --- MEDIA CATEGORY (Max 100) ---
    // Audio Context (40)
    if (input.audioRate && input.audioRate !== 'Unknown') {
        catMedia += 40;
        addFactor('audio_context', input.audioRate, 40, 40, 'media', 'desc_audio_unique');
    } else {
        addFactor('audio_context', 'Unknown', 0, 40, 'media', 'desc_generic');
    }

    // DRM (60)
    if (input.drmCount > 0) {
        catMedia += 60;
        addFactor('drm_support', `${input.drmCount} Systems`, 60, 60, 'media', 'desc_drm_unique');
    } else {
        addFactor('drm_support', '0 Systems', 0, 60, 'media', 'desc_generic');
    }

    // --- NETWORK CATEGORY (Max 100) ---
    // WebRTC Leak (80)
    if (input.webRTC && input.webRTC !== 'Hidden' && input.webRTC !== 'Not Supported') {
        catNetwork += 80;
        addFactor('webrtc_leak', input.webRTC, 80, 80, 'network', 'desc_webrtc_leak');
    } else {
        addFactor('webrtc_leak', 'val_protected', 0, 80, 'network', 'desc_webrtc_safe');
    }
    
    // Basic connection info (20)
    catNetwork += 20;
    addFactor('network_type', 'val_specific', 20, 20, 'network', 'desc_generic');

    // Normalize Categories to 100
    const normalize = (val: number) => Math.min(Math.round(val), 100);
    const scores = {
        hardware: normalize(catHardware),
        browser: normalize(catBrowser),
        screen: normalize(catScreen),
        media: normalize(catMedia),
        network: normalize(catNetwork)
    };

    // Weighted Average Total
    let calculatedTotal = 0;
    calculatedTotal += scores.hardware * weights.hardware;
    calculatedTotal += scores.browser * weights.browser;
    calculatedTotal += scores.network * weights.network;
    calculatedTotal += scores.media * weights.media;
    calculatedTotal += scores.screen * weights.screen;
    
    const totalScore = Math.round(calculatedTotal);

    let rating = 'Low';
    if (totalScore > 80) rating = 'Critical';
    else if (totalScore > 60) rating = 'High';
    else if (totalScore > 30) rating = 'Medium';

    return { 
        totalScore, 
        rating, 
        factors, 
        categoryScores: scores 
    };
};
