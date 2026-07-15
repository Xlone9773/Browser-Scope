import { describe, it, expect } from 'vitest';
import { estimateCpuFromGpu } from '../utils/cpuMapping';

describe('estimateCpuFromGpu', () => {
  it('should return null for empty or invalid renderers', () => {
    expect(estimateCpuFromGpu('')).toBeNull();
    expect(estimateCpuFromGpu('Unknown')).toBeNull();
    expect(estimateCpuFromGpu('Unavailable')).toBeNull();
  });

  it('should detect virtualized or software renderers', () => {
    expect(estimateCpuFromGpu('llvmpipe (LLVM 12.0.0, 256 bits)')).toBe('Software Renderer (VM / Headless)');
    expect(estimateCpuFromGpu('Google SwiftShader')).toBe('Google SwiftShader (Software)');
    expect(estimateCpuFromGpu('VMware SVGA 3D')).toBe('VMware Virtual CPU');
    expect(estimateCpuFromGpu('Microsoft Basic Render Driver')).toBe('Software / Remote Desktop');
    expect(estimateCpuFromGpu('lavapipe')).toBe('Software Renderer (Vulkan)');
  });

  it('should detect Apple Silicon CPUs', () => {
    expect(estimateCpuFromGpu('Apple M4 Max')).toBe('Apple M4 Max');
    expect(estimateCpuFromGpu('Apple M4 Pro')).toBe('Apple M4 Pro');
    expect(estimateCpuFromGpu('Apple M3 Series')).toBe('Apple M3 Series');
    expect(estimateCpuFromGpu('Apple M1 Ultra')).toBe('Apple M1 Ultra');
    expect(estimateCpuFromGpu('Apple A18 GPU')).toBe('Apple A18 / A18 Pro');
    expect(estimateCpuFromGpu('Apple GPU')).toBe('Apple Silicon');
  });

  it('should detect Qualcomm Snapdragon CPUs', () => {
    expect(estimateCpuFromGpu('Adreno X1-85')).toBe('Snapdragon X Elite / Plus');
    expect(estimateCpuFromGpu('Adreno 830')).toBe('Snapdragon 8 Elite');
    expect(estimateCpuFromGpu('Adreno 750')).toBe('Snapdragon 8 Gen 3');
    expect(estimateCpuFromGpu('Adreno 660')).toBe('Snapdragon 888 / 888+');
    expect(estimateCpuFromGpu('Adreno 618')).toBe('Snapdragon 730 / 730G / 720G');
  });

  it('should detect Samsung Exynos Xclipse CPUs', () => {
    expect(estimateCpuFromGpu('Xclipse 940')).toBe('Exynos 2400 / 2400e');
    expect(estimateCpuFromGpu('Xclipse 530')).toBe('Exynos 1480');
  });

  it('should detect Google Tensor and Mediatek/Mali chips', () => {
    expect(estimateCpuFromGpu('Google Mali-G715')).toBe('Google Tensor G3 / G4');
    expect(estimateCpuFromGpu('Mali-G715')).toBe('Dimensity 9200 / 8300');
    expect(estimateCpuFromGpu('Immortalis-G925')).toBe('Dimensity 9400+ / Dimensity 9400');
    expect(estimateCpuFromGpu('Mali-G610')).toBe('Dimensity 8100 / 8200 / 1080 / 7050');
  });

  it('should detect Intel Integrated Graphics architectures', () => {
    expect(estimateCpuFromGpu('Intel Arc 140v Graphics')).toBe('Intel Core Ultra Series 2 (Lunar Lake)');
    expect(estimateCpuFromGpu('Intel Iris Xe Graphics')).toBe('Intel Core 11th/12th/13th Gen / Core Ultra Series 1');
    expect(estimateCpuFromGpu('Intel UHD Graphics 770')).toBe('Intel Core 12th/13th/14th Gen Desktop');
    expect(estimateCpuFromGpu('Intel HD Graphics 4000')).toBe('Intel Core 3rd Gen (Ivy Bridge)');
  });

  it('should detect AMD Integrated Graphics (RDNA/Vega)', () => {
    expect(estimateCpuFromGpu('AMD Radeon 890M')).toBe('AMD Ryzen AI 300 Series (Strix Point)');
    expect(estimateCpuFromGpu('AMD Radeon 780M')).toBe('AMD Ryzen 7040/8040 Series (Phoenix/Hawk Point)');
    expect(estimateCpuFromGpu('AMD Radeon Graphics')).toBe('AMD Ryzen APU');
  });

  it('should detect Discrete Workstation & Server GPUs', () => {
    expect(estimateCpuFromGpu('NVIDIA RTX 6000 Ada Generation')).toBe('Workstation (Xeon / Threadripper / EPYC)');
    expect(estimateCpuFromGpu('NVIDIA A100-SXM4-80GB')).toBe('Server (Xeon / EPYC)');
  });

  it('should detect Discrete Gaming GPUs and infer likely CPU generation', () => {
    expect(estimateCpuFromGpu('NVIDIA GeForce RTX 4090')).toBe('Intel 13th/14th Gen or Ryzen 7000/9000 (Likely)');
    expect(estimateCpuFromGpu('NVIDIA GeForce RTX 3080')).toBe('Intel 10th-12th Gen or Ryzen 5000 (Likely)');
    expect(estimateCpuFromGpu('AMD Radeon RX 7900 XTX')).toBe('AMD Ryzen 7000 or Intel 13th/14th Gen (Likely)');
  });

  it('should return null for completely unrecognized inputs', () => {
    expect(estimateCpuFromGpu('Some Random Graphic Card')).toBeNull();
  });
});
