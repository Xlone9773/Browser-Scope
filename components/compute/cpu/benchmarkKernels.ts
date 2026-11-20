// Components: Deterministic pure benchmark kernels and adaptive measurement window
// helpers shared by the Benchmark Worker and unit tests.

export type BenchmarkTaskId =
  | 'cpu'
  | 'math'
  | 'memory'
  | 'crypto'
  | 'convolution'
  | 'regex';

export interface BenchmarkKernelConfig {
  primeMax?: number;
  ops?: number;
  size?: number;
  iterations?: number;
  matrixSize?: number;
  passes?: number;
  length?: number;
  multiplier: number;
}

export interface BenchmarkKernelResult {
  score: number;
  details: string;
  checksum: number;
  passes: number;
  avgDurationMs: number;
}

export const TARGET_BENCH_MIN_MS = 60;
export const MAX_ADAPTIVE_BENCH_PASSES = 64;

export function murmurhash3_32_gc(key: string, seed: number): number {
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  let h1 = seed;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let i = 0;

  while (i < bytes) {
    let k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    const h1b = (((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1 >>> 16) + 0xe654) & 0xffff) << 16);
  }

  let k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      /* falls through */
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      /* falls through */
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = (((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

const countPrimesUpTo = (max: number, startOffset: number): number => {
  let count = 0;
  const start = Math.max(2, 2 + (startOffset & 1));
  // If startOffset is odd, adjust base prime count check accurately so every pass differs
  if (start > 2 && max >= 2) {
    count = 1;
  }
  for (let i = start; i <= max; i++) {
    let isPrime = true;
    const limit = Math.sqrt(i);
    for (let j = 2; j <= limit; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
};

/**
 * Repeats a unit pass until total elapsed wall time reaches minWindowMs
 * (capped at maxPasses), eliminating 1ms-clamping and sub-millisecond clock
 * coarsening quantization without altering score scale.
 */
export const measureAdaptivePasses = (
  runPass: (passIndex: number) => number,
  minWindowMs: number = TARGET_BENCH_MIN_MS,
  maxPasses: number = MAX_ADAPTIVE_BENCH_PASSES,
  now: () => number = () => performance.now(),
): { totalElapsedMs: number; avgDurationMs: number; passes: number; checksum: number } => {
  const start = now();
  let passes = 0;
  let checksum = 0;
  let elapsed: number;

  do {
    checksum = (checksum ^ runPass(passes)) >>> 0;
    passes++;
    elapsed = now() - start;
  } while (elapsed < minWindowMs && passes < maxPasses);

  const safeElapsed = Math.max(elapsed, 0.05);
  const avgDurationMs = Math.max(safeElapsed / passes, 0.05);
  return {
    totalElapsedMs: safeElapsed,
    avgDurationMs,
    passes,
    checksum,
  };
};

export const runWorkerBenchmarkTask = (
  id: BenchmarkTaskId,
  config: BenchmarkKernelConfig,
  now: () => number = () => performance.now(),
): BenchmarkKernelResult => {
  if (id === 'cpu') {
    const max = config.primeMax ?? 150000;
    const warmupMax = Math.floor(max * 0.1);
    const warmChk = countPrimesUpTo(warmupMax, 0);
    const warmGuard = warmupMax >= 2 && warmChk < 1 ? 1 : 0;

    const measured = measureAdaptivePasses(
      (pass) => countPrimesUpTo(max, pass) ^ (pass + warmGuard),
      TARGET_BENCH_MIN_MS,
      MAX_ADAPTIVE_BENCH_PASSES,
      now,
    );

    const speed = (max / (measured.avgDurationMs / 1000) / 1_000_000).toFixed(1);
    const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
    const chkHex = (measured.checksum & 0xffff).toString(16);
    return {
      score,
      checksum: measured.checksum,
      passes: measured.passes,
      avgDurationMs: measured.avgDurationMs,
      details: `${speed} M candidates/s (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
    };
  }

  if (id === 'math') {
    const ops = config.ops ?? 2000000;
    const warmupOps = Math.floor(ops * 0.1);
    let warmupSum = 0;
    for (let i = 0; i < warmupOps; i++) {
      warmupSum += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }

    const measured = measureAdaptivePasses(
      (pass) => {
        let sum = (pass + 1) * 1e-6 + warmupSum * 1e-12;
        for (let i = 0; i < ops; i++) {
          sum += Math.sqrt(i + (pass & 3)) * Math.sin(i) * Math.cos(i);
        }
        return Math.trunc(Math.abs(sum) * 100) >>> 0;
      },
      TARGET_BENCH_MIN_MS,
      MAX_ADAPTIVE_BENCH_PASSES,
      now,
    );

    const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
    const mopsPerSec = (ops / (measured.avgDurationMs / 1000) / 1_000_000).toFixed(1);
    const chkHex = (measured.checksum & 0xffff).toString(16);
    return {
      score,
      checksum: measured.checksum,
      passes: measured.passes,
      avgDurationMs: measured.avgDurationMs,
      details: `${mopsPerSec} M ops/s (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
    };
  }

  if (id === 'memory') {
    const size = config.size ?? 4000000;
    const warmupSize = Math.floor(size * 0.1);
    const warmupArr = new Uint32Array(warmupSize);
    for (let i = 0; i < warmupSize; i++) warmupArr[i] = i;

    const measured = measureAdaptivePasses(
      (pass) => {
        const arr = new Uint32Array(size);
        const offset = (warmupArr[0] + pass) & 0xff;
        for (let i = 0; i < size; i++) arr[i] = (i + offset) >>> 0;
        for (let i = 0; i < size; i += 8) arr[i] = arr[size - 1 - i];
        arr.reverse();
        return (arr[size - 1] ^ arr[size >>> 1]) >>> 0;
      },
      TARGET_BENCH_MIN_MS,
      16,
      now,
    );

    const mbProcessed = (size * 4 * 2.5) / (1024 * 1024);
    const throughput = (mbProcessed / (measured.avgDurationMs / 1000)).toFixed(0);
    const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
    const chkHex = (measured.checksum & 0xffff).toString(16);
    return {
      score,
      checksum: measured.checksum,
      passes: measured.passes,
      avgDurationMs: measured.avgDurationMs,
      details: `${throughput} MB/s (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
    };
  }

  if (id === 'crypto') {
    const size = config.size ?? 1000000;
    const iterations = config.iterations ?? 10;
    const tempStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // Build deterministic buffer once after short warm-up
    const warmHash = murmurhash3_32_gc('abcdefghijklmnopqrstuvwxyz', 123);

    const measured = measureAdaptivePasses(
      (pass) => {
        let key = '';
        while (key.length < size) {
          key += tempStr;
        }
        key = key.substring(0, size);

        let hashVal = (warmHash ^ pass) >>> 0;
        for (let i = 0; i < iterations; i++) {
          hashVal = (hashVal ^ murmurhash3_32_gc(key, 12345 + i + pass * 31)) >>> 0;
        }
        return hashVal;
      },
      TARGET_BENCH_MIN_MS,
      16,
      now,
    );

    const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
    const mbs = ((size * iterations) / (1024 * 1024) / (measured.avgDurationMs / 1000)).toFixed(1);
    const chkHex = (measured.checksum & 0xffff).toString(16);
    return {
      score,
      checksum: measured.checksum,
      passes: measured.passes,
      avgDurationMs: measured.avgDurationMs,
      details: `${mbs} MB/s (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
    };
  }

  if (id === 'convolution') {
    const size = config.matrixSize ?? 512;
    const passes = config.passes ?? 12;

    const warmupMatrixSize = 64;
    const warmupInput = new Float32Array(warmupMatrixSize * warmupMatrixSize);
    const warmupOutput = new Float32Array(warmupMatrixSize * warmupMatrixSize);
    for (let i = 0; i < warmupInput.length; i++) warmupInput[i] = Math.sin(i) * 0.5 + 0.5;
    const warmupKernel = new Float32Array([1, 0, -1, 2, 0, -2, 1, 0, -1]);
    for (let y = 1; y < warmupMatrixSize - 1; y++) {
      for (let x = 1; x < warmupMatrixSize - 1; x++) {
        warmupOutput[y * warmupMatrixSize + x] = warmupInput[y * warmupMatrixSize + x] * warmupKernel[3];
      }
    }

    const measured = measureAdaptivePasses(
      (runIdx) => {
        const input = new Float32Array(size * size);
        const output = new Float32Array(size * size);
        const phaseShift = (runIdx + (warmupOutput[65] > 0 ? 0.01 : 0)) * 0.05;

        for (let i = 0; i < input.length; i++) {
          input[i] = Math.sin(i + phaseShift) * 0.5 + 0.5;
        }

        const kernel = new Float32Array([1, 2, 1, 0, 0, 0, -1, -2, -1]);
        for (let p = 0; p < passes; p++) {
          for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
              let sum = 0;
              sum += input[(y - 1) * size + (x - 1)] * kernel[0];
              sum += input[(y - 1) * size + x] * kernel[1];
              sum += input[(y - 1) * size + (x + 1)] * kernel[2];
              sum += input[y * size + (x - 1)] * kernel[3];
              sum += input[y * size + x] * kernel[4];
              sum += input[y * size + (x + 1)] * kernel[5];
              sum += input[(y + 1) * size + (x - 1)] * kernel[6];
              sum += input[(y + 1) * size + x] * kernel[7];
              sum += input[(y + 1) * size + (x + 1)] * kernel[8];
              output[y * size + x] = sum;
            }
          }
          input.set(output);
        }

        const centerPixelVal = output[Math.floor((size * size) / 2)];
        return Math.floor(Math.abs(centerPixelVal) * 100) >>> 0;
      },
      TARGET_BENCH_MIN_MS,
      8,
      now,
    );

    const ops = size * size * 9 * passes;
    const gflops = (ops / (measured.avgDurationMs / 1000) / 1_000_000_000).toFixed(2);
    const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
    const chkHex = (measured.checksum & 0xffff).toString(16);
    return {
      score,
      checksum: measured.checksum,
      passes: measured.passes,
      avgDurationMs: measured.avgDurationMs,
      details: `${gflops} GFLOPS (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
    };
  }

  // regex
  const codeLen = config.length ?? 1500000;
  const warmRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const warmupMatches = "const val = 'user@example.com';".match(warmRegex) || [];

  const measured = measureAdaptivePasses(
    (pass) => {
      const chunk =
        "const app = express(); app.get('/api/v1/user/:id', (req, res) => { const email = 'user' + req.params.id + '@test.example.com'; return res.json({ id: req.params.id, email, role: 'admin', active: true }); });\n";
      let text = pass === 0 && warmupMatches.length > 0 ? '' : ' ';
      while (text.length < codeLen) {
        text += chunk;
      }
      text = text.substring(0, codeLen);

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = text.match(emailRegex) || [];
      const apiRegex = /\/api\/v[0-9]\/[a-zA-Z0-9]+/g;
      const paths = text.match(apiRegex) || [];
      const varRegex = /(const|let|var)\s+[a-zA-Z0-9_]+\s*=/g;
      const vars = text.match(varRegex) || [];
      return (emails.length + paths.length + vars.length) >>> 0;
    },
    TARGET_BENCH_MIN_MS,
    16,
    now,
  );

  const score = Math.max(1, Math.floor(config.multiplier / measured.avgDurationMs));
  const mbs = (codeLen / (1024 * 1024) / (measured.avgDurationMs / 1000)).toFixed(1);
  const chkHex = (measured.checksum & 0xffff).toString(16);
  return {
    score,
    checksum: measured.checksum,
    passes: measured.passes,
    avgDurationMs: measured.avgDurationMs,
    details: `${mbs} MB/s (${measured.avgDurationMs.toFixed(1)}ms x${measured.passes}, chk: ${chkHex})`,
  };
};
