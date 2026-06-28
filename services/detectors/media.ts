
import { CodecInfo, DrmSystem } from '../../types';
import { formatHertz } from '../../utils/formatters';

export const checkDrmSupport = async (): Promise<DrmSystem[]> => {
    const systems = [
        { name: 'Widevine', id: 'com.widevine.alpha' },
        { name: 'PlayReady', id: 'com.microsoft.playready' },
        { name: 'FairPlay', id: 'com.apple.fps' }
    ];

    // Basic config to request
    const config = [{
        initDataTypes: ['cenc'],
        audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
    }];

    // Parallelize DRM checks
    const checks = systems.map(async (sys) => {
        try {
            
            if (navigator.requestMediaKeySystemAccess) {
                
                await navigator.requestMediaKeySystemAccess(sys.id, config);
                return { name: sys.name, supported: true };
            } else {
                return { name: sys.name, supported: false };
            }
        } catch {
            return { name: sys.name, supported: false };
        }
    });

    return Promise.all(checks);
};

export const getMediaSupport = (): { video: CodecInfo[], audio: CodecInfo[], images: CodecInfo[] } => {
  const videoTypes = [
    { name: 'H.264 (AVC)', type: 'video/mp4; codecs="avc1.42E01E"' },
    { name: 'H.265 (HEVC)', type: 'video/mp4; codecs="hev1.1.6.L93.B0"' },
    { name: 'VP9', type: 'video/webm; codecs="vp9"' },
    { name: 'AV1', type: 'video/webm; codecs="av01.0.05M.08"' },
    { name: 'Ogg Theora', type: 'video/ogg; codecs="theora"' },
  ];

  const audioTypes = [
    { name: 'AAC', type: 'audio/mp4; codecs="mp4a.40.2"' },
    { name: 'MP3', type: 'audio/mpeg' },
    { name: 'Opus', type: 'audio/webm; codecs="opus"' },
    { name: 'FLAC', type: 'audio/flac' },
    { name: 'Vorbis', type: 'audio/ogg; codecs="vorbis"' },
  ];

  const check = (list: {name: string, type: string}[]) => {
    const videoEl = document.createElement('video');
    return list.map(item => ({
      name: item.name,
      supported: videoEl.canPlayType(item.type) !== ''
    }));
  };

  const imageTypes = [
      { name: 'WebP', type: 'image/webp' },
      { name: 'AVIF', type: 'image/avif' }, 
      { name: 'PNG', type: 'image/png' },
      { name: 'JPEG', type: 'image/jpeg' }
  ];

  const checkImages = () => {
      const canvas = document.createElement('canvas');
      return imageTypes.map(item => {
          const data = canvas.toDataURL(item.type);
          const supported = data.indexOf(`data:${item.type}`) === 0;
          return { name: item.name, supported };
      });
  }

  return {
    video: check(videoTypes),
    audio: check(audioTypes),
    images: checkImages()
  };
};

export const getAudioContextInfo = () => {
    const AudioContextClass = window.AudioContext || (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).webkitAudioContext;
    if (!AudioContextClass) return { rate: 'Not Supported', latency: 'Not Supported', channels: 'Unknown' };
    try {
        const ctx = new AudioContextClass();
        const rate = ctx.sampleRate;
        
        let latencyText = 'Unknown';
        if (typeof ctx.outputLatency === 'number' && ctx.outputLatency > 0) {
            latencyText = (ctx.outputLatency * 1000).toFixed(2) + ' ms';
        } else if (typeof ctx.baseLatency === 'number' && ctx.baseLatency > 0) {
            latencyText = '~' + (ctx.baseLatency * 1000).toFixed(2) + ' ms (Base)';
        }

        const channels = ctx.destination.maxChannelCount || 2;
        ctx.close();
        return { rate: formatHertz(rate), latency: latencyText, channels };
    } catch(_e) { return { rate: 'Error', latency: 'Error', channels: 'Error' }; }
};

export const getSpeechVoicesCount = (): Promise<number> => {
    return new Promise(resolve => {
        if (!window.speechSynthesis) { resolve(0); return; }
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) { resolve(voices.length); } 
        else {
            const handler = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices.length);
            };
            window.speechSynthesis.onvoiceschanged = handler;
            
            setTimeout(() => {
                resolve(0);
                window.speechSynthesis.onvoiceschanged = null;
            }, 50); // Reduced from 300ms to 50ms
        }
    });
};
