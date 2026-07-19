import { Language, localeLoaders } from './index';

export const LOCALES_CACHE_NAME = "browserscope-locales";

// English is built-in and always cached
export const BUILTIN_LOCALES: Language[] = ['en'];

/**
 * Returns a list of languages that are currently cached.
 */
export async function getDownloadedLocales(): Promise<Language[]> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return BUILTIN_LOCALES;
  }
  try {
    const cache = await window.caches.open(LOCALES_CACHE_NAME);
    const keys = await cache.keys();
    const downloaded: Language[] = [...BUILTIN_LOCALES];
    for (const req of keys) {
      const url = new URL(req.url);
      let path = url.pathname.split('/').pop() || '';
      if (path.endsWith('.json')) {
        path = path.slice(0, -5);
      }
      if (path && path !== 'en' && ['zh-CN', 'zh-TW', 'zh-HK', 'ja', 'ru'].includes(path)) {
        downloaded.push(path as Language);
      }
    }
    return downloaded;
  } catch (err) {
    console.error("Failed to get downloaded locales:", err);
    return BUILTIN_LOCALES;
  }
}

/**
 * Checks if a language is downloaded/cached
 */
export async function isLocaleDownloaded(lang: Language): Promise<boolean> {
  if (lang === 'en') return true;
  if (typeof window === 'undefined' || !('caches' in window)) return true;
  try {
    const cache = await window.caches.open(LOCALES_CACHE_NAME);
    const cacheKey = `https://local-locales.browserscope/${lang}.json`;
    const match = await cache.match(cacheKey);
    return !!match;
  } catch {
    return false;
  }
}

/**
 * Downloads and caches a language pack.
 * We dynamically load the translation module via localeLoaders,
 * stringify it, and write it as a response into the Cache Storage.
 */
export async function downloadLocale(lang: Language): Promise<boolean> {
  if (lang === 'en') return true;
  if (typeof window === 'undefined' || !('caches' in window)) return true;
  try {
    const loader = localeLoaders[lang];
    if (!loader) return false;
    
    // Dynamically load the module using Vite's loader
    const module = await loader();
    const content = JSON.stringify(module);
    const size = new Blob([content]).size;
    
    const cache = await window.caches.open(LOCALES_CACHE_NAME);
    const cacheKey = `https://local-locales.browserscope/${lang}.json`;
    await cache.put(cacheKey, new Response(content, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': String(size),
        'X-Downloaded-At': new Date().toISOString()
      }
    }));
    return true;
  } catch (err) {
    console.error(`Failed to download locale pack for ${lang}:`, err);
    return false;
  }
}

/**
 * Deletes a cached language pack.
 */
export async function deleteLocale(lang: Language): Promise<boolean> {
  if (lang === 'en') return false;
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const cache = await window.caches.open(LOCALES_CACHE_NAME);
    const cacheKey = `https://local-locales.browserscope/${lang}.json`;
    return await cache.delete(cacheKey);
  } catch (err) {
    console.error(`Failed to delete locale pack for ${lang}:`, err);
    return false;
  }
}

/**
 * Gets the size of a cached language pack.
 */
export async function getLocaleSize(lang: Language): Promise<string | null> {
  if (lang === 'en') return 'Core';
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  try {
    const cache = await window.caches.open(LOCALES_CACHE_NAME);
    const cacheKey = `https://local-locales.browserscope/${lang}.json`;
    const match = await cache.match(cacheKey);
    if (!match) return null;
    const blob = await match.blob();
    // Return size in KB
    return `${(blob.size / 1024).toFixed(1)} KB`;
  } catch {
    return null;
  }
}
