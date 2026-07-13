import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Modal } from "../components/ui/Modal";

describe("Modal UI component tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render correctly in a portal", () => {
    render(<Modal title="Test Modal" onClose={() => {}}>Modal Content</Modal>);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    
    // Check if it's attached to document.body (portal check)
    const dialog = screen.getByRole("dialog");
    expect(document.body.contains(dialog)).toBe(true);
  });

  it("should call onClose after animation when close button is clicked", async () => {
    const handleClose = vi.fn();
    render(<Modal title="Test Modal" onClose={handleClose}>Content</Modal>);
    
    const closeBtn = screen.getByLabelText("Close");
    act(() => {
      fireEvent.click(closeBtn);
    });
    
    expect(handleClose).not.toHaveBeenCalled();
    
    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should support render prop children", () => {
    render(
      <Modal title="Render Prop" onClose={() => {}}>
        {({ close }) => (
          <button onClick={close} data-testid="internal-close">
            Close From Inside
          </button>
        )}
      </Modal>
    );
    
    const internalCloseBtn = screen.getByTestId("internal-close");
    expect(internalCloseBtn).toBeInTheDocument();
  });

  it("should handle Escape key down", () => {
    const handleClose = vi.fn();
    render(<Modal title="Keypress Modal" onClose={handleClose}>Content</Modal>);
    
    const dialog = screen.getByRole("dialog");
    act(() => {
      fireEvent.keyDown(dialog, { key: "Escape" });
    });
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should stop propagation when clicking inside modal content", () => {
    const handleClose = vi.fn();
    render(<Modal title="Stop Propagation" onClose={handleClose}>Content</Modal>);
    
    const modalContent = screen.getByText("Content");
    
    act(() => {
      fireEvent.click(modalContent);
    });
    
    // Modal shouldn't close when clicking inside
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(handleClose).not.toHaveBeenCalled();
  });
});
