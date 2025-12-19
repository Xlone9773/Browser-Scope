
// Extend the Navigator interface for non-standard or experimental APIs
export interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  standalone?: boolean;
  userAgentData?: {
    brands: { brand: string; version: string }[];
    mobile: boolean;
    platform: string;
  };
  gpu?: any;
  bluetooth?: any;
  usb?: any;
  xr?: any;
  nfc?: any;
  // Fix: Removed 'share' property to avoid conflict with standard Navigator interface where it is required
  windowControlsOverlay?: any;
  hid?: any;
  serial?: any;
  presentation?: any;
  globalPrivacyControl?: boolean;
  webdriver: boolean;
  ml?: any; // WebNN
}

export interface NetworkInformation extends EventTarget {
  type?: string;
  effectiveType?: string;
  downlinkMax?: number;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  onchange?: EventListener;
}

export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: EventListener;
  onchargingtimechange: EventListener;
  ondischargingtimechange: EventListener;
  onlevelchange: EventListener;
}

export interface CodecInfo {
  name: string;
  supported: boolean;
}

export interface ScoreFactor {
  id: string; // Translation key
  value: string;
  score: number; // 0-10 impact
  maxScore: number;
  description: string; // Translation key suffix
}

export interface FingerprintScore {
  totalScore: number; // 0-100
  rating: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: ScoreFactor[];
}

export interface BrowserData {
  system: {
    os: string;
    platform: string;
    browserName: string;
    browserVersion: string;
    language: string;
    preferredLanguages: string[];
    userAgent: string;
    cookiesEnabled: boolean;
    doNotTrack: string | null;
    isPwaInstalled: boolean;
  };
  hardware: {
    cpuCores: number | string;
    cpuModel?: string; 
    memory: number | string;
    gpuRenderer: string;
    gpuVendor: string;
    maxTextureSize: number | string;
    batteryLevel: string;
    isCharging: string;
    chargingTime: string; // New
    dischargingTime: string; // New
    touchPoints: number;
    audioSampleRate: string;
    screenExtended: boolean; 
    gamepads: number; 
  };
  fingerprints: {
    canvasHash: string;
    canvasImage: string;
    webglHash: string;
    webglRenderer: string;
    webglExtensions: string[];
    audioLatency: string;
    score: FingerprintScore;
  };
  display: {
    resolution: string;
    availableSize: string;
    windowSize: string;
    pixelRatio: number;
    colorDepth: number;
    orientation: string;
    orientationAngle: string; // New
    darkMode: boolean;
    colorGamut: string;
    hdr: boolean;
    displayMode: string;
  };
  network: {
    online: boolean;
    effectiveType: string;
    type: string; // New (wifi, cellular, etc)
    downlink: string;
    downlinkMax: string; // New
    rtt: string;
    saveData: boolean;
    webrtcIp: string; 
  };
  security: { 
    isBot: boolean;
    gpcEnabled: boolean;
    pdfViewer: boolean;
    secureContext: boolean;
  };
  ai: { 
    wasmSupport: boolean;
    wasmSimd: boolean;
    webnn: boolean;
    windowAi: boolean;
    webgpuCompute: boolean;
  };
  media: {
    video: CodecInfo[];
    audio: CodecInfo[];
    images: CodecInfo[]; // New
    speechVoices: number;
    audioChannels: number | string; // New
  };
  storage: {
    quota: string;
    usage: string;
    persisted: boolean;
  };
  localization: {
    timeZone: string;
    locale: string;
    calendar: string;
  };
  features: FeatureItem[];
  pwaFeatures: FeatureItem[];
}

export interface FeatureItem {
  name: string;
  key: string; // for translation lookup
  supported: boolean;
  description: string;
}
