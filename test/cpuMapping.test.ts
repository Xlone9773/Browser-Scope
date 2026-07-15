import { describe, it, expect } from 'vitest';
import { estimateCpuFromGpu } from '../utils/cpuMapping';

describe('estimateCpuFromGpu', () => {
  // --- Edge Cases and Special Inputs ---
  describe('Basic Edge Cases and Invalid Inputs', () => {
    it('should return null for empty, null, or undefined-like renderers', () => {
      expect(estimateCpuFromGpu('')).toBeNull();
      // @ts-expect-error testing runtime fallback
      expect(estimateCpuFromGpu(null)).toBeNull();
      // @ts-expect-error testing runtime fallback
      expect(estimateCpuFromGpu(undefined)).toBeNull();
      expect(estimateCpuFromGpu('Unknown')).toBeNull();
      expect(estimateCpuFromGpu('Unavailable')).toBeNull();
    });

    it('should handle case insensitivity correctly', () => {
      expect(estimateCpuFromGpu('ADRENO 840')).toBe('Snapdragon 8 Elite Gen 5');
      expect(estimateCpuFromGpu('apple m5 ultra')).toBe('Apple M5 Ultra');
      expect(estimateCpuFromGpu('INTEL iris® xe')).toBe('Intel Core 11th/12th/13th Gen / Core Ultra Series 1');
    });

    it('should return null for completely unrecognized inputs', () => {
      expect(estimateCpuFromGpu('Some Random Graphic Card')).toBeNull();
      expect(estimateCpuFromGpu('SuperGPU 9000')).toBeNull();
    });
  });

  // --- Virtualization / Software / Headless ---
  describe('Virtualization & Software Renderers', () => {
    it('should detect software renderers', () => {
      expect(estimateCpuFromGpu('llvmpipe (LLVM 12.0.0, 256 bits)')).toBe('Software Renderer (VM / Headless)');
      expect(estimateCpuFromGpu('softpipe')).toBe('Software Renderer (VM / Headless)');
      expect(estimateCpuFromGpu('Google SwiftShader')).toBe('Google SwiftShader (Software)');
      expect(estimateCpuFromGpu('lavapipe')).toBe('Software Renderer (Vulkan)');
      expect(estimateCpuFromGpu('Microsoft Basic Render Driver')).toBe('Software / Remote Desktop');
    });

    it('should detect virtualization GPUs', () => {
      expect(estimateCpuFromGpu('VMware SVGA 3D')).toBe('VMware Virtual CPU');
      expect(estimateCpuFromGpu('svga3d')).toBe('VMware Virtual CPU');
      expect(estimateCpuFromGpu('virgl')).toBe('VirtIO GPU (QEMU/KVM)');
      expect(estimateCpuFromGpu('virtio')).toBe('VirtIO GPU (QEMU/KVM)');
      expect(estimateCpuFromGpu('zink')).toBe('Zink (OpenGL over Vulkan)');
    });
  });

  // --- Apple Silicon (Mac & Mobile) ---
  describe('Apple Silicon M-Series and A-Series', () => {
    it('should detect Apple M5 series', () => {
      expect(estimateCpuFromGpu('Apple M5 Ultra')).toBe('Apple M5 Ultra');
      expect(estimateCpuFromGpu('Apple M5 Max')).toBe('Apple M5 Max');
      expect(estimateCpuFromGpu('Apple M5 Pro')).toBe('Apple M5 Pro');
      expect(estimateCpuFromGpu('Apple M5 Series')).toBe('Apple M5 Series');
    });

    it('should detect Apple M4 series', () => {
      expect(estimateCpuFromGpu('Apple M4 Ultra')).toBe('Apple M4 Ultra');
      expect(estimateCpuFromGpu('Apple M4 Max')).toBe('Apple M4 Max');
      expect(estimateCpuFromGpu('Apple M4 Pro')).toBe('Apple M4 Pro');
      expect(estimateCpuFromGpu('Apple M4')).toBe('Apple M4 Series');
    });

    it('should detect Apple M3 series', () => {
      expect(estimateCpuFromGpu('Apple M3 Ultra')).toBe('Apple M3 Ultra');
      expect(estimateCpuFromGpu('Apple M3 Max')).toBe('Apple M3 Max');
      expect(estimateCpuFromGpu('Apple M3 Pro')).toBe('Apple M3 Pro');
      expect(estimateCpuFromGpu('Apple M3')).toBe('Apple M3 Series');
    });

    it('should detect Apple M2 series', () => {
      expect(estimateCpuFromGpu('Apple M2 Ultra')).toBe('Apple M2 Ultra');
      expect(estimateCpuFromGpu('Apple M2 Max')).toBe('Apple M2 Max');
      expect(estimateCpuFromGpu('Apple M2 Pro')).toBe('Apple M2 Pro');
      expect(estimateCpuFromGpu('Apple M2')).toBe('Apple M2 Series');
    });

    it('should detect Apple M1 series', () => {
      expect(estimateCpuFromGpu('Apple M1 Ultra')).toBe('Apple M1 Ultra');
      expect(estimateCpuFromGpu('Apple M1 Max')).toBe('Apple M1 Max');
      expect(estimateCpuFromGpu('Apple M1 Pro')).toBe('Apple M1 Pro');
      expect(estimateCpuFromGpu('Apple M1')).toBe('Apple M1 Series');
    });

    it('should detect mobile A-series chips', () => {
      expect(estimateCpuFromGpu('Apple A18 Pro GPU')).toBe('Apple A18 Pro');
      expect(estimateCpuFromGpu('Apple A18 GPU')).toBe('Apple A18 / A18 Pro');
      expect(estimateCpuFromGpu('Apple A17')).toBe('Apple A17 Pro');
      expect(estimateCpuFromGpu('Apple A16')).toBe('Apple A16 Bionic');
      expect(estimateCpuFromGpu('Apple A15')).toBe('Apple A15 Bionic');
      expect(estimateCpuFromGpu('Apple A14')).toBe('Apple A14 Bionic');
      expect(estimateCpuFromGpu('Apple A13')).toBe('Apple A13 Bionic');
      expect(estimateCpuFromGpu('Apple A12Z Bionic')).toBe('Apple A12Z Bionic');
      expect(estimateCpuFromGpu('Apple A12X')).toBe('Apple A12X Bionic');
      expect(estimateCpuFromGpu('Apple A12')).toBe('Apple A12 Bionic');
      expect(estimateCpuFromGpu('Apple A11')).toBe('Apple A11 Bionic');
      expect(estimateCpuFromGpu('Apple A10')).toBe('Apple A10 Fusion');
      expect(estimateCpuFromGpu('Apple A9')).toBe('Apple A9 / A9X');
      expect(estimateCpuFromGpu('Apple A8')).toBe('Apple A8 / A8X');
      expect(estimateCpuFromGpu('Apple A7')).toBe('Apple A7');
    });

    it('should fall back to generic Apple Silicon', () => {
      expect(estimateCpuFromGpu('Apple GPU')).toBe('Apple Silicon');
    });
  });

  // --- Qualcomm Snapdragon (Adreno) ---
  describe('Qualcomm Snapdragon Chips', () => {
    it('should detect laptop X-series', () => {
      expect(estimateCpuFromGpu('Adreno X1-85')).toBe('Snapdragon X Elite / Plus (X1E-85-100 / X1E-84-100 / X1E-80-100 / X1E-78-100 / X1P-64-100)');
      expect(estimateCpuFromGpu('Adreno X1-45')).toBe('Snapdragon X Plus (X1P-45-100 / X1P-42-100 / X1P-46-100)');
      expect(estimateCpuFromGpu('Adreno X1')).toBe('Snapdragon X Elite / Plus Series');
      expect(estimateCpuFromGpu('Adreno 8cx')).toBe('Snapdragon 8cx Gen 3');
      expect(estimateCpuFromGpu('Adreno 690')).toBe('Snapdragon 8cx Gen 3');
      expect(estimateCpuFromGpu('Adreno 685')).toBe('Snapdragon 8cx Gen 2');
      expect(estimateCpuFromGpu('Adreno 680')).toBe('Snapdragon 8cx');
    });

    it('should detect high-end mobile chipsets', () => {
      expect(estimateCpuFromGpu('Adreno 850')).toBe('Snapdragon 8 Elite Gen 6 Pro');
      expect(estimateCpuFromGpu('Adreno 845')).toBe('Snapdragon 8 Elite Gen 6');
      expect(estimateCpuFromGpu('Adreno 840')).toBe('Snapdragon 8 Elite Gen 5');
      expect(estimateCpuFromGpu('Adreno 830')).toBe('Snapdragon 8 Elite');
      expect(estimateCpuFromGpu('Adreno 810')).toBe('Snapdragon 7s Gen 3');
      expect(estimateCpuFromGpu('Adreno 750')).toBe('Snapdragon 8 Gen 3');
      expect(estimateCpuFromGpu('Adreno 740')).toBe('Snapdragon 8 Gen 2');
      expect(estimateCpuFromGpu('Adreno 735')).toBe('Snapdragon 8s Gen 3');
      expect(estimateCpuFromGpu('Adreno 732')).toBe('Snapdragon 7+ Gen 3');
      expect(estimateCpuFromGpu('Adreno 730')).toBe('Snapdragon 8 Gen 1 / 8+ Gen 1');
    });

    it('should detect middle-high range mobile chipsets', () => {
      expect(estimateCpuFromGpu('Adreno 725')).toBe('Snapdragon 7+ Gen 2');
      expect(estimateCpuFromGpu('Adreno 720')).toBe('Snapdragon 7 Gen 3');
      expect(estimateCpuFromGpu('Adreno 710')).toBe('Snapdragon 7s Gen 2 / 6 Gen 1');
      expect(estimateCpuFromGpu('Adreno 702')).toBe('Snapdragon 695 / 4 Gen 1');
    });

    it('should detect older flagship chipsets', () => {
      expect(estimateCpuFromGpu('Adreno 660')).toBe('Snapdragon 888 / 888+');
      expect(estimateCpuFromGpu('Adreno 650')).toBe('Snapdragon 865 / 870');
      expect(estimateCpuFromGpu('Adreno 642L')).toBe('Snapdragon 778G / 780G');
      expect(estimateCpuFromGpu('Adreno 643')).toBe('Snapdragon 7s Gen 2 (Modified)');
      expect(estimateCpuFromGpu('Adreno 640')).toBe('Snapdragon 855 / 860');
      expect(estimateCpuFromGpu('Adreno 630')).toBe('Snapdragon 845');
    });

    it('should detect legacy and mid-tier chipsets', () => {
      expect(estimateCpuFromGpu('Adreno 644')).toBe('Snapdragon 7 Gen 1');
      expect(estimateCpuFromGpu('Adreno 642')).toBe('Snapdragon 780G');
      expect(estimateCpuFromGpu('Adreno 620')).toBe('Snapdragon 765G / 768G');
      expect(estimateCpuFromGpu('Adreno 619')).toBe('Snapdragon 750G / 695 / 480+');
      expect(estimateCpuFromGpu('Adreno 618')).toBe('Snapdragon 730 / 730G / 720G');
      expect(estimateCpuFromGpu('Adreno 616')).toBe('Snapdragon 710 / 712');
      expect(estimateCpuFromGpu('Adreno 612')).toBe('Snapdragon 675 / 678');
      expect(estimateCpuFromGpu('Adreno 610')).toBe('Snapdragon 665 / 680');
      expect(estimateCpuFromGpu('Adreno 540')).toBe('Snapdragon 835');
      expect(estimateCpuFromGpu('Adreno 530')).toBe('Snapdragon 820 / 821');
      expect(estimateCpuFromGpu('Adreno 512')).toBe('Snapdragon 660');
      expect(estimateCpuFromGpu('Adreno 509')).toBe('Snapdragon 636');
      expect(estimateCpuFromGpu('Adreno 506')).toBe('Snapdragon 625 / 450');
      expect(estimateCpuFromGpu('Adreno 505')).toBe('Snapdragon 430 / 435');
      expect(estimateCpuFromGpu('Adreno 504')).toBe('Snapdragon 429');
      expect(estimateCpuFromGpu('Adreno 430')).toBe('Snapdragon 810');
      expect(estimateCpuFromGpu('Adreno 420')).toBe('Snapdragon 805');
      expect(estimateCpuFromGpu('Adreno 418')).toBe('Snapdragon 808');
      expect(estimateCpuFromGpu('Adreno 405')).toBe('Snapdragon 615');
      expect(estimateCpuFromGpu('Adreno 330')).toBe('Snapdragon 800 / 801');
      expect(estimateCpuFromGpu('Adreno 320')).toBe('Snapdragon 600');
      expect(estimateCpuFromGpu('Adreno 308')).toBe('Snapdragon 425');
      expect(estimateCpuFromGpu('Adreno 306')).toBe('Snapdragon 410');
    });
  });

  // --- Samsung Exynos (Xclipse) ---
  describe('Samsung Exynos (Xclipse GPUs)', () => {
    it('should detect all Xclipse configurations', () => {
      expect(estimateCpuFromGpu('Xclipse 960')).toBe('Exynos 2600');
      expect(estimateCpuFromGpu('Xclipse 950')).toBe('Exynos 2500');
      expect(estimateCpuFromGpu('Xclipse 940')).toBe('Exynos 2400 / 2400e');
      expect(estimateCpuFromGpu('Xclipse 930')).toBe('Exynos 2300 (Prototype)');
      expect(estimateCpuFromGpu('Xclipse 920')).toBe('Exynos 2200');
      expect(estimateCpuFromGpu('Xclipse 540')).toBe('Exynos 1580');
      expect(estimateCpuFromGpu('Xclipse 530')).toBe('Exynos 1480');
    });
  });

  // --- ARM Mali / Immortalis ---
  describe('ARM Mali and Immortalis GPUs', () => {
    it('should detect Google Tensor SOCs', () => {
      expect(estimateCpuFromGpu('Google Mali-G715')).toBe('Google Tensor G3 / G4');
      expect(estimateCpuFromGpu('Google Mali-G710')).toBe('Google Tensor G2');
      expect(estimateCpuFromGpu('Google Mali-G78')).toBe('Google Tensor');
    });

    it('should detect high-end Immortalis / Dimensity', () => {
      expect(estimateCpuFromGpu('mali-g935-immortalis')).toBe('Dimensity 9500+ / Dimensity 9500');
      expect(estimateCpuFromGpu('immortalis-g935')).toBe('Dimensity 9500+ / Dimensity 9500');
      expect(estimateCpuFromGpu('mali-g935')).toBe('Dimensity 9500+ / Dimensity 9500 / 8500');
      expect(estimateCpuFromGpu('mali-g925-immortalis mc12')).toBe('Dimensity 9400+ / Dimensity 9400');
      expect(estimateCpuFromGpu('immortalis-g925')).toBe('Dimensity 9400+ / Dimensity 9400');
      expect(estimateCpuFromGpu('mali-g925')).toBe('Dimensity 9400+ / Dimensity 9400 / 8400');
      expect(estimateCpuFromGpu('immortalis-g720')).toBe('Dimensity 9300 / 9300+');
      expect(estimateCpuFromGpu('immortalis-g715')).toBe('Dimensity 9200 / 9200+');
    });

    it('should detect various Mali G-series models', () => {
      expect(estimateCpuFromGpu('mali-g725')).toBe('Dimensity 8400');
      expect(estimateCpuFromGpu('Mali-G715')).toBe('Dimensity 9200 / 8300');
      expect(estimateCpuFromGpu('mali-g710')).toBe('Dimensity 9000 / 9000+');
      expect(estimateCpuFromGpu('mali-g615')).toBe('Dimensity 8300 / 7300');
      expect(estimateCpuFromGpu('mali-g610')).toBe('Dimensity 8100 / 8200 / 1080 / 7050');
      expect(estimateCpuFromGpu('mali-g78')).toBe('Exynos 2100 / Kirin 9000');
      expect(estimateCpuFromGpu('mali-g77')).toBe('Dimensity 1000+ / Exynos 990');
      expect(estimateCpuFromGpu('mali-g76')).toBe('Kirin 980 / Kirin 990 / Exynos 9820 / Helio G90T');
      expect(estimateCpuFromGpu('mali-g72')).toBe('Exynos 9810 / Kirin 970 / Helio P60');
      expect(estimateCpuFromGpu('mali-g71')).toBe('Exynos 8895 / Kirin 960');
      expect(estimateCpuFromGpu('mali-g68')).toBe('Dimensity 900/920/1080 / Exynos 1380');
      expect(estimateCpuFromGpu('mali-g57')).toBe('Dimensity 700/800/810 / Helio G96');
      expect(estimateCpuFromGpu('mali-g52')).toBe('Helio G80/G85 / Kirin 710');
      expect(estimateCpuFromGpu('mali-g51')).toBe('Exynos 7884 / Kirin 710F');
      expect(estimateCpuFromGpu('mali-g31')).toBe('Helio G25/G35 / Exynos 850');
    });

    it('should detect legacy Mali T-series and older configurations', () => {
      expect(estimateCpuFromGpu('mali-t880')).toBe('Exynos 8890 / Helio X20');
      expect(estimateCpuFromGpu('mali-t860')).toBe('Helio P10 / Exynos 7870');
      expect(estimateCpuFromGpu('mali-t830')).toBe('Exynos 7880 / Kirin 650');
      expect(estimateCpuFromGpu('mali-t760')).toBe('Exynos 7420');
      expect(estimateCpuFromGpu('mali-t720')).toBe('MT6753 / Exynos 7580');
      expect(estimateCpuFromGpu('mali-450')).toBe('Legacy ARM Cortex-A7 SoC');
      expect(estimateCpuFromGpu('mali-400')).toBe('Legacy ARM Cortex-A9/A7 SoC');
    });
  });

  // --- PowerVR ---
  describe('PowerVR (Imagination Technologies) GPUs', () => {
    it('should detect PowerVR designs', () => {
      expect(estimateCpuFromGpu('powervr bxm')).toBe('MediaTek / Realtek SoC');
      expect(estimateCpuFromGpu('powervr gm9446')).toBe('Helio P90');
      expect(estimateCpuFromGpu('powervr ge8320')).toBe('Helio G22/G35 / A22');
      expect(estimateCpuFromGpu('powervr gt7600')).toBe('Apple A9');
      expect(estimateCpuFromGpu('powervr gx6450')).toBe('Apple A8');
      expect(estimateCpuFromGpu('powervr other')).toBe('MediaTek / Apple Legacy / Allwinner');
    });
  });

  // --- Intel Integrated Graphics ---
  describe('Intel Integrated Graphics', () => {
    it('should detect Lunar Lake architectures', () => {
      expect(estimateCpuFromGpu('Intel Arc 140v Graphics')).toBe('Intel Core Ultra 7/9 Series 2 (Lunar Lake)');
      expect(estimateCpuFromGpu('Intel Arc 130v Graphics')).toBe('Intel Core Ultra 5 Series 2 (Lunar Lake)');
    });

    it('should detect Arrow Lake and Meteor Lake configurations', () => {
      expect(estimateCpuFromGpu('Intel Graphics Arrow Lake')).toBe('Intel Core Ultra Series 2 Desktop (Arrow Lake)');
      expect(estimateCpuFromGpu('Intel Arc GPU (non-Lunar)')).toBe('Intel Core Ultra (Meteor Lake)');
      expect(estimateCpuFromGpu('Intel Arc Graphics')).toBe('Intel Core Ultra (Meteor Lake)');
    });

    it('should detect Iris Xe and Iris series designs', () => {
      expect(estimateCpuFromGpu('iris xe max')).toBe('Intel 11th Gen + Arc Discrete');
      expect(estimateCpuFromGpu('Intel Iris Xe Graphics')).toBe('Intel Core 11th/12th/13th Gen / Core Ultra Series 1');
      expect(estimateCpuFromGpu('iris plus')).toBe('Intel Core 10th Gen (Ice Lake) / 8th Gen (Coffee Lake)');
      expect(estimateCpuFromGpu('iris pro')).toBe('Intel Core 4th-8th Gen (High-end)');
      expect(estimateCpuFromGpu('iris graphics')).toBe('Intel Core 4th-8th Gen (High-end)');
    });

    it('should detect UHD series graphics', () => {
      expect(estimateCpuFromGpu('Intel UHD Graphics 770')).toBe('Intel Core 12th/13th/14th Gen Desktop');
      expect(estimateCpuFromGpu('Intel UHD Graphics 750')).toBe('Intel Core 11th Gen Desktop');
      expect(estimateCpuFromGpu('Intel UHD Graphics 730')).toBe('Intel Core 11th/12th Gen Desktop');
      expect(estimateCpuFromGpu('Intel UHD Graphics 630')).toBe('Intel Core 8th/9th/10th Gen');
      expect(estimateCpuFromGpu('Intel UHD Graphics 620')).toBe('Intel Core 8th Gen (Mobile)');
      expect(estimateCpuFromGpu('Intel UHD Graphics 605')).toBe('Intel Pentium/Celeron (Gemini Lake)');
      expect(estimateCpuFromGpu('Intel UHD Graphics')).toBe('Intel Core 8th-14th Gen');
    });

    it('should detect legacy HD series graphics', () => {
      expect(estimateCpuFromGpu('Intel HD Graphics 630')).toBe('Intel Core 7th Gen');
      expect(estimateCpuFromGpu('Intel HD Graphics 620')).toBe('Intel Core 7th Gen (Mobile)');
      expect(estimateCpuFromGpu('Intel HD Graphics 615')).toBe('Intel Core 7th Gen (Low power)');
      expect(estimateCpuFromGpu('Intel HD Graphics 530')).toBe('Intel Core 6th Gen');
      expect(estimateCpuFromGpu('Intel HD Graphics 520')).toBe('Intel Core 6th Gen (Mobile)');
      expect(estimateCpuFromGpu('Intel HD Graphics 505')).toBe('Intel Pentium/Celeron (Apollo Lake)');
      expect(estimateCpuFromGpu('Intel HD Graphics 6000')).toBe('Intel Core 5th Gen (Broadwell)');
      expect(estimateCpuFromGpu('Intel HD Graphics 5500')).toBe('Intel Core 5th Gen (Broadwell)');
      expect(estimateCpuFromGpu('Intel HD Graphics 5000')).toBe('Intel Core 4th Gen (Haswell)');
      expect(estimateCpuFromGpu('Intel HD Graphics 4000')).toBe('Intel Core 3rd Gen (Ivy Bridge)');
      expect(estimateCpuFromGpu('Intel HD Graphics 3000')).toBe('Intel Core 2nd Gen (Sandy Bridge)');
      expect(estimateCpuFromGpu('Intel HD Graphics 2000')).toBe('Intel Core 2nd Gen (Sandy Bridge)');
      expect(estimateCpuFromGpu('Intel HD Graphics')).toBe('Intel Core Gen 1-3');
    });

    it('should detect generic Intel family', () => {
      expect(estimateCpuFromGpu('intel standard family')).toBe('Intel Integrated Graphics');
    });
  });

  // --- AMD Integrated Graphics ---
  describe('AMD Integrated Graphics (RDNA & Vega)', () => {
    it('should detect high performance APUs (Strix Halo)', () => {
      expect(estimateCpuFromGpu('AMD Radeon 8060S')).toBe('AMD Ryzen AI Max+ 395 / Max 390 (Strix Halo - Radeon 8060S)');
      expect(estimateCpuFromGpu('AMD Radeon 8050S')).toBe('AMD Ryzen AI Max 385 (Strix Halo - Radeon 8050S)');
    });

    it('should detect Strix Point & Kraken Point configurations', () => {
      expect(estimateCpuFromGpu('AMD Radeon 890M')).toBe('AMD Ryzen AI 9 HX 370 (Strix Point - Radeon 890M)');
      expect(estimateCpuFromGpu('AMD Radeon 880M')).toBe('AMD Ryzen AI 9 365 (Strix Point - Radeon 880M)');
      expect(estimateCpuFromGpu('AMD Radeon 870M')).toBe('AMD Ryzen AI PRO 300 Series (Kraken Point - Radeon 870M)');
      expect(estimateCpuFromGpu('Radeon 890M (No prefix)')).toBe('AMD Ryzen AI 9 HX 370 (Strix Point - Radeon 890M)');
    });

    it('should detect RDNA 3, RDNA 2, and Vega architectures', () => {
      expect(estimateCpuFromGpu('AMD Radeon 780M')).toBe('AMD Ryzen 7040/8040 Series (Phoenix/Hawk Point)');
      expect(estimateCpuFromGpu('AMD Radeon 760M')).toBe('AMD Ryzen 7040/8040 Series');
      expect(estimateCpuFromGpu('AMD Radeon 740M')).toBe('AMD Ryzen 7040 Series');
      expect(estimateCpuFromGpu('AMD Radeon 680M')).toBe('AMD Ryzen 6000 Series (Rembrandt)');
      expect(estimateCpuFromGpu('AMD Radeon 660M')).toBe('AMD Ryzen 6000 Series');
      expect(estimateCpuFromGpu('AMD Radeon 610M')).toBe('AMD Ryzen 7020 Series / Athlon');
      expect(estimateCpuFromGpu('AMD Radeon Vega 11')).toBe('AMD Ryzen 5 2400G / 3400G');
      expect(estimateCpuFromGpu('AMD Radeon Vega 10')).toBe('AMD Ryzen 7 2700U / 3700U / 3750H');
      expect(estimateCpuFromGpu('AMD Radeon Vega 8')).toBe('AMD Ryzen 3 2200G / 3200G / Ryzen 5 / 7 Mobile');
      expect(estimateCpuFromGpu('AMD Radeon Vega 6')).toBe('AMD Ryzen 3 Mobile');
      expect(estimateCpuFromGpu('AMD Radeon Vega 3')).toBe('AMD Athlon / Ryzen 3 Mobile');
      expect(estimateCpuFromGpu('AMD Radeon Graphics')).toBe('AMD Ryzen APU');
    });
  });

  // --- Workstation & Server GPUs ---
  describe('Workstation and Server GPUs', () => {
    it('should detect enterprise workstation cards', () => {
      expect(estimateCpuFromGpu('NVIDIA RTX 6000 Ada Generation')).toBe('Workstation (Xeon / Threadripper / EPYC)');
      expect(estimateCpuFromGpu('NVIDIA Quadro P4000')).toBe('Workstation (Xeon / Threadripper)');
      expect(estimateCpuFromGpu('NVIDIA RTX A5000')).toBe('Workstation (Xeon / Threadripper)');
    });

    it('should detect server compute accelerators', () => {
      expect(estimateCpuFromGpu('NVIDIA A100-SXM4-80GB')).toBe('Server (Xeon / EPYC)');
      expect(estimateCpuFromGpu('NVIDIA Tesla T4')).toBe('Server (Xeon / EPYC)');
      expect(estimateCpuFromGpu('Intel Instinct MI300')).toBe('Workstation/Server (Xeon / Threadripper / EPYC)');
      expect(estimateCpuFromGpu('AMD FirePro W8100')).toBe('Workstation/Server (Xeon / Threadripper / EPYC)');
    });
  });

  // --- Discrete Desktop/Laptop Gaming GPUs ---
  describe('Discrete Desktop and Laptop Gaming GPUs', () => {
    it('should detect latest NVIDIA RTX 50-series Blackwell architecture', () => {
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 5090')).toBe('Intel Core Ultra 200 or Ryzen 7 9800X3D / Ryzen 9000 Series with RTX 5090 (Blackwell)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 5080')).toBe('Intel Core Ultra 200 or Ryzen 7 9800X3D / Ryzen 9000 Series with RTX 5080 (Blackwell)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 5070')).toBe('Intel Core Ultra 200 or Ryzen 7 9800X3D / Ryzen 9000 Series with RTX 5070 (Blackwell)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 5060')).toBe('Intel Core Ultra 200 / 14th Gen or Ryzen 7 9800X3D / Ryzen 9000 Series (Likely)');
    });

    it('should detect NVIDIA RTX 40/30/20 series and legacy cards', () => {
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 4090')).toBe('Intel 13th/14th Gen or Ryzen 7 9800X3D / Ryzen 7000 / 9000 (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 4070')).toBe('Intel 13th/14th Gen or Ryzen 7000 / 9000 (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 3080')).toBe('Intel 10th-12th Gen or Ryzen 5000 / 5000X3D (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce RTX 2080')).toBe('Intel 9th/10th Gen or Ryzen 3000/4000 (Likely)');
      expect(estimateCpuFromGpu('NVIDIA Titan RTX')).toBe('HEDT / Workstation System');
      expect(estimateCpuFromGpu('NVIDIA GeForce GTX 1080')).toBe('Intel 6th-8th Gen or Ryzen 1000/2000 (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce GTX 980')).toBe('Intel 4th-6th Gen or Ryzen 1000 (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce GTX 860M')).toBe('Intel 4th-5th Gen Mobile (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce GTX 770')).toBe('Intel 3rd-4th Gen or AMD FX (Likely)');
      expect(estimateCpuFromGpu('NVIDIA GeForce GTX 680')).toBe('Intel 2nd-3rd Gen (Likely)');
    });

    it('should detect AMD Discrete GPUs', () => {
      expect(estimateCpuFromGpu('AMD Radeon RX 8800 XT')).toBe('AMD Ryzen 7 9800X3D / Ryzen 9000 or Intel Core Ultra 200 (Likely)');
      expect(estimateCpuFromGpu('AMD Radeon RX 7900 XTX')).toBe('AMD Ryzen 7000 or Intel 13th/14th Gen (Likely)');
      expect(estimateCpuFromGpu('AMD Radeon RX 6800 XT')).toBe('AMD Ryzen 5000 or Intel 11th/12th Gen (Likely)');
      expect(estimateCpuFromGpu('AMD Radeon RX 5700 XT')).toBe('AMD Ryzen 3000 or Intel 9th/10th Gen (Likely)');
      expect(estimateCpuFromGpu('AMD Radeon RX 580')).toBe('AMD Ryzen 1000/2000 or Intel 7th-9th Gen (Likely)');
      expect(estimateCpuFromGpu('AMD Radeon R9 290X')).toBe('AMD FX or Intel 4th-6th Gen (Likely)');
    });

    it('should detect Intel Arc Discrete GPUs', () => {
      expect(estimateCpuFromGpu('Intel Arc A770')).toBe('Intel 12th/13th Gen or Ryzen 5000/7000 (Likely)');
      expect(estimateCpuFromGpu('Intel Arc B580')).toBe('Intel Core Ultra or Ryzen 9000 (Likely)');
    });

    it('should fall back correctly on generic discrete cards', () => {
      expect(estimateCpuFromGpu('NVIDIA GeForce Card')).toBe('Discrete NVIDIA GPU System');
      expect(estimateCpuFromGpu('AMD Radeon GPU')).toBe('Discrete AMD GPU System');
      expect(estimateCpuFromGpu('Intel Arc Pro External')).toBe('Discrete Intel GPU System');
    });
  });
});

