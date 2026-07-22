import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Monitor, Smartphone, ShieldAlert, Cpu } from "lucide-react";
import { exportAsJson, exportAsPdf, exportAsImage } from "./services/exporter";
import { loadLocale, Translation } from "./utils/i18n/index";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { useModalManager } from "./hooks/useModalManager";
import { useCardIndex } from "./hooks/useCardIndex";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { BrowserData } from "./types";
import { AppNotification } from "./components/ui/AppNotification";
import { BackToTop } from "./components/ui/BackToTop";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ModuleState } from "./components/settings/ModulesTab";
import { useAppSettings } from "./hooks/useAppSettings";
import { useAppPermissions } from "./hooks/useAppPermissions";
import { useAppData } from "./hooks/useAppData";
import packageJson from "./package.json";

// Import newly extracted sub-components
import { LoadingOverlay } from "./components/layout/LoadingOverlay";
import { ModalContainer } from "./components/layout/ModalContainer";
import { SearchBarAndTabs } from "./components/layout/SearchBarAndTabs";
import { DashboardGrid } from "./components/layout/DashboardGrid";

const App: React.FC = () => {
  const { visibility, open, close, unload, loadedModules, Components, closeAll } =
    useModalManager();

  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [activeTab, setActiveTab] = useState<"all" | "browser" | "environment" | "system" | "network" | "advanced">("all");
  const [_slideDirection, setSlideDirection] = useState<number>(0);

  const {
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
    imageExportScale,
    updateImageExportScale,
    pdfExportFormat,
    updatePdfExportFormat,
    bodyFont,
    updateBodyFont,
    modalTitleFont,
    updateModalTitleFont,
    codeFont,
    updateCodeFont,
  } = useAppSettings();

  const [matchedCardIds, setMatchedCardIds] = useState<string[] | null>(null);
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [isViewportTooSmall, setIsViewportTooSmall] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  useEffect(() => {
    const checkViewportSize = () => {
      setIsViewportTooSmall(window.innerWidth < 640 || window.innerHeight < 500);
    };
    checkViewportSize();
    window.addEventListener("resize", checkViewportSize);
    return () => {
      window.removeEventListener("resize", checkViewportSize);
    };
  }, []);

  const [t, setT] = useState<Translation>({} as Translation);

  useEffect(() => {
    let active = true;
    loadLocale(lang).then((loaded) => {
      if (active) {
        setT(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, [lang]);

  // Offline / online detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const swReg = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [lastCheckTime, setLastCheckTime] = useState<number>(() => Date.now());
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered");
      if (r) {
        swReg.current = r;
        const interval = setInterval(() => {
          r.update();
          setLastCheckTime(Date.now());
        }, 60 * 60 * 1000); // 1 hour check
        return () => clearInterval(interval);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const availableTabs = useMemo(() => {
    const tabs: {
      id: "all" | "browser" | "environment" | "system" | "network" | "advanced";
      label: string;
      icon: React.ReactNode;
    }[] = [{ id: "all", label: t.groups?.all || "All", icon: null }];

    const hasVisibleMatchingCard = (cards: string[]) => {
      return cards.some((cardId) => {
        if (hiddenCards.includes(cardId)) return false;
        if (matchedCardIds !== null && !matchedCardIds.includes(cardId)) return false;
        return true;
      });
    };

    if (hasVisibleMatchingCard(["browser"])) {
      tabs.push({ id: "browser", label: t.groups?.browser || "Browser", icon: <Monitor size={16} /> });
    }
    if (hasVisibleMatchingCard(["environment"])) {
      tabs.push({ id: "environment", label: t.groups?.environment || "Environment", icon: <ShieldAlert size={16} /> });
    }
    if (hasVisibleMatchingCard(["system", "hardware", "display"])) {
      tabs.push({ id: "system", label: t.groups?.system || "System", icon: <Smartphone size={16} /> });
    }
    if (hasVisibleMatchingCard(["network", "security", "fingerprint"])) {
      tabs.push({ id: "network", label: t.groups?.network || "Network", icon: <ShieldAlert size={16} /> });
    }
    if (
      hasVisibleMatchingCard([
        "ai",
        "location",
        "storage",
        "permissions",
        "media_devices",
        "media_capabilities",
        "user_agent",
        "pwa",
        "features",
      ])
    ) {
      tabs.push({ id: "advanced", label: t.groups?.advanced || "Advanced", icon: <Cpu size={16} /> });
    }
    return tabs;
  }, [t, hiddenCards, matchedCardIds]);

  useEffect(() => {
    if (activeTab !== "all" && !availableTabs.some((tab) => tab.id === activeTab)) {
      const timer = setTimeout(() => {
        setActiveTab("all");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [availableTabs, activeTab]);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const activeBtn = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const scrollLeft = activeBtn.offsetLeft - containerWidth / 2 + activeBtn.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEndX.current = null;
    touchEndY.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
      const isLeftSwipe = distanceX > 50;
      const currentIndex = availableTabs.findIndex((tab) => tab.id === activeTab);
      if (currentIndex !== -1) {
        if (isLeftSwipe && currentIndex < availableTabs.length - 1) {
          setSlideDirection(1);
          setActiveTab(availableTabs[currentIndex + 1].id);
        } else if (!isLeftSwipe && currentIndex > 0) {
          setSlideDirection(-1);
          setActiveTab(availableTabs[currentIndex - 1].id);
        }
      }
    }
  }, [availableTabs, activeTab]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && swReg.current) {
        if (Date.now() - lastCheckTime > 10 * 60 * 1000) {
          swReg.current.update();
          setLastCheckTime(Date.now());
        }
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);
    return () => window.removeEventListener("visibilitychange", handleVisibility);
  }, [lastCheckTime]);

  const manualCheckUpdate = async (): Promise<string> => {
    setIsCheckingUpdate(true);
    try {
      if (needRefresh) {
        await updateServiceWorker(true);
        return "triggered";
      }
      if (swReg.current) {
        await swReg.current.update();
        setLastCheckTime(Date.now());
        return "checked";
      }
      return "not-supported";
    } catch (e) {
      console.error(e);
      return "error";
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const { data, showLoader, fadeLoader, loadingText, fetchData, handleAiRetest } = useAppData(
    t.common?.loading_steps || [t.common?.loading || "Loading"]
  );

  const browserData = data as BrowserData;
  const cardIndex = useCardIndex(browserData, t);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        const query = keyword.toLowerCase().trim();
        if (!query) {
          setMatchedCardIds(null);
          return;
        }

        const matches: string[] = [];
        const isFuzzy = searchMode === "fuzzy";

        const fuzzyMatch = (text: string, q: string): boolean => {
          const normText = String(text || "").toLowerCase().trim();
          const normQuery = String(q || "").toLowerCase().trim();
          if (!normQuery) return true;
          if (!normText) return false;
          const terms = normQuery.split(/\s+/).filter(Boolean);
          if (terms.length > 1) {
            return terms.every((term) => normText.includes(term));
          }
          let textIdx = 0;
          let queryIdx = 0;
          while (textIdx < normText.length && queryIdx < normQuery.length) {
            if (normText[textIdx] === normQuery[queryIdx]) {
              queryIdx++;
            }
            textIdx++;
          }
          return queryIdx === normQuery.length;
        };

        const exactMatch = (text: string, q: string): boolean => {
          const normText = String(text || "").toLowerCase().trim();
          const normQuery = String(q || "").toLowerCase().trim();
          return normText.includes(normQuery);
        };

        for (const [id, cData] of Object.entries(cardIndex)) {
          let textToSearch: string;
          switch (searchScope) {
            case "category":
              textToSearch = cData.category;
              break;
            case "title":
              textToSearch = cData.title;
              break;
            case "value":
              textToSearch = cData.value;
              break;
            case "all":
            default:
              textToSearch = `${cData.category} ${cData.title} ${cData.value}`;
              break;
          }

          const isMatch = isFuzzy ? fuzzyMatch(textToSearch, query) : exactMatch(textToSearch, query);
          if (isMatch) {
            matches.push(id);
          }
        }

        setMatchedCardIds(matches);
      }, 150);
    },
    [cardIndex, searchMode, searchScope]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const isOutdated = useMemo(() => {
    if (data && data.system && data.system.browserName && data.system.browserVersion) {
      const name = data.system.browserName.toLowerCase();
      const version = parseInt(data.system.browserVersion, 10);
      if (!isNaN(version)) {
        if (name.includes("chrome") && version < 100) return true;
        if (name.includes("firefox") && version < 100) return true;
        if (name.includes("safari") && version < 15) return true;
        if (name.includes("edge") && version < 100) return true;
      }
    }
    return false;
  }, [data]);

  const { permStatus, geoData, checkPermissionStatus, requestPermission } = useAppPermissions((modalId) =>
    open(modalId)
  );

  const [isDevToolsFloating, setIsDevToolsFloating] = useState(false);

  const settingsTitle = t.settings?.title;
  const developerTabTitle = t.settings?.nav?.developer;

  const modalStates: ModuleState[] = [
    {
      id: "settings",
      name: settingsTitle || "Settings",
      isOpen: visibility.settings,
      setOpen: (v: boolean) => (v ? open("settings") : close("settings")),
      impact: "Low",
      isSystem: true,
      isLoaded: true,
    },
    {
      id: "camera",
      name: t.cameraTool?.title || "Camera Tool",
      isOpen: visibility.camera,
      setOpen: (v: boolean) => (v ? open("camera") : close("camera")),
      impact: "High",
      onUnload: () => unload("camera"),
      isLoaded: loadedModules.has("camera"),
    },
    {
      id: "audio",
      name: t.audioTool?.title || "Audio Recorder",
      isOpen: visibility.audio,
      setOpen: (v: boolean) => (v ? open("audio") : close("audio")),
      impact: "Medium",
      onUnload: () => unload("audio"),
      isLoaded: loadedModules.has("audio"),
    },
    {
      id: "webgl",
      name: t.webglTool?.title || "WebGL Extensions",
      isOpen: visibility.webgl,
      setOpen: (v: boolean) => (v ? open("webgl") : close("webgl")),
      impact: "Low",
      onUnload: () => unload("webgl"),
      isLoaded: loadedModules.has("webgl"),
    },
    {
      id: "canvas",
      name: "Canvas Detail",
      isOpen: visibility.canvas,
      setOpen: (v: boolean) => (v ? open("canvas") : close("canvas")),
      impact: "Low",
      onUnload: () => unload("canvas"),
      isLoaded: loadedModules.has("canvas"),
    },
    {
      id: "base64",
      name: t.base64Tool?.title || "Base64 Inspector",
      isOpen: visibility.base64,
      setOpen: (v: boolean) => (v ? open("base64") : close("base64")),
      impact: "Low",
      onUnload: () => unload("base64"),
      isLoaded: loadedModules.has("base64"),
    },
    {
      id: "about",
      name: t.aboutModal?.title || "About",
      isOpen: visibility.about,
      setOpen: (v: boolean) => (v ? open("about") : close("about")),
      impact: "Low",
      onUnload: () => unload("about"),
      isLoaded: loadedModules.has("about"),
    },
    {
      id: "sensor",
      name: t.sensorModal?.sensor_title || "Sensors",
      isOpen: visibility.sensor,
      setOpen: (v: boolean) => (v ? open("sensor") : close("sensor")),
      impact: "Medium",
      onUnload: () => unload("sensor"),
      isLoaded: loadedModules.has("sensor"),
    },
    {
      id: "score",
      name: t.scoreModal?.score_details_title || "Score Details",
      isOpen: visibility.score,
      setOpen: (v: boolean) => (v ? open("score") : close("score")),
      impact: "Low",
      onUnload: () => unload("score"),
      isLoaded: loadedModules.has("score"),
    },
    {
      id: "fingerprint",
      name: t.fingerprintModal?.title || "Fingerprint Inspector",
      isOpen: visibility.fingerprint,
      setOpen: (v: boolean) => (v ? open("fingerprint") : close("fingerprint")),
      impact: "Medium",
      onUnload: () => unload("fingerprint"),
      isLoaded: loadedModules.has("fingerprint"),
    },
    {
      id: "benchmark",
      name: t.benchmarkModal?.title || "Benchmark",
      isOpen: visibility.benchmark,
      setOpen: (v: boolean) => (v ? open("benchmark") : close("benchmark")),
      impact: "High",
      onUnload: () => unload("benchmark"),
      isLoaded: loadedModules.has("benchmark"),
    },
    {
      id: "tools",
      name: t.hardwareToolsModal?.title || "Hardware Tools",
      isOpen: visibility.tools,
      setOpen: (v: boolean) => (v ? open("tools") : close("tools")),
      impact: "Medium",
      onUnload: () => unload("tools"),
      isLoaded: loadedModules.has("tools"),
    },
    {
      id: "ai",
      name: t.aiPlayground?.title || "AI Playground",
      isOpen: visibility.ai,
      setOpen: (v: boolean) => (v ? open("ai") : close("ai")),
      impact: "High",
      onUnload: () => unload("ai"),
      isLoaded: loadedModules.has("ai"),
    },
    {
      id: "gamepad",
      name: t.gamepadTool?.title || "Gamepad API Test",
      isOpen: visibility.gamepad,
      setOpen: (v: boolean) => (v ? open("gamepad") : close("gamepad")),
      impact: "Medium",
      onUnload: () => unload("gamepad"),
      isLoaded: loadedModules.has("gamepad"),
    },
    {
      id: "webDevice",
      name: t.webDevice?.title || "Web Device API",
      isOpen: visibility.webDevice,
      setOpen: (v: boolean) => (v ? open("webDevice") : close("webDevice")),
      impact: "Medium",
      onUnload: () => unload("webDevice"),
      isLoaded: loadedModules.has("webDevice"),
    },
    {
      id: "vision",
      name: t.visionModal?.title || "Computer Vision Tests",
      isOpen: visibility.vision,
      setOpen: (v: boolean) => (v ? open("vision") : close("vision")),
      impact: "High",
      onUnload: () => unload("vision"),
      isLoaded: loadedModules.has("vision"),
    },
    {
      id: "speed",
      name: t.speedTest?.title || "Speed Test",
      isOpen: visibility.speed,
      setOpen: (v: boolean) => (v ? open("speed") : close("speed")),
      impact: "Medium",
      onUnload: () => unload("speed"),
      isLoaded: loadedModules.has("speed"),
    },
    {
      id: "compute",
      name: t.computeStress?.title || "Compute Stress Test",
      isOpen: visibility.compute,
      setOpen: (v: boolean) => (v ? open("compute") : close("compute")),
      impact: "High",
      onUnload: () => unload("compute"),
      isLoaded: loadedModules.has("compute"),
    },
    {
      id: "video",
      name: t.actions?.open_video_test || "Video Decoder Analysis",
      isOpen: visibility.video,
      setOpen: (v: boolean) => (v ? open("video") : close("video")),
      impact: "High",
      onUnload: () => unload("video"),
      isLoaded: loadedModules.has("video"),
    },
    {
      id: "graphics",
      name: t.graphicsModal?.title || "Graphics Debug",
      isOpen: visibility.graphics,
      setOpen: (v: boolean) => (v ? open("graphics") : close("graphics")),
      impact: "Medium",
      onUnload: () => unload("graphics"),
      isLoaded: loadedModules.has("graphics"),
    },
    {
      id: "speech",
      name: t.speechModal?.title || "Speech synthesis APIs",
      isOpen: visibility.speech,
      setOpen: (v: boolean) => (v ? open("speech") : close("speech")),
      impact: "Medium",
      onUnload: () => unload("speech"),
      isLoaded: loadedModules.has("speech"),
    },
    {
      id: "midi",
      name: t.midiModal?.title || "Web MIDI API Analysis",
      isOpen: visibility.midi,
      setOpen: (v: boolean) => (v ? open("midi") : close("midi")),
      impact: "Low",
      onUnload: () => unload("midi"),
      isLoaded: loadedModules.has("midi"),
    },
    {
      id: "storageBench",
      name: t.storageBenchmark?.title || "Storage Benchmark",
      isOpen: visibility.storageBench,
      setOpen: (v: boolean) => (v ? open("storageBench") : close("storageBench")),
      impact: "High",
      onUnload: () => unload("storageBench"),
      isLoaded: loadedModules.has("storageBench"),
    },
    {
      id: "heatmap",
      name: t.heatmap?.title || "Global Network Heatmap",
      isOpen: visibility.heatmap,
      setOpen: (v: boolean) => (v ? open("heatmap") : close("heatmap")),
      impact: "Medium",
      onUnload: () => unload("heatmap"),
      isLoaded: loadedModules.has("heatmap"),
    },
    {
      id: "rayTracing",
      name: t.rayTracing?.title || "WebGL Ray Tracing Test",
      isOpen: visibility.rayTracing,
      setOpen: (v: boolean) => (v ? open("rayTracing") : close("rayTracing")),
      impact: "High",
      onUnload: () => unload("rayTracing"),
      isLoaded: loadedModules.has("rayTracing"),
    },
    {
      id: "extensions",
      name: "Browser Extensions",
      isOpen: visibility.extensions,
      setOpen: (v: boolean) => (v ? open("extensions") : close("extensions")),
      impact: "Low",
      onUnload: () => unload("extensions"),
      isLoaded: loadedModules.has("extensions"),
    },
    {
      id: "networkTools",
      name: t.settings?.nav?.network || "Network Tools",
      isOpen: visibility.networkTools,
      setOpen: (v: boolean) => (v ? open("networkTools") : close("networkTools")),
      impact: "Medium",
      onUnload: () => unload("networkTools"),
      isLoaded: loadedModules.has("networkTools"),
    },
    {
      id: "displayTools",
      name: t.settings?.nav?.display || "Display Tools",
      isOpen: visibility.displayTools,
      setOpen: (v: boolean) => (v ? open("displayTools") : close("displayTools")),
      impact: "Low",
      onUnload: () => unload("displayTools"),
      isLoaded: loadedModules.has("displayTools"),
    },
    {
      id: "googleTranslate",
      name: t.common?.googleTranslate || "Google Translate",
      isOpen: visibility.googleTranslate,
      setOpen: (v: boolean) => (v ? open("googleTranslate") : close("googleTranslate")),
      impact: "Low",
      onUnload: () => unload("googleTranslate"),
      isLoaded: loadedModules.has("googleTranslate"),
    },
    {
      id: "audioLatency",
      name: t.audioLatencyProbing?.title || "Audio Output Latency & Channel Probing",
      isOpen: visibility.audioLatency,
      setOpen: (v: boolean) => (v ? open("audioLatency") : close("audioLatency")),
      impact: "Low",
      onUnload: () => unload("audioLatency"),
      isLoaded: loadedModules.has("audioLatency"),
    },
    {
      id: "poisoning",
      name: t.poisoning?.title || "Noise & Poisoning Detection",
      isOpen: visibility.poisoning,
      setOpen: (v: boolean) => (v ? open("poisoning") : close("poisoning")),
      impact: "Low",
      onUnload: () => unload("poisoning"),
      isLoaded: loadedModules.has("poisoning"),
    },
    {
      id: "ja3",
      name: t.ja3?.title || "JA3/JA4 Fingerprint",
      isOpen: visibility.ja3,
      setOpen: (v: boolean) => (v ? open("ja3") : close("ja3")),
      impact: "Low",
      onUnload: () => unload("ja3"),
      isLoaded: loadedModules.has("ja3"),
    },
    {
      id: "attributions",
      name: t.attributionsModal?.title || "Attributions",
      isOpen: visibility.attributions,
      setOpen: (v: boolean) => (v ? open("attributions") : close("attributions")),
      impact: "Low",
      onUnload: () => unload("attributions"),
      isLoaded: loadedModules.has("attributions"),
    },
    {
      id: "shortcuts",
      name: t.keyboardShortcutsModal?.title || "Keyboard Shortcuts",
      isOpen: visibility.shortcuts,
      setOpen: (v: boolean) => (v ? open("shortcuts") : close("shortcuts")),
      impact: "Low",
      onUnload: () => unload("shortcuts"),
      isLoaded: loadedModules.has("shortcuts"),
    },
  ];

  const initialDetectionRun = useRef(false);

  useEffect(() => {
    if (initialDetectionRun.current) return;
    initialDetectionRun.current = true;
    fetchData();
    checkPermissionStatus("notifications", "notifications");
    checkPermissionStatus("geolocation", "geolocation");
    checkPermissionStatus("camera", "camera");
    checkPermissionStatus("microphone", "microphone");
    checkPermissionStatus("midi", "midi");
  }, [fetchData, checkPermissionStatus]);

  const handleExportJSON = () => {
    if (!data) return;
    exportAsJson(data, permStatus, geoData);
  };

  const handleExportPDF = () => {
    if (!data) return;
    exportAsPdf(
      data,
      permStatus,
      geoData,
      t,
      lang,
      pdfExportFormat || 'a4',
      () => setIsExportingPdf(true),
      () => setIsExportingPdf(false),
      (err) => {
        setIsExportingPdf(false);
        alert(`PDF Export Error: ${err}`);
      }
    );
  };

  const handleExportImage = () => {
    if (!data) return;
    exportAsImage(
      "dashboard-container",
      theme,
      imageExportScale || 2,
      () => setIsExportingImage(true),
      () => setIsExportingImage(false),
      (err) => {
        setIsExportingImage(false);
        alert(`Image Export Error: ${err}`);
      }
    );
  };

  useKeyboardShortcuts({
    lang,
    open,
    closeAll,
    toggleTheme,
    fetchData,
    handleExportJSON,
    handleExportPDF,
    handleExportImage,
    visibility,
  });

  if (!t || Object.keys(t).length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 flex items-center justify-center relative">
        <LoadingOverlay
          showLoader={true}
          fadeLoader={false}
          loadingText={lang === "zh-CN" || lang === "zh-TW" || lang === "zh-HK" ? "加载语言包中..." : "Loading language..."}
          isExportingPdf={false}
          isExportingImage={false}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 scrollbar-hide relative">
      <LoadingOverlay
        showLoader={showLoader}
        fadeLoader={fadeLoader}
        loadingText={loadingText}
        isExportingPdf={isExportingPdf}
        isExportingImage={isExportingImage}
        lang={lang}
      />

      <ModalContainer
        visibility={visibility}
        Components={Components}
        close={close}
        data={data}
        t={t}
        themeColor={themeColor}
        updateThemeColor={updateThemeColor}
        animationStyle={animationStyle}
        updateAnimationStyle={updateAnimationStyle}
        simpleMode={simpleMode}
        toggleSimpleMode={toggleSimpleMode}
        hideScrollbar={hideScrollbar}
        toggleHideScrollbar={toggleHideScrollbar}
        globalHideScrollbar={globalHideScrollbar}
        toggleGlobalHideScrollbar={toggleGlobalHideScrollbar}
        timeFormat={timeFormat}
        setTimeFormat={updateTimeFormat}
        disableBlur={disableBlur}
        toggleDisableBlur={toggleDisableBlur}
        disableAnimations={disableAnimations}
        toggleDisableAnimations={toggleDisableAnimations}
        fastAnimations={fastAnimations}
        toggleFastAnimations={toggleFastAnimations}
        collapseHeader={collapseHeader}
        toggleCollapseHeader={toggleCollapseHeader}
        enableUdp={enableUdp}
        toggleEnableUdp={toggleEnableUdp}
        showTabs={showTabs}
        toggleShowTabs={toggleShowTabs}
        showSearch={showSearch}
        toggleShowSearch={toggleShowSearch}
        searchScope={searchScope}
        updateSearchScope={updateSearchScope}
        searchMode={searchMode}
        updateSearchMode={updateSearchMode}
        hiddenCards={hiddenCards}
        setHiddenCards={updateHiddenCards}
        restoreAllNotifications={restoreAllNotifications}
        dismissedNotificationsCount={dismissedNotifications.length}
        showQuickSummary={showQuickSummary}
        toggleShowQuickSummary={toggleShowQuickSummary}
        lang={lang}
        changeLang={changeLang}
        isDevToolsFloating={isDevToolsFloating}
        setIsDevToolsFloating={setIsDevToolsFloating}
        modalStates={modalStates}
        appVersion={packageJson.version}
        updateServiceWorker={updateServiceWorker}
        manualCheckUpdate={manualCheckUpdate}
        lastCheckTime={lastCheckTime}
        isCheckingUpdate={isCheckingUpdate}
        needRefresh={needRefresh}
        developerTabTitle={developerTabTitle}
        imageExportScale={imageExportScale}
        updateImageExportScale={updateImageExportScale}
        pdfExportFormat={pdfExportFormat}
        updatePdfExportFormat={updatePdfExportFormat}
        bodyFont={bodyFont}
        updateBodyFont={updateBodyFont}
        modalTitleFont={modalTitleFont}
        updateModalTitleFont={updateModalTitleFont}
        codeFont={codeFont}
        updateCodeFont={updateCodeFont}
      />

      <div id="dashboard-container" className="max-w-7xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        <Header
          t={t}
          lang={lang}
          setLang={changeLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onRefresh={fetchData}
          onExport={handleExportJSON}
          onExportPdf={handleExportPDF}
          onExportImage={handleExportImage}
          onOpenSettings={() => open("settings")}
          onOpenAbout={() => open("about")}
          onOpenBenchmark={() => open("benchmark")}
          onOpenTranslate={() => open("googleTranslate")}
          collapseHeader={collapseHeader}
        />

        {/* Notifications */}
        {(isOffline ||
          (needRefresh && !dismissedNotifications.includes("update")) ||
          (isOutdated && !dismissedNotifications.includes("outdated")) ||
          (isViewportTooSmall && !dismissedNotifications.includes("viewport_small"))) ? (
          <div className="flex flex-col gap-4 w-full">
            {isOffline ? (
              <AppNotification
                type="error"
                title={t.common?.toasts?.offline_title || "Offline Mode"}
                message={t.common?.toasts?.offline_message || "You are currently offline. Accessing cached PWA resources; online features are unavailable."}
              />
            ) : null}
            {needRefresh && !dismissedNotifications.includes("update") ? (
              <AppNotification
                type="success"
                title={t.environment?.notifications?.update?.title || "Update Available"}
                message={t.environment?.notifications?.update?.message || "A new version of BrowserScope is available."}
                action={{
                  label: t.environment?.notifications?.update?.action || "Update Now",
                  onClick: () => updateServiceWorker(true),
                }}
                onClose={() => {
                  dismissNotification("update");
                }}
              />
            ) : null}
            {isOutdated && !dismissedNotifications.includes("outdated") ? (
              <AppNotification
                type="warning"
                title={t.environment?.notifications?.outdated?.title || "Legacy Browser Detected"}
                message={
                  t.environment?.notifications?.outdated?.message ||
                  "Your browser version is too old. Some advanced scanning features might be unavailable or inaccurate."
                }
                onClose={() => {
                  dismissNotification("outdated");
                }}
              />
            ) : null}
            {isViewportTooSmall && !dismissedNotifications.includes("viewport_small") ? (
              <AppNotification
                type="warning"
                title={t.environment?.notifications?.viewport_small?.title || "Display Area Too Small"}
                message={
                  t.environment?.notifications?.viewport_small?.message ||
                  "The current screen display area is too small. Some layouts, charts, or features may have display issues or become difficult to interact with."
                }
                onClose={() => {
                  dismissNotification("viewport_small");
                }}
              />
            ) : null}
          </div>
        ) : null}

        {/* Main Content - Only render if data exists */}
        {data && Object.keys(data).length > 0 ? (
          <ErrorBoundary name="MainContent">
            <SearchBarAndTabs
              showSearch={showSearch}
              showTabs={showTabs}
              showSearchSettings={showSearchSettings}
              setShowSearchSettings={setShowSearchSettings}
              handleSearch={handleSearch}
              searchScope={searchScope}
              updateSearchScope={updateSearchScope}
              searchMode={searchMode}
              updateSearchMode={updateSearchMode}
              availableTabs={availableTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSlideDirection={setSlideDirection}
              tabsContainerRef={tabsContainerRef}
              activeTabRef={activeTabRef}
              themeColor={themeColor}
              t={t}
            />

            <DashboardGrid
              browserData={browserData}
              t={t}
              lang={lang}
              themeColor={themeColor}
              timeFormat={timeFormat}
              simpleMode={simpleMode}
              hiddenCards={hiddenCards}
              matchedCardIds={matchedCardIds}
              activeTab={activeTab}
              geoData={geoData}
              permStatus={permStatus}
              open={open}
              requestPermission={requestPermission}
              handleAiRetest={handleAiRetest}
              showQuickSummary={showQuickSummary}
              toggleShowQuickSummary={toggleShowQuickSummary}
              initialAnimationStyle={initialAnimationStyle}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          </ErrorBoundary>
        ) : null}

        <Footer
          text={t?.meta?.footer}
          onOpenAttributions={() => open("attributions")}
          label={t.attributionsModal?.title || "Attributions"}
        />

        <BackToTop label={t.common?.backToTop || "Back to Top"} />
      </div>
    </div>
  );
};

export default App;
