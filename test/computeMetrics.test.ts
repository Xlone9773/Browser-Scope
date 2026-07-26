import { describe, it, expect } from 'vitest';
import { percentileOf, medianOf } from '../components/compute/metrics';

describe('percentileOf', () => {
  it('returns 0 for an empty sample set', () => {
    expect(percentileOf([], 0.5)).toBe(0);
  });

  it('returns the max for p=1 and the min for p=0', () => {
    const samples = [5, 1, 4, 2, 3];
    expect(percentileOf(samples, 0)).toBe(1);
    expect(percentileOf(samples, 1)).toBe(5);
  });

  it('does not mutate the input array', () => {
    const samples = [5, 1, 4, 2, 3];
    percentileOf(samples, 0.5);
    expect(samples).toEqual([5, 1, 4, 2, 3]);
  });

  it('computes the 95th percentile on a larger sample set', () => {
    const samples = Array.from({ length: 100 }, (_, i) => i + 1); // 1..100
    expect(percentileOf(samples, 0.95)).toBe(96);
  });
});

describe('medianOf', () => {
  it('returns 0 for an empty sample set', () => {
    expect(medianOf([])).toBe(0);
  });

  it('picks the middle value of an odd-length set', () => {
    expect(medianOf([3, 1, 2])).toBe(2);
  });
});
