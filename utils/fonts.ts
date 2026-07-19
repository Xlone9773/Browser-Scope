import { Language } from './i18n/types';

export interface FontItem {
    key: string;
    name: string;
    languages: Language[];
    langLabel: Record<string, string>;
    mirrors: string[];
}

export const FONTS_LIST: FontItem[] = [
    {
        key: 'googlesansflex',
        name: 'Google Sans Flex',
        languages: ['en'],
        langLabel: {
            en: 'English / Latin (en)',
            'zh-CN': '英语 / 拉丁文 (en)',
            'zh-TW': '英語 / 拉丁文 (en)',
            'zh-HK': '英語 / 拉丁文 (en)',
            ja: '英語 / ラテン文字 (en)',
            ru: 'Английский / Латиница (en)'
        },
        mirrors: [
            "https://cdn.jsdelivr.net/gh/hasandogu/google-sans@master/GoogleSans-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/hasandogu/google-sans@master/GoogleSans-Regular.ttf",
            "https://raw.githubusercontent.com/hasandogu/google-sans/master/GoogleSans-Regular.ttf"
        ]
    },
    {
        key: 'notosans',
        name: 'Noto Sans',
        languages: ['en', 'ru'],
        langLabel: {
            en: 'Multilingual / Cyrillic (en, ru)',
            'zh-CN': '多语言 / 西里尔文 (en, ru)',
            'zh-TW': '多語言 / 西里爾文 (en, ru)',
            'zh-HK': '多語言 / 西里爾文 (en, ru)',
            ja: '多言語 / キリル文字 (en, ru)',
            ru: 'Мультиязычный / Кириллица (en, ru)'
        },
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosans/static/NotoSans-Regular.ttf",
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosans/NotoSans-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/static/NotoSans-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans-Regular.ttf"
        ]
    },
    {
        key: 'roboto',
        name: 'Roboto Regular',
        languages: ['en', 'ru'],
        langLabel: {
            en: 'Russian / Cyrillic (ru, en)',
            'zh-CN': '俄语 / 西里尔文 (ru, en)',
            'zh-TW': '俄語 / 西里爾文 (ru, en)',
            'zh-HK': '俄語 / 西里爾文 (ru, en)',
            ja: 'ロシア語 / キリル文字 (ru, en)',
            ru: 'Русский / Кириллица (ru, en)'
        },
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/static/Roboto-Regular.ttf"
        ]
    },
    {
        key: 'zcoolxiaowei',
        name: 'ZCOOL XiaoWei',
        languages: ['en', 'zh-CN', 'zh-TW', 'zh-HK'],
        langLabel: {
            en: 'Chinese (Simplified & Traditional) (zh-CN, zh-TW, zh-HK)',
            'zh-CN': '中文 (简体与繁体) (zh-CN, zh-TW, zh-HK)',
            'zh-TW': '中文 (簡體與繁體) (zh-CN, zh-TW, zh-HK)',
            'zh-HK': '中文 (簡體與繁體) (zh-CN, zh-TW, zh-HK)',
            ja: '中国語 (簡体字・繁体字) (zh-CN, zh-TW, zh-HK)',
            ru: 'Китайский (упрощенный и традиционный) (zh-CN, zh-TW, zh-HK)'
        },
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
        langLabel: {
            en: 'Japanese (ja, en)',
            'zh-CN': '日语 (ja, en)',
            'zh-TW': '日語 (ja, en)',
            'zh-HK': '日語 (ja, en)',
            ja: '日本語 (ja, en)',
            ru: 'Японский (ja, en)'
        },
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
        langLabel: {
            en: 'Simplified Chinese (zh-CN, en)',
            'zh-CN': '简体中文 (zh-CN, en)',
            'zh-TW': '簡體中文 (zh-CN, en)',
            'zh-HK': '簡體中文 (zh-CN, en)',
            ja: '中国語簡体字 (zh-CN, en)',
            ru: 'Упрощенный китайский (zh-CN, en)'
        },
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
        langLabel: {
            en: 'Traditional Chinese (zh-TW, zh-HK, en)',
            'zh-CN': '繁体中文 (zh-TW, zh-HK, en)',
            'zh-TW': '繁體中文 (zh-TW, zh-HK, en)',
            'zh-HK': '繁體中文 (zh-TW, zh-HK, en)',
            ja: '中国語繁体字 (zh-TW, zh-HK, en)',
            ru: 'Традиционный китайский (zh-TW, zh-HK, en)'
        },
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
        langLabel: {
            en: 'Japanese (ja, en)',
            'zh-CN': '日文 (ja, en)',
            'zh-TW': '日文 (ja, en)',
            'zh-HK': '日文 (ja, en)',
            ja: '日本語 (ja, en)',
            ru: 'Японский (ja, en)'
        },
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
            "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"
        ]
    }
];

const CACHE_NAME = "browserscope-fonts";

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
    if (!loadedFace) {
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
