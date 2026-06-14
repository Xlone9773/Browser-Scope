import React from 'react';
import { Translation } from '../../utils/i18n/types';
import { Package, XCircle, CheckCircle2 } from 'lucide-react';

export interface ModuleState {
  id: string;
  name: string;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  impact: 'High' | 'Medium' | 'Low';
  isSystem?: boolean;
  isLoaded: boolean;
  onUnload?: () => void;
}

interface ModulesTabProps {
  t: any;
  modules: ModuleState[];
}

export const ModulesTab: React.FC<ModulesTabProps> = ({ t, modules }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Package size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {t?.title || "Module Management"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t?.desc || "Manage statically bundled modules. Modules are cached via PWA."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${mod.isLoaded ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                {mod.isLoaded ? <CheckCircle2 size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{mod.name || mod.id}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 shrink-0">Impact: {mod.impact}</span>
                  {mod.isSystem && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">System</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!mod.isSystem && (
                <button
                  onClick={() => mod.onUnload && mod.onUnload()}
                  disabled={!mod.isLoaded}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={16} />
                  {t?.unload || "Unload"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
