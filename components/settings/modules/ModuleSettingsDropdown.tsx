import React from "react";
import { Translation } from "../../../utils/i18n/types";

interface ModuleSettingsDropdownProps {
    t: Translation["settings"]["modules"] | undefined;
    disableCache: boolean;
    toggleDisableCache: (val: boolean) => void;
    disableLazyLoading: boolean;
    toggleDisableLazyLoading: (val: boolean) => void;
    alwaysShowLoading: boolean;
    toggleAlwaysShowLoading: (val: boolean) => void;
    lazyTabChange: boolean;
    toggleLazyTabChange: (val: boolean) => void;
}

export const ModuleSettingsDropdown: React.FC<ModuleSettingsDropdownProps> = ({
    t,
    disableCache,
    toggleDisableCache,
    disableLazyLoading,
    toggleDisableLazyLoading,
    alwaysShowLoading,
    toggleAlwaysShowLoading,
    lazyTabChange,
    toggleLazyTabChange,
}) => {
    return (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">
                    {t?.settingsTitle ? t.settingsTitle : null}
                </h4>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[280px] overflow-y-auto custom-scrollbar">
                {/* Disable Cache */}
                <div className={`p-4 flex flex-col gap-1.5 transition-colors ${disableLazyLoading ? "bg-amber-500/5 dark:bg-amber-500/5 hover:bg-amber-500/10 dark:hover:bg-amber-500/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/10"}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-none">
                                    {t?.disableCache ? t.disableCache : null}
                                </span>
                                {disableLazyLoading && t?.mutualCacheTag && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium whitespace-nowrap">
                                        {t.mutualCacheTag}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                toggleDisableCache(!disableCache);
                            }}
                            className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0 ${disableCache ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-600"}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${disableCache ? "translate-x-3.5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-normal font-normal">
                        {t?.disableCacheDesc ? t.disableCacheDesc : null}
                    </p>
                    {disableLazyLoading && t?.mutualCacheWarning && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium flex items-center gap-1">
                            {t.mutualCacheWarning}
                        </p>
                    )}
                </div>

                {/* Disable Lazy Loading */}
                <div className={`p-4 flex flex-col gap-1.5 transition-colors ${disableCache ? "bg-amber-500/5 dark:bg-amber-500/5 hover:bg-amber-500/10 dark:hover:bg-amber-500/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/10"}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-none">
                                    {t?.disableLazyLoading ? t.disableLazyLoading : null}
                                </span>
                                {disableCache && t?.mutualLazyTag && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium whitespace-nowrap">
                                        {t.mutualLazyTag}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                toggleDisableLazyLoading(!disableLazyLoading);
                            }}
                            className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0 ${disableLazyLoading ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-600"}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${disableLazyLoading ? "translate-x-3.5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-normal font-normal">
                        {t?.disableLazyLoadingDesc ? t.disableLazyLoadingDesc : null}
                    </p>
                    {disableCache && t?.mutualLazyWarning && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium flex items-center gap-1">
                            {t.mutualLazyWarning}
                        </p>
                    )}
                </div>

                {/* Always Show Loading */}
                <div className="p-4 flex flex-col gap-1.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-none">
                            {t?.alwaysShowLoading ? t.alwaysShowLoading : null}
                        </span>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                toggleAlwaysShowLoading(!alwaysShowLoading);
                            }}
                            className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0 ${alwaysShowLoading ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-600"}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${alwaysShowLoading ? "translate-x-3.5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-normal font-normal">
                        {t?.alwaysShowLoadingDesc ? t.alwaysShowLoadingDesc : null}
                    </p>
                </div>

                {/* Lazy Tab Change */}
                <div className="p-4 flex flex-col gap-1.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-none">
                            {t?.lazyTabChange ? t.lazyTabChange : null}
                        </span>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                toggleLazyTabChange(!lazyTabChange);
                            }}
                            className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0 ${lazyTabChange ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-600"}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-200 ${lazyTabChange ? "translate-x-3.5" : "translate-x-0"}`}
                            />
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-normal font-normal">
                        {t?.lazyTabChangeDesc ? t.lazyTabChangeDesc : null}
                    </p>
                </div>
            </div>
        </div>
    );
};
