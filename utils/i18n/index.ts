import { en } from './en';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { zhHK } from './zh-HK';
import { ja } from './ja';
import { ru } from './ru';
import { Translation, Language } from './types';

export type { Language };

export const translations: Record<Language, Translation> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'zh-HK': zhHK,
  ja,
  ru
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文 (台灣)',
  'zh-HK': '繁體中文 (香港)',
  ja: '日本語',
  ru: 'Русский'
};