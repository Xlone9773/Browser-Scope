import { describe, it, expect } from 'vitest';
import {
  WEBGL_ALU_ITERATIONS,
  WEBGL_FLOPS_PER_INVOCATION,
  computeAdaptiveBatchSize,
  computeExpectedWebGlPixel,
  computeWebGlGflops,
  computeWebGlOpsPerDraw,
  resolveEffectiveGridSize,
} from '../components/compute/webgl/webglFlops';

describe('WebGL FLOPs & Grid Accounting', () => {
  it('matches exact countable ALU FLOPs per fragment invocation', () => {
    expect(WEBGL_FLOPS_PER_INVOCATION).toBe(WEBGL_ALU_ITERATIONS * 32 + 7);
  });

  it('scales opsPerDraw quadratically with actual grid dimensions (fixing 600x256 hardcoding)', () => {
    const ops256 = computeWebGlOpsPerDraw(256, 256);
    const ops512 = computeWebGlOpsPerDraw(512, 512);
    const ops1024 = computeWebGlOpsPerDraw(1024, 1024);

    expect(ops256).toBe(256 * 256 * WEBGL_FLOPS_PER_INVOCATION);
    expect(ops512).toBe(ops256 * 4);
    expect(ops1024).toBe(ops256 * 16);
    expect(computeWebGlOpsPerDraw(0, 512)).toBe(0);
    expect(computeWebGlOpsPerDraw(-10, 512)).toBe(0);
  });

  it('computes GFLOPS accurately and guards against zero/NaN/Infinity durations', () => {
    const opsPerDraw = 1_000_000_000; // 1 GFLOP per draw
    expect(computeWebGlGflops(opsPerDraw, 10, 1000)).toBeCloseTo(10, 5);
    expect(computeWebGlGflops(opsPerDraw, 5, 250)).toBeCloseTo(20, 5);

    expect(computeWebGlGflops(opsPerDraw, 1, 0)).toBe(0);
    expect(computeWebGlGflops(opsPerDraw, 1, -5)).toBe(0);
    expect(computeWebGlGflops(opsPerDraw, 1, Number.NaN)).toBe(0);
    expect(computeWebGlGflops(opsPerDraw, 1, Number.POSITIVE_INFINITY)).toBe(0);
    expect(computeWebGlGflops(0, 10, 50)).toBe(0);
    expect(computeWebGlGflops(opsPerDraw, 0, 50)).toBe(0);
  });

  it('adapts batch size cleanly to decouple from rAF/VSync while clamping bounds', () => {
    // Fast GPU: 0.25ms per draw -> ~200 draws for 50ms target batch
    expect(computeAdaptiveBatchSize(0.25, 50, 500)).toBe(200);
    // Ultra-fast GPU: clamped to maxBatchSize
    expect(computeAdaptiveBatchSize(0.01, 50, 500)).toBe(500);
    // Slow GPU / SwiftShader: 120ms per draw -> at least 1 draw
    expect(computeAdaptiveBatchSize(120, 50, 500)).toBe(1);
    // NaN safety
    expect(computeAdaptiveBatchSize(Number.NaN, 50, 500)).toBe(5);
  });

  it('clamps compute grid size to hardware MAX_TEXTURE_SIZE and MAX_VIEWPORT_DIMS', () => {
    expect(resolveEffectiveGridSize(2048, 4096, 4096)).toBe(2048);
    expect(resolveEffectiveGridSize(2048, 1024, 4096)).toBe(1024);
    expect(resolveEffectiveGridSize(2048, 4096, 1536)).toBe(1536);
    expect(resolveEffectiveGridSize(4, 4096, 4096)).toBe(16);
  });

  it('computes deterministic non-zero RGBA pixel values for ALU verification', () => {
    const p1 = computeExpectedWebGlPixel(0.25, 0.25, 0);
    const p2 = computeExpectedWebGlPixel(0.75, 0.75, 0);
    const p1Seeded = computeExpectedWebGlPixel(0.25, 0.25, 0.015);

    expect(p1[3]).toBe(255);
    expect(p2[3]).toBe(255);
    expect(p1[0]).toBeGreaterThanOrEqual(31);
    expect(p1[0]).toBeLessThanOrEqual(224);
    expect(p1).toEqual(computeExpectedWebGlPixel(0.25, 0.25, 0));
    expect(p1).not.toEqual(p2);
    expect(p1).not.toEqual(p1Seeded);
  });
});
