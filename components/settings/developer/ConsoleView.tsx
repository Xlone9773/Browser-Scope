import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  TriangleAlert,
  Check,
  Copy,
  Download,
  Trash2,
  Command,
  Zap,
  Globe,
  Smartphone,
  Shield,
  Edit3,
  Eye,
  Database,
  Activity,
  X,
  Play,
} from "lucide-react";
import { Translation } from "../../../utils/i18n/types";
import { loggerStore, ConsoleEntry } from "../../../utils/loggerStore";

interface ConsoleViewProps {
  t: Translation["settings"]["developer"];
  consoleHistory: ConsoleEntry[];
}

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

export const ConsoleView: React.FC<ConsoleViewProps> = ({ t, consoleHistory }) => {
  const [inputCmd, setInputCmd] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [consoleCopied, setConsoleCopied] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleHistory]);

  const runConsole = (cmdOverride?: string) => {
    const cmdToRun = cmdOverride || inputCmd;
    if (!cmdToRun.trim()) return;

    setShowPresets(false);
    if (!cmdOverride) {
      setInputCmd("");
    }

    loggerStore.addConsole("input", cmdToRun);

    try {
       
      const res = new Function('return ' + cmdToRun)();
      let output = String(res);
      if (typeof res === "object" && res !== null) {
        try {
          output = JSON.stringify(res, null, 2);
        } catch {
          output = Object.prototype.toString.call(res);
        }
      }
      if (output === undefined) output = "undefined";
      loggerStore.addConsole("output", output);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      loggerStore.addConsole("error", errMsg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputCmd(val);
    if (val.startsWith("\\")) {
      setShowPresets(true);
    } else {
      setShowPresets(false);
    }
  };

  const applyPreset = (preset: PresetCommand, runNow: boolean) => {
    if (runNow) {
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

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900 custom-scrollbar flex flex-col gap-3">
        {consoleHistory.length === 0 ? (<div className="text-slate-600 italic mt-2 opacity-50 select-none">
          {t.console.resultPlaceholder}
        </div>) : null}

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
      {showPresets ? (<div className="absolute bottom-[50px] left-2 right-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col overflow-hidden max-h-60">
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
                    {t.console.presets?.[preset.id]?.label ||
                      preset.id}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {t.console.presets?.[preset.id]?.desc}
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
      </div>) : null}
      <div className="p-2 bg-slate-800 flex gap-2 shrink-0 relative z-20 items-center border-t border-slate-700">
        <div className="flex items-center text-slate-400 pl-2">
          <span className="font-bold text-lg">&gt;</span>
        </div>
        <div className="flex-1 relative flex items-center gap-2">
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
            {inputCmd ? (<button
              onClick={clearInput}
              className="absolute right-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
              title={t.console.clearInput}
            >
              <X size={14} />
            </button>) : null}
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
  );
};
