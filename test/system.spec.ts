import { describe, it, expect, afterEach } from 'vitest';
import { getAdvancedFeatures } from '../services/detectors/system';
import type { ExtendedNavigator, NavigatorKeyboard } from '../types';

const originalNavigator = typeof globalThis.navigator !== 'undefined' ? (globalThis.navigator as ExtendedNavigator) : undefined;

function setNavigator(value?: ExtendedNavigator | null) {
  if (typeof value === 'undefined') {
    // remove mocked navigator
    try { delete (globalThis as { navigator?: unknown }).navigator; } catch {}
    return;
  }

  Object.defineProperty(globalThis, 'navigator', {
    value,
    configurable: true,
  });
}

afterEach(() => {
  if (typeof originalNavigator === 'undefined') {
    setNavigator(undefined);
  } else {
    setNavigator(originalNavigator);
  }
});

describe('Keyboard map detection (Brave null keyboard handling)', () => {
  it('does not throw when navigator.keyboard is null and marks keyboardMap unsupported', () => {
    const mockNav = { keyboard: null } as unknown as ExtendedNavigator;
    setNavigator(mockNav);

    const features = getAdvancedFeatures();
    const k = features.find(f => f.key === 'keyboardMap');
    expect(k).toBeDefined();
    expect(k?.supported).toBe(false);
  });

  it('detects keyboardMap when getLayoutMap exists', () => {
    const keyboard: NavigatorKeyboard = { getLayoutMap: () => Promise.resolve(new Map<string, string>()) };
    const mockNav = { keyboard } as unknown as ExtendedNavigator;
    setNavigator(mockNav);

    const features = getAdvancedFeatures();
    const k = features.find(f => f.key === 'keyboardMap');
    expect(k).toBeDefined();
    expect(k?.supported).toBe(true);
  });
});
