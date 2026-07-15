import { useState, useEffect, useCallback } from "react";
import { Language } from "../utils/i18n/index";
import { applyTheme, getSavedTheme, Theme } from "../appearance/theme";

export function useAppSettings() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "zh-CN";
  });

  const changeLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
  }, []);

  const [theme, setTheme] = useState<Theme>("system");
  const [themeColor, setThemeColor] = useState<string>(
    () => localStorage.getItem("themeColor") || "indigo",
  );
  const [animationStyle, setAnimationStyle] = useState<string>(
    () => localStorage.getItem("animationStyle") || "slide-up",
  );
  const [initialAnimationStyle] = useState<string>(
    () => localStorage.getItem("animationStyle") || "slide-up",
  );
  const [simpleMode, setSimpleMode] = useState<boolean>(
    () => localStorage.getItem("simpleMode") === "true",
  );
  const [hideScrollbar, setHideScrollbar] = useState<boolean>(
    () => localStorage.getItem("hideScrollbar") === "true",
  );
  const [globalHideScrollbar, setGlobalHideScrollbar] = useState<boolean>(
    () => localStorage.getItem("globalHideScrollbar") === "true",
  );
  const [timeFormat, setTimeFormat] = useState<"12" | "24">(() => {
    const saved = localStorage.getItem("timeFormat");
    return saved === "12" || saved === "24" ? saved : "24";
  });
  const [disableBlur, setDisableBlur] = useState<boolean>(
    () => localStorage.getItem("disableBlur") === "true",
  );
  const [disableAnimations, setDisableAnimations] = useState<boolean>(
    () => localStorage.getItem("disableAnimations") === "true",
  );
  const [fastAnimations, setFastAnimations] = useState<boolean>(
    () => localStorage.getItem("fastAnimations") === "true",
  );
  const [collapseHeader, setCollapseHeader] = useState<boolean>(
    () => localStorage.getItem("collapseHeader") === "true",
  );
  const [enableUdp, setEnableUdp] = useState<boolean>(
    () => localStorage.getItem("enableUdp") === "true",
  );
  const [showTabs, setShowTabs] = useState<boolean>(() => {
    const saved = localStorage.getItem("showTabs");
    return saved === null ? true : saved === "true";
  });
  const [searchScope, setSearchScope] = useState<'all' | 'category' | 'title' | 'value'>(() => {
    const saved = localStorage.getItem("searchScope");
    if (saved === 'all' || saved === 'category' || saved === 'title' || saved === 'value') {
      return saved;
    }
    return 'all';
  });
  
  const updateSearchScope = useCallback((scope: 'all' | 'category' | 'title' | 'value') => {
    setSearchScope(scope);
    localStorage.setItem("searchScope", scope);
  }, []);

  const [searchMode, setSearchMode] = useState<'fuzzy' | 'exact'>(() => {
    const saved = localStorage.getItem("searchMode");
    if (saved === 'fuzzy' || saved === 'exact') {
      return saved;
    }
    return 'fuzzy';
  });

  const updateSearchMode = useCallback((mode: 'fuzzy' | 'exact') => {
    setSearchMode(mode);
    localStorage.setItem("searchMode", mode);
  }, []);

  const [showSearch, setShowSearch] = useState<boolean>(() => {
    const saved = localStorage.getItem("showSearch");
    return saved === null ? true : saved === "true";
  });
  const [showQuickSummary, setShowQuickSummary] = useState<boolean>(() => {
    const saved = localStorage.getItem("showQuickSummary");
    return saved === null ? true : saved === "true";
  });

  const toggleShowQuickSummary = useCallback((value: boolean) => {
    setShowQuickSummary(value);
    localStorage.setItem("showQuickSummary", String(value));
  }, []);

  const [hiddenCards, setHiddenCards] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("hiddenCards");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (getSavedTheme() === "system") {
        applyTheme("system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, []);

  useEffect(() => {
    const colors = [
      "theme-indigo",
      "theme-emerald",
      "theme-rose",
      "theme-amber",
      "theme-blue",
      "theme-violet",
      "theme-sky",
      "theme-cherry",
      "theme-ice",
    ];
    document.documentElement.classList.remove(...colors);
    if (themeColor !== "indigo") {
      document.documentElement.classList.add(`theme-${themeColor}`);
    }
  }, [themeColor]);

  useEffect(() => {
    if (hideScrollbar) {
      document.documentElement.classList.add("scrollbar-hide");
    } else {
      document.documentElement.classList.remove("scrollbar-hide");
    }
  }, [hideScrollbar]);

  useEffect(() => {
    if (globalHideScrollbar) {
      document.documentElement.classList.add("global-scrollbar-hide");
    } else {
      document.documentElement.classList.remove("global-scrollbar-hide");
    }
  }, [globalHideScrollbar]);

  useEffect(() => {
    if (disableBlur) {
      document.body.classList.add("no-blur");
    } else {
      document.body.classList.remove("no-blur");
    }
  }, [disableBlur]);

  useEffect(() => {
    if (disableAnimations) {
      document.body.classList.add("disable-animations");
      document.body.classList.remove("fast-animations");
      let style = document.getElementById("disable-animations-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "disable-animations-style";
        style.innerHTML = `
                    *, *::before, *::after {
                        transition: none !important;
                        animation: none !important;
                        scroll-behavior: auto !important;
                    }
                `;
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove("disable-animations");
      const style = document.getElementById("disable-animations-style");
      if (style) {
        style.remove();
      }

      if (fastAnimations) {
        document.body.classList.add("fast-animations");
      } else {
        document.body.classList.remove("fast-animations");
      }
    }
  }, [disableAnimations, fastAnimations]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      let newTheme: Theme;
      if (prevTheme === "system") newTheme = "light";
      else if (prevTheme === "light") newTheme = "dark";
      else newTheme = "system";

      const updateTheme = () => {
        applyTheme(newTheme);
      };

      if (!document.startViewTransition || disableAnimations) {
        updateTheme();
      } else {
        document.startViewTransition(() => {
          updateTheme();
        });
      }
      return newTheme;
    });
  }, [disableAnimations]);

  const updateHiddenCards = useCallback((cards: string[]) => {
    setHiddenCards(cards);
    localStorage.setItem("hiddenCards", JSON.stringify(cards));

    const advancedCards = [
      "hardware",
      "fingerprint",
      "ai",
      "location",
      "storage",
      "permissions",
      "media_devices",
      "media_capabilities",
      "pwa",
      "features",
      "user_agent",
    ];
    const hasAllAdvanced = advancedCards.every((c) => cards.includes(c));
    setSimpleMode((prevSimple) => {
      if (prevSimple !== hasAllAdvanced) {
        localStorage.setItem("simpleMode", String(hasAllAdvanced));
        return hasAllAdvanced;
      }
      return prevSimple;
    });
  }, []);

  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dismissedNotifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dismissNotification = useCallback((id: string) => {
    setDismissedNotifications((prev: string[]) => {
      const next = [...prev, id];
      localStorage.setItem("dismissedNotifications", JSON.stringify(next));
      return next;
    });
  }, []);

  const restoreAllNotifications = useCallback(() => {
    setDismissedNotifications([]);
    localStorage.removeItem("dismissedNotifications");
  }, []);

  const toggleSimpleMode = useCallback((value: boolean) => {
    setSimpleMode(value);
    localStorage.setItem("simpleMode", String(value));

    const advancedCards = [
      "hardware",
      "fingerprint",
      "ai",
      "location",
      "storage",
      "permissions",
      "media_devices",
      "media_capabilities",
      "pwa",
      "features",
      "user_agent",
    ];
    setHiddenCards((prevHidden) => {
      let newHidden: string[];
      if (value) {
        newHidden = Array.from(new Set([...prevHidden, ...advancedCards]));
      } else {
        newHidden = prevHidden.filter((c) => !advancedCards.includes(c));
      }
      localStorage.setItem("hiddenCards", JSON.stringify(newHidden));
      return newHidden;
    });
  }, []);

  const updateThemeColor = useCallback((color: string) => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color);
  }, []);

  const updateAnimationStyle = useCallback((style: string) => {
    setAnimationStyle(style);
    localStorage.setItem("animationStyle", style);
  }, []);

  const toggleHideScrollbar = useCallback((value: boolean) => {
    setHideScrollbar(value);
    localStorage.setItem("hideScrollbar", String(value));
  }, []);

  const toggleGlobalHideScrollbar = useCallback((value: boolean) => {
    setGlobalHideScrollbar(value);
    localStorage.setItem("globalHideScrollbar", String(value));
  }, []);

  const updateTimeFormat = useCallback((format: "12" | "24") => {
    setTimeFormat(format);
    localStorage.setItem("timeFormat", format);
  }, []);

  const toggleDisableBlur = useCallback((value: boolean) => {
    setDisableBlur(value);
    localStorage.setItem("disableBlur", String(value));
  }, []);

  const toggleDisableAnimations = useCallback((value: boolean) => {
    setDisableAnimations(value);
    localStorage.setItem("disableAnimations", String(value));
  }, []);

  const toggleFastAnimations = useCallback((value: boolean) => {
    setFastAnimations(value);
    localStorage.setItem("fastAnimations", String(value));
  }, []);

  const toggleCollapseHeader = useCallback((value: boolean) => {
    setCollapseHeader(value);
    localStorage.setItem("collapseHeader", String(value));
  }, []);

  const toggleEnableUdp = useCallback((value: boolean) => {
    setEnableUdp(value);
    localStorage.setItem("enableUdp", String(value));
  }, []);

  const toggleShowTabs = useCallback((value: boolean) => {
    setShowTabs(value);
    localStorage.setItem("showTabs", String(value));
  }, []);

  const [imageExportScale, setImageExportScale] = useState<number>(
    () => Number(localStorage.getItem("imageExportScale")) || 2,
  );
  const updateImageExportScale = useCallback((value: number) => {
    setImageExportScale(value);
    localStorage.setItem("imageExportScale", String(value));
  }, []);

  const [pdfExportFormat, setPdfExportFormat] = useState<'a4' | 'letter' | 'legal'>(
    () => (localStorage.getItem("pdfExportFormat") as 'a4' | 'letter' | 'legal') || 'a4',
  );
  const updatePdfExportFormat = useCallback((value: 'a4' | 'letter' | 'legal') => {
    setPdfExportFormat(value);
    localStorage.setItem("pdfExportFormat", value);
  }, []);

  const toggleShowSearch = useCallback((value: boolean) => {
    setShowSearch(value);
    localStorage.setItem("showSearch", String(value));
  }, []);

  return {
    lang,
    changeLang,
    theme,
    toggleTheme,
    themeColor,
    updateThemeColor,
    animationStyle,
    updateAnimationStyle,
    initialAnimationStyle,
    simpleMode,
    toggleSimpleMode,
    hideScrollbar,
    toggleHideScrollbar,
    globalHideScrollbar,
    toggleGlobalHideScrollbar,
    timeFormat,
    updateTimeFormat,
    disableBlur,
    toggleDisableBlur,
    disableAnimations,
    toggleDisableAnimations,
    fastAnimations,
    toggleFastAnimations,
    collapseHeader,
    toggleCollapseHeader,
    enableUdp,
    toggleEnableUdp,
    showTabs,
    toggleShowTabs,
    showSearch,
    toggleShowSearch,
    imageExportScale,
    updateImageExportScale,
    pdfExportFormat,
    updatePdfExportFormat,
    searchScope,
    updateSearchScope,
    searchMode,
    updateSearchMode,
    hiddenCards,
    updateHiddenCards,
    dismissedNotifications,
    dismissNotification,
    restoreAllNotifications,
    showQuickSummary,
    toggleShowQuickSummary,
  };
}
