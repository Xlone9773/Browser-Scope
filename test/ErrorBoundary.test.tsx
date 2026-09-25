import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { loggerStore } from "../utils/loggerStore";

const Bomb = ({ shouldThrow, message = "Test Error" }: { shouldThrow?: boolean; message?: string }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Safe Content</div>;
};

// Lets Retry/Home recover: flip the flag before clicking the button.
// FlagBomb reads it at render time — JSX props would be captured too early.
let bombActive = true;
const FlagBomb = () => {
  if (bombActive) {
    throw new Error("Test Error");
  }
  return <div>Safe Content</div>;
};

describe("ErrorBoundary UI component tests", () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    bombActive = true;
    // Suppress console.error in tests to avoid messy output from the intentional error
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  const analysisText = () =>
    screen.getByText("Preliminary Analysis:").parentElement!.textContent!;

  it("should render children if no error", () => {
    render(
      <ErrorBoundary name="Test">
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("should render fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );

    // The fallback UI should be visible
    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();
    expect(screen.getByText("Component Crashed")).toBeInTheDocument();
    expect(screen.getByText(/in Test/)).toBeInTheDocument();
  });

  it("should render a custom fallback when provided", () => {
    render(
      <ErrorBoundary name="Test" fallback={<div>Custom Fallback</div>}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom Fallback")).toBeInTheDocument();
    expect(screen.queryByText("Component Crashed")).not.toBeInTheDocument();
  });

  it("should log the crash to console and loggerStore", () => {
    const addSpy = vi.spyOn(loggerStore, "addConsole");
    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(
      consoleErrorSpy.mock.calls.some(
        (args) =>
          typeof args[0] === "string" &&
          args[0].includes("Uncaught error in component [Test]")
      )
    ).toBe(true);
    expect(addSpy).toHaveBeenCalledWith(
      "error",
      expect.stringContaining("Uncaught error in component [Test]")
    );
  });

  describe("preliminary analysis classification", () => {
    const cases: Array<[string, string]> = [
      ["Cannot read properties of undefined (reading 'x')", "Possible null reference error"],
      ["fakeFunction is not a function", "Function call fail"],
      ["Invalid hook call. Hooks must be called inside a functional component body.", "React Hook issue"],
      ["Network request failed while fetching data", "Network error"],
      ["Unexpected token < in JSON at position 0", "JSON parsing error"],
      ["something entirely weird happened", "Unexpected runtime error"],
    ];

    for (const [message, expected] of cases) {
      it(`should classify "${message.slice(0, 40)}"`, () => {
        render(
          <ErrorBoundary name="Test">
            <Bomb shouldThrow message={message} />
          </ErrorBoundary>
        );
        expect(analysisText()).toContain(expected);
      });
    }
  });

  it("should recover via Try Again once the child stops throwing", () => {
    render(
      <ErrorBoundary name="Test">
        <FlagBomb />
      </ErrorBoundary>
    );
    expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();

    bombActive = false;
    act(() => {
      fireEvent.click(screen.getByText("Try Again"));
    });
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
    expect(screen.queryByText("Component Crashed")).not.toBeInTheDocument();
  });

  it("should recover via Return Home and dispatch close-all-modals", () => {
    const homeListener = vi.fn();
    window.addEventListener("close-all-modals", homeListener);

    render(
      <ErrorBoundary name="Test">
        <FlagBomb />
      </ErrorBoundary>
    );
    bombActive = false;
    act(() => {
      fireEvent.click(screen.getByText("Return Home"));
    });

    expect(homeListener).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
    window.removeEventListener("close-all-modals", homeListener);
  });

  it("should toggle the stack trace panel", () => {
    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.queryByText("Error Stack")).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText("View Stack Trace"));
    });
    expect(screen.getByText("Error Stack")).toBeInTheDocument();
    expect(screen.getByText("React Component Stack")).toBeInTheDocument();
    expect(screen.getByText("Environment Context")).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText("Hide Stack Trace"));
    });
    expect(screen.queryByText("Error Stack")).not.toBeInTheDocument();
  });

  it("should copy error details and reset the copied state after 2s", () => {
    vi.useFakeTimers();
    try {
      render(
        <ErrorBoundary name="Test">
          <Bomb shouldThrow />
        </ErrorBoundary>
      );
      act(() => {
        fireEvent.click(screen.getByText("View Stack Trace"));
      });
      act(() => {
        fireEvent.click(screen.getByText("Copy Error Details"));
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      const copiedText = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as string;
      expect(copiedText).toContain("--- Error Details ---");
      expect(copiedText).toContain("Component: Test");
      expect(copiedText).toContain("Test Error");
      expect(copiedText).toContain("User Agent:");

      expect(screen.getByText("Copied!")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText("Copy Error Details")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should keep storage untouched when cache clear is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    localStorage.setItem("keep", "me");
    sessionStorage.setItem("keep", "me");

    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    act(() => {
      fireEvent.click(screen.getByText("Clear Cache & Reload"));
    });

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining("clear cache and reload")
    );
    expect(localStorage.getItem("keep")).toBe("me");
    expect(sessionStorage.getItem("keep")).toBe("me");
  });

  it("should clear storage when cache clear is confirmed", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    localStorage.setItem("wipe", "1");
    sessionStorage.setItem("wipe", "1");

    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    act(() => {
      fireEvent.click(screen.getByText("Clear Cache & Reload"));
    });

    expect(localStorage.getItem("wipe")).toBeNull();
    expect(sessionStorage.getItem("wipe")).toBeNull();
  });

  describe("RootApp global listeners", () => {
    it("should capture real window errors when name is RootApp", () => {
      render(
        <ErrorBoundary name="RootApp">
          <Bomb />
        </ErrorBoundary>
      );
      act(() => {
        window.dispatchEvent(
          new ErrorEvent("error", {
            message: "Boom from global",
            error: new Error("Boom from global"),
          })
        );
      });
      expect(screen.getByText("Boom from global")).toBeInTheDocument();
      expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();
    });

    it("should ignore whitelisted noise messages", () => {
      render(
        <ErrorBoundary name="RootApp">
          <Bomb />
        </ErrorBoundary>
      );
      for (const noise of [
        "vconsole init failed",
        "WebSocket closed without opened",
        "Script error.",
        "ResizeObserver loop limit exceeded",
      ]) {
        act(() => {
          window.dispatchEvent(new ErrorEvent("error", { message: noise }));
        });
      }
      expect(screen.getByText("Safe Content")).toBeInTheDocument();
      expect(screen.queryByText("Component Crashed")).not.toBeInTheDocument();
    });

    it("should ignore window errors when name is not RootApp", () => {
      render(
        <ErrorBoundary name="SomeModule">
          <Bomb />
        </ErrorBoundary>
      );
      act(() => {
        window.dispatchEvent(
          new ErrorEvent("error", { message: "Not my job", error: new Error("Not my job") })
        );
      });
      expect(screen.getByText("Safe Content")).toBeInTheDocument();
    });

    it("should capture unhandled rejections when name is RootApp", () => {
      render(
        <ErrorBoundary name="RootApp">
          <Bomb />
        </ErrorBoundary>
      );
      act(() => {
        const ev = new Event("unhandledrejection");
        Object.defineProperty(ev, "reason", { value: new Error("Promise exploded") });
        window.dispatchEvent(ev);
      });
      expect(screen.getByText("Promise exploded")).toBeInTheDocument();
    });

    it("should ignore whitelisted rejection noise", () => {
      render(
        <ErrorBoundary name="RootApp">
          <Bomb />
        </ErrorBoundary>
      );
      act(() => {
        const ev = new Event("unhandledrejection");
        Object.defineProperty(ev, "reason", {
          value: new Error("WebSocket closed without opened"),
        });
        window.dispatchEvent(ev);
      });
      expect(screen.getByText("Safe Content")).toBeInTheDocument();
    });
  });
});
