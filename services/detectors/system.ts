import { FeatureItem, ExtendedNavigator } from '../../types';

// Do not capture navigator at module load time. Use a getter so tests can stub globalThis.navigator.
function getNavigator(): ExtendedNavigator | undefined {
  return (typeof navigator !== 'undefined' ? (navigator as ExtendedNavigator) : undefined);
}

// Brave 某些版本会把 navigator.keyboard 设为 null，先做类型安全的判空再检查 getLayoutMap
export function hasKeyboardLayoutMap(navObj?: ExtendedNavigator): boolean {
  const n = navObj ?? getNavigator();
  if (!n) return false;
  const kb = n.keyboard; // NavigatorKeyboard | null | undefined (defined in types.ts)
  return kb != null && typeof kb.getLayoutMap === 'function';
}

export const detectOS = (): string => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const platform = typeof window !== 'undefined' ? window.navigator.platform : '';
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
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
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
        } catch { resolve('Not Supported'); }
    });
};

export const getColorGamut = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(color-gamut: p3)').matches) return 'P3 (Wide)';
    if (typeof window !== 'undefined' && window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec.2020 (Ultra Wide)';
    if (typeof window !== 'undefined' && window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB (Standard)';
    return 'Unknown';
};

// New UA Client Hints Detector
export const getHighEntropyClientHints = async () => {
    const n = getNavigator();
    if (!n?.userAgentData || !n.userAgentData.getHighEntropyValues) {
        return undefined;
    }
    
    try {
        // Request specific hints
        const hints = ['architecture', 'model', 'platformVersion', 'bitness', 'fullVersionList'];
        const values = await n.userAgentData.getHighEntropyValues(hints) as Record<string, unknown>;
        return {
            architecture: values.architecture as string | undefined,
            model: values.model as string | undefined,
            platformVersion: values.platformVersion as string | undefined,
            bitness: values.bitness as string | undefined,
            fullVersionList: values.fullVersionList as { brand: string; version: string }[] | undefined
        };
    } catch (e: unknown) {
        console.warn("UA-CH blocked or failed", e);
        return undefined;
    }
};

export const getPWAFeatures = (): FeatureItem[] => {
  const n = getNavigator();
  return [
    { name: 'Web App Manifest', key: 'manifest', supported: !!(typeof document !== 'undefined' && document.querySelector && document.querySelector('link[rel="manifest"]')), description: 'Defines PWA branding and behavior' },
    { name: 'Standalone Mode', key: 'standalone', supported: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches, description: 'Running as installed app' },
    { name: 'Service Worker', key: 'serviceWorker', supported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator, description: 'Offline capabilities & PWA support' },
    { name: 'Background Sync', key: 'bgSync', supported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'sync' in ((navigator as unknown as { serviceWorker?: Record<string, unknown> }).serviceWorker || {}), description: 'Background sync support' },
    { name: 'Push API', key: 'pushApi', supported: typeof window !== 'undefined' && 'PushManager' in window, description: 'Receive push notifications from server' },
    { name: 'Notification API', key: 'notification', supported: typeof window !== 'undefined' && 'Notification' in window, description: 'System level notifications' },
    { name: 'App Badges', key: 'appBadges', supported: typeof navigator !== 'undefined' && 'setAppBadge' in navigator, description: 'Set badges on app icon' },
    { name: 'Related Apps', key: 'relatedApps', supported: typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator, description: 'Check installed related apps' },
    { name: 'Periodic Sync', key: 'periodicSync', supported: typeof window !== 'undefined' && 'PeriodicSyncManager' in window, description: 'Run tasks periodically in background' },
    { name: 'Install Prompt', key: 'installPrompt', supported: typeof window !== 'undefined' && 'BeforeInstallPromptEvent' in window, description: 'Custom install prompt support' },
    { name: 'Content Index', key: 'contentIndex', supported: typeof window !== 'undefined' && 'ContentIndexEvent' in window, description: 'Index offline content for browser list' },
    { name: 'Protocol Handling', key: 'protocolHandling', supported: typeof navigator !== 'undefined' && 'registerProtocolHandler' in navigator, description: 'Register custom URL schemes' },
  ];
};

export const getAdvancedFeatures = (): FeatureItem[] => {
  const n = getNavigator();
  return [
    { name: 'WebGPU', key: 'webgpu', supported: !!n?.gpu, description: 'Next-gen graphics API' },
    { name: 'WebXR', key: 'webxr', supported: !!n?.xr, description: 'VR and AR capabilities' },
    { name: 'WebAuthn', key: 'webauthn', supported: !!(typeof window !== 'undefined' && window.PublicKeyCredential), description: 'Passwordless authentication' },
    { name: 'WebNN', key: 'webnn', supported: !!(n && 'ml' in n), description: 'Hardware-accelerated machine learning' },
    { name: 'Web Bluetooth', key: 'bluetooth', supported: !!n?.bluetooth, description: 'Connect to Bluetooth devices' },
    { name: 'Web USB', key: 'usb', supported: !!n?.usb, description: 'Connect to USB devices' },
    { name: 'Payment Request', key: 'payment', supported: typeof window !== 'undefined' && 'PaymentRequest' in window, description: 'Native payment processing' },
    { name: 'Digital Goods API', key: 'digitalGoods', supported: typeof window !== 'undefined' && 'getDigitalGoodsService' in window, description: 'In-app purchases for Web Apps' },
    { name: 'Web NFC', key: 'nfc', supported: !!n?.nfc, description: 'Near Field Communication' },
    { name: 'Screen Wake Lock', key: 'wakeLock', supported: typeof navigator !== 'undefined' && 'wakeLock' in navigator, description: 'Prevent screen from dimming' },
    { name: 'Idle Detection', key: 'idleDetection', supported: typeof window !== 'undefined' && 'IdleDetector' in window, description: 'Detect when user is idle' },
    { name: 'File System Access', key: 'fsAccess', supported: typeof window !== 'undefined' && 'showOpenFilePicker' in window, description: 'Read/Write local files' },
    { name: 'OPFS (Origin Private File System)', key: 'opfs', supported: !!(typeof navigator !== 'undefined' && navigator.storage && (navigator.storage as { getDirectory?: unknown }).getDirectory), description: 'High-performance local storage' },
    { name: 'File Handling API', key: 'fileHandling', supported: typeof window !== 'undefined' && 'launchQueue' in window, description: 'Register as file handler' },
    { name: 'Local Font Access', key: 'localFonts', supported: typeof window !== 'undefined' && 'queryLocalFonts' in window, description: 'Access installed local fonts' },
    { name: 'Window Controls Overlay', key: 'wco', supported: typeof navigator !== 'undefined' && 'windowControlsOverlay' in navigator, description: 'Customize PWA title bar' },
    { name: 'Broadcast Channel', key: 'broadcast', supported: typeof window !== 'undefined' && 'BroadcastChannel' in window, description: 'Cross-tab communication' },
    { name: 'Web Locks API', key: 'webLocks', supported: typeof navigator !== 'undefined' && !!navigator.locks, description: 'Cross-tab resource locking' },
    { name: 'Web Share API', key: 'webShare', supported: !!n?.share, description: 'Native sharing dialog' },
    { name: 'Contact Picker API', key: 'contactPicker', supported: typeof navigator !== 'undefined' && 'contacts' in navigator, description: 'Access user contacts' },
    { name: 'Clipboard API', key: 'clipboard', supported: typeof navigator !== 'undefined' && !!navigator.clipboard, description: 'Async clipboard access' },
    { name: 'Picture-in-Picture', key: 'pip', supported: typeof document !== 'undefined' && 'pictureInPictureEnabled' in document, description: 'Floating video player' },
    { name: 'Geolocation', key: 'geo', supported: typeof navigator !== 'undefined' && 'geolocation' in navigator, description: 'User location access' },
    { name: 'Web Assembly', key: 'wasm', supported: typeof WebAssembly === 'object', description: 'High-performance binary code' },
    { name: 'Web Codecs', key: 'webCodecs', supported: typeof window !== 'undefined' && 'VideoEncoder' in window, description: 'Low-level media processing' },
    { name: 'Compression Streams', key: 'compression', supported: typeof window !== 'undefined' && 'CompressionStream' in window, description: 'Native GZIP/Deflate' },
    { name: 'Web Transport', key: 'webTransport', supported: typeof window !== 'undefined' && 'WebTransport' in window, description: 'Low-latency bidirectional streaming' },
    { name: 'Compute Pressure API', key: 'computePressure', supported: typeof window !== 'undefined' && 'PressureObserver' in window, description: 'CPU/System load status' },
    { name: 'Intersection Observer', key: 'intersectionObserver', supported: typeof window !== 'undefined' && 'IntersectionObserver' in window, description: 'Detect element visibility' },
    { name: 'Mutation Observer', key: 'mutationObserver', supported: typeof window !== 'undefined' && 'MutationObserver' in window, description: 'Watch DOM changes' },
    { name: 'Resize Observer', key: 'resizeObserver', supported: typeof window !== 'undefined' && 'ResizeObserver' in window, description: 'Watch element size' },
    { name: 'Web Components', key: 'webComponents', supported: typeof window !== 'undefined' && 'customElements' in window && typeof Element !== 'undefined' && 'attachShadow' in Element.prototype, description: 'Custom reusable HTML elements' },
    { name: 'Gamepad API', key: 'gamepad', supported: typeof navigator !== 'undefined' && 'getGamepads' in navigator, description: 'Controller support' },
    { name: 'WebRTC', key: 'webrtc', supported: typeof window !== 'undefined' && 'RTCPeerConnection' in window, description: 'Real-time communication' },
    { name: 'Web Audio API', key: 'webAudio', supported: typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window), description: 'Advanced audio processing' },
    { name: 'Speech Synthesis', key: 'speechSynthesis', supported: typeof window !== 'undefined' && 'speechSynthesis' in window, description: 'Text-to-speech' },
    { name: 'Speech Recognition', key: 'speechRecognition', supported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window), description: 'Speech-to-text' },
    { name: 'WebSocket', key: 'webSocket', supported: typeof window !== 'undefined' && 'WebSocket' in window, description: 'Two-way socket connection' },
    { name: 'Server-Sent Events', key: 'sse', supported: typeof window !== 'undefined' && 'EventSource' in window, description: 'Server push notifications' },
    { name: 'Pointer Lock', key: 'pointerLock', supported: typeof document !== 'undefined' && 'exitPointerLock' in document, description: 'Lock mouse cursor' },
    { name: 'Fullscreen API', key: 'fullscreen', supported: typeof document !== 'undefined' && !!(document.fullscreenEnabled || (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled), description: 'Full screen support' },
    { name: 'Page Visibility', key: 'pageVisibility', supported: typeof document !== 'undefined' && 'hidden' in document, description: 'Detect tab backgrounding' },
    { name: 'Drag and Drop', key: 'dragAndDrop', supported: typeof document !== 'undefined' && 'draggable' in document.createElement('span'), description: 'Native DND features' },
    { name: 'Canvas API', key: 'canvas', supported: typeof document !== 'undefined' && !!document.createElement('canvas').getContext, description: '2D dynamic rendering' },
    { name: 'MathML', key: 'mathML', supported: typeof document !== 'undefined' && document.createElement('math').namespaceURI === 'http://www.w3.org/1998/Math/MathML', description: 'Math formatting' },
    { name: 'Vibration API', key: 'vibration', supported: typeof navigator !== 'undefined' && 'vibrate' in navigator, description: 'Hardware haptics' },
    { name: 'Battery Status', key: 'battery', supported: typeof navigator !== 'undefined' && 'getBattery' in navigator, description: 'Power level and charging' },
    { name: 'Eye Dropper', key: 'eyeDropper', supported: typeof window !== 'undefined' && 'EyeDropper' in window, description: 'System color picker' },
    { name: 'Accelerometer', key: 'accelerometer', supported: typeof window !== 'undefined' && 'Accelerometer' in window, description: 'Motion sensor' },
    { name: 'View Transitions API', key: 'viewTransitions', supported: typeof document !== 'undefined' && 'startViewTransition' in document, description: 'Smooth DOM transitions' },
    { name: 'Popover API', key: 'popover', supported: typeof HTMLElement !== 'undefined' && Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover'), description: 'Native popovers and dialogs' },
    { name: 'Trusted Types', key: 'trustedTypes', supported: typeof window !== 'undefined' && 'trustedTypes' in window, description: 'DOM XSS protection' },
    { name: 'CSS Container Queries', key: 'containerQueries', supported: typeof CSS !== 'undefined' && CSS.supports('container-type: inline-size'), description: 'Element-based responsive design' },
    { name: 'CSS Anchor Positioning', key: 'anchorPositioning', supported: typeof CSS !== 'undefined' && CSS.supports('anchor-name: --test'), description: 'Tether elements to anchors' },
    { name: 'Scroll-driven Animations', key: 'scrollAnimations', supported: typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()'), description: 'CSS tied to scroll position' },
    { name: 'Screen Capture API', key: 'screenCapture', supported: typeof navigator !== 'undefined' && !!(navigator.mediaDevices) && 'getDisplayMedia' in navigator.mediaDevices, description: 'Screen recording and capture' },
    { name: 'Multi-Screen Placement', key: 'multiScreen', supported: typeof window !== 'undefined' && 'getScreenDetails' in window, description: 'Manage multiple displays' },
    { name: 'Document PiP', key: 'documentPip', supported: typeof window !== 'undefined' && 'documentPictureInPicture' in window, description: 'Arbitrary HTML in PiP' },
    { name: 'Web MIDI API', key: 'webMidi', supported: typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator, description: 'Communicate with MIDI devices' },
    { name: 'Background Fetch', key: 'bgFetch', supported: typeof window !== 'undefined' && 'BackgroundFetchManager' in window, description: 'Background large downloads' },
    { name: 'Storage Buckets API', key: 'storageBuckets', supported: typeof navigator !== 'undefined' && navigator.storage && 'buckets' in navigator.storage, description: 'Organize persistent storage' },
    { name: 'Fenced Frames', key: 'fencedFrames', supported: typeof window !== 'undefined' && 'HTMLFencedFrameElement' in window, description: 'Secure embedded content' },
    { name: 'Navigation API', key: 'navigationApi', supported: typeof window !== 'undefined' && 'navigation' in window, description: 'Modern history navigation' },
    { name: 'SharedArrayBuffer', key: 'sharedArrayBuffer', supported: typeof SharedArrayBuffer !== 'undefined', description: 'Multithreaded memory access' },
    { name: 'Cross-Origin Isolated', key: 'crossOriginIsolated', supported: typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated, description: 'High-res timers & SAB enabled' },

    { name: 'Gyroscope', key: 'gyroscope', supported: typeof window !== 'undefined' && 'Gyroscope' in window, description: 'Orientation sensor' },
    { name: 'Ambient Light', key: 'ambientLight', supported: typeof window !== 'undefined' && 'AmbientLightSensor' in window, description: 'Light level sensor' },
    { name: 'WebHID API', key: 'webhid', supported: typeof navigator !== 'undefined' && 'hid' in navigator, description: 'Access human interface devices' },
    { name: 'Web Serial API', key: 'serial', supported: typeof navigator !== 'undefined' && 'serial' in navigator, description: 'Communicate with serial ports' },
    { name: 'WebOTP API', key: 'webotp', supported: typeof window !== 'undefined' && 'OTPCredential' in window, description: 'One-Time Password receiver' },
    { name: 'Cookie Store API', key: 'cookieStore', supported: typeof window !== 'undefined' && 'cookieStore' in window, description: 'Service Worker cookie access' },
    { name: 'Shape Detection API', key: 'shapeDetection', supported: typeof window !== 'undefined' && ('FaceDetector' in window || 'BarcodeDetector' in window), description: 'Detect faces or barcodes' },
    { name: 'Virtual Keyboard API', key: 'virtualKeyboard', supported: typeof navigator !== 'undefined' && 'virtualKeyboard' in navigator, description: 'Control virtual keyboard layout' },
    { name: 'Keyboard Map API', key: 'keyboardMap', supported: hasKeyboardLayoutMap(n), description: 'Resolve physical key layouts' },
    { name: 'Device Posture API', key: 'devicePosture', supported: typeof navigator !== 'undefined' && 'devicePosture' in navigator, description: 'Detect foldable device states' },
  ];
};
