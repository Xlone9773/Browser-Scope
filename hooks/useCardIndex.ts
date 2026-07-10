import { useMemo } from 'react';
import { BrowserData } from '../types';
import { Translation } from '../utils/i18n/types';

export function useCardIndex(browserData: BrowserData | null, t: Translation) {
    return useMemo(() => {
        if (!browserData || !t) return {};

        // Helper to recursively extract all string values from an object
        const extractStrings = (obj: unknown): string => {
            if (!obj) return "";
            if (typeof obj === 'string') return obj + " ";
            if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj) + " ";
            if (Array.isArray(obj)) return obj.map(extractStrings).join("");
            if (typeof obj === 'object') {
                return Object.values(obj as Record<string, unknown>).map(extractStrings).join("");
            }
            return "";
        };

        const index: Record<string, { category: string, title: string, value: string }> = {};

        const add = (id: string, category: unknown, titleObj: unknown, valueObjs: unknown[]) => {
            const title = typeof titleObj === 'string' ? titleObj : extractStrings(titleObj);
            const value = valueObjs.map(v => extractStrings(v)).join(" ");
            index[id] = { category: String(category || ""), title, value };
        };

        // Group: Environment & Trust
        add('environment', t.groups?.environment, t.environment, []);

        // Group: Browser
        add('browser', t.groups?.browser, [t.browserCard, t.labels?.browser], [browserData.system]);

        // Group: System
        add('system', t.groups?.system, t.sections?.system, [browserData.system]);
        add('hardware', t.groups?.system, t.sections?.hardware, [browserData.hardware]);
        add('display', t.groups?.system, t.sections?.display, [browserData.display]);

        // Group: Network & Security
        add('network', t.groups?.network, t.sections?.network, [browserData.network]);
        add('security', t.groups?.network, t.sections?.security, [browserData.security]);
        add('fingerprint', t.groups?.network, t.sections?.fingerprints, [browserData.fingerprints]);

        // Group: Advanced / Capabilities
        add('ai', t.groups?.advanced, t.sections?.ai_compute, [browserData.ai]);
        add('location', t.groups?.advanced, t.sections?.location, [browserData.localization]);
        add('storage', t.groups?.advanced, t.sections?.storage, [browserData.storage]);
        add('permissions', t.groups?.advanced, t.sections?.permissions, []);
        add('media_devices', t.groups?.advanced, t.sections?.media_devices, []);
        add('media_capabilities', t.groups?.advanced, t.sections?.media_sup, [browserData.media]);
        add('user_agent', t.groups?.advanced, t.sections?.user_agent, [browserData.system?.userAgent, browserData.system?.clientHints]);
        
        // Group: PWA and Features
        add('pwa', t.groups?.advanced, t.sections?.pwa, [browserData.system?.isPwaInstalled, browserData.pwaFeatures]);
        add('features', t.groups?.advanced, t.sections?.features, [browserData.features]);

        return index;
    }, [browserData, t]);
}
