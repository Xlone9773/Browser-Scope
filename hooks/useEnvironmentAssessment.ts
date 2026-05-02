import { useState, useEffect } from 'react';

export type AnomalyLevel = 'safe' | 'suspicious' | 'danger';

export interface Anomaly {
    id: string;
    description: string;
    level: AnomalyLevel;
}

export interface EnvironmentAssessment {
    isTrusted: boolean;
    score: number; // 0-100
    level: AnomalyLevel;
    anomalies: Anomaly[];
    isLoading: boolean;
}

export const useEnvironmentAssessment = (): EnvironmentAssessment => {
    const [assessment, setAssessment] = useState<EnvironmentAssessment>({
        isTrusted: true,
        score: 100,
        level: 'safe',
        anomalies: [],
        isLoading: true
    });

    useEffect(() => {
        const analyze = async () => {
            const anomalies: Anomaly[] = [];
            let score = 100;

            const addAnomaly = (id: string, description: string, level: AnomalyLevel, scoreDeduction: number) => {
                anomalies.push({ id, description, level });
                score -= scoreDeduction;
            };

            // 1. WebDriver Check
            if (navigator.webdriver) {
                addAnomaly('webdriver', 'WebDriver signal detected (Automated browser)', 'danger', 40);
            }

            // 2. Headless Checks
            if (window.outerWidth === 0 && window.outerHeight === 0) {
                addAnomaly('headless_dims', 'Window dimensions are zero (Typical of headless browsers)', 'danger', 30);
            }
            if (!('chrome' in window) && navigator.userAgent.includes('Chrome/')) {
                addAnomaly('missing_chrome', 'Missing window.chrome object in Chrome browser', 'suspicious', 20);
            }

            // 3. PhantomJS / Headless Chrome variables
            if (('callPhantom' in window) || ('_phantom' in window)) {
                addAnomaly('phantomjs', 'PhantomJS runtime detected', 'danger', 50);
            }
            if ('domAutomation' in window || 'domAutomationController' in window) {
                addAnomaly('dom_automation', 'DOM Automation object detected', 'danger', 40);
            }

            // 4. Prototype overrides (Navigator properties)
            const uaDescriptor = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
            if (uaDescriptor && (uaDescriptor.value !== undefined || uaDescriptor.get !== undefined)) {
                addAnomaly('ua_override', 'UserAgent property has been tampered with', 'danger', 30);
            }

            const platformDescriptor = Object.getOwnPropertyDescriptor(navigator, 'platform');
            if (platformDescriptor && (platformDescriptor.value !== undefined || platformDescriptor.get !== undefined)) {
                addAnomaly('platform_override', 'Platform property has been tampered with', 'danger', 30);
            }

            // 5. OS/Platform Mismatch
            const ua = navigator.userAgent;
            const platform = navigator.platform;
            if (ua.includes('Windows') && !platform.includes('Win')) {
                addAnomaly('os_mismatch', 'UserAgent indicates Windows but Platform does not', 'suspicious', 20);
            }
            if (ua.includes('Mac OS') && !platform.includes('Mac')) {
                addAnomaly('os_mismatch', 'UserAgent indicates macOS but Platform does not', 'suspicious', 20);
            }
            if (ua.includes('Linux') && !platform.includes('Linux') && !platform.includes('Android')) {
                addAnomaly('os_mismatch', 'UserAgent indicates Linux but Platform does not', 'suspicious', 20);
            }

            // 6. Missing Languages
            if (!navigator.languages || navigator.languages.length === 0) {
                addAnomaly('no_languages', 'No languages specified in navigator', 'suspicious', 15);
            }

            // 7. Permissions inconsistencies (Wait for query)
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    const notifPerm = await navigator.permissions.query({ name: 'notifications' });
                    if (Notification.permission === 'denied' && notifPerm.state === 'prompt') {
                        addAnomaly('permission_mismatch', 'Permissions API response contradicts Notification API', 'danger', 25);
                    }
                }
            } catch (e) {
                // Ignore if query fails
            }

            // 8. Error stack trace consistency (Checking if we can detect v8 vs spiderMonkey when UA claims otherwise)
            try {
                // null()
            } catch (e: any) {
                if (e.stack) {
                    const stackString = e.stack.toString();
                    if (ua.includes('Chrome') && stackString.includes('@')) {
                        // V8 traces use "at Function.name", SpiderMonkey (Firefox) uses "functionName@file"
                        // If it claims Chrome but has Firefox traces:
                        addAnomaly('engine_mismatch', 'JS Engine error stack format contradicts UserAgent claims', 'danger', 30);
                    }
                }
            }

            // Final score evaluation
            score = Math.max(0, score);
            let finalLevel: AnomalyLevel = 'safe';
            if (score < 50) finalLevel = 'danger';
            else if (score < 90) finalLevel = 'suspicious';

            setAssessment({
                isTrusted: score >= 90,
                score,
                level: finalLevel,
                anomalies,
                isLoading: false
            });
        };

        analyze();
    }, []);

    return assessment;
};
