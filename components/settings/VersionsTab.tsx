import React, { useState } from 'react';
import { Package, GitCommit, RefreshCw, Layers, Zap } from 'lucide-react';
import { ModuleState } from './ModulesTab';
import packageJson from '../../package.json';
import { Button } from '../ui/Button';

import { Translation } from '../../utils/i18n/types';

interface VersionsTabProps {
  t: Translation['settings']['versions'];
  appVersion?: string;
  modules: ModuleState[];
  updateServiceWorker?: (reloadPage?: boolean) => Promise<void>;
  manualCheckUpdate?: () => Promise<string>;
  lastCheckTime?: number;
  isCheckingUpdate?: boolean;
  needRefresh?: boolean;
}

export const VersionsTab: React.FC<VersionsTabProps> = ({ 
  t, 
  appVersion = "Unknown", 
  modules,
  updateServiceWorker,
  manualCheckUpdate,
  lastCheckTime,
  isCheckingUpdate,
  needRefresh
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleForcePull = async () => {
    if (manualCheckUpdate) {
      const result = await manualCheckUpdate();
      if (result === "checked" || result === "not-supported") {
         setToastMessage(t?.upToDate);
         setTimeout(() => setToastMessage(null), 3000);
      }
    } else {
      // Fallback
      setIsPulling(true);
      try {
        if (updateServiceWorker) {
          await updateServiceWorker(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsPulling(false);
        window.location.reload();
      }
    }
  };

  const formatLastChecked = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const coreLibraries = [
    { name: "React", version: packageJson.dependencies.react.replace(/[\^~]/, '') },
    { name: "Tailwind CSS", version: packageJson.devDependencies["tailwindcss"].replace(/[\^~]/, '') },
    { name: "Vite", version: packageJson.devDependencies.vite.replace(/[\^~]/, '') },
    { name: "Lucide Icons", version: packageJson.dependencies["lucide-react"].replace(/[\^~]/, '') },
    { name: "FingerprintJS", version: packageJson.dependencies["@fingerprintjs/fingerprintjs"].replace(/[\^~]/, '') }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <GitCommit size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t?.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t?.desc}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleForcePull}
            isLoading={isPulling || isCheckingUpdate}
            leftIcon={<RefreshCw size={16} className={(isPulling || isCheckingUpdate) ? "animate-spin" : ""} />}
            variant={needRefresh ? "primary" : "secondary"}
          >
            {needRefresh ? t?.applyUpdate : t?.forcePull}
          </Button>
          {lastCheckTime ? (<div className="text-xs text-slate-400">
            {t?.lastChecked} {formatLastChecked(lastCheckTime)}
          </div>) : null}
          {toastMessage ? (<div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in slide-in-from-top-1">
            {toastMessage}
          </div>) : null}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
            <Layers size={18} className="text-indigo-500" />
            {t?.coreApp}
          </div>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-sm font-mono rounded-md shadow-sm border border-indigo-200 dark:border-indigo-500/30">
            v{appVersion}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 px-1 flex items-center gap-2">
          <Zap size={16} />
          {t?.libraries}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {coreLibraries.map((lib) => (
            <div key={lib.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{lib.name}</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">v{lib.version}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 px-1 flex items-center gap-2">
          <Package size={16} />
          {t?.installedModules}
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
