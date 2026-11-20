import {
  computeAdaptiveCpuBatchIterations,
  executeCpuAluKernel,
  type CpuComputeMode,
} from '../cpu/cpuFlops';
import { getWasmSimdRunner } from '../cpu/wasmSimdKernel';

export type CpuWorkerInboundMessage =
  | { cmd: 'verify'; runId: number; iterations: number; seed: number }
  | { cmd: 'calibrate'; runId: number; targetBatchMs?: number; seed: number }
  | { cmd: 'start'; runId: number; batchIterations: number; seed: number; mode?: CpuComputeMode }
  | { cmd: 'stop'; runId?: number };

export type CpuWorkerOutboundMessage =
  | {
      type: 'verified';
      runId: number;
      mode: CpuComputeMode;
      lanesSum: number;
      digest: number;
      durationMs: number;
    }
  | {
      type: 'calibrated';
      runId: number;
      mode: CpuComputeMode;
      batchIterations: number;
      probeIterations: number;
      durationMs: number;
      digest: number;
    }
  | {
      type: 'progress';
      runId: number;
      mode: CpuComputeMode;
      ops: number;
      workDurationMs: number;
      cycleDurationMs: number;
      lanesSum: number;
      digest: number;
    }
  | {
      type: 'error';
      runId: number;
      message: string;
    };

let isRunning = false;
let activeRunId = 0;
let activeMode: CpuComputeMode = 'scalar-js';
let activeBatchIterations = 100_000;
let batchSeed = 1.0;
let lastBatchEndMs = 0;

// Use MessageChannel to yield cleanly between ~60ms calibrated batches without
// triggering the browser's 4ms nested setTimeout clamping penalty.
const yieldChannel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
let pendingYieldToken = 0;

const detectWorkerMode = (): CpuComputeMode => (getWasmSimdRunner() ? 'wasm-simd' : 'scalar-js');

const scheduleNextBatch = (token: number) => {
  if (yieldChannel) {
    yieldChannel.port1.postMessage(token);
  } else {
    setTimeout(() => onYieldTick(token), 0);
  }
};

function runBatch(scheduledToken: number) {
  if (!isRunning || scheduledToken !== pendingYieldToken) return;

  try {
    const t0 = performance.now();
    const res = executeCpuAluKernel(activeBatchIterations, batchSeed, activeMode);
    const t1 = performance.now();

    const workDurationMs = Math.max(t1 - t0, 0.01);
    const cycleDurationMs =
      lastBatchEndMs > 0 ? Math.max(t1 - lastBatchEndMs, workDurationMs) : workDurationMs;
    lastBatchEndMs = t1;

    batchSeed = (batchSeed + 0.0137) % 100;

    const msg: CpuWorkerOutboundMessage = {
      type: 'progress',
      runId: activeRunId,
      mode: res.mode,
      ops: res.ops,
      workDurationMs,
      cycleDurationMs,
      lanesSum: res.lanesSum,
      digest: res.digest,
    };
    self.postMessage(msg);

    if (isRunning && scheduledToken === pendingYieldToken) {
      scheduleNextBatch(scheduledToken);
    }
  } catch (err: unknown) {
    isRunning = false;
    const msg: CpuWorkerOutboundMessage = {
      type: 'error',
      runId: activeRunId,
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(msg);
  }
}

function onYieldTick(token: number) {
  runBatch(token);
}

if (yieldChannel) {
  yieldChannel.port2.onmessage = (ev: MessageEvent<number>) => {
    onYieldTick(ev.data);
  };
}

self.onmessage = (e: MessageEvent<CpuWorkerInboundMessage>) => {
  const data = e.data;
  if (!data || typeof data !== 'object') return;

  try {
    if (data.cmd === 'stop') {
      if (data.runId === undefined || data.runId === activeRunId) {
        isRunning = false;
        pendingYieldToken += 1;
      }
      return;
    }

    if (data.cmd === 'verify') {
      const mode = detectWorkerMode();
      const t0 = performance.now();
      const res = executeCpuAluKernel(data.iterations, data.seed, mode);
      const t1 = performance.now();
      const msg: CpuWorkerOutboundMessage = {
        type: 'verified',
        runId: data.runId,
        mode: res.mode,
        lanesSum: res.lanesSum,
        digest: res.digest,
        durationMs: Math.max(t1 - t0, 0.01),
      };
      self.postMessage(msg);
      return;
    }

    if (data.cmd === 'calibrate') {
      const mode = detectWorkerMode();
      const targetBatchMs = data.targetBatchMs ?? 60;
      // Warm tier-up briefly first so cold interpreter timings cannot skew calibration
      executeCpuAluKernel(50_000, data.seed, mode);

      // Exponentially double probe iterations until elapsed >= 15ms so scaling to
      // targetBatchMs (~60ms) is immune to sub-millisecond clock quantization & cold JIT.
      let probeIters = 100_000;
      let probeDurationMs = 0;
      let lastDigest = 0;
      while (probeIters < 40_000_000) {
        const t0 = performance.now();
        const res = executeCpuAluKernel(probeIters, data.seed, mode);
        probeDurationMs = Math.max(performance.now() - t0, 0.01);
        lastDigest = res.digest;
        if (probeDurationMs >= 15) break;
        probeIters *= 2;
      }

      const batchIterations = computeAdaptiveCpuBatchIterations(
        probeIters,
        probeDurationMs,
        targetBatchMs,
      );

      const msg: CpuWorkerOutboundMessage = {
        type: 'calibrated',
        runId: data.runId,
        mode,
        batchIterations,
        probeIterations: probeIters,
        durationMs: probeDurationMs,
        digest: lastDigest,
      };
      self.postMessage(msg);
      return;
    }

    if (data.cmd === 'start') {
      activeRunId = data.runId;
      activeMode = data.mode ?? detectWorkerMode();
      activeBatchIterations = Math.max(1000, Math.floor(data.batchIterations));
      batchSeed = Number.isFinite(data.seed) ? data.seed : 1.0;
      lastBatchEndMs = 0;
      isRunning = true;
      pendingYieldToken += 1;
      scheduleNextBatch(pendingYieldToken);
    }
  } catch (err: unknown) {
    isRunning = false;
    const msg: CpuWorkerOutboundMessage = {
      type: 'error',
      runId: 'runId' in data && typeof data.runId === 'number' ? data.runId : activeRunId,
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(msg);
  }
};
