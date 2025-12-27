
export const videoCodecs = [
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

export const videoResolutions = [
    { label: '1080p', width: 1920, height: 1080, fps: 60, bitrate: 8000000 },
    { label: '4K', width: 3840, height: 2160, fps: 60, bitrate: 35000000 },
    { label: '8K', width: 7680, height: 4320, fps: 30, bitrate: 60000000 },
];

export const audioCodecs = [
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

export const audioConfigs = [
    { label: 'Stereo', channels: '2', bitrate: 192000, samplerate: 48000 },
    { label: '5.1', channels: '5.1', bitrate: 448000, samplerate: 48000 },
    { label: '7.1', channels: '7.1', bitrate: 768000, samplerate: 48000 },
];
