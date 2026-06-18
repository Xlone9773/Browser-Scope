
import React, { useEffect, useState } from 'react';


import { Select } from '../ui/Select';

interface GeneralTabProps {
    t: any /* eslint-disable-line @typescript-eslint/no-explicit-any */; // Using any /* eslint-disable-line @typescript-eslint/no-explicit-any */ for t because Translation type was getting complicated with extensions
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
    translationDict: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
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
    timeFormat,
    setTimeFormat,
    enableUdp,
    toggleEnableUdp,
    hiddenCards,
    setHiddenCards,
    translationDict
}) => {
    const [udpSupported, setUdpSupported] = useState<boolean | null>(null);

    useEffect(() => {
        if (toggleEnableUdp) {
            fetch('/api/udp-status')
                .then(res => res.json())
                .then(data => setUdpSupported(data.supported))
                .catch(() => setUdpSupported(false));
        }
    }, [toggleEnableUdp]);

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
                    <Switch checked={timeFormat === '24'} onChange={(val) => setTimeFormat(val ? '24' : '12')} />
                </div>
            </div>

            {/* Enable UDP Toggle */}
            {toggleEnableUdp && (
                <div 
                    className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-colors ${!udpSupported ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                    onClick={() => { if (udpSupported) toggleEnableUdp(!enableUdp); }}
                >
                    <div className="flex flex-col gap-1 pr-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {t.udpBypass?.title || 'Enable UDP Network (Bypass CORS)'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {t.udpBypass?.desc || 'Use UDP mapping API to fetch network tools endpoints entirely bypassing all CORS errors.'}
                        </p>
                        {!udpSupported && udpSupported !== null && (
                            <p className="text-xs text-rose-500 font-medium mt-1">
                                {t.udpBypass?.unsupportedEnv || 'Not supported in the current environment'}
                            </p>
                        )}
                        {udpSupported === null && (
                            <p className="text-xs text-indigo-500 font-medium mt-1 animate-pulse">
                                Checking UDP support...
                            </p>
                        )}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch checked={!!enableUdp} onChange={() => { if(udpSupported) toggleEnableUdp(!enableUdp); }} disabled={!udpSupported} />
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
