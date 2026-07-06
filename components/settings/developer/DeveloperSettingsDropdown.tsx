import React from "react";
import { Bug, Wrench, Skull } from "lucide-react";
import { Translation } from "../../../utils/i18n/types";
import { Select } from "../../ui/Select";

interface DeveloperSettingsDropdownProps {
  t: Translation["settings"]["developer"];
  isLoggingEnabled: boolean;
  toggleLogging: () => void;
  defaultConsole: "vconsole" | "eruda";
  setDefaultConsole: (con: "vconsole" | "eruda") => void;
  erudaDefaultTab: string;
  setErudaDefaultTab: (tab: string) => void;
  vconsoleDefaultTab: string;
  setVconsoleDefaultTab: (tab: string) => void;
  erudaSnippets: Record<string, boolean>;
  setErudaSnippet: (id: string, val: boolean) => void;
  onCrash: () => void;
  isFloating?: boolean;
}

export const DeveloperSettingsDropdown: React.FC<DeveloperSettingsDropdownProps> = ({
  t,
  isLoggingEnabled,
  toggleLogging,
  defaultConsole,
  setDefaultConsole,
  erudaDefaultTab,
  setErudaDefaultTab,
  vconsoleDefaultTab,
  setVconsoleDefaultTab,
  erudaSnippets,
  setErudaSnippet,
  onCrash,
  isFloating
}) => {
  return (
    <div className={`absolute ${isFloating ? "top-full right-2" : "top-10 right-0 text-left"} mt-1 w-64 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto text-sm animate-in slide-in-from-top-2 custom-scrollbar`}>
      <div
        className="p-3 border-b border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition"
        onClick={toggleLogging}
      >
        <div className="flex flex-col gap-1 cursor-pointer">
          <div className="flex items-center justify-between text-slate-200">
            <span>{t.config?.recordEvents}</span>
            <div
              className={`w-8 h-4 rounded-full relative transition-colors ${isLoggingEnabled ? "bg-indigo-500" : "bg-slate-600"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isLoggingEnabled ? "translate-x-4" : "translate-x-0"}`}
              ></div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">
            {t.config?.recordEventsDesc}
          </span>
        </div>
      </div>
      <div className="p-3 bg-slate-800 border-b border-slate-700">
        <span className="text-slate-200 text-[11px] mb-2 block font-medium uppercase">
          {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.defaultConsoleTitle}
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
            {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.consoleVConsole}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDefaultConsole("eruda");
            }}
            className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition text-xs ${defaultConsole === "eruda" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
          >
            <Wrench size={12} />{" "}
            {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.consoleEruda}
          </button>
        </div>
      </div>
      {defaultConsole === "vconsole" && (
        <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-200">
              {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleDefaultTab}
            </span>
            <span className="text-[10px] text-slate-500">
              {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleDefaultTabDesc}
            </span>
          </div>
          <Select
            value={vconsoleDefaultTab}
            onChange={(val: string) => setVconsoleDefaultTab(val)}
            fullWidth
            options={[
              { id: "default", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleTabs?.default },
              { id: "system", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleTabs?.system },
              { id: "network", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleTabs?.network },
              { id: "element", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleTabs?.element },
              { id: "storage", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.vconsoleTabs?.storage },
            ]}
          />
        </div>
      )}
      {defaultConsole === "eruda" && (
        <>
          <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-200">
                {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaDefaultTab}
              </span>
              <span className="text-[10px] text-slate-500">
                {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaDefaultTabDesc}
              </span>
            </div>
            <Select
              value={erudaDefaultTab}
              onChange={(val: string) => setErudaDefaultTab(val)}
              fullWidth
              options={[
                { id: "console", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.console },
                { id: "elements", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.elements },
                { id: "network", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.network },
                { id: "resources", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.resources },
                { id: "sources", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.sources },
                { id: "info", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.info },
                { id: "snippets", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.snippets },
                { id: "timing", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.timing },
                { id: "features", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.features },
                { id: "monitor", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.monitor },
                { id: "fps", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.erudaTabs?.fps },
              ]}
            />
          </div>
          <div className="p-3 border-b border-slate-700 bg-slate-900/50">
            <div className="flex flex-col gap-1 mb-3">
              <span className="text-sm font-semibold text-slate-200">
                {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.loadSnippets}
              </span>
              <span className="text-[10px] text-slate-500">
                {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.loadSnippetsDesc}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { id: "clear_local", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.snippetClearLocal },
                { id: "clear_session", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.snippetClearSession },
                { id: "show_cookies", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.snippetShowCookies },
                { id: "toggle_blur", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.snippetToggleBlur },
                { id: "toggle_editable", label: (t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.snippetToggleEditable },
              ].map(snippet => (
                <div 
                  key={snippet.id} 
                  className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-800/50 rounded px-1 transition"
                  onClick={() => setErudaSnippet(snippet.id, !(erudaSnippets as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)[snippet.id])}
                >
                  <span className="text-xs text-slate-300">{snippet.label}</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${(erudaSnippets as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)[snippet.id] ? "bg-indigo-500" : "bg-slate-600"}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${(erudaSnippets as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)[snippet.id] ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="p-3 bg-slate-800 border-b border-slate-700">
        <button
          onClick={onCrash}
          className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded flex gap-2 items-center justify-center font-bold text-xs font-sans transition-colors border border-red-500/30"
        >
          <Skull size={14} />{" "}
          {(t.config as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.simulateCrash}
        </button>
      </div>
    </div>
  );
};
