import { describe, it, expect } from 'vitest';
import { getAllData } from '../detectionService';

describe('Detection Service End-to-End Orchestrator', () => {
  it('should collect all browser data and return a fully compliant BrowserData object', async () => {
    const data = await getAllData();

    // Verify presence of top-level categories
    expect(data).toHaveProperty('system');
    expect(data).toHaveProperty('hardware');
    expect(data).toHaveProperty('fingerprints');
    expect(data).toHaveProperty('display');
    expect(data).toHaveProperty('network');
    expect(data).toHaveProperty('security');
    expect(data).toHaveProperty('ai');
    expect(data).toHaveProperty('media');
    expect(data).toHaveProperty('storage');
    expect(data).toHaveProperty('localization');
    expect(data).toHaveProperty('features');
    expect(data).toHaveProperty('pwaFeatures');

    // Assert key properties in system information
    expect(data.system).toHaveProperty('os');
    expect(data.system).toHaveProperty('platform');
    expect(data.system).toHaveProperty('browserName');
    expect(data.system).toHaveProperty('browserVersion');
    expect(data.system).toHaveProperty('language');
    expect(data.system.preferredLanguages).toBeInstanceOf(Array);
    expect(typeof data.system.cookiesEnabled).toBe('boolean');

    // Assert key properties in hardware
    expect(data.hardware).toHaveProperty('cpuCores');
    expect(data.hardware).toHaveProperty('memory');
    expect(data.hardware).toHaveProperty('gpuRenderer');
    expect(data.hardware).toHaveProperty('gpuVendor');
    expect(data.hardware).toHaveProperty('batteryLevel');
    expect(data.hardware).toHaveProperty('touchPoints');
    if (data.hardware.touchPoints !== undefined) {
      expect(typeof data.hardware.touchPoints).toBe('number');
    }

    // Assert fingerprints and scores
    expect(data.fingerprints).toHaveProperty('canvasHash');
    expect(data.fingerprints).toHaveProperty('webglHash');
    expect(data.fingerprints.score).toBeDefined();
    expect(data.fingerprints.score.totalScore).toBeGreaterThanOrEqual(0);
    expect(data.fingerprints.score.totalScore).toBeLessThanOrEqual(100);
    expect(data.fingerprints.score.factors).toBeInstanceOf(Array);

    // Assert display configuration
    expect(data.display).toHaveProperty('resolution');
    expect(data.display).toHaveProperty('pixelRatio');
    expect(data.display).toHaveProperty('colorDepth');
    expect(typeof data.display.darkMode).toBe('boolean');

    // Assert network metadata
    expect(data.network).toHaveProperty('online');
    expect(typeof data.network.online).toBe('boolean');
    expect(data.network).toHaveProperty('webrtcIp');

    // Assert security flags
    expect(typeof data.security.isBot).toBe('boolean');
    if (data.security.secureContext !== undefined) {
      expect(typeof data.security.secureContext).toBe('boolean');
    }
    expect(typeof data.security.adBlockEnabled).toBe('boolean');

    // Assert localizations
    expect(data.localization).toHaveProperty('timeZone');
    expect(data.localization).toHaveProperty('locale');
    expect(data.localization.intlSupport).toBeDefined();

    // Assert lists
    expect(data.features).toBeInstanceOf(Array);
    expect(data.pwaFeatures).toBeInstanceOf(Array);
  });

  it('should handle missing navigator/window characteristics gracefully', async () => {
    // Temporarily mock missing or stripped navigator features
    const originalHardwareConcurrency = navigator.hardwareConcurrency;
    const originalDeviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: undefined,
      configurable: true,
    });
    Object.defineProperty(navigator, 'deviceMemory', {
      value: undefined,
      configurable: true,
    });

    try {
      const data = await getAllData();
      expect(data.hardware.cpuCores).toBe('Unknown');
      expect(data.hardware.memory).toBe('Unknown');
    } finally {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: originalHardwareConcurrency,
        configurable: true,
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        value: originalDeviceMemory,
        configurable: true,
      });
    }
  });
});
