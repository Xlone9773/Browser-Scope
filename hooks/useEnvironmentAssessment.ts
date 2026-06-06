import { useState, useEffect } from 'react';

export type AnomalyLevel = 'safe' | 'suspicious' | 'danger';
export type AnomalyCategory = 'trust' | 'normalcy';

export interface Anomaly {
    id: string;
    description: string;
    level: AnomalyLevel;
    category: AnomalyCategory;
}

export interface EnvironmentAssessment {
    isTrusted: boolean;
    trustScore: number;    // 0-100 (Based on tampering / bots)
    normalcyScore: number; // 0-100 (Based on system logic / layout / hardware consistency)
    trustLevel: AnomalyLevel;
    normalcyLevel: AnomalyLevel;
    anomalies: Anomaly[];
    isLoading: boolean;
}

export const useEnvironmentAssessment = (): EnvironmentAssessment => {
    const [assessment, setAssessment] = useState<EnvironmentAssessment>({
        isTrusted: true,
        trustScore: 100,
        normalcyScore: 100,
        trustLevel: 'safe',
        normalcyLevel: 'safe',
        anomalies: [],
        isLoading: true
    });

    useEffect(() => {
        const analyze = async () => {
            const anomalies: Anomaly[] = [];
            let trustScore = 100;
            let normalcyScore = 100;

            const addAnomaly = (id: string, description: string, level: AnomalyLevel, category: AnomalyCategory, scoreDeduction: number) => {
                anomalies.push({ id, description, level, category });
                if (category === 'trust') {
                    trustScore -= scoreDeduction;
                } else {
                    normalcyScore -= scoreDeduction;
                }
            };

            // ---- TRUST CHECKS (Tampering / Bots) ----

            // 1. WebDriver Check
            if (navigator.webdriver) {
                addAnomaly('webdriver', 'WebDriver signal detected', 'danger', 'trust', 40);
            }

            // 2. Headless Checks
            if (window.outerWidth === 0 && window.outerHeight === 0) {
                addAnomaly('headless_dims', 'Zero window dimensions', 'danger', 'trust', 30);
            }
            if (!('chrome' in window) && navigator.userAgent.includes('Chrome/')) {
                addAnomaly('missing_chrome', 'Missing window.chrome in Chrome', 'suspicious', 'trust', 20);
            }

            // 3. PhantomJS
            if (('callPhantom' in window) || ('_phantom' in window)) {
                addAnomaly('phantomjs', 'PhantomJS runtime', 'danger', 'trust', 50);
            }
            if ('domAutomation' in window || 'domAutomationController' in window) {
                addAnomaly('dom_automation', 'DOM Automation object', 'danger', 'trust', 40);
            }

            // 4. Overrides
            const uaDescriptor = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
            if (uaDescriptor && (uaDescriptor.value !== undefined || uaDescriptor.get !== undefined)) {
                addAnomaly('ua_override', 'UserAgent tampered', 'danger', 'trust', 30);
            }

            const platformDescriptor = Object.getOwnPropertyDescriptor(navigator, 'platform');
            if (platformDescriptor && (platformDescriptor.value !== undefined || platformDescriptor.get !== undefined)) {
                addAnomaly('platform_override', 'Platform tampered', 'danger', 'trust', 30);
            }

            // 5. Engine stack mismatches
            try {
                
                                // @ts-expect-error fixed implicitly typed external libraries
                                null.test();
            } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
                if (e.stack) {
                    const stackString = e.stack.toString();
                    if (navigator.userAgent.includes('Chrome') && stackString.includes('@')) {
                        addAnomaly('engine_mismatch', 'JS Engine error stack mismatch', 'danger', 'trust', 30);
                    }
                }
            }

            // ---- NORMALCY CHECKS (Configuration Consistency) ----

            const ua = navigator.userAgent || '';
            const platform = navigator.platform || '';
            
            // OS Mismatches
            if (ua.includes('Windows') && !platform.includes('Win')) {
                addAnomaly('os_mismatch', 'Windows UA but non-Win platform', 'danger', 'normalcy', 30);
            }
            if (ua.includes('Mac OS') && !platform.includes('Mac')) {
                addAnomaly('os_mismatch', 'Mac UA but non-Mac platform', 'danger', 'normalcy', 30);
            }
            if (ua.includes('Linux') && !platform.includes('Linux') && !platform.includes('Android')) {
                addAnomaly('os_mismatch', 'Linux UA but non-Linux platform', 'danger', 'normalcy', 30);
            }
            
            // Arch Mismatches (e.g., iPhone returning Linux x86_64 or Desktop returning arm)
            const isUAaarch64 = ua.includes('aarch64') || ua.includes('arm');
            const isPlatformx86 = platform.includes('x86') || platform.includes('i686');
            if (isUAaarch64 && isPlatformx86) {
                addAnomaly('arch_mismatch', 'ARM UA with x86 Platform', 'danger', 'normalcy', 30);
            }

            // Mobile vs Desktop
            const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(ua);
            const isDesktopPlatform = /Win32|Win64|MacIntel|Linux x86_64/.test(platform);
            if (isMobileUA && isDesktopPlatform) {
                addAnomaly('mobile_desktop_mismatch', 'Mobile UA on Desktop Platform', 'danger', 'normalcy', 25);
            }

            // High core counts on mobile (Often unlikely for certain architectures but this is a soft check)
            if (isMobileUA && navigator.hardwareConcurrency > 10) {
                addAnomaly('hardware_anomaly', 'Unusually high cores for mobile', 'suspicious', 'normalcy', 15);
            }

            // Touch support contradictions
            if (isMobileUA && navigator.maxTouchPoints === 0) {
                addAnomaly('touch_mismatch', 'Mobile UA without touch points', 'suspicious', 'normalcy', 20);
            }

            // Missing Languages
            if (!navigator.languages || navigator.languages.length === 0) {
                addAnomaly('no_languages', 'No languages specified', 'suspicious', 'normalcy', 15);
            }

            // Wait for permissions
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    const notifPerm = await navigator.permissions.query({ name: 'notifications' });
                    if (Notification.permission === 'denied' && notifPerm.state === 'prompt') {
                        addAnomaly('permission_mismatch', 'Permissions API contradicts Notification API', 'danger', 'trust', 25);
                    }
                }
            } catch (_e) {
                // Ignore if query fails
            }

            trustScore = Math.max(0, trustScore);
            normalcyScore = Math.max(0, normalcyScore);

            const trustLevel: AnomalyLevel = trustScore < 50 ? 'danger' : (trustScore < 90 ? 'suspicious' : 'safe');
            const normalcyLevel: AnomalyLevel = normalcyScore < 50 ? 'danger' : (normalcyScore < 85 ? 'suspicious' : 'safe');

            setAssessment({
                isTrusted: trustScore >= 90,
                trustScore,
                normalcyScore,
                trustLevel,
                normalcyLevel,
                anomalies,
                isLoading: false
            });
        };

        analyze();
    }, []);

    return assessment;
};
