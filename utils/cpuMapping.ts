
export const estimateCpuFromGpu = (renderer: string): string | null => {
  if (!renderer || renderer === 'Unknown' || renderer === 'Unavailable') return null;

  const r = renderer.toLowerCase();

  // --- Apple Silicon ---
  if (r.includes('apple m1')) return 'Apple M1 Series';
  if (r.includes('apple m2')) return 'Apple M2 Series';
  if (r.includes('apple m3')) return 'Apple M3 Series';
  if (r.includes('apple a17')) return 'Apple A17 Pro';
  if (r.includes('apple a16')) return 'Apple A16 Bionic';
  if (r.includes('apple a15')) return 'Apple A15 Bionic';
  if (r.includes('apple a14')) return 'Apple A14 Bionic';
  if (r.includes('apple a13')) return 'Apple A13 Bionic';
  
  // --- Qualcomm Snapdragon (Adreno) ---
  // High-end
  if (r.includes('adreno 750')) return 'Snapdragon 8 Gen 3';
  if (r.includes('adreno 740')) return 'Snapdragon 8 Gen 2';
  if (r.includes('adreno 730')) return 'Snapdragon 8 Gen 1 / 8+ Gen 1';
  if (r.includes('adreno 660')) return 'Snapdragon 888 / 888+';
  if (r.includes('adreno 650')) return 'Snapdragon 865 / 870';
  if (r.includes('adreno 640')) return 'Snapdragon 855 / 860';
  // Mid-range
  if (r.includes('adreno 644')) return 'Snapdragon 7 Gen 1';
  if (r.includes('adreno 642l')) return 'Snapdragon 778G';
  if (r.includes('adreno 619')) return 'Snapdragon 750G / 695';
  if (r.includes('adreno 618')) return 'Snapdragon 720G / 730G';

  // --- ARM Mali (Mediatek Dimensity / Exynos / Google Tensor) ---
  // Google Tensor
  if (r.includes('mali-g715') && r.includes('google')) return 'Google Tensor G3'; 
  if (r.includes('mali-g710') && r.includes('google')) return 'Google Tensor G2'; 
  if (r.includes('mali-g78') && r.includes('google')) return 'Google Tensor';

  // Mediatek / Exynos (General approximations)
  if (r.includes('mali-g720') || r.includes('immortalis-g720')) return 'Dimensity 9300 / Exynos 2400';
  if (r.includes('mali-g715') || r.includes('immortalis-g715')) return 'Dimensity 9200';
  if (r.includes('mali-g710')) return 'Dimensity 9000';
  if (r.includes('mali-g77')) return 'Dimensity 1000+ / Exynos 990';
  if (r.includes('mali-g68')) return 'Dimensity 900/1080 / Exynos 1280';

  // --- Intel Integrated Graphics ---
  if (r.includes('intel') && r.includes('arc')) return 'Intel Core Ultra (Meteor Lake) / Arc';
  if (r.includes('iris xe')) return 'Intel Core 11th/12th/13th Gen';
  if (r.includes('iris plus')) return 'Intel Core 10th Gen';
  if (r.includes('uhd graphics 770')) return 'Intel Core 12th/13th/14th Gen Desktop';
  if (r.includes('uhd graphics 750')) return 'Intel Core 11th Gen Desktop';
  if (r.includes('uhd graphics 630')) return 'Intel Core 8th/9th/10th Gen';
  if (r.includes('hd graphics 630')) return 'Intel Core 7th Gen';
  if (r.includes('hd graphics 530')) return 'Intel Core 6th Gen';

  // --- AMD Integrated Graphics ---
  if (r.includes('radeon 780m')) return 'AMD Ryzen 7040/8040 Series';
  if (r.includes('radeon 680m')) return 'AMD Ryzen 6000 Series';
  if (r.includes('radeon graphics') && !r.includes('rx')) return 'AMD Ryzen APU'; // Generic fallback for Ryzen APUs

  // --- NVIDIA (Dedicated GPUs usually mean discrete CPU, but implies desktop/high-end laptop) ---
  if (r.includes('rtx 40')) return 'Intel 13/14th Gen or Ryzen 7000 (Likely)';
  if (r.includes('rtx 30')) return 'Intel 11/12th Gen or Ryzen 5000 (Likely)';

  return null;
};
