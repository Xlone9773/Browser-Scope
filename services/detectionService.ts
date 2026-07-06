
import { ExtendedNavigator, BrowserData } from '../types';
import { estimateCpuFromGpu } from '../utils/cpuMapping';
import { formatBytes, formatSpeed } from '../utils/formatters';

// Import sub-detectors
import { getGPUInfo, getCanvasFingerprint, getWebGLFingerprint, getWebGLExtensions, getShaderPrecisionFormat } from './detectors/graphics';
import { checkDrmSupport, getMediaSupport, getAudioContextInfo, getSpeechVoicesCount } from './detectors/media';
import { getBatteryInfo, getStorageEstimate, runAiReadinessCheck, checkWasmSimd } from './detectors/hardware';
import { detectOS, detectBrowser, detectAdBlocker, getWebRTCIP, getColorGamut, getPWAFeatures, getAdvancedFeatures, getHighEntropyClientHints } from './detectors/system';
import { calculateFingerprintScore } from './score';

const nav = navigator as ExtendedNavigator;

export const getAllData = async (): Promise<BrowserData> => {
  // Sync checks - these are fast
  const gpu = getGPUInfo();
  const browser = detectBrowser();
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const mediaSupport = getMediaSupport();
  const audioInfo = getAudioContextInfo();
  const canvasInfo = getCanvasFingerprint();
  const webglHash = getWebGLFingerprint();
  const webglExtensions = getWebGLExtensions();
  const shaderPrecision = getShaderPrecisionFormat(); // New
  const cpuModel = estimateCpuFromGpu(gpu.renderer);
  const adBlockEnabled = detectAdBlocker();
  const aiReadiness = runAiReadinessCheck();
  
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  // Use Intl formatter for memory if available
  const deviceMemory = nav.deviceMemory ? formatBytes(nav.deviceMemory * 1024 * 1024 * 1024) : 'Unknown';
  
  // Peripherals
    const screenExtended = (window.screen as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).isExtended || false;
  let gamepadsCount = 0;
  try {
      if (navigator.getGamepads) {
          const pads = navigator.getGamepads();
          if (pads && typeof pads.length === 'number') {
              for (let i = 0; i < pads.length; i++) {
                  if (pads[i] !== null) {
                      gamepadsCount++;
                  }
              }
          }
      }
  } catch (e) {
      console.warn("Gamepad API not supported or disabled", e);
  }
  const gamepads = gamepadsCount;

  // Security
  const isBot = nav.webdriver || false;
  const gpcEnabled = nav.globalPrivacyControl || false;
  
  const pdfViewer = nav.pdfViewerEnabled || false;
  const secureContext = window.isSecureContext;

  // AI & Compute
  const wasmSupport = typeof WebAssembly === 'object';
  const wasmSimd = checkWasmSimd();
  
      // @ts-expect-error fixed implicitly typed external libraries
      const windowAi = !!((window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).ai || window.model);
  const webnn = !!nav.ml;
  const webgpuCompute = !!nav.gpu; 

  // Async checks - Run in PARALLEL to reduce load time
  const [
      battery,
      storage,
      webrtcIp,
      speechVoices,
      drmSupport,
      clientHints // New
  ] = await Promise.all([
      getBatteryInfo(),
      getStorageEstimate(),
      getWebRTCIP(),
      getSpeechVoicesCount(),
      checkDrmSupport(),
      getHighEntropyClientHints()
  ]);

  const score = calculateFingerprintScore({
      canvasHash: canvasInfo.hash, 
      webglHash: webglHash, 
      userAgent: navigator.userAgent, 
      cpu: cpuCores,
      memory: deviceMemory,
      gpuRenderer: gpu.renderer,
      battery: battery.level,
      screenRes: `${window.screen.width} x ${window.screen.height}`,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      audioRate: audioInfo.rate,
      webRTC: webrtcIp,
      drmCount: drmSupport.filter(d => d.supported).length,
      touchPoints: navigator.maxTouchPoints || 0,
      clientHints: clientHints,
      hdr: window.matchMedia('(dynamic-range: high)').matches,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages ? navigator.languages.join(',') : navigator.language
  });

  const isPwaInstalled = window.matchMedia('(display-mode: standalone)').matches;

  // Detect Intl Features
  const intlSupport = {
      listFormat: typeof (Intl as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).ListFormat !== 'undefined',
      relativeTimeFormat: typeof Intl.RelativeTimeFormat !== 'undefined',
      displayNames: typeof (Intl as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).DisplayNames !== 'undefined',
      segmenter: typeof (Intl as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).Segmenter !== 'undefined',
      pluralRules: typeof Intl.PluralRules !== 'undefined',
      collator: typeof Intl.Collator !== 'undefined'
  };

  const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();

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
      clientHints // New
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
      gpuPrecision: shaderPrecision // New
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
      downlink: connection ? formatSpeed(connection.downlink || 0) : 'Unknown',
      downlinkMax: connection && connection.downlinkMax ? formatSpeed(connection.downlinkMax) : 'Unknown',
      rtt: connection ? `${connection.rtt} ms` : 'Unknown',
      saveData: connection ? connection.saveData || false : false,
      webrtcIp,
    },
    security: {
        isBot,
        gpcEnabled,
        pdfViewer,
        secureContext,
        adBlockEnabled
    },
    ai: {
        wasmSupport,
        wasmSimd,
        webnn,
        windowAi,
        webgpuCompute,
        readiness: aiReadiness
    },
    media: {
      video: mediaSupport.video,
      audio: mediaSupport.audio,
      images: mediaSupport.images,
      drm: drmSupport,
      speechVoices,
      audioChannels: audioInfo.channels
    },
    storage: {
      quota: storage.quota,
      usage: storage.usage,
      persisted: storage.persisted,
    },
    localization: {
      timeZone: resolvedOptions.timeZone,
      locale: resolvedOptions.locale,
      calendar: resolvedOptions.calendar,
      numberingSystem: resolvedOptions.numberingSystem,
      intlSupport
    },
    features: getAdvancedFeatures(),
    pwaFeatures: getPWAFeatures(),
  };
};