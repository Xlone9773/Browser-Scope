
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
    const durationLimit = 30; // 30ms limit to prevent UI thread blocking while ensuring measurement accuracy
    let iterations = 0;
    
    // Initialize 8 independent floating-point variables to maximize Instruction-Level Parallelism (ILP).
    // This allows the CPU's out-of-order execution engine to run multiple instructions concurrently.
    // The coefficients mult < 1.0 guarantee that each sequence converges stably to a fixed point,
    // avoiding arithmetic overflow (Infinity) or underflow (0/subnormals) which causes CPU execution penalties.
    let x0 = 1.0;
    let x1 = 1.1;
    let x2 = 1.2;
    let x3 = 1.3;
    let x4 = 1.4;
    let x5 = 1.5;
    let x6 = 1.6;
    let x7 = 1.7;

    while (performance.now() - start < durationLimit) {
        // Unroll 10 blocks of 8 independent FMA-like operations.
        // Each FMA-like operation is x = x * multiplier + addend, which counts as 2 FLOPs (1 multiply, 1 add).
        // 10 blocks * 8 variables * 2 operations = 160 FLOPs per iteration.
        for (let i = 0; i < 10; i++) {
            x0 = x0 * 0.9999 + 0.0001;
            x1 = x1 * 0.9998 + 0.0002;
            x2 = x2 * 0.9997 + 0.0003;
            x3 = x3 * 0.9996 + 0.0004;
            x4 = x4 * 0.9995 + 0.0005;
            x5 = x5 * 0.9994 + 0.0006;
            x6 = x6 * 0.9993 + 0.0007;
            x7 = x7 * 0.9992 + 0.0008;
        }
        iterations++;
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Total floating-point operations executed
    const totalOps = iterations * 160;
    const durationSeconds = duration / 1000;
    
    // Single-thread GFLOPS
    const singleThreadGflops = (totalOps / durationSeconds) / 1e9;
    
    // Estimate total device CPU capabilities using hardwareConcurrency
    const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    const multiCoreScalingEfficiency = 0.85; // Standard efficiency coefficient under high compute workloads
    const estimatedMultiThreadGflops = singleThreadGflops * cores * multiCoreScalingEfficiency;
    
    // Convert to standard scoring (1 GFLOPS = 100 points)
    const score = Math.round(estimatedMultiThreadGflops * 100);
    
    // Categorize performance under standard GFLOPS ranges:
    // Low: < 3 GFLOPS (Legacy or entry-level low-power device cores)
    // Medium: 3 - 10 GFLOPS (Standard multi-core processors, mainstream devices)
    // High: 10 - 25 GFLOPS (High-performance multi-core consumer processors)
    // Ultra: > 25 GFLOPS (Premium workstation/gaming class CPUs or multi-core environments)
    let level: 'Low' | 'Medium' | 'High' | 'Ultra' = 'Low';
    if (estimatedMultiThreadGflops > 25) {
        level = 'Ultra';
    } else if (estimatedMultiThreadGflops > 10) {
        level = 'High';
    } else if (estimatedMultiThreadGflops > 3) {
        level = 'Medium';
    }
    
    // Simple verification side-effect to prevent JS compiler optimization from trimming loops
    const checkSum = x0 + x1 + x2 + x3 + x4 + x5 + x6 + x7;
    if (checkSum === 0) {
        console.debug("FMA boundary check passed:", checkSum);
    }
    
    return {
        score,
        flops: estimatedMultiThreadGflops,
        level
    };
};

export const checkWasmSimd = () => {
    try {
        const buffer = new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);
        return WebAssembly.validate(buffer);
    } catch { return false; }
};
