import { useState, useEffect } from "react";
import { Language } from "../utils/i18n/index";
import { applyTheme, getSavedTheme, Theme } from "../appearance/theme";

export function useAppSettings() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "zh-CN";
  });

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
  };

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

  const toggleTheme = () => {
    let newTheme: Theme;
    if (theme === "system") newTheme = "light";
    else if (theme === "light") newTheme = "dark";
    else newTheme = "system";

    const updateTheme = () => {
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    if (!document.startViewTransition || disableAnimations) {
      updateTheme();
    } else {
      document.startViewTransition(() => {
        updateTheme();
      });
    }
  };

  const updateHiddenCards = (cards: string[]) => {
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
    if (simpleMode !== hasAllAdvanced) {
      setSimpleMode(hasAllAdvanced);
      localStorage.setItem("simpleMode", String(hasAllAdvanced));
    }
  };

  const toggleSimpleMode = (value: boolean) => {
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
    if (value) {
      const newHidden = Array.from(new Set([...hiddenCards, ...advancedCards]));
      setHiddenCards(newHidden);
      localStorage.setItem("hiddenCards", JSON.stringify(newHidden));
    } else {
      const newHidden = hiddenCards.filter((c) => !advancedCards.includes(c));
      setHiddenCards(newHidden);
      localStorage.setItem("hiddenCards", JSON.stringify(newHidden));
    }
  };

  const updateThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color);
  };

  const updateAnimationStyle = (style: string) => {
    setAnimationStyle(style);
    localStorage.setItem("animationStyle", style);
  };

  const toggleHideScrollbar = (value: boolean) => {
    setHideScrollbar(value);
    localStorage.setItem("hideScrollbar", String(value));
  };

  const toggleGlobalHideScrollbar = (value: boolean) => {
    setGlobalHideScrollbar(value);
    localStorage.setItem("globalHideScrollbar", String(value));
  };

  const updateTimeFormat = (format: "12" | "24") => {
    setTimeFormat(format);
    localStorage.setItem("timeFormat", format);
  };

  const toggleDisableBlur = (value: boolean) => {
    setDisableBlur(value);
    localStorage.setItem("disableBlur", String(value));
  };

  const toggleDisableAnimations = (value: boolean) => {
    setDisableAnimations(value);
    localStorage.setItem("disableAnimations", String(value));
  };

  const toggleFastAnimations = (value: boolean) => {
    setFastAnimations(value);
    localStorage.setItem("fastAnimations", String(value));
  };

  const toggleCollapseHeader = (value: boolean) => {
    setCollapseHeader(value);
    localStorage.setItem("collapseHeader", String(value));
  };

  const toggleEnableUdp = (value: boolean) => {
    setEnableUdp(value);
    localStorage.setItem("enableUdp", String(value));
  };

  const toggleShowTabs = (value: boolean) => {
    setShowTabs(value);
    localStorage.setItem("showTabs", String(value));
  };

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
    hiddenCards,
    updateHiddenCards,
  };
}
