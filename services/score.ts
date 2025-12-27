
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
    clientHints?: any;
    hdr: boolean;
}

export const calculateFingerprintScore = (input: ScoreInput): FingerprintScore => {
    const factors: ScoreFactor[] = [];
    
    // Category buckets (0-100 scale for each)
    let catHardware = 0;
    let catBrowser = 0;
    let catScreen = 0;
    let catMedia = 0;
    let catNetwork = 0;

    // --- BROWSER CATEGORY (Canvas, WebGL, UA) ---
    // Canvas Hash (High entropy)
    if (input.canvasHash && input.canvasHash !== 'Error' && input.canvasHash !== 'Not Supported') {
        catBrowser += 30;
        factors.push({ id: 'canvas_hash', value: 'val_unique', score: 30, maxScore: 30, description: 'desc_canvas_unique', category: 'browser' });
    } else {
        factors.push({ id: 'canvas_hash', value: 'val_generic', score: 0, maxScore: 30, description: 'desc_canvas_generic', category: 'browser' });
    }

    // WebGL Hash (High entropy)
    if (input.webglHash && input.webglHash !== 'Error' && input.webglHash !== 'Not Supported') {
        catBrowser += 30;
        factors.push({ id: 'webgl_hash', value: 'val_unique', score: 30, maxScore: 30, description: 'desc_webgl_unique', category: 'browser' });
    }

    // User Agent & Hints
    if (input.userAgent.length > 50) {
        let uaScore = 20;
        let uaDesc = 'desc_ua_unique';
        // If Client Hints are highly specific
        if (input.clientHints && input.clientHints.model) {
            uaScore += 20; // Bonus for revealing model
            uaDesc = 'desc_ua_ch';
        }
        catBrowser += uaScore;
        factors.push({ id: 'user_agent', value: 'val_specific', score: uaScore, maxScore: 40, description: uaDesc, category: 'browser' });
    }

    // --- HARDWARE CATEGORY (CPU, GPU, RAM, Battery) ---
    // Concurrency & Memory
    if (input.cpu !== 'Unknown' && input.memory !== 'Unknown') {
        catHardware += 30;
        factors.push({ id: 'hardware_concurrency', value: `${input.cpu} Cores`, score: 30, maxScore: 30, description: 'desc_hardware_unique', category: 'hardware' });
    }

    // GPU Renderer (Very specific)
    if (input.gpuRenderer && input.gpuRenderer !== 'Unknown' && input.gpuRenderer.length > 10) {
        catHardware += 30;
        factors.push({ id: 'gpu_renderer', value: input.gpuRenderer, score: 30, maxScore: 30, description: 'desc_gpu_unique', category: 'hardware' });
    }

    // Battery (API often blocked, if available it's unique)
    if (input.battery && input.battery !== 'Unknown' && input.battery !== 'Not Supported') {
        catHardware += 20;
        factors.push({ id: 'battery_status', value: 'val_readable', score: 20, maxScore: 20, description: 'desc_battery_unique', category: 'hardware' });
    }

    // Touch
    if (input.touchPoints > 0) {
        catHardware += 20;
        factors.push({ id: 'touch_support', value: `${input.touchPoints} Points`, score: 20, maxScore: 20, category: 'hardware' });
    }

    // --- SCREEN CATEGORY ---
    // Resolution
    if (input.screenRes && input.screenRes !== 'Unknown') {
        catScreen += 40;
        factors.push({ id: 'resolution', value: input.screenRes, score: 40, maxScore: 40, description: 'desc_res_unique', category: 'screen' });
    }
    
    // Depth & Pixel Ratio
    if (input.colorDepth > 24 || input.pixelRatio > 1 || input.hdr) {
        catScreen += 40;
        factors.push({ id: 'screen_advanced', value: `DPR ${input.pixelRatio}`, score: 40, maxScore: 40, description: 'desc_screen_advanced', category: 'screen' });
    }
    // Remaining 20 points for multi-monitor/orientation (implicit in resolution often)
    catScreen += 20; 

    // --- MEDIA CATEGORY ---
    // Audio Context
    if (input.audioRate && input.audioRate !== 'Unknown') {
        catMedia += 40;
        factors.push({ id: 'audio_context', value: input.audioRate, score: 40, maxScore: 40, description: 'desc_audio_unique', category: 'media' });
    }

    // DRM (Widevine etc)
    if (input.drmCount > 0) {
        catMedia += 60;
        factors.push({ id: 'drm_support', value: `${input.drmCount} Systems`, score: 60, maxScore: 60, description: 'desc_drm_unique', category: 'media' });
    }

    // --- NETWORK CATEGORY ---
    // WebRTC Leak
    if (input.webRTC && input.webRTC !== 'Hidden' && input.webRTC !== 'Not Supported') {
        catNetwork += 80; // High impact if local IP leaks
        factors.push({ id: 'webrtc_leak', value: input.webRTC, score: 80, maxScore: 80, description: 'desc_webrtc_leak', category: 'network' });
    } else {
        factors.push({ id: 'webrtc_leak', value: 'val_protected', score: 0, maxScore: 80, description: 'desc_webrtc_safe', category: 'network' });
    }
    
    // Basic connection info
    catNetwork += 20; // Base score for having connection

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
    // Hardware and Browser are most persistent
    const totalScore = Math.round(
        (scores.hardware * 0.3) + 
        (scores.browser * 0.3) + 
        (scores.network * 0.15) + 
        (scores.media * 0.15) + 
        (scores.screen * 0.1)
    );

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
