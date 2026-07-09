export interface ErudaStore {
  erudaDefaultTab: string;
  erudaSnippets: {
    clear_local?: boolean;
    clear_session?: boolean;
    show_cookies?: boolean;
    toggle_blur?: boolean;
    toggle_editable?: boolean;
    [key: string]: boolean | undefined;
  };
}

export async function loadEruda(store: ErudaStore) {
  if (window.eruda) {
    try {
      window.eruda.show();
    } catch { /* ignore */ }
    return;
  }
  try {
    let container = document.getElementById("eruda-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "eruda-container";
      container.style.overscrollBehavior = "none";
      document.body.appendChild(container);
    }

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

    try {
      const wsDesc = Object.getOwnPropertyDescriptor(window, "WebSocket") || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), "WebSocket");
      if (wsDesc && (!wsDesc.set || !wsDesc.writable)) {
        let currentWS = window.WebSocket;
        Object.defineProperty(window, "WebSocket", {
          configurable: true,
          enumerable: true,
          get() {
            return currentWS;
          },
          set(val) {
            currentWS = val;
          }
        });
      }
    } catch (e) {
      console.warn("Failed to prepare window.WebSocket:", e);
    }

    const eruda = (await import("eruda")).default;
    eruda.init({
      container: container,
      useShadowDom: true,
    });

    // Wrap ALL plugin additions in individual try-catch blocks. Since the imported module is cached
    // across toggles, adding a plugin that was already added in a previous load session throws an error,
    // which previously crashed the loader midway, leaving window.eruda undefined or in a broken state.
    try {
      const erudaTiming = (await import("eruda-timing")).default;
      eruda.add(erudaTiming);
    } catch (e) {
      console.warn("Eruda timing plugin already added or failed to register:", e);
    }
    
    try { const erudaCode = (await import("eruda-code")).default; eruda.add(erudaCode); } catch { /* ignore */ }
    try { const erudaMonitor = (await import("eruda-monitor")).default; eruda.add(erudaMonitor); } catch { /* ignore */ }
    try { const erudaFeatures = (await import("eruda-features")).default; eruda.add(erudaFeatures); } catch { /* ignore */ }
    try { const erudaFps = (await import("eruda-fps")).default; eruda.add(erudaFps); } catch { /* ignore */ }

    // Only assign global reference after successful base initialization and plugin registration
    window.eruda = eruda as unknown as ErudaInstance;

    try { eruda.show(store.erudaDefaultTab); } catch { /* ignore */ }

    const snippets = eruda.get("snippets");
    if (snippets) {
      if (store.erudaSnippets.clear_local) {
        try {
          snippets.add(
            "Clear LocalStorage",
            function () {
              localStorage.clear();
              alert("LocalStorage cleared");
            },
            "Clears all data from localStorage",
          );
        } catch { /* ignore */ }
      }
      if (store.erudaSnippets.clear_session) {
        try {
          snippets.add(
            "Clear SessionStorage",
            function () {
              sessionStorage.clear();
              alert("SessionStorage cleared");
            },
            "Clears all data from sessionStorage",
          );
        } catch { /* ignore */ }
      }
      if (store.erudaSnippets.show_cookies) {
        try {
          snippets.add(
            "Show Cookies",
            function () {
              alert(document.cookie);
            },
            "Alerts all current document cookies",
          );
        } catch { /* ignore */ }
      }
      if (store.erudaSnippets.toggle_blur) {
        try {
          snippets.add(
            "Disable Body Blur",
            function () {
              document.body.classList.toggle("no-blur");
            },
            "Toggles body blur",
          );
        } catch { /* ignore */ }
      }
      if (store.erudaSnippets.toggle_editable) {
        try {
          snippets.add(
            "Toggle Editable Page",
            function () {
              document.body.contentEditable =
                document.body.contentEditable === "true" ? "false" : "true";
            },
            "Toggles content editable mode for the entire page",
          );
        } catch { /* ignore */ }
      }
    }

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
            window.eruda &&
            typeof window.eruda.position === "function"
          ) {
            try {
              window.eruda._devTools._theme = isCurrentlyDark
                ? "Dark"
                : "Light";
              window.eruda._devTools.emit(
                "themeChange",
                isCurrentlyDark ? "Dark" : "Light",
              );
            } catch { /* ignore */ }
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  } catch (err) {
    console.error("Failed to load Eruda:", err);
    // Defensive cleanup on error so subsequent loads are not permanently blocked by stale reference
    if (window.eruda) {
      try {
        window.eruda.destroy();
      } catch { /* ignore */ }
      window.eruda = undefined;
    }
  }
}

export function unloadEruda() {
  if (window.eruda) {
    try {
      window.eruda.destroy();
    } catch { /* ignore */ }
    window.eruda = undefined;
    const erudaNode = document.getElementById("eruda-container");
    if (erudaNode) {
      erudaNode.remove();
    }
    const el = document.querySelector('div[id="eruda"]');
    if (el) el.remove();
  }
}
