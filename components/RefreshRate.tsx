import React, { useEffect, useState, useRef } from 'react';
import { InfoItem } from './InfoCard';

interface RefreshRateProps {
  label: string;
}

const STANDARD_REFRESH_RATES = [24, 30, 60, 75, 90, 120, 144, 165, 240];

const snapToStandardRate = (rawFps: number): number => {
  let closest = STANDARD_REFRESH_RATES[0];
  let minDiff = Math.abs(rawFps - closest);

  for (let i = 1; i < STANDARD_REFRESH_RATES.length; i++) {
    const rate = STANDARD_REFRESH_RATES[i];
    const diff = Math.abs(rawFps - rate);
    if (diff < minDiff) {
      minDiff = diff;
      closest = rate;
    }
  }

  return closest;
};

export const RefreshRate: React.FC<RefreshRateProps> = ({ label }) => {
  const [fps, setFps] = useState<number | null>(null);
  const deltasRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const sampleCount = 60;

    const measure = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;
        if (delta > 0) {
          deltasRef.current.push(delta);
        }
      }
      lastTimeRef.current = time;

      if (deltasRef.current.length >= sampleCount) {
        const deltas = [...deltasRef.current];
        deltas.sort((a, b) => a - b);

        // 剔除离群值：丢弃最大 15% 和最小 15% 的帧间距 Delta
        const cut = Math.floor(deltas.length * 0.15);
        const trimmedDeltas = deltas.slice(cut, deltas.length - cut);

        if (trimmedDeltas.length > 0) {
          const sumDelta = trimmedDeltas.reduce((acc, val) => acc + val, 0);
          const avgDelta = sumDelta / trimmedDeltas.length;
          if (avgDelta > 0) {
            const rawFps = 1000 / avgDelta;
            const snappedFps = snapToStandardRate(rawFps);
            setFps(snappedFps);
          }
        }
        return;
      }

      requestRef.current = requestAnimationFrame(measure);
    };

    requestRef.current = requestAnimationFrame(measure);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <InfoItem 
      label={label} 
      value={fps !== null ? `${fps} Hz` : 'Calculating...'} 
    />
  );
};

