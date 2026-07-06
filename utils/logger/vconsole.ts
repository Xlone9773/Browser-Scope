export async function loadVConsole(store: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
  const win = window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  if (win.vConsole) {
    try {
      win.vConsole.show();
    } catch { /* ignore */ }
    return;
  }
  try {
    try {
      const fetchDesc = Object.getOwnPropertyDescriptor(window, "fetch") || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), "fetch");
      if (fetchDesc && (!fetchDesc.set || !fetchDesc.writable)) {
        let currentFetch = window.fetch;
        Object.defineProperty(window, "fetch", {
          configurable: true,
          enumerable: true,
          get() {
            return currentFetch;
          },
          set(val) {
            currentFetch = val;
          }
        });
      }
    } catch (e) {
      console.warn("Failed to prepare window.fetch:", e);
    }

    try {
      const xhrDesc = Object.getOwnPropertyDescriptor(window, "XMLHttpRequest") || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), "XMLHttpRequest");
      if (xhrDesc && (!xhrDesc.set || !xhrDesc.writable)) {
        let currentXHR = window.XMLHttpRequest;
        Object.defineProperty(window, "XMLHttpRequest", {
          configurable: true,
          enumerable: true,
          get() {
            return currentXHR;
          },
          set(val) {
            currentXHR = val;
          }
        });
      }
    } catch (e) {
      console.warn("Failed to prepare window.XMLHttpRequest:", e);
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
