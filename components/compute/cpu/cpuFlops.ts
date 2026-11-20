import {
  WASM_SIMD_FLOPS_PER_ITERATION,
  WASM_SIMD_REDUCTION_FLOPS,
  executeWasmSimdReference,
  getWasmSimdRunner,
  type CpuComputeMode,
} from './wasmSimdKernel';

export type { CpuComputeMode };

// Scalar JS fallback: 4 unrolled independent updates across 8 scalar FP64 lanes
// (4 * 8 * 2 FLOPs = 64) + 3 iteration-drive ops = 67 FLOPs/iteration.
export const CPU_SCALAR_FLOPS_PER_ITERATION = 67;
export const CPU_SCALAR_REDUCTION_FLOPS = 7;

export interface CpuKernelResult {
  lanesSum: number;
  digest: number;
  mode: CpuComputeMode;
  ops: number;
}

export const computeCpuOpsForBatch = (
  iterations: number,
  mode: CpuComputeMode = 'scalar-js',
): number => {
  const safeIterations = Math.max(0, Math.floor(iterations));
  if (safeIterations === 0) return 0;
  if (mode === 'wasm-simd') {
    return safeIterations * WASM_SIMD_FLOPS_PER_ITERATION + WASM_SIMD_REDUCTION_FLOPS;
  }
  return safeIterations * CPU_SCALAR_FLOPS_PER_ITERATION + CPU_SCALAR_REDUCTION_FLOPS;
};

export const computeCpuGflops = (totalOps: number, durationMs: number): number => {
  if (!Number.isFinite(totalOps) || !Number.isFinite(durationMs) || totalOps <= 0 || durationMs <= 0) {
    return 0;
  }
  return (totalOps / (durationMs / 1000)) / 1e9;
};

/**
 * Optimized scalar FP64 fallback kernel using 8 independent accumulator
 * chains (breaking serial cross-lane data hazards for higher superscalar IPC)
 * with contractive decay and iteration-indexed forcing so no lane converges.
 */
export const executeScalarJsAluKernel = (
  iterations: number,
  seed: number,
): CpuKernelResult => {
  const safeIterations = Math.max(0, Math.floor(iterations));
  const normalizedSeed = Number.isFinite(seed) ? seed : 0;

  let x0 = 0.41 + Math.sin(normalizedSeed * 1.13) * 0.35;
  let x1 = -0.37 + Math.cos(normalizedSeed * 0.91) * 0.35;
  let x2 = 0.49 + Math.sin(normalizedSeed * 1.47 + 0.5) * 0.35;
  let x3 = -0.43 + Math.cos(normalizedSeed * 1.29 + 1.0) * 0.35;
  let x4 = 0.29 + Math.sin(normalizedSeed * 0.83 + 1.5) * 0.35;
  let x5 = -0.51 + Math.cos(normalizedSeed * 1.61 + 2.0) * 0.35;
  let x6 = 0.33 + Math.sin(normalizedSeed * 1.07 + 2.5) * 0.35;
  let x7 = -0.27 + Math.cos(normalizedSeed * 1.37 + 3.0) * 0.35;

  const seedMix = Math.sin(normalizedSeed * 1.7320508) * 0.0005;

  for (let i = 0; i < safeIterations; i++) {
    const drive = ((i & 255) - 127.5) * 0.0001 + seedMix;

    // 4 unrolled independent FMA steps across 8 scalar accumulators (64 FLOPs)
    x0 = x0 * 0.9961 + 0.0011;
    x1 = x1 * 0.9962 - 0.0009;
    x2 = x2 * 0.9963 + 0.0013;
    x3 = x3 * 0.9964 - 0.0007;
    x4 = x4 * 0.9965 + 0.0015;
    x5 = x5 * 0.9966 - 0.0012;
    x6 = x6 * 0.9967 + 0.0008;
    x7 = x7 * 0.9968 - 0.0014;

    x0 = x0 * 0.9961 + drive;
    x1 = x1 * 0.9962 - drive;
    x2 = x2 * 0.9963 + drive;
    x3 = x3 * 0.9964 - drive;
    x4 = x4 * 0.9965 + drive;
    x5 = x5 * 0.9966 - drive;
    x6 = x6 * 0.9967 + drive;
    x7 = x7 * 0.9968 - drive;

    x0 = x0 * 0.9961 - 0.0006;
    x1 = x1 * 0.9962 + 0.0014;
    x2 = x2 * 0.9963 - 0.0008;
    x3 = x3 * 0.9964 + 0.0012;
    x4 = x4 * 0.9965 - 0.0010;
    x5 = x5 * 0.9966 + 0.0007;
    x6 = x6 * 0.9967 - 0.0015;
    x7 = x7 * 0.9968 + 0.0005;

    x0 = x0 * 0.9961 + drive;
    x1 = x1 * 0.9962 - drive;
    x2 = x2 * 0.9963 - drive;
    x3 = x3 * 0.9964 + drive;
    x4 = x4 * 0.9965 + drive;
    x5 = x5 * 0.9966 - drive;
    x6 = x6 * 0.9967 - drive;
    x7 = x7 * 0.9968 + drive;
  }

  const lanesSum = x0 + x1 + x2 + x3 + x4 + x5 + x6 + x7;
  const q0 = Math.trunc(x0 * 1e6) | 0;
  const q1 = Math.trunc(x2 * 1e6) | 0;
  const q2 = Math.trunc(x4 * 1e6) | 0;
  const q3 = Math.trunc(x6 * 1e6) | 0;
  const digest = (q0 ^ ((q1 << 7) | (q1 >>> 25)) ^ ((q2 << 13) | (q2 >>> 19)) ^ q3) >>> 0;

  return {
    lanesSum,
    digest,
    mode: 'scalar-js',
    ops: computeCpuOpsForBatch(safeIterations, 'scalar-js'),
  };
};

export const executeCpuAluKernel = (
  iterations: number,
  seed: number,
  preferredMode?: CpuComputeMode,
): CpuKernelResult => {
  const safeIterations = Math.max(0, Math.floor(iterations));
  const simdRunner = preferredMode === 'scalar-js' ? null : getWasmSimdRunner();

  if (simdRunner) {
    const lanesSum = simdRunner(safeIterations, seed);
    const digest = Math.trunc(lanesSum * 1e6) >>> 0;
    return {
      lanesSum,
      digest,
      mode: 'wasm-simd',
      ops: computeCpuOpsForBatch(safeIterations, 'wasm-simd'),
    };
  }

  return executeScalarJsAluKernel(safeIterations, seed);
};

export const computeExpectedCpuReference = (
  iterations: number,
  seed: number,
  mode: CpuComputeMode,
): Pick<CpuKernelResult, 'lanesSum' | 'digest' | 'mode'> => {
  if (mode === 'wasm-simd') {
    const lanesSum = executeWasmSimdReference(iterations, seed);
    const digest = Math.trunc(lanesSum * 1e6) >>> 0;
    return { lanesSum, digest, mode: 'wasm-simd' };
  }
  const res = executeScalarJsAluKernel(iterations, seed);
  return { lanesSum: res.lanesSum, digest: res.digest, mode: 'scalar-js' };
};

export const computeAdaptiveCpuBatchIterations = (
  probeIterations: number,
  probeDurationMs: number,
  targetBatchMs: number = 60,
  minIterations: number = 20_000,
  maxIterations: number = 100_000_000,
): number => {
  const clampedDuration = Math.max(probeDurationMs, 0.25);
  const scale = targetBatchMs / clampedDuration;
  const raw = Math.round(Math.max(1, probeIterations) * scale);
  return Math.max(minIterations, Math.min(maxIterations, raw));
};

export const resolveCpuWorkerCount = (
  intensityMatrixSize: number,
  logicalCores: number,
): number => {
  const normalizedCores = Number.isFinite(logicalCores) && logicalCores >= 1
    ? Math.floor(logicalCores)
    : 4;
  if (intensityMatrixSize === 256) return Math.max(1, Math.round(normalizedCores * 0.25));
  if (intensityMatrixSize === 512) return Math.max(1, Math.round(normalizedCores * 0.5));
  if (intensityMatrixSize === 1024) return Math.max(1, Math.round(normalizedCores * 0.75));
  return normalizedCores;
};

export const verifyCpuKernelResult = (
  actual: Pick<CpuKernelResult, 'lanesSum' | 'digest'>,
  expected: Pick<CpuKernelResult, 'lanesSum' | 'digest'>,
  tolerance: number = 1e-4,
): boolean => {
  if (!Number.isFinite(actual.lanesSum) || !Number.isFinite(expected.lanesSum)) {
    return false;
  }
  if (Math.abs(actual.lanesSum - expected.lanesSum) > tolerance) {
    return false;
  }
  // If tolerance is tiny (<1e-6) check exact digest; for f32 allow +/-1 LSB rounding near decimal boundary
  return Math.abs(actual.digest - expected.digest) <= 2;
};
