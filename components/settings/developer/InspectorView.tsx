import React, { useState } from "react";

export const InspectorView: React.FC = () => {
  const [inspectorObj, setInspectorObj] = useState("navigator");

  const getInspectData = (key: string) => {
    let target: Record<string, unknown> | null = null;
    if (key === "navigator") target = navigator as unknown as Record<string, unknown>;
    else if (key === "screen") target = screen as unknown as Record<string, unknown>;
    else if (key === "location") target = location as unknown as Record<string, unknown>;
    else if (key === "performance") target = performance as unknown as Record<string, unknown>;
    else if (key === "document") target = document as unknown as Record<string, unknown>;

    const result: Record<string, unknown> = {};
    if (target) {
      for (const k in target) {
        try {
          const val = target[k];
          if (typeof val !== "function") {
            result[k] = val;
          }
        } catch { /* ignore */ }
      }
    }
    if (key === "navigator") {
      if (navigator.userAgentData)
        result["userAgentData"] = navigator.userAgentData;
      if (navigator.connection)
        result["connection"] = navigator.connection;
      if (navigator.deviceMemory)
        result["deviceMemory"] = navigator.deviceMemory;
    }

    return JSON.stringify(result, null, 2);
  };

  return (
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
  );
};
