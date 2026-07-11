
import React, { useEffect, useState, useRef } from 'react';
import { RotateCcw, Check, Download, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

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
    showQuickSummary: boolean;
    toggleShowQuickSummary: (val: boolean) => void;
    lang: string;
}

// Custom Premium Restore Button Component
interface CustomRestoreButtonProps {
    onClick: () => void;
    disabled: boolean;
    activeText: string;
    inactiveText: string;
}

const CustomRestoreButton: React.FC<CustomRestoreButtonProps> = ({ onClick, disabled, activeText, inactiveText }) => {
    return (
        <Button
            variant={disabled ? "secondary" : "soft"}
            onClick={onClick}
            disabled={disabled}
            size="md"
            leftIcon={disabled ? <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> : <RotateCcw className="w-4.5 h-4.5 shrink-0 transition-transform duration-500 group-hover:rotate-180" />}
            className="min-w-[140px] font-semibold rounded-xl group select-none active:scale-[0.97] transition-all"
        >
            <span className="truncate">{disabled ? activeText : inactiveText}</span>
        </Button>
    );
};

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
    translationDict,
    showQuickSummary,
    toggleShowQuickSummary,
    lang
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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportSettings = () => {
        const data: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                data[key] = localStorage.getItem(key) || '';
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `browserscope-settings-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string);
                if (typeof parsed === 'object' && parsed !== null) {
                    for (const key in parsed) {
                        if (typeof parsed[key] === 'string') {
                            localStorage.setItem(key, parsed[key]);
                        }
                    }
                    alert(t.exportSettings?.importSuccess || 'Settings imported successfully! The page will now reload.');
                    window.location.reload();
                } else {
                    throw new Error('Invalid format');
                }
            } catch (err) {
                console.error('Failed to parse settings file', err);
                alert(t.exportSettings?.importError || 'Invalid settings file.');
            }
        };
        reader.readAsText(file);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
            {toggleEnableUdp ? (<div 
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
                    {!udpSupported && udpSupported !== null ? (<p className="text-xs text-rose-500 font-medium mt-1">
                        {t.udpBypass?.unsupportedEnv}
                    </p>) : null}
                    {udpSupported === null ? (<p className="text-xs text-indigo-500 font-medium mt-1 animate-pulse">
                        {t.udpBypass?.checkingUdp}
                    </p>) : null}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Switch checked={!!enableUdp} onChange={() => { if(udpSupported) toggleEnableUdp(!enableUdp); }} disabled={!udpSupported} />
                </div>
            </div>) : null}
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
            {/* Quick Summary Visibility */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.quickSummaryVisibility?.title || "Quick Summary"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.quickSummaryVisibility?.desc || "Bring back the quick summary widget at the top of the main dashboard."}
                    </p>
                </div>
                <div>
                    <CustomRestoreButton 
                        onClick={() => toggleShowQuickSummary(true)}
                        disabled={showQuickSummary}
                        activeText={t.quickSummaryVisibility?.activeState || "Showing"}
                        inactiveText={t.quickSummaryVisibility?.restoreBtn || "Restore Display"}
                    />
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
                    <CustomRestoreButton 
                        onClick={restoreAllNotifications}
                        disabled={dismissedNotificationsCount === 0}
                        activeText={t.restoreNotifications?.empty || "No dismissed notifications"}
                        inactiveText={t.restoreNotifications?.button || "Restore All"}
                    />
                </div>
            </div>
            
            {/* Export & Import Settings */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.exportSettings?.title || "Export & Import Settings"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.exportSettings?.desc || "Export your current settings and preferences, or import them to quickly configure the application after migrating platforms."}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <input 
                        type="file" 
                        accept="application/json" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleImportSettings} 
                    />
                    <Button 
                        variant="soft" 
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Upload size={16} />}
                        className="font-medium"
                    >
                        {t.exportSettings?.importBtn || "Import"}
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleExportSettings}
                        leftIcon={<Download size={16} />}
                        className="font-medium"
                    >
                        {t.exportSettings?.exportBtn || "Export"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
