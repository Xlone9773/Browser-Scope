import { describe, it, expect } from 'vitest';
import { resolvePreset } from '../components/compute/presets';

describe('resolvePreset', () => {
  it('standard: balanced FP32 GEMM regardless of FP16 support', () => {
    expect(resolvePreset('standard', true)).toEqual({
      workloadType: 'gemm', memoryMode: 'hybrid', precision: 'fp32', matrixSize: 512, duration: 30,
    });
    expect(resolvePreset('standard', false)).toEqual({
      workloadType: 'gemm', memoryMode: 'hybrid', precision: 'fp32', matrixSize: 512, duration: 30,
    });
  });

  it('peak: ALU SIMD in cache mode, using FP16 only when supported', () => {
    expect(resolvePreset('peak', true).precision).toBe('fp16');
    expect(resolvePreset('peak', false).precision).toBe('fp32');
    expect(resolvePreset('peak', true).workloadType).toBe('alu_simd');
    expect(resolvePreset('peak', true).memoryMode).toBe('cache');
  });

  it('fp16: dense GEMM, using FP16 only when supported', () => {
    expect(resolvePreset('fp16', true).precision).toBe('fp16');
    expect(resolvePreset('fp16', false).precision).toBe('fp32');
    expect(resolvePreset('fp16', true).matrixSize).toBe(1024);
  });

  it('thermal: sustained FP32 GEMM regardless of FP16 support', () => {
    expect(resolvePreset('thermal', true).precision).toBe('fp32');
    expect(resolvePreset('thermal', true).duration).toBe(60);
  });
});
