
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Eye, Play, Trash2, Copy, Check, Maximize2, TriangleAlert, Zap, Edit3, Globe, Database, Smartphone, Shield, X, Download } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface DeveloperTabProps {
    t: Translation['settingsModal'];
    isFloating: boolean;
    toggleFloat: () => void;
}

type SubTab = 'events' | 'inspector' | 'console';

interface PresetCommand {
    label: string;
    cmd: string;
    desc: string;
    icon: React.ElementType;
    autoRun?: boolean;
}

const PRESET_COMMANDS: PresetCommand[] = [
    { label: 'User Agent', cmd: 'navigator.userAgent', desc: 'View browser UA string', icon: Globe, autoRun: true },
    { label: 'Screen Info', cmd: '`${window.innerWidth}x${window.innerHeight} (PR: ${window.devicePixelRatio})`', desc: 'Resolution & Pixel Ratio', icon: Smartphone, autoRun: true },
    { label: 'Cookies', cmd: 'document.cookie', desc: 'Show all cookies', icon: Shield, autoRun: true },
    { label: 'Clear LocalStorage', cmd: 'localStorage.clear(); "LocalStorage Cleared"', desc: 'Wipe local storage', icon: Trash2, autoRun: true },
    { label: 'Edit Page', cmd: 'document.body.contentEditable = document.body.contentEditable === "true" ? "false" : "true"', desc: 'Toggle contentEditable', icon: Edit3, autoRun: true },
    { label: 'Performance', cmd: 'performance.now()', desc: 'Current timestamp (ms)', icon: Activity, autoRun: true },
    { label: 'Network Info', cmd: 'navigator.connection', desc: 'Connection details', icon: Activity, autoRun: true },
    { label: 'Memory', cmd: 'performance.memory', desc: 'Heap size (Chrome only)', icon: Database, autoRun: true },
];

export const DeveloperTab: React.FC<DeveloperTabProps> = ({ t, isFloating, toggleFloat }) => {
    const [subTab, setSubTab] = useState<SubTab>('events');
    const [logs, setLogs] = useState<string[]>([]);
    const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
    const [inputCmd, setInputCmd] = useState('');
    const [inspectorObj, setInspectorObj] = useState('navigator');
    const [showPresets, setShowPresets] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [outputCopied, setOutputCopied] = useState(false);
    
    // Risk Acceptance State - Initialize directly from localStorage to prevent flash
    const [hasAcceptedRisk, setHasAcceptedRisk] = useState(() => {
        return localStorage.getItem('developer_risk_accepted') === 'true';
    });
    const [isOverlayFading, setIsOverlayFading] = useState(false);

    const handleAcceptRisk = () => {
        setIsOverlayFading(true);
        setTimeout(() => {
            setHasAcceptedRisk(true);
            localStorage.setItem('developer_risk_accepted', 'true');
        }, 300); // Match CSS transition duration
    };

    // Event Monitor Logic
    useEffect(() => {
        if (!hasAcceptedRisk) return;

        const addLog = (type: string, detail: string) => {
            const time = new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                fractionalSecondDigits: 3 
            } as any);
            setLogs(prev => [`[${time}] ${type}: ${detail}`, ...prev].slice(0, 100));
        };

        const handleResize = () => addLog('resize', `${window.innerWidth}x${window.innerHeight}`);
        const handleVisibility = () => addLog('visibilitychange', document.visibilityState);
        const handleOnline = () => addLog('network', 'online');
        const handleOffline = () => addLog('network', 'offline');
        const handleFocus = () => addLog('window', 'focus');
        const handleBlur = () => addLog('window', 'blur');
        
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, [hasAcceptedRisk]); 

    // Inspector Logic: Safe object extraction
    const getInspectData = (key: string) => {
        let target: any = {};
        if (key === 'navigator') target = navigator;
        else if (key === 'screen') target = screen;
        else if (key === 'location') target = location;
        else if (key === 'performance') target = performance;
        else if (key === 'document') target = document;

        const result: Record<string, any> = {};
        for (const k in target) {
            try {
                const val = target[k];
                if (typeof val !== 'function') {
                    result[k] = val;
                }
            } catch (e) {}
        }
        if (key === 'navigator') {
             // @ts-ignore
             if (navigator.userAgentData) result['userAgentData'] = navigator.userAgentData;
             if ((navigator as any).connection) result['connection'] = (navigator as any).connection;
             // @ts-ignore
             if (navigator.deviceMemory) result['deviceMemory'] = navigator.deviceMemory;
        }

        return JSON.stringify(result, null, 2);
    };

    // Console Logic
    const runConsole = (cmdOverride?: string) => {
        const cmdToRun = cmdOverride || inputCmd;
        if (!cmdToRun.trim()) return;
        
        // Hide presets if running
        setShowPresets(false);
        if (!cmdOverride) {
            // Keep input if typed manually, maybe clear if desired? 
            // For now let's keep it to allow editing
        }

        try {
            // eslint-disable-next-line no-eval
            const res = eval(cmdToRun); 
            let output = String(res);
            if (typeof res === 'object') {
                try { output = JSON.stringify(res, null, 2); } catch(e) {}
            }
            setConsoleOutput(output);
        } catch (e: any) {
            setConsoleOutput(`Error: ${e.message}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputCmd(val);
        // Show presets if input starts with backslash
        if (val.startsWith('\\')) {
            setShowPresets(true);
        } else {
            setShowPresets(false);
        }
    };

    const applyPreset = (preset: PresetCommand, runNow: boolean) => {
        if (runNow) {
            setInputCmd(preset.cmd);
            runConsole(preset.cmd);
        } else {
            setInputCmd(preset.cmd);
            setShowPresets(false);
        }
    };

    const clearInput = () => {
        setInputCmd('');
        setShowPresets(false);
    };

    const copyLogs = () => {
        navigator.clipboard.writeText(logs.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyConsoleOutput = () => {
        if (!consoleOutput) return;
        navigator.clipboard.writeText(consoleOutput);
        setOutputCopied(true);
        setTimeout(() => setOutputCopied(false), 2000);
    };

    const downloadConsoleOutput = () => {
        if (!consoleOutput) return;
        const blob = new Blob([consoleOutput], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-output-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Content JSX
    const content = (
        <div className="flex flex-col h-full overflow-hidden text-xs font-mono">
            {/* EVENTS VIEW */}
            {subTab === 'events' && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                        {logs.length === 0 && <div className="text-slate-500 italic">{t.dev_events_placeholder}</div>}
                        {logs.map((log, idx) => (
                            <div key={idx} className="text-green-400 break-all border-b border-slate-800/50 pb-1">
                                <span className="text-slate-500 mr-2 opacity-50">{idx + 1}</span>
                                {log}
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                    <div className="p-2 border-t border-slate-700 bg-slate-800 flex justify-between shrink-0">
                        <div className="text-slate-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyLogs} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] flex items-center gap-1">
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                                {t.dev_copy_log}
                            </button>
                            <button onClick={() => setLogs([])} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[10px] flex items-center gap-1">
                                <Trash2 size={10} />
                                {t.dev_clear}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* INSPECTOR VIEW */}
            {subTab === 'inspector' && (
                <div className="flex flex-col h-full">
                    <div className="p-2 bg-slate-800 border-b border-slate-700 flex gap-2 shrink-0 overflow-x-auto">
                        {['navigator', 'screen', 'location', 'performance'].map(obj => (
                            <button 
                                key={obj}
                                onClick={() => setInspectorObj(obj)}
                                className={`px-3 py-1 rounded text-[10px] uppercase font-bold transition-colors whitespace-nowrap ${inspectorObj === obj ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                            >
                                {obj}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 bg-slate-900">
                        <pre className="text-blue-300 whitespace-pre-wrap break-all">
                            {getInspectData(inspectorObj)}
                        </pre>
                    </div>
                </div>
            )}

            {/* CONSOLE VIEW */}
            {subTab === 'console' && (
                <div className="flex flex-col h-full relative">
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-900 border-b border-slate-700 relative group">
                        {consoleOutput ? (
                            <>
                                <pre className={`${consoleOutput.startsWith('Error') ? 'text-red-400' : 'text-yellow-300'} whitespace-pre-wrap break-all pb-4`}>
                                    {consoleOutput}
                                </pre>
                                {/* Output Actions Toolbar */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button 
                                        onClick={copyConsoleOutput} 
                                        className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
                                        title={t.dev_output_copy}
                                    >
                                        {outputCopied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                    </button>
                                    <button 
                                        onClick={downloadConsoleOutput} 
                                        className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
                                        title={t.dev_output_download}
                                    >
                                        <Download size={12} />
                                    </button>
                                    <button 
                                        onClick={() => setConsoleOutput(null)} 
                                        className="p-1.5 bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-slate-700 border border-slate-700 rounded backdrop-blur-sm transition-colors"
                                        title={t.dev_output_clear}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-600 italic">{t.dev_result_placeholder}</div>
                        )}
                    </div>
                    
                    {/* Command Presets Popup */}
                    {showPresets && (
                        <div className="absolute bottom-[50px] left-2 right-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col overflow-hidden max-h-60">
                            <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-700 text-[10px] text-slate-400 font-medium uppercase tracking-wider backdrop-blur-sm shrink-0">
                                {t.dev_quick_commands}
                            </div>
                            <div className="overflow-y-auto">
                                {PRESET_COMMANDS.map((preset, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center justify-between p-2 hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                        onClick={() => applyPreset(preset, false)}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-1.5 bg-slate-700 text-indigo-400 rounded group-hover:bg-indigo-900/30 group-hover:text-indigo-300 transition-colors">
                                                <preset.icon size={14} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-slate-200 font-medium truncate">{preset.label}</span>
                                                <span className="text-[10px] text-slate-500 truncate">{preset.desc}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); applyPreset(preset, true); }}
                                            className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-slate-600 rounded transition-colors"
                                            title={t.dev_run_now}
                                        >
                                            <Zap size={14} fill="currentColor" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-2 bg-slate-800 flex gap-2 shrink-0 relative z-20 items-center">
                        <div className="flex items-center text-slate-400 pl-2">
                            <span className="font-bold text-lg">&gt;</span>
                        </div>
                        <div className="flex-1 relative flex items-center">
                            <input 
                                type="text"
                                value={inputCmd}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && runConsole()}
                                placeholder={t.dev_console_placeholder}
                                className="w-full bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-slate-600 pr-8"
                                autoFocus
                            />
                            {inputCmd && (
                                <button 
                                    onClick={clearInput}
                                    className="absolute right-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                                    title={t.dev_input_clear}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button onClick={() => runConsole()} className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center self-stretch">
                            <Play size={14} fill="currentColor" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Warning Overlay JSX
    const warningOverlay = (
        <div 
            className={`absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm transition-all duration-300 ease-out ${isOverlayFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-all duration-300 ease-out transform ${isOverlayFading ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}
            >
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-500">
                    <TriangleAlert size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {t.dev_warning_title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {t.dev_warning_desc}
                </p>
                <button 
                    onClick={handleAcceptRisk}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 text-sm"
                >
                    {t.dev_warning_agree}
                </button>
            </div>
        </div>
    );

    // If currently floating, we render the header + content directly, wrapper is handled by App.tsx
    if (isFloating) {
        return (
            <div className="relative h-full flex flex-col">
                <div className="flex p-1 bg-slate-800 border-b border-slate-700 shrink-0 gap-1">
                    <button onClick={() => setSubTab('events')} className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === 'events' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>{t.dev_events}</button>
                    <button onClick={() => setSubTab('inspector')} className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === 'inspector' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>{t.dev_inspector}</button>
                    <button onClick={() => setSubTab('console')} className={`flex-1 py-1.5 text-xs font-medium rounded ${subTab === 'console' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>{t.dev_console}</button>
                </div>
                {content}
                {!hasAcceptedRisk && warningOverlay}
            </div>
        );
    }

    // Docked Mode
    return (
        <div className="flex flex-col h-full space-y-4 relative">
            {/* Controls */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 gap-1">
                <button 
                    onClick={() => setSubTab('events')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${subTab === 'events' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                    <Activity size={14} />
                    {t.dev_events}
                </button>
                <button 
                    onClick={() => setSubTab('inspector')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${subTab === 'inspector' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                    <Eye size={14} />
                    {t.dev_inspector}
                </button>
                <button 
                    onClick={() => setSubTab('console')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${subTab === 'console' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                    <Terminal size={14} />
                    {t.dev_console}
                </button>
                <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1 self-center h-6"></div>
                <button 
                    onClick={toggleFloat}
                    className={`px-3 flex items-center justify-center rounded-md transition-all ${isFloating ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    title={t.dev_float}
                >
                    <Maximize2 size={14} />
                </button>
            </div>

            {/* Docked Content Area */}
            {!isFloating ? (
                <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner relative">
                    {content}
                    {!hasAcceptedRisk && warningOverlay}
                </div>
            ) : (
                /* Placeholder when floating */
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Maximize2 size={32} className="opacity-20" />
                    <p className="text-sm">Tool is currently floating.</p>
                    <button onClick={toggleFloat} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">{t.dev_dock_back}</button>
                </div>
            )}
        </div>
    );
};
