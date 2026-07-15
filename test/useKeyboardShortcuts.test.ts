import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts Hook', () => {
  const mockProps = {
    lang: 'en' as const,
    open: vi.fn(),
    closeAll: vi.fn(),
    toggleTheme: vi.fn(),
    fetchData: vi.fn(),
    handleExportJSON: vi.fn(),
    handleExportPDF: vi.fn(),
    handleExportImage: vi.fn(),
    visibility: {},
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Clear active element if mock input is created
    const input = document.getElementById('mock-input');
    if (input) input.remove();
  });

  it('should register and deregister keydown listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardShortcuts(mockProps));

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should ignore shortcuts when user is typing in form inputs', () => {
    const input = document.createElement('input');
    input.id = 'mock-input';
    document.body.appendChild(input);
    input.focus();

    renderHook(() => useKeyboardShortcuts(mockProps));

    // Dispatch keydown event for 'Alt + G' (toggleTheme)
    const event = new KeyboardEvent('keydown', { key: 'g', altKey: true, bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.toggleTheme).not.toHaveBeenCalled();
  });

  it('should call toggleTheme on Alt + G', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', { key: 'g', altKey: true, bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should call fetchData on Alt + R', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', { key: 'r', altKey: true, bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.fetchData).toHaveBeenCalledTimes(1);
  });

  it('should call open with settings on Alt + S', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', { key: 's', altKey: true, bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.open).toHaveBeenCalledWith('settings');
  });

  it('should call open with benchmark on Alt + B', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', { key: 'b', altKey: true, bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.open).toHaveBeenCalledWith('benchmark');
  });

  it('should open shortcuts modal when ? is pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    const event = new KeyboardEvent('keydown', { key: '?', bubbles: true });
    window.dispatchEvent(event);

    expect(mockProps.open).toHaveBeenCalledWith('shortcuts');
  });

  it('should close shortcuts modal if already open when ? is pressed', () => {
    const propsWithOpenShortcuts = {
      ...mockProps,
      visibility: { shortcuts: true },
    };
    renderHook(() => useKeyboardShortcuts(propsWithOpenShortcuts));

    const event = new KeyboardEvent('keydown', { key: '?', bubbles: true });
    window.dispatchEvent(event);

    expect(propsWithOpenShortcuts.closeAll).toHaveBeenCalledTimes(1);
  });

  it('should export formats when corresponding Alt keys are pressed', () => {
    renderHook(() => useKeyboardShortcuts(mockProps));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', altKey: true, bubbles: true }));
    expect(mockProps.handleExportJSON).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', altKey: true, bubbles: true }));
    expect(mockProps.handleExportPDF).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', altKey: true, bubbles: true }));
    expect(mockProps.handleExportImage).toHaveBeenCalledTimes(1);
  });
});
