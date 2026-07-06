export async function loadEruda(store: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
  if ((window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda) {
    try {
      (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda.show();
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
    (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda = eruda;

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
            (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda &&
            typeof (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda.position === "function"
          ) {
            try {
              (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda._devTools._theme = isCurrentlyDark
                ? "Dark"
                : "Light";
              (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda._devTools.emit(
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
    if ((window as any).eruda) {
      try {
        (window as any).eruda.destroy();
      } catch { /* ignore */ }
      (window as any).eruda = undefined;
    }
  }
}

export function unloadEruda() {
  if ((window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda) {
    try {
      (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda.destroy();
    } catch { /* ignore */ }
    (window as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).eruda = undefined;
    const erudaNode = document.getElementById("eruda-container");
    if (erudaNode) {
      erudaNode.remove();
    }
    const el = document.querySelector('div[id="eruda"]');
    if (el) el.remove();
  }
}
