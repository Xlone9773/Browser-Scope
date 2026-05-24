
import React from 'react';
import { Translation } from '../../utils/i18n/types';

import { Select } from '../ui/Select';

interface GeneralTabProps {
    t: any; // Using any for t because Translation type was getting complicated with extensions
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
    timeFormat: '12' | '24';
    setTimeFormat: (format: '12' | '24') => void;
    disableBlur: boolean;
    toggleDisableBlur: (value: boolean) => void;
    disableAnimations: boolean;
    toggleDisableAnimations: (value: boolean) => void;
    fastAnimations: boolean;
    toggleFastAnimations: (value: boolean) => void;
    collapseHeader: boolean;
    toggleCollapseHeader: (value: boolean) => void;
    enableUdp?: boolean;
    toggleEnableUdp?: (value: boolean) => void;
    hiddenCards: string[];
    setHiddenCards: (cards: string[]) => void;
    translationDict: any;
}

// Custom Switch Component with Spring Animation
const Switch: React.FC<{ checked: boolean; onChange: (val: boolean) => void; label?: string; disabled?: boolean }> = ({ checked, onChange, label, disabled = false }) => (
    <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
            relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
            transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-800
            ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        <span className="sr-only">{label}</span>
        <span
            aria-hidden="true"
            className={`
                pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 
                transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${checked ? 'translate-x-6' : 'translate-x-0'}
            `}
        />
    </button>
);

export const GeneralTab: React.FC<GeneralTabProps> = ({ 
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
    timeFormat,
    setTimeFormat,
    disableBlur,
    toggleDisableBlur,
    disableAnimations,
    toggleDisableAnimations,
    fastAnimations,
    toggleFastAnimations,
    collapseHeader,
    toggleCollapseHeader,
    enableUdp,
    toggleEnableUdp,
    hiddenCards,
    setHiddenCards,
    translationDict
}) => {
    // Collect all card names using the translation dictionary.
    // Note: If translations are added dynamically or missing in dict, we provide fallbacks.
    const sectionsObj = translationDict?.sections || {};
    const availableCards = [
        { id: 'environment', name: sectionsObj.environment || 'Analysis Environment' },
        { id: 'system', name: sectionsObj.system || 'System Environment' },
        { id: 'hardware', name: sectionsObj.hardware || 'Hardware Info' },
        { id: 'display', name: sectionsObj.display || 'Display Info' },
        { id: 'network', name: sectionsObj.network || 'Network & IP' },
        { id: 'security', name: sectionsObj.security || 'Security & Tracking' },
        { id: 'fingerprint', name: sectionsObj.fingerprints || 'Fingerprint' },
        { id: 'ai', name: sectionsObj.ai_compute || 'AI & Compute' },
        { id: 'location', name: sectionsObj.location || 'Location & Sensors' },
        { id: 'storage', name: sectionsObj.storage || 'Storage Insights' },
        { id: 'permissions', name: sectionsObj.permissions || 'Permissions' },
        { id: 'media_devices', name: sectionsObj.media_devices || 'Media Devices' },
        { id: 'media_capabilities', name: sectionsObj.media_caps || 'Media Capabilities' },
        { id: 'user_agent', name: sectionsObj.user_agent || 'User Agent' },
        { id: 'pwa', name: sectionsObj.pwa || 'PWA Support' },
        { id: 'features', name: sectionsObj.features || 'Features' },
    ];

    const toggleCardHide = (id: string) => {
        if (hiddenCards.includes(id)) {
            setHiddenCards(hiddenCards.filter(c => c !== id));
        } else {
            setHiddenCards([...hiddenCards, id]);
        }
    };
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
                        {t.timeFormat.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.timeFormat.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={timeFormat === '24'} 
                        onChange={(val) => setTimeFormat(val ? '24' : '12')} 
                        label={t.timeFormat.title} 
                    />
                </div>
            </div>

            {/* Theme Color Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {translationDict.settings?.general?.themeColor?.title || 'Theme Color'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.themeColor?.desc || 'Select primary theme color for the application.'}
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
                        {translationDict.settings?.general?.animationStyle?.title || 'Animation Style'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {translationDict.settings?.general?.animationStyle?.desc || 'Set entry component animation style.'}
                    </p>
                </div>
                <Select 
                    value={animationStyle}
                    onChange={setAnimationStyle}
                    options={[
                        { id: 'slide-up', label: translationDict.settings?.general?.animationStyle?.options?.slideUp || 'Slide Up' },
                        { id: 'fade', label: translationDict.settings?.general?.animationStyle?.options?.fade || 'Fade In' },
                        { id: 'fly-in', label: translationDict.settings?.general?.animationStyle?.options?.flyIn || 'Fly In' },
                        { id: 'zoom', label: translationDict.settings?.general?.animationStyle?.options?.zoom || 'Zoom In' }
                    ]}
                    className="w-full sm:w-48"
                    color={themeColor as any}
                />
            </div>

            {/* Disable Blur (Renamed from High Performance) */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableBlur(!disableBlur)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.performance.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.performance.desc}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={disableBlur} 
                        onChange={toggleDisableBlur} 
                        label={t.performance.title} 
                    />
                </div>
            </div>

            {/* Hide Scrollbar Toggle */}
            <div 
                className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${globalHideScrollbar ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                onClick={() => { if (!globalHideScrollbar) toggleHideScrollbar(!hideScrollbar); }}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.scrollbar?.title || "Hide Main Page Scrollbar"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.scrollbar?.desc || "Only hide the default scrollbar on the main page."}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={hideScrollbar || globalHideScrollbar} 
                        onChange={(val) => { if (!globalHideScrollbar) toggleHideScrollbar(val); }} 
                        label={t.scrollbar?.title || "Hide Main Page Scrollbar"} 
                        disabled={globalHideScrollbar}
                    />
                </div>
            </div>

            {/* Global Hide Scrollbar Toggle */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleGlobalHideScrollbar(!globalHideScrollbar)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.globalScrollbar?.title || "Hide All Scrollbars"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.globalScrollbar?.desc || "Globally hide scrollbars for all elements, including inside modals."}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={globalHideScrollbar} 
                        onChange={toggleGlobalHideScrollbar} 
                        label={t.globalScrollbar?.title || "Hide All Scrollbars"} 
                    />
                </div>
            </div>
            {/* Disable Animations */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                onClick={() => toggleDisableAnimations(!disableAnimations)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.animations?.title || 'Disable Animations'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.animations?.desc || 'Turn off all page transitions and card loading animations.'}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={disableAnimations} 
                        onChange={toggleDisableAnimations} 
                        label={t.animations?.title} 
                    />
                </div>
            </div>

            {/* Fast Animations */}
            <div 
                className={`bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800 ${disableAnimations ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => !disableAnimations && toggleFastAnimations(!fastAnimations)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.fastAnimations?.title || 'Fast Transitions'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.fastAnimations?.desc || 'Speed up all transition animations (hover, expand, etc).'}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={fastAnimations} 
                        onChange={toggleFastAnimations} 
                        label={t.fastAnimations?.title}
                        disabled={disableAnimations} 
                    />
                </div>
            </div>

            {/* Collapse Header Menu Desktop */}
            <div 
                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800 max-lg:opacity-50 max-lg:pointer-events-none"
                onClick={() => toggleCollapseHeader(!collapseHeader)}
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.collapseHeader?.title || 'Collapse Header (Desktop)'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        {t.collapseHeader?.desc || 'Use a collapsed menu for header actions on desktop screens.'}
                    </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch 
                        checked={collapseHeader} 
                        onChange={toggleCollapseHeader} 
                        label={t.collapseHeader?.title} 
                    />
                </div>
            </div>

            {/* Enable UDP Toggle */}
            {toggleEnableUdp && (
                <div 
                    className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer transition-colors hover:border-indigo-200 dark:hover:border-indigo-800"
                    onClick={() => toggleEnableUdp(!enableUdp)}
                >
                    <div className="flex flex-col gap-1 pr-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {t.udpBypass?.title || 'Enable UDP Network (Bypass CORS)'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {t.udpBypass?.desc || 'Use UDP mapping API to fetch network tools endpoints entirely bypassing all CORS errors.'}
                        </p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch 
                            checked={!!enableUdp} 
                            onChange={toggleEnableUdp} 
                            label={t.udpBypass?.title || 'Enable UDP'} 
                        />
                    </div>
                </div>
            )}

            {/* Custom Visibility */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.cardVisibility?.title || 'Custom Display Items'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.cardVisibility?.desc || 'Hide specific cards from the main dashboard if you don\'t need them.'}
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableCards.map(card => {
                        const isHidden = hiddenCards.includes(card.id);
                        return (
                            <button
                                key={card.id}
                                onClick={() => toggleCardHide(card.id)}
                                className={`
                                    flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors border text-left
                                    ${isHidden 
                                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 line-through' 
                                        : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'}
                                `}
                            >
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isHidden ? 'bg-slate-300 dark:bg-slate-600' : 'bg-indigo-500'}`} />
                                <span className="truncate">{card.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
