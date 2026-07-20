// src/utils/networkLogger.ts

export interface NetworkLogItem {
    id: string;
    url: string;
    method: string;
    type: 'native' | 'udp' | 'script' | 'unknown';
    status: number | 'PENDING' | 'FAILED';
    duration: number; // in ms
    timestamp: Date;
    initiator?: string;
}

type NetworkLoggerCallback = (logs: NetworkLogItem[]) => void;

class NetworkRequestLogger {
    private logs: NetworkLogItem[] = [];
    private listeners: Set<NetworkLoggerCallback> = new Set();
    private isInitialized = false;

    constructor() {
        if (typeof window !== 'undefined') {
            // Restore from sessionStorage if exists
            try {
                const saved = sessionStorage.getItem('browserscope_network_logs');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        this.logs = parsed.map((item: Omit<NetworkLogItem, 'timestamp'> & { timestamp: string }) => ({
                            ...item,
                            timestamp: new Date(item.timestamp)
                        }));
                    }
                }
            } catch {
                // Ignore restore errors
            }
        }
    }

    public init() {
        if (typeof window === 'undefined' || this.isInitialized) return;
        this.isInitialized = true;

        this.patchFetch();
        this.setupUserscriptListeners();
    }

    public getLogs(): NetworkLogItem[] {
        return [...this.logs];
    }

    public clear() {
        this.logs = [];
        this.persist();
        this.notify();
    }

    public subscribe(callback: NetworkLoggerCallback): () => void {
        this.listeners.add(callback);
        // Initial emit
        callback([...this.logs]);
        return () => {
            this.listeners.delete(callback);
        };
    }

    private persist() {
        try {
            sessionStorage.setItem('browserscope_network_logs', JSON.stringify(this.logs));
        } catch {
            // Ignore persist errors
        }
    }

    private notify() {
        const currentLogs = [...this.logs];
        this.listeners.forEach(cb => cb(currentLogs));
    }

    private addLog(item: NetworkLogItem) {
        // Prevent duplicate logs for the same ID
        const idx = this.logs.findIndex(l => l.id === item.id);
        if (idx !== -1) {
            this.logs[idx] = { ...this.logs[idx], ...item };
        } else {
            // Keep at most 200 logs
            if (this.logs.length >= 200) {
                this.logs.shift();
            }
            this.logs.push(item);
        }
        this.persist();
        this.notify();
    }

    private patchFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
            const id = Math.random().toString(36).substring(2, 11);
            const startTime = performance.now();
            const timestamp = new Date();

            let targetUrl = '';
            if (typeof input === 'string') {
                targetUrl = input;
            } else if (input instanceof URL) {
                targetUrl = input.href;
            } else if (input && 'url' in input) {
                targetUrl = input.url;
            }

            const method = init?.method || (input instanceof Request ? input.method : 'GET');

            let isUdp = false;
            let finalUrl = targetUrl;

            // Detect if this is a UDP Proxy forwarding request
            if (targetUrl.includes('/api/proxy') && init?.body) {
                try {
                    const bodyText = typeof init.body === 'string' ? init.body : '';
                    if (bodyText) {
                        const parsed = JSON.parse(bodyText);
                        if (parsed && parsed.url) {
                            finalUrl = parsed.url;
                            if (parsed.useUdp) {
                                isUdp = true;
                            }
                        }
                    }
                } catch {
                    // Fail-safe
                }
            }

            // Exclude telemetry or internal app updates, unless relevant
            if (finalUrl.includes('/api/udp-status') || finalUrl.includes('/api/health') || finalUrl.includes('hot-update')) {
                return originalFetch.apply(this, [input, init]);
            }

            // Log initial request
            const logItem: NetworkLogItem = {
                id,
                url: finalUrl,
                method,
                type: isUdp ? 'udp' : 'native',
                status: 'PENDING',
                duration: 0,
                timestamp,
                initiator: isUdp ? 'UDP Proxy Engine' : 'Native Browser Fetch'
            };

            self.addLog(logItem);

            try {
                const response = await originalFetch.apply(this, [input, init]);
                const duration = Math.round(performance.now() - startTime);

                self.addLog({
                    ...logItem,
                    status: response.status,
                    duration
                });

                return response;
            } catch (err) {
                const duration = Math.round(performance.now() - startTime);
                self.addLog({
                    ...logItem,
                    status: 'FAILED',
                    duration
                });
                throw err;
            }
        };
    }

    private setupUserscriptListeners() {
        const self = this;

        // Map to track start times of userscript requests
        const activeRequests: Record<string, { startTime: number; url: string; method: string; timestamp: Date }> = {};

        window.addEventListener('CORS_REQUEST_SEND', (e: Event) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail) return;

            const { id, url, method } = customEvent.detail;
            if (!id || !url) return;

            const timestamp = new Date();
            activeRequests[id] = {
                startTime: performance.now(),
                url,
                method: method || 'GET',
                timestamp
            };

            const logItem: NetworkLogItem = {
                id,
                url,
                method: method || 'GET',
                type: 'script',
                status: 'PENDING',
                duration: 0,
                timestamp,
                initiator: 'Tampermonkey Bypass'
            };

            self.addLog(logItem);
        });

        // We listen dynamically to CORS_REQUEST_RECEIVE_* events
        // Since event names are dynamic, we intercept dispatchEvent globally or handle it directly.
        // Wait, inside customFetch, the event dispatched back is `CORS_REQUEST_RECEIVE_` + id.
        // We can hook window.dispatchEvent to catch these responses! This is extremely elegant.
        const originalDispatch = window.dispatchEvent;
        window.dispatchEvent = function (event: Event): boolean {
            const result = originalDispatch.apply(this, [event]);

            if (event.type.startsWith('CORS_REQUEST_RECEIVE_')) {
                const id = event.type.replace('CORS_REQUEST_RECEIVE_', '');
                const reqInfo = activeRequests[id];
                if (reqInfo) {
                    const duration = Math.round(performance.now() - reqInfo.startTime);
                    const customEvent = event as CustomEvent;
                    const status = customEvent.detail?.success ? (customEvent.detail.status || 200) : 'FAILED';

                    self.addLog({
                        id,
                        url: reqInfo.url,
                        method: reqInfo.method,
                        type: 'script',
                        status,
                        duration,
                        timestamp: reqInfo.timestamp,
                        initiator: 'Tampermonkey Bypass'
                    });

                    delete activeRequests[id];
                }
            }

            return result;
        };
    }
}

export const networkLogger = new NetworkRequestLogger();
