
import React, { useEffect, useState, useRef } from 'react';
import { RotateCcw, Check, Download, Upload, Terminal, Copy, Radio, HelpCircle, Scale, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Translation } from '../../utils/i18n/types';
import { USERSCRIPT_CODE } from '../../utils/userscript';

interface GeneralTabProps {
    t: Translation['settings']['general'];
    timeFormat: '12' | '24';
    setTimeFormat: (format: '12' | '24') => void;
    enableUdp?: boolean;
    toggleEnableUdp?: (value: boolean) => void;
    hiddenCards?: string[];
    setHiddenCards?: (cards: string[]) => void;
    restoreAllNotifications?: () => void;
    dismissedNotificationsCount?: number;
    translationDict: Translation;
    showQuickSummary?: boolean;
    toggleShowQuickSummary?: (val: boolean) => void;
    lang: string;
    imageExportScale?: number;
    updateImageExportScale?: (value: number) => void;
    pdfExportFormat?: 'a4' | 'letter' | 'legal';
    updatePdfExportFormat?: (value: 'a4' | 'letter' | 'legal') => void;
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
    hiddenCards = [],
    setHiddenCards,
    restoreAllNotifications,
    dismissedNotificationsCount = 0,
    translationDict,
    showQuickSummary = false,
    toggleShowQuickSummary,
    lang: _lang,
    imageExportScale,
    updateImageExportScale,
    pdfExportFormat,
    updatePdfExportFormat
}) => {
    const [udpSupported, setUdpSupported] = useState<boolean | null>(() => {
        const stored = localStorage.getItem('udp_supported');
        return stored ? stored === 'true' : null;
    });

    const [useUserscript, setUseUserscript] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('use_userscript') === 'true';
        }
        return false;
    });
    const [userscriptConnected, setUserscriptConnected] = useState(false);
    const [checkingUserscript, setCheckingUserscript] = useState(false);
    const [scriptCopied, setScriptCopied] = useState(false);
    const [showInstallGuide, setShowInstallGuide] = useState(false);
    const [showUdpDetails, setShowUdpDetails] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    const checkUserscriptStatus = React.useCallback(() => {
        setCheckingUserscript(true);
        
        const handlePong = () => {
            setUserscriptConnected(true);
            setCheckingUserscript(false);
            window.removeEventListener('PONG_CORS_HELPER', handlePong);
        };

        window.addEventListener('PONG_CORS_HELPER', handlePong);
        window.dispatchEvent(new CustomEvent('PING_CORS_HELPER'));

        setTimeout(() => {
            setCheckingUserscript(current => {
                if (current) {
                    setUserscriptConnected(false);
                    window.removeEventListener('PONG_CORS_HELPER', handlePong);
                    return false;
                }
                return current;
            });
        }, 800);
    }, []);

    useEffect(() => {
        checkUserscriptStatus();
    }, [checkUserscriptStatus]);

    const handleToggleUserscript = (val: boolean) => {
        setUseUserscript(val);
        localStorage.setItem('use_userscript', val ? 'true' : 'false');
    };

    const handleCopyScriptCode = () => {
        navigator.clipboard.writeText(USERSCRIPT_CODE);
        setScriptCopied(true);
        setTimeout(() => setScriptCopied(false), 2000);
    };

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
            {toggleEnableUdp ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-4">
                    <div className="flex items-start justify-between">
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
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mt-1">
                                {t.udpBypass?.desc}
                            </p>
                            {!udpSupported && udpSupported !== null ? (
                                <p className="text-xs text-rose-500 font-medium mt-1">
                                    {t.udpBypass?.unsupportedEnv}
                                </p>
                            ) : null}
                            {udpSupported === null ? (
                                <p className="text-xs text-indigo-500 font-medium mt-1 animate-pulse">
                                    {t.udpBypass?.checkingUdp}
                                </p>
                            ) : null}
                            
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => setShowUdpDetails(!showUdpDetails)}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline flex items-center gap-1 cursor-pointer"
                                >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    {t.udpBypass?.limitationsTitle}
                                </button>
                            </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0 pt-1">
                            <Switch checked={!!enableUdp} onChange={() => { if(udpSupported) toggleEnableUdp(!enableUdp); }} disabled={!udpSupported} />
                        </div>
                    </div>
                    {showUdpDetails && t.udpBypass?.limitationsTitle && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                                    {t.udpBypass.prosLabel}
                                </span>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.udpBypass.pros}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-rose-500 block mb-1">
                                    {t.udpBypass.consLabel}
                                </span>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.udpBypass.cons}</p>
                            </div>
                            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 mt-1">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                    {t.udpBypass.limitationsTitle}
                                </span>
                                <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-1 pl-1">
                                    {t.udpBypass.limitationsList.map((lim, idx) => (
                                        <li key={idx} className="leading-relaxed">{lim}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>) : null}
            {/* Tampermonkey CORS Bypass Toggle & Script Settings */}
            {t.userscriptBypass ? (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-5 flex items-start justify-between">
                            <div className="flex flex-col gap-1 pr-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Terminal className="w-5 h-5 text-indigo-500 shrink-0" />
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{t.userscriptBypass.title}</span>
                                    {t.userscriptBypass.recommended && (
                                        <span className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wide shrink-0">
                                            {t.userscriptBypass.recommended}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => checkUserscriptStatus()}
                                        disabled={checkingUserscript}
                                        className="px-2 py-0.5 text-xs rounded-md border bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors ml-2 flex items-center gap-1 shrink-0"
                                    >
                                        <Radio className={`w-3 h-3 ${checkingUserscript ? 'animate-pulse' : ''}`} />
                                        {checkingUserscript ? t.userscriptBypass.checking : t.userscriptBypass.recheck}
                                    </button>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mt-1">
                                    {t.userscriptBypass.desc}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                        userscriptConnected 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${userscriptConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                        {userscriptConnected ? t.userscriptBypass.statusActive : t.userscriptBypass.statusInactive}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mt-4 flex-wrap w-full">
                                    <a
                                        href="/api/bypass.user.js"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        {t.userscriptBypass.quickInstall}
                                    </a>
                                    
                                    <button
                                        onClick={() => setShowInstallGuide(!showInstallGuide)}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                            showInstallGuide 
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-300' 
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        {t.userscriptBypass.manualInstallBackup}
                                    </button>

                                    <button
                                        onClick={() => setShowComparison(!showComparison)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer transition-all ml-auto ${
                                            showComparison
                                                ? 'text-indigo-700 dark:text-indigo-300 underline font-semibold'
                                                : 'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline'
                                        }`}
                                    >
                                        <Scale className="w-3.5 h-3.5" />
                                        {t.userscriptBypass.comparisonTitle}
                                    </button>
                                </div>
                            </div>
                            <div className="shrink-0 pt-1">
                                <Switch checked={useUserscript} onChange={handleToggleUserscript} />
                            </div>
                        </div>

                        {/* Expandable Installation Guide */}
                        {showInstallGuide && (
                            <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/25 p-5 space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {t.userscriptBypass.installGuide}
                                    </h4>
                                    <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                                        <li><span dangerouslySetInnerHTML={{ __html: t.userscriptBypass.steps.step1 }} /></li>
                                        <li><span dangerouslySetInnerHTML={{ __html: t.userscriptBypass.steps.step2 }} /></li>
                                        <li><span dangerouslySetInnerHTML={{ __html: t.userscriptBypass.steps.step3 }} /></li>
                                        <li><span dangerouslySetInnerHTML={{ __html: t.userscriptBypass.steps.step4 }} /></li>
                                    </ol>
                                </div>

                                <div className="relative">
                                    <pre className="text-[10px] font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-48 select-all text-slate-600 dark:text-slate-400">
                                        {USERSCRIPT_CODE}
                                    </pre>
                                    <Button
                                        size="xs"
                                        onClick={handleCopyScriptCode}
                                        variant="soft"
                                        className="absolute top-2.5 right-2.5 shadow-sm"
                                        leftIcon={scriptCopied ? <Check size={12} /> : <Copy size={12} />}
                                    >
                                        {scriptCopied ? t.userscriptBypass.copied : t.userscriptBypass.copyScript}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {t.userscriptBypass?.pros && (
                            <div className="mx-5 mb-5 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                                        {t.udpBypass.prosLabel}
                                    </span>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.userscriptBypass.pros}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-rose-500 block mb-1">
                                        {t.udpBypass.consLabel}
                                    </span>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t.userscriptBypass.cons}</p>
                                </div>
                            </div>
                        )}

                        {/* Expandable Comparison Table */}
                        {showComparison && t.userscriptBypass?.comparisonTitle && (
                            <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/25 p-5 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Scale className="w-4 h-4 text-indigo-500 shrink-0" />
                                    {t.userscriptBypass.comparisonTitle}
                                </h4>
                                <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                                <th className="p-3 font-semibold">{t.userscriptBypass.methodHeader}</th>
                                                <th className="p-3 font-semibold">{t.userscriptBypass.udpBypassHeader}</th>
                                                <th className="p-3 font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                    {t.userscriptBypass.userscriptBypassHeader}
                                                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded text-[9px]">
                                                        {t.userscriptBypass.recommended}
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-500 dark:text-slate-400">
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Routing Path" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "路由路徑" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "路由路径" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "ルーティング経路" : "Маршрутизация"}
                                                </td>
                                                <td className="p-3">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Cloud Proxy Server (decryption risk)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "雲端代理伺服器 (潛在解密風險)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "云端代理服务器 (潜在解密风险)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "クラウドプロキシサーバー (解読リスクあり)" : "Облачный прокси (риск дешифрования)"}
                                                </td>
                                                <td className="p-3 text-indigo-600 dark:text-indigo-400 font-medium">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Direct Local Connection (Fully Private)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "本地真實直連 (完全私密/安全)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "本地真实直连 (完全私密/安全)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "ローカル直接接続 (完全非公開)" : "Прямое локальное подключение (приватно)"}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Outbound Latency" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "傳輸延遲" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "传输延迟" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "送信遅延" : "Задержка"}
                                                </td>
                                                <td className="p-3">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Medium-High (due to hops)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "中等至偏高 (需伺服器中轉)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "中等至偏高 (需服务器中转)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "中〜高 (中継ノード経由のため)" : "Средняя/Высокая (из-за узлов)"}
                                                </td>
                                                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Extremely Low (Direct to target)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "極低 (與目標節點直接通訊)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "极低 (与目标节点直接通讯)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "極低 (ターゲットに直接通信)" : "Минимальная (напрямую к цели)"}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Outbound IP Detected" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "檢測到出口 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "检测到出口 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "検出されるIPアドレス" : "Определяемый IP"}
                                                </td>
                                                <td className="p-3">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Proxy Node IP" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "雲端代理伺服器 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "云端代理服务器 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "プロキシサーバーのIP" : "IP-адрес прокси-узла"}
                                                </td>
                                                <td className="p-3 text-indigo-600 dark:text-indigo-400 font-medium">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Your Real Internet IP" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "您的真實寬頻/本地 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "您的真实宽带/本地 IP" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "実際のプロバイダIP" : "Ваш реальный интернет IP"}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Concurrency & Limits" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "併發與頻率限制" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "并发与频率限制" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "同時実行制限" : "Лимиты частоты"}
                                                </td>
                                                <td className="p-3">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Subject to rate limiters" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "受限於伺服器防刷與流量頻控" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "受限于服务器防刷与流量频控" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "サーバー側制限あり" : "Зависит от лимитов прокси"}
                                                </td>
                                                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Unlimited (Uncapped)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "無任何限制" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "无任何限制" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "無制限" : "Без ограничений"}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Initial Setup" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "首次安裝配置" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "首次安装配置" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "初期セットアップ" : "Начальная настройка"}
                                                </td>
                                                <td className="p-3">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Instant (1-click toggle)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "免配置 (一鍵開啟)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "免配置 (一键开启)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "不要 (ワンクリック起動)" : "Мгновенно (в 1 клик)"}
                                                </td>
                                                <td className="p-3 text-slate-600 dark:text-slate-400">
                                                    {t.userscriptBypass.methodHeader === "Feature" ? "Required (1-time script install)" : 
                                                     t.userscriptBypass.methodHeader === "特性對比" ? "需要首次配置安裝 (約1分鐘)" : 
                                                     t.userscriptBypass.methodHeader === "特性对比" ? "需要首次配置安装 (约1分钟)" : 
                                                     t.userscriptBypass.methodHeader === "特性の比較" ? "必要 (スクリプト初回インストールのみ)" : "Нужна (разовый импорт скрипта)"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
            
            {/* Application Export Settings */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t.appExportSettings?.title || "「导出」功能设置"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.appExportSettings?.desc || "控制仪表盘「导出」功能的格式与清晰度。"}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t.appExportSettings?.imageScale || "图片上采样率"}
                        </label>
                        <Select 
                            value={imageExportScale || 2}
                            onChange={(value: unknown) => updateImageExportScale ? updateImageExportScale(Number(value)) : null}
                            options={[
                                { id: 1, label: t.appExportSettings?.scales?.scale1 || '1x' },
                                { id: 2, label: t.appExportSettings?.scales?.scale2 || '2x' },
                                { id: 3, label: t.appExportSettings?.scales?.scale3 || '3x' },
                                { id: 4, label: t.appExportSettings?.scales?.scale4 || '4x' }
                            ]}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t.appExportSettings?.pdfFormat || "PDF 页面格式"}
                        </label>
                        <Select 
                            value={pdfExportFormat || 'a4'}
                            onChange={(value: unknown) => updatePdfExportFormat ? updatePdfExportFormat(value as 'a4' | 'letter' | 'legal') : null}
                            options={[
                                { id: 'a4', label: t.appExportSettings?.formats?.a4 || 'A4' },
                                { id: 'letter', label: t.appExportSettings?.formats?.letter || 'Letter' },
                                { id: 'legal', label: t.appExportSettings?.formats?.legal || 'Legal' }
                            ]}
                        />
                    </div>
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
