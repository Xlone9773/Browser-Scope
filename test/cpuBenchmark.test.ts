import { describe, it, expect, vi } from 'vitest';
import { runCpuBenchmark, type CpuWorkerLike } from '../components/compute/engines/cpuBenchmark';
import {
  computeCpuOpsForBatch,
  executeCpuAluKernel,
  type CpuComputeMode,
} from '../components/compute/cpu/cpuFlops';
import type {
  CpuWorkerInboundMessage,
  CpuWorkerOutboundMessage,
} from '../components/compute/workers/cpuStress.worker';

interface MockWorkerOptions {
  mode?: CpuComputeMode;
  corruptVerify?: boolean;
  emitWorkerErrorOnStart?: boolean;
  batchMs?: number;
}

const createMockCpuWorkerFactory = (opts: MockWorkerOptions = {}) => {
  const createdWorkers: Array<{ terminated: boolean; stopped: boolean }> = [];
  const workerMode: CpuComputeMode = opts.mode ?? 'wasm-simd';

  const createWorker = (): CpuWorkerLike => {
    const state = { terminated: false, stopped: false };
    createdWorkers.push(state);
    const listeners = new Map<string, Set<(ev: Event) => void>>();
    let runningTimer: ReturnType<typeof setTimeout> | null = null;

    const emit = (type: 'message' | 'error' | 'messageerror', data?: CpuWorkerOutboundMessage) => {
      const ev = (data !== undefined ? { data } : {}) as Event;
      listeners.get(type)?.forEach((fn) => fn(ev));
    };

    return {
      postMessage: (msg: CpuWorkerInboundMessage) => {
        if (state.terminated) return;

        if (msg.cmd === 'stop') {
          state.stopped = true;
          if (runningTimer) {
            clearTimeout(runningTimer);
            runningTimer = null;
          }
          return;
        }

        if (msg.cmd === 'verify') {
          setTimeout(() => {
            if (state.terminated) return;
            const res = executeCpuAluKernel(msg.iterations, msg.seed, workerMode);
            emit('message', {
              type: 'verified',
              runId: msg.runId,
              mode: res.mode,
              lanesSum: opts.corruptVerify ? 0 : res.lanesSum,
              digest: opts.corruptVerify ? 0 : res.digest,
              durationMs: 1.5,
            });
          }, 2);
          return;
        }

        if (msg.cmd === 'calibrate') {
          setTimeout(() => {
            if (state.terminated) return;
            emit('message', {
              type: 'calibrated',
              runId: msg.runId,
              mode: workerMode,
              batchIterations: 300_000,
              probeIterations: 100_000,
              durationMs: 20,
              digest: 1234,
            });
          }, 2);
          return;
        }

        if (msg.cmd === 'start') {
          if (opts.emitWorkerErrorOnStart) {
            setTimeout(() => emit('error'), 5);
            return;
          }

          const startMode = msg.mode ?? workerMode;
          const stepMs = opts.batchMs ?? 12;
          const tick = () => {
            if (state.terminated || state.stopped) return;
            emit('message', {
              type: 'progress',
              runId: msg.runId,
              mode: startMode,
              ops: computeCpuOpsForBatch(msg.batchIterations, startMode),
              workDurationMs: 50,
              cycleDurationMs: 50,
              lanesSum: 1.23,
              digest: 456,
            });
            runningTimer = setTimeout(tick, stepMs);
          };
          runningTimer = setTimeout(tick, stepMs);
        }
      },
      terminate: () => {
        state.terminated = true;
        if (runningTimer) {
          clearTimeout(runningTimer);
          runningTimer = null;
        }
      },
      addEventListener: (type, listener) => {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(listener);
      },
      removeEventListener: (type, listener) => {
        listeners.get(type)?.delete(listener);
      },
    };
  };

  return { createWorker, createdWorkers };
};

describe('Multi-core CPU Benchmark Engine', () => {
  it('executes verifying -> calibrating -> warmup -> running lifecycle in wasm-simd mode, aggregates workers cleanly, and terminates pool on stop', async () => {
    const { createWorker, createdWorkers } = createMockCpuWorkerFactory({ mode: 'wasm-simd' });
    const phases: string[] = [];
    const onVerification = vi.fn();
    const onWorkersReady = vi.fn();
    const onError = vi.fn();
    let sampleCount = 0;
    let stop = false;

    await runCpuBenchmark(
      { matrixSize: 512, logicalCores: 8, createWorker },
      () => false,
      () => stop,
      {
        onPhaseChange: (p) => phases.push(p),
        onVerification,
        onWorkersReady,
        onSample: (gflops, peak, sustained) => {
          sampleCount++;
          expect(gflops).toBeGreaterThan(0);
          expect(peak).toBeGreaterThan(0);
          expect(sustained).toBeGreaterThan(0);
          if (sampleCount >= 2) stop = true;
        },
        onError,
      },
    );

    expect(phases).toEqual(['verifying', 'calibrating', 'warmup', 'running']);
    expect(onVerification).toHaveBeenCalledWith('passed');
    expect(onWorkersReady).toHaveBeenCalledWith({
      activeWorkers: 4,
      batchIterations: 300_000,
      computeMode: 'wasm-simd',
    });
    expect(onError).not.toHaveBeenCalled();
    expect(createdWorkers).toHaveLength(4);
    expect(createdWorkers.every((w) => w.terminated)).toBe(true);
  });

  it('supports scalar-js fallback workers cleanly through full lifecycle', async () => {
    const { createWorker, createdWorkers } = createMockCpuWorkerFactory({ mode: 'scalar-js' });
    const onWorkersReady = vi.fn();
    const onVerification = vi.fn();
    let stop = false;
    let samples = 0;

    await runCpuBenchmark(
      { matrixSize: 2048, logicalCores: 4, createWorker },
      () => false,
      () => stop,
      {
        onPhaseChange: vi.fn(),
        onVerification,
        onWorkersReady,
        onSample: () => {
          samples++;
          if (samples >= 1) stop = true;
        },
        onError: vi.fn(),
      },
    );

    expect(onVerification).toHaveBeenCalledWith('passed');
    expect(onWorkersReady).toHaveBeenCalledWith({
      activeWorkers: 4,
      batchIterations: 300_000,
      computeMode: 'scalar-js',
    });
    expect(createdWorkers.every((w) => w.terminated)).toBe(true);
  });

  it('aborts cleanly during verification phase when worker arithmetic output mismatches reference', async () => {
    const { createWorker, createdWorkers } = createMockCpuWorkerFactory({ corruptVerify: true });
    const onVerification = vi.fn();
    const onError = vi.fn();
    const onSample = vi.fn();

    await runCpuBenchmark(
      { matrixSize: 256, logicalCores: 4, createWorker },
      () => false,
      () => false,
      {
        onPhaseChange: vi.fn(),
        onVerification,
        onWorkersReady: vi.fn(),
        onSample,
        onError,
      },
    );

    expect(onVerification).toHaveBeenCalledWith('failed');
    expect(onError).toHaveBeenCalledWith('verification');
    expect(onSample).not.toHaveBeenCalled();
    expect(createdWorkers.every((w) => w.terminated)).toBe(true);
  });

  it('reports worker error and releases pool if a worker crashes mid-run', async () => {
    const { createWorker, createdWorkers } = createMockCpuWorkerFactory({
      emitWorkerErrorOnStart: true,
    });
    const onError = vi.fn();

    await runCpuBenchmark(
      { matrixSize: 256, logicalCores: 4, createWorker },
      () => false,
      () => false,
      {
        onPhaseChange: vi.fn(),
        onVerification: vi.fn(),
        onWorkersReady: vi.fn(),
        onSample: vi.fn(),
        onError,
      },
    );

    expect(onError).toHaveBeenCalledWith('worker');
    expect(createdWorkers.every((w) => w.terminated)).toBe(true);
  });

  it('stops cleanly without errors when cancelled during calibrating phase', async () => {
    const { createWorker, createdWorkers } = createMockCpuWorkerFactory();
    let cancelled = false;
    const onError = vi.fn();
    const onSample = vi.fn();

    await runCpuBenchmark(
      { matrixSize: 1024, logicalCores: 4, createWorker },
      () => cancelled,
      () => false,
      {
        onPhaseChange: (p) => {
          if (p === 'calibrating') {
            cancelled = true;
          }
        },
        onVerification: vi.fn(),
        onWorkersReady: vi.fn(),
        onSample,
        onError,
      },
    );

    expect(onSample).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(createdWorkers.every((w) => w.terminated)).toBe(true);
  });
});
