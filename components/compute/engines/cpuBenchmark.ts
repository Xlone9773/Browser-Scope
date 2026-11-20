import type { RunPhase } from './webgpuBenchmark';
import { medianOf, percentileOf } from '../metrics';
import {
  computeAdaptiveCpuBatchIterations,
  computeExpectedCpuReference,
  resolveCpuWorkerCount,
  verifyCpuKernelResult,
  type CpuComputeMode,
} from '../cpu/cpuFlops';
import type {
  CpuWorkerInboundMessage,
  CpuWorkerOutboundMessage,
} from '../workers/cpuStress.worker';

export interface CpuWorkerLike {
  postMessage: (message: CpuWorkerInboundMessage) => void;
  terminate: () => void;
  addEventListener: (
    type: 'message' | 'error' | 'messageerror',
    listener: (ev: Event) => void,
  ) => void;
  removeEventListener: (
    type: 'message' | 'error' | 'messageerror',
    listener: (ev: Event) => void,
  ) => void;
}

export interface CpuBenchmarkSettings {
  matrixSize: number;
  logicalCores?: number;
  createWorker?: () => CpuWorkerLike;
}

export interface CpuBenchmarkCallbacks {
  onPhaseChange: (phase: RunPhase) => void;
  onVerification: (status: 'passed' | 'failed') => void;
  onWorkersReady: (info: {
    activeWorkers: number;
    batchIterations: number;
    computeMode: CpuComputeMode;
  }) => void;
  onSample: (gflops: number, peak: number, sustained: number) => void;
  onError: (kind: 'setup' | 'verification' | 'worker') => void;
}

const VERIFY_ITERATIONS = 512;
const VERIFY_SEED = 1.25;
const TARGET_BATCH_MS = 60;
const CALIBRATE_SEED = 2.5;
const SAMPLE_INTERVAL_MS = 250;
const WARMUP_SAMPLE_INTERVAL_MS = 180;
const WARMUP_MAX_MS = 1500;
const WARMUP_STABLE_THRESHOLD = 0.05;
const SAMPLE_WINDOW = 300;
const WORKER_RPC_TIMEOUT_MS = 10_000;

let nextEngineRunId = 1;

const defaultCreateWorker = (): CpuWorkerLike =>
  new Worker(new URL('../workers/cpuStress.worker.ts', import.meta.url), {
    type: 'module',
  }) as unknown as CpuWorkerLike;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const requestWorkerRpc = <T extends CpuWorkerOutboundMessage['type']>(
  worker: CpuWorkerLike,
  payload: CpuWorkerInboundMessage,
  expectedType: T,
  runId: number,
  isAborted: () => boolean,
): Promise<Extract<CpuWorkerOutboundMessage, { type: T }> | null> => {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      clearTimeout(timeoutId);
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      worker.removeEventListener('messageerror', onError);
    };

    const finishResolve = (val: Extract<CpuWorkerOutboundMessage, { type: T }> | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(val);
    };

    const finishReject = (err: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };

    const onMessage = (ev: Event) => {
      const msg = (ev as MessageEvent<CpuWorkerOutboundMessage>).data;
      if (!msg || msg.runId !== runId) return;
      if (isAborted()) {
        finishResolve(null);
        return;
      }
      if (msg.type === 'error') {
        finishReject(new Error(msg.message || 'CPU worker error'));
        return;
      }
      if (msg.type === expectedType) {
        finishResolve(msg as Extract<CpuWorkerOutboundMessage, { type: T }>);
      }
    };

    const onError = () => {
      finishReject(new Error('CPU worker crashed or failed to load'));
    };

    const timeoutId = setTimeout(() => {
      if (isAborted()) {
        finishResolve(null);
      } else {
        finishReject(new Error('CPU worker RPC timed out'));
      }
    }, WORKER_RPC_TIMEOUT_MS);

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.addEventListener('messageerror', onError);
    worker.postMessage(payload);
  });
};

export const runCpuBenchmark = async (
  settings: CpuBenchmarkSettings,
  isCancelled: () => boolean,
  isStopRequested: () => boolean,
  callbacks: CpuBenchmarkCallbacks,
): Promise<void> => {
  const engineRunId = nextEngineRunId++;
  const logicalCores =
    settings.logicalCores ??
    (typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4);
  const numWorkers = resolveCpuWorkerCount(settings.matrixSize, logicalCores);
  const workerFactory = settings.createWorker ?? defaultCreateWorker;

  const workers: CpuWorkerLike[] = [];
  const detachHandlers: Array<() => void> = [];
  let fatalWorkerError = false;

  const isAborted = (): boolean =>
    isCancelled() || isStopRequested() || fatalWorkerError;

  const cleanup = () => {
    detachHandlers.forEach((detach) => detach());
    detachHandlers.length = 0;
    workers.forEach((w) => {
      try {
        w.postMessage({ cmd: 'stop', runId: engineRunId });
      } catch {
        // Ignore postMessage failure on terminated workers
      }
      try {
        w.terminate();
      } catch {
        // Ignore terminate error
      }
    });
    workers.length = 0;
  };

  try {
    for (let i = 0; i < numWorkers; i++) {
      workers.push(workerFactory());
    }
  } catch (err: unknown) {
    console.error('Failed to spawn CPU stress workers:', err);
    cleanup();
    callbacks.onError('setup');
    return;
  }

  try {
    callbacks.onPhaseChange('verifying');
    await sleep(0);
    if (isAborted()) return;

    // Phase 1: Deterministic verification across all worker threads (supporting both wasm-simd and scalar-js)
    let verifyResults: Array<Extract<CpuWorkerOutboundMessage, { type: 'verified' }> | null>;
    try {
      verifyResults = await Promise.all(
        workers.map((worker) =>
          requestWorkerRpc(
            worker,
            {
              cmd: 'verify',
              runId: engineRunId,
              iterations: VERIFY_ITERATIONS,
              seed: VERIFY_SEED,
            },
            'verified',
            engineRunId,
            isAborted,
          ),
        ),
      );
    } catch (err: unknown) {
      console.error('CPU verification RPC failed:', err);
      callbacks.onError('worker');
      return;
    }

    if (isAborted()) return;

    const firstMode: CpuComputeMode = verifyResults[0]?.mode ?? 'scalar-js';
    const expectedRef = computeExpectedCpuReference(VERIFY_ITERATIONS, VERIFY_SEED, firstMode);
    const allVerified =
      verifyResults.length === numWorkers &&
      verifyResults.every(
        (res) =>
          res !== null &&
          res.mode === firstMode &&
          verifyCpuKernelResult({ lanesSum: res.lanesSum, digest: res.digest }, expectedRef),
      );

    callbacks.onVerification(allVerified ? 'passed' : 'failed');
    if (!allVerified) {
      callbacks.onError('verification');
      return;
    }

    // Phase 2: Calibrate post-JIT batch iterations targeting ~60ms per batch on Worker 0
    callbacks.onPhaseChange('calibrating');
    let calResult: Extract<CpuWorkerOutboundMessage, { type: 'calibrated' }> | null;
    try {
      calResult = await requestWorkerRpc(
        workers[0],
        {
          cmd: 'calibrate',
          runId: engineRunId,
          targetBatchMs: TARGET_BATCH_MS,
          seed: CALIBRATE_SEED,
        },
        'calibrated',
        engineRunId,
        isAborted,
      );
    } catch (err: unknown) {
      console.error('CPU calibration RPC failed:', err);
      callbacks.onError('worker');
      return;
    }

    if (isAborted() || !calResult) return;

    const computeMode = calResult.mode ?? firstMode;
    const batchIterations =
      calResult.batchIterations > 0
        ? calResult.batchIterations
        : computeAdaptiveCpuBatchIterations(
            calResult.probeIterations,
            calResult.durationMs,
            TARGET_BATCH_MS,
          );
    callbacks.onWorkersReady({ activeWorkers: numWorkers, batchIterations, computeMode });

    // Per-worker rolling rate tracking (eliminates sample boundary sawtooth)
    const workerWindowOps = new Float64Array(numWorkers);
    const workerWindowCycleMs = new Float64Array(numWorkers);
    const workerLatestGflops = new Float64Array(numWorkers);
    const workerHasReported = new Uint8Array(numWorkers);

    workers.forEach((worker, idx) => {
      const onMessage = (ev: Event) => {
        const msg = (ev as MessageEvent<CpuWorkerOutboundMessage>).data;
        if (!msg || msg.runId !== engineRunId) return;
        if (msg.type === 'error') {
          fatalWorkerError = true;
          return;
        }
        if (msg.type === 'progress') {
          if (!Number.isFinite(msg.lanesSum) || msg.ops <= 0 || msg.cycleDurationMs <= 0) {
            fatalWorkerError = true;
            return;
          }
          workerWindowOps[idx] += msg.ops;
          workerWindowCycleMs[idx] += msg.cycleDurationMs;
          workerHasReported[idx] = 1;
        }
      };

      const onError = () => {
        fatalWorkerError = true;
      };

      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);
      worker.addEventListener('messageerror', onError);
      detachHandlers.push(() => {
        worker.removeEventListener('message', onMessage);
        worker.removeEventListener('error', onError);
        worker.removeEventListener('messageerror', onError);
      });

      worker.postMessage({
        cmd: 'start',
        runId: engineRunId,
        batchIterations,
        seed: 0.25 + idx * 0.13,
        mode: computeMode,
      });
    });

    const harvestAggregateGflops = (): number | null => {
      let reportedCount = 0;
      let total = 0;
      for (let i = 0; i < numWorkers; i++) {
        if (workerWindowCycleMs[i] > 0 && workerWindowOps[i] > 0) {
          workerLatestGflops[i] =
            (workerWindowOps[i] / (workerWindowCycleMs[i] / 1000)) / 1e9;
          workerWindowOps[i] = 0;
          workerWindowCycleMs[i] = 0;
        }
        if (workerHasReported[i] === 1) {
          reportedCount += 1;
          total += workerLatestGflops[i];
        }
      }
      if (reportedCount === 0) return null;
      return total;
    };

    // Phase 3: Warm-up until multi-core throughput stabilizes (< 5% delta) or 1500ms ceiling
    callbacks.onPhaseChange('warmup');
    const warmupDeadline = performance.now() + WARMUP_MAX_MS;
    let prevWarmupGflops: number | null = null;
    while (performance.now() < warmupDeadline) {
      await sleep(WARMUP_SAMPLE_INTERVAL_MS);
      if (fatalWorkerError) {
        callbacks.onError('worker');
        return;
      }
      if (isCancelled() || isStopRequested()) return;

      let readyCount = 0;
      for (let i = 0; i < numWorkers; i++) {
        if (workerHasReported[i] === 1) readyCount += 1;
      }
      if (readyCount < numWorkers) continue;

      const currentGflops = harvestAggregateGflops();
      if (currentGflops === null || currentGflops <= 0) continue;

      if (
        prevWarmupGflops !== null &&
        prevWarmupGflops > 0 &&
        Math.abs(currentGflops - prevWarmupGflops) / prevWarmupGflops < WARMUP_STABLE_THRESHOLD
      ) {
        break;
      }
      prevWarmupGflops = currentGflops;
    }

    if (fatalWorkerError) {
      callbacks.onError('worker');
      return;
    }
    if (isCancelled() || isStopRequested()) return;

    harvestAggregateGflops();

    // Phase 4: Active Sampling Loop (250ms cadence, P95 peak + trailing 25% median sustained)
    callbacks.onPhaseChange('running');
    const samples: number[] = [];

    while (!isCancelled() && !isStopRequested()) {
      await sleep(SAMPLE_INTERVAL_MS);
      if (fatalWorkerError) {
        callbacks.onError('worker');
        return;
      }
      if (isCancelled() || isStopRequested()) break;

      const gflopsVal = harvestAggregateGflops();
      if (gflopsVal !== null && gflopsVal > 0 && Number.isFinite(gflopsVal)) {
        samples.push(gflopsVal);
        if (samples.length > SAMPLE_WINDOW) samples.shift();

        const tailStart = Math.max(
          0,
          samples.length - Math.max(1, Math.floor(samples.length * 0.25)),
        );
        const peak = percentileOf(samples, 0.95);
        const sustained = medianOf(samples.slice(tailStart));
        callbacks.onSample(gflopsVal, peak, sustained);
      }
    }
  } finally {
    cleanup();
  }
};
