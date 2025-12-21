
import { useCallback, useMemo } from 'react';
import { formatNumber, formatPercent, formatList, formatBytes, formatSpeed, formatHertz } from '../utils/formatters';

export const useFormatter = (locale: string) => {
  
  // Advanced: Intl.DisplayNames
  // Returns the name of a language code (e.g. 'zh-CN' -> 'Chinese (Simplified)') in the CURRENT locale
  const formatLanguageName = useCallback((code: string) => {
    try {
      // @ts-ignore - TS might not know about DisplayNames in older libs
      if (typeof Intl.DisplayNames !== 'undefined') {
        // @ts-ignore
        return new Intl.DisplayNames([locale], { type: 'language' }).of(code) || code;
      }
      return code;
    } catch (e) { return code; }
  }, [locale]);

  // Returns the name of a region code (e.g. 'US' -> 'United States') in the CURRENT locale
  const formatRegionName = useCallback((code: string) => {
    try {
      // @ts-ignore
      if (typeof Intl.DisplayNames !== 'undefined') {
        // @ts-ignore
        return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code;
      }
      return code;
    } catch (e) { return code; }
  }, [locale]);

  // Returns the Native name of a language (e.g. 'ja' -> '日本語' even if current locale is en)
  // Useful for language switchers
  const formatNativeLanguageName = useCallback((code: string) => {
    try {
      // @ts-ignore
      if (typeof Intl.DisplayNames !== 'undefined') {
        // @ts-ignore
        return new Intl.DisplayNames([code], { type: 'language' }).of(code) || code;
      }
      return code;
    } catch (e) { return code; }
  }, []);

  // Relative Time (e.g., "5 minutes ago")
  const formatRelativeTime = useCallback((value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) => {
    try {
      if (typeof Intl.RelativeTimeFormat !== 'undefined') {
        return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
      }
      return `${value} ${unit}`;
    } catch (e) { return `${value} ${unit}`; }
  }, [locale]);

  // Bind existing utils to the hook's locale
  // useMemo ensures these functions are stable references unless locale changes
  const num = useCallback((n: number, maxD?: number, minD?: number) => formatNumber(n, maxD, minD, locale), [locale]);
  const pct = useCallback((n: number, maxD?: number) => formatPercent(n, maxD, locale), [locale]);
  const list = useCallback((l: string[], type?: 'conjunction' | 'disjunction' | 'unit') => formatList(l, type, locale), [locale]);
  const bytes = useCallback((b: number) => formatBytes(b, locale), [locale]);
  
  return {
    locale,
    formatLanguageName,
    formatRegionName,
    formatNativeLanguageName,
    formatRelativeTime,
    number: num,
    percent: pct,
    list: list,
    bytes: bytes,
    speed: (s: number) => formatSpeed(s, locale),
    hertz: (h: number) => formatHertz(h, locale)
  };
};
