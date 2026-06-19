import React, { useEffect, useState, Suspense, useRef } from "react";
import { Monitor, Smartphone, ShieldAlert, Cpu, Loader2 } from "lucide-react";
import { exportAsJson } from "./services/exporter";
import { translations } from "./utils/i18n/index";
import { FloatingWindow } from "./components/ui/FloatingWindow";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ModalLoading } from "./components/ui/ModalLoading";
import { SectionGroup } from "./components/ui/SectionGroup";
import { useModalManager } from "./hooks/useModalManager";

import { AppNotification } from "./components/ui/AppNotification";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { BrowserCard } from "./components/cards/BrowserCard";
import { EnvironmentCard } from "./components/cards/EnvironmentCard";
import { SystemCard } from "./components/cards/SystemCard";
import { HardwareCard } from "./components/cards/HardwareCard";
import { DisplayCard } from "./components/cards/DisplayCard";
import { QuickSummaryWidget } from "./components/sections/QuickSummaryWidget";

const SecurityCard = React.lazy(() =>
  import("./components/cards/SecurityCard").then((m) => ({
    default: m.SecurityCard,
  })),
);
const AiComputeCard = React.lazy(() =>
  import("./components/cards/AiComputeCard").then((m) => ({
    default: m.AiComputeCard,
  })),
);
const FingerprintCard = React.lazy(() =>
  import("./components/cards/FingerprintCard").then((m) => ({
    default: m.FingerprintCard,
  })),
);
const NetworkCard = React.lazy(() =>
  import("./components/cards/NetworkCard").then((m) => ({
    default: m.NetworkCard,
  })),
);
const StorageCard = React.lazy(() =>
  import("./components/cards/StorageCard").then((m) => ({
    default: m.StorageCard,
  })),
);
const LocationCard = React.lazy(() =>
  import("./components/cards/LocationCard").then((m) => ({
    default: m.LocationCard,
  })),
);
const PermissionsCard = React.lazy(() =>
  import("./components/cards/PermissionsCard").then((m) => ({
    default: m.PermissionsCard,
  })),
);
const MediaDevicesCard = React.lazy(() =>
  import("./components/cards/MediaDevicesCard").then((m) => ({
    default: m.MediaDevicesCard,
  })),
);
const MediaCapabilitiesCard = React.lazy(() =>
  import("./components/cards/MediaCapabilitiesCard").then((m) => ({
    default: m.MediaCapabilitiesCard,
  })),
);
const UserAgentCard = React.lazy(() =>
  import("./components/cards/UserAgentCard").then((m) => ({
    default: m.UserAgentCard,
  })),
);
const PwaSection = React.lazy(() =>
  import("./components/sections/PwaSection").then((m) => ({
    default: m.PwaSection,
  })),
);
const FeaturesSection = React.lazy(() =>
  import("./components/sections/FeaturesSection").then((m) => ({
    default: m.FeaturesSection,
  })),
);
import { ModuleState } from "./components/settings/ModulesTab";

import { useAppSettings } from "./hooks/useAppSettings";
import {
  useAppPermissions,
  PermissionKey,
  PermissionStatusType,
} from "./hooks/useAppPermissions";
import { useAppData } from "./hooks/useAppData";
import packageJson from "./package.json";

const App: React.FC = () => {
  const { visibility, open, close, unload, loadedModules, Components } =
    useModalManager();

  const [activeTab, setActiveTab] = useState<"all" | "browser" | "environment" | "system" | "network" | "advanced">("all");

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
    hiddenCards,
    updateHiddenCards,
  } = useAppSettings();

  const t = translations[lang];

  const swReg = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now());
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered');
      if (r) {
        swReg.current = r;
        setInterval(() => {
          r.update();
          setLastCheckTime(Date.now());
        }, 60 * 60 * 1000); // 1 hour check
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    const handleVisibility = () => {
      // Check for updates automatically when user returns to app
      // Throttle checking to not happen more than once every 10 mins
      if (document.visibilityState === 'visible' && swReg.current) {
        if (Date.now() - lastCheckTime > 10 * 60 * 1000) {
          swReg.current.update();
          setLastCheckTime(Date.now());
        }
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => window.removeEventListener('visibilitychange', handleVisibility);
  }, [lastCheckTime]);

  const manualCheckUpdate = async () => {
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

  const {
    data,
    showLoader,
    fadeLoader,
    loadingText,
    fetchData,
    handleAiRetest,
  } = useAppData(t.common.loading_steps || [t.common.loading]);

  const [isOutdated, setIsOutdated] = useState(false);
  useEffect(() => {
    if (data && data.system && data.system.browserName && data.system.browserVersion) {
      const name = data.system.browserName.toLowerCase();
      const version = parseInt(data.system.browserVersion, 10);
      if (!isNaN(version)) {
        if (name.includes('chrome') && version < 100) setIsOutdated(true);
        if (name.includes('firefox') && version < 100) setIsOutdated(true);
        if (name.includes('safari') && version < 15) setIsOutdated(true);
        if (name.includes('edge') && version < 100) setIsOutdated(true);
      }
    }
  }, [data]);

  const { permStatus, geoData, checkPermissionStatus, requestPermission } =
    useAppPermissions((modalId) => open(modalId as any /* eslint-disable-line @typescript-eslint/no-explicit-any */));

  const [isDevToolsFloating, setIsDevToolsFloating] = useState(false);

  const settingsTitle = t.settings?.title;
  const developerTabTitle = t.settings?.nav?.developer;

  const modalStates: any[] = [
    {
      id: "settings",
      name: settingsTitle,
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
  ];

  useEffect(() => {
    fetchData();
    checkPermissionStatus("notifications", "notifications");
    checkPermissionStatus("geolocation", "geolocation");
    checkPermissionStatus("camera", "camera");
    checkPermissionStatus("microphone", "microphone");
    checkPermissionStatus("midi", "midi");
  }, [fetchData]);

  const handleExportJSON = () => {
    if (!data) return;
    exportAsJson(data, permStatus, geoData);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 scrollbar-hide relative">
      {/* Loading Overlay */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ease-out backdrop-blur-xl ${
            fadeLoader ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
            backgroundColor: "rgba(var(--bg-slate-50), 0.8)",
          }}
        >
          <div
            className={`bg-white/80 dark:bg-slate-800/80 p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col items-center gap-6 max-w-sm w-full mx-4 backdrop-blur-md transition-all duration-500 ease-out transform ${
              fadeLoader ? "scale-95 translate-y-4" : "scale-100 translate-y-0"
            }`}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="text-indigo-500" size={24} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                BrowserScope
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse font-mono">
                {loadingText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lazy Loaded Modals wrapped in Suspense and ErrorBoundary */}
      <ErrorBoundary name="Modals">
        <Suspense
          fallback={
            <ModalLoading
              initializingText={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).common?.modal_loading?.initializing}
              loadingText={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).common?.modal_loading?.loading_module}
            />
          }
        >
          {isDevToolsFloating && (
            <FloatingWindow
              title={developerTabTitle}
              onClose={() => setIsDevToolsFloating(false)}
              initialWidth={600}
              initialHeight={400}
            >
              <Components.developer
                t={t.settings.developer}
                isFloating={true}
                toggleFloat={() => setIsDevToolsFloating(false)}
              />
            </FloatingWindow>
          )}

          {visibility.camera && (
            <Components.camera
              onClose={() => close("camera")}
              t={t.cameraTool}
            />
          )}
          {visibility.audio && (
            <Components.audio onClose={() => close("audio")} t={t.audioTool} />
          )}
          {visibility.webgl && (
            <Components.webgl
              extensions={data?.fingerprints.webglExtensions || []}
              onClose={() => close("webgl")}
              t={t.webglTool}
            />
          )}
          {visibility.canvas && (
            <Components.canvas
              imageSrc={data?.fingerprints.canvasImage || ""}
              onClose={() => close("canvas")}
              t={t.imageDetails}
            />
          )}
          {visibility.base64 && (
            <Components.base64
              data={data?.fingerprints.canvasImage || ""}
              onClose={() => close("base64")}
              t={t.base64Tool}
            />
          )}
          {visibility.about && (
            <Components.about onClose={() => close("about")} t={t.aboutModal} />
          )}
          {visibility.sensor && (
            <Components.sensor
              onClose={() => close("sensor")}
              t={t.sensorModal}
            />
          )}
          {visibility.score && data && (
            <Components.score
              scoreData={data.fingerprints.score}
              onClose={() => close("score")}
              t={t.scoreModal}
            />
          )}
          {visibility.fingerprint && (
            <Components.fingerprint
              onClose={() => close("fingerprint")}
              t={t.fingerprintModal}
            />
          )}
          {visibility.speed && (
            <Components.speed onClose={() => close("speed")} t={t.speedTest} />
          )}
          {visibility.compute && (
            <Components.compute
              onClose={() => close("compute")}
              t={t.computeStress}
            />
          )}

          {visibility.settings && (
            <Components.settings
              onClose={() => close("settings")}
              t={
                t
              } /* Pass root translation object to support modular settings */
              themeColor={themeColor}
              setThemeColor={updateThemeColor}
              animationStyle={animationStyle}
              setAnimationStyle={updateAnimationStyle}
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
              hiddenCards={hiddenCards}
              setHiddenCards={updateHiddenCards}
              isDevToolsFloating={isDevToolsFloating}
              setDevToolsFloating={setIsDevToolsFloating}
              moduleStates={modalStates}
              appVersion={packageJson.version}
              updateServiceWorker={updateServiceWorker}
              manualCheckUpdate={manualCheckUpdate}
              lastCheckTime={lastCheckTime}
              isCheckingUpdate={isCheckingUpdate}
              needRefresh={needRefresh}
            />
          )}

          {visibility.benchmark && (
            <Components.benchmark
              onClose={() => close("benchmark")}
              t={t.benchmarkModal}
            />
          )}
          {visibility.tools && (
            <Components.tools
              onClose={() => close("tools")}
              t={t.hardwareToolsModal}
              values={t.values}
              labels={t.labels}
            />
          )}

          {visibility.ai && (
            <Components.ai onClose={() => close("ai")} t={t.aiPlayground} />
          )}
          {visibility.gamepad && (
            <Components.gamepad
              onClose={() => close("gamepad")}
              t={t.gamepadTool}
            />
          )}
          {visibility.webDevice && (
            <Components.webDevice
              onClose={() => close("webDevice")}
              t={t.webDevice}
            />
          )}
          {visibility.vision && (
            <Components.vision
              onClose={() => close("vision")}
              t={t.visionModal}
            />
          )}
          {visibility.video && (
            <Components.video
              onClose={() => close("video")}
              t={t.hardwareToolsModal}
              values={t.values}
              labels={t.labels}
            />
          )}
          {visibility.graphics && (
            <Components.graphics
              onClose={() => close("graphics")}
              t={t.graphicsModal}
            />
          )}
          {visibility.speech && (
            <Components.speech
              onClose={() => close("speech")}
              t={t.speechModal}
            />
          )}
          {visibility.midi && (
            <Components.midi onClose={() => close("midi")} t={t.midiModal} />
          )}
          {visibility.storageBench && (
            <Components.storageBench
              onClose={() => close("storageBench")}
              t={t.storageBenchmark}
            />
          )}
          {visibility.heatmap && (
            <Components.heatmap
              onClose={() => close("heatmap")}
              t={t.heatmap}
            />
          )}
          {visibility.rayTracing && (
            <Components.rayTracing
              onClose={() => close("rayTracing")}
              t={t.rayTracing}
            />
          )}
          {visibility.extensions && (
            <Components.extensions
              onClose={() => close("extensions")}
              t={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).extensionsModal}
            />
          )}
          {visibility.networkTools && (
            <Components.networkTools
              onClose={() => close("networkTools")}
              t={t}
              enableUdp={enableUdp}
            />
          )}
          {visibility.displayTools && (
            <Components.displayTools
              onClose={() => close("displayTools")}
              t={t}
            />
          )}
          {visibility.googleTranslate && (
            <Components.googleTranslate
              onClose={() => close("googleTranslate")}
              t={t}
            />
          )}
        </Suspense>
      </ErrorBoundary>

      <div className="max-w-7xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        <Header
          t={t}
          lang={lang}
          setLang={changeLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onRefresh={fetchData}
          onExport={handleExportJSON}
          onOpenSettings={() => open("settings")}
          onOpenAbout={() => open("about")}
          onOpenBenchmark={() => open("benchmark")}
          onOpenTranslate={() => open("googleTranslate")}
          collapseHeader={collapseHeader}
        />

        {/* Notifications */}
        {(needRefresh || isOutdated) && (
          <div className="flex flex-col gap-4 w-full">
            {needRefresh && (
              <AppNotification 
                type="success"
                title={(t as any).notifications?.update?.title || "Update Available"}
                message={(t as any).notifications?.update?.message || "A new version of BrowserScope is available."}
                action={{
                  label: (t as any).notifications?.update?.action || "Update Now",
                  onClick: () => updateServiceWorker(true)
                }}
                onClose={() => setNeedRefresh(false)}
              />
            )}

            {isOutdated && (
              <AppNotification 
                type="warning"
                title={(t as any).notifications?.outdated?.title || "Legacy Browser Detected"}
                message={(t as any).notifications?.outdated?.message || "Your browser version is too old. Some advanced scanning features might be unavailable or inaccurate."}
                onClose={() => setIsOutdated(false)}
              />
            )}
          </div>
        )}

        {/* Main Content - Only render if data exists */}
        {data && (
          <ErrorBoundary name="MainContent">
            
            {/* Navigation Tabs */}
            {showTabs && (() => {
              const availableTabs: { id: string; label: string; icon: React.ReactNode }[] = [
                { id: "all", label: (t as any).groups?.all || "All", icon: null }
              ];
              
              if (!hiddenCards.includes("browser")) {
                availableTabs.push({ id: "browser", label: (t as any).groups?.browser || "Browser", icon: <Monitor size={16} /> });
              }
              if (!hiddenCards.includes("environment")) {
                availableTabs.push({ id: "environment", label: (t as any).groups?.environment || "Environment", icon: <ShieldAlert size={16} /> });
              }
              if (!(hiddenCards.includes("system") && hiddenCards.includes("hardware") && hiddenCards.includes("display"))) {
                availableTabs.push({ id: "system", label: (t as any).groups?.system || "System", icon: <Smartphone size={16} /> });
              }
              if (!(hiddenCards.includes("network") && hiddenCards.includes("security") && hiddenCards.includes("fingerprint"))) {
                availableTabs.push({ id: "network", label: (t as any).groups?.network || "Network", icon: <ShieldAlert size={16} /> });
              }
              if (!(hiddenCards.includes("ai") && hiddenCards.includes("location") && hiddenCards.includes("storage") && hiddenCards.includes("permissions") && hiddenCards.includes("media_devices") && hiddenCards.includes("media_capabilities") && hiddenCards.includes("user_agent") && hiddenCards.includes("pwa") && hiddenCards.includes("features"))) {
                availableTabs.push({ id: "advanced", label: (t as any).groups?.advanced || "Advanced", icon: <Cpu size={16} /> });
              }

              if (availableTabs.length <= 1) return null;

              // Ensure active tab is valid
              if (activeTab !== "all" && !availableTabs.some(tab => tab.id === activeTab)) {
                 setActiveTab("all");
              }

              return (
                <div className="sticky top-0 z-20 pt-4 -mt-4 bg-[#f8fafc]/90 dark:bg-slate-900/90 backdrop-blur-md flex space-x-2 mb-6 overflow-x-auto scrollbar-hide pb-2 border-b border-slate-200 dark:border-slate-800">
                  {availableTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap text-sm font-medium ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              );
            })()}

            <Suspense
              fallback={
                <div className="flex justify-center p-12">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
              }
            >
              <div
                className={`space-y-6 ${initialAnimationStyle === "slide-up" ? "anim-slide-up" : initialAnimationStyle === "fade" ? "anim-fade" : initialAnimationStyle === "fly-in" ? "anim-fly-in" : initialAnimationStyle === "zoom" ? "anim-zoom" : ""}`}
              >
                {activeTab === "all" && <QuickSummaryWidget data={data} t={t} />}

                {/* Group 0: Environment & Trust */}
                {!hiddenCards.includes("environment") && (activeTab === "all" || activeTab === "environment") && (
                  <SectionGroup
                    title={
                      (t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).groups?.environment || "Environment & Trust"
                    }
                    icon={<ShieldAlert className="text-emerald-500" />}
                  >
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <EnvironmentCard t={t} />
                    </div>
                  </SectionGroup>
                )}

                {/* Group 00: Browser Identity */}
                {!hiddenCards.includes("browser") && (activeTab === "all" || activeTab === "browser") && (
                  <SectionGroup
                    title={
                      (t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).groups?.browser || "Browser"
                    }
                    icon={<Monitor className="text-indigo-500" />}
                  >
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <BrowserCard systemData={data.system} t={t} />
                    </div>
                  </SectionGroup>
                )}

                {/* Group 1: Device & System */}
                {(!hiddenCards.includes("system") ||
                  !hiddenCards.includes("hardware") ||
                  !hiddenCards.includes("display")) && (activeTab === "all" || activeTab === "system") && (
                  <SectionGroup
                    title={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).groups?.system || "Device & System Core"}
                    icon={<Smartphone className="text-indigo-500" />}
                  >
                    {!hiddenCards.includes("system") && (
                      <SystemCard
                        data={data.system}
                        t={t}
                        simpleMode={simpleMode}
                        lang={lang}
                      />
                    )}

                    {!hiddenCards.includes("hardware") && (
                      <HardwareCard
                        data={data.hardware}
                        t={t}
                        onOpenGamepad={() => open("gamepad")}
                        onOpenWebDevice={() => open("webDevice")}
                        onOpenSensors={() => open("sensor")}
                        onOpenTools={() => open("tools")}
                        onOpenVision={() => open("vision")}
                        onOpenGraphics={() => open("graphics")}
                        onOpenMidi={() => requestPermission("midi")}
                      />
                    )}

                    {!hiddenCards.includes("display") && (
                      <DisplayCard
                        data={data.display}
                        screenExtended={data.hardware.screenExtended}
                        t={t}
                        simpleMode={simpleMode}
                      />
                    )}
                  </SectionGroup>
                )}

                {/* Group 2: Network & Security */}
                {(!hiddenCards.includes("network") ||
                  !hiddenCards.includes("security") ||
                  !hiddenCards.includes("fingerprint")) && (activeTab === "all" || activeTab === "network") && (
                  <SectionGroup
                    title={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).groups?.network || "Network & Security"}
                    icon={<ShieldAlert className="text-emerald-500" />}
                  >
                    {!hiddenCards.includes("network") && (
                      <NetworkCard
                        data={data.network}
                        t={t}
                        simpleMode={simpleMode}
                        onOpenSpeedTest={() => open("speed")}
                      />
                    )}

                    {!hiddenCards.includes("security") && (
                      <SecurityCard
                        data={data.security}
                        webrtcIp={data.network.webrtcIp}
                        t={t}
                        simpleMode={simpleMode}
                        onOpenExtensions={() => open("extensions")}
                      />
                    )}

                    {!hiddenCards.includes("fingerprint") && (
                      <FingerprintCard
                        data={data.fingerprints}
                        audioSampleRate={data.hardware.audioSampleRate}
                        t={t}
                        simpleMode={simpleMode}
                        onOpenScore={() => open("score")}
                        onOpenCanvas={() => open("canvas")}
                        onOpenBase64={() => open("base64")}
                        onOpenWebgl={() => open("webgl")}
                        onOpenFingerprintModal={() => open("fingerprint")}
                      />
                    )}
                  </SectionGroup>
                )}

                {/* Group 3: Advanced Capabilities & APIs */}
                {(!hiddenCards.includes("ai") ||
                  !hiddenCards.includes("location") ||
                  !hiddenCards.includes("storage") ||
                  !hiddenCards.includes("permissions") ||
                  !hiddenCards.includes("media_devices") ||
                  !hiddenCards.includes("media_capabilities") ||
                  !hiddenCards.includes("user_agent")) && (activeTab === "all" || activeTab === "advanced") && (
                  <SectionGroup
                    title={(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).groups?.advanced || "Capabilities & APIs"}
                    icon={<Cpu className="text-amber-500" />}
                  >
                    {!hiddenCards.includes("ai") && (
                      <AiComputeCard
                        data={data.ai}
                        t={t}
                        onOpenPlayground={() => open("ai")}
                        onOpenStress={() => open("compute")}
                        onRetest={handleAiRetest}
                      />
                    )}

                    {!hiddenCards.includes("location") && (
                      <LocationCard
                        data={data.localization}
                        geoData={geoData}
                        permStatus={permStatus.geolocation}
                        t={t}
                        onRequestPermission={() =>
                          requestPermission("geolocation")
                        }
                        timeFormat={timeFormat}
                        lang={lang}
                      />
                    )}

                    {!hiddenCards.includes("storage") && (
                      <StorageCard data={data.storage} t={t} />
                    )}

                    {!hiddenCards.includes("permissions") && (
                      <PermissionsCard
                        permStatus={permStatus}
                        geoData={geoData}
                        t={t}
                        onRequestPermission={requestPermission}
                      />
                    )}

                    {!hiddenCards.includes("media_devices") && (
                      <MediaDevicesCard
                        permStatus={permStatus}
                        t={t}
                        onRequestPermission={requestPermission}
                        onOpenCamera={() => open("camera")}
                        onOpenMic={() => open("audio")}
                      />
                    )}

                    {!hiddenCards.includes("media_capabilities") && (
                      <MediaCapabilitiesCard
                        data={data.media}
                        t={t}
                        onOpenVideoTest={() => open("video")}
                        onOpenSpeech={() => open("speech")}
                      />
                    )}

                    {!hiddenCards.includes("user_agent") && (
                      <UserAgentCard
                        userAgent={data.system.userAgent}
                        clientHints={data.system.clientHints}
                        t={t}
                      />
                    )}
                  </SectionGroup>
                )}

                {!hiddenCards.includes("pwa") && (activeTab === "all" || activeTab === "advanced") && (
                  <div className="anim-slide-up delay-100">
                    <PwaSection
                      isPwaInstalled={data.system.isPwaInstalled}
                      features={data.pwaFeatures}
                      t={t}
                    />
                  </div>
                )}

                {!hiddenCards.includes("features") && (activeTab === "all" || activeTab === "advanced") && (
                  <div className="anim-slide-up delay-200">
                    <FeaturesSection features={data.features} t={t} />
                  </div>
                )}
              </div>
            </Suspense>
          </ErrorBoundary>
        )}

        <Footer text={t.meta.footer} />
      </div>
    </div>
  );
};
export default App;
