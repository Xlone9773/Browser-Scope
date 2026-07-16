
import { en } from './en';
import { Translation, Language } from './types';

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
  en: () => Promise.resolve({ en }),
  'zh-CN': () => import('./zh-CN'),
  'zh-TW': () => import('./zh-TW'),
  'zh-HK': () => import('./zh-HK'),
  ja: () => import('./ja'),
  ru: () => import('./ru'),
};

export let activeTranslations: Translation = en;

export function setActiveTranslations(t: Translation) {
  activeTranslations = t;
}

export const loadLocale = async (lang: Language): Promise<Translation> => {
  if (lang === 'en') {
    activeTranslations = en;
    return en;
  }
  const loader = localeLoaders[lang];
  if (!loader) {
    activeTranslations = en;
    return en;
  }
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
    const key = keyMap[lang];
    const loaded = module[key] || module.default || en;
    activeTranslations = loaded;
    return loaded;
  } catch (error) {
    console.error(`Failed to load translation locale for ${lang}:`, error);
    return en;
  }
};

