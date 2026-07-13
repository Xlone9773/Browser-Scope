import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BackToTop } from "../components/ui/BackToTop";

// Since standard testing environment may not have matchMedia or proper layout dimensions,
// our setup.ts has configured basic mocks. We will customize window properties during testing.
describe("BackToTop component tests", () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalScrollY: number;

  beforeEach(() => {
    // Preserve original values
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalScrollY = window.scrollY;

    // Reset default values to desktop, unscrolled
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: originalScrollY,
    });
  });

  it("should not render the button on large desktop viewports even when scrolled", () => {
    render(<BackToTop label="Top" />);

    // Simulate scroll past viewport height (800px > 768px)
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 800 });
      window.dispatchEvent(new Event("scroll"));
    });

    // Should not be visible because window.innerWidth is still 1024 (>= 768)
    const btn = screen.queryByLabelText("Top");
    expect(btn).not.toBeInTheDocument();
  });

  it("should not render the button on narrow viewports if not scrolled past viewport height", () => {
    render(<BackToTop label="Top" />);

    // Simulate resizing to mobile (375px) but scroll is 0
    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 375 });
      window.dispatchEvent(new Event("resize"));
    });

    const btn = screen.queryByLabelText("Top");
    expect(btn).not.toBeInTheDocument();
  });

  it("should render the button on narrow viewports when scrolled past viewport height and click scrolls to top", () => {
    const scrollToMock = vi.fn();
    Object.defineProperty(window, "scrollTo", {
      writable: true,
      configurable: true,
      value: scrollToMock,
    });

    render(<BackToTop label="Top" />);

    // 1. Resize to mobile (375px)
    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 375 });
      window.dispatchEvent(new Event("resize"));
    });

    // 2. Scroll past viewport height (800px > 768px)
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 800 });
      window.dispatchEvent(new Event("scroll"));
    });

    // Button should now be in the document
    const btn = screen.getByLabelText("Top");
    expect(btn).toBeInTheDocument();

    // 3. Click the button to trigger scrollTo
    act(() => {
      fireEvent.click(btn);
    });
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
