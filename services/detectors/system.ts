
import { FeatureItem, ExtendedNavigator } from '../../types';
import { formatSpeed } from '../../utils/formatters';

const nav = navigator as ExtendedNavigator;

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

export const detectAdBlocker = (): boolean => {
    const bait = document.createElement('div');
    bait.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-sponsor';
    bait.style.cssText = 'height: 10px !important; width: 10px !important; position: absolute; left: -9999px; top: -100px;';
    document.body.appendChild(bait);
    
    const detected = bait.offsetParent === null || 
                     bait.offsetHeight === 0 || 
                     bait.offsetLeft === 0 || 
                     bait.offsetTop === 0 || 
                     bait.clientWidth === 0 || 
                     bait.clientHeight === 0 ||
                     window.getComputedStyle(bait).display === 'none';
    
    document.body.removeChild(bait);
    return detected;
};

export const getWebRTCIP = async (): Promise<string> => {
    return new Promise(resolve => {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            pc.onicecandidate = (e) => {
                if (!e.candidate) { pc.close(); resolve('Hidden'); return; }
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const match = e.candidate.candidate.match(ipRegex);
                if (match) { pc.close(); resolve(match[1]); }
            };
            setTimeout(() => { pc.close(); resolve('Timeout/Hidden'); }, 200);
            pc.createOffer().then(sdp => pc.setLocalDescription(sdp));
        } catch(e) { resolve('Not Supported'); }
    });
};

export const getColorGamut = () => {
    if (window.matchMedia('(color-gamut: p3)').matches) return 'P3 (Wide)';
    if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec.2020 (Ultra Wide)';
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB (Standard)';
    return 'Unknown';
};

// New UA Client Hints Detector
export const getHighEntropyClientHints = async () => {
    if (!nav.userAgentData || !nav.userAgentData.getHighEntropyValues) {
        return undefined;
    }
    
    try {
        // Request specific hints
        const hints = ['architecture', 'model', 'platformVersion', 'bitness', 'fullVersionList'];
        const values = await nav.userAgentData.getHighEntropyValues(hints);
        return {
            architecture: values.architecture,
            model: values.model,
            platformVersion: values.platformVersion,
            bitness: values.bitness,
            fullVersionList: values.fullVersionList
        };
    } catch (e) {
        console.warn("UA-CH blocked or failed", e);
        return undefined;
    }
};

export const getPWAFeatures = (): FeatureItem[] => {
  return [
    { name: 'Web App Manifest', key: 'manifest', supported: !!document.querySelector('link[rel="manifest"]'), description: 'Defines PWA branding and behavior' },
    { name: 'Standalone Mode', key: 'standalone', supported: window.matchMedia && window.matchMedia('(display-mode: standalone)').matches, description: 'Running as installed app' },
    { name: 'Service Worker', key: 'serviceWorker', supported: 'serviceWorker' in navigator, description: 'Offline capabilities & PWA support' },
    { name: 'Background Sync', key: 'bgSync', supported: 'serviceWorker' in navigator && 'sync' in ((navigator as any).serviceWorker || {}), description: 'Defer actions until user has connectivity' },
    { name: 'Push API', key: 'pushApi', supported: 'PushManager' in window, description: 'Receive push notifications from server' },
    { name: 'Notification API', key: 'notification', supported: 'Notification' in window, description: 'System level notifications' },
    { name: 'App Badges', key: 'appBadges', supported: 'setAppBadge' in navigator, description: 'Set badges on app icon' },
    { name: 'Related Apps', key: 'relatedApps', supported: 'getInstalledRelatedApps' in navigator, description: 'Check installed related apps' },
    { name: 'Periodic Sync', key: 'periodicSync', supported: 'PeriodicSyncManager' in window, description: 'Run tasks periodically in background' },
    { name: 'Install Prompt', key: 'installPrompt', supported: 'BeforeInstallPromptEvent' in window, description: 'Custom install prompt support' },
    { name: 'Content Index', key: 'contentIndex', supported: 'ContentIndexEvent' in window, description: 'Index offline content for browser list' },
    { name: 'Protocol Handling', key: 'protocolHandling', supported: 'registerProtocolHandler' in navigator, description: 'Register custom URL schemes' },
  ];
};

export const getAdvancedFeatures = (): FeatureItem[] => {
  return [
    { name: 'WebGPU', key: 'webgpu', supported: !!nav.gpu, description: 'Next-gen graphics API' },
    { name: 'WebXR', key: 'webxr', supported: !!nav.xr, description: 'VR and AR capabilities' },
    { name: 'WebAuthn', key: 'webauthn', supported: !!(window.PublicKeyCredential), description: 'Passwordless authentication' },
    { name: 'WebNN', key: 'webnn', supported: 'ml' in nav, description: 'Hardware-accelerated machine learning' },
    { name: 'Web Bluetooth', key: 'bluetooth', supported: !!nav.bluetooth, description: 'Connect to Bluetooth devices' },
    { name: 'Web USB', key: 'usb', supported: !!nav.usb, description: 'Connect to USB devices' },
    { name: 'Payment Request', key: 'payment', supported: 'PaymentRequest' in window, description: 'Native payment processing' },
    { name: 'Digital Goods API', key: 'digitalGoods', supported: 'getDigitalGoodsService' in window, description: 'In-app purchases for Web Apps' },
    { name: 'Web NFC', key: 'nfc', supported: !!nav.nfc, description: 'Near Field Communication' },
    { name: 'Screen Wake Lock', key: 'wakeLock', supported: 'wakeLock' in navigator, description: 'Prevent screen from dimming' },
    { name: 'Idle Detection', key: 'idleDetection', supported: 'IdleDetector' in window, description: 'Detect when user is idle' },
    { name: 'File System Access', key: 'fsAccess', supported: 'showOpenFilePicker' in window, description: 'Read/Write local files' },
    { name: 'OPFS (Origin Private File System)', key: 'opfs', supported: !!(navigator.storage && navigator.storage.getDirectory), description: 'High-performance local storage' },
    { name: 'File Handling API', key: 'fileHandling', supported: 'launchQueue' in window, description: 'Register as file handler' },
    { name: 'Local Font Access', key: 'localFonts', supported: 'queryLocalFonts' in window, description: 'Access installed local fonts' },
    { name: 'Window Controls Overlay', key: 'wco', supported: 'windowControlsOverlay' in navigator, description: 'Customize PWA title bar' },
    { name: 'Broadcast Channel', key: 'broadcast', supported: 'BroadcastChannel' in window, description: 'Cross-tab communication' },
    { name: 'Web Locks API', key: 'webLocks', supported: !!navigator.locks, description: 'Cross-tab resource locking' },
    { name: 'Web Share API', key: 'webShare', supported: !!nav.share, description: 'Native sharing dialog' },
    { name: 'Contact Picker API', key: 'contactPicker', supported: 'contacts' in navigator, description: 'Access user contacts' },
    { name: 'Clipboard API', key: 'clipboard', supported: !!navigator.clipboard, description: 'Async clipboard access' },
    { name: 'Picture-in-Picture', key: 'pip', supported: 'pictureInPictureEnabled' in document, description: 'Floating video player' },
    { name: 'Geolocation', key: 'geo', supported: 'geolocation' in navigator, description: 'User location access' },
    { name: 'Web Assembly', key: 'wasm', supported: typeof WebAssembly === 'object', description: 'High-performance binary code' },
    { name: 'Web Codecs', key: 'webCodecs', supported: 'VideoEncoder' in window, description: 'Low-level media processing' },
    { name: 'Compression Streams', key: 'compression', supported: 'CompressionStream' in window, description: 'Native GZIP/Deflate' },
    { name: 'Web Transport', key: 'webTransport', supported: 'WebTransport' in window, description: 'Low-latency bidirectional streaming' },
    { name: 'Compute Pressure API', key: 'computePressure', supported: 'PressureObserver' in window, description: 'CPU/System load status' },
    { name: 'Intersection Observer', key: 'intersectionObserver', supported: 'IntersectionObserver' in window, description: 'Detect element visibility' },
    { name: 'Mutation Observer', key: 'mutationObserver', supported: 'MutationObserver' in window, description: 'Watch DOM changes' },
    { name: 'Resize Observer', key: 'resizeObserver', supported: 'ResizeObserver' in window, description: 'Watch element size' },
    { name: 'Web Components', key: 'webComponents', supported: 'customElements' in window && typeof Element !== 'undefined' && 'attachShadow' in Element.prototype, description: 'Custom reusable HTML elements' },
    { name: 'Gamepad API', key: 'gamepad', supported: typeof navigator !== 'undefined' && 'getGamepads' in navigator, description: 'Controller support' },
    { name: 'WebRTC', key: 'webrtc', supported: 'RTCPeerConnection' in window, description: 'Real-time communication' },
    { name: 'Web Audio API', key: 'webAudio', supported: 'AudioContext' in window || 'webkitAudioContext' in window, description: 'Advanced audio processing' },
    { name: 'Speech Synthesis', key: 'speechSynthesis', supported: 'speechSynthesis' in window, description: 'Text-to-speech' },
    { name: 'Speech Recognition', key: 'speechRecognition', supported: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window, description: 'Speech-to-text' },
    { name: 'WebSocket', key: 'webSocket', supported: 'WebSocket' in window, description: 'Two-way socket connection' },
    { name: 'Server-Sent Events', key: 'sse', supported: 'EventSource' in window, description: 'Server push notifications' },
    { name: 'Pointer Lock', key: 'pointerLock', supported: typeof document !== 'undefined' && 'exitPointerLock' in document, description: 'Lock mouse cursor' },
    { name: 'Fullscreen API', key: 'fullscreen', supported: typeof document !== 'undefined' && !!(document.fullscreenEnabled || (document as any).webkitFullscreenEnabled || (document as any).mozFullScreenEnabled), description: 'Native full screen' },
    { name: 'Page Visibility', key: 'pageVisibility', supported: typeof document !== 'undefined' && 'hidden' in document, description: 'Detect tab backgrounding' },
    { name: 'Drag and Drop', key: 'dragAndDrop', supported: typeof document !== 'undefined' && 'draggable' in document.createElement('span'), description: 'Native DND features' },
    { name: 'Canvas API', key: 'canvas', supported: typeof document !== 'undefined' && !!document.createElement('canvas').getContext, description: '2D dynamic rendering' },
    { name: 'MathML', key: 'mathML', supported: typeof document !== 'undefined' && document.createElement('math').namespaceURI === 'http://www.w3.org/1998/Math/MathML', description: 'Math formula markup' },
    { name: 'Vibration API', key: 'vibration', supported: typeof navigator !== 'undefined' && 'vibrate' in navigator, description: 'Hardware haptics' },
    { name: 'Battery Status', key: 'battery', supported: typeof navigator !== 'undefined' && 'getBattery' in navigator, description: 'Power level and charging' },
    { name: 'Eye Dropper', key: 'eyeDropper', supported: 'EyeDropper' in window, description: 'System color picker' },
    { name: 'Accelerometer', key: 'accelerometer', supported: 'Accelerometer' in window, description: 'Motion sensor' },
    { name: 'View Transitions API', key: 'viewTransitions', supported: 'startViewTransition' in document, description: 'Smooth DOM transitions' },
    { name: 'Popover API', key: 'popover', supported: typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('popover'), description: 'Native popovers and tooltips' },
    { name: 'Trusted Types', key: 'trustedTypes', supported: 'trustedTypes' in window, description: 'DOM XSS protection' },
    { name: 'CSS Container Queries', key: 'containerQueries', supported: typeof CSS !== 'undefined' && CSS.supports('container-type: inline-size'), description: 'Element-based responsive design' },
    { name: 'CSS Anchor Positioning', key: 'anchorPositioning', supported: typeof CSS !== 'undefined' && CSS.supports('anchor-name: --test'), description: 'Tether elements to anchors' },
    { name: 'Scroll-driven Animations', key: 'scrollAnimations', supported: typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()'), description: 'CSS tied to scroll position' },
    { name: 'Screen Capture API', key: 'screenCapture', supported: typeof navigator.mediaDevices !== 'undefined' && 'getDisplayMedia' in navigator.mediaDevices, description: 'Screen recording and sharing' },
    { name: 'Multi-Screen Placement', key: 'multiScreen', supported: 'getScreenDetails' in window, description: 'Manage multiple displays' },
    { name: 'Document PiP', key: 'documentPip', supported: 'documentPictureInPicture' in window, description: 'Arbitrary HTML in PiP' },
    { name: 'Web MIDI API', key: 'webMidi', supported: 'requestMIDIAccess' in navigator, description: 'Communicate with MIDI devices' },
    { name: 'Background Fetch', key: 'bgFetch', supported: 'BackgroundFetchManager' in window, description: 'Background large downloads' },
    { name: 'Storage Buckets API', key: 'storageBuckets', supported: navigator.storage && 'buckets' in navigator.storage, description: 'Organize persistent storage' },
    { name: 'Fenced Frames', key: 'fencedFrames', supported: 'HTMLFencedFrameElement' in window, description: 'Secure embedded content' },
    { name: 'Navigation API', key: 'navigationApi', supported: 'navigation' in window, description: 'Modern history navigation' },
    { name: 'SharedArrayBuffer', key: 'sharedArrayBuffer', supported: typeof SharedArrayBuffer !== 'undefined', description: 'Multithreaded memory access' },
    { name: 'Cross-Origin Isolated', key: 'crossOriginIsolated', supported: typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated, description: 'High-res timers & SAB enabled' },

    { name: 'Gyroscope', key: 'gyroscope', supported: 'Gyroscope' in window, description: 'Orientation sensor' },
    { name: 'Ambient Light', key: 'ambientLight', supported: 'AmbientLightSensor' in window, description: 'Light level sensor' },
  ];
};
