import React from 'react';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';

interface AppearanceTabProps {
    t: any;
    themeColor: string;
    setThemeColor: (color: string) => void;
    animationStyle: string;
    setAnimationStyle: (style: string) => void;
    simpleMode: boolean;
    toggleSimpleMode: (value: boolean) => void;
    hideScrollbar: boolean;
    toggleHideScrollbar: (value: boolean) => void;
    globalHideScrollbar: boolean;
    toggleGlobalHideScrollbar: (value: boolean) => void;
    disableBlur: boolean;
    toggleDisableBlur: (value: boolean) => void;
    disableAnimations: boolean;
    toggleDisableAnimations: (value: boolean) => void;
    fastAnimations: boolean;
    toggleFastAnimations: (value: boolean) => void;
    collapseHeader: boolean;
    toggleCollapseHeader: (value: boolean) => void;
    showTabs: boolean;
    toggleShowTabs: (value: boolean) => void;
    showSearch: boolean;
    toggleShowSearch: (value: boolean) => void;
    translationDict: any;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ 
    t, 
    themeColor,
    setThemeColor,
    animationStyle,
    setAnimationStyle,
    simpleMode, 
    toggleSimpleMode, 
    hideScrollbar, 
    toggleHideScrollbar,
    globalHideScrollbar,
    toggleGlobalHideScrollbar,
    disableBlur,
    toggleDisableBlur,
    disableAnimations,
    toggleDisableAnimations,
    fastAnimations,
    toggleFastAnimations,
    collapseHeader,
    toggleCollapseHeader,
    showTabs,
    toggleShowTabs,
    showSearch,
    toggleShowSearch,
    translationDict
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
                        {t.simpleMode?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.simpleMode?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={simpleMode} onChange={toggleSimpleMode} />
                </div>
            </div>

            {/* Show Tabs Option (NEW) */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleShowTabs(!showTabs)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.showTabs?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.showTabs?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={showTabs} onChange={toggleShowTabs} />
                </div>
            </div>

            {/* Show Search Bar Option */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleShowSearch(!showSearch)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.showSearch?.title || "Enable Search Bar"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.showSearch?.desc || "Display a search bar above the tab bar to quickly filter dashboard categories and card content."}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={showSearch} onChange={toggleShowSearch} />
                </div>
            </div>

            {/* Theme Color Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {translationDict.settings?.general?.themeColor?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.themeColor?.desc}
                    </p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg self-stretch sm:self-auto flex-wrap gap-1">
                    {[
                        { id: 'indigo', hex: '#6366f1' },
                        { id: 'emerald', hex: '#10b981' },
                        { id: 'rose', hex: '#f43f5e' },
                        { id: 'amber', hex: '#f59e0b' },
                        { id: 'blue', hex: '#3b82f6' },
                        { id: 'violet', hex: '#8b5cf6' },
                        { id: 'sky', hex: '#77bbee' },
                        { id: 'ice', hex: '#a7c8ff' },
                        { id: 'cherry', hex: '#efa7a8' }
                    ].map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => setThemeColor(theme.id)}
                            className={`w-8 h-8 rounded-md transition-all flex items-center justify-center ${themeColor === theme.id ? 'ring-2 ring-slate-800 dark:ring-white scale-110 shadow-sm' : 'hover:scale-105'}`}
                            style={{ backgroundColor: theme.hex }}
                            title={theme.id}
                        >
                            {themeColor === theme.id && <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-900" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animation Style Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {translationDict.settings?.general?.animationStyle?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.animationStyle?.desc}
                    </p>
                </div>
                <Select 
                    value={animationStyle}
                    onChange={setAnimationStyle}
                    options={[
                        { id: 'slide-up', label: translationDict.settings?.general?.animationStyle?.options?.slideUp },
                        { id: 'fade', label: translationDict.settings?.general?.animationStyle?.options?.fade },
                        { id: 'fly-in', label: translationDict.settings?.general?.animationStyle?.options?.flyIn },
                        { id: 'zoom', label: translationDict.settings?.general?.animationStyle?.options?.zoom }
                    ]}
                    className="w-full sm:w-48"
                    color={themeColor as any}
                />
            </div>

            {/* Disable Blur */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableBlur(!disableBlur)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.performance?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.performance?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={disableBlur} onChange={toggleDisableBlur} />
                </div>
            </div>

            {/* Hide Scrollbar Toggle */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${globalHideScrollbar ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (!globalHideScrollbar) toggleHideScrollbar(!hideScrollbar); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.scrollbar?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.scrollbar?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={hideScrollbar || globalHideScrollbar} onChange={(val) => { if (!globalHideScrollbar) toggleHideScrollbar(val); }} disabled={globalHideScrollbar} />
                </div>
            </div>

            {/* Global Hide Scrollbar Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleGlobalHideScrollbar(!globalHideScrollbar)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.globalScrollbar?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.globalScrollbar?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={globalHideScrollbar} onChange={toggleGlobalHideScrollbar} />
                </div>
            </div>

            {/* Disable Animations */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableAnimations(!disableAnimations)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.animations?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.animations?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={disableAnimations} onChange={toggleDisableAnimations} />
                </div>
            </div>

            {/* Fast Animations */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${disableAnimations ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (!disableAnimations) toggleFastAnimations(!fastAnimations); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.fastAnimations?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.fastAnimations?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={fastAnimations} onChange={toggleFastAnimations} disabled={disableAnimations} />
                </div>
            </div>

            {/* Collapse Header Menu Desktop */}
            <div 
                className="p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 max-lg:opacity-50 max-lg:cursor-not-allowed max-lg:bg-slate-50 max-lg:dark:bg-slate-900 max-lg:border-slate-100 max-lg:dark:border-slate-800"
                onClick={() => { if (window.innerWidth >= 1024) toggleCollapseHeader(!collapseHeader); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.collapseHeader?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.collapseHeader?.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={collapseHeader} onChange={toggleCollapseHeader} />
                </div>
            </div>
        </div>
    );
};
