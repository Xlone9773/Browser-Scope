import { loadVConsole } from "./vconsole";
import { loadEruda } from "./eruda";

export function setupInterceptors(loggerStore: any) {
  if (typeof window === "undefined") return;

  if (loggerStore.activeConsole === "vconsole") {
    loadVConsole(loggerStore);
  } else if (loggerStore.activeConsole === "eruda") {
    loadEruda(loggerStore);
  }

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
