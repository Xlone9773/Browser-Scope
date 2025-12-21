
import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Trash2 } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { Button } from '../ui/Button';

interface StorageTabProps {
    t: Translation['settingsModal'];
}

export const StorageTab: React.FC<StorageTabProps> = ({ t }) => {
    const [localStorageCount, setLocalStorageCount] = useState(0);
    const [sessionStorageCount, setSessionStorageCount] = useState(0);
    const [swCount, setSwCount] = useState<number | null>(null);

    useEffect(() => {
        setLocalStorageCount(localStorage.length);
        setSessionStorageCount(sessionStorage.length);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations()
              .then(regs => {
                setSwCount(regs.length);
              })
              .catch(err => {
                  console.debug("Service Worker access restricted:", err);
                  setSwCount(null);
              });
        }
    }, []);

    const clearStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        setLocalStorageCount(0);
        setSessionStorageCount(0);
    };
  
    const unregisterSW = async () => {
        if ('serviceWorker' in navigator) {
            try {
              const regs = await navigator.serviceWorker.getRegistrations();
              for (const reg of regs) {
                  await reg.unregister();
              }
              setSwCount(0);
            } catch (err) {
                console.error("Failed to unregister service workers:", err);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Local Data */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.storage_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.clear_data}</p>
                        </div>
                    </div>
                    <Button 
                        variant="danger-soft" 
                        size="sm" 
                        onClick={clearStorage} 
                        leftIcon={<Trash2 size={16} />}
                    >
                        {t.clear_btn}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Local Storage Items</div>
                        <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{localStorageCount}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Session Storage Items</div>
                        <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{sessionStorageCount}</div>
                    </div>
                </div>
            </div>

            {/* Service Workers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.sw_title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.sw_desc}</p>
                        </div>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={unregisterSW}
                    >
                        {t.sw_btn}
                    </Button>
                </div>
                {swCount !== null && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Active Registrations</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{swCount}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
