import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Activity,
  Eye,
  Play,
  Trash2,
  Copy,
  Check,
  Maximize2,
  TriangleAlert,
  Zap,
  Edit3,
  Globe,
  Database,
  Smartphone,
  Shield,
  X,
  Download,
  Skull,
  Command,
  ChevronRight,
  Bug,
  Wrench,
  Settings as SettingsIcon,
} from "lucide-react";
import { Translation } from "../../utils/i18n/types";
import { Button } from "../ui/Button";
import {
  loggerStore,
  useLoggerStore,
  ConsoleEntry,
} from "../../utils/loggerStore";

interface DeveloperTabProps {
  t: Translation["settings"]["developer"];
  isFloating: boolean;
  toggleFloat: () => void;
}

type SubTab = "events" | "inspector" | "console";

interface PresetCommand {
  id: keyof Translation["settings"]["developer"]["console"]["presets"];
  cmd: string;
  icon: React.ElementType;
  autoRun?: boolean;
}

const PRESET_COMMANDS: PresetCommand[] = [
  { id: "userAgent", cmd: "navigator.userAgent", icon: Globe, autoRun: true },
  {
    id: "screenInfo",
    cmd: "`${window.innerWidth}x${window.innerHeight} (PR: ${window.devicePixelRatio})`",
    icon: Smartphone,
    autoRun: true,
  },
  { id: "cookies", cmd: "document.cookie", icon: Shield, autoRun: true },
  {
    id: "clearStorage",
    cmd: 'localStorage.clear(); "LocalStorage Cleared"',
    icon: Trash2,
    autoRun: true,
  },
  {
    id: "editPage",
    cmd: 'document.body.contentEditable = document.body.contentEditable === "true" ? "false" : "true"',
    icon: Edit3,
    autoRun: true,
  },
  {
    id: "disableBlur",
    cmd: 'document.body.classList.toggle("no-blur")',
    icon: Eye,
    autoRun: true,
  },
  {
    id: "blockClicks",
    cmd: 'document.body.style.pointerEvents = document.body.style.pointerEvents === "none" ? "auto" : "none"',
    icon: Shield,
    autoRun: true,
  },
  {
    id: "getKeys",
    cmd: "Object.keys(localStorage)",
    icon: Database,
    autoRun: true,
  },
  {
    id: "reload",
    cmd: "window.location.reload()",
    icon: Activity,
    autoRun: true,
  },
  {
    id: "performance",
    cmd: "performance.now()",
    icon: Activity,
    autoRun: true,
  },
  { id: "network", cmd: "navigator.connection", icon: Activity, autoRun: true },
  { id: "memory", cmd: "performance.memory", icon: Database, autoRun: true },
];

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

  const [inputCmd, setInputCmd] = useState("");
  const [inspectorObj, setInspectorObj] = useState("navigator");
  const [showPresets, setShowPresets] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [consoleCopied, setConsoleCopied] = useState(false);

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

  // Auto-scroll console
  useEffect(() => {
    if (subTab === "console") {
      consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleHistory, subTab]);

  // Inspector Logic: Safe object extraction
  const getInspectData = (key: string) => {
    let target: any = {};
    if (key === "navigator") target = navigator;
    else if (key === "screen") target = screen;
    else if (key === "location") target = location;
    else if (key === "performance") target = performance;
    else if (key === "document") target = document;

    const result: Record<string, any> = {};
    for (const k in target) {
      try {
        const val = target[k];
        if (typeof val !== "function") {
          result[k] = val;
        }
      } catch (e) {}
    }
    if (key === "navigator") {
      // @ts-ignore
      if ((navigator as any).userAgentData)
        result["userAgentData"] = (navigator as any).userAgentData;
      if ((navigator as any).connection)
        result["connection"] = (navigator as any).connection;
      // @ts-ignore
      if ((navigator as any).deviceMemory)
        result["deviceMemory"] = (navigator as any).deviceMemory;
    }

    return JSON.stringify(result, null, 2);
  };

  // Console Logic
  const runConsole = (cmdOverride?: string) => {
    const cmdToRun = cmdOverride || inputCmd;
    if (!cmdToRun.trim()) return;

    // Hide presets if running
    setShowPresets(false);
    if (!cmdOverride) {
      setInputCmd(""); // Clear input after running manual command
    }

    // Add input to history
    loggerStore.addConsole("input", cmdToRun);

    try {
      // eslint-disable-next-line no-eval
      const res = eval(cmdToRun);
      let output = String(res);
      if (typeof res === "object" && res !== null) {
        try {
          output = JSON.stringify(res, null, 2);
        } catch (e) {
          // Handle circular references or non-serializable objects simply
          output = Object.prototype.toString.call(res);
        }
      }
      if (output === undefined) output = "undefined";
      loggerStore.addConsole("output", output);
    } catch (e: any) {
      loggerStore.addConsole("error", e.message || String(e));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputCmd(val);
    // Show presets if input starts with backslash
    if (val.startsWith("\\")) {
      setShowPresets(true);
    } else {
      setShowPresets(false);
    }
  };

  const applyPreset = (preset: PresetCommand, runNow: boolean) => {
    if (runNow) {
      // If runNow, we don't change input value, we just run the command
      runConsole(preset.cmd);
    } else {
      setInputCmd(preset.cmd);
      setShowPresets(false);
    }
  };

  const clearInput = () => {
    setInputCmd("");
    setShowPresets(false);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyConsoleHistory = () => {
    const text = consoleHistory
      .map(
        (entry) =>
          `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.type.toUpperCase()}: ${entry.content}`,
      )
      .join("\n");

    navigator.clipboard.writeText(text);
    setConsoleCopied(true);
    setTimeout(() => setConsoleCopied(false), 2000);
  };

  const downloadConsoleOutput = () => {
    const text = consoleHistory
      .map(
        (entry) =>
          `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.type.toUpperCase()}: ${entry.content}`,
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-history-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Content JSX
  const content = (
    <div className="flex flex-col h-full overflow-hidden text-xs font-mono">
      {/* EVENTS VIEW */}
      {subTab === "events" && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
            {logs.length === 0 && (
              <div className="text-slate-500 italic">
                {t.events.placeholder}
              </div>
            )}
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="text-green-400 break-all border-b border-slate-800/50 pb-1"
              >
                <span className="text-slate-500 mr-2 opacity-50">
                  {idx + 1}
                </span>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
          <div className="p-2 border-t border-slate-700 bg-slate-800 flex justify-between shrink-0">
            <div className="text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLogs}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] flex items-center gap-1"
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {t.events.copy}
              </button>
              <button
                onClick={() => loggerStore.clearLogs()}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] flex items-center gap-1"
              >
                <Trash2 size={10} />
                {t.events.clear}
              </button>
            </div>
          </div>
        </>
      )}

      {/* INSPECTOR VIEW */}
      {subTab === "inspector" && (
        <div className="flex flex-col h-full">
          <div className="p-2 bg-slate-800 border-b border-slate-700 flex gap-2 shrink-0 overflow-x-auto">
            {["navigator", "screen", "location", "performance"].map((obj) => (
              <button
                key={obj}
                onClick={() => setInspectorObj(obj)}
                className={`px-3 py-1 rounded text-[10px] uppercase font-bold transition-colors whitespace-nowrap ${inspectorObj === obj ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
              >
                {obj}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-900">
            <pre className="text-blue-300 whitespace-pre-wrap break-all">
              {getInspectData(inspectorObj)}
            </pre>
          </div>
        </div>
      )}

      {/* CONSOLE VIEW */}
      {subTab === "console" && (
        <div className="flex flex-col h-full relative">
          {/* Console Output History Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900 custom-scrollbar flex flex-col gap-3">
            {consoleHistory.length === 0 && (
              <div className="text-slate-600 italic mt-2 opacity-50 select-none">
                {t.console.resultPlaceholder}
              </div>
            )}

            {consoleHistory.map((entry) => (
              <div
                key={entry.id}
                className="group animate-in fade-in slide-in-from-left-2 duration-200"
              >
                {entry.type === "input" ? (
                  <div className="flex gap-2 items-start text-indigo-400 font-bold">
                    <ChevronRight size={14} className="mt-0.5 shrink-0" />
                    <span className="whitespace-pre-wrap break-all">
                      {entry.content}
                    </span>
                  </div>
                ) : entry.type === "error" ? (
                  <div className="pl-5 text-red-400 bg-red-900/10 p-2 rounded border-l-2 border-red-500 whitespace-pre-wrap break-all relative">
                    <TriangleAlert
                      size={12}
                      className="absolute left-1 top-2.5 opacity-50"
                    />
                    {entry.content}
                  </div>
                ) : (
                  <div className="pl-5 text-slate-300 relative">
                    <span className="absolute left-0 top-1 text-slate-600 text-[10px] select-none">
                      &lt;
                    </span>
                    <pre className="whitespace-pre-wrap break-all font-mono text-emerald-400/90 selection:bg-emerald-900/50">
                      {entry.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>

          {/* Console Actions Overlay (Top Right) */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={copyConsoleHistory}
              className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
              title={t.console.copy}
            >
              {consoleCopied ? (
                <Check size={12} className="text-green-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
            <button
              onClick={downloadConsoleOutput}
              className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
              title={t.console.download}
            >
              <Download size={12} />
            </button>
            <button
              onClick={() => loggerStore.clearConsole()}
              className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
              title={t.console.clear}
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Command Presets Popup */}
          {showPresets && (
            <div className="absolute bottom-[50px] left-2 right-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col overflow-hidden max-h-60">
              <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-700 text-[10px] text-slate-400 font-medium uppercase tracking-wider backdrop-blur-sm shrink-0">
                {t.console.quickCommands}
              </div>
              <div className="overflow-y-auto">
                {PRESET_COMMANDS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-slate-700/50 transition-colors group cursor-pointer"
                    onClick={() => applyPreset(preset, false)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-1.5 bg-slate-700 text-indigo-400 rounded group-hover:bg-indigo-900/30 group-hover:text-indigo-300 transition-colors">
                        <preset.icon size={14} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-200 font-medium truncate">
                          {(t.console as any).presets?.[preset.id]?.label ||
                            preset.id}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {(t.console as any).presets?.[preset.id]?.desc || ""}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyPreset(preset, true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-600 rounded transition-colors"
                      title={t.console.run}
                    >
                      <Zap size={14} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-2 bg-slate-800 flex gap-2 shrink-0 relative z-20 items-center border-t border-slate-700">
            <div className="flex items-center text-slate-400 pl-2">
              <span className="font-bold text-lg">&gt;</span>
            </div>
            <div className="flex-1 relative flex items-center gap-2">
              {/* Preset Trigger Button */}
              <button
                onClick={() => setShowPresets(!showPresets)}
                className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${showPresets ? "text-indigo-400 bg-indigo-900/30" : "text-slate-500"}`}
                title="Quick Commands"
              >
                <Command size={14} />
              </button>
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={inputCmd}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && runConsole()}
                  placeholder={t.console.placeholder}
                  className="w-full bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-slate-600 pr-8"
                  autoFocus
                  autoComplete="off"
                />
                {inputCmd && (
                  <button
                    onClick={clearInput}
                    className="absolute right-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                    title={t.console.clearInput}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => runConsole()}
              className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center self-stretch shadow-sm active:scale-95 transition-transform"
            >
              <Play size={14} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Warning Overlay JSX - Enhanced for severity with Cooldown
  const warningOverlay = (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-6 bg-red-950/95 backdrop-blur-xl transition-all duration-300 ease-out ${isOverlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-red-600 flex flex-col items-center text-center transition-all duration-300 ease-out transform ${isOverlayFading ? "scale-95 translate-y-4 opacity-0" : "scale-100 translate-y-0 opacity-100"}`}
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-500 animate-bounce">
          <Skull size={40} strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-black text-red-600 dark:text-red-500 mb-4 uppercase tracking-tight">
          {t.warning.title}
        </h3>
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30 mb-6">
          <p className="text-sm font-medium text-slate-700 dark:text-red-200 leading-relaxed whitespace-pre-wrap">
            {t.warning.desc}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleCancelRisk}
            className="w-full py-4 font-bold rounded-lg transition-all text-base tracking-wide bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            {t.warning.cancel}
          </button>
          <button
            onClick={handleAcceptRisk}
            disabled={countdown > 0}
            className={`w-full py-4 font-bold rounded-lg shadow-lg transition-all text-base tracking-wide
                            ${
                              countdown > 0
                                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 active:scale-95"
                            }`}
          >
            {countdown > 0 ? `Wait ${countdown}s...` : t.warning.agree}
          </button>
        </div>
      </div>
    </div>
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
            <div className="absolute top-full right-2 mt-1 w-64 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 overflow-hidden text-sm animate-in slide-in-from-top-2">
              <div
                className="p-3 border-b border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition"
                onClick={toggleLogging}
              >
                <div className="flex flex-col gap-1 cursor-pointer">
                  <div className="flex items-center justify-between text-slate-200">
                    <span>{t.config?.recordEvents || "Record Events"}</span>
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors ${isLoggingEnabled ? "bg-indigo-500" : "bg-slate-600"}`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isLoggingEnabled ? "translate-x-4" : "translate-x-0"}`}
                      ></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {t.config?.recordEventsDesc ||
                      "Auto-record window & network events"}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-800 border-b border-slate-700">
                <span className="text-slate-200 text-[11px] mb-2 block font-medium uppercase">
                  {(t.config as any)?.defaultConsoleTitle || "DEFAULT CONSOLE"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultConsole("vconsole");
                    }}
                    className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition text-xs ${defaultConsole === "vconsole" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                  >
                    <Bug size={12} />{" "}
                    {(t.config as any)?.consoleVConsole || "vConsole"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefaultConsole("eruda");
                    }}
                    className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition text-xs ${defaultConsole === "eruda" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                  >
                    <Wrench size={12} />{" "}
                    {(t.config as any)?.consoleEruda || "Eruda"}
                  </button>
                </div>
              </div>
              {defaultConsole === "eruda" && (
                <>
                  <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-200">
                        {(t.config as any)?.erudaDefaultTab || "Default Eruda Tab"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {(t.config as any)?.erudaDefaultTabDesc || "Select the tab to focus when Eruda is opened."}
                      </span>
                    </div>
                    <select
                      value={erudaDefaultTab}
                      onChange={(e) => setErudaDefaultTab(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 w-full"
                    >
                      <option value="console">Console</option>
                      <option value="elements">Elements (DOM)</option>
                      <option value="network">Network</option>
                      <option value="resources">Resources</option>
                      <option value="sources">Sources (Code)</option>
                      <option value="info">Info</option>
                      <option value="snippets">Snippets</option>
                      <option value="timing">Timing</option>
                      <option value="features">Features</option>
                      <option value="monitor">Monitor</option>
                      <option value="fps">FPS</option>
                    </select>
                  </div>
                  <div className="p-3 border-b border-slate-700 bg-slate-900/50">
                    <div className="flex flex-col gap-1 mb-3">
                    <span className="text-sm font-semibold text-slate-200">
                      {(t.config as any)?.loadSnippets || "Code Snippets"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {(t.config as any)?.loadSnippetsDesc ||
                        "Select which code snippets to automatically inject into Eruda"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: "clear_local", label: (t.config as any)?.snippetClearLocal || "Clear LocalStorage" },
                      { id: "clear_session", label: (t.config as any)?.snippetClearSession || "Clear SessionStorage" },
                      { id: "show_cookies", label: (t.config as any)?.snippetShowCookies || "Show Cookies" },
                      { id: "toggle_blur", label: (t.config as any)?.snippetToggleBlur || "Toggle Body Blur" },
                      { id: "toggle_editable", label: (t.config as any)?.snippetToggleEditable || "Toggle Editable Page" },
                    ].map(snippet => (
                      <div 
                        key={snippet.id} 
                        className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-800/50 rounded px-1 transition" 
                        onClick={() => setErudaSnippet(snippet.id, !(erudaSnippets as any)[snippet.id])}
                      >
                        <span className="text-xs text-slate-300">{snippet.label}</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${(erudaSnippets as any)[snippet.id] ? "bg-indigo-500" : "bg-slate-600"}`}>
                          <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${(erudaSnippets as any)[snippet.id] ? "translate-x-4" : "translate-x-0"}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </>
              )}
              <div className="p-3 bg-slate-800 border-b border-slate-700">
                <button
                  onClick={() => setCrash(true)}
                  className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded flex gap-2 items-center justify-center font-bold text-xs font-sans transition-colors border border-red-500/30"
                >
                  <Skull size={14} />{" "}
                  {(t.config as any)?.simulateCrash || "Simulate Dev Crash"}
                </button>
              </div>
            </div>
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
          <div className="absolute top-10 right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 overflow-hidden text-sm animate-in slide-in-from-top-2 text-left">
            <div
              className="p-3 border-b border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition"
              onClick={toggleLogging}
            >
              <div className="flex flex-col gap-1 cursor-pointer">
                <div className="flex items-center justify-between text-slate-200">
                  <span>{t.config?.recordEvents || "Record Events"}</span>
                  <div
                    className={`w-8 h-4 rounded-full relative transition-colors ${isLoggingEnabled ? "bg-indigo-500" : "bg-slate-600"}`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isLoggingEnabled ? "translate-x-4" : "translate-x-0"}`}
                    ></div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {t.config?.recordEventsDesc ||
                    "Auto-record window & network events"}
                </span>
              </div>
            </div>
            <div className="p-3 bg-slate-800 border-b border-slate-700">
              <span className="text-slate-200 text-[11px] mb-2 block font-medium uppercase">
                {(t.config as any)?.defaultConsoleTitle || "DEFAULT CONSOLE"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultConsole("vconsole");
                  }}
                  className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition text-xs ${defaultConsole === "vconsole" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                >
                  <Bug size={12} />{" "}
                  {(t.config as any)?.consoleVConsole || "vConsole"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultConsole("eruda");
                  }}
                  className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition text-xs ${defaultConsole === "eruda" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                >
                  <Wrench size={12} />{" "}
                  {(t.config as any)?.consoleEruda || "Eruda"}
                </button>
              </div>
            </div>
            {defaultConsole === "eruda" && (
              <>
                <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-200">
                      {(t.config as any)?.erudaDefaultTab || "Default Eruda Tab"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {(t.config as any)?.erudaDefaultTabDesc || "Select the tab to focus when Eruda is opened."}
                    </span>
                  </div>
                  <select
                    value={erudaDefaultTab}
                    onChange={(e) => setErudaDefaultTab(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 w-full"
                  >
                    <option value="console">Console</option>
                    <option value="elements">Elements (DOM)</option>
                    <option value="network">Network</option>
                    <option value="resources">Resources</option>
                    <option value="sources">Sources (Code)</option>
                    <option value="info">Info</option>
                    <option value="snippets">Snippets</option>
                    <option value="timing">Timing</option>
                    <option value="features">Features</option>
                    <option value="monitor">Monitor</option>
                    <option value="fps">FPS</option>
                  </select>
                </div>
                <div className="p-3 border-b border-slate-700 bg-slate-900/50">
                  <div className="flex flex-col gap-1 mb-3">
                  <span className="text-sm font-semibold text-slate-200">
                    {(t.config as any)?.loadSnippets || "Code Snippets"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {(t.config as any)?.loadSnippetsDesc ||
                      "Select which code snippets to automatically inject into Eruda"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "clear_local", label: (t.config as any)?.snippetClearLocal || "Clear LocalStorage" },
                    { id: "clear_session", label: (t.config as any)?.snippetClearSession || "Clear SessionStorage" },
                    { id: "show_cookies", label: (t.config as any)?.snippetShowCookies || "Show Cookies" },
                    { id: "toggle_blur", label: (t.config as any)?.snippetToggleBlur || "Toggle Body Blur" },
                    { id: "toggle_editable", label: (t.config as any)?.snippetToggleEditable || "Toggle Editable Page" },
                  ].map(snippet => (
                    <div 
                      key={snippet.id} 
                      className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-800/50 rounded px-1 transition" 
                      onClick={() => setErudaSnippet(snippet.id, !(erudaSnippets as any)[snippet.id])}
                    >
                      <span className="text-xs text-slate-300">{snippet.label}</span>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${(erudaSnippets as any)[snippet.id] ? "bg-indigo-500" : "bg-slate-600"}`}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${(erudaSnippets as any)[snippet.id] ? "translate-x-4" : "translate-x-0"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </>
            )}
            <div className="p-3 bg-slate-800 border-b border-slate-700">
              <button
                onClick={() => setCrash(true)}
                className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded flex gap-2 items-center justify-center font-bold text-xs font-sans transition-colors border border-red-500/30"
              >
                <Skull size={14} />{" "}
                {(t.config as any)?.simulateCrash || "Simulate Dev Crash"}
              </button>
            </div>
          </div>
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
