import React, { useMemo } from 'react';
import {
  buildProgressiveBlurCssVars,
  supportsProgressiveBlur,
  type ProgressiveBlurDirection,
} from '../../utils/progressiveBlur';

export interface ProgressiveBlurProps {
  /** Whether progressive blur is toggled on by user settings */
  enabled?: boolean;
  /** External override (e.g. global Disable Blur) forcing solid fallback */
  disabled?: boolean;
  /** Mask fade direction (default: 'to bottom') */
  direction?: ProgressiveBlurDirection;
  /** Base feathered backdrop blur in px (default: 0) */
  baseBlur?: number;
  /** Peak progressive backdrop blur in px (default: 14) */
  maxBlur?: number;
  /** Gradient mask solid stop (default: '46%') */
  maskStart?: string;
  /** Gradient mask transparent end stop strictly inside bounds (default: '98%') */
  maskEnd?: string;
  /** Surface tint opacity for contrast protection (default: 0.72) */
  overlayAlpha?: number;
  /** Additional classes for outer positioning wrapper */
  className?: string;
  /** Classes applied when falling back to opaque solid backing */
  fallbackClassName?: string;
}

export const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  enabled = true,
  disabled = false,
  direction = 'to bottom',
  baseBlur = 0,
  maxBlur = 14,
  maskStart = '46%',
  maskEnd = '98%',
  overlayAlpha = 0.72,
  className = '',
  fallbackClassName = '',
}) => {
  const isBrowserSupported = useMemo(() => supportsProgressiveBlur(), []);
  const isActive = isBrowserSupported && enabled && !disabled;

  const cssVars = useMemo(
    () =>
      buildProgressiveBlurCssVars({
        direction,
        baseBlur,
        maxBlur,
        maskStart,
        maskEnd,
        overlayAlpha,
      }),
    [direction, baseBlur, maxBlur, maskStart, maskEnd, overlayAlpha],
  );

  if (!isActive) {
    return (
      <div
        aria-hidden="true"
        data-progressive-blur="fallback"
        className={`pointer-events-none progressive-blur-fallback ${fallbackClassName} ${className}`.trim()}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      data-progressive-blur="active"
      style={cssVars}
      className={`pointer-events-none overflow-hidden ${className}`.trim()}
    >
      {baseBlur > 0 && <div className="absolute inset-0 progressive-blur-base" />}
      <div className="absolute inset-0 progressive-blur-feather" />
      <div className="absolute inset-0 progressive-blur-layer" />
      <div className="absolute inset-0 progressive-blur-scrim" />
    </div>
  );
};
