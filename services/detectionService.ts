
import { ExtendedNavigator, BrowserData, BatteryManager, FeatureItem, CodecInfo, FingerprintScore, ScoreFactor } from '../types';
import { estimateCpuFromGpu } from '../utils/cpuMapping';

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

export const getBatteryInfo = async (): Promise<{ level: string; charging: string; chargingTime: string; dischargingTime: string }> => {
  try {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      const battery: BatteryManager = await navigator.getBattery();
      
      const formatTime = (time: number) => {
          if (time === Infinity || time === 0) return 'N/A';
          const hrs = Math.floor(time / 3600);
          const mins = Math.floor((time % 3600) / 60);
          if (hrs > 0) return `${hrs}h ${mins}m`;
          return `${mins}m`;
      };

      return {
        level: `${Math.round(battery.level * 100)}%`,
        charging: battery.charging ? 'Yes' : 'No',
        chargingTime: formatTime(battery.chargingTime),
        dischargingTime: formatTime(battery.dischargingTime)
      };
    }
    return { level: 'Not Supported', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' };
  } catch (e) {
    return { level: 'Unavailable', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' };
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
    { name: 'Accelerometer', key: 'accelerometer', supported: 'Accelerometer' in window, description: 'Motion sensor' },
    { name: 'Gyroscope', key: 'gyroscope', supported: 'Gyroscope' in window, description: 'Orientation sensor' },
    { name: 'Ambient Light', key: 'ambientLight', supported: 'AmbientLightSensor' in window, description: 'Light level sensor' },
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

const getMediaSupport = (): { video: CodecInfo[], audio: CodecInfo[], images: CodecInfo[] } => {
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
      { name: 'AVIF', type: 'image/avif' }, // Harder to sync detect, usually inferred
      { name: 'PNG', type: 'image/png' },
      { name: 'JPEG', type: 'image/jpeg' }
  ];

  // Canvas based detection for images
  const checkImages = () => {
      const canvas = document.createElement('canvas');
      return imageTypes.map(item => {
          // Basic canvas export check
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

const getStorageEstimate = async (): Promise<{ quota: string, usage: string, persisted: boolean }> => {
  let quota = 'Unknown';
  let usage = '0 MB';
  let persisted = false;

  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      quota = estimate.quota ? (estimate.quota / 1024 / 1024 / 1024).toFixed(2) + ' GB' : 'Unknown';
      usage = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) + ' MB' : '0 MB';
    } catch {}
  }

  if (navigator.storage && navigator.storage.persisted) {
    try {
      persisted = await navigator.storage.persisted();
    } catch {}
  }

  return { quota, usage, persisted };
};

const getAudioContextInfo = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return { rate: 'Not Supported', latency: 'Unknown', channels: 'Unknown' };
    try {
        const ctx = new AudioContext();
        const rate = ctx.sampleRate;
        const latency = ctx.outputLatency ? (ctx.outputLatency * 1000).toFixed(2) + ' ms' : 'Unknown';
        const channels = ctx.destination.maxChannelCount || 2;
        ctx.close();
        return { rate: `${rate} Hz`, latency, channels };
    } catch(e) {
        return { rate: 'Error', latency: 'Error', channels: 'Error' };
    }
};

const getColorGamut = () => {
    if (window.matchMedia('(color-gamut: p3)').matches) return 'P3 (Wide)';
    if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec.2020 (Ultra Wide)';
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB (Standard)';
    return 'Unknown';
};

// WebRTC Local IP Detection
const getWebRTCIP = async (): Promise<string> => {
    return new Promise(resolve => {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            pc.onicecandidate = (e) => {
                if (!e.candidate) {
                    pc.close();
                    resolve('Hidden');
                    return;
                }
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const match = e.candidate.candidate.match(ipRegex);
                if (match) {
                    pc.close();
                    resolve(match[1]);
                }
            };
            
            // Timeout in case it hangs
            setTimeout(() => {
                pc.close();
                resolve('Timeout/Hidden');
            }, 1000);

            pc.createOffer().then(sdp => pc.setLocalDescription(sdp));
        } catch(e) {
            resolve('Not Supported');
        }
    });
};

const getSpeechVoicesCount = (): Promise<number> => {
    return new Promise(resolve => {
        if (!window.speechSynthesis) {
            resolve(0);
            return;
        }
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices.length);
        } else {
            // Voices load asynchronously in some browsers
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices.length);
            };
            // Fallback timeout
            setTimeout(() => resolve(0), 500);
        }
    });
};

// Helper for WASM SIMD detection
const checkWasmSimd = () => {
    try {
        // Minimal WASM with SIMD opcode
        const buffer = new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);
        return WebAssembly.validate(buffer);
    } catch(e) { return false; }
}

const calculateFingerprintScore = (
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

    // 1. Canvas Fingerprint (20 pts)
    if (canvasHash && canvasHash !== 'Error' && canvasHash !== 'Not Supported') {
        score += 20;
        factors.push({ id: 'canvas_hash', value: 'val_unique', score: 20, maxScore: 20, description: 'desc_canvas_unique' });
    } else {
        factors.push({ id: 'canvas_hash', value: 'val_generic', score: 0, maxScore: 20, description: 'desc_canvas_generic' });
    }

    // 2. WebGL Fingerprint (20 pts)
    if (webglHash && webglHash !== 'Error' && webglHash !== 'Not Supported') {
        score += 20;
        factors.push({ id: 'webgl_hash', value: 'val_unique', score: 20, maxScore: 20, description: 'desc_webgl_unique' });
    } else {
        factors.push({ id: 'webgl_hash', value: 'val_generic', score: 0, maxScore: 20, description: 'desc_webgl_generic' });
    }

    // 3. Hardware (CPU/Memory) (15 pts)
    const hardwareVal = `${cpu} cores, ${memory}`;
    if (cpu !== 'Unknown' && memory !== 'Unknown') {
        score += 15;
        factors.push({ id: 'hardware_concurrency', value: hardwareVal, score: 15, maxScore: 15, description: 'desc_hardware_unique' });
    } else {
        factors.push({ id: 'hardware_concurrency', value: 'val_generic', score: 5, maxScore: 15, description: 'desc_hardware_generic' });
    }

    // 4. User Agent (10 pts)
    if (userAgent && userAgent.length > 50) {
        score += 10;
        factors.push({ id: 'user_agent', value: 'val_specific', score: 10, maxScore: 10, description: 'desc_ua_unique' });
    }

    // 5. Screen Resolution (10 pts)
    if (screenRes && screenRes !== 'Unknown') {
        score += 10;
        factors.push({ id: 'resolution', value: screenRes, score: 10, maxScore: 10, description: 'desc_res_unique' });
    }

    // 6. Audio Context (10 pts)
    if (audioRate && audioRate !== 'Unknown' && audioRate !== 'Error') {
        score += 10;
        factors.push({ id: 'audio_context', value: audioRate, score: 10, maxScore: 10, description: 'desc_audio_unique' });
    }

    // 7. Battery API (10 pts) - Highly invasive if allowed
    if (battery && battery !== 'Unknown' && battery !== 'Unavailable' && battery !== 'Not Supported') {
        score += 10;
        factors.push({ id: 'battery_status', value: 'val_readable', score: 10, maxScore: 10, description: 'desc_battery_unique' });
    } else {
        factors.push({ id: 'battery_status', value: 'val_protected', score: 0, maxScore: 10, description: 'desc_battery_generic' });
    }

    // 8. Timezone & Locale (5 pts)
    score += 5;
    factors.push({ id: 'locale_time', value: 'val_readable', score: 5, maxScore: 5, description: 'desc_locale_unique' });

    return { totalScore: score, rating: score > 80 ? 'Critical' : score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low', factors };
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
  const webrtcIp = await getWebRTCIP();
  const speechVoices = await getSpeechVoicesCount();
  const cpuModel = estimateCpuFromGpu(gpu.renderer);
  
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  const deviceMemory = nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown';
  
  // Peripherals
  // @ts-ignore
  const screenExtended = window.screen.isExtended || false;
  const gamepads = navigator.getGamepads ? navigator.getGamepads().filter(g => g !== null).length : 0;

  // Security
  const isBot = nav.webdriver || false;
  const gpcEnabled = nav.globalPrivacyControl || false;
  // @ts-ignore
  const pdfViewer = nav.pdfViewerEnabled || false;
  const secureContext = window.isSecureContext;

  // AI & Compute
  const wasmSupport = typeof WebAssembly === 'object';
  const wasmSimd = checkWasmSimd();
  // @ts-ignore
  const windowAi = !!(window.ai || window.model);
  const webnn = !!nav.ml;
  const webgpuCompute = !!nav.gpu; // Rough proxy, assumes if WebGPU exists, compute shader works

  const score = calculateFingerprintScore(
      canvasInfo.hash, 
      webglHash, 
      navigator.userAgent, 
      `${window.screen.width} x ${window.screen.height}`,
      battery.level,
      audioInfo.rate,
      cpuCores,
      deviceMemory,
      webrtcIp
  );

  const isPwaInstalled = window.matchMedia('(display-mode: standalone)').matches;

  return {
    system: {
      os: detectOS(),
      platform: navigator.platform,
      browserName: browser.name,
      browserVersion: browser.version,
      language: navigator.language,
      preferredLanguages: [...(navigator.languages || [])],
      userAgent: navigator.userAgent,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'Unspecified',
      isPwaInstalled,
    },
    hardware: {
      cpuCores: cpuCores,
      cpuModel: cpuModel || undefined,
      memory: deviceMemory,
      gpuRenderer: gpu.renderer,
      gpuVendor: gpu.vendor,
      maxTextureSize: gpu.maxTextureSize,
      batteryLevel: battery.level,
      isCharging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      touchPoints: navigator.maxTouchPoints,
      audioSampleRate: audioInfo.rate,
      screenExtended,
      gamepads,
    },
    fingerprints: {
      canvasHash: canvasInfo.hash,
      canvasImage: canvasInfo.dataUri,
      webglHash: webglHash,
      webglRenderer: gpu.renderer,
      webglExtensions: webglExtensions,
      audioLatency: audioInfo.latency,
      score: score,
    },
    display: {
      resolution: `${window.screen.width} x ${window.screen.height}`,
      availableSize: `${window.screen.availWidth} x ${window.screen.availHeight}`,
      windowSize: `${window.innerWidth} x ${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation ? window.screen.orientation.type : 'Unknown',
      orientationAngle: window.screen.orientation ? `${window.screen.orientation.angle}°` : '0°',
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      colorGamut: getColorGamut(),
      hdr: window.matchMedia('(dynamic-range: high)').matches,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'Standalone (PWA)' : 'Browser Tab',
    },
    network: {
      online: navigator.onLine,
      effectiveType: connection ? connection.effectiveType || 'Unknown' : 'Unknown',
      type: connection ? connection.type || 'Unknown' : 'Unknown',
      downlink: connection ? `${connection.downlink} Mbps` : 'Unknown',
      downlinkMax: connection && connection.downlinkMax ? `${connection.downlinkMax} Mbps` : 'Unknown',
      rtt: connection ? `${connection.rtt} ms` : 'Unknown',
      saveData: connection ? connection.saveData || false : false,
      webrtcIp,
    },
    security: {
        isBot,
        gpcEnabled,
        pdfViewer,
        secureContext
    },
    ai: {
        wasmSupport,
        wasmSimd,
        webnn,
        windowAi,
        webgpuCompute
    },
    media: {
      video: mediaSupport.video,
      audio: mediaSupport.audio,
      images: mediaSupport.images,
      speechVoices,
      audioChannels: audioInfo.channels
    },
    storage: {
      quota: storage.quota,
      usage: storage.usage,
      persisted: storage.persisted,
    },
    localization: {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
    },
    features: getAdvancedFeatures(),
    pwaFeatures: getPWAFeatures(),
  };
};
