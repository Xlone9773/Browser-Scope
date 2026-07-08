import React, { useRef, useEffect } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { Translation } from "../../../utils/i18n/types";
import { loggerStore } from "../../../utils/loggerStore";

interface EventsViewProps {
  t: Translation["settings"]["developer"];
  logs: string[];
}

export const EventsView: React.FC<EventsViewProps> = ({ t, logs }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {logs.length === 0 ? (<div className="text-slate-500 italic">
          {t.events.placeholder}
        </div>) : null}
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
  );
};
