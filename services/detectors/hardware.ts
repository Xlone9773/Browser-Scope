
import { BatteryManager, AiReadiness } from '../../types';
import { formatBytes, formatPercent } from '../../utils/formatters';

export const getBatteryInfo = async (): Promise<{ level: string; charging: string; chargingTime: string; dischargingTime: string }> => {
  try {
    
    // @ts-expect-error auto-fixed
    if (navigator.getBattery) {
      
      // @ts-expect-error auto-fixed
      const battery: BatteryManager = await navigator.getBattery();
      const formatTime = (time: number) => {
          if (time === Infinity || time === 0) return 'N/A';
          const hrs = Math.floor(time / 3600);
          const mins = Math.floor((time % 3600) / 60);
          if (hrs > 0) return `${hrs}h ${mins}m`;
          return `${mins}m`;
      };
      return {
        level: formatPercent(battery.level),
        charging: battery.charging ? 'Yes' : 'No',
        chargingTime: formatTime(battery.chargingTime),
        dischargingTime: formatTime(battery.dischargingTime)
      };
    }
    return { level: 'Not Supported', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' };
  } catch { return { level: 'Unavailable', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' }; }
};

export const getStorageEstimate = async (): Promise<{ quota: string, usage: string, persisted: boolean }> => {
  let quota = 'Unknown';
  let usage = '0 B';
  let persisted = false;

  try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        quota = estimate.quota ? formatBytes(estimate.quota) : 'Unknown';
        usage = estimate.usage ? formatBytes(estimate.usage) : '0 B';
      }
      
      if (navigator.storage && navigator.storage.persisted) {
        persisted = await navigator.storage.persisted();
      }
  } catch {
      // Fail silently for storage perms
  }

  return { quota, usage, persisted };
};

export const runAiReadinessCheck = (): AiReadiness => {
    const start = performance.now();
    let ops = 0;
    const durationLimit = 20; // Run for 20ms
    
    // Math intensive loop (floating point ops)
    while (performance.now() - start < durationLimit) {
        // Perform a mix of multiplication, division, and Math functions
        const a = Math.random();
        const b = Math.random();
        const c = Math.sqrt(a * b + 0.1);
        const _d = Math.sin(c) * Math.cos(a);
        ops += 10; // Approx operations per loop
    }
    
    const duration = performance.now() - start;
    const opsPerSec = (ops / duration) * 1000;
    const gflops = opsPerSec / 1e9;
    
    // Scale score to match 100ms equivalent for consistency
    const score = Math.round((ops / duration) * 100 / 1000); 
    
    let level: 'Low' | 'Medium' | 'High' | 'Ultra' = 'Low';
    
    if (score > 3000) { level = 'Ultra'; }
    else if (score > 1500) { level = 'High'; }
    else if (score > 500) { level = 'Medium'; }
    
    return {
        score,
        flops: gflops,
        level
    };
};

export const checkWasmSimd = () => {
    try {
        const buffer = new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);
        return WebAssembly.validate(buffer);
    } catch(_e) { return false; }
};
