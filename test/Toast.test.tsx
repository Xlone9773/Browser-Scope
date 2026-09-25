import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, ToastContextType } from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";

// Captures the latest context value on every provider render so tests can
// assert on state instead of DOM, which AnimatePresence exit animations may
// keep mounted briefly after dismissal.
let api: ToastContextType;
const Probe: React.FC = () => {
  api = useToast();
  return null;
};

const renderToasts = () =>
  render(
    <ToastProvider>
      <Probe />
    </ToastProvider>
  );

describe("Toast UI component tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a toast with default info type and a title", () => {
    renderToasts();
    act(() => {
      api.show("Something happened", { title: "Heads up" });
    });
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("should support the success/error/warning/info helpers", () => {
    renderToasts();
    act(() => {
      api.success("ok");
      api.error("bad");
      api.warning("careful");
      api.info("fyi");
    });
    expect(api.toasts.map((t) => t.type)).toEqual([
      "success",
      "error",
      "warning",
      "info",
    ]);
    expect(screen.getAllByRole("alert")).toHaveLength(4);
  });

  it("should return an id from show()", () => {
    renderToasts();
    let id = "";
    act(() => {
      id = api.show("m");
    });
    expect(id).toBeTruthy();
    expect(api.toasts[0].id).toBe(id);
  });

  it("should cap concurrent toasts at 5 and evict the oldest", () => {
    renderToasts();
    let firstId = "";
    act(() => {
      firstId = api.show("first");
      for (let i = 2; i <= 5; i++) {
        api.show(`msg-${i}`);
      }
    });
    expect(api.toasts).toHaveLength(5);
    expect(api.toasts[0].id).toBe(firstId);

    act(() => {
      api.show("sixth");
    });
    expect(api.toasts).toHaveLength(5);
    expect(api.toasts.map((t) => t.message)).not.toContain("first");
    expect(api.toasts[api.toasts.length - 1].message).toBe("sixth");
  });

  it("should auto-dismiss after the given duration", () => {
    renderToasts();
    act(() => {
      api.show("temporary", { duration: 1000 });
    });
    expect(api.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(api.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(api.toasts).toHaveLength(0);
  });

  it("should pause the dismiss timer on hover and resume with the remaining time", () => {
    renderToasts();
    act(() => {
      api.show("hoverable", { duration: 1000 });
    });

    const alert = screen.getByRole("alert");
    act(() => {
      fireEvent.mouseEnter(alert);
    });

    // Advance well past the total duration while hovering: if the timer
    // were not paused, the toast would already be gone.
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(api.toasts).toHaveLength(1);

    act(() => {
      fireEvent.mouseLeave(alert);
    });

    // Resume with the remaining time (1000ms at hover entry): gone after it.
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(api.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(api.toasts).toHaveLength(0);
  });

  it("should dismiss via the close button", () => {
    renderToasts();
    act(() => {
      api.show("closable", { duration: 60_000 });
    });
    act(() => {
      fireEvent.click(screen.getByLabelText("Close notification"));
    });
    expect(api.toasts).toHaveLength(0);
  });

  it("should dismiss a specific toast by id and clear all", () => {
    renderToasts();
    let idA = "";
    act(() => {
      idA = api.show("A", { duration: 60_000 });
      api.show("B", { duration: 60_000 });
      api.show("C", { duration: 60_000 });
    });
    expect(api.toasts).toHaveLength(3);

    act(() => {
      api.dismiss(idA);
    });
    expect(api.toasts.map((t) => t.message)).toEqual(["B", "C"]);

    act(() => {
      api.clearAll();
    });
    expect(api.toasts).toHaveLength(0);
  });

  it("should not dismiss while the auto-timer is pending but duration is far", () => {
    renderToasts();
    act(() => {
      api.show("long-lived", { duration: 60_000 });
    });
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(api.toasts).toHaveLength(1);
  });

  it("should throw when useToast is used outside ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      "useToast must be used within a ToastProvider"
    );
    spy.mockRestore();
  });
});
