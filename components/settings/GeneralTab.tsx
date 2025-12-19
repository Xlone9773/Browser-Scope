
import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface GeneralTabProps {
    t: Translation['settingsModal'];
    simpleMode: boolean;
    toggleSimpleMode: (value: boolean) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ t, simpleMode, toggleSimpleMode }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.simple_mode_title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                        {t.simple_mode_desc}
                    </p>
                </div>
                <button 
                    onClick={() => toggleSimpleMode(!simpleMode)}
                    className={`text-3xl transition-colors ${simpleMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}
                >
                    {simpleMode ? <ToggleRight size={40} fill="currentColor" className="opacity-20" /> : <ToggleLeft size={40} />}
                </button>
            </div>
        </div>
    );
};
