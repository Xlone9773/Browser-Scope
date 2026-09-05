
export interface VideoCodecDefinition {
    name: string;
    profile: string;
    type: string;
    bitDepth: number;
    tag: 'SDR' | 'HDR10' | 'HDR10+' | 'HLG' | 'Dolby' | 'NextGen' | 'Pro' | 'WebRTC' | 'ProRes' | 'Alpha' | 'Legacy';
    category: 'sdr' | 'hdr' | 'nextgen' | 'dolby' | 'webrtc' | 'legacy';
    hdrConfig?: {
        transferFunction?: string;
        colorGamut?: string;
    };
    description?: string;
}

export interface VideoResolutionDefinition {
    label: string;
    width: number;
    height: number;
    fps: number;
    bitrate: number;
}

export interface AudioCodecDefinition {
    name: string;
    type: string;
    label: string;
    tag: 'Web' | 'Hi-Res' | 'Dolby' | 'DTS' | 'Spatial' | 'NextGen';
    category: 'web' | 'hires' | 'cinema';
}

export interface AudioConfigDefinition {
    label: string;
    channels: string;
    bitrate: number;
    samplerate: number;
}

export interface DrmSystemDefinition {
    id: string;
    name: string;
    vendor: string;
}

export const videoCodecs: VideoCodecDefinition[] = [
    // Standard SDR Codecs
    { 
        name: 'H.264 (AVC)', 
        profile: 'High Profile (L5.1)',
        type: 'video/mp4; codecs="avc1.640033"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr',
        description: 'Universal Web & Streaming Standard'
    },
    { 
        name: 'H.264 (AVC)', 
        profile: 'Baseline (WebRTC)',
        type: 'video/mp4; codecs="avc1.42E01E"', 
        bitDepth: 8,
        tag: 'WebRTC',
        category: 'webrtc',
        description: 'Low-latency Mobile & RTC Standard'
    },
    { 
        name: 'H.264 (AVC)', 
        profile: 'Main Profile',
        type: 'video/mp4; codecs="avc1.4D401F"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr'
    },
    { 
        name: 'H.264 (AVC)', 
        profile: 'High 10 (10-bit)',
        type: 'video/mp4; codecs="avc1.6E0033"', 
        bitDepth: 10,
        tag: 'Pro',
        category: 'sdr',
        description: 'Hi10P Anime & Master Distribution'
    },
    { 
        name: 'HEVC (H.265)', 
        profile: 'Main (hvc1)',
        type: 'video/mp4; codecs="hvc1.1.6.L150.B0"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr',
        description: 'Out-of-band parameter sets (Standard MP4)'
    },
    { 
        name: 'HEVC (H.265)', 
        profile: 'Main (hev1 in-band)',
        type: 'video/mp4; codecs="hev1.1.6.L150.B0"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr',
        description: 'In-band parameter sets (Apple/Safari Native)'
    },
    { 
        name: 'VP9', 
        profile: 'Profile 0 (8-bit 4:2:0)',
        type: 'video/webm; codecs="vp09.00.51.08.01.01.01.01.00"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr',
        description: 'YouTube 4K Mainstream Standard'
    },
    { 
        name: 'VP8', 
        profile: 'VP8 (WebM/RTC)',
        type: 'video/webm; codecs="vp8"', 
        bitDepth: 8,
        tag: 'WebRTC',
        category: 'webrtc',
        description: 'Legacy WebRTC & WebM Standard'
    },
    { 
        name: 'AV1', 
        profile: 'Main Profile (8-bit)',
        type: 'video/mp4; codecs="av01.0.09M.08"', 
        bitDepth: 8,
        tag: 'SDR',
        category: 'sdr',
        description: 'Next-Gen Royalty-Free Standard'
    },
    
    // HDR & Wide Color Standards
    { 
        name: 'HEVC (H.265)', 
        profile: 'Main 10 (HDR10)',
        type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HDR10',
        category: 'hdr',
        description: '4K UHD Blu-ray & Streaming HDR Standard'
    },
    { 
        name: 'HEVC (H.265)', 
        profile: 'Main 10 (HLG)',
        type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
        hdrConfig: { transferFunction: 'hlg', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HLG',
        category: 'hdr',
        description: 'Broadcast HDR (BBC/NHK)'
    },
    { 
        name: 'HEVC (H.265)', 
        profile: 'Main 10 (HDR10+)',
        type: 'video/mp4; codecs="hvc1.2.4.L153.B0"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HDR10+',
        category: 'hdr',
        description: 'Dynamic Metadata HDR (Samsung / Prime Video)'
    },
    { 
        name: 'VP9', 
        profile: 'Profile 2 (HDR10)',
        type: 'video/webm; codecs="vp09.02.51.10.01.09.16.09.01"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HDR10',
        category: 'hdr',
        description: 'YouTube HDR Video Streaming'
    },
    { 
        name: 'AV1', 
        profile: 'Main 10 (HDR10)',
        type: 'video/mp4; codecs="av01.0.12M.10"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HDR10',
        category: 'hdr',
        description: 'Next-Gen Royalty-Free HDR10'
    },
    { 
        name: 'AV1', 
        profile: 'Main 10 (HLG)',
        type: 'video/mp4; codecs="av01.0.12M.10"', 
        hdrConfig: { transferFunction: 'hlg', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'HLG',
        category: 'hdr',
        description: 'Royalty-Free Broadcast HLG'
    },

    // Next-Gen & Professional Codecs
    { 
        name: 'VVC (H.266)', 
        profile: 'Main 10 (vvc1)',
        type: 'video/mp4; codecs="vvc1.1.L5.1"', 
        bitDepth: 10,
        tag: 'NextGen',
        category: 'nextgen',
        description: 'MPEG-I Versatile Video Coding (50% bitrate reduction over HEVC)'
    },
    { 
        name: 'VVC (H.266)', 
        profile: 'Main 10 HDR (vvc1)',
        type: 'video/mp4; codecs="vvc1.1.L5.1"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'NextGen',
        category: 'nextgen',
        description: 'VVC HDR 10-bit Ultra HD'
    },
    { 
        name: 'AV1', 
        profile: 'High Profile (4:4:4)',
        type: 'video/mp4; codecs="av01.1.08M.10"', 
        bitDepth: 10,
        tag: 'Pro',
        category: 'nextgen',
        description: 'AV1 Professional Color Sampling'
    },
    { 
        name: 'AV1', 
        profile: 'Professional (12-bit)',
        type: 'video/mp4; codecs="av01.2.08M.12"', 
        bitDepth: 12,
        tag: 'Pro',
        category: 'nextgen',
        description: 'AV1 Cinema & Studio Grade 12-bit'
    },
    { 
        name: 'HEVC (H.265)', 
        profile: 'Range Extension (RExt 4:2:2/4:4:4)',
        type: 'video/mp4; codecs="hvc1.4.10.L150.B0"', 
        bitDepth: 10,
        tag: 'Pro',
        category: 'nextgen',
        description: 'High-end Broadcast Camera Output'
    },
    { 
        name: 'VP9', 
        profile: 'Profile 1 (4:4:4 8-bit)',
        type: 'video/webm; codecs="vp09.01.51.08.01.01.01.01.00"', 
        bitDepth: 8,
        tag: 'Pro',
        category: 'nextgen'
    },

    // Dolby Vision Ecosystem
    { 
        name: 'Dolby Vision', 
        profile: 'Profile 5 (Single-layer HEVC)',
        type: 'video/mp4; codecs="dvhe.05.06"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'Dolby',
        category: 'dolby',
        description: 'Streaming standard (Netflix, Disney+, Apple TV+)'
    },
    { 
        name: 'Dolby Vision', 
        profile: 'Profile 8.1 (HDR10 Base)',
        type: 'video/mp4; codecs="dvhe.08.06"', 
        hdrConfig: { transferFunction: 'pq', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'Dolby',
        category: 'dolby',
        description: 'Cross-compatible with HDR10 hardware'
    },
    { 
        name: 'Dolby Vision', 
        profile: 'Profile 8.4 (Apple iPhone HDR)',
        type: 'video/mp4; codecs="dvh1.08.06"', 
        hdrConfig: { transferFunction: 'hlg', colorGamut: 'rec2020' },
        bitDepth: 10,
        tag: 'Dolby',
        category: 'dolby',
        description: 'iPhone 12-16 Camera Native HDR Recording'
    },
    { 
        name: 'Dolby Vision', 
        profile: 'Profile 4 (Dual-track HEVC)',
        type: 'video/mp4; codecs="dvhe.04.06"', 
        bitDepth: 10,
        tag: 'Dolby',
        category: 'dolby'
    },

    // Alpha / Production / Specialized
    { 
        name: 'WebM VP9 Alpha', 
        profile: 'Transparent Video',
        type: 'video/webm; codecs="vp09.00.51.08"', 
        bitDepth: 8,
        tag: 'Alpha',
        category: 'nextgen',
        description: 'Alpha Channel Transparent Video for Web UI'
    },
    { 
        name: 'Apple ProRes', 
        profile: 'ProRes 422 HQ',
        type: 'video/quicktime; codecs="apch"', 
        bitDepth: 10,
        tag: 'ProRes',
        category: 'nextgen',
        description: 'Apple Post-production Intermediate Codec'
    },
    { 
        name: 'Apple ProRes', 
        profile: 'ProRes 4444 (Alpha)',
        type: 'video/quicktime; codecs="ap4h"', 
        bitDepth: 12,
        tag: 'ProRes',
        category: 'nextgen',
        description: 'Lossless Visual Quality with Transparency'
    },
    { 
        name: 'Motion JPEG', 
        profile: 'MJPEG',
        type: 'video/mp4; codecs="mjpg"', 
        bitDepth: 8,
        tag: 'Legacy',
        category: 'legacy',
        description: 'Hardware USB Webcam & Industrial Capture'
    },
    { 
        name: 'MPEG-4 Visual', 
        profile: 'Part 2 (DivX / Xvid)',
        type: 'video/mp4; codecs="mp4v.20.8"', 
        bitDepth: 8,
        tag: 'Legacy',
        category: 'legacy'
    },
    { 
        name: 'Ogg Theora', 
        profile: 'Theora',
        type: 'video/ogg; codecs="theora"', 
        bitDepth: 8,
        tag: 'Legacy',
        category: 'legacy'
    },
];

export const videoResolutions: VideoResolutionDefinition[] = [
    { label: '720p', width: 1280, height: 720, fps: 60, bitrate: 4000000 },
    { label: '1080p', width: 1920, height: 1080, fps: 60, bitrate: 8000000 },
    { label: '1440p (2K)', width: 2560, height: 1440, fps: 60, bitrate: 16000000 },
    { label: '4K', width: 3840, height: 2160, fps: 60, bitrate: 35000000 },
    { label: '4K 120fps', width: 3840, height: 2160, fps: 120, bitrate: 60000000 },
    { label: '8K', width: 7680, height: 4320, fps: 60, bitrate: 80000000 },
];

export const audioCodecs: AudioCodecDefinition[] = [
    // Common Web & Streaming
    { name: 'AAC (LC)', type: 'audio/mp4; codecs="mp4a.40.2"', label: 'AAC-LC', tag: 'Web', category: 'web' },
    { name: 'HE-AAC (v1/v2)', type: 'audio/mp4; codecs="mp4a.40.5"', label: 'AAC+', tag: 'Web', category: 'web' },
    { name: 'xHE-AAC (USAC)', type: 'audio/mp4; codecs="mp4a.40.42"', label: 'xHE-AAC', tag: 'NextGen', category: 'web' },
    { name: 'MP3', type: 'audio/mpeg', label: 'MP3', tag: 'Web', category: 'web' },
    { name: 'Opus', type: 'audio/webm; codecs="opus"', label: 'Opus', tag: 'Web', category: 'web' },
    { name: 'Vorbis', type: 'audio/ogg; codecs="vorbis"', label: 'Vorbis', tag: 'Web', category: 'web' },
    
    // High Fidelity / Lossless
    { name: 'FLAC', type: 'audio/flac', label: 'FLAC', tag: 'Hi-Res', category: 'hires' },
    { name: 'WAV (PCM)', type: 'audio/wav; codecs="1"', label: 'PCM', tag: 'Hi-Res', category: 'hires' },
    { name: 'ALAC', type: 'audio/mp4; codecs="alac"', label: 'Apple Lossless', tag: 'Hi-Res', category: 'hires' },
    
    // Cinema / Surround / Spatial
    { name: 'Dolby Digital', type: 'audio/mp4; codecs="ac-3"', label: 'AC-3', tag: 'Dolby', category: 'cinema' },
    { name: 'Dolby Digital+', type: 'audio/mp4; codecs="ec-3"', label: 'E-AC-3', tag: 'Dolby', category: 'cinema' },
    { name: 'Dolby Atmos (JOC)', type: 'audio/mp4; codecs="ec-3"', label: 'Atmos Spatial', tag: 'Dolby', category: 'cinema' },
    { name: 'Dolby TrueHD', type: 'audio/mp4; codecs="mlpa"', label: 'TrueHD Lossless', tag: 'Dolby', category: 'cinema' },
    { name: 'DTS Digital', type: 'audio/mp4; codecs="dtsc"', label: 'DTS 5.1', tag: 'DTS', category: 'cinema' },
    { name: 'DTS-HD MA / DTS:X', type: 'audio/mp4; codecs="dtsh"', label: 'DTS-HD Master', tag: 'DTS', category: 'cinema' },
    { name: 'MPEG-H 3D Audio', type: 'audio/mp4; codecs="mhm1"', label: 'MPEG-H Spatial', tag: 'Spatial', category: 'cinema' },
];

export const audioConfigs: AudioConfigDefinition[] = [
    { label: 'Stereo', channels: '2', bitrate: 192000, samplerate: 48000 },
    { label: '5.1 Surround', channels: '5.1', bitrate: 448000, samplerate: 48000 },
    { label: '7.1 Surround', channels: '7.1', bitrate: 768000, samplerate: 48000 },
    { label: 'Hi-Res 96k', channels: '2', bitrate: 4608000, samplerate: 96000 },
];

export const drmSystems: DrmSystemDefinition[] = [
    { id: 'com.widevine.alpha', name: 'Widevine', vendor: 'Google' },
    { id: 'com.microsoft.playready', name: 'PlayReady', vendor: 'Microsoft' },
    { id: 'com.microsoft.playready.recommendation', name: 'PlayReady HW', vendor: 'Microsoft' },
    { id: 'com.apple.fps', name: 'FairPlay', vendor: 'Apple' },
    { id: 'com.apple.fps.1_0', name: 'FairPlay v1', vendor: 'Apple' },
    { id: 'com.apple.fps.2_0', name: 'FairPlay v2', vendor: 'Apple' },
    { id: 'com.apple.fps.3_0', name: 'FairPlay v3', vendor: 'Apple' },
    { id: 'org.w3.clearkey', name: 'ClearKey', vendor: 'W3C' },
];

