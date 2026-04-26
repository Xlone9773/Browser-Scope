
export const estimateCpuFromGpu = (renderer: string): string | null => {
  if (!renderer || renderer === 'Unknown' || renderer === 'Unavailable') return null;

  const r = renderer.toLowerCase();

  // --- Virtualization / Software / Headless ---
  if (r.includes('llvmpipe') || r.includes('softpipe')) return 'Software Renderer (VM / Headless)';
  if (r.includes('swiftshader')) return 'Google SwiftShader (Software)';
  if (r.includes('vmware') || r.includes('svga3d')) return 'VMware Virtual CPU';
  if (r.includes('virgl') || r.includes('virtio')) return 'VirtIO GPU (QEMU/KVM)';
  if (r.includes('microsoft basic render driver')) return 'Software / Remote Desktop';
  if (r.includes('lavapipe')) return 'Software Renderer (Vulkan)';
  if (r.includes('zink')) return 'Zink (OpenGL over Vulkan)';

  // --- Apple Silicon (Mac) ---
  if (r.includes('apple m4 max')) return 'Apple M4 Max';
  if (r.includes('apple m4 pro')) return 'Apple M4 Pro';
  if (r.includes('apple m4')) return 'Apple M4 Series';
  if (r.includes('apple m3 max')) return 'Apple M3 Max';
  if (r.includes('apple m3 pro')) return 'Apple M3 Pro';
  if (r.includes('apple m3')) return 'Apple M3 Series';
  if (r.includes('apple m2 ultra')) return 'Apple M2 Ultra';
  if (r.includes('apple m2 max')) return 'Apple M2 Max';
  if (r.includes('apple m2 pro')) return 'Apple M2 Pro';
  if (r.includes('apple m2')) return 'Apple M2 Series';
  if (r.includes('apple m1 ultra')) return 'Apple M1 Ultra';
  if (r.includes('apple m1 max')) return 'Apple M1 Max';
  if (r.includes('apple m1 pro')) return 'Apple M1 Pro';
  if (r.includes('apple m1')) return 'Apple M1 Series';
  
  // A-Series (Mobile)
  if (r.includes('apple a18')) return 'Apple A18 / A18 Pro';
  if (r.includes('apple a17')) return 'Apple A17 Pro';
  if (r.includes('apple a16')) return 'Apple A16 Bionic';
  if (r.includes('apple a15')) return 'Apple A15 Bionic';
  if (r.includes('apple a14')) return 'Apple A14 Bionic';
  if (r.includes('apple a13')) return 'Apple A13 Bionic';
  if (r.includes('apple a12z')) return 'Apple A12Z Bionic';
  if (r.includes('apple a12x')) return 'Apple A12X Bionic';
  if (r.includes('apple a12')) return 'Apple A12 Bionic';
  if (r.includes('apple a11')) return 'Apple A11 Bionic';
  if (r.includes('apple a10')) return 'Apple A10 Fusion';
  if (r.includes('apple a9')) return 'Apple A9 / A9X';
  if (r.includes('apple a8')) return 'Apple A8 / A8X';
  if (r.includes('apple a7')) return 'Apple A7';
  
  // Apple GPU generic fallback
  if (r.includes('apple gpu')) return 'Apple Silicon';

  // --- Qualcomm Snapdragon (Adreno) ---
  // PC / Laptop / Tablet
  if (r.includes('adreno x1')) return 'Snapdragon X Elite / Plus';
  if (r.includes('adreno 8cx')) return 'Snapdragon 8cx Gen 3';
  if (r.includes('adreno 690')) return 'Snapdragon 8cx Gen 3'; 
  if (r.includes('adreno 685')) return 'Snapdragon 8cx Gen 2';
  if (r.includes('adreno 680')) return 'Snapdragon 8cx';
  
  // Mobile High-end
  if (r.includes('adreno 830')) return 'Snapdragon 8 Elite';
  if (r.includes('adreno 750')) return 'Snapdragon 8 Gen 3';
  if (r.includes('adreno 740')) return 'Snapdragon 8 Gen 2';
  if (r.includes('adreno 735')) return 'Snapdragon 7+ Gen 3';
  if (r.includes('adreno 732')) return 'Snapdragon 7s Gen 3';
  if (r.includes('adreno 730')) return 'Snapdragon 8 Gen 1 / 8+ Gen 1';
  
  // Mobile High/Mid
  if (r.includes('adreno 725')) return 'Snapdragon 7+ Gen 2';
  if (r.includes('adreno 720')) return 'Snapdragon 7 Gen 3';
  if (r.includes('adreno 710')) return 'Snapdragon 7s Gen 2 / 6 Gen 1';
  if (r.includes('adreno 702')) return 'Snapdragon 695 / 4 Gen 1';
  
  // Mobile Legacy High-end
  if (r.includes('adreno 660')) return 'Snapdragon 888 / 888+';
  if (r.includes('adreno 650')) return 'Snapdragon 865 / 870';
  if (r.includes('adreno 642l')) return 'Snapdragon 778G / 780G';
  if (r.includes('adreno 643')) return 'Snapdragon 7s Gen 2 (Modified)';
  if (r.includes('adreno 640')) return 'Snapdragon 855 / 860';
  if (r.includes('adreno 630')) return 'Snapdragon 845';
  
  // Mobile Mid-range
  if (r.includes('adreno 644')) return 'Snapdragon 7 Gen 1';
  if (r.includes('adreno 642')) return 'Snapdragon 780G';
  if (r.includes('adreno 620')) return 'Snapdragon 765G / 768G';
  if (r.includes('adreno 619')) return 'Snapdragon 750G / 695 / 480+';
  if (r.includes('adreno 618')) return 'Snapdragon 730 / 730G / 720G';
  if (r.includes('adreno 616')) return 'Snapdragon 710 / 712';
  if (r.includes('adreno 612')) return 'Snapdragon 675 / 678';
  if (r.includes('adreno 610')) return 'Snapdragon 665 / 680';
  if (r.includes('adreno 540')) return 'Snapdragon 835';
  if (r.includes('adreno 530')) return 'Snapdragon 820 / 821';
  if (r.includes('adreno 512')) return 'Snapdragon 660';
  if (r.includes('adreno 509')) return 'Snapdragon 636';
  if (r.includes('adreno 506')) return 'Snapdragon 625 / 450';
  if (r.includes('adreno 505')) return 'Snapdragon 430 / 435';
  if (r.includes('adreno 504')) return 'Snapdragon 429';
  if (r.includes('adreno 430')) return 'Snapdragon 810';
  if (r.includes('adreno 420')) return 'Snapdragon 805';
  if (r.includes('adreno 418')) return 'Snapdragon 808';
  if (r.includes('adreno 405')) return 'Snapdragon 615';
  if (r.includes('adreno 330')) return 'Snapdragon 800 / 801';
  if (r.includes('adreno 320')) return 'Snapdragon 600';
  if (r.includes('adreno 308')) return 'Snapdragon 425';
  if (r.includes('adreno 306')) return 'Snapdragon 410';

  // --- Samsung Exynos (Xclipse - AMD RDNA based) ---
  if (r.includes('xclipse 940')) return 'Exynos 2400';
  if (r.includes('xclipse 930')) return 'Exynos 2300 (Prototype)';
  if (r.includes('xclipse 920')) return 'Exynos 2200';
  if (r.includes('xclipse 540')) return 'Exynos 1580';
  if (r.includes('xclipse 530')) return 'Exynos 1480';

  // --- ARM Mali / Immortalis (Mediatek / Exynos / Tensor) ---
  
  // Google Tensor
  if (r.includes('google') && r.includes('mali-g715')) return 'Google Tensor G3 / G4';
  if (r.includes('google') && r.includes('mali-g710')) return 'Google Tensor G2'; 
  if (r.includes('google') && r.includes('mali-g78')) return 'Google Tensor';

  // Mediatek Dimensity / High-end Mali
  if (r.includes('mali-g925-immortalis mc12')) return 'Dimensity 9400+';
  if (r.includes('immortalis-g925')) return 'Dimensity 9400 / 9400+';
  if (r.includes('immortalis-g720')) return 'Dimensity 9300 / 9300+';
  if (r.includes('immortalis-g715')) return 'Dimensity 9200 / 9200+';
  
  // Mali G-series specific checks
  if (r.includes('mali-g725')) return 'Dimensity 8400';
  if (r.includes('mali-g715') && !r.includes('google')) return 'Dimensity 9200 / 8300';
  if (r.includes('mali-g710') && !r.includes('google')) return 'Dimensity 9000 / 9000+';
  if (r.includes('mali-g615')) return 'Dimensity 8300 / 7300';
  if (r.includes('mali-g610')) return 'Dimensity 8100 / 8200 / 1080 / 7050';
  if (r.includes('mali-g78')) return 'Exynos 2100 / Kirin 9000';
  if (r.includes('mali-g77')) return 'Dimensity 1000+ / Exynos 990';
  if (r.includes('mali-g76')) return 'Kirin 980 / Kirin 990 / Exynos 9820 / Helio G90T';
  if (r.includes('mali-g72')) return 'Exynos 9810 / Kirin 970 / Helio P60';
  if (r.includes('mali-g71')) return 'Exynos 8895 / Kirin 960';
  if (r.includes('mali-g68')) return 'Dimensity 900/920/1080 / Exynos 1380';
  if (r.includes('mali-g57')) return 'Dimensity 700/800/810 / Helio G96';
  if (r.includes('mali-g52')) return 'Helio G80/G85 / Kirin 710';
  if (r.includes('mali-g51')) return 'Exynos 7884 / Kirin 710F';
  if (r.includes('mali-g31')) return 'Helio G25/G35 / Exynos 850';
  if (r.includes('mali-t880')) return 'Exynos 8890 / Helio X20';
  if (r.includes('mali-t860')) return 'Helio P10 / Exynos 7870';
  if (r.includes('mali-t830')) return 'Exynos 7880 / Kirin 650';
  if (r.includes('mali-t760')) return 'Exynos 7420';
  if (r.includes('mali-t720')) return 'MT6753 / Exynos 7580';
  if (r.includes('mali-450')) return 'Legacy ARM Cortex-A7 SoC';
  if (r.includes('mali-400')) return 'Legacy ARM Cortex-A9/A7 SoC';

  // --- PowerVR (Imagination Technologies) ---
  if (r.includes('powervr bxm')) return 'MediaTek / Realtek SoC';
  if (r.includes('powervr gm9446')) return 'Helio P90';
  if (r.includes('powervr ge8320')) return 'Helio G22/G35 / A22';
  if (r.includes('powervr gt7600')) return 'Apple A9';
  if (r.includes('powervr gx6450')) return 'Apple A8';
  if (r.includes('powervr')) return 'MediaTek / Apple Legacy / Allwinner';

  // --- Intel Integrated Graphics ---
  // Lunar Lake
  if (r.includes('arc 140v') || r.includes('arc 130v')) return 'Intel Core Ultra Series 2 (Lunar Lake)';
  
  // Meteor Lake
  if (r.includes('intel') && r.includes('arc') && !r.includes('pro') && !r.includes('a7') && !r.includes('a3')) return 'Intel Core Ultra (Meteor Lake)';
  if (r.includes('intel arc graphics')) return 'Intel Core Ultra (Meteor Lake) / Arc Discrete';

  // Iris Xe / Plus
  if (r.includes('iris xe max')) return 'Intel 11th Gen + Arc Discrete';
  if (r.includes('iris xe') || r.includes('iris® xe')) return 'Intel Core 11th/12th/13th Gen / Core Ultra Series 1';
  if (r.includes('iris plus')) return 'Intel Core 10th Gen (Ice Lake) / 8th Gen (Coffee Lake)';
  if (r.includes('iris pro') || r.includes('iris graphics')) return 'Intel Core 4th-8th Gen (High-end)';
  
  // UHD Graphics
  if (r.includes('uhd graphics 770')) return 'Intel Core 12th/13th/14th Gen Desktop';
  if (r.includes('uhd graphics 750')) return 'Intel Core 11th Gen Desktop';
  if (r.includes('uhd graphics 730')) return 'Intel Core 11th/12th Gen Desktop';
  if (r.includes('uhd graphics 630')) return 'Intel Core 8th/9th/10th Gen';
  if (r.includes('uhd graphics 620') || r.includes('uhd graphics 617') || r.includes('uhd graphics 615')) return 'Intel Core 8th Gen (Mobile)';
  if (r.includes('uhd graphics 605') || r.includes('uhd graphics 600')) return 'Intel Pentium/Celeron (Gemini Lake)';
  if (r.includes('uhd graphics')) return 'Intel Core 8th-14th Gen';

  // HD Graphics
  if (r.includes('hd graphics 630')) return 'Intel Core 7th Gen';
  if (r.includes('hd graphics 620')) return 'Intel Core 7th Gen (Mobile)';
  if (r.includes('hd graphics 615') || r.includes('hd graphics 610')) return 'Intel Core 7th Gen (Low power)';
  if (r.includes('hd graphics 530')) return 'Intel Core 6th Gen';
  if (r.includes('hd graphics 520')) return 'Intel Core 6th Gen (Mobile)';
  if (r.includes('hd graphics 515') || r.includes('hd graphics 510')) return 'Intel Core 6th Gen (Low power)';
  if (r.includes('hd graphics 505') || r.includes('hd graphics 500')) return 'Intel Pentium/Celeron (Apollo Lake)';
  if (r.includes('hd graphics 6000') || r.includes('hd graphics 6100')) return 'Intel Core 5th Gen (Broadwell)';
  if (r.includes('hd graphics 5500') || r.includes('hd graphics 5300')) return 'Intel Core 5th Gen (Broadwell)';
  if (r.includes('hd graphics 5000') || r.includes('hd graphics 4600') || r.includes('hd graphics 4400')) return 'Intel Core 4th Gen (Haswell)';
  if (r.includes('hd graphics 4000')) return 'Intel Core 3rd Gen (Ivy Bridge)';
  if (r.includes('hd graphics 3000')) return 'Intel Core 2nd Gen (Sandy Bridge)';
  if (r.includes('hd graphics 2000')) return 'Intel Core 2nd Gen (Sandy Bridge)';
  if (r.includes('hd graphics')) return 'Intel Core Gen 1-3';
  
  // Generic Intel
  if (r.includes('intel') && r.includes('family')) return 'Intel Integrated Graphics';

  // --- AMD Integrated Graphics ---
  // RDNA 3.5
  if (r.includes('radeon 890m') || r.includes('radeon 880m')) return 'AMD Ryzen AI 300 Series (Strix Point)';
  
  // RDNA 3
  if (r.includes('radeon 780m')) return 'AMD Ryzen 7040/8040 Series (Phoenix/Hawk Point)';
  if (r.includes('radeon 760m')) return 'AMD Ryzen 7040/8040 Series';
  if (r.includes('radeon 740m')) return 'AMD Ryzen 7040 Series';
  
  // RDNA 2
  if (r.includes('radeon 680m')) return 'AMD Ryzen 6000 Series (Rembrandt)';
  if (r.includes('radeon 660m')) return 'AMD Ryzen 6000 Series';
  if (r.includes('radeon 610m')) return 'AMD Ryzen 7020 Series / Athlon';
  
  // Vega (Older)
  if (r.includes('radeon vega 11')) return 'AMD Ryzen 5 2400G / 3400G';
  if (r.includes('radeon vega 10')) return 'AMD Ryzen 7 2700U / 3700U / 3750H';
  if (r.includes('radeon vega 8')) return 'AMD Ryzen 3 2200G / 3200G / Ryzen 5 / 7 Mobile';
  if (r.includes('radeon vega 6')) return 'AMD Ryzen 3 Mobile';
  if (r.includes('radeon vega 3')) return 'AMD Athlon / Ryzen 3 Mobile';
  if (r.includes('radeon graphics') && !r.includes('rx')) return 'AMD Ryzen APU';

  // --- Workstation / Server GPUs ---
  if (r.includes('rtx 6000 ada') || r.includes('rtx 5000 ada') || r.includes('rtx 4000 ada')) return 'Workstation (Xeon / Threadripper / EPYC)';
  if (r.includes('quadro') || r.includes('rtx a')) return 'Workstation (Xeon / Threadripper)';
  if (r.includes('tesla') || r.includes('a100') || r.includes('h100') || r.includes('b200')) return 'Server (Xeon / EPYC)';
  if (r.includes('firepro') || r.includes('radeon pro') || r.includes('instinct')) return 'Workstation/Server (Xeon / Threadripper / EPYC)';

  // --- Discrete GPUs (Inference) ---
  // NVIDIA Desktop/Laptop
  if (r.includes('rtx 50')) return 'Intel 14th/15th Gen or Ryzen 9000 (Likely)'; // 5090, 5080, 5070, etc.
  if (r.includes('rtx 4090') || r.includes('rtx 4080')) return 'Intel 13th/14th Gen or Ryzen 7000/9000 (Likely)';
  if (r.includes('rtx 40')) return 'Intel 13th/14th Gen or Ryzen 7000 (Likely)';
  if (r.includes('rtx 30')) return 'Intel 10th-12th Gen or Ryzen 5000 (Likely)';
  if (r.includes('rtx 20') || r.includes('gtx 16')) return 'Intel 9th/10th Gen or Ryzen 3000/4000 (Likely)';
  if (r.includes('titan rtx') || r.includes('titan v') || r.includes('titan xp')) return 'HEDT / Workstation System';
  if (r.includes('gtx 10')) return 'Intel 6th-8th Gen or Ryzen 1000/2000 (Likely)';
  if (r.includes('gtx 9')) return 'Intel 4th-6th Gen or Ryzen 1000 (Likely)';
  if (r.includes('gtx 8') && r.includes('m')) return 'Intel 4th-5th Gen Mobile (Likely)';
  if (r.includes('gtx 7')) return 'Intel 3rd-4th Gen or AMD FX (Likely)';
  if (r.includes('gtx 6')) return 'Intel 2nd-3rd Gen (Likely)';

  // AMD Discrete
  if (r.includes('radeon rx 8')) return 'AMD Ryzen 9000 or Intel 14th/15th Gen (Likely)';
  if (r.includes('radeon rx 7')) return 'AMD Ryzen 7000 or Intel 13th/14th Gen (Likely)';
  if (r.includes('radeon rx 6')) return 'AMD Ryzen 5000 or Intel 11th/12th Gen (Likely)';
  if (r.includes('radeon rx 5700') || r.includes('rx 5600') || r.includes('rx 5500')) return 'AMD Ryzen 3000 or Intel 9th/10th Gen (Likely)';
  if (r.includes('radeon rx 5') || r.includes('rx 4')) return 'AMD Ryzen 1000/2000 or Intel 7th-9th Gen (Likely)';
  if (r.includes('radeon r9') || r.includes('radeon r7')) return 'AMD FX or Intel 4th-6th Gen (Likely)';

  // Intel ARC Discrete
  if (r.includes('arc a7') || r.includes('arc a5') || r.includes('arc a3')) return 'Intel 12th/13th Gen or Ryzen 5000/7000 (Likely)';
  if (r.includes('arc b')) return 'Intel Core Ultra or Ryzen 9000 (Likely)';

  // Fallback for generic
  if (r.includes('nvidia') && r.includes('geforce')) return 'Discrete NVIDIA GPU System';
  if (r.includes('amd') && r.includes('radeon')) return 'Discrete AMD GPU System';
  if (r.includes('intel') && r.includes('arc')) return 'Discrete Intel GPU System';

  return null;
};

