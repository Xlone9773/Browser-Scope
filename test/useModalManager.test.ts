import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalManager } from '../hooks/useModalManager';

describe('useModalManager Hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => useModalManager());
    expect(result.current.visibility).toEqual({});
    expect(result.current.loadedModules).toBeInstanceOf(Set);
    expect(result.current.loadedModules.size).toBe(0);
  });

  it('should open a modal, set visibility, and add to loadedModules', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.open('camera');
    });

    expect(result.current.visibility.camera).toBe(true);
    expect(result.current.loadedModules.has('camera')).toBe(true);
  });

  it('should close an open modal', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.open('camera');
    });
    expect(result.current.visibility.camera).toBe(true);

    act(() => {
      result.current.close('camera');
    });
    expect(result.current.visibility.camera).toBe(false);
    // loadedModules should still contain it (lazy loaded component cached)
    expect(result.current.loadedModules.has('camera')).toBe(true);
  });

  it('should close all modals', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.open('camera');
      result.current.open('audio');
    });
    expect(result.current.visibility.camera).toBe(true);
    expect(result.current.visibility.audio).toBe(true);

    act(() => {
      result.current.closeAll();
    });

    expect(result.current.visibility).toEqual({});
  });

  it('should unload a modal, closing it and removing it from loadedModules', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.open('camera');
    });
    expect(result.current.visibility.camera).toBe(true);
    expect(result.current.loadedModules.has('camera')).toBe(true);

    act(() => {
      result.current.unload('camera');
    });

    expect(result.current.visibility.camera).toBe(false);
    expect(result.current.loadedModules.has('camera')).toBe(false);
  });

  it('should respond to global window events to open/close modals', () => {
    const { result } = renderHook(() => useModalManager());

    // Initially closed
    expect(result.current.visibility.heatmap).toBeFalsy();
    expect(result.current.visibility.networkTools).toBeFalsy();

    // Trigger open-heatmap event
    act(() => {
      window.dispatchEvent(new Event('open-heatmap'));
    });
    expect(result.current.visibility.heatmap).toBe(true);

    // Trigger open-network-tools event
    act(() => {
      window.dispatchEvent(new Event('open-network-tools'));
    });
    expect(result.current.visibility.networkTools).toBe(true);

    // Trigger open-display-tools event
    act(() => {
      window.dispatchEvent(new Event('open-display-tools'));
    });
    expect(result.current.visibility.displayTools).toBe(true);

    // Trigger open-storage-benchmark event
    act(() => {
      window.dispatchEvent(new Event('open-storage-benchmark'));
    });
    expect(result.current.visibility.storageBench).toBe(true);

    // Trigger open-ray-tracing event
    act(() => {
      window.dispatchEvent(new Event('open-ray-tracing'));
    });
    expect(result.current.visibility.rayTracing).toBe(true);

    // Trigger open-audio-latency event
    act(() => {
      window.dispatchEvent(new Event('open-audio-latency'));
    });
    expect(result.current.visibility.audioLatency).toBe(true);

    // Trigger open-attributions event
    act(() => {
      window.dispatchEvent(new Event('open-attributions'));
    });
    expect(result.current.visibility.attributions).toBe(true);

    // Trigger open-shortcuts event
    act(() => {
      window.dispatchEvent(new Event('open-shortcuts'));
    });
    expect(result.current.visibility.shortcuts).toBe(true);

    // Trigger close-all-modals event
    act(() => {
      window.dispatchEvent(new Event('close-all-modals'));
    });
    expect(result.current.visibility).toEqual({});
  });
});
