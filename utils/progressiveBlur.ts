import type React from 'react';

export type ProgressiveBlurDirection = 'to bottom' | 'to top' | 'to left' | 'to right';

export interface ProgressiveBlurCssOptions {
  direction?: ProgressiveBlurDirection;
  baseBlur?: number;
  maxBlur?: number;
  maskStart?: string;
  maskEnd?: string;
  overlayAlpha?: number;
}

export interface ProgressiveBlurStateInput {
  isSupported: boolean;
  disableBlur: boolean;
  enableProgressiveBlur: boolean;
}

export interface ProgressiveBlurResolution {
  isSupported: boolean;
  isBlockedByDisableBlur: boolean;
  isToggleDisabled: boolean;
  isSwitchChecked: boolean;
  isEffectActive: boolean;
}

export type ProgressiveBlurCssVarStyle = React.CSSProperties &
  Record<`--pb-${string}`, string>;

export type CssSupportsChecker = (property: string, value: string) => boolean;

const parseStopPercent = (value: string, fallback: number): number => {
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(100, Math.max(0, parsed));
};

export const supportsProgressiveBlur = (
  supportsFn?: CssSupportsChecker | null,
): boolean => {
  const checker =
    supportsFn ??
    (typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
      ? (prop: string, val: string) => CSS.supports(prop, val)
      : null);

  if (!checker) return false;

  try {
    const hasBackdropFilter =
      checker('backdrop-filter', 'blur(1px)') ||
      checker('-webkit-backdrop-filter', 'blur(1px)');
    const hasMaskImage =
      checker('mask-image', 'linear-gradient(to bottom, #000, transparent)') ||
      checker('-webkit-mask-image', 'linear-gradient(to bottom, #000, transparent)');

    return hasBackdropFilter && hasMaskImage;
  } catch {
    return false;
  }
};

export const resolveProgressiveBlurState = ({
  isSupported,
  disableBlur,
  enableProgressiveBlur,
}: ProgressiveBlurStateInput): ProgressiveBlurResolution => {
  const isBlockedByDisableBlur = disableBlur;
  const isToggleDisabled = !isSupported || disableBlur;
  const isEffectActive = isSupported && !disableBlur && enableProgressiveBlur;
  const isSwitchChecked = isEffectActive;

  return {
    isSupported,
    isBlockedByDisableBlur,
    isToggleDisabled,
    isSwitchChecked,
    isEffectActive,
  };
};

export const buildProgressiveBlurCssVars = ({
  direction = 'to bottom',
  baseBlur = 0,
  maxBlur = 14,
  maskStart = '46%',
  maskEnd = '98%',
  overlayAlpha = 0.72,
}: ProgressiveBlurCssOptions = {}): ProgressiveBlurCssVarStyle => {
  const clampedBase = Math.max(0, Number.isFinite(baseBlur) ? baseBlur : 0);
  const clampedMax = Math.max(clampedBase, Number.isFinite(maxBlur) ? maxBlur : 14);
  const clampedAlpha = Math.min(1, Math.max(0, Number.isFinite(overlayAlpha) ? overlayAlpha : 0.72));
  const midBlur = Math.max(1, Math.round(clampedMax * 0.36));

  const startPct = parseStopPercent(maskStart, 46);
  const endPct = Math.min(99, Math.max(startPct + 8, parseStopPercent(maskEnd, 98)));
  const span = endPct - startPct;

  const stop = (t: number) => `${Math.round((startPct + span * t) * 10) / 10}%`;

  return {
    '--pb-direction': direction,
    '--pb-base-blur': `${clampedBase}px`,
    '--pb-mid-blur': `${midBlur}px`,
    '--pb-max-blur': `${clampedMax}px`,
    '--pb-mask-start': `${startPct}%`,
    '--pb-mask-end': `${endPct}%`,
    // Staggered inner deep-blur stops (finish early inside box to prevent banding)
    '--pb-peak-mid1': stop(0.24),
    '--pb-peak-mid2': stop(0.48),
    '--pb-peak-end': stop(0.72),
    // Outer soft feathering band stops (smooth ease-out tail ending strictly before box edge)
    '--pb-feather-start': stop(0.1),
    '--pb-feather-mid1': stop(0.42),
    '--pb-feather-mid2': stop(0.7),
    '--pb-feather-mid3': stop(0.88),
    // Soft scrim tint opacity levels
    '--pb-overlay-alpha': String(clampedAlpha),
    '--pb-scrim-alpha-mid1': String(Math.round(clampedAlpha * 0.68 * 1000) / 1000),
    '--pb-scrim-alpha-mid2': String(Math.round(clampedAlpha * 0.28 * 1000) / 1000),
    '--pb-scrim-alpha-mid3': String(Math.round(clampedAlpha * 0.06 * 1000) / 1000),
  };
};
