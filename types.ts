
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

export interface BrowserData {
  system: {
    os: string;
    platform: string;
    browserName: string;
    browserVersion: string;
    language: string;
    userAgent: string;
    cookiesEnabled: boolean;
    doNotTrack: string | null;
  };
  hardware: {
    cpuCores: number | string;
    memory: number | string;
    gpuRenderer: string;
    gpuVendor: string;
    maxTextureSize: number | string;
    batteryLevel: string;
    isCharging: string;
    touchPoints: number;
    audioSampleRate: string;
  };
  fingerprints: {
    canvasHash: string;
    canvasImage: string; // Data URI for display
    webglHash: string;
    webglRenderer: string;
    webglExtensions: string[]; // List of WebGL extensions
    audioLatency: string;
  };
  display: {
    resolution: string;
    availableSize: string; // New: Available screen size
    windowSize: string;
    pixelRatio: number;
    colorDepth: number;
    orientation: string;
    darkMode: boolean;
    colorGamut: string;
    hdr: boolean;
    displayMode: string;
  };
  network: {
    online: boolean;
    effectiveType: string;
    downlink: string;
    rtt: string;
    saveData: boolean;
  };
  media: {
    video: CodecInfo[];
    audio: CodecInfo[];
  };
  storage: {
    quota: string;
    usage: string;
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
