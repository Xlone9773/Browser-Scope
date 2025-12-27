
import React from 'react';
import { Translation } from '../../utils/i18n/types';
import { Switch } from '../ui/Switch';

interface GeneralTabProps {
    t: Translation['settings']['general'];
    simpleMode: boolean;
    toggleSimpleMode: (value: boolean) => void;
    hideScrollbar: boolean;
    toggleHideScrollbar: (value: boolean) => void;
    timeFormat: '12' | '24';
    setTimeFormat: (format: '12' | '24') => void;
    disableBlur: boolean;
    toggleDisableBlur: (value: boolean) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ 
    t, 
    simpleMode, 
    toggleSimpleMode, 
    hideScrollbar, 
    toggleHideScrollbar,
    timeFormat,
    setTimeFormat,
    disableBlur,
    toggleDisableBlur
}) => {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Simple Mode Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleSimpleMode(!simpleMode)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.simpleMode.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.simpleMode.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={simpleMode} 
                        onChange={toggleSimpleMode} 
                        label={t.simpleMode.title} 
                    />
                </div>
            </div>

            {/* Time Format Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => setTimeFormat(timeFormat === '24' ? '12' : '24')}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.timeFormat.title || '24-Hour Clock'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.timeFormat.desc || 'Switch between 12-hour and 24-hour formats.'}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={timeFormat === '24'} 
                        onChange={(val) => setTimeFormat(val ? '24' : '12')} 
                        label={t.timeFormat.title || 'Time Format'} 
                    />
                </div>
            </div>

            {/* High Performance (Disable Blur) Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableBlur(!disableBlur)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.performance.title || "High Performance Mode"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.performance.desc || "Disable blur effects and transparency to improve performance on older devices."}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={disableBlur} 
                        onChange={toggleDisableBlur} 
                        label={t.performance.title || "High Performance Mode"} 
                    />
                </div>
            </div>

            {/* Hide Scrollbar Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleHideScrollbar(!hideScrollbar)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.scrollbar.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.scrollbar.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={hideScrollbar} 
                        onChange={toggleHideScrollbar} 
                        label={t.scrollbar.title} 
                    />
                </div>
            </div>
        </div>
    );
};
