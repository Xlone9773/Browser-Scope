
// A centralized place for Intl formatters to ensure performance (reuse instances) and consistency

// Fix: Add type definitions for Intl.ListFormat if they are missing
declare global {
  namespace Intl {
    interface ListFormatOptions {
      localeMatcher?: 'lookup' | 'best fit';
      type?: 'conjunction' | 'disjunction' | 'unit';
      style?: 'long' | 'short' | 'narrow';
    }

    class ListFormat {
      constructor(locales?: string | string[], options?: ListFormatOptions);
      format(list: Iterable<string>): string;
    }
  }
}

// Cache formatters to avoid re-instantiating overhead
// Key now includes locale to support dynamic switching
const numberFormatters = new Map<string, Intl.NumberFormat>();
const listFormatters = new Map<string, Intl.ListFormat>();

const getNumberFormatter = (locale: string | undefined, options?: Intl.NumberFormatOptions) => {
    const key = `${locale || 'default'}-${JSON.stringify(options)}`;
    if (!numberFormatters.has(key)) {
        numberFormatters.set(key, new Intl.NumberFormat(locale, options));
    }
    return numberFormatters.get(key)!;
};

const getListFormatter = (locale: string | undefined, options?: Intl.ListFormatOptions) => {
    // Only available in modern browsers
    if (typeof Intl.ListFormat === 'undefined') return null;
    
    const key = `${locale || 'default'}-${JSON.stringify(options)}`;
    if (!listFormatters.has(key)) {
        listFormatters.set(key, new Intl.ListFormat(locale, options));
    }
    return listFormatters.get(key)!;
};

/**
 * Formats bytes into localized string with unit (e.g., "10.5 GB", "500 MB")
 * Uses Intl.NumberFormat for unit display
 */
export const formatBytes = (bytes: number, locale?: string): string => {
  if (bytes === 0) return '0 B';
  if (isNaN(bytes)) return 'Unknown';

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
  
  // Guard against very large numbers out of range
  const unitIndex = Math.min(i, sizes.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  try {
      return getNumberFormatter(locale, {
        style: 'unit',
        unit: sizes[unitIndex],
        unitDisplay: 'short',
        maximumFractionDigits: 2
      }).format(value);
  } catch (e) {
      // Fallback for older browsers if unit is not supported
      const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      return `${value.toFixed(2)} ${suffixes[unitIndex]}`;
  }
};

/**
 * Formats network speed (Mbps/Gbps)
 */
export const formatSpeed = (mbps: number, locale?: string): string => {
    if (isNaN(mbps) || mbps === 0) return 'Unknown';
    
    try {
        return getNumberFormatter(locale, {
            style: 'unit',
            unit: 'megabit-per-second',
            unitDisplay: 'short',
            maximumFractionDigits: 1
        }).format(mbps);
    } catch (e) {
        return `${mbps.toFixed(1)} Mbps`;
    }
};

/**
 * Formats simple frequency (Hz)
 */
export const formatHertz = (hz: number, locale?: string): string => {
    if (isNaN(hz)) return 'Unknown';
    try {
        return getNumberFormatter(locale, {
            style: 'unit',
            unit: 'hertz',
            unitDisplay: 'short',
            maximumFractionDigits: 0
        }).format(hz);
    } catch (e) {
        return `${hz} Hz`;
    }
};

/**
 * Formats a generic number (integers or floats) with locale-aware separators.
 * e.g., 10000 -> "10,000" (en) or "10 000" (fr)
 */
export const formatNumber = (num: number, maxDecimals: number = 0, minDecimals: number = 0, locale?: string): string => {
    if (isNaN(num)) return '0';
    return getNumberFormatter(locale, {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: maxDecimals
    }).format(num);
};

/**
 * Formats a ratio (0 to 1) as a percentage string.
 * e.g., 0.85 -> "85%"
 */
export const formatPercent = (ratio: number, maxDecimals: number = 0, locale?: string): string => {
    if (isNaN(ratio)) return '0%';
    return getNumberFormatter(locale, {
        style: 'percent',
        maximumFractionDigits: maxDecimals
    }).format(ratio);
};

/**
 * Formats a list of strings into a localized list string.
 * e.g., ['A', 'B', 'C'] -> "A, B, and C" (en) or "A、B和C" (zh)
 */
export const formatList = (list: string[], type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction', locale?: string): string => {
    if (!list || list.length === 0) return '';
    
    const formatter = getListFormatter(locale, { style: 'long', type });
    if (formatter) {
        return formatter.format(list);
    }
    
    // Fallback
    return list.join(', ');
};

/**
 * Generates a timestamp string for filenames (YYYY-MM-DD-HH-MM)
 * Uses Intl to ensure parts are correct regardless of timezone
 */
export const generateFilenameTimestamp = (): string => {
    const now = new Date();
    // We use 'en-CA' because it formats as YYYY-MM-DD (ISO-8601-like) which is sortable
    // hour12: false guarantees 24h format
    const formatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    // Format parts and replace standard separators with hyphens for filename safety
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';
    
    return `${getPart('year')}-${getPart('month')}-${getPart('day')}-${getPart('hour')}-${getPart('minute')}`;
};
