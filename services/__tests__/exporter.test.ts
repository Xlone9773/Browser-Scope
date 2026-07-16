import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportAsJson, exportAsPdf, exportAsImage } from '../exporter';
import { BrowserData } from '../../types';
import { Translation } from '../../utils/i18n/types';

// Mock html-to-image
vi.mock('html-to-image', () => {
  return {
    toPng: vi.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
  };
});

interface WorkerSuccessResponse {
  type: string;
  blob?: Blob;
  filename?: string;
  message?: string;
}

describe('Exporter Service Unit Tests', () => {
  let mockBrowserData: BrowserData;
  let originalWorker: typeof window.Worker;
  let originalCreateObjectURL: typeof window.URL.createObjectURL;
  let originalRevokeObjectURL: typeof window.URL.revokeObjectURL;
  let originalFetch: typeof window.fetch;

  beforeEach(() => {
    originalWorker = window.Worker;
    originalCreateObjectURL = window.URL.createObjectURL;
    originalRevokeObjectURL = window.URL.revokeObjectURL;
    originalFetch = window.fetch;

    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
    window.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(new Blob(['mock-image-bytes'], { type: 'image/png' }))
    } as unknown as Response);

    // Provide a valid dummy browser data structure
    mockBrowserData = {
      system: { os: 'Linux', platform: 'Linux x86_64', browserName: 'Chrome', browserVersion: '120', language: 'en-US', preferredLanguages: ['en-US'], userAgent: 'Mozilla/5.0', cookiesEnabled: true, doNotTrack: '0', isPwaInstalled: false },
      hardware: { cpuCores: 8, memory: '16 GB', gpuRenderer: 'Intel', gpuVendor: 'Intel', maxTextureSize: '16384px', batteryLevel: '100%', isCharging: 'Yes', chargingTime: 'N/A', dischargingTime: 'N/A', touchPoints: 0, audioSampleRate: '48000 Hz', screenExtended: false, gamepads: 0 },
      fingerprints: { canvasHash: 'canvas123', canvasImage: 'data:image/png;base64,...', webglHash: 'webgl123', webglRenderer: 'Intel', webglExtensions: [], audioLatency: '10 ms', score: { totalScore: 10, rating: 'Low', factors: [], categoryScores: { hardware: 10, browser: 10, screen: 10, media: 10, network: 10 } } },
      display: { resolution: '1920x1080', availableSize: '1920x1040', windowSize: '1920x1080', pixelRatio: 1, colorDepth: 24, orientation: 'landscape-primary', orientationAngle: '0°', darkMode: false, colorGamut: 'sRGB', hdr: false, displayMode: 'Browser Tab' },
      network: { online: true, effectiveType: '4g', type: 'wifi', downlink: '10 Mbps', downlinkMax: 'Unknown', rtt: '50 ms', saveData: false, webrtcIp: '192.168.1.5' },
      security: { isBot: false, gpcEnabled: false, pdfViewer: true, secureContext: true, adBlockEnabled: false },
      ai: { wasmSupport: true, wasmSimd: true, webnn: false, windowAi: false, webgpuCompute: false, readiness: { score: 100, flops: 0.1, level: 'Low' } },
      media: { video: [], audio: [], images: [], drm: [], speechVoices: 0, audioChannels: 2 },
      storage: { quota: '100 GB', usage: '10 MB', persisted: false },
      localization: { timeZone: 'UTC', locale: 'en-US', calendar: 'gregory', numberingSystem: 'latn', intlSupport: { listFormat: true, relativeTimeFormat: true, displayNames: true, segmenter: true, pluralRules: true, collator: true } },
      features: [],
      pwaFeatures: []
    };
  });

  afterEach(() => {
    window.Worker = originalWorker;
    window.URL.createObjectURL = originalCreateObjectURL;
    window.URL.revokeObjectURL = originalRevokeObjectURL;
    window.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('exportAsJson', () => {
    it('should invoke worker, post metadata, and trigger document-click download on success', async () => {
      // Custom Worker implementation that returns success after a microtask
      class CustomMockSuccessWorker {
        onmessage: ((event: MessageEvent<WorkerSuccessResponse>) => void) | null = null;
        onerror: ((event: ErrorEvent) => void) | null = null;
        postMessage = vi.fn().mockImplementation(() => {
          setTimeout(() => {
            if (this.onmessage) {
              this.onmessage({
                data: {
                  type: 'success',
                  blob: new Blob(['{"browserscope": true}'], { type: 'application/json' }),
                  filename: 'browserscope-test.json'
                }
              } as MessageEvent<WorkerSuccessResponse>);
            }
          }, 0);
        });
        terminate = vi.fn();
      }

      window.Worker = CustomMockSuccessWorker as unknown as typeof window.Worker;

      const onStart = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Spy on link creation & body modifications
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      exportAsJson(mockBrowserData, {}, null, onStart, onSuccess, onError);

      expect(onStart).toHaveBeenCalled();

      // Wait for async task to fire the mock onmessage
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toContain('browserscope-');
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink as unknown as HTMLAnchorElement);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink as unknown as HTMLAnchorElement);

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should invoke onError if worker fails or errors', async () => {
      class CustomMockFailureWorker {
        onmessage: ((event: MessageEvent<WorkerSuccessResponse>) => void) | null = null;
        onerror: ((event: ErrorEvent) => void) | null = null;
        postMessage = vi.fn().mockImplementation(() => {
          setTimeout(() => {
            if (this.onmessage) {
              this.onmessage({
                data: {
                  type: 'error',
                  message: 'Mock Worker Generation Failed'
                }
              } as MessageEvent<WorkerSuccessResponse>);
            }
          }, 0);
        });
        terminate = vi.fn();
      }

      window.Worker = CustomMockFailureWorker as unknown as typeof window.Worker;

      const onStart = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();

      exportAsJson(mockBrowserData, {}, null, onStart, onSuccess, onError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('Mock Worker Generation Failed');
    });
  });

  describe('exportAsPdf', () => {
    it('should dispatch correct messages to the background worker', async () => {
      class CustomMockPdfWorker {
        onmessage: ((event: MessageEvent<WorkerSuccessResponse>) => void) | null = null;
        onerror: ((event: ErrorEvent) => void) | null = null;
        postMessage = vi.fn().mockImplementation(() => {
          setTimeout(() => {
            if (this.onmessage) {
              this.onmessage({
                data: {
                  type: 'success',
                  blob: new Blob(['pdf-binary-bytes'], { type: 'application/pdf' }),
                  filename: 'browserscope-test.pdf'
                }
              } as MessageEvent<WorkerSuccessResponse>);
            }
          }, 0);
        });
        terminate = vi.fn();
      }

      window.Worker = CustomMockPdfWorker as unknown as typeof window.Worker;

      const mockT = {} as unknown as Translation; // dummy i18n translation map
      const onStart = vi.fn();
      const onSuccess = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      exportAsPdf(mockBrowserData, {}, null, mockT, 'en', 'a4', onStart, onSuccess);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onStart).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('exportAsImage', () => {
    it('should correctly capture HTML elements via html-to-image and execute download', async () => {
      // Mock presence of target element
      const mockElement = document.createElement('div');
      mockElement.id = 'capture-container';
      document.body.appendChild(mockElement);

      const onStart = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((el) => {
        if (el === mockLink as unknown as HTMLAnchorElement) return el;
        return el;
      });
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((el) => {
        if (el === mockLink as unknown as HTMLAnchorElement) return el;
        return el;
      });

      await exportAsImage('capture-container', 'light', 2, onStart, onSuccess, onError);

      expect(onStart).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
      mockElement.remove();
    });

    it('should trigger onError callback if element with specified id is missing', async () => {
      const onStart = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();

      await exportAsImage('non-existent-element-id', 'light', 2, onStart, onSuccess, onError);

      expect(onStart).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('Element with id "non-existent-element-id" not found');
    });
  });
});
