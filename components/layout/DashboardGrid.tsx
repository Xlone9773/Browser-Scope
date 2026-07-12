import React, { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Monitor, Smartphone, Cpu, Search, Loader2 } from "lucide-react";

import { SectionGroup } from "../ui/SectionGroup";
import { QuickSummaryWidget } from "../sections/QuickSummaryWidget";
import { EnvironmentCard } from "../cards/EnvironmentCard";
import { BrowserCard } from "../cards/BrowserCard";
import { SystemCard } from "../cards/SystemCard";
import { HardwareCard } from "../cards/HardwareCard";
import { DisplayCard } from "../cards/DisplayCard";
import { BrowserData } from "../../types";
import { Language } from "../../utils/i18n/types";
import { PermissionKey } from "../../hooks/useAppPermissions";
type BrowserSafeAny = ReturnType<typeof JSON.parse>;

// Helper for resilient lazy loading with retry
const ModuleLoadErrorFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl text-center">
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        Failed to load this module.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 text-xs font-semibold px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
};

function lazyWithRetry<T extends React.ComponentType<BrowserSafeAny>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 500
): React.LazyExoticComponent<T> {
  return lazy(() =>
    (importFn().catch((_error) => {
      return new Promise<{ default: T }>((resolve) => {
        let attempts = 0;
        const attemptLoad = () => {
          importFn()
            .then(resolve)
            .catch((err) => {
              attempts++;
              if (attempts >= retries) {
                console.error("Critical: Failed to load module dynamically after multiple retries. Falling back to error fallback component.", err);
                resolve({ default: ModuleLoadErrorFallback as unknown as T });
              } else {
                setTimeout(attemptLoad, delay);
              }
            });
        };
        setTimeout(attemptLoad, delay);
      });
    }) as unknown) as Promise<{ default: React.ComponentType<BrowserSafeAny> }>
  ) as unknown as React.LazyExoticComponent<T>;
}

// Lazy loaded cards
const SecurityCard = lazyWithRetry(() =>
  import("../cards/SecurityCard").then((m) => ({ default: m.SecurityCard }))
);
const AiComputeCard = lazyWithRetry(() =>
  import("../cards/AiComputeCard").then((m) => ({ default: m.AiComputeCard }))
);
const FingerprintCard = lazyWithRetry(() =>
  import("../cards/FingerprintCard").then((m) => ({ default: m.FingerprintCard }))
);
const NetworkCard = lazyWithRetry(() =>
  import("../cards/NetworkCard").then((m) => ({ default: m.NetworkCard }))
);
const StorageCard = lazyWithRetry(() =>
  import("../cards/StorageCard").then((m) => ({ default: m.StorageCard }))
);
const LocationCard = lazyWithRetry(() =>
  import("../cards/LocationCard").then((m) => ({ default: m.LocationCard }))
);
const PermissionsCard = lazyWithRetry(() =>
  import("../cards/PermissionsCard").then((m) => ({ default: m.PermissionsCard }))
);
const MediaDevicesCard = lazyWithRetry(() =>
  import("../cards/MediaDevicesCard").then((m) => ({ default: m.MediaDevicesCard }))
);
const MediaCapabilitiesCard = lazyWithRetry(() =>
  import("../cards/MediaCapabilitiesCard").then((m) => ({ default: m.MediaCapabilitiesCard }))
);
const UserAgentCard = lazyWithRetry(() =>
  import("../cards/UserAgentCard").then((m) => ({ default: m.UserAgentCard }))
);
const PwaSection = lazyWithRetry(() =>
  import("../sections/PwaSection").then((m) => ({ default: m.PwaSection }))
);
const FeaturesSection = lazyWithRetry(() =>
  import("../sections/FeaturesSection").then((m) => ({ default: m.FeaturesSection }))
);

interface DashboardGridProps {
  browserData: BrowserData;
  t: BrowserSafeAny;
  lang: Language;
  themeColor: string;
  timeFormat: "12" | "24";
  simpleMode: boolean;
  hiddenCards: string[];
  matchedCardIds: string[] | null;
  activeTab: "all" | "browser" | "environment" | "system" | "network" | "advanced";
  geoData: BrowserSafeAny;
  permStatus: BrowserSafeAny;
  open: (id: string) => void;
  requestPermission: (id: PermissionKey) => void | Promise<void>;
  handleAiRetest: () => void;
  showQuickSummary: boolean;
  toggleShowQuickSummary: (show: boolean) => void;
  initialAnimationStyle: string;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = React.memo(({
  browserData,
  t,
  lang,
  timeFormat,
  simpleMode,
  hiddenCards,
  matchedCardIds,
  activeTab,
  geoData,
  permStatus,
  open,
  requestPermission,
  handleAiRetest,
  showQuickSummary,
  toggleShowQuickSummary,
  initialAnimationStyle,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      }
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="overflow-hidden"
      >
        <div
          className={`space-y-6 ${
            initialAnimationStyle === "slide-up"
              ? "anim-slide-up"
              : initialAnimationStyle === "fade"
              ? "anim-fade"
              : initialAnimationStyle === "fly-in"
              ? "anim-fly-in"
              : initialAnimationStyle === "zoom"
              ? "anim-zoom"
              : ""
          }`}
        >
          {/* Quick Summary Widget */}
          <motion.div
            initial={false}
            animate={
              activeTab === "all" && matchedCardIds === null && showQuickSummary
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <QuickSummaryWidget
              data={browserData}
              t={t}
              onClose={() => toggleShowQuickSummary(false)}
            />
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={false}
            animate={
              matchedCardIds !== null && matchedCardIds.length === 0
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {t.search?.no_results || "No matching categories or cards found."}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                {lang === "zh-CN"
                  ? "请尝试使用其他关键词，或调整您的搜索范围。"
                  : "Try using different keywords or adjusting your search scope."}
              </p>
            </div>
          </motion.div>

          {/* Group 0: Environment & Trust */}
          <motion.div
            initial={false}
            animate={
              !hiddenCards.includes("environment") &&
              (activeTab === "all" || activeTab === "environment") &&
              (matchedCardIds === null || matchedCardIds.includes("environment"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SectionGroup
              title={t.groups?.environment || "Environment & Trust"}
              icon={<ShieldAlert className="text-emerald-500" />}
            >
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <EnvironmentCard t={t} />
              </div>
            </SectionGroup>
          </motion.div>

          {/* Group 00: Browser Identity */}
          <motion.div
            initial={false}
            animate={
              !hiddenCards.includes("browser") &&
              (activeTab === "all" || activeTab === "browser") &&
              (matchedCardIds === null || matchedCardIds.includes("browser"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SectionGroup
              title={t.groups?.browser || "Browser"}
              icon={<Monitor className="text-indigo-500" />}
            >
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <BrowserCard systemData={browserData.system} t={t} />
              </div>
            </SectionGroup>
          </motion.div>

          {/* Group 1: Device & System */}
          <motion.div
            initial={false}
            animate={
              (!hiddenCards.includes("system") ||
                !hiddenCards.includes("hardware") ||
                !hiddenCards.includes("display")) &&
              (activeTab === "all" || activeTab === "system") &&
              (matchedCardIds === null ||
                matchedCardIds.includes("system") ||
                matchedCardIds.includes("hardware") ||
                matchedCardIds.includes("display"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SectionGroup
              title={t.groups?.system || "Device & System Core"}
              icon={<Smartphone className="text-indigo-500" />}
            >
              {!hiddenCards.includes("system") &&
              (matchedCardIds === null || matchedCardIds.includes("system")) ? (
                <SystemCard
                  data={browserData.system}
                  t={t}
                  simpleMode={simpleMode}
                  lang={lang}
                />
              ) : null}

              {!hiddenCards.includes("hardware") &&
              (matchedCardIds === null || matchedCardIds.includes("hardware")) ? (
                <HardwareCard
                  data={browserData.hardware}
                  t={t}
                  onOpenGamepad={() => open("gamepad")}
                  onOpenWebDevice={() => open("webDevice")}
                  onOpenSensors={() => open("sensor")}
                  onOpenTools={() => open("tools")}
                  onOpenVision={() => open("vision")}
                  onOpenGraphics={() => open("graphics")}
                  onOpenMidi={() => requestPermission("midi")}
                />
              ) : null}

              {!hiddenCards.includes("display") &&
              (matchedCardIds === null || matchedCardIds.includes("display")) ? (
                <DisplayCard
                  data={browserData.display}
                  screenExtended={browserData.hardware.screenExtended}
                  t={t}
                  simpleMode={simpleMode}
                />
              ) : null}
            </SectionGroup>
          </motion.div>

          {/* Group 2: Network & Security */}
          <motion.div
            initial={false}
            animate={
              (!hiddenCards.includes("network") ||
                !hiddenCards.includes("security") ||
                !hiddenCards.includes("fingerprint")) &&
              (activeTab === "all" || activeTab === "network") &&
              (matchedCardIds === null ||
                matchedCardIds.includes("network") ||
                matchedCardIds.includes("security") ||
                matchedCardIds.includes("fingerprint"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SectionGroup
              title={t.groups?.network || "Network & Security"}
              icon={<ShieldAlert className="text-emerald-500" />}
            >
              {!hiddenCards.includes("network") &&
              (matchedCardIds === null || matchedCardIds.includes("network")) ? (
                <NetworkCard
                  data={browserData.network}
                  t={t}
                  simpleMode={simpleMode}
                  onOpenSpeedTest={() => open("speed")}
                />
              ) : null}

              {!hiddenCards.includes("security") &&
              (matchedCardIds === null || matchedCardIds.includes("security")) ? (
                <SecurityCard
                  data={browserData.security}
                  webrtcIp={browserData.network.webrtcIp}
                  t={t}
                  simpleMode={simpleMode}
                  onOpenExtensions={() => open("extensions")}
                />
              ) : null}

              {!hiddenCards.includes("fingerprint") &&
              (matchedCardIds === null || matchedCardIds.includes("fingerprint")) ? (
                <FingerprintCard
                  data={browserData.fingerprints}
                  audioSampleRate={browserData.hardware.audioSampleRate}
                  t={t}
                  simpleMode={simpleMode}
                  onOpenScore={() => open("score")}
                  onOpenCanvas={() => open("canvas")}
                  onOpenBase64={() => open("base64")}
                  onOpenWebgl={() => open("webgl")}
                  onOpenFingerprintModal={() => open("fingerprint")}
                  onOpenAudioLatency={() => open("audioLatency")}
                  onOpenPoisoning={() => open("poisoning")}
                  onOpenJa3={() => open("ja3")}
                />
              ) : null}
            </SectionGroup>
          </motion.div>

          {/* Group 3: Advanced Capabilities & APIs */}
          <motion.div
            initial={false}
            animate={
              (!hiddenCards.includes("ai") ||
                !hiddenCards.includes("location") ||
                !hiddenCards.includes("storage") ||
                !hiddenCards.includes("permissions") ||
                !hiddenCards.includes("media_devices") ||
                !hiddenCards.includes("media_capabilities") ||
                !hiddenCards.includes("user_agent")) &&
              (activeTab === "all" || activeTab === "advanced") &&
              (matchedCardIds === null ||
                matchedCardIds.includes("ai") ||
                matchedCardIds.includes("location") ||
                matchedCardIds.includes("storage") ||
                matchedCardIds.includes("permissions") ||
                matchedCardIds.includes("media_devices") ||
                matchedCardIds.includes("media_capabilities") ||
                matchedCardIds.includes("user_agent"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SectionGroup
              title={t.groups?.advanced || "Capabilities & APIs"}
              icon={<Cpu className="text-amber-500" />}
            >
              {!hiddenCards.includes("ai") &&
              (matchedCardIds === null || matchedCardIds.includes("ai")) ? (
                <AiComputeCard
                  data={browserData.ai}
                  t={t}
                  onOpenPlayground={() => open("ai")}
                  onOpenStress={() => open("compute")}
                  onRetest={handleAiRetest}
                />
              ) : null}

              {!hiddenCards.includes("location") &&
              (matchedCardIds === null || matchedCardIds.includes("location")) ? (
                <LocationCard
                  data={browserData.localization}
                  geoData={geoData}
                  permStatus={permStatus.geolocation}
                  t={t}
                  onRequestPermission={() => requestPermission("geolocation")}
                  timeFormat={timeFormat}
                  lang={lang}
                />
              ) : null}

              {!hiddenCards.includes("storage") &&
              (matchedCardIds === null || matchedCardIds.includes("storage")) ? (
                <StorageCard data={browserData.storage} t={t} />
              ) : null}

              {!hiddenCards.includes("permissions") &&
              (matchedCardIds === null || matchedCardIds.includes("permissions")) ? (
                <PermissionsCard
                  permStatus={permStatus}
                  geoData={geoData}
                  t={t}
                  onRequestPermission={requestPermission}
                />
              ) : null}

              {!hiddenCards.includes("media_devices") &&
              (matchedCardIds === null || matchedCardIds.includes("media_devices")) ? (
                <MediaDevicesCard
                  permStatus={permStatus}
                  t={t}
                  onRequestPermission={requestPermission}
                  onOpenCamera={() => open("camera")}
                  onOpenMic={() => open("audio")}
                />
              ) : null}

              {!hiddenCards.includes("media_capabilities") &&
              (matchedCardIds === null ||
                matchedCardIds.includes("media_capabilities")) ? (
                <MediaCapabilitiesCard
                  data={browserData.media}
                  t={t}
                  onOpenVideoTest={() => open("video")}
                  onOpenSpeech={() => open("speech")}
                  onOpenAudioLatency={() => open("audioLatency")}
                />
              ) : null}

              {!hiddenCards.includes("user_agent") &&
              (matchedCardIds === null || matchedCardIds.includes("user_agent")) ? (
                <UserAgentCard
                  userAgent={browserData.system.userAgent}
                  clientHints={browserData.system.clientHints}
                  t={t}
                />
              ) : null}
            </SectionGroup>
          </motion.div>

          {/* PWA Section */}
          <motion.div
            initial={false}
            animate={
              !hiddenCards.includes("pwa") &&
              (activeTab === "all" || activeTab === "advanced") &&
              (matchedCardIds === null || matchedCardIds.includes("pwa"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="anim-slide-up delay-100">
              <PwaSection
                isPwaInstalled={browserData.system.isPwaInstalled}
                features={browserData.pwaFeatures}
                t={t}
              />
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={false}
            animate={
              !hiddenCards.includes("features") &&
              (activeTab === "all" || activeTab === "advanced") &&
              (matchedCardIds === null || matchedCardIds.includes("features"))
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : { opacity: 0, y: 15, scale: 0.98, transitionEnd: { display: "none" } }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="anim-slide-up delay-200">
              <FeaturesSection features={browserData.features} t={t} />
            </div>
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
});
