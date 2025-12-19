
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Eye, Play, Trash2, Copy, Check } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface DeveloperTabProps {
    t: Translation['settingsModal'];
}

type SubTab = 'events' | 'inspector' | 'console';

export const DeveloperTab: React.FC<DeveloperTabProps> = ({ t }) => {
    const [subTab, setSubTab] = useState<SubTab>('events');
    const [logs, setLogs] = useState<string[]>([]);
    const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
    const [inputCmd, setInputCmd] = useState('');
    const [inspectorObj, setInspectorObj] = useState('navigator');
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    // Event Monitor Logic
    useEffect(() => {
        if (subTab !== 'events') return;

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
    }, [subTab]);

    // Inspector Logic: Safe object extraction
    const getInspectData = (key: string) => {
        let target: any = {};
        if (key === 'navigator') target = navigator;
        else if (key === 'screen') target = screen;
        else if (key === 'location') target = location;
        else if (key === 'performance') target = performance;
        else if (key === 'document') target = document;

        // Naive serialization for native objects that appear empty in JSON.stringify
        const result: Record<string, any> = {};
        for (const k in target) {
            try {
                const val = target[k];
                if (typeof val !== 'function') {
                    result[k] = val;
                }
            } catch (e) {}
        }
        // Specific handling for navigator to get proto properties often hidden
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
    const runConsole = () => {
        if (!inputCmd.trim()) return;
        try {
            // eslint-disable-next-line no-eval
            const res = eval(inputCmd); 
            let output = String(res);
            if (typeof res === 'object') {
                try { output = JSON.stringify(res, null, 2); } catch(e) {}
            }
            setConsoleOutput(output);
        } catch (e: any) {
            setConsoleOutput(`Error: ${e.message}`);
        }
    };

    const copyLogs = () => {
        navigator.clipboard.writeText(logs.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Sub-tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
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
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden font-mono text-xs flex flex-col relative shadow-inner">
                
                {/* EVENTS VIEW */}
                {subTab === 'events' && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                            {logs.length === 0 && <div className="text-slate-600 italic">Listening for window events...</div>}
                            {logs.map((log, idx) => (
                                <div key={idx} className="text-green-400 break-all border-b border-slate-800/50 pb-1">
                                    <span className="text-slate-500 mr-2 opacity-50">{idx + 1}</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                        <div className="p-2 border-t border-slate-700 bg-slate-800 flex justify-between">
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
                        <div className="p-2 bg-slate-800 border-b border-slate-700 flex gap-2">
                            {['navigator', 'screen', 'location', 'performance'].map(obj => (
                                <button 
                                    key={obj}
                                    onClick={() => setInspectorObj(obj)}
                                    className={`px-3 py-1 rounded text-[10px] uppercase font-bold transition-colors ${inspectorObj === obj ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                >
                                    {obj}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                            <pre className="text-blue-300 whitespace-pre-wrap break-all">
                                {getInspectData(inspectorObj)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* CONSOLE VIEW */}
                {subTab === 'console' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-900 border-b border-slate-700">
                            {consoleOutput ? (
                                <pre className={`${consoleOutput.startsWith('Error') ? 'text-red-400' : 'text-yellow-300'} whitespace-pre-wrap break-all`}>
                                    {consoleOutput}
                                </pre>
                            ) : (
                                <div className="text-slate-600 italic">Result will appear here...</div>
                            )}
                        </div>
                        <div className="p-2 bg-slate-800 flex gap-2">
                            <div className="flex items-center text-slate-400 pl-2">
                                <span className="font-bold text-lg">&gt;</span>
                            </div>
                            <input 
                                type="text"
                                value={inputCmd}
                                onChange={(e) => setInputCmd(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && runConsole()}
                                placeholder={t.dev_console_placeholder}
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
                                autoFocus
                            />
                            <button onClick={runConsole} className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center">
                                <Play size={14} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
