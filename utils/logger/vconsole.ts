export interface VConsoleStore {
  vconsoleDefaultTab: string;
}

export interface VConsoleInstance {
  show(): void;
  showPlugin(tab: string): void;
  destroy(): void;
  setOption(key: string, value: string): void;
}

type WindowWithVConsole = Window & typeof globalThis & {
  vConsole?: VConsoleInstance;
};

export async function loadVConsole(store: VConsoleStore) {
  const win = window as unknown as WindowWithVConsole;
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
    const VConsoleDefault = (await import("vconsole")).default;
    const VConsole = VConsoleDefault as unknown as new (options: { theme: string }) => VConsoleInstance;
    const isDark = document.documentElement.classList.contains("dark");
    win.vConsole = new VConsole({
      theme: isDark ? "dark" : "light",
    });
    try {
      if (store.vconsoleDefaultTab && store.vconsoleDefaultTab !== "default") {
        setTimeout(() => win.vConsole?.showPlugin(store.vconsoleDefaultTab), 100);
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
  const win = window as unknown as WindowWithVConsole;
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
