import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  simpleHash, 
  getGPUInfo, 
  getWebGLExtensions, 
  getShaderPrecisionFormat, 
  getCanvasFingerprint, 
  getWebGLFingerprint 
} from '../detectors/graphics';
import { 
  detectOS, 
  detectBrowser, 
  detectAdBlocker, 
  getColorGamut, 
  getPWAFeatures, 
  getAdvancedFeatures, 
  getHighEntropyClientHints 
} from '../detectors/system';
import { 
  getBatteryInfo, 
  getStorageEstimate, 
  runAiReadinessCheck, 
  checkWasmSimd 
} from '../detectors/hardware';
import { 
  checkDrmSupport, 
  getMediaSupport, 
  getAudioContextInfo, 
  getSpeechVoicesCount 
} from '../detectors/media';

describe('Browser Detectors Suite', () => {
  describe('Graphics Detector', () => {
    it('should hash strings consistently using simpleHash', () => {
      expect(simpleHash('')).toBe('00000000');
      expect(simpleHash('hello')).toBe(simpleHash('hello'));
      expect(simpleHash('hello')).not.toBe(simpleHash('world'));
      expect(simpleHash('test-string-123')).toMatch(/^[0-9a-f]{8}$/);
    });

    it('should handle getGPUInfo gracefully under mock/fallback environments', () => {
      const gpuInfo = getGPUInfo();
      expect(gpuInfo).toBeDefined();
      expect(gpuInfo).toHaveProperty('renderer');
      expect(gpuInfo).toHaveProperty('vendor');
      expect(gpuInfo).toHaveProperty('maxTextureSize');
    });

    it('should mock and return custom WebGL parameters if context is mocked', () => {
      const mockGetParameter = vi.fn().mockImplementation((p) => {
        if (p === 0x9246) return 'Mock GPU Renderer'; // UNMASKED_RENDERER_WEBGL
        if (p === 0x9245) return 'Mock GPU Vendor';    // UNMASKED_VENDOR_WEBGL
        if (p === 3379) return 16384;                  // MAX_TEXTURE_SIZE (gl.MAX_TEXTURE_SIZE)
        return null;
      });

      const mockGetExtension = vi.fn().mockImplementation((ext) => {
        if (ext === 'WEBGL_debug_renderer_info') {
          return {
            UNMASKED_RENDERER_WEBGL: 0x9246,
            UNMASKED_VENDOR_WEBGL: 0x9245,
          };
        }
        return null;
      });

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            style: {},
            getContext: vi.fn().mockReturnValue({
              MAX_TEXTURE_SIZE: 3379,
              getParameter: mockGetParameter,
              getExtension: mockGetExtension,
            }),
          };
        }
        return originalCreateElement.call(document, tagName);
      }) as unknown as typeof document.createElement;

      try {
        const gpuInfo = getGPUInfo();
        expect(gpuInfo.renderer).toBe('Mock GPU Renderer');
        expect(gpuInfo.vendor).toBe('Mock GPU Vendor');
        expect(gpuInfo.maxTextureSize).toBe('16384px');
      } finally {
        document.createElement = originalCreateElement;
      }
    });

    it('should retrieve WebGL extensions list', () => {
      const extensions = getWebGLExtensions();
      expect(Array.isArray(extensions)).toBe(true);
    });

    it('should get Shader Precision formats', () => {
      const format = getShaderPrecisionFormat();
      // Since canvas is mocked/fallback in JSDOM, check if it's undefined or has correct structure
      if (format) {
        expect(format).toHaveProperty('vertexHigh');
        expect(format).toHaveProperty('fragmentHigh');
      } else {
        expect(format).toBeUndefined();
      }
    });

    it('should calculate Canvas Fingerprint', () => {
      const canvasFingerprint = getCanvasFingerprint();
      expect(canvasFingerprint).toHaveProperty('hash');
      expect(canvasFingerprint).toHaveProperty('dataUri');
      expect(typeof canvasFingerprint.hash).toBe('string');
    });

    it('should fallback canvas fingerprint when context is null', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            style: {},
            getContext: vi.fn().mockReturnValue(null),
          };
        }
        return originalCreateElement.call(document, tagName);
      }) as unknown as typeof document.createElement;

      try {
        const canvasFingerprint = getCanvasFingerprint();
        expect(canvasFingerprint.hash).toBe('Not Supported');
        expect(canvasFingerprint.dataUri).toBe('');
      } finally {
        document.createElement = originalCreateElement;
      }
    });

    it('should run getWebGLFingerprint with fallback under JSDOM', () => {
      const webglFp = getWebGLFingerprint();
      expect(typeof webglFp).toBe('string');
    });
  });

  describe('System Detector', () => {
    let originalUserAgent: string;
    let originalPlatform: string;

    beforeEach(() => {
      originalUserAgent = window.navigator.userAgent;
      originalPlatform = window.navigator.platform;
    });

    afterEach(() => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
      Object.defineProperty(window.navigator, 'platform', {
        value: originalPlatform,
        configurable: true,
      });
    });

    it('should detect Windows OS based on navigator.platform', () => {
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Win32',
        configurable: true,
      });
      expect(detectOS()).toBe('Windows');
    });

    it('should detect macOS based on navigator.platform', () => {
      Object.defineProperty(window.navigator, 'platform', {
        value: 'MacIntel',
        configurable: true,
      });
      expect(detectOS()).toBe('macOS');
    });

    it('should detect Android based on userAgent', () => {
      Object.defineProperty(window.navigator, 'platform', {
        value: 'Linux armv81',
        configurable: true,
      });
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G960F)',
        configurable: true,
      });
      expect(detectOS()).toBe('Android');
    });

    it('should detect iOS based on navigator.platform', () => {
      Object.defineProperty(window.navigator, 'platform', {
        value: 'iPhone',
        configurable: true,
      });
      expect(detectOS()).toBe('iOS');
    });

    it('should detect Chrome browser version', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true,
      });
      const browser = detectBrowser();
      expect(browser.name).toBe('Chrome');
      expect(browser.version).toBe('120');
    });

    it('should detect Firefox browser version', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
        configurable: true,
      });
      const browser = detectBrowser();
      expect(browser.name).toBe('Firefox');
      expect(browser.version).toBe('119');
    });

    it('should run detectAdBlocker and return boolean', () => {
      const adBlocker = detectAdBlocker();
      expect(typeof adBlocker).toBe('boolean');
    });

    it('should fetch Color Gamut string', () => {
      const gamut = getColorGamut();
      expect(['P3 (Wide)', 'Rec.2020 (Ultra Wide)', 'sRGB (Standard)', 'Unknown']).toContain(gamut);
    });

    it('should return PWA features config array', () => {
      const pwa = getPWAFeatures();
      expect(Array.isArray(pwa)).toBe(true);
      expect(pwa.length).toBeGreaterThan(0);
      expect(pwa[0]).toHaveProperty('name');
      expect(pwa[0]).toHaveProperty('supported');
    });

    it('should return Advanced features config array', () => {
      const adv = getAdvancedFeatures();
      expect(Array.isArray(adv)).toBe(true);
      expect(adv.length).toBeGreaterThan(0);
      expect(adv[0]).toHaveProperty('name');
      expect(adv[0]).toHaveProperty('supported');
    });

    it('should mock userAgentData and retrieve client hints', async () => {
      const mockGetHighEntropyValues = vi.fn().mockResolvedValue({
        architecture: 'x86',
        model: 'Pixel 6',
        platformVersion: '12.0.0',
        bitness: '64',
        fullVersionList: [{ brand: 'Google Chrome', version: '120.0.0.0' }]
      });

      const navWithHints = navigator as unknown as { userAgentData?: { getHighEntropyValues: typeof mockGetHighEntropyValues } };
      navWithHints.userAgentData = {
        getHighEntropyValues: mockGetHighEntropyValues
      };

      try {
        const hints = await getHighEntropyClientHints();
        expect(hints).toBeDefined();
        expect(hints?.architecture).toBe('x86');
        expect(hints?.model).toBe('Pixel 6');
        expect(hints?.bitness).toBe('64');
      } finally {
        delete navWithHints.userAgentData;
      }
    });
  });

  describe('Hardware Detector', () => {
    it('should fetch battery info', async () => {
      const battery = await getBatteryInfo();
      expect(battery).toBeDefined();
      expect(battery).toHaveProperty('level');
      expect(battery).toHaveProperty('charging');
    });

    it('should fetch storage estimate', async () => {
      const storage = await getStorageEstimate();
      expect(storage).toBeDefined();
      expect(storage).toHaveProperty('quota');
      expect(storage).toHaveProperty('usage');
      expect(storage).toHaveProperty('persisted');
    });

    it('should run AI performance benchmark', () => {
      const benchmark = runAiReadinessCheck();
      expect(benchmark).toHaveProperty('score');
      expect(benchmark).toHaveProperty('flops');
      expect(benchmark).toHaveProperty('level');
      expect(typeof benchmark.score).toBe('number');
      expect(['Low', 'Medium', 'High', 'Ultra']).toContain(benchmark.level);
    });

    it('should check WASM SIMD capability support', () => {
      const simd = checkWasmSimd();
      expect(typeof simd).toBe('boolean');
    });
  });

  describe('Media Detector', () => {
    it('should run checkDrmSupport', async () => {
      const drm = await checkDrmSupport();
      expect(Array.isArray(drm)).toBe(true);
      expect(drm.length).toBe(3);
      expect(drm[0]).toHaveProperty('name');
      expect(drm[0]).toHaveProperty('supported');
    });

    it('should get media support lists for video, audio, and images', () => {
      const media = getMediaSupport();
      expect(media).toHaveProperty('video');
      expect(media).toHaveProperty('audio');
      expect(media).toHaveProperty('images');
      expect(Array.isArray(media.video)).toBe(true);
      expect(Array.isArray(media.audio)).toBe(true);
      expect(Array.isArray(media.images)).toBe(true);
    });

    it('should gather Audio Context info', () => {
      const audio = getAudioContextInfo();
      expect(audio).toBeDefined();
      expect(audio).toHaveProperty('rate');
      expect(audio).toHaveProperty('latency');
      expect(audio).toHaveProperty('channels');
    });

    it('should fetch Speech Voices Count', async () => {
      const voices = await getSpeechVoicesCount();
      expect(typeof voices).toBe('number');
    });
  });
});
