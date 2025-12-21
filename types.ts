
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

export interface DrmSystem {
  name: string;
  supported: boolean;
  securityLevel?: string;
}

export interface AiReadiness {
  score: number; // Raw benchmark score
  flops: string; // Estimated GFLOPS string
  level: 'Low' | 'Medium' | 'High' | 'Ultra';
  description: string;
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

export interface IntlSupport {
    listFormat: boolean;
    relativeTimeFormat: boolean;
    displayNames: boolean;
    segmenter: boolean;
    pluralRules: boolean;
    collator: boolean;
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
    adBlockEnabled: boolean; // New
  };
  ai: { 
    wasmSupport: boolean;
    wasmSimd: boolean;
    webnn: boolean;
    windowAi: boolean;
    webgpuCompute: boolean;
    readiness: AiReadiness; // New
  };
  media: {
    video: CodecInfo[];
    audio: CodecInfo[];
    images: CodecInfo[]; // New
    drm: DrmSystem[]; // New
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
    numberingSystem: string;
    intlSupport: IntlSupport;
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

export interface GeoPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
}

// Shape Detection API Types
export interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  rawValue: string;
  format: string;
  cornerPoints: {x: number, y: number}[];
}

export interface BarcodeDetectorOptions {
  formats?: string[];
}

declare global {
  class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    static getSupportedFormats(): Promise<string[]>;
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
  }
  
  interface Window {
      BarcodeDetector: typeof BarcodeDetector;
      FaceDetector: any;
      TextDetector: any;
  }
}
