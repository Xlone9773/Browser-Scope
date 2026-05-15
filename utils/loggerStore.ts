import { useState, useEffect } from 'react';

export interface ConsoleEntry {
    id: string;
    type: 'input' | 'output' | 'error';
    content: string;
    timestamp: number;
}

class LoggerStore {
    public logs: string[] = [];
    public consoleHistory: ConsoleEntry[] = [];
    public isLoggingEnabled: boolean = localStorage.getItem('developer_logging_enabled') !== 'false';
    public isVConsoleEnabled: boolean = localStorage.getItem('developer_vconsole_enabled') === 'true';

    private logListeners: Set<(logs: string[]) => void> = new Set();
    private consoleListeners: Set<(history: ConsoleEntry[]) => void> = new Set();
    private settingsListeners: Set<() => void> = new Set();

    constructor() {
        try {
            const savedLogs = sessionStorage.getItem('dev_logs');
            if (savedLogs) this.logs = JSON.parse(savedLogs);
            
            const savedConsole = sessionStorage.getItem('dev_console');
            if (savedConsole) this.consoleHistory = JSON.parse(savedConsole);
        } catch(e) {}
    }

    private persistLogs() {
        try {
            sessionStorage.setItem('dev_logs', JSON.stringify(this.logs));
        } catch(e) {}
    }

    private persistConsole() {
        try {
            sessionStorage.setItem('dev_console', JSON.stringify(this.consoleHistory));
        } catch(e) {}
    }

    addLog(type: string, detail: string) {
        if (!this.isLoggingEnabled) return;
        const time = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            fractionalSecondDigits: 3 
        } as any);
        this.logs = [`[${time}] ${type}: ${detail}`, ...this.logs].slice(0, 500);
        this.persistLogs();
        this.notifyLogs();
    }

    clearLogs() {
        this.logs = [];
        this.persistLogs();
        this.notifyLogs();
    }

    addConsole(type: ConsoleEntry['type'] | 'warn' | 'info', content: string) {
        if (!this.isLoggingEnabled && type !== 'input') return;
        
        let normalizedType: ConsoleEntry['type'] = 'output';
        if (type === 'error') normalizedType = 'error';
        else if (type === 'input') normalizedType = 'input';

        this.consoleHistory = [...this.consoleHistory, {
            id: Math.random().toString(36).substr(2, 9),
            type: normalizedType,
            content,
            timestamp: Date.now()
        }];
        if (this.consoleHistory.length > 500) {
            this.consoleHistory.shift();
        }
        this.persistConsole();
        this.notifyConsole();
    }

    clearConsole() {
        this.consoleHistory = [];
        this.persistConsole();
        this.notifyConsole();
    }

    setLoggingEnabled(enabled: boolean) {
        this.isLoggingEnabled = enabled;
        localStorage.setItem('developer_logging_enabled', String(enabled));
        this.notifySettings();
    }

    setVConsoleEnabled(enabled: boolean) {
        this.isVConsoleEnabled = enabled;
        localStorage.setItem('developer_vconsole_enabled', String(enabled));
        this.notifySettings();
        if (enabled) {
            this.loadVConsole();
        } else {
            this.unloadVConsole();
        }
    }

    async loadVConsole() {
        const win = window as any;
        if (win.vConsole) {
            try { win.vConsole.show(); } catch (e) {}
            return;
        }
        try {
            if (!Object.getOwnPropertyDescriptor(window, 'fetch')) {
                const originalFetch = window.fetch;
                Object.defineProperty(window, 'fetch', {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: originalFetch
                });
            }
            const VConsole = (await import('vconsole')).default;
            const isDark = document.documentElement.classList.contains('dark');
            win.vConsole = new (VConsole as any)({ theme: isDark ? 'dark' : 'light' });
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isCurrentlyDark = document.documentElement.classList.contains('dark');
                        if (win.vConsole && typeof win.vConsole.setOption === 'function') {
                            win.vConsole.setOption('theme', isCurrentlyDark ? 'dark' : 'light');
                        }
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true });
        } catch(e) {}
    }

    unloadVConsole() {
        const win = window as any;
        if (win.vConsole) {
            try { win.vConsole.destroy(); } catch (e) {}
            win.vConsole = undefined;
        }
    }

    subscribeLogs(listener: (logs: string[]) => void) {
        this.logListeners.add(listener);
        return () => this.logListeners.delete(listener);
    }

    subscribeConsole(listener: (history: ConsoleEntry[]) => void) {
        this.consoleListeners.add(listener);
        return () => this.consoleListeners.delete(listener);
    }
    
    subscribeSettings(listener: () => void) {
        this.settingsListeners.add(listener);
        return () => this.settingsListeners.delete(listener);
    }

    private notifyLogs() {
        this.logListeners.forEach(fn => fn(this.logs));
    }

    private notifyConsole() {
        this.consoleListeners.forEach(fn => fn(this.consoleHistory));
    }
    
    private notifySettings() {
        this.settingsListeners.forEach(fn => fn());
    }
}

export const loggerStore = new LoggerStore();

export function useLoggerStore() {
    const [logs, setLogs] = useState(loggerStore.logs);
    const [consoleHistory, setConsoleHistory] = useState(loggerStore.consoleHistory);
    const [isLoggingEnabled, setIsLoggingEnabled] = useState(loggerStore.isLoggingEnabled);
    const [isVConsoleEnabled, setIsVConsoleEnabled] = useState(loggerStore.isVConsoleEnabled);

    useEffect(() => {
        const unsubs = [
            loggerStore.subscribeLogs(setLogs),
            loggerStore.subscribeConsole(setConsoleHistory),
            loggerStore.subscribeSettings(() => {
                setIsLoggingEnabled(loggerStore.isLoggingEnabled);
                setIsVConsoleEnabled(loggerStore.isVConsoleEnabled);
            })
        ];
        return () => unsubs.forEach(u => u());
    }, []);

    return { logs, consoleHistory, isLoggingEnabled, isVConsoleEnabled };
}

// Map window errors / fetch / network to logs if needed
if (typeof window !== 'undefined') {
    // Initialise VConsole if enabled
    if (loggerStore.isVConsoleEnabled) {
        loggerStore.loadVConsole();
    }
    
    // Auto capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const serializeArgs = (args: any[]) => args.map(a => {
        try {
            return typeof a === 'object' ? JSON.stringify(a) : String(a);
        } catch(e) {
            return String(a);
        }
    }).join(' ');

    console.log = function(...args) {
        if (loggerStore.isLoggingEnabled) loggerStore.addConsole('output', serializeArgs(args));
        originalLog.apply(console, args);
    };
    console.error = function(...args) {
        if (loggerStore.isLoggingEnabled) loggerStore.addConsole('error', serializeArgs(args));
        originalError.apply(console, args);
    };
    console.warn = function(...args) {
        if (loggerStore.isLoggingEnabled) loggerStore.addConsole('warn', serializeArgs(args));
        originalWarn.apply(console, args);
    };
    console.info = function(...args) {
        if (loggerStore.isLoggingEnabled) loggerStore.addConsole('info', serializeArgs(args));
        originalInfo.apply(console, args);
    };

    // Global event listener
    const handleResize = () => loggerStore.addLog('resize', `${window.innerWidth}x${window.innerHeight}`);
    const handleVisibility = () => loggerStore.addLog('visibilitychange', document.visibilityState);
    const handleOnline = () => loggerStore.addLog('network', 'online');
    const handleOffline = () => loggerStore.addLog('network', 'offline');
    const handleFocus = () => loggerStore.addLog('window', 'focus');
    const handleBlur = () => loggerStore.addLog('window', 'blur');
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    window.addEventListener('error', (e) => {
        loggerStore.addConsole('error', `[Uncaught Error] ${e.message}\n${e.error?.stack || ''}`);
    });
    window.addEventListener('unhandledrejection', (e) => {
        loggerStore.addConsole('error', `[Unhandled Promise Rejection] ${e.reason}`);
    });
}
