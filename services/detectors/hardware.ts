
import { BatteryManager, AiReadiness, ExtendedNavigator } from '../../types';
import { formatBytes, formatPercent } from '../../utils/formatters';

export interface BatteryInfo {
  level: string;
  charging: string;
  chargingTime: string;
  dischargingTime: string;
}

const UNREADABLE_BATTERY_VALUES = new Set([
  '',
  'Unknown',
  'Not Supported',
  'Timeout',
  'Unavailable',
  'N/A',
  '-',
]);

export const isBatteryValueReadable = (level?: string | null): boolean => {
  if (!level) return false;
  const trimmed = level.trim();
  if (UNREADABLE_BATTERY_VALUES.has(trimmed)) return false;
  return !Number.isNaN(parseFloat(trimmed));
};

export const formatBatteryTime = (time: unknown): string => {
  if (typeof time !== 'number' || !Number.isFinite(time) || time <= 0) {
    return 'N/A';
  }
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

export const formatBatterySnapshot = (
  battery: Partial<BatteryManager> | null | undefined
): BatteryInfo | null => {
  if (!battery || typeof battery.level !== 'number' || !Number.isFinite(battery.level)) {
    return null;
  }
  const clampedLevel = Math.min(1, Math.max(0, battery.level));
  return {
    level: formatPercent(clampedLevel),
    charging: battery.charging ? 'Yes' : 'No',
    chargingTime: formatBatteryTime(battery.chargingTime),
    dischargingTime: formatBatteryTime(battery.dischargingTime),
  };
};

export interface GetBatteryOptions {
  retries?: number;
  retryDelayMs?: number;
}

export const getBatteryInfo = async (options: GetBatteryOptions = {}): Promise<BatteryInfo> => {
  const { retries = 2, retryDelayMs = 150 } = options;
  const nav = typeof navigator !== 'undefined' ? (navigator as ExtendedNavigator) : undefined;

  if (!nav || typeof nav.getBattery !== 'function') {
    return { level: 'Not Supported', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' };
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const battery = await nav.getBattery();
      const formatted = formatBatterySnapshot(battery);
      if (formatted) {
        return formatted;
      }
    } catch {
      // Transient IPC/permission failure; retry below if attempts remain
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
    }
  }

  return { level: 'Unavailable', charging: 'Unknown', chargingTime: '-', dischargingTime: '-' };
};

export const subscribeBatteryUpdates = (
  onUpdate: (info: BatteryInfo) => void,
  options: GetBatteryOptions = {}
): (() => void) => {
  const { retries = 2, retryDelayMs = 200 } = options;
  const nav = typeof navigator !== 'undefined' ? (navigator as ExtendedNavigator) : undefined;
  if (!nav || typeof nav.getBattery !== 'function') {
    return () => {};
  }

  let cancelled = false;
  let batteryRef: BatteryManager | null = null;

  const handleChange = () => {
    if (cancelled || !batteryRef) return;
    const formatted = formatBatterySnapshot(batteryRef);
    if (formatted) {
      onUpdate(formatted);
    }
  };

  const events = ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange'] as const;

  const attach = async () => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (cancelled) return;
      try {
        const battery = await nav.getBattery!();
        if (cancelled) return;
        if (battery) {
          batteryRef = battery;
          handleChange();
          if (typeof battery.addEventListener === 'function') {
            for (const eventName of events) {
              battery.addEventListener(eventName, handleChange);
            }
          }
          return;
        }
      } catch {
        // Transient error; retry below if attempts remain
      }

      if (attempt < retries && !cancelled) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
      }
    }
  };

  void attach();

  return () => {
    cancelled = true;
    if (batteryRef && typeof batteryRef.removeEventListener === 'function') {
      for (const eventName of events) {
        batteryRef.removeEventListener(eventName, handleChange);
      }
    }
  };
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
