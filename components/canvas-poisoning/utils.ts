// src/components/canvas-poisoning/utils.ts

import { ExtendedWindow } from './types';

export const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
};

export const isHooked = (fn: (...args: never[]) => unknown): boolean => {
  try {
    return !/\{\s*\[native code\]\s*\}/.test(fn.toString());
  } catch {
    return true;
  }
};

export const checkAudioHooks = (): { hooked: boolean; name?: string } => {
  const extWindow = window as unknown as ExtendedWindow;
  const checks = [
    { obj: window.AudioContext?.prototype, prop: 'baseLatency', name: 'AudioContext.baseLatency' },
    { obj: window.AudioContext?.prototype, prop: 'outputLatency', name: 'AudioContext.outputLatency' },
    { obj: extWindow.webkitAudioContext?.prototype, prop: 'baseLatency', name: 'webkitAudioContext.baseLatency' },
    { obj: window.OfflineAudioContext?.prototype, prop: 'startRendering', name: 'OfflineAudioContext.startRendering' },
    { obj: window.AudioBuffer?.prototype, prop: 'getChannelData', name: 'AudioBuffer.getChannelData' }
  ];

  for (const check of checks) {
    if (!check.obj) continue;
    try {
      const desc = Object.getOwnPropertyDescriptor(check.obj, check.prop);
      if (desc) {
        if (desc.get && isHooked(desc.get as unknown as (...args: never[]) => unknown)) {
          return { hooked: true, name: check.name };
        }
        if (desc.value && typeof desc.value === 'function' && isHooked(desc.value as unknown as (...args: never[]) => unknown)) {
          return { hooked: true, name: check.name };
        }
      }
    } catch {
      return { hooked: true, name: check.name };
    }
  }
  return { hooked: false };
};

export const renderAudio = async (): Promise<Float32Array | null> => {
  try {
    const extWindow = window as unknown as ExtendedWindow;
    const AudioCtx = window.OfflineAudioContext || extWindow.webkitOfflineAudioContext;
    if (!AudioCtx) return null;
    
    const ctx = new AudioCtx(1, 44100 * 0.05, 44100); 
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, 0);
    osc.frequency.exponentialRampToValueAtTime(880, 0.04);
    
    gain.gain.setValueAtTime(1, 0);
    gain.gain.linearRampToValueAtTime(0.01, 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(0);
    const renderedBuffer = await ctx.startRendering();
    if (!renderedBuffer) return null;
    
    return renderedBuffer.getChannelData(0).slice(0, 150);
  } catch {
    return null;
  }
};
