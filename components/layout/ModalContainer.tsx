import React, { Suspense } from "react";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { ModalLoading } from "../ui/ModalLoading";
import { FloatingWindow } from "../ui/FloatingWindow";
import { ModuleState } from "../settings/ModulesTab";
import { Translation, Language } from "../../utils/i18n/types";
import { BrowserData } from "../../types";

interface ModalContainerProps {
  visibility: Record<string, boolean>;
  Components: Record<string, React.ElementType>;
  close: (id: string) => void;
  data: BrowserData | null;
  t: Translation;
  themeColor: string;
  updateThemeColor: (color: string) => void;
  animationStyle: string;
  updateAnimationStyle: (style: string) => void;
  simpleMode: boolean;
  toggleSimpleMode: (mode: boolean) => void;
  hideScrollbar: boolean;
  toggleHideScrollbar: (hide: boolean) => void;
  globalHideScrollbar: boolean;
  toggleGlobalHideScrollbar: (hide: boolean) => void;
  timeFormat: "12" | "24";
  setTimeFormat: (format: "12" | "24") => void;
  disableBlur: boolean;
  toggleDisableBlur: (disable: boolean) => void;
  disableAnimations: boolean;
  toggleDisableAnimations: (disable: boolean) => void;
  fastAnimations: boolean;
  toggleFastAnimations: (fast: boolean) => void;
  collapseHeader: boolean;
  toggleCollapseHeader: (collapse: boolean) => void;
  enableUdp: boolean;
  toggleEnableUdp: (enable: boolean) => void;
  showTabs: boolean;
  toggleShowTabs: (show: boolean) => void;
  showSearch: boolean;
  toggleShowSearch: (show: boolean) => void;
  searchScope: "all" | "category" | "title" | "value";
  updateSearchScope: (scope: "all" | "category" | "title" | "value") => void;
  searchMode: "fuzzy" | "exact";
  updateSearchMode: (mode: "fuzzy" | "exact") => void;
  hiddenCards: string[];
  setHiddenCards: (cards: string[]) => void;
  restoreAllNotifications: () => void;
  dismissedNotificationsCount: number;
  showQuickSummary: boolean;
  toggleShowQuickSummary: (show: boolean) => void;
  lang: string;
  isDevToolsFloating: boolean;
  setIsDevToolsFloating: (floating: boolean) => void;
  modalStates: ModuleState[];
  appVersion: string;
  updateServiceWorker: (reload: boolean) => Promise<void>;
  manualCheckUpdate: () => Promise<string>;
  lastCheckTime: number;
  isCheckingUpdate: boolean;
  needRefresh: boolean;
  developerTabTitle: string;
  imageExportScale: number;
  updateImageExportScale: (value: number) => void;
  pdfExportFormat: 'a4' | 'letter' | 'legal';
  updatePdfExportFormat: (value: 'a4' | 'letter' | 'legal') => void;
  pdfExportFont: 'auto' | 'helvetica' | 'times' | 'courier';
  updatePdfExportFont: (value: 'auto' | 'helvetica' | 'times' | 'courier') => void;
  changeLang?: (lang: Language) => void;
  bodyFont: string;
  updateBodyFont: (font: string) => void;
  modalTitleFont: string;
  updateModalTitleFont: (font: string) => void;
  codeFont: string;
  updateCodeFont: (font: string) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visibility,
  Components,
  close,
  data,
  t,
  themeColor,
  updateThemeColor,
  animationStyle,
  updateAnimationStyle,
  simpleMode,
  toggleSimpleMode,
  hideScrollbar,
  toggleHideScrollbar,
  globalHideScrollbar,
  toggleGlobalHideScrollbar,
  timeFormat,
  setTimeFormat,
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
  setHiddenCards,
  restoreAllNotifications,
  dismissedNotificationsCount,
  showQuickSummary,
  toggleShowQuickSummary,
  lang,
  isDevToolsFloating,
  setIsDevToolsFloating,
  modalStates,
  appVersion,
  updateServiceWorker,
  manualCheckUpdate,
  lastCheckTime,
  isCheckingUpdate,
  needRefresh,
  developerTabTitle,
  imageExportScale,
  updateImageExportScale,
  pdfExportFormat,
  updatePdfExportFormat,
  pdfExportFont,
  updatePdfExportFont,
  changeLang,
  bodyFont,
  updateBodyFont,
  modalTitleFont,
  updateModalTitleFont,
  codeFont,
  updateCodeFont,
}) => {
  return (
    <ErrorBoundary name="Modals">
      <Suspense
        fallback={
          <ModalLoading
            initializingText={t.common?.modal_loading?.initializing}
            loadingText={t.common?.modal_loading?.loading_module}
          />
        }
      >
        {isDevToolsFloating ? (
          <FloatingWindow
            title={developerTabTitle}
            onClose={() => setIsDevToolsFloating(false)}
            initialWidth={600}
            initialHeight={400}
          >
            <Components.developer
              t={t.settings?.developer}
              isFloating={true}
              toggleFloat={() => setIsDevToolsFloating(false)}
            />
          </FloatingWindow>
        ) : null}

        {visibility.camera ? (
          <Components.camera onClose={() => close("camera")} t={t.cameraTool} />
        ) : null}

        {visibility.audio ? (
          <Components.audio onClose={() => close("audio")} t={t.audioTool} />
        ) : null}

        {visibility.webgl ? (
          <Components.webgl
            extensions={data?.fingerprints?.webglExtensions || []}
            onClose={() => close("webgl")}
            t={t.webglTool}
          />
        ) : null}

        {visibility.canvas ? (
          <Components.canvas
            imageSrc={data?.fingerprints?.canvasImage || ""}
            onClose={() => close("canvas")}
            t={t.imageDetails}
          />
        ) : null}

        {visibility.base64 ? (
          <Components.base64
            data={data?.fingerprints?.canvasImage || ""}
            onClose={() => close("base64")}
            t={t.base64Tool}
          />
        ) : null}

        {visibility.about ? (
          <Components.about onClose={() => close("about")} t={t.aboutModal} />
        ) : null}

        {visibility.sensor ? (
          <Components.sensor onClose={() => close("sensor")} t={t.sensorModal} />
        ) : null}

        {visibility.score && data ? (
          <Components.score
            scoreData={data.fingerprints?.score}
            onClose={() => close("score")}
            t={t.scoreModal}
          />
        ) : null}

        {visibility.fingerprint ? (
          <Components.fingerprint
            onClose={() => close("fingerprint")}
            t={t.fingerprintModal}
          />
        ) : null}

        {visibility.speed ? (
          <Components.speed onClose={() => close("speed")} t={t.speedTest} />
        ) : null}

        {visibility.compute ? (
          <Components.compute onClose={() => close("compute")} t={t.computeStress} />
        ) : null}

        {visibility.settings ? (
          <Components.settings
            onClose={() => close("settings")}
            t={t}
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
            setTimeFormat={setTimeFormat}
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
            setHiddenCards={setHiddenCards}
            restoreAllNotifications={restoreAllNotifications}
            dismissedNotificationsCount={dismissedNotificationsCount}
            showQuickSummary={showQuickSummary}
            toggleShowQuickSummary={toggleShowQuickSummary}
            lang={lang}
            isDevToolsFloating={isDevToolsFloating}
            setDevToolsFloating={setIsDevToolsFloating}
            moduleStates={modalStates}
            appVersion={appVersion}
            updateServiceWorker={updateServiceWorker}
            manualCheckUpdate={manualCheckUpdate}
            lastCheckTime={lastCheckTime}
            isCheckingUpdate={isCheckingUpdate}
            needRefresh={needRefresh}
            imageExportScale={imageExportScale}
            updateImageExportScale={updateImageExportScale}
            pdfExportFormat={pdfExportFormat}
            updatePdfExportFormat={updatePdfExportFormat}
            pdfExportFont={pdfExportFont}
            updatePdfExportFont={updatePdfExportFont}
            changeLang={changeLang}
            bodyFont={bodyFont}
            updateBodyFont={updateBodyFont}
            modalTitleFont={modalTitleFont}
            updateModalTitleFont={updateModalTitleFont}
            codeFont={codeFont}
            updateCodeFont={updateCodeFont}
          />
        ) : null}

        {visibility.benchmark ? (
          <Components.benchmark
            onClose={() => close("benchmark")}
            t={t.benchmarkModal}
          />
        ) : null}

        {visibility.tools ? (
          <Components.tools
            onClose={() => close("tools")}
            t={t.hardwareToolsModal}
            values={t.values}
            labels={t.labels}
          />
        ) : null}

        {visibility.ai ? (
          <Components.ai onClose={() => close("ai")} t={t.aiPlayground} />
        ) : null}

        {visibility.gamepad ? (
          <Components.gamepad onClose={() => close("gamepad")} t={t.gamepadTool} />
        ) : null}

        {visibility.webDevice ? (
          <Components.webDevice onClose={() => close("webDevice")} t={t.webDevice} />
        ) : null}

        {visibility.vision ? (
          <Components.vision onClose={() => close("vision")} t={t.visionModal} />
        ) : null}

        {visibility.video ? (
          <Components.video
            onClose={() => close("video")}
            t={t.hardwareToolsModal}
            values={t.values}
            labels={t.labels}
          />
        ) : null}

        {visibility.graphics ? (
          <Components.graphics
            onClose={() => close("graphics")}
            t={t.graphicsModal}
          />
        ) : null}

        {visibility.speech ? (
          <Components.speech onClose={() => close("speech")} t={t.speechModal} />
        ) : null}

        {visibility.midi ? (
          <Components.midi onClose={() => close("midi")} t={t.midiModal} />
        ) : null}

        {visibility.storageBench ? (
          <Components.storageBench
            onClose={() => close("storageBench")}
            t={t.storageBenchmark}
          />
        ) : null}

        {visibility.heatmap ? (
          <Components.heatmap onClose={() => close("heatmap")} t={t.heatmap} />
        ) : null}

        {visibility.rayTracing ? (
          <Components.rayTracing
            onClose={() => close("rayTracing")}
            t={t.rayTracing}
          />
        ) : null}

        {visibility.extensions ? (
          <Components.extensions
            onClose={() => close("extensions")}
            t={t.extensionsModal}
          />
        ) : null}

        {visibility.networkTools ? (
          <Components.networkTools
            onClose={() => close("networkTools")}
            t={t}
            enableUdp={enableUdp}
          />
        ) : null}

        {visibility.displayTools ? (
          <Components.displayTools onClose={() => close("displayTools")} t={t} />
        ) : null}

        {visibility.googleTranslate ? (
          <Components.googleTranslate
            onClose={() => close("googleTranslate")}
            t={t}
          />
        ) : null}

        {visibility.audioLatency ? (
          <Components.audioLatency
            onClose={() => close("audioLatency")}
            t={t}
          />
        ) : null}

        {visibility.poisoning ? (
          <Components.poisoning onClose={() => close("poisoning")} t={t.poisoning} />
        ) : null}

        {visibility.ja3 ? (
          <Components.ja3 onClose={() => close("ja3")} t={t.ja3Modal} />
        ) : null}

        {visibility.attributions ? (
          <Components.attributions
            onClose={() => close("attributions")}
            t={t.attributionsModal}
          />
        ) : null}

        {visibility.shortcuts ? (
          <Components.shortcuts
            onClose={() => close("shortcuts")}
            t={t.keyboardShortcutsModal}
          />
        ) : null}
      </Suspense>
    </ErrorBoundary>
  );
};
