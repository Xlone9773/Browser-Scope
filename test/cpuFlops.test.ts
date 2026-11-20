import { describe, it, expect } from 'vitest';
import {
  CPU_SCALAR_FLOPS_PER_ITERATION,
  CPU_SCALAR_REDUCTION_FLOPS,
  computeAdaptiveCpuBatchIterations,
  computeCpuGflops,
  computeCpuOpsForBatch,
  computeExpectedCpuReference,
  executeCpuAluKernel,
  executeScalarJsAluKernel,
  resolveCpuWorkerCount,
  verifyCpuKernelResult,
} from '../components/compute/cpu/cpuFlops';
import {
  WASM_SIMD_FLOPS_PER_ITERATION,
  WASM_SIMD_REDUCTION_FLOPS,
  getWasmSimdRunner,
} from '../components/compute/cpu/wasmSimdKernel';
import {
  measureAdaptivePasses,
  murmurhash3_32_gc,
  runWorkerBenchmarkTask,
} from '../components/compute/cpu/benchmarkKernels';

describe('CPU Compute Kernel & Benchmark Helpers', () => {
  it('computes exact FLOPs per batch for both Wasm SIMD v128 and Scalar FP64 kernels', () => {
    expect(WASM_SIMD_FLOPS_PER_ITERATION).toBe(264);
    expect(WASM_SIMD_REDUCTION_FLOPS).toBe(31);
    expect(CPU_SCALAR_FLOPS_PER_ITERATION).toBe(67);
    expect(CPU_SCALAR_REDUCTION_FLOPS).toBe(7);

    expect(computeCpuOpsForBatch(0, 'wasm-simd')).toBe(0);
    expect(computeCpuOpsForBatch(0, 'scalar-js')).toBe(0);
    expect(computeCpuOpsForBatch(1000, 'wasm-simd')).toBe(1000 * 264 + 31);
    expect(computeCpuOpsForBatch(1000, 'scalar-js')).toBe(1000 * 67 + 7);
    expect(computeCpuGflops(1e9, 1000)).toBeCloseTo(1.0, 5);
    expect(computeCpuGflops(1e9, 0)).toBe(0);
  });

  it('prevents fixed-point convergence and verifies Wasm SIMD against IEEE-754 f32 reference', () => {
    const runner = getWasmSimdRunner();
    expect(runner).not.toBeNull();

    const resA = executeCpuAluKernel(512, 1.25, 'wasm-simd');
    const resB = executeCpuAluKernel(513, 1.25, 'wasm-simd');
    const resC = executeCpuAluKernel(512, 2.5, 'wasm-simd');
    const expectedA = computeExpectedCpuReference(512, 1.25, 'wasm-simd');

    expect(resA.mode).toBe('wasm-simd');
    expect(Number.isFinite(resA.lanesSum)).toBe(true);
    expect(Math.abs(resA.lanesSum)).toBeLessThan(64);

    // Bytecode Wasm SIMD v128 output must match pure TS Math.fround reference
    expect(verifyCpuKernelResult(resA, expectedA)).toBe(true);

    // Iteration count and seed must measurably affect output (prevents DCE / fixed point)
    expect(resA.lanesSum).not.toBe(resB.lanesSum);
    expect(resA.digest).not.toBe(resB.digest);
    expect(resA.lanesSum).not.toBe(resC.lanesSum);
    expect(resA.digest).not.toBe(resC.digest);
  });

  it('prevents fixed-point convergence in 8-chain scalar JS fallback and catches corruption', () => {
    const resA = executeScalarJsAluKernel(2048, 1.25);
    const resB = executeScalarJsAluKernel(2049, 1.25);
    const resC = executeScalarJsAluKernel(2048, 2.5);
    const resLong = executeScalarJsAluKernel(25_000, 1.25);

    expect(resA.mode).toBe('scalar-js');
    expect(Number.isFinite(resA.lanesSum)).toBe(true);
    expect(Math.abs(resA.lanesSum)).toBeLessThan(32);
    expect(Number.isFinite(resLong.lanesSum)).toBe(true);
    expect(Math.abs(resLong.lanesSum)).toBeLessThan(32);

    expect(resA.lanesSum).not.toBe(resB.lanesSum);
    expect(resA.digest).not.toBe(resB.digest);
    expect(resA.lanesSum).not.toBe(resC.lanesSum);
    expect(resA.digest).not.toBe(resC.digest);

    const expectedA = computeExpectedCpuReference(2048, 1.25, 'scalar-js');
    expect(verifyCpuKernelResult(resA, expectedA)).toBe(true);
    expect(verifyCpuKernelResult({ lanesSum: NaN, digest: resA.digest }, expectedA)).toBe(false);
    expect(verifyCpuKernelResult({ lanesSum: resA.lanesSum, digest: resA.digest + 10 }, expectedA)).toBe(false);
  });

  it('scales adaptive batch iterations around ~60ms target and clamps bounds', () => {
    // Probe of 100k took 20ms -> 3x scale = 300k iterations
    expect(computeAdaptiveCpuBatchIterations(100_000, 20, 60)).toBe(300_000);
    // Very slow core (2500ms probe) clamps safely at minIterations (20k)
    expect(computeAdaptiveCpuBatchIterations(50_000, 2500, 60)).toBe(20_000);
    // Zero duration falls back safely without NaN/Infinity and respects upper bound (100M)
    expect(computeAdaptiveCpuBatchIterations(1_000_000, 0, 60)).toBe(100_000_000);
  });

  it('resolves CPU worker count proportionally to matrixSize intensity', () => {
    expect(resolveCpuWorkerCount(256, 8)).toBe(2);
    expect(resolveCpuWorkerCount(512, 8)).toBe(4);
    expect(resolveCpuWorkerCount(1024, 8)).toBe(6);
    expect(resolveCpuWorkerCount(2048, 8)).toBe(8);
    expect(resolveCpuWorkerCount(256, 1)).toBe(1);
    expect(resolveCpuWorkerCount(512, NaN)).toBe(2);
  });

  it('expands short benchmark passes until minimum measurement window is met', () => {
    let fakeClock = 0;
    const result = measureAdaptivePasses(
      (pass) => {
        fakeClock += 12; // 12ms per pass -> needs 5 passes to reach >= 60ms
        return (pass + 1) * 97;
      },
      60,
      32,
      () => fakeClock,
    );

    expect(result.passes).toBe(5);
    expect(result.totalElapsedMs).toBe(60);
    expect(result.avgDurationMs).toBeCloseTo(12, 5);
    expect(result.checksum).toBeGreaterThan(0);
  });

  it('executes worker benchmark kernels deterministically with genuine checksums', () => {
    let fakeNow = 0;
    const tickClock = () => {
      fakeNow += 15;
      return fakeNow;
    };

    const cpuRes = runWorkerBenchmarkTask('cpu', { primeMax: 5000, multiplier: 12000000 }, tickClock);
    expect(cpuRes.score).toBeGreaterThan(0);
    expect(cpuRes.passes).toBeGreaterThanOrEqual(4);
    expect(cpuRes.details).toContain('M candidates/s');

    fakeNow = 0;
    const mathRes = runWorkerBenchmarkTask('math', { ops: 20000, multiplier: 15000000 }, tickClock);
    expect(mathRes.score).toBeGreaterThan(0);
    expect(mathRes.details).toContain('M ops/s');

    fakeNow = 0;
    const convRes = runWorkerBenchmarkTask('convolution', { matrixSize: 32, passes: 2, multiplier: 15000000 }, tickClock);
    expect(convRes.score).toBeGreaterThan(0);
    expect(convRes.details).toContain('GFLOPS');

    expect(murmurhash3_32_gc('browser-scope', 31)).not.toBe(murmurhash3_32_gc('browser-scope', 32));
  });
});
