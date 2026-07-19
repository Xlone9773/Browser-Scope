import { Language } from './i18n/types';

export interface FontItem {
    key: string;
    name: string;
    languages: Language[];
    mirrors?: string[];
    cssUrl?: string;
    fontFamily?: string;
}

export const FONTS_LIST: FontItem[] = [
    {
        key: 'googlesansflex',
        name: 'Google Sans Flex',
        languages: ['en'],
        mirrors: [
            "https://github.com/LineageOS/android_external_google-fonts_google-sans-flex/raw/refs/heads/lineage-23.2/GoogleSansFlex-Regular.ttf"
        ]
    },
    {
        key: 'notosans',
        name: 'Noto Sans',
        languages: ['en', 'ru'],
        mirrors: [
            "https://github.com/prezly/noto-sans/raw/refs/heads/master/fonts/NotoSans-Regular.ttf"
        ]
    },
    {
        key: 'roboto',
        name: 'Roboto Regular',
        languages: ['en', 'ru'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/static/Roboto-Regular.ttf"
        ]
    },
    {
        key: 'harmonyossanssc',
        name: 'HarmonyOS Sans SC',
        languages: ['en', 'zh-CN'],
        cssUrl: 'https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/index.min.css',
        fontFamily: 'HarmonyOS Sans SC'
    },
    {
        key: 'misans',
        name: 'MiSans',
        languages: ['en', 'zh-CN'],
        cssUrl: 'https://cdn.jsdelivr.net/npm/misans-webfont@4.3.1/misans-style.min.css',
        fontFamily: 'MiSans'
    },
    {
        key: 'zcoolxiaowei',
        name: 'ZCOOL XiaoWei',
        languages: ['en', 'zh-CN', 'zh-TW', 'zh-HK'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"
        ]
    },
    {
        key: 'sawarabigothic',
        name: 'Sawarabi Gothic',
        languages: ['en', 'ja'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf"
        ]
    },
    {
        key: 'notosanssc',
        name: 'Noto Sans SC',
        languages: ['en', 'zh-CN'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"
        ]
    },
    {
        key: 'notosanstc',
        name: 'Noto Sans TC',
        languages: ['en', 'zh-TW', 'zh-HK'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf"
        ]
    },
    {
        key: 'notosansjp',
        name: 'Noto Sans JP',
        languages: ['en', 'ja'],
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
        ]
    }
];

const CACHE_NAME = "browserscope-fonts";

/**
 * Resolves relative URLs (including @import and url(...) values) in CSS text to absolute URLs.
 */
export function resolveCssUrls(cssText: string, baseUrl: string): string {
    // 1. Resolve @import statements (e.g. @import "./foo.css";)
    let resolved = cssText.replace(/@import\s+['"]?([^'";)]+)['"]?\s*;/gi, (match, path) => {
        if (/^(https?:|\/\/|data:)/i.test(path)) {
            return match;
        }
        try {
            const absoluteUrl = new URL(path, baseUrl).href;
            return `@import url("${absoluteUrl}");`;
        } catch (e) {
            return match;
        }
    });

    // 2. Resolve url(...) paths
    resolved = resolved.replace(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi, (match, path) => {
        if (/^(https?:|\/\/|data:)/i.test(path)) {
            return match;
        }
        try {
            const absoluteUrl = new URL(path, baseUrl).href;
            return `url("${absoluteUrl}")`;
        } catch (e) {
            return match;
        }
    });

    return resolved;
}

/**
 * Loads a dynamic font either from Cache Storage (if cached) or falls back to CDN.
 * Registers the font with the document.fonts API.
 */
export async function loadAndApplyFont(fontKey: string, targetVar: '--font-sans' | '--font-modal-title'): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (fontKey === 'default') {
        document.documentElement.style.removeProperty(targetVar);
        return true;
    }

    const font = FONTS_LIST.find(f => f.key === fontKey);
    if (!font) return false;

    // Handle CSS-based web fonts (HarmonyOS Sans SC and MiSans)
    if (font.cssUrl) {
        const styleId = `dynamic-css-${font.key}`;
        let loaded = !!document.getElementById(styleId);

        if (!loaded) {
            // 1. Try Cache Storage first
            if ('caches' in window) {
                try {
                    const cache = await window.caches.open(CACHE_NAME);
                    const cacheKey = `https://local-fonts.browserscope/${font.key}.css`;
                    const match = await cache.match(cacheKey);
                    if (match) {
                        const cssText = await match.text();
                        if (cssText && cssText.length > 10) {
                            const style = document.createElement('style');
                            style.id = styleId;
                            style.textContent = cssText;
                            document.head.appendChild(style);
                            loaded = true;
                        }
                    }
                } catch (err) {
                    console.warn("Failed to check CSS font cache:", err);
                }
            }

            // 2. If not loaded from cache, append the standard link element
            if (!loaded) {
                const link = document.createElement('link');
                link.id = styleId;
                link.rel = 'stylesheet';
                link.href = font.cssUrl;
                document.head.appendChild(link);
                loaded = true;
            }
        }

        if (loaded) {
            const familyName = font.fontFamily || `DynamicFont-${font.key}`;
            document.documentElement.style.setProperty(targetVar, `"${familyName}", "Inter", ui-sans-serif, system-ui, sans-serif`);
            return true;
        }
        return false;
    }

    const fontFamilyName = `DynamicFont-${font.key}`;

    let loadedFace: FontFace | null = null;
    let fontBlobUrl: string | null = null;

    // 1. Try Cache Storage first
    if ('caches' in window) {
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const cacheKey = `https://local-fonts.browserscope/${font.key}.ttf`;
            const match = await cache.match(cacheKey);
            if (match) {
                const blob = await match.blob();
                if (blob.size > 10) {
                    fontBlobUrl = URL.createObjectURL(blob);
                    try {
                        const fontFace = new FontFace(fontFamilyName, `url(${fontBlobUrl})`);
                        loadedFace = await fontFace.load();
                    } catch (cacheLoadErr) {
                        console.warn(`Failed to load cached font ${fontKey} from blob, falling back to CDN mirrors`, cacheLoadErr);
                        if (fontBlobUrl) {
                            try { URL.revokeObjectURL(fontBlobUrl); } catch {}
                            fontBlobUrl = null;
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("Failed to check cache for font:", fontKey, err);
        }
    }

    // 2. Fall back to CDN mirrors sequentially if not loaded from cache
    if (!loadedFace && font.mirrors) {
        for (const mirrorUrl of font.mirrors) {
            try {
                console.log(`Attempting to load font ${fontKey} from mirror: ${mirrorUrl}`);
                const fontFace = new FontFace(fontFamilyName, `url(${mirrorUrl})`);
                loadedFace = await fontFace.load();
                break; // Success! Break out of the mirrors loop.
            } catch (mirrorErr) {
                console.warn(`Mirror failed for ${fontKey}: ${mirrorUrl}`, mirrorErr);
            }
        }
    }

    if (!loadedFace) {
        console.error(`All load avenues failed for font: ${fontKey}`);
        return false;
    }

    try {
        // Register the successfully loaded font
        document.fonts.add(loadedFace);

        // Apply to the specific target CSS variable
        document.documentElement.style.setProperty(targetVar, `"${fontFamilyName}", "Inter", ui-sans-serif, system-ui, sans-serif`);

        // Clean up object URL if created
        if (fontBlobUrl) {
            setTimeout(() => {
                try {
                    URL.revokeObjectURL(fontBlobUrl!);
                } catch {}
            }, 1000);
        }

        return true;
    } catch (err) {
        console.error(`Failed to register or apply loaded font ${fontKey}:`, err);
        if (fontBlobUrl) {
            try { URL.revokeObjectURL(fontBlobUrl); } catch {}
        }
        return false;
    }
}

/**
 * Validates whether the given font is compatible with the specified language.
 */
export function isFontCompatibleWithLang(fontKey: string, lang: Language): boolean {
    if (fontKey === 'default') return true;
    const font = FONTS_LIST.find(f => f.key === fontKey);
    if (!font) return false;
    return font.languages.includes(lang);
}
