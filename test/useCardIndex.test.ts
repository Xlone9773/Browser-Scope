import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCardIndex } from '../hooks/useCardIndex';
import { BrowserData } from '../types';
import { Translation } from '../utils/i18n/types';

describe('useCardIndex Hook', () => {
  const mockTranslation = {
    environment: '测试环境',
    browserCard: '测试浏览器卡片',
    groups: {
      environment: '环境与信任',
      browser: '浏览器信息',
      system: '系统底层',
      network: '网络安全',
      advanced: '高级功能',
    },
    labels: {
      browser: '浏览器名称',
    },
    sections: {
      system: '系统环境',
      hardware: '硬件规格',
      display: '显示与图形',
      network: '网络诊断',
      security: '安全信任',
      fingerprints: '浏览器指纹',
      ai_compute: 'AI算力',
      location: '地理位置',
      storage: '存储大小',
      permissions: '系统权限',
      media_devices: '多媒体设备',
      media_sup: '多媒体格式支持',
      user_agent: '用户代理',
      pwa: '渐进式网页应用',
      features: '底层特性支持',
    }
  } as unknown as Translation;

  const mockBrowserData = {
    system: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      clientHints: { mobile: false, platform: 'macOS' },
      isPwaInstalled: true,
      browser: 'Chrome',
      version: '124.0.0.0',
    },
    hardware: {
      cores: 8,
      memory: 16,
      cpuModel: 'Apple M3 Max',
    },
    display: {
      width: 1920,
      height: 1080,
      gpu: 'Apple M3 Max GPU',
    },
    network: {
      rtt: 50,
      downlink: 10,
    },
    security: {
      incognito: false,
    },
    fingerprints: {
      canvas: '0x123abc',
    },
    ai: {
      webGpuSupport: true,
    },
    localization: {
      timezone: 'Asia/Shanghai',
    },
    storage: {
      estimate: '100 GB',
    },
    media: {
      codecs: ['h264', 'vp9'],
    },
    pwaFeatures: {
      serviceWorker: true,
    },
    features: {
      webgl: true,
    },
  } as unknown as BrowserData;

  it('should return empty object if browserData or translation is missing', () => {
    const { result: r1 } = renderHook(() => useCardIndex(null, mockTranslation));
    expect(r1.current).toEqual({});

    const { result: r2 } = renderHook(() => useCardIndex(mockBrowserData, null as unknown as Translation));
    expect(r2.current).toEqual({});
  });

  it('should index different categories correctly', () => {
    const { result } = renderHook(() => useCardIndex(mockBrowserData, mockTranslation));
    const index = result.current;

    // Check environment index
    expect(index.environment).toBeDefined();
    expect(index.environment.category).toBe('环境与信任');
    expect(index.environment.title).toBe('测试环境');

    // Check browser index
    expect(index.browser).toBeDefined();
    expect(index.browser.category).toBe('浏览器信息');
    expect(index.browser.title).toBe('测试浏览器卡片 浏览器名称 ');
    expect(index.browser.value).toContain('Chrome');

    // Check system indices
    expect(index.system).toBeDefined();
    expect(index.system.category).toBe('系统底层');
    expect(index.system.title).toBe('系统环境');
    expect(index.system.value).toContain('Mozilla/5.0');

    // Check hardware indices
    expect(index.hardware).toBeDefined();
    expect(index.hardware.category).toBe('系统底层');
    expect(index.hardware.title).toBe('硬件规格');
    expect(index.hardware.value).toContain('Apple M3 Max');
    expect(index.hardware.value).toContain('8');
    expect(index.hardware.value).toContain('16');

    // Check display indices
    expect(index.display).toBeDefined();
    expect(index.display.title).toBe('显示与图形');
    expect(index.display.value).toContain('Apple M3 Max GPU');
    expect(index.display.value).toContain('1920');

    // Check media support capabilities (nested arrays extraction)
    expect(index.media_capabilities).toBeDefined();
    expect(index.media_capabilities.title).toBe('多媒体格式支持');
    expect(index.media_capabilities.value).toContain('h264');
    expect(index.media_capabilities.value).toContain('vp9');
  });

  it('should successfully handle primitive values and deep object nesting using extractStrings', () => {
    const complexData = {
      system: {
        deeper: {
          deepest: {
            textValue: 'nestedSecretWord',
            numberValue: 42,
            boolValue: true,
            arrayValue: ['itemA', 'itemB']
          }
        }
      }
    } as unknown as BrowserData;

    const { result } = renderHook(() => useCardIndex(complexData, mockTranslation));
    const index = result.current;

    // Value field must recursively grab all strings/numbers/booleans from the nested object
    expect(index.system.value).toContain('nestedSecretWord');
    expect(index.system.value).toContain('42');
    expect(index.system.value).toContain('true');
    expect(index.system.value).toContain('itemA');
    expect(index.system.value).toContain('itemB');
  });
});
