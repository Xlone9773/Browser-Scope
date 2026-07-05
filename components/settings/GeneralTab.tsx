
import React, { useEffect, useState } from 'react';

interface GeneralTabProps {
    t: any /* eslint-disable-line @typescript-eslint/no-explicit-any */; // Using any /* eslint-disable-line @typescript-eslint/no-explicit-any */ for t because Translation type was getting complicated with extensions
    timeFormat: '12' | '24';
    setTimeFormat: (format: '12' | '24') => void;
    enableUdp?: boolean;
    toggleEnableUdp?: (value: boolean) => void;
    hiddenCards: string[];
    setHiddenCards: (cards: string[]) => void;
    restoreAllNotifications: () => void;
    dismissedNotificationsCount: number;
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
    restoreAllNotifications,
    dismissedNotificationsCount,
    translationDict
}) => {
    const [udpSupported, setUdpSupported] = useState<boolean | null>(() => {
        const stored = localStorage.getItem('udp_supported');
        return stored ? stored === 'true' : null;
    });

    const checkUdpSupport = React.useCallback((force = false) => {
        if (!force && udpSupported !== null) return;
        
        // Use timeout to prevent synchronous state update in effect
        if (force) {
            setTimeout(() => setUdpSupported(null), 0);
        }
        
        fetch('/api/udp-status')
            .then(res => res.json())
            .then(data => {
                setUdpSupported(data.supported);
                localStorage.setItem('udp_supported', data.supported ? 'true' : 'false');
            })
            .catch(() => {
                setUdpSupported(false);
                localStorage.setItem('udp_supported', 'false');
            });
    }, [udpSupported]);

    useEffect(() => {
        if (toggleEnableUdp && udpSupported === null) {
            checkUdpSupport();
        }
    }, [toggleEnableUdp, checkUdpSupport, udpSupported]);

    const sectionsObj = translationDict?.sections || {};
    const availableCards = [
        { id: 'environment', name: sectionsObj.environment },
        { id: 'system', name: sectionsObj.system },
        { id: 'hardware', name: sectionsObj.hardware },
        { id: 'display', name: sectionsObj.display },
        { id: 'network', name: sectionsObj.network },
        { id: 'security', name: sectionsObj.security },
        { id: 'fingerprint', name: sectionsObj.fingerprints },
        { id: 'ai', name: sectionsObj.ai_compute },
        { id: 'location', name: sectionsObj.location },
        { id: 'storage', name: sectionsObj.storage },
        { id: 'permissions', name: sectionsObj.permissions },
        { id: 'media_devices', name: sectionsObj.media_devices },
        { id: 'media_capabilities', name: sectionsObj.media_caps },
        { id: 'user_agent', name: sectionsObj.user_agent },
        { id: 'pwa', name: sectionsObj.pwa },
        { id: 'features', name: sectionsObj.features },
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
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                {t.udpBypass?.title}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    checkUdpSupport(true);
                                }}
                                disabled={udpSupported === null}
                                className={`px-2 py-0.5 text-xs rounded-md border ${udpSupported === null ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50'} transition-colors ml-2`}
                            >
                                {t.udpBypass?.recheckUdp}
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                            {t.udpBypass?.desc}
                        </p>
                        {!udpSupported && udpSupported !== null && (
                            <p className="text-xs text-rose-500 font-medium mt-1">
                                {t.udpBypass?.unsupportedEnv}
                            </p>
                        )}
                        {udpSupported === null && (
                            <p className="text-xs text-indigo-500 font-medium mt-1 animate-pulse">
                                {t.udpBypass?.checkingUdp}
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
                        {t.cardVisibility?.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.cardVisibility?.desc}
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

            {/* Restore Notifications */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.restoreNotifications?.title || "Restore Notifications"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.restoreNotifications?.desc || "Bring back all previously dismissed notification cards."}
                    </p>
                </div>
                <div>
                    <button
                        onClick={restoreAllNotifications}
                        disabled={dismissedNotificationsCount === 0}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border
                            ${dismissedNotificationsCount === 0 
                                ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                            }
                        `}
                    >
                        {dismissedNotificationsCount === 0 
                            ? (t.restoreNotifications?.empty || "No dismissed notifications")
                            : (t.restoreNotifications?.button || "Restore All")}
                    </button>
                </div>
            </div>
        </div>
    );
};
