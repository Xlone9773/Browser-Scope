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
            if (document.documentElement.getAttribute("webdriver")) {
                addAnomaly('webdriver_attr', 'WebDriver HTML attribute detected', 'danger', 'trust', 40);
            }

            // 2. Headless Checks
            if (window.outerWidth === 0 && window.outerHeight === 0) {
                addAnomaly('headless_dims', 'Zero window dimensions', 'danger', 'trust', 30);
            }
            if (!('chrome' in window) && navigator.userAgent.includes('Chrome/')) {
                addAnomaly('missing_chrome', 'Missing window.chrome in Chrome', 'suspicious', 'trust', 20);
            }

            // 3. PhantomJS & Other specific runtimes
            if (('callPhantom' in window) || ('_phantom' in window)) {
                addAnomaly('phantomjs', 'PhantomJS runtime', 'danger', 'trust', 50);
            }
            if ('domAutomation' in window || 'domAutomationController' in window) {
                addAnomaly('dom_automation', 'DOM Automation object', 'danger', 'trust', 40);
            }
            if ('__nightmare' in window) {
                addAnomaly('nightmarejs', 'NightmareJS runtime', 'danger', 'trust', 50);
            }
            if ('Selenium_IDE_Recorder' in window || '_selenium' in window) {
                addAnomaly('selenium', 'Selenium components detected', 'danger', 'trust', 50);
            }
            // Puppeteer / CDP signature (cdc_...)
            for (const key in document) {
                if (key.match(/\$cdc_[a-zA-Z0-9]/)) {
                    addAnomaly('cdp_cdc', 'CDP (Puppeteer/Chromedriver) variable detected', 'danger', 'trust', 50);
                    break;
                }
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
            
            const languagesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'languages');
            if (languagesDescriptor && (languagesDescriptor.value !== undefined || languagesDescriptor.get !== undefined)) {
                addAnomaly('languages_override', 'Navigator Languages tampered', 'danger', 'trust', 20);
            }

            // Mime types and Plugins spoofing
            if (navigator.plugins && navigator.plugins.length > 0) {
                let allValid = true;
                for (let i = 0; i < navigator.plugins.length; i++) {
                    if (!(navigator.plugins[i] instanceof Plugin)) {
                        allValid = false;
                        break;
                    }
                }
                if (!allValid) {
                     addAnomaly('fake_plugins', 'Fake plugins array detected', 'danger', 'trust', 40);
                }
            }

            // Window objects tampering
            if (console.debug.toString().indexOf('native code') === -1) {
                 addAnomaly('console_tampered', 'Console methods have been overridden', 'suspicious', 'trust', 15);
            }
            if (window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight) {
                 addAnomaly('screen_tampered', 'Screen availability dimensions are larger than screen dimensions', 'danger', 'trust', 20);
            }

            // Function.prototype.toString tampering
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const toStringVal = Function.prototype.toString.call(navigator.permissions.query);
                    if (!toStringVal.includes('native code')) {
                        addAnomaly('native_override', 'Native function toString overridden', 'danger', 'trust', 30);
                    }
                } catch {
                    addAnomaly('native_override_error', 'Error checking native function toString', 'suspicious', 'trust', 10);
                }
            }

            // 5. Engine stack mismatches
            try {
                
                                // @ts-expect-error fixed implicitly typed external libraries
                                null.test();
            } catch (e: unknown) {
                const errObj = e instanceof Error ? e : (typeof e === 'object' && e !== null ? e as Record<string, unknown> : {});
                if (errObj.stack) {
                    const stackString = String(errObj.stack);
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

            // Screen resolution anomalies
            if (window.screen.width === 0 || window.screen.height === 0) {
                addAnomaly('screen_zero', 'Screen dimensions are zero', 'danger', 'normalcy', 30);
            }
            if (window.screen.colorDepth < 16) {
                addAnomaly('low_color_depth', 'Suspiciously low color depth', 'suspicious', 'normalcy', 15);
            }

            // Timezone tests
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (!tz || tz === 'UTC') {
                    addAnomaly('timezone_utc', 'Suspicious UTC timezone (often used in headless)', 'suspicious', 'normalcy', 10);
                }
            } catch {
                // Ignore
            }

            // Timezone mismatch check (System timezone vs IP location timezone)
            try {
                const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (systemTz) {
                    const res = await fetch('/api/proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: 'https://ipwho.is/', method: 'GET' })
                    });
                    if (res.ok) {
                        const proxyData = await res.json();
                        if (proxyData && proxyData.data) {
                            const geoData = JSON.parse(proxyData.data);
                            if (geoData && geoData.success && geoData.timezone) {
                                const ipTz = geoData.timezone.id || (typeof geoData.timezone === 'string' ? geoData.timezone : undefined);
                                if (ipTz && systemTz) {
                                    // Robust comparison of timezone offsets
                                    const getOffset = (tz: string) => {
                                        const date = new Date();
                                        const tzString = date.toLocaleString('en-US', { timeZone: tz });
                                        const tzDate = new Date(tzString);
                                        return (date.getTime() - tzDate.getTime()) / 60000;
                                    };
                                    const tzDiff = Math.abs(getOffset(systemTz) - getOffset(ipTz));
                                    if (tzDiff > 10) { // offset difference greater than 10 minutes
                                        addAnomaly('timezone_mismatch', 'System timezone does not match IP location timezone', 'suspicious', 'normalcy', 15);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to perform IP-system timezone comparison check:', err);
            }

            // Missing Languages
            if (!navigator.languages || navigator.languages.length === 0) {
                addAnomaly('no_languages', 'No languages specified', 'suspicious', 'normalcy', 15);
            }

            // Wait for permissions
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    const notifPerm = await Promise.race([
                        navigator.permissions.query({ name: 'notifications' }),
                        new Promise<PermissionStatus>((_, reject) => setTimeout(() => reject(new Error('timeout')), 500))
                    ]);
                    if (Notification.permission === 'denied' && notifPerm.state === 'prompt') {
                        addAnomaly('permission_mismatch', 'Permissions API contradicts Notification API', 'danger', 'trust', 25);
                    }
                }
            } catch {
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
