import React, { useState, useEffect, useCallback } from 'react';
import { Database, RefreshCw, Trash2, Type, DownloadCloud, CheckCircle2, AlertCircle, X, Globe } from 'lucide-react';
import { Translation } from '../../utils/i18n/types';
import { Button } from '../ui/Button';
import { Language } from '../../utils/i18n/types';
import { languageNames } from '../../utils/i18n/index';
import { getDownloadedLocales, downloadLocale, deleteLocale, getLocaleSize, isLocaleDownloaded } from '../../utils/i18n/localeCache';

interface StorageTabProps {
    t: Translation['settings']['storage'];
    lang?: string;
    changeLang?: (lang: Language) => void;
}

interface FontItem {
    key: string;
    name: string;
    languages: string;
    langLabel: Record<string, string>;
    mirrors: string[];
}

const FONTS_LIST: FontItem[] = [
    {
        key: 'roboto',
        name: 'Roboto Regular',
        languages: 'ru',
        langLabel: {
            en: 'Russian / Cyrillic (ru)',
            'zh-CN': '俄语 / 西里尔文 (ru)',
            'zh-TW': '俄語 / 西里爾文 (ru)',
            'zh-HK': '俄語 / 西里爾文 (ru)',
            ja: 'ロシア語 / キリル文字 (ru)',
            ru: 'Русский / Кириллица (ru)'
        },
        mirrors: [
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf"
        ]
    },
    {
        key: 'zcoolxiaowei',
        name: 'ZCOOL XiaoWei',
        languages: 'zh-CN, zh-TW, zh-HK',
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
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/zcoolxiaowei/ZCOOLXiaoWei-Regular.ttf"
        ]
    },
    {
        key: 'sawarabigothic',
        name: 'Sawarabi Gothic',
        languages: 'ja',
        langLabel: {
            en: 'Japanese (ja)',
            'zh-CN': '日语 (ja)',
            'zh-TW': '日語 (ja)',
            'zh-HK': '日語 (ja)',
            ja: '日本語 (ja)',
            ru: 'Японский (ja)'
        },
        mirrors: [
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf",
            "https://fastly.jsdelivr.net/gh/google/fonts@main/ofl/sawarabigothic/SawarabiGothic-Regular.ttf"
        ]
    }
];

const CACHE_NAME = "browserscope-fonts";

export const StorageTab: React.FC<StorageTabProps> = ({ t, lang = 'en', changeLang }) => {
    const [localStorageCount, setLocalStorageCount] = useState(() => typeof window !== 'undefined' ? localStorage.length : 0);
    const [sessionStorageCount, setSessionStorageCount] = useState(() => typeof window !== 'undefined' ? sessionStorage.length : 0);
    const [swCount, setSwCount] = useState<number | null>(null);

    // Font states
    const [fontStatuses, setFontStatuses] = useState<Record<string, { isCached: boolean; size: string | null }>>({});
    const [downloadingKeys, setDownloadingKeys] = useState<Record<string, boolean>>({});
    const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});

    // Locales states
    const [localeStatuses, setLocaleStatuses] = useState<Record<Language, { isCached: boolean; size: string | null }>>({} as any);
    const [downloadingLocales, setDownloadingLocales] = useState<Record<string, boolean>>({});
    const [deletingLocales, setDeletingLocales] = useState<Record<string, boolean>>({});

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const triggerToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, []);

    const updateFontStatuses = useCallback(async () => {
        try {
            if (!('caches' in window)) return;
            const cache = await window.caches.open(CACHE_NAME);
            const updated: Record<string, { isCached: boolean; size: string | null }> = {};
            
            for (const font of FONTS_LIST) {
                const match = await cache.match(font.key);
                if (match) {
                    try {
                        const clone = match.clone();
                        const blob = await clone.blob();
                        const sizeInMb = (blob.size / (1024 * 1024)).toFixed(2);
                        updated[font.key] = {
                            isCached: true,
                            size: `${sizeInMb} MB`
                        };
                    } catch {
                        updated[font.key] = {
                            isCached: true,
                            size: t.fonts?.sizeUnknown || 'Size unknown'
                        };
                    }
                } else {
                    updated[font.key] = {
                        isCached: false,
                        size: null
                    };
                }
            }
            setFontStatuses(updated);
        } catch (err) {
            console.error("Failed to read font cache:", err);
        }
    }, [t]);

    const updateLocaleStatuses = useCallback(async () => {
        try {
            const list: Language[] = ['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'];
            const updated: Record<Language, { isCached: boolean; size: string | null }> = {} as any;
            for (const item of list) {
                const isCached = await isLocaleDownloaded(item);
                const size = await getLocaleSize(item);
                updated[item] = {
                    isCached,
                    size
                };
            }
            setLocaleStatuses(updated);
        } catch (err) {
            console.error("Failed to update locale statuses:", err);
        }
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations()
              .then(regs => {
                setSwCount(regs.length);
              })
              .catch(err => {
                  console.debug("Service Worker access restricted:", err);
                  setSwCount(null);
              });
        }
        
        const timer = setTimeout(() => {
            updateFontStatuses();
            updateLocaleStatuses();
        }, 0);
        return () => clearTimeout(timer);
    }, [updateFontStatuses, updateLocaleStatuses]);

    const clearStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        setLocalStorageCount(0);
        setSessionStorageCount(0);
        window.location.reload();
    };
  
    const unregisterSW = async () => {
        if ('serviceWorker' in navigator) {
            try {
              const regs = await navigator.serviceWorker.getRegistrations();
              for (const reg of regs) {
                  await reg.unregister();
              }
              setSwCount(0);
            } catch (err: unknown) {
                console.error("Failed to unregister service workers:", err);
            }
        }
    };

    const handleDownloadFont = async (fontKey: string, mirrors: string[]) => {
        if (!('caches' in window)) return;
        setDownloadingKeys(prev => ({ ...prev, [fontKey]: true }));
        let success = false;

        for (const url of mirrors) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const buffer = await res.arrayBuffer();
                    if (buffer.byteLength > 4) {
                        const cache = await window.caches.open(CACHE_NAME);
                        await cache.put(fontKey, new Response(buffer, {
                            headers: {
                                'Content-Type': 'font/ttf',
                                'Content-Length': String(buffer.byteLength)
                            }
                        }));
                        success = true;
                        break;
                    }
                }
            } catch (err) {
                console.warn(`Failed to manually fetch font from mirror: ${url}`, err);
            }
        }

        setDownloadingKeys(prev => ({ ...prev, [fontKey]: false }));
        if (success) {
            await updateFontStatuses();
            triggerToast(t.fonts?.downloadSuccess || "Font downloaded successfully!", "success");
        } else {
            triggerToast(t.fonts?.downloadFailed || "Failed to download font.", "error");
        }
    };

    const handleDeleteFont = async (fontKey: string) => {
        if (!('caches' in window)) return;
        setDeletingKeys(prev => ({ ...prev, [fontKey]: true }));
        let success = false;

        try {
            const cache = await window.caches.open(CACHE_NAME);
            success = await cache.delete(fontKey);
        } catch (err) {
            console.error("Failed to delete font from cache:", err);
        }

        setDeletingKeys(prev => ({ ...prev, [fontKey]: false }));
        if (success) {
            await updateFontStatuses();
            triggerToast(t.fonts?.deleteSuccess || "Font deleted successfully!", "success");
        } else {
            triggerToast(t.fonts?.deleteFailed || "Failed to delete font.", "error");
        }
    };

    const handleDownloadLocale = async (langKey: Language) => {
        setDownloadingLocales(prev => ({ ...prev, [langKey]: true }));
        const success = await downloadLocale(langKey);
        setDownloadingLocales(prev => ({ ...prev, [langKey]: false }));
        if (success) {
            await updateLocaleStatuses();
            triggerToast(t.locales?.downloadSuccess || "Language pack downloaded successfully!", "success");
        } else {
            triggerToast(t.locales?.downloadFailed || "Failed to download language pack.", "error");
        }
    };

    const handleDeleteLocale = async (langKey: Language) => {
        setDeletingLocales(prev => ({ ...prev, [langKey]: true }));
        const success = await deleteLocale(langKey);
        setDeletingLocales(prev => ({ ...prev, [langKey]: false }));
        if (success) {
            await updateLocaleStatuses();
            triggerToast(t.locales?.deleteSuccess || "Language pack deleted successfully!", "success");
            if (lang === langKey && changeLang) {
                changeLang('en');
            }
        } else {
            triggerToast(t.locales?.deleteFailed || "Failed to delete language pack.", "error");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Local Data */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.local.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.local.clearDesc}</p>
                        </div>
                    </div>
                    <Button 
                        variant="danger-soft" 
                        size="sm" 
                        onClick={clearStorage} 
                        leftIcon={<Trash2 size={16} />}
                    >
                        {t.local.clearBtn}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Local Storage Items</div>
                        <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{localStorageCount}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Session Storage Items</div>
                        <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">{sessionStorageCount}</div>
                    </div>
                </div>
            </div>

            {/* Fonts Cache Section */}
            {t.fonts && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Type size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.fonts.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {t.fonts.desc}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {FONTS_LIST.map((font) => {
                            const status = fontStatuses[font.key] || { isCached: false, size: null };
                            const isDownloading = downloadingKeys[font.key];
                            const isDeleting = deletingKeys[font.key];
                            const displayLang = font.langLabel[lang] || font.langLabel.en;

                            return (
                                <div key={font.key} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                                {font.name}
                                            </span>
                                            {status.isCached ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                                                    <CheckCircle2 size={10} />
                                                    {t.fonts.cached.replace('{size}', status.size || '')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                                                    <AlertCircle size={10} />
                                                    {t.fonts.notCached}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">{t.fonts.languages}: </span>
                                            <span className="font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                                                {displayLang}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {status.isCached ? (
                                            <Button
                                                variant="danger-soft"
                                                size="sm"
                                                onClick={() => handleDeleteFont(font.key)}
                                                isLoading={isDeleting}
                                                disabled={isDownloading || isDeleting}
                                                leftIcon={<Trash2 size={14} />}
                                            >
                                                {t.fonts.deleteBtn}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleDownloadFont(font.key, font.mirrors)}
                                                isLoading={isDownloading}
                                                disabled={isDownloading || isDeleting}
                                                leftIcon={<DownloadCloud size={14} />}
                                            >
                                                {isDownloading ? t.fonts.downloading : t.fonts.downloadBtn}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Language Packs Cache Section */}
            {t.locales && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.locales.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {t.locales.desc}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {(['en', 'zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'] as Language[]).map((langKey) => {
                            const status = localeStatuses[langKey] || { isCached: langKey === 'en', size: langKey === 'en' ? 'Core' : null };
                            const isDownloading = downloadingLocales[langKey];
                            const isDeleting = deletingLocales[langKey];
                            const langName = languageNames[langKey];

                            return (
                                <div key={langKey} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                                {langName}
                                            </span>
                                            {status.isCached ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                                                    <CheckCircle2 size={10} />
                                                    {langKey === 'en' ? t.locales.coreLanguage : t.locales.cached.replace('{size}', status.size || '')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                                                    <AlertCircle size={10} />
                                                    {t.locales.notCached}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            <span className="font-medium text-slate-600 dark:text-slate-300">{t.locales.code}: </span>
                                            <span className="font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                                                {langKey}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {langKey !== 'en' && (
                                            status.isCached ? (
                                                <Button
                                                    variant="danger-soft"
                                                    size="sm"
                                                    onClick={() => handleDeleteLocale(langKey)}
                                                    isLoading={isDeleting}
                                                    disabled={isDownloading || isDeleting}
                                                    leftIcon={<Trash2 size={14} />}
                                                >
                                                    {t.locales.deleteBtn}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleDownloadLocale(langKey)}
                                                    isLoading={isDownloading}
                                                    disabled={isDownloading || isDeleting}
                                                    leftIcon={<DownloadCloud size={14} />}
                                                >
                                                    {isDownloading ? t.locales.downloading : t.locales.downloadBtn}
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Service Workers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{t.sw.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.sw.desc}</p>
                        </div>
                    </div>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={unregisterSW}
                    >
                        {t.sw.unregisterBtn}
                    </Button>
                </div>
                {swCount !== null ? (<div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Registrations</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{swCount}</span>
                </div>) : null}
            </div>

            {/* Toast Overlay */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-bottom-2 ${
                    toast.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
                        : 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}>
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="hover:opacity-75 transition-opacity text-slate-400 dark:text-slate-300">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};
