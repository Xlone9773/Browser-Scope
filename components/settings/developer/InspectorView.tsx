import React, { useState } from "react";

export const InspectorView: React.FC = () => {
  const [inspectorObj, setInspectorObj] = useState("navigator");

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
