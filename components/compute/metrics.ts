export const percentileOf = (samples: readonly number[], p: number): number => {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[idx];
};

export const medianOf = (samples: readonly number[]): number => percentileOf(samples, 0.5);
