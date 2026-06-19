// Simple MurmurHash3 implementation for custom component hashing
function murmurhash3_32_gc(key: string, seed: number): number {
  let h1, h1b, _c1b, _c2b, k1, i;

  const remainder = key.length & 3; // key.length % 4
  const bytes = key.length - remainder;
  h1 = seed;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
      k1 = 
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;
      
      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1 >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      // eslint-disable-next-line no-fallthrough
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      // eslint-disable-next-line no-fallthrough
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);
      
      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = ((((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

self.onmessage = function (e: MessageEvent) {
  const { id, config, type, key, seed } = e.data;
  const start = performance.now();

  try {
    if (type === 'hash') {
      const hash = murmurhash3_32_gc(key, seed || 31);
      const hexHash = hash.toString(16).padStart(8, '0');
      self.postMessage({ id, type, hexHash, success: true });
      return;
    }

    if (id === 'cpu') {
      let count = 0;
      const max = config.primeMax;
      for (let i = 2; i <= max; i++) {
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
      const duration = Math.max(performance.now() - start, 1);
      const score = Math.floor(config.multiplier / duration);
      const details = count + ' primes (' + duration.toFixed(0) + 'ms)';
      self.postMessage({ id, score, details, success: true });
    } else if (id === 'math') {
      const ops = config.ops;
      let sum = 0;
      for (let i = 0; i < ops; i++) {
        sum += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      }
      // Use sum to prevent optimization
      const duration = Math.max(performance.now() - start, 1);
      const score = Math.floor(config.multiplier / duration) + (sum === 0 ? 0 : 0);
      const details = (ops / 1000000).toFixed(1) + 'M ops (' + duration.toFixed(0) + 'ms)';
      self.postMessage({ id, score, details, success: true });
    } else if (id === 'memory') {
      const size = config.size;
      const arr = new Uint32Array(size);
      // Write
      for (let i = 0; i < size; i++) arr[i] = i;
      // Read/Write Sparse
      for (let i = 0; i < size; i += 8) arr[i] = arr[size - 1 - i];
      arr.reverse();

      const duration = Math.max(performance.now() - start, 1);
      const mbProcessed = (size * 4 * 2.5) / (1024 * 1024);
      const throughput = (mbProcessed / (duration / 1000)).toFixed(0);
      const score = Math.floor(config.multiplier / duration);
      const details = throughput + ' MB/s (' + duration.toFixed(0) + 'ms)';
      self.postMessage({ id, score, details, success: true });
    }
  } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    self.postMessage({ id, type, success: false, error: err.message });
  }
};
