export async function loadVConsole(store: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
  const win = window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  if (win.vConsole) {
    try {
      win.vConsole.show();
    } catch { /* ignore */ }
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
    win.vConsole = new (VConsole as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)({
      theme: isDark ? "dark" : "light",
    });
    try {
      if (store.vconsoleDefaultTab && store.vconsoleDefaultTab !== "default") {
        setTimeout(() => win.vConsole.showPlugin(store.vconsoleDefaultTab), 100);
      }
    } catch { /* ignore */ }

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
  } catch (err) {
    console.error("Failed to load vConsole:", err);
    if (win.vConsole) {
      try {
        win.vConsole.destroy();
      } catch { /* ignore */ }
      win.vConsole = undefined;
    }
  }
}

export function unloadVConsole() {
  const win = window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  if (win.vConsole) {
    try {
      win.vConsole.destroy();
    } catch { /* ignore */ }
    win.vConsole = undefined;
    const vcNode = document.getElementById("__vconsole");
    if (vcNode) {
      vcNode.remove();
    }
  }
}
