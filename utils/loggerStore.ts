import { useState, useEffect } from "react";

export interface ConsoleEntry {
  id: string;
  type: "input" | "output" | "error";
  content: string;
  timestamp: number;
}

class LoggerStore {
  public logs: string[] = [];
  public consoleHistory: ConsoleEntry[] = [];
  public isLoggingEnabled: boolean =
    localStorage.getItem("developer_logging_enabled") !== "false";
  public activeConsole: "none" | "vconsole" | "eruda" =
    (localStorage.getItem("developer_active_console") as any) || "none";
  public defaultConsole: "vconsole" | "eruda" =
    (localStorage.getItem("developer_default_console") as any) || "vconsole";

  private logListeners: Set<(logs: string[]) => void> = new Set();
  private consoleListeners: Set<(history: ConsoleEntry[]) => void> = new Set();
  private settingsListeners: Set<() => void> = new Set();

  constructor() {
    try {
      const savedLogs = sessionStorage.getItem("dev_logs");
      if (savedLogs) this.logs = JSON.parse(savedLogs);

      const savedConsole = sessionStorage.getItem("dev_console");
      if (savedConsole) this.consoleHistory = JSON.parse(savedConsole);
    } catch (e) {}
  }

  private persistLogs() {
    try {
      sessionStorage.setItem("dev_logs", JSON.stringify(this.logs));
    } catch (e) {}
  }

  private persistConsole() {
    try {
      sessionStorage.setItem(
        "dev_console",
        JSON.stringify(this.consoleHistory),
      );
    } catch (e) {}
  }

  addLog(type: string, detail: string) {
    if (!this.isLoggingEnabled) return;
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    } as any);
    this.logs = [`[${time}] ${type}: ${detail}`, ...this.logs].slice(0, 500);
    this.persistLogs();
    this.notifyLogs();
  }

  clearLogs() {
    this.logs = [];
    this.persistLogs();
    this.notifyLogs();
  }

  addConsole(type: ConsoleEntry["type"] | "warn" | "info", content: string) {
    if (!this.isLoggingEnabled && type !== "input") return;

    let normalizedType: ConsoleEntry["type"] = "output";
    if (type === "error") normalizedType = "error";
    else if (type === "input") normalizedType = "input";

    this.consoleHistory = [
      ...this.consoleHistory,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: normalizedType,
        content,
        timestamp: Date.now(),
      },
    ];
    if (this.consoleHistory.length > 500) {
      this.consoleHistory.shift();
    }
    this.persistConsole();
    this.notifyConsole();
  }

  clearConsole() {
    this.consoleHistory = [];
    this.persistConsole();
    this.notifyConsole();
  }

  setLoggingEnabled(enabled: boolean) {
    this.isLoggingEnabled = enabled;
    localStorage.setItem("developer_logging_enabled", String(enabled));
    this.notifySettings();
  }

  setActiveConsole(consoleType: "none" | "vconsole" | "eruda") {
    const previousConsole = this.activeConsole;
    this.activeConsole = consoleType;
    localStorage.setItem("developer_active_console", consoleType);

    // Unload old console
    if (previousConsole === "vconsole" && consoleType !== "vconsole") {
      this.unloadVConsole();
    } else if (previousConsole === "eruda" && consoleType !== "eruda") {
      this.unloadEruda();
    }

    // Load new console
    if (consoleType === "vconsole") {
      this.loadVConsole();
    } else if (consoleType === "eruda") {
      this.loadEruda();
    }

    this.notifySettings();
  }

  setDefaultConsole(consoleType: "vconsole" | "eruda") {
    this.defaultConsole = consoleType;
    localStorage.setItem("developer_default_console", consoleType);

    if (this.activeConsole !== "none") {
      this.setActiveConsole(consoleType);
    } else {
      this.notifySettings();
    }
  }

  async loadEruda() {
    if ((window as any).eruda) {
      try {
        (window as any).eruda.show();
      } catch (e) {}
      return;
    }
    try {
      let container = document.getElementById("eruda-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "eruda-container";
        // Apply VConsole-like scroll patch to the container to prevent scroll penetration
        container.style.overscrollBehavior = "none";
        document.body.appendChild(container);
      }

      const eruda = (await import("eruda")).default;
      eruda.init({
        container: container,
        useShadowDom: true,
      });
      (window as any).eruda = eruda;

      // Stop propagation as an extra fallback
      container.addEventListener("wheel", (e) => e.stopPropagation(), {
        passive: false,
      });
      container.addEventListener("touchstart", (e) => e.stopPropagation(), {
        passive: false,
      });
      container.addEventListener("touchmove", (e) => e.stopPropagation(), {
        passive: false,
      });
      container.addEventListener("touchend", (e) => e.stopPropagation(), {
        passive: false,
      });

      // Inject overscroll-behavior into shadow root as well
      if (container.shadowRoot) {
        const style = document.createElement("style");
        style.textContent = `
          * { overscroll-behavior: none !important; }
        `;
        container.shadowRoot.appendChild(style);
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const isCurrentlyDark =
              document.documentElement.classList.contains("dark");
            if (
              (window as any).eruda &&
              typeof (window as any).eruda.position === "function"
            ) {
              try {
                (window as any).eruda._devTools._theme = isCurrentlyDark
                  ? "Dark"
                  : "Light";
                (window as any).eruda._devTools.emit(
                  "themeChange",
                  isCurrentlyDark ? "Dark" : "Light",
                );
              } catch (e) {}
            }
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });
    } catch (e) {}
  }

  unloadEruda() {
    if ((window as any).eruda) {
      try {
        (window as any).eruda.destroy();
      } catch (e) {}
      (window as any).eruda = undefined;
      const erudaNode = document.getElementById("eruda-container");
      if (erudaNode) {
        erudaNode.remove();
      }
      // Fallback: Remove any other elements that eruda might have added to the body directly.
      const el = document.querySelector('div[id="eruda"]');
      if (el) el.remove();
    }
  }

  async loadVConsole() {
    const win = window as any;
    if (win.vConsole) {
      try {
        win.vConsole.show();
      } catch (e) {}
      return;
    }
    try {
      if (!Object.getOwnPropertyDescriptor(window, "fetch")) {
        const originalFetch = window.fetch;
        Object.defineProperty(window, "fetch", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: originalFetch,
        });
      }
      const VConsole = (await import("vconsole")).default;
      const isDark = document.documentElement.classList.contains("dark");
      win.vConsole = new (VConsole as any)({
        theme: isDark ? "dark" : "light",
      });

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            const isCurrentlyDark =
              document.documentElement.classList.contains("dark");
            if (win.vConsole && typeof win.vConsole.setOption === "function") {
              win.vConsole.setOption(
                "theme",
                isCurrentlyDark ? "dark" : "light",
              );
            }
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });
    } catch (e) {}
  }

  unloadVConsole() {
    const win = window as any;
    if (win.vConsole) {
      try {
        win.vConsole.destroy();
      } catch (e) {}
      win.vConsole = undefined;
      const vcNode = document.getElementById("__vconsole");
      if (vcNode) {
        vcNode.remove();
      }
    }
  }

  subscribeLogs(listener: (logs: string[]) => void) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  subscribeConsole(listener: (history: ConsoleEntry[]) => void) {
    this.consoleListeners.add(listener);
    return () => this.consoleListeners.delete(listener);
  }

  subscribeSettings(listener: () => void) {
    this.settingsListeners.add(listener);
    return () => this.settingsListeners.delete(listener);
  }

  private notifyLogs() {
    this.logListeners.forEach((fn) => fn(this.logs));
  }

  private notifyConsole() {
    this.consoleListeners.forEach((fn) => fn(this.consoleHistory));
  }

  private notifySettings() {
    this.settingsListeners.forEach((fn) => fn());
  }
}

export const loggerStore = new LoggerStore();

export function useLoggerStore() {
  const [logs, setLogs] = useState(loggerStore.logs);
  const [consoleHistory, setConsoleHistory] = useState(
    loggerStore.consoleHistory,
  );
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(
    loggerStore.isLoggingEnabled,
  );
  const [activeConsole, setActiveConsole] = useState(loggerStore.activeConsole);
  const [defaultConsole, setDefaultConsole] = useState(
    loggerStore.defaultConsole,
  );

  useEffect(() => {
    const unsubs = [
      loggerStore.subscribeLogs(setLogs),
      loggerStore.subscribeConsole(setConsoleHistory),
      loggerStore.subscribeSettings(() => {
        setIsLoggingEnabled(loggerStore.isLoggingEnabled);
        setActiveConsole(loggerStore.activeConsole);
        setDefaultConsole(loggerStore.defaultConsole);
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  return {
    logs,
    consoleHistory,
    isLoggingEnabled,
    activeConsole,
    defaultConsole,
    setActiveConsole: (type: "none" | "vconsole" | "eruda") =>
      loggerStore.setActiveConsole(type),
    setDefaultConsole: (type: "vconsole" | "eruda") =>
      loggerStore.setDefaultConsole(type),
  };
}

// Map window errors / fetch / network to logs if needed
if (typeof window !== "undefined") {
  // Initialise console if enabled
  if (loggerStore.activeConsole === "vconsole") {
    loggerStore.loadVConsole();
  } else if (loggerStore.activeConsole === "eruda") {
    loggerStore.loadEruda();
  }

  // Auto capture console logs
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const serializeArgs = (args: any[]) =>
    args
      .map((a) => {
        try {
          return typeof a === "object" ? JSON.stringify(a) : String(a);
        } catch (e) {
          return String(a);
        }
      })
      .join(" ");

  console.log = function (...args) {
    if (loggerStore.isLoggingEnabled)
      loggerStore.addConsole("output", serializeArgs(args));
    originalLog.apply(console, args);
  };
  console.error = function (...args) {
    if (loggerStore.isLoggingEnabled)
      loggerStore.addConsole("error", serializeArgs(args));
    originalError.apply(console, args);
  };
  console.warn = function (...args) {
    if (loggerStore.isLoggingEnabled)
      loggerStore.addConsole("warn", serializeArgs(args));
    originalWarn.apply(console, args);
  };
  console.info = function (...args) {
    if (loggerStore.isLoggingEnabled)
      loggerStore.addConsole("info", serializeArgs(args));
    originalInfo.apply(console, args);
  };

  // Global event listener
  const handleResize = () =>
    loggerStore.addLog("resize", `${window.innerWidth}x${window.innerHeight}`);
  const handleVisibility = () =>
    loggerStore.addLog("visibilitychange", document.visibilityState);
  const handleOnline = () => loggerStore.addLog("network", "online");
  const handleOffline = () => loggerStore.addLog("network", "offline");
  const handleFocus = () => loggerStore.addLog("window", "focus");
  const handleBlur = () => loggerStore.addLog("window", "blur");
  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("blur", handleBlur);

  window.addEventListener("error", (e) => {
    loggerStore.addConsole(
      "error",
      `[Uncaught Error] ${e.message}\n${e.error?.stack || ""}`,
    );
  });
  window.addEventListener("unhandledrejection", (e) => {
    loggerStore.addConsole(
      "error",
      `[Unhandled Promise Rejection] ${e.reason}`,
    );
  });
}
