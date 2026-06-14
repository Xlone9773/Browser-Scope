import React, { useState } from 'react';
import { Package, GitCommit, Search, RefreshCw, Layers } from 'lucide-react';
import { ModuleState } from './ModulesTab';

interface VersionsTabProps {
  t: any;
  appVersion?: string;
  modules: ModuleState[];
  updateServiceWorker?: (reloadPage?: boolean) => Promise<void>;
}

export const VersionsTab: React.FC<VersionsTabProps> = ({ 
  t, 
  appVersion = "Unknown", 
  modules,
  updateServiceWorker
}) => {
  const [isPulling, setIsPulling] = useState(false);

  const handleForcePull = async () => {
    setIsPulling(true);
    if (updateServiceWorker) {
      await updateServiceWorker(true);
    } else {
      window.location.reload();
    }
    setTimeout(() => setIsPulling(false), 2000); 
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <GitCommit size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t?.title || "Software Versions"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t?.desc || "View current core software version and loaded modules. Pull updates if needed."}
            </p>
          </div>
        </div>

        <button
          onClick={handleForcePull}
          disabled={isPulling}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw size={16} className={isPulling ? "animate-spin" : ""} />
          {t?.forcePull || "Force Check Updates"}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
            <Layers size={18} className="text-indigo-500" />
            {t?.coreApp || "Core Application"}
          </div>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-sm font-mono rounded-md shadow-sm border border-indigo-200 dark:border-indigo-500/30">
            v{appVersion}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 px-1 flex items-center gap-2">
          <Package size={16} />
          {t?.installedModules || "Installed Modules"}
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
            {modules.length}
          </span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((mod) => (
            <div key={mod.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{mod.name}</span>
                <span className="text-xs text-slate-500 font-mono mt-1 opacity-70">com.bs.module.{mod.id}</span>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                v{appVersion}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
