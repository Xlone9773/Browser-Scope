
import React from 'react';
import { Translation } from '../../utils/i18n/types';

interface VibrateTabProps {
    t: Translation['hardwareToolsModal'];
}

export const VibrateTab: React.FC<VibrateTabProps> = ({ t }) => {
    const vibrate = (pattern: number | number[]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full justify-center max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
            { !('vibrate' in navigator) && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center mb-4">
                    {t.vibrate_not_supported}
                </div>
            )}
            <button onClick={() => vibrate(200)} className="py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-medium text-slate-700 dark:text-slate-200">
                {t.vibrate_short}
            </button>
            <button onClick={() => vibrate(500)} className="py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-medium text-slate-700 dark:text-slate-200">
                {t.vibrate_medium}
            </button>
            <button onClick={() => vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100])} className="py-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all active:scale-95 font-bold">
                {t.vibrate_pattern}
            </button>
        </div>
    );
};
