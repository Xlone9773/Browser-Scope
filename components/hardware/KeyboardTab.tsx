
import React, { useState, useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';

interface KeyboardTabProps {
    t: Translation['hardwareToolsModal'];
}

interface KeyLog {
    key: string;
    code: string;
    timestamp: number;
}

export const KeyboardTab: React.FC<KeyboardTabProps> = ({ t }) => {
    const [lastKey, setLastKey] = useState<KeyLog | null>(null);
    const [keyHistory, setKeyHistory] = useState<string[]>([]);
    const keyboardInputRef = useRef<HTMLInputElement>(null);

    const handleKeyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const keyName = e.code || e.key;
        setLastKey({
            key: e.key,
            code: e.code,
            timestamp: Date.now()
        });
        setKeyHistory(prev => {
            if (!prev.includes(keyName)) {
                return [...prev, keyName];
            }
            return prev;
        });
    };

    // Helper to format timestamp
    const formatKeyTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            fractionalSecondDigits: 3 
        } as any /* eslint-disable-line @typescript-eslint/no-explicit-any */);
    };

    useEffect(() => {
        if (keyboardInputRef.current) {
            setTimeout(() => {
                keyboardInputRef.current?.focus();
            }, 100);
        }
    }, []);

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300 gap-4">
            {/* Last Key Display */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 shadow-sm">
                {lastKey ? (
                    <>
                        {/* Large Font for emphasis */}
                        <div className="text-8xl md:text-9xl font-black text-indigo-600 dark:text-indigo-400 mb-6 animate-in zoom-in duration-100">
                            {lastKey.key === ' ' ? 'Space' : lastKey.key}
                        </div>
                        <div className="flex gap-4 text-xs font-mono text-slate-500">
                            <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                                Code: {lastKey.code}
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
                                Time: {formatKeyTime(lastKey.timestamp)}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-slate-400 text-center opacity-50">
                        <Keyboard size={64} className="mx-auto mb-4" />
                        <p className="text-lg font-medium">{t.key_instruction}</p>
                    </div>
                )}
            </div>

            {/* History */}
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 h-[100px] overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2 sticky top-0 bg-slate-100 dark:bg-slate-800/0 backdrop-blur-sm pb-1 flex justify-between">
                    <span>{t.key_history} ({keyHistory.length})</span>
                    {keyHistory.length > 0 && (
                        <button onClick={() => setKeyHistory([])} className="text-[10px] text-indigo-500 hover:underline">Clear</button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {keyHistory.map((k, i) => (
                        <span key={i} className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm animate-in zoom-in duration-200">
                            {k === ' ' ? 'Space' : k}
                        </span>
                    ))}
                </div>
            </div>

            {/* Input Field */}
            <div className="relative">
                <input
                    ref={keyboardInputRef}
                    type="text"
                    placeholder={t.key_input_placeholder || "Type here..."}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 font-medium shadow-sm transition-all"
                    onKeyDown={handleKeyInput}
                    autoComplete="off"
                    autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Keyboard size={18} />
                </div>
            </div>
        </div>
    );
};
