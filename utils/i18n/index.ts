import { Translation, Language } from './types';
import { en } from './en';

export type { Language, Translation };
export { en };

export const languageNames: Record<Language, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文 (台灣)',
  'zh-HK': '繁體中文 (香港)',
  ja: '日本語',
  ru: 'Русский'
};

export interface TranslationModule {
  en?: Translation;
  zhCN?: Translation;
  zhTW?: Translation;
  zhHK?: Translation;
  ja?: Translation;
  ru?: Translation;
  default?: Translation;
}

export const localeLoaders: Record<Language, () => Promise<TranslationModule>> = {
  en: () => import('./en'),
  'zh-CN': () => import('./zh-CN'),
  'zh-TW': () => import('./zh-TW'),
  'zh-HK': () => import('./zh-HK'),
  ja: () => import('./ja'),
  ru: () => import('./ru'),
};

export let activeTranslations: Translation | null = null;

export function setActiveTranslations(t: Translation) {
  activeTranslations = t;
}

export const loadLocale = async (lang: Language): Promise<Translation> => {
  const loader = localeLoaders[lang] || localeLoaders['en'];
  try {
    const module = await loader();
    const keyMap: Record<Language, keyof TranslationModule> = {
      en: 'en',
      'zh-CN': 'zhCN',
      'zh-TW': 'zhTW',
      'zh-HK': 'zhHK',
      ja: 'ja',
      ru: 'ru',
    };
    const key = keyMap[lang] || 'en';
    const loaded = module[key] || module.default;
    if (!loaded) {
      throw new Error(`Locale key ${key} not found in module`);
    }
    activeTranslations = loaded;
    return loaded;
  } catch (error) {
    console.error(`Failed to load translation locale for ${lang}:`, error);
    // Fallback dynamically to English ('en') if preferred language fails
    try {
      if (lang !== 'en') {
        const enModule = await localeLoaders['en']();
        const loaded = enModule['en'] || enModule.default;
        if (loaded) {
          activeTranslations = loaded;
          return loaded;
        }
      }
    } catch (fallbackError) {
      console.error("Critical fallback to English failed:", fallbackError);
    }
    
    // Safety fallback to statically imported English to prevent application crash
    activeTranslations = en;
    return en;
  }
};
