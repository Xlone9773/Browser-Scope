import type { GPUBuffer, GPUComputePipeline, GPUDevice } from '../../../types/browser';
import { medianOf, percentileOf } from '../metrics';
import { flopsPerInvocation, pipelineCacheKey, type MemoryMode, type WorkloadType } from '../flops';
import { verifyGemmCorrectness } from '../gemmVerification';

export type RunPhase = 'idle' | 'calibrating' | 'verifying' | 'warmup' | 'running';

export interface WebGpuBenchmarkSettings {
  matrixSize: number;
  workloadType: WorkloadType;
  memoryMode: MemoryMode;
  isF16: boolean;
}

export interface WebGpuBenchmarkCallbacks {
  onPhaseChange: (phase: RunPhase) => void;
  onVerification: (status: 'passed' | 'failed' | 'skipped') => void;
  onSample: (gflops: number, peak: number, sustained: number) => void;
  onBuffersCreated: (buffers: GPUBuffer[]) => void;
  onError: (kind: 'verification' | 'setup') => void;
}

const TARGET_BATCH_MS = 50;
const MAX_BATCH_SIZE = 4000;
const WARMUP_MAX_MS = 1500;
const WARMUP_STABLE_THRESHOLD = 0.05;
const SAMPLE_WINDOW = 300;

// WGSL storage struct is `{ size: vec2<f32>, numbers: array<f32> }`. vec2<f32>
// has an 8-byte size/align, so `numbers` starts at byte offset 8 (2 floats) —
// this header must match exactly, otherwise every element the shader reads
// is shifted.
const createMatrixBuffer = (device: GPUDevice, matrixSize: number, arr: Float32Array, usage: number): GPUBuffer => {
  const header = new Float32Array([matrixSize, matrixSize]);
  const buffer = device.createBuffer({
    size: header.byteLength + arr.byteLength,
    usage,
    mappedAtCreation: true,
  });
  const dst = new ArrayBuffer(buffer.size);
  new Float32Array(dst).set(header);
  new Float32Array(dst, header.byteLength).set(arr);
  new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(dst));
  buffer.unmap();
  return buffer;
};

// Runs a full GEMM/ALU-SIMD benchmark pass on WebGPU: correctness
// verification (GEMM only), buffer setup, dispatch calibration, warm-up, and
// a continuous sampling loop that reports batches via `callbacks.onSample`
// until `isCancelled()` returns true. Resolves once the loop has stopped.
//
// `isCancelled` is checked after every await point so a Stop (or a rapid
// Stop+Start, which bumps the caller's run id) can never let a stale batch
// touch buffers the caller has already destroyed.
export const runWebGpuBenchmark = async (
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  settings: WebGpuBenchmarkSettings,
  verifiedKeys: Map<string, boolean>,
  isCancelled: () => boolean,
  isStopRequested: () => boolean,
  callbacks: WebGpuBenchmarkCallbacks,
): Promise<void> => {
  const { matrixSize, workloadType, memoryMode, isF16 } = settings;

  // Correctness verification: GEMM has a well-defined mathematical result,
  // so a broken shader or buffer layout can be caught before it produces a
  // plausible-looking but meaningless GFLOPS number. ALU SIMD is pure
  // arithmetic busywork with no ground truth to check against.
  if (workloadType === 'gemm') {
    const verifyKey = pipelineCacheKey(workloadType, memoryMode, isF16);
    if (!verifiedKeys.has(verifyKey)) {
      callbacks.onPhaseChange('verifying');
      const passed = await verifyGemmCorrectness(device, pipeline, isF16);
      if (isCancelled()) return;
      verifiedKeys.set(verifyKey, passed);
    }
    const passed = verifiedKeys.get(verifyKey) ?? false;
    callbacks.onVerification(passed ? 'passed' : 'failed');
    if (!passed) {
      console.error('GEMM correctness verification failed for', verifyKey);
      callbacks.onError('verification');
      return;
    }
  } else {
    callbacks.onVerification('skipped');
  }

  const firstMatrix = new Float32Array(Array(matrixSize * matrixSize).fill(0).map(() => Math.random()));
  const secondMatrix = new Float32Array(Array(matrixSize * matrixSize).fill(0).map(() => Math.random()));
  const USAGE_STORAGE = window.GPUBufferUsage?.STORAGE || 128;

  device.pushErrorScope('validation');
  const gpuBufferFirstMatrix = createMatrixBuffer(device, matrixSize, firstMatrix, USAGE_STORAGE);
  const gpuBufferSecondMatrix = createMatrixBuffer(device, matrixSize, secondMatrix, USAGE_STORAGE);
  const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix.length);
  const resultMatrixBuffer = device.createBuffer({ size: resultMatrixBufferSize, usage: USAGE_STORAGE });
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: gpuBufferFirstMatrix } },
      { binding: 1, resource: { buffer: gpuBufferSecondMatrix } },
      { binding: 2, resource: { buffer: resultMatrixBuffer } },
    ],
  });
  callbacks.onBuffersCreated([gpuBufferFirstMatrix, gpuBufferSecondMatrix, resultMatrixBuffer]);

  const setupError = await device.popErrorScope();
  if (isCancelled()) return;
  if (setupError) {
    console.error('WebGPU buffer/bind group validation error', setupError.message);
    callbacks.onError('setup');
    return;
  }

  const workgroupCount = Math.ceil(matrixSize / 8);
  const opsPerDispatch = flopsPerInvocation(workloadType, matrixSize) * matrixSize * matrixSize;

  // Encodes `dispatches` dispatchWorkgroups calls into a single pass and
  // command buffer. WebGPU guarantees dispatches within one pass execute in
  // encoded order with each seeing prior writes, so it's safe to run the
  // whole batch against the same buffers before reading back a single
  // wall-clock measurement for the batch.
  const runBatch = async (dispatches: number): Promise<number> => {
    const t0 = performance.now();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    for (let i = 0; i < dispatches; i++) {
      passEncoder.dispatchWorkgroups(workgroupCount, workgroupCount);
    }
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
    await device.queue.onSubmittedWorkDone();
    return performance.now() - t0;
  };

  // Calibrate: time a single dispatch and size batches around ~50ms of GPU
  // work each. This decouples measurement from the display refresh rate
  // entirely — a naive one-dispatch-per-requestAnimationFrame loop caps
  // every workload's GFLOPS at whatever a single dispatch can do inside one
  // frame budget (~16ms at 60Hz), regardless of how much GPU headroom there is.
  callbacks.onPhaseChange('calibrating');
  const singleDispatchMs = await runBatch(1);
  if (isCancelled()) return;
  const batchSize = Math.max(1, Math.min(MAX_BATCH_SIZE, Math.round(TARGET_BATCH_MS / Math.max(singleDispatchMs, 0.05))));

  // Warm-up: GPUs run below their steady-state clock for the first few
  // hundred milliseconds (DVFS ramp-up, shader compilation finishing on
  // first dispatch). Discard samples until throughput stops improving, up to
  // a hard cap so a noisy first reading can't stall the test indefinitely.
  callbacks.onPhaseChange('warmup');
  const warmupDeadline = performance.now() + WARMUP_MAX_MS;
  let previousWarmupGflops: number | null = null;
  while (performance.now() < warmupDeadline) {
    if (isCancelled()) return;
    const warmupMs = await runBatch(batchSize);
    if (isCancelled()) return;
    const warmupGflops = (opsPerDispatch * batchSize / (warmupMs / 1000)) / 1e9;
    if (previousWarmupGflops !== null && Math.abs(warmupGflops - previousWarmupGflops) / previousWarmupGflops < WARMUP_STABLE_THRESHOLD) {
      break;
    }
    previousWarmupGflops = warmupGflops;
  }
  if (isCancelled()) return;

  callbacks.onPhaseChange('running');
  const samples: number[] = [];

  while (!isStopRequested() && !isCancelled()) {
    const batchMs = await runBatch(batchSize);
    // Re-check after the await: Stop (or Stop+Start) may have run while this
    // batch was in flight, in which case the buffers this closure
    // references may already be destroyed.
    if (isStopRequested() || isCancelled()) break;

    const gflopsVal = (opsPerDispatch * batchSize / (batchMs / 1000)) / 1e9;
    samples.push(gflopsVal);
    if (samples.length > SAMPLE_WINDOW) samples.shift();
    const tailStart = Math.max(0, samples.length - Math.max(1, Math.floor(samples.length * 0.25)));

    // Peak is the 95th percentile of the rolling sample window rather than
    // an all-time max, so a single early outlier can't pin an unrealistic
    // ceiling for the rest of the run.
    callbacks.onSample(gflopsVal, percentileOf(samples, 0.95), medianOf(samples.slice(tailStart)));
  }
};
