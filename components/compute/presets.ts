import { Translation } from '../../utils/i18n/types';
import type { MemoryMode, WorkloadType } from './flops';

export type PresetId = 'standard' | 'peak' | 'fp16' | 'thermal';

export interface PresetSettings {
  workloadType: WorkloadType;
  memoryMode: MemoryMode;
  precision: 'fp32' | 'fp16';
  matrixSize: number;
  duration: number;
}

export const resolvePreset = (preset: PresetId, hasFp16Support: boolean): PresetSettings => {
  switch (preset) {
    case 'standard':
      return { workloadType: 'gemm', memoryMode: 'hybrid', precision: 'fp32', matrixSize: 512, duration: 30 };
    case 'peak':
      return { workloadType: 'alu_simd', memoryMode: 'cache', precision: hasFp16Support ? 'fp16' : 'fp32', matrixSize: 512, duration: 10 };
    case 'fp16':
      return { workloadType: 'gemm', memoryMode: 'hybrid', precision: hasFp16Support ? 'fp16' : 'fp32', matrixSize: 1024, duration: 30 };
    case 'thermal':
      return { workloadType: 'gemm', memoryMode: 'hybrid', precision: 'fp32', matrixSize: 1024, duration: 60 };
  }
};

export interface PresetDescription {
  title: string;
  desc: string;
  bullets: string[];
}

export const describePreset = (preset: PresetId, t: Translation['computeStress']): PresetDescription => {
  switch (preset) {
    case 'standard':
      return {
        title: t.preset_standard || 'Standard Run (Matrix)',
        desc: t.preset_standard_desc || 'Balanced memory and computation load, reflecting standard 3D/AI workloads.',
        bullets: [
          t.preset_standard_bullet1 || 'Workload: 512x512 GEMM matrix multiplication',
          t.preset_standard_bullet2 || 'Precision: FP32 Single-precision standard',
          t.preset_standard_bullet3 || 'Data Access: Hybrid Global Buffer lookup patterns',
          t.preset_standard_bullet4 || 'Target: Measures standard graphics/compute capability',
        ],
      };
    case 'peak':
      return {
        title: t.preset_peak || 'Peak ALU Compute (SIMD)',
        desc: t.preset_peak_desc || 'Stresses ALU arithmetic units to their limits, eliminating global memory bottlenecks.',
        bullets: [
          t.preset_peak_bullet1 || 'Workload: High-intensity fused vector FMA points',
          t.preset_peak_bullet2 || 'Precision: FP16 (Half precision) optimized or fallback FP32',
          t.preset_peak_bullet3 || 'Data Access: High-speed local hardware registers',
          t.preset_peak_bullet4 || 'Target: Tests theoretical peak floating-point math power',
        ],
      };
    case 'fp16':
      return {
        title: t.preset_fp16 || 'FP16 Extreme (Tensor Core)',
        desc: t.preset_fp16_desc || 'Runs FP16 matrix operations on modern neural hardware accelerators.',
        bullets: [
          t.preset_fp16_bullet1 || 'Workload: 1024x1024 dense GEMM matrix computation',
          t.preset_fp16_bullet2 || 'Precision: Native FP16 (requires hardware support)',
          t.preset_fp16_bullet3 || 'Data Access: High-speed half-precision pipelines',
          t.preset_fp16_bullet4 || 'Target: Stresses AI cores / Neural accelerator hardware',
        ],
      };
    case 'thermal':
      return {
        title: t.preset_thermal || 'Thermal Throttle Burn',
        desc: t.preset_thermal_desc || 'Generates continuous thermal load over 60s to inspect performance dropoff curves.',
        bullets: [
          t.preset_thermal_bullet1 || 'Workload: 1024x1024 dense GEMM cycles',
          t.preset_thermal_bullet2 || 'Precision: FP32 Single-precision heavy load',
          t.preset_thermal_bullet3 || 'Duration: 60 seconds sustained stress',
          t.preset_thermal_bullet4 || 'Target: Charts heat dissipation and thermal throttling',
        ],
      };
  }
};
