import React, { useState, useEffect } from "react";
import {
  Terminal,
  Activity,
  Eye,
  Maximize2,
  Bug,
  Wrench,
  Settings as SettingsIcon,
} from "lucide-react";
import { Translation } from "../../utils/i18n/types";
import { Button } from "../ui/Button";
import {
  useLoggerStore,
} from "../../utils/loggerStore";
import { EventsView } from "./developer/EventsView";
import { InspectorView } from "./developer/InspectorView";
import { ConsoleView } from "./developer/ConsoleView";
import { WarningOverlay } from "./developer/WarningOverlay";
import { DeveloperSettingsDropdown } from "./developer/DeveloperSettingsDropdown";

interface DeveloperTabProps {
  t: Translation["settings"]["developer"];
  isFloating: boolean;
  toggleFloat: () => void;
}

type SubTab = "events" | "inspector" | "console";

export const DeveloperTab: React.FC<DeveloperTabProps> = ({
  t,
  isFloating,
  toggleFloat,
}) => {
  const [subTab, setSubTab] = useState<SubTab>("events");
  const {
    logs,
    consoleHistory,
    isLoggingEnabled,
    activeConsole,
    defaultConsole,
    erudaSnippets,
    erudaDefaultTab,
    setActiveConsole,
    setDefaultConsole,
    setErudaSnippet,
    setErudaDefaultTab,
  } = useLoggerStore();

  const [showSettings, setShowSettings] = useState(false);

  // Risk Acceptance State - Initialize directly from localStorage to prevent flash
  const [hasAcceptedRisk, setHasAcceptedRisk] = useState(() => {
    return localStorage.getItem("developer_risk_accepted") === "true";
  });
  const [hasRejectedRisk, setHasRejectedRisk] = useState(() => {
    return localStorage.getItem("developer_risk_accepted") === "false";
  });
  const [isOverlayFading, setIsOverlayFading] = useState(false);

  // Cooldown Timer
  const [countdown, setCountdown] = useState(5);

  const [crash, setCrash] = useState(false);
  if (crash) {
    throw new Error("Simulated Dev Crash triggered.");
  }

  useEffect(() => {
    if (!hasAcceptedRisk && !hasRejectedRisk && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasAcceptedRisk, hasRejectedRisk, countdown]);

  const handleAcceptRisk = () => {
    if (countdown > 0) return;
    setIsOverlayFading(true);
    setTimeout(() => {
      setHasAcceptedRisk(true);
      localStorage.setItem("developer_risk_accepted", "true");
    }, 300); // Match CSS transition duration
  };

  const handleCancelRisk = () => {
    setHasRejectedRisk(true);
    localStorage.setItem("developer_risk_accepted", "false");
  };

  const handleReenable = () => {
    setHasRejectedRisk(false);
    setCountdown(5);
    setIsOverlayFading(false);
  };

  const toggleDefaultConsole = () => {
    setActiveConsole(
      activeConsole === defaultConsole ? "none" : defaultConsole,
    );
  };

  const toggleLogging = () => {
    loggerStore.setLoggingEnabled(!isLoggingEnabled);
  };

  // Content JSX
  const content = (
    <div className="flex flex-col h-full overflow-hidden text-xs font-mono">
      {/* EVENTS VIEW */}
      {subTab === "events" && <EventsView t={t} logs={logs} />}

      {/* INSPECTOR VIEW */}
      {subTab === "inspector" && <InspectorView />}

      {/* CONSOLE VIEW */}
      {subTab === "console" && (
        <ConsoleView t={t} consoleHistory={consoleHistory} />
      )}
    </div>
  );

  const warningOverlay = (
    <WarningOverlay
      t={t}
      countdown={countdown}
      isOverlayFading={isOverlayFading}
      onAccept={handleAcceptRisk}
      onCancel={handleCancelRisk}
    />
  );

  if (hasRejectedRisk) {
    const disabledContent = (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-500">
          <Terminal size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
          {t.warning?.disabled_title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          {t.warning?.disabled_desc}
        </p>
        <button
          onClick={handleReenable}
          className="px-6 py-3 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-sm"
        >
          {t.warning?.reenable}
        </button>
      </div>
    );

    if (isFloating) {
      return (
        <div className="relative h-full flex flex-col bg-slate-50 dark:bg-slate-900">
          {disabledContent}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-4 relative">
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner relative">
          {disabledContent}
        </div>
      </div>
    );
  }

  // If currently floating, we render the header + content directly, wrapper is handled by App.tsx
  if (isFloating) {
    return (
      <div className="relative h-full flex flex-col">
        <div className="flex p-1 bg-slate-800 border-b border-slate-700 shrink-0 gap-1 items-center relative">
          <button
            onClick={() => setSubTab("events")}
            className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === "events" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
          >
            {t.nav.events}
          </button>
          <button
            onClick={() => setSubTab("inspector")}
            className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === "inspector" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
          >
            {t.nav.inspector}
          </button>
          <button
            onClick={() => setSubTab("console")}
            className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === "console" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
          >
            {t.nav.console}
          </button>
          <div className="w-px bg-slate-700 mx-1 self-center h-4"></div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition"
            title="Settings"
          >
            <SettingsIcon size={14} />
          </button>
          <button
            onClick={toggleDefaultConsole}
            className={`p-1.5 rounded transition ${activeConsole !== "none" ? "text-indigo-400 bg-indigo-900/30" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
            title={`Toggle ${defaultConsole === "vconsole" ? "vConsole" : "Eruda"}`}
          >
            {defaultConsole === "vconsole" ? (
              <Bug size={14} />
            ) : (
              <Wrench size={14} />
            )}
          </button>

          {showSettings && (
            <DeveloperSettingsDropdown
              t={t}
              isLoggingEnabled={isLoggingEnabled}
              toggleLogging={toggleLogging}
              defaultConsole={defaultConsole}
              setDefaultConsole={setDefaultConsole}
              erudaDefaultTab={erudaDefaultTab}
              setErudaDefaultTab={setErudaDefaultTab}
              erudaSnippets={erudaSnippets}
              setErudaSnippet={setErudaSnippet}
              onCrash={() => setCrash(true)}
              isFloating={true}
            />
          )}
        </div>
        {content}
        {!hasAcceptedRisk && warningOverlay}
      </div>
    );
  }

  // Docked Mode
  return (
    <div className="flex flex-col h-full space-y-4 relative">
      {/* Controls */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 relative">
        <Button
          onClick={() => setSubTab("events")}
          variant={subTab === "events" ? "secondary" : "ghost"}
          size="xs"
          className="flex-1"
          leftIcon={<Activity size={14} />}
        >
          {t.nav.events}
        </Button>
        <Button
          onClick={() => setSubTab("inspector")}
          variant={subTab === "inspector" ? "secondary" : "ghost"}
          size="xs"
          className="flex-1"
          leftIcon={<Eye size={14} />}
        >
          {t.nav.inspector}
        </Button>
        <Button
          onClick={() => setSubTab("console")}
          variant={subTab === "console" ? "secondary" : "ghost"}
          size="xs"
          className="flex-1"
          leftIcon={<Terminal size={14} />}
        >
          {t.nav.console}
        </Button>
        <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1 self-center h-4"></div>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant={showSettings ? "soft" : "ghost"}
          size="xs"
          title="Settings"
        >
          <SettingsIcon size={14} />
        </Button>

        <Button
          onClick={toggleDefaultConsole}
          variant={activeConsole !== "none" ? "soft" : "ghost"}
          size="xs"
          title={`Toggle ${defaultConsole === "vconsole" ? "vConsole" : "Eruda"}`}
        >
          {defaultConsole === "vconsole" ? (
            <Bug size={14} />
          ) : (
            <Wrench size={14} />
          )}
        </Button>
        <Button
          onClick={toggleFloat}
          variant={isFloating ? "soft" : "ghost"}
          size="xs"
          title={t.actions.float}
        >
          <Maximize2 size={14} />
        </Button>

        {showSettings && (
          <DeveloperSettingsDropdown
            t={t}
            isLoggingEnabled={isLoggingEnabled}
            toggleLogging={toggleLogging}
            defaultConsole={defaultConsole}
            setDefaultConsole={setDefaultConsole}
            erudaDefaultTab={erudaDefaultTab}
            setErudaDefaultTab={setErudaDefaultTab}
            erudaSnippets={erudaSnippets}
            setErudaSnippet={setErudaSnippet}
            onCrash={() => setCrash(true)}
          />
        )}
      </div>

      {/* Docked Content Area */}
      {!isFloating ? (
        <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner relative">
          {content}
          {!hasAcceptedRisk && warningOverlay}
        </div>
      ) : (
        /* Placeholder when floating */
        <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Maximize2 size={32} className="opacity-20" />
          <p className="text-sm">Tool is currently floating.</p>
          <Button
            variant="ghost"
            size="xs"
            onClick={toggleFloat}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {t.actions.dock}
          </Button>
        </div>
      )}
    </div>
  );
};
