
import { en } from './en';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK' | 'ja' | 'ru';

// Automatic type inference from the English translation file.
// This becomes the "Source of Truth". No more manual interface maintenance.
export type Translation = typeof en;

// Helper to enforce type checking on other language files
// usage: export const zhCN: Translation = { ... }
