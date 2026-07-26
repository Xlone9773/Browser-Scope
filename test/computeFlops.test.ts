import { describe, it, expect } from 'vitest';
import { flopsPerInvocation, pipelineCacheKey, ALU_FLOPS_PER_INVOCATION } from '../components/compute/flops';

describe('flopsPerInvocation', () => {
  it('is 2*N for GEMM, matching the standard multiply-add FLOP count', () => {
    expect(flopsPerInvocation('gemm', 512)).toBe(1024);
    expect(flopsPerInvocation('gemm', 1)).toBe(2);
  });

  it('is a fixed, matrix-size-independent constant for ALU SIMD', () => {
    expect(flopsPerInvocation('alu_simd', 256)).toBe(ALU_FLOPS_PER_INVOCATION);
    expect(flopsPerInvocation('alu_simd', 2048)).toBe(ALU_FLOPS_PER_INVOCATION);
  });
});

describe('pipelineCacheKey', () => {
  it('distinguishes every combination of workload, memory mode, and precision', () => {
    const keys = new Set([
      pipelineCacheKey('gemm', 'hybrid', false),
      pipelineCacheKey('gemm', 'hybrid', true),
      pipelineCacheKey('gemm', 'cache', false),
      pipelineCacheKey('gemm', 'cache', true),
      pipelineCacheKey('alu_simd', 'hybrid', false),
      pipelineCacheKey('alu_simd', 'cache', true),
    ]);
    expect(keys.size).toBe(6);
  });

  it('is stable for the same inputs', () => {
    expect(pipelineCacheKey('gemm', 'cache', true)).toBe(pipelineCacheKey('gemm', 'cache', true));
  });
});
