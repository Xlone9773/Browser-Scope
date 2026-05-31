export async function loadEruda(store: any) {
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
      container.style.overscrollBehavior = "none";
      document.body.appendChild(container);
    }

    const eruda = (await import("eruda")).default;
    eruda.init({
      container: container,
      useShadowDom: true,
    });
    (window as any).eruda = eruda;

    const erudaTiming = (await import("eruda-timing")).default;
    eruda.add(erudaTiming);
    
    try { const erudaDom = (await import("eruda-dom")).default; eruda.add(erudaDom); } catch (e) {}
    try { const erudaCode = (await import("eruda-code")).default; eruda.add(erudaCode); } catch (e) {}
    try { const erudaMonitor = (await import("eruda-monitor")).default; eruda.add(erudaMonitor); } catch (e) {}
    try { const erudaFeatures = (await import("eruda-features")).default; eruda.add(erudaFeatures); } catch (e) {}
    try { const erudaFps = (await import("eruda-fps")).default; eruda.add(erudaFps); } catch (e) {}

    try { eruda.show(store.erudaDefaultTab); } catch (e) {}

    const snippets = eruda.get("snippets");
    if (snippets) {
      if (store.erudaSnippets.clear_local) {
        snippets.add(
          "Clear LocalStorage",
          function () {
            localStorage.clear();
            alert("LocalStorage cleared");
          },
          "Clears all data from localStorage",
        );
      }
      if (store.erudaSnippets.clear_session) {
        snippets.add(
          "Clear SessionStorage",
          function () {
            sessionStorage.clear();
            alert("SessionStorage cleared");
          },
          "Clears all data from sessionStorage",
        );
      }
      if (store.erudaSnippets.show_cookies) {
        snippets.add(
          "Show Cookies",
          function () {
            alert(document.cookie || "No cookies found");
          },
          "Alerts all current document cookies",
        );
      }
      if (store.erudaSnippets.toggle_blur) {
        snippets.add(
          "Disable Body Blur",
          function () {
            document.body.classList.toggle("no-blur");
          },
          "Toggles body blur",
        );
      }
      if (store.erudaSnippets.toggle_editable) {
        snippets.add(
          "Toggle Editable Page",
          function () {
            document.body.contentEditable =
              document.body.contentEditable === "true" ? "false" : "true";
          },
          "Toggles content editable mode for the entire page",
        );
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

export function unloadEruda() {
  if ((window as any).eruda) {
    try {
      (window as any).eruda.destroy();
    } catch (e) {}
    (window as any).eruda = undefined;
    const erudaNode = document.getElementById("eruda-container");
    if (erudaNode) {
      erudaNode.remove();
    }
    const el = document.querySelector('div[id="eruda"]');
    if (el) el.remove();
  }
}
