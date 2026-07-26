import type { GPUDevice, GPUComputePipeline } from '../../types/browser';
import { getErrorMessage } from '../../utils/error';

export const VERIFY_MATRIX_SIZE = 20;

const computeReferenceGemm = (a: Float32Array, b: Float32Array, n: number): Float32Array => {
  const result = new Float32Array(n * n);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += a[row * n + k] * b[k * n + col];
      }
      result[row * n + col] = sum;
    }
  }
  return result;
};

// Runs a small GEMM dispatch through the given (already-compiled) pipeline
// and compares the readback against a CPU reference implementation. This is
// the only way to know the shader is actually computing the advertised
// workload rather than silently producing garbage (e.g. from a buffer layout
// mismatch) while still reporting a plausible-looking GFLOPS number.
export const verifyGemmCorrectness = async (device: GPUDevice, pipeline: GPUComputePipeline, isF16: boolean): Promise<boolean> => {
  const n = VERIFY_MATRIX_SIZE;
  const a = new Float32Array(n * n).map(() => Math.random());
  const b = new Float32Array(n * n).map(() => Math.random());
  const expected = computeReferenceGemm(a, b, n);

  const USAGE_STORAGE = window.GPUBufferUsage?.STORAGE || 128;
  const USAGE_COPY_SRC = window.GPUBufferUsage?.COPY_SRC || 4;
  const USAGE_COPY_DST = window.GPUBufferUsage?.COPY_DST || 8;
  const USAGE_MAP_READ = window.GPUBufferUsage?.MAP_READ || 1;
  const MAP_MODE_READ = window.GPUMapMode?.READ || 1;

  const makeInputBuffer = (arr: Float32Array) => {
    // Header matches the WGSL storage struct layout: vec2<f32> size (8
    // bytes) followed immediately by the data array.
    const header = new Float32Array([n, n]);
    const buffer = device.createBuffer({
      size: header.byteLength + arr.byteLength,
      usage: USAGE_STORAGE,
      mappedAtCreation: true,
    });
    const dst = new ArrayBuffer(buffer.size);
    new Float32Array(dst).set(header);
    new Float32Array(dst, header.byteLength).set(arr);
    new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(dst));
    buffer.unmap();
    return buffer;
  };

  const bufferA = makeInputBuffer(a);
  const bufferB = makeInputBuffer(b);
  const resultSize = Float32Array.BYTES_PER_ELEMENT * (2 + n * n);
  const resultBuffer = device.createBuffer({ size: resultSize, usage: USAGE_STORAGE | USAGE_COPY_SRC });
  const stagingBuffer = device.createBuffer({ size: resultSize, usage: USAGE_COPY_DST | USAGE_MAP_READ });

  try {
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: bufferA } },
        { binding: 1, resource: { buffer: bufferB } },
        { binding: 2, resource: { buffer: resultBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    const wgCount = Math.ceil(n / 8);
    pass.dispatchWorkgroups(wgCount, wgCount);
    pass.end();
    encoder.copyBufferToBuffer(resultBuffer, 0, stagingBuffer, 0, resultSize);
    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();

    await stagingBuffer.mapAsync(MAP_MODE_READ);
    const actual = new Float32Array(stagingBuffer.getMappedRange(8));

    // fp16 accumulates ~20 terms in half precision, so it needs a much
    // looser tolerance than fp32 to avoid flagging legitimate rounding
    // as a correctness failure.
    const tolerance = isF16 ? 0.08 : 0.01;
    let ok = true;
    for (let i = 0; i < expected.length; i++) {
      const diff = Math.abs(actual[i] - expected[i]);
      const allowed = tolerance * (1 + Math.abs(expected[i]));
      if (diff > allowed) {
        ok = false;
        break;
      }
    }
    stagingBuffer.unmap();
    return ok;
  } catch (e: unknown) {
    console.error('GEMM correctness verification failed', getErrorMessage(e));
    return false;
  } finally {
    bufferA.destroy();
    bufferB.destroy();
    resultBuffer.destroy();
    stagingBuffer.destroy();
  }
};
