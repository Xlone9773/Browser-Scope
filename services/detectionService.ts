import { ExtendedNavigator, BrowserData, BatteryManager, FeatureItem, CodecInfo } from '../types';

const nav = navigator as ExtendedNavigator;

// Helper to hash string
const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return '00000000';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const getGPUInfo = (): { renderer: string; vendor: string; maxTextureSize: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { renderer: 'Unknown', vendor: 'Unknown', maxTextureSize: 'Unknown' };

    const ctx = gl as WebGLRenderingContext;
    const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
    const maxTexSize = ctx.getParameter(ctx.MAX_TEXTURE_SIZE);

    if (!debugInfo) return { renderer: 'Unknown', vendor: 'Unknown', maxTextureSize: maxTexSize ? `${maxTexSize}px` : 'Unknown' };

    const renderer = ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    return { renderer, vendor, maxTextureSize: `${maxTexSize}px` };
  } catch (e) {
    return { renderer: 'Unavailable', vendor: 'Unavailable', maxTextureSize: 'Unavailable' };
  }
};

// Get list of supported WebGL extensions
export const getWebGLExtensions = (): string[] => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return [];
    
    // @ts-ignore
    const extensions = gl.getSupportedExtensions();
    return extensions ? extensions.sort() : [];
  } catch (e) {
    return [];
  }
};

// Generate a robust canvas fingerprint with vectors and text
const getCanvasFingerprint = (): { hash: string; dataUri: string } => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { hash: 'Not Supported', dataUri: '' };

    canvas.width = 280;
    canvas.height = 60;
    
    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text with different baselines and blending
    ctx.textBaseline = "alphabetic";
    ctx.font = "16px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(100, 5, 60, 20);
    
    ctx.fillStyle = "#069";
    ctx.fillText("BrowserScope v1.0", 2, 20);
    
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.font = "18px 'Times New Roman'";
    ctx.fillText("Fingerprint", 5, 45);

    // Vector Drawing: Winding Rule Test
    ctx.beginPath();
    ctx.arc(200, 30, 20, 0, Math.PI * 2, true);
    ctx.arc(200, 30, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(200, 0, 200, 0.5)";
    ctx.fill("evenodd"); // Important for fingerprinting
    
    // Vector Drawing: Complex Path
    ctx.beginPath();
    ctx.moveTo(240, 10);
    ctx.lineTo(260, 50);
    ctx.lineTo(220, 50);
    ctx.closePath();
    ctx.strokeStyle = "#f0f";
    ctx.lineWidth = 3;
    ctx.stroke();

    const dataUri = canvas.toDataURL();
    const b64 = dataUri.replace("data:image/png;base64,", "");
    
    return {
        hash: simpleHash(b64),
        dataUri: dataUri
    };
  } catch (e) {
    return { hash: 'Error', dataUri: '' };
  }
};

const getWebGLFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return 'Not Supported';
        
        // Simple render to detect differences
        const vShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vShader, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}');
        gl.compileShader(vShader);
        
        const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fShader, 'void main(){gl_FragColor=vec4(0.5,0.2,0.8,1.0);}');
        gl.compileShader(fShader);
        
        const program = gl.createProgram()!;
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,1,-1,1,-1,-1,1,-1]), gl.STATIC_DRAW);
        
        const loc = gl.getAttribLocation(program, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
        const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        
        return simpleHash(pixels.join(''));
    } catch(e) {
        return 'Error';
    }
};

export const getBatteryInfo = async (): Promise<{ level: string; charging: string }> => {
  try {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      const battery: BatteryManager = await navigator.getBattery();
      return {
        level: `${Math.round(battery.level * 100)}%`,
        charging: battery.charging ? 'Yes' : 'No',
      };
    }
    return { level: 'Not Supported', charging: 'Unknown' };
  } catch (e) {
    return { level: 'Unavailable', charging: 'Unknown' };
  }
};

export const getPWAFeatures = (): FeatureItem[] => {
  return [
    { name: 'Service Worker', key: 'serviceWorker', supported: 'serviceWorker' in navigator, description: 'Offline capabilities & PWA support' },
    { name: 'Background Sync', key: 'bgSync', supported: 'serviceWorker' in navigator && 'sync' in ((navigator as any).serviceWorker || {}), description: 'Defer actions until user has connectivity' },
    { name: 'Push API', key: 'pushApi', supported: 'PushManager' in window, description: 'Receive push notifications from server' },
    { name: 'Notification API', key: 'notification', supported: 'Notification' in window, description: 'System level notifications' },
    { name: 'App Badges', key: 'appBadges', supported: 'setAppBadge' in navigator, description: 'Set badges on app icon' },
  ];
};

export const getAdvancedFeatures = (): FeatureItem[] => {
  const features: FeatureItem[] = [
    { name: 'WebGPU', key: 'webgpu', supported: !!nav.gpu, description: 'Next-gen graphics API' },
    { name: 'WebXR', key: 'webxr', supported: !!nav.xr, description: 'VR and AR capabilities' },
    { name: 'WebAuthn', key: 'webauthn', supported: !!(window.PublicKeyCredential), description: 'Passwordless authentication' },
    { name: 'Web Bluetooth', key: 'bluetooth', supported: !!nav.bluetooth, description: 'Connect to Bluetooth devices' },
    { name: 'Web USB', key: 'usb', supported: !!nav.usb, description: 'Connect to USB devices' },
    { name: 'Payment Request', key: 'payment', supported: 'PaymentRequest' in window, description: 'Native payment processing' },
    { name: 'Web NFC', key: 'nfc', supported: !!nav.nfc, description: 'Near Field Communication' },
    { name: 'Screen Wake Lock', key: 'wakeLock', supported: 'wakeLock' in navigator, description: 'Prevent screen from dimming' },
    { name: 'File System Access', key: 'fsAccess', supported: 'showOpenFilePicker' in window, description: 'Read/Write local files' },
    { name: 'Broadcast Channel', key: 'broadcast', supported: 'BroadcastChannel' in window, description: 'Cross-tab communication' },
    { name: 'Web Share API', key: 'webShare', supported: !!nav.share, description: 'Native sharing dialog' },
    { name: 'Clipboard API', key: 'clipboard', supported: !!navigator.clipboard, description: 'Async clipboard access' },
    { name: 'Picture-in-Picture', key: 'pip', supported: 'pictureInPictureEnabled' in document, description: 'Floating video player' },
    { name: 'Geolocation', key: 'geo', supported: 'geolocation' in navigator, description: 'User location access' },
    { name: 'Web Assembly', key: 'wasm', supported: typeof WebAssembly === 'object', description: 'High-performance binary code' },
    { name: 'Web Codecs', key: 'webCodecs', supported: 'VideoEncoder' in window, description: 'Low-level media processing' },
    { name: 'Compression Streams', key: 'compression', supported: 'CompressionStream' in window, description: 'Native GZIP/Deflate' },
    { name: 'Web Transport', key: 'webTransport', supported: 'WebTransport' in window, description: 'Low-latency bidirectional streaming' },
    { name: 'Eye Dropper', key: 'eyeDropper', supported: 'EyeDropper' in window, description: 'System color picker' },
  ];
  return features;
};

export const detectOS = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) return 'macOS';
  if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
  if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Linux/.test(platform)) return 'Linux';

  return 'Unknown OS';
};

export const detectBrowser = (): { name: string; version: string } => {
  const ua = navigator.userAgent;
  let tem;
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
  }
  
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  
  return { name: M[0], version: M[1] };
};

const getMediaSupport = (): { video: CodecInfo[], audio: CodecInfo[] } => {
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

  return {
    video: check(videoTypes),
    audio: check(audioTypes)
  };
};

const getStorageEstimate = async (): Promise<{ quota: string, usage: string }> => {
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota ? (estimate.quota / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'Unknown';
      const usage = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) + ' MB' : '0 MB';
      return { quota, usage };
    } catch {
      return { quota: 'Unavailable', usage: 'Unavailable' };
    }
  }
  return { quota: 'Not Supported', usage: 'Not Supported' };
};

const getAudioContextInfo = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return { rate: 'Not Supported', latency: 'Unknown' };
    try {
        const ctx = new AudioContext();
        const rate = ctx.sampleRate;
        const latency = ctx.outputLatency ? (ctx.outputLatency * 1000).toFixed(2) + ' ms' : 'Unknown';
        ctx.close();
        return { rate: `${rate} Hz`, latency };
    } catch(e) {
        return { rate: 'Error', latency: 'Error' };
    }
};

const getColorGamut = () => {
    if (window.matchMedia('(color-gamut: p3)').matches) return 'P3 (Wide)';
    if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec.2020 (Ultra Wide)';
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB (Standard)';
    return 'Unknown';
};

export const getAllData = async (): Promise<BrowserData> => {
  const gpu = getGPUInfo();
  const battery = await getBatteryInfo();
  const browser = detectBrowser();
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const mediaSupport = getMediaSupport();
  const storage = await getStorageEstimate();
  const audioInfo = getAudioContextInfo();
  const canvasInfo = getCanvasFingerprint();
  const webglHash = getWebGLFingerprint();
  const webglExtensions = getWebGLExtensions();

  return {
    system: {
      os: detectOS(),
      platform: navigator.platform,
      browserName: browser.name,
      browserVersion: browser.version,
      language: navigator.language,
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'Unspecified',
    },
    hardware: {
      cpuCores: navigator.hardwareConcurrency || 'Unknown',
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown',
      gpuRenderer: gpu.renderer,
      gpuVendor: gpu.vendor,
      maxTextureSize: gpu.maxTextureSize,
      batteryLevel: battery.level,
      isCharging: battery.charging,
      touchPoints: navigator.maxTouchPoints,
      audioSampleRate: audioInfo.rate,
    },
    fingerprints: {
      canvasHash: canvasInfo.hash,
      canvasImage: canvasInfo.dataUri,
      webglHash: webglHash,
      webglRenderer: gpu.renderer,
      webglExtensions: webglExtensions,
      audioLatency: audioInfo.latency,
    },
    display: {
      resolution: `${window.screen.width} x ${window.screen.height}`,
      availableSize: `${window.screen.availWidth} x ${window.screen.availHeight}`,
      windowSize: `${window.innerWidth} x ${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation ? window.screen.orientation.type : 'Unknown',
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      colorGamut: getColorGamut(),
      hdr: window.matchMedia('(dynamic-range: high)').matches,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'Standalone (PWA)' : 'Browser Tab',
    },
    network: {
      online: navigator.onLine,
      effectiveType: connection ? connection.effectiveType || 'Unknown' : 'Unknown',
      downlink: connection ? `${connection.downlink} Mbps` : 'Unknown',
      rtt: connection ? `${connection.rtt} ms` : 'Unknown',
      saveData: connection ? connection.saveData || false : false,
    },
    media: mediaSupport,
    storage: storage,
    localization: {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
    },
    features: getAdvancedFeatures(),
    pwaFeatures: getPWAFeatures(),
  };
};
