import { describe, it, expect, afterEach } from 'vitest';
import { getAdvancedFeatures } from '../services/detectors/system';

const originalNavigator = (globalThis as any).navigator;

afterEach(() => {
  (globalThis as any).navigator = originalNavigator;
});

describe('Keyboard map detection (Brave null keyboard handling)', () => {
  it('does not throw when navigator.keyboard is null and marks keyboardMap unsupported', () => {
    (globalThis as any).navigator = { ...(originalNavigator || {}), keyboard: null };
    const features = getAdvancedFeatures();
    const k = features.find(f => f.key === 'keyboardMap');
    expect(k).toBeDefined();
    expect(k?.supported).toBe(false);
  });

  it('detects keyboardMap when getLayoutMap exists', () => {
    (globalThis as any).navigator = { ...(originalNavigator || {}), keyboard: { getLayoutMap: () => ({}) } };
    const features = getAdvancedFeatures();
    const k = features.find(f => f.key === 'keyboardMap');
    expect(k).toBeDefined();
    expect(k?.supported).toBe(true);
  });
});
