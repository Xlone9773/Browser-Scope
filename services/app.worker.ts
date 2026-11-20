import {
  murmurhash3_32_gc,
  runWorkerBenchmarkTask,
  type BenchmarkKernelConfig,
  type BenchmarkTaskId,
} from '../components/compute/cpu/benchmarkKernels';

interface WorkerTaskMessage {
  id: string;
  requestId?: number;
  config?: BenchmarkKernelConfig;
  type?: string;
  key?: string;
  seed?: number;
}

self.onmessage = function (e: MessageEvent<WorkerTaskMessage>) {
  const { id, requestId, config, type, key, seed } = e.data;

  try {
    if (type === 'hash') {
      const hash = murmurhash3_32_gc(key ?? '', seed || 31);
      const hexHash = hash.toString(16).padStart(8, '0');
      self.postMessage({ id, requestId, type, hexHash, success: true });
      return;
    }

    if (
      (id === 'cpu' ||
        id === 'math' ||
        id === 'memory' ||
        id === 'crypto' ||
        id === 'convolution' ||
        id === 'regex') &&
      config
    ) {
      const result = runWorkerBenchmarkTask(id as BenchmarkTaskId, config);
      self.postMessage({
        id,
        requestId,
        score: result.score,
        details: result.details,
        checksum: result.checksum,
        success: true,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    self.postMessage({ id, requestId, type, success: false, error: errorMsg });
  }
};
