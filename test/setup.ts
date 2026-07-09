import { afterEach, vi, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Clean up DOM after each test to prevent memory leaks or test pollution
afterEach(() => {
  cleanup();
});

// Mock some missing window/navigator features in JSDOM
if (typeof window !== "undefined") {
  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserverMock,
  });

  // Mock IntersectionObserver
  class IntersectionObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
  });

  // Mock scrollTo
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: vi.fn(),
  });

  // Mock navigator.clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(() => Promise.resolve()),
      readText: vi.fn(() => Promise.resolve('')),
    },
  });

  // Mock Worker
  class WorkerMock {
    postMessage = vi.fn();
    terminate = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    dispatchEvent = vi.fn(() => true);
  }
  Object.defineProperty(window, "Worker", {
    writable: true,
    value: WorkerMock,
  });

  // Mock fetch
  window.fetch = vi.fn();
}

// Suppress known non-critical external errors in tests
if (typeof console !== "undefined") {
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });
}
