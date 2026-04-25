
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
    { name: 'Service Worker', key: 'serviceWorker', supported: 'serviceWorker' in navigator, description: 'Offline capabilities & PWA support' },
    { name: 'Background Sync', key: 'bgSync', supported: 'serviceWorker' in navigator && 'sync' in ((navigator as any).serviceWorker || {}), description: 'Defer actions until user has connectivity' },
    { name: 'Push API', key: 'pushApi', supported: 'PushManager' in window, description: 'Receive push notifications from server' },
    { name: 'Notification API', key: 'notification', supported: 'Notification' in window, description: 'System level notifications' },
    { name: 'App Badges', key: 'appBadges', supported: 'setAppBadge' in navigator, description: 'Set badges on app icon' },
  ];
};

export const getAdvancedFeatures = (): FeatureItem[] => {
  return [
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
};
