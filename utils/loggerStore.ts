import { useState, useEffect } from "react";
import { ConsoleEntry } from "./logger/types";
import { loadEruda, unloadEruda } from "./logger/eruda";
import { loadVConsole, unloadVConsole } from "./logger/vconsole";
import { setupInterceptors } from "./logger/interceptors";

export type { ConsoleEntry };

class LoggerStore {
  public logs: string[] = [];
  public consoleHistory: ConsoleEntry[] = [];
  public isLoggingEnabled: boolean =
    localStorage.getItem("developer_logging_enabled") !== "false";
  public activeConsole: "none" | "vconsole" | "eruda" =
    (localStorage.getItem("developer_active_console") as any) || "none";
  public defaultConsole: "vconsole" | "eruda" =
    (localStorage.getItem("developer_default_console") as any) || "vconsole";
  public erudaDefaultTab: string =
    localStorage.getItem("developer_eruda_default_tab") || "console";
  public vconsoleDefaultTab: string =
    localStorage.getItem("developer_vconsole_default_tab") || "default";
  public erudaSnippets: Record<string, boolean> = (() => {
    try {
      const stored = localStorage.getItem("developer_eruda_snippets");
      return stored ? JSON.parse(stored) : { clear_local: true, clear_session: true, show_cookies: true, toggle_blur: true, toggle_editable: true };
    } catch {
      return { clear_local: true, clear_session: true, show_cookies: true, toggle_blur: true, toggle_editable: true };
    }
  })();

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

  setErudaSnippet(key: string, enabled: boolean) {
    this.erudaSnippets = { ...this.erudaSnippets, [key]: enabled };
    localStorage.setItem("developer_eruda_snippets", JSON.stringify(this.erudaSnippets));
    if (this.activeConsole === "eruda") {
      unloadEruda();
      loadEruda(this);
    }
    this.notifySettings();
  }

  setErudaDefaultTab(tab: string) {
    this.erudaDefaultTab = tab;
    localStorage.setItem("developer_eruda_default_tab", tab);
    if (this.activeConsole === "eruda" && (window as any).eruda) {
      try {
        (window as any).eruda.show(tab);
      } catch (e) {}
    }
    this.notifySettings();
  }

  setVconsoleDefaultTab(tab: string) {
    this.vconsoleDefaultTab = tab;
    localStorage.setItem("developer_vconsole_default_tab", tab);
    if (this.activeConsole === "vconsole" && (window as any).vConsole) {
      try {
        (window as any).vConsole.showPlugin(tab);
      } catch (e) {}
    }
    this.notifySettings();
  }

  setActiveConsole(consoleType: "none" | "vconsole" | "eruda") {
    const previousConsole = this.activeConsole;
    this.activeConsole = consoleType;
    localStorage.setItem("developer_active_console", consoleType);

    if (previousConsole === "vconsole" && consoleType !== "vconsole") {
      unloadVConsole();
    } else if (previousConsole === "eruda" && consoleType !== "eruda") {
      unloadEruda();
    }

    if (consoleType === "vconsole") {
      loadVConsole(this);
    } else if (consoleType === "eruda") {
      loadEruda(this);
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
  const [erudaSnippets, setErudaSnippets] = useState(
    loggerStore.erudaSnippets,
  );
  const [erudaDefaultTab, setErudaDefaultTab] = useState(
    loggerStore.erudaDefaultTab,
  );
  const [vconsoleDefaultTab, setVconsoleDefaultTab] = useState(
    loggerStore.vconsoleDefaultTab,
  );

  useEffect(() => {
    const unsubs = [
      loggerStore.subscribeLogs(setLogs),
      loggerStore.subscribeConsole(setConsoleHistory),
      loggerStore.subscribeSettings(() => {
        setIsLoggingEnabled(loggerStore.isLoggingEnabled);
        setActiveConsole(loggerStore.activeConsole);
        setDefaultConsole(loggerStore.defaultConsole);
        setErudaSnippets(loggerStore.erudaSnippets);
        setErudaDefaultTab(loggerStore.erudaDefaultTab);
        setVconsoleDefaultTab(loggerStore.vconsoleDefaultTab);
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
    erudaSnippets,
    erudaDefaultTab,
    vconsoleDefaultTab,
    setActiveConsole: (type: "none" | "vconsole" | "eruda") =>
      loggerStore.setActiveConsole(type),
    setDefaultConsole: (type: "vconsole" | "eruda") =>
      loggerStore.setDefaultConsole(type),
    setErudaSnippet: (key: string, enabled: boolean) =>
      loggerStore.setErudaSnippet(key, enabled),
    setErudaDefaultTab: (tab: string) =>
      loggerStore.setErudaDefaultTab(tab),
    setVconsoleDefaultTab: (tab: string) =>
      loggerStore.setVconsoleDefaultTab(tab),
  };
}

setupInterceptors(loggerStore);
