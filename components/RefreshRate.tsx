import React, { useEffect, useState, useRef } from 'react';
import { InfoItem } from './InfoCard';

interface RefreshRateProps {
  label: string;
}

export const RefreshRate: React.FC<RefreshRateProps> = ({ label }) => {
  const [fps, setFps] = useState<number | null>(null);
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = (time: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = time;
      }

      frameCountRef.current++;
      const elapsed = time - startTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        // We only measure once to save resources, but you could reset to keep measuring
        return; 
      }

      requestRef.current = requestAnimationFrame(measure);
    };

    requestRef.current = requestAnimationFrame(measure);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <InfoItem 
      label={label} 
      value={fps ? `${fps} Hz` : 'Calculating...'} 
    />
  );
};
