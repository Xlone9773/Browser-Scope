
import { FingerprintScore, ScoreFactor } from '../types';

export const calculateFingerprintScore = (
    canvasHash: string, 
    webglHash: string, 
    userAgent: string, 
    screenRes: string,
    battery: string,
    audioRate: string,
    cpu: string | number,
    memory: string | number,
    webRTC: string
): FingerprintScore => {
    const factors: ScoreFactor[] = [];
    let score = 0;

    if (canvasHash && canvasHash !== 'Error' && canvasHash !== 'Not Supported') {
        score += 20;
        factors.push({ id: 'canvas_hash', value: 'val_unique', score: 20, maxScore: 20, description: 'desc_canvas_unique' });
    } else {
        factors.push({ id: 'canvas_hash', value: 'val_generic', score: 0, maxScore: 20, description: 'desc_canvas_generic' });
    }

    if (webglHash && webglHash !== 'Error' && webglHash !== 'Not Supported') {
        score += 20;
        factors.push({ id: 'webgl_hash', value: 'val_unique', score: 20, maxScore: 20, description: 'desc_webgl_unique' });
    } else {
        factors.push({ id: 'webgl_hash', value: 'val_generic', score: 0, maxScore: 20, description: 'desc_webgl_generic' });
    }

    const hardwareVal = `${cpu} cores, ${memory}`;
    if (cpu !== 'Unknown' && memory !== 'Unknown') {
        score += 15;
        factors.push({ id: 'hardware_concurrency', value: hardwareVal, score: 15, maxScore: 15, description: 'desc_hardware_unique' });
    } else {
        factors.push({ id: 'hardware_concurrency', value: 'val_generic', score: 5, maxScore: 15, description: 'desc_hardware_generic' });
    }

    if (userAgent && userAgent.length > 50) {
        score += 10;
        factors.push({ id: 'user_agent', value: 'val_specific', score: 10, maxScore: 10, description: 'desc_ua_unique' });
    }

    if (screenRes && screenRes !== 'Unknown') {
        score += 10;
        factors.push({ id: 'resolution', value: screenRes, score: 10, maxScore: 10, description: 'desc_res_unique' });
    }

    if (audioRate && audioRate !== 'Unknown' && audioRate !== 'Error') {
        score += 10;
        factors.push({ id: 'audio_context', value: audioRate, score: 10, maxScore: 10, description: 'desc_audio_unique' });
    }

    if (battery && battery !== 'Unknown' && battery !== 'Unavailable' && battery !== 'Not Supported') {
        score += 10;
        factors.push({ id: 'battery_status', value: 'val_readable', score: 10, maxScore: 10, description: 'desc_battery_unique' });
    } else {
        factors.push({ id: 'battery_status', value: 'val_protected', score: 0, maxScore: 10, description: 'desc_battery_generic' });
    }

    score += 5;
    factors.push({ id: 'locale_time', value: 'val_readable', score: 5, maxScore: 5, description: 'desc_locale_unique' });

    return { totalScore: score, rating: score > 80 ? 'Critical' : score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low', factors };
};
