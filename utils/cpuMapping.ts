
export const estimateCpuFromGpu = (renderer: string): string | null => {
  if (!renderer || renderer === 'Unknown' || renderer === 'Unavailable') return null;

  const r = renderer.toLowerCase();

  // --- Apple Silicon ---
  // M-Series
  if (r.includes('apple m4')) return 'Apple M4 Series';
  if (r.includes('apple m3')) return 'Apple M3 Series';
  if (r.includes('apple m2')) return 'Apple M2 Series';
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
  
  // Apple GPU generic fallback
  if (r.includes('apple gpu')) return 'Apple Silicon';

  // --- Qualcomm Snapdragon (Adreno) ---
  // PC / Laptop / Tablet
  if (r.includes('adreno x1')) return 'Snapdragon X Elite / Plus';
  if (r.includes('adreno 8cx')) return 'Snapdragon 8cx Gen 3';
  
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
  
  // Mobile Legacy High-end
  if (r.includes('adreno 660')) return 'Snapdragon 888 / 888+';
  if (r.includes('adreno 650')) return 'Snapdragon 865 / 870';
  if (r.includes('adreno 642l')) return 'Snapdragon 778G / 780G';
  if (r.includes('adreno 640')) return 'Snapdragon 855 / 860';
  if (r.includes('adreno 630')) return 'Snapdragon 845';
  
  // Mobile Mid-range
  if (r.includes('adreno 644')) return 'Snapdragon 7 Gen 1';
  if (r.includes('adreno 619')) return 'Snapdragon 750G / 695 / 4 Gen 1';
  if (r.includes('adreno 618')) return 'Snapdragon 720G / 730G';
  if (r.includes('adreno 610')) return 'Snapdragon 665 / 680';

  // --- Samsung Exynos (Xclipse - AMD RDNA based) ---
  if (r.includes('xclipse 940')) return 'Exynos 2400';
  if (r.includes('xclipse 920')) return 'Exynos 2200';
  if (r.includes('xclipse 530')) return 'Exynos 1480';

  // --- ARM Mali / Immortalis (Mediatek / Exynos / Tensor) ---
  
  // Google Tensor
  if (r.includes('google') && r.includes('mali-g715')) return 'Google Tensor G3 / G4';
  if (r.includes('google') && r.includes('mali-g710')) return 'Google Tensor G2'; 
  if (r.includes('google') && r.includes('mali-g78')) return 'Google Tensor';

  // Mediatek Dimensity
  if (r.includes('immortalis-g925')) return 'Dimensity 9400';
  if (r.includes('immortalis-g720')) return 'Dimensity 9300';
  if (r.includes('immortalis-g715')) return 'Dimensity 9200';
  if (r.includes('mali-g715') && !r.includes('google')) return 'Dimensity 9200 / 8300';
  if (r.includes('mali-g615')) return 'Dimensity 8300';
  if (r.includes('mali-g710')) return 'Dimensity 9000';
  if (r.includes('mali-g610')) return 'Dimensity 8100 / 8200';
  if (r.includes('mali-g77')) return 'Dimensity 1000+ / Exynos 990';
  if (r.includes('mali-g68')) return 'Dimensity 900/1080 / Exynos 1280/1380';
  if (r.includes('mali-g57')) return 'Dimensity 700/800 / Helio G96';

  // --- Intel Integrated Graphics ---
  // Lunar Lake
  if (r.includes('arc 140v') || r.includes('arc 130v')) return 'Intel Core Ultra Series 2 (Lunar Lake)';
  
  // Meteor Lake
  if (r.includes('intel') && r.includes('arc') && !r.includes('pro') && !r.includes('a7') && !r.includes('a3')) return 'Intel Core Ultra (Meteor Lake)';
  
  // Iris Xe / Plus
  if (r.includes('iris xe') || r.includes('iris® xe')) return 'Intel Core 11th/12th/13th/14th Gen / Core Ultra Series 1';
  if (r.includes('iris plus')) return 'Intel Core 10th Gen (Ice Lake)';
  
  // UHD Graphics
  if (r.includes('uhd graphics 770')) return 'Intel Core 12th/13th/14th Gen Desktop';
  if (r.includes('uhd graphics 750')) return 'Intel Core 11th Gen Desktop';
  if (r.includes('uhd graphics 730')) return 'Intel Core 11th/12th Gen Desktop';
  if (r.includes('uhd graphics 630')) return 'Intel Core 8th/9th/10th Gen';
  if (r.includes('uhd graphics 620') || r.includes('uhd graphics 617') || r.includes('uhd graphics 615')) return 'Intel Core 8th Gen (Mobile)';
  if (r.includes('hd graphics 630')) return 'Intel Core 7th Gen';
  if (r.includes('hd graphics 620')) return 'Intel Core 7th Gen (Mobile)';
  if (r.includes('hd graphics 530')) return 'Intel Core 6th Gen';
  if (r.includes('hd graphics 520')) return 'Intel Core 6th Gen (Mobile)';

  // --- AMD Integrated Graphics ---
  // RDNA 3.5
  if (r.includes('radeon 890m') || r.includes('radeon 880m')) return 'AMD Ryzen AI 300 Series (Strix Point)';
  
  // RDNA 3
  if (r.includes('radeon 780m')) return 'AMD Ryzen 7040/8040 Series';
  if (r.includes('radeon 760m')) return 'AMD Ryzen 7040/8040 Series';
  if (r.includes('radeon 740m')) return 'AMD Ryzen 7040 Series';
  
  // RDNA 2
  if (r.includes('radeon 680m')) return 'AMD Ryzen 6000 Series';
  if (r.includes('radeon 660m')) return 'AMD Ryzen 6000 Series';
  
  // Vega (Older)
  if (r.includes('radeon vega 8')) return 'AMD Ryzen 2000/3000/4000/5000 Series APU';
  if (r.includes('radeon vega 7')) return 'AMD Ryzen 4000/5000 Series APU';
  if (r.includes('radeon vega 6')) return 'AMD Ryzen 4000/5000 Series APU';
  if (r.includes('radeon vega 3')) return 'AMD Athlon / Ryzen 3';
  if (r.includes('radeon graphics') && !r.includes('rx')) return 'AMD Ryzen APU (Generic)';

  // --- Discrete GPUs (Inference) ---
  // NVIDIA Desktop/Laptop
  if (r.includes('rtx 5090') || r.includes('rtx 5080')) return 'Intel 14th/15th Gen or Ryzen 9000 (Likely)'; // Future proofing
  if (r.includes('rtx 4090') || r.includes('rtx 4080')) return 'Intel 13th/14th Gen or Ryzen 7000/9000 (Likely)';
  if (r.includes('rtx 40')) return 'Intel 13th/14th Gen or Ryzen 7000 (Likely)';
  if (r.includes('rtx 30')) return 'Intel 10th-12th Gen or Ryzen 5000 (Likely)';
  if (r.includes('rtx 20') || r.includes('gtx 16')) return 'Intel 9th/10th Gen or Ryzen 3000/4000 (Likely)';
  if (r.includes('gtx 10')) return 'Intel 6th-8th Gen or Ryzen 1000/2000 (Likely)';

  // AMD Discrete
  if (r.includes('radeon rx 7')) return 'AMD Ryzen 7000 or Intel 13th/14th Gen (Likely)';
  if (r.includes('radeon rx 6')) return 'AMD Ryzen 5000 or Intel 11th/12th Gen (Likely)';

  return null;
};
