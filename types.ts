
export interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  downlinkMax?: number;
}

export interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
    onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

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
    getHighEntropyValues: (hints: string[]) => Promise<any>;
  };
  gpu?: any;
  bluetooth?: any;
  usb?: any;
  xr?: any;
  nfc?: any;
  windowControlsOverlay?: any;
  hid?: any;
  serial?: any;
  presentation?: any;
  globalPrivacyControl?: boolean;
  webdriver: boolean;
  ml: any; // WebNN (Required to match Navigator interface)
}

export interface CodecInfo {
    name: string;
    supported: boolean;
}

export interface DrmSystem {
    name: string;
    supported: boolean;
}

export interface IntlSupport {
    listFormat: boolean;
    relativeTimeFormat: boolean;
    displayNames: boolean;
    segmenter: boolean;
    pluralRules: boolean;
    collator: boolean;
}

export interface AiReadiness {
    score: number;
    flops: number;
    level: 'Low' | 'Medium' | 'High' | 'Ultra';
}

export interface ScoreFactor {
    id: string;
    value: string | number;
    score: number;
    maxScore: number;
    description?: string;
    category: 'hardware' | 'browser' | 'screen' | 'media' | 'network';
}

export interface FingerprintScore {
    totalScore: number;
    rating: string;
    factors: ScoreFactor[];
    categoryScores: {
        hardware: number;
        browser: number;
        screen: number;
        media: number;
        network: number;
    };
}

export interface FeatureItem {
  name: string;
  key: string; // for translation lookup
  supported: boolean;
  description: string;
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
    clientHints?: {
        architecture?: string;
        bitness?: string;
        model?: string;
        platformVersion?: string;
        fullVersionList?: { brand: string; version: string }[];
    };
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
    chargingTime: string;
    dischargingTime: string;
    touchPoints: number;
    audioSampleRate: string;
    screenExtended: boolean; 
    gamepads: number;
    gpuPrecision?: {
        vertexHigh: string;
        fragmentHigh: string;
    };
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
      orientationAngle: string; 
      darkMode: boolean;
      colorGamut: string;
      hdr: boolean;
      displayMode: string;
  };
  network: {
      online: boolean;
      effectiveType: string;
      type: string;
      downlink: string;
      downlinkMax: string; 
      rtt: string;
      saveData: boolean;
      webrtcIp: string; 
  };
  security: { 
      isBot: boolean;
      gpcEnabled: boolean;
      pdfViewer: boolean;
      secureContext: boolean;
      adBlockEnabled: boolean; 
  };
  ai: { 
      wasmSupport: boolean;
      wasmSimd: boolean;
      webnn: boolean;
      windowAi: boolean;
      webgpuCompute: boolean;
      readiness: AiReadiness; 
  };
  media: {
      video: CodecInfo[];
      audio: CodecInfo[];
      images: CodecInfo[]; 
      drm: DrmSystem[]; 
      speechVoices: number;
      audioChannels: number | string; 
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