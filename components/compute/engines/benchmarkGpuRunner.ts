import {
  type TimingSource,
  type WebGlTimerContext,
  detectTimingCapability,
  downgradeTimingCapability,
  measureWebGlBatch,
} from '../webgl/webglTimer';

export interface GpuBenchmarkIterationResult {
  score: number;
  details: string;
  mode: 'webgl' | '2d-fallback';
  timingSource: TimingSource | '2d-sync';
  durationMs: number;
  checksum: number;
}

const BENCHMARK_WIDTH = 256;
const BENCHMARK_HEIGHT = 256;
const PRIMITIVE_BATCH_COUNT = 500;
const WARMUP_PRIMITIVE_COUNT = 64;
const DRAW_PASSES = 3;
const GPU_BENCHMARK_MULTIPLIER = 2_000_000;

const BENCH_VS = `
attribute vec2 a_pos;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  v_color = a_color;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const BENCH_FS = `
precision mediump float;
varying vec3 v_color;
uniform float u_pass;

void main() {
  vec3 c = abs(vec3(
    v_color.r + u_pass * 0.05,
    v_color.g * 0.85 + 0.1,
    v_color.b * 0.75 + u_pass * 0.03
  ));
  gl_FragColor = vec4(fract(c), 0.65);
}
`;

/**
 * Generates deterministic interleaved vertex geometry (x, y, r, g, b) before
 * timing starts so JS PRNG overhead never contaminates GPU render measurements.
 */
export const buildDeterministicTriangleVertices = (triangleCount: number): Float32Array => {
  const floatsPerVertex = 5;
  const verticesPerTriangle = 3;
  const data = new Float32Array(triangleCount * verticesPerTriangle * floatsPerVertex);

  let state = 0x12345678;
  const nextUnit = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };

  for (let i = 0; i < triangleCount; i++) {
    const cx = nextUnit() * 1.6 - 0.8;
    const cy = nextUnit() * 1.6 - 0.8;
    const size = 0.025 + nextUnit() * 0.045;
    const r = 0.2 + nextUnit() * 0.8;
    const g = 0.2 + nextUnit() * 0.8;
    const b = 0.2 + nextUnit() * 0.8;

    const base = i * verticesPerTriangle * floatsPerVertex;
    // v0
    data[base] = cx;
    data[base + 1] = cy + size;
    data[base + 2] = r;
    data[base + 3] = g;
    data[base + 4] = b;
    // v1
    data[base + 5] = cx - size;
    data[base + 6] = cy - size;
    data[base + 7] = g;
    data[base + 8] = b;
    data[base + 9] = r;
    // v2
    data[base + 10] = cx + size;
    data[base + 11] = cy - size;
    data[base + 12] = b;
    data[base + 13] = r;
    data[base + 14] = g;
  }
  return data;
};

const compileBenchShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const run2DFallbackIteration = (): GpuBenchmarkIterationResult => {
  const warmCanvas = document.createElement('canvas');
  warmCanvas.width = 64;
  warmCanvas.height = 64;
  const warmCtx = warmCanvas.getContext('2d');
  if (warmCtx) {
    for (let i = 0; i < 40; i++) {
      warmCtx.fillStyle = `rgb(${(i * 19) % 255}, ${(i * 37) % 255}, 180)`;
      warmCtx.fillRect((i * 7) % 48, (i * 11) % 48, 12, 12);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = BENCHMARK_WIDTH;
  canvas.height = BENCHMARK_HEIGHT;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!ctx) {
    throw new Error('2D Canvas context unavailable');
  }

  // Deterministic coordinates precomputed before timer starts
  const rects = PRIMITIVE_BATCH_COUNT;
  const coords = new Float32Array(rects * 2);
  for (let i = 0; i < rects; i++) {
    coords[i * 2] = ((i * 73) % 460);
    coords[i * 2 + 1] = ((i * 137) % 460);
  }

  const start = performance.now();
  for (let i = 0; i < rects; i++) {
    ctx.fillStyle = `rgba(${i % 255},${(i * 5) % 255},${(i * 11) % 255},0.5)`;
    ctx.fillRect(coords[i * 2], coords[i * 2 + 1], 52, 52);
  }
  // Force 2D rasterization drain via tiny pixel readback
  const sample = ctx.getImageData(BENCHMARK_WIDTH / 2 - 2, BENCHMARK_HEIGHT / 2 - 2, 4, 4);
  const durationMs = Math.max(performance.now() - start, 1);

  let checksum = 0;
  for (let i = 0; i < sample.data.length; i += 4) {
    checksum = (checksum + sample.data[i] + sample.data[i + 1] + sample.data[i + 2]) & 0xffff;
  }

  const score = Math.floor(GPU_BENCHMARK_MULTIPLIER / durationMs);
  const kPrimitivesPerSec = (rects / (durationMs / 1000) / 1000).toFixed(1);
  return {
    score,
    details: `${kPrimitivesPerSec}K rects/s · 2D Sync (${durationMs.toFixed(1)}ms, chk: ${checksum.toString(16)})`,
    mode: '2d-fallback',
    timingSource: '2d-sync',
    durationMs,
    checksum,
  };
};

export const runGpuBenchmarkIteration = async (
  isCancelled: () => boolean = () => false
): Promise<GpuBenchmarkIterationResult> => {
  const canvas = document.createElement('canvas');
  canvas.width = BENCHMARK_WIDTH;
  canvas.height = BENCHMARK_HEIGHT;

  const attrs: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  };

  let isWebGL2 = true;
  let gl = canvas.getContext('webgl2', attrs) as WebGLRenderingContext | null;
  if (!gl) {
    isWebGL2 = false;
    gl = (canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs)) as WebGLRenderingContext | null;
  }

  if (!gl) {
    return run2DFallbackIteration();
  }

  const activeGl = gl;
  let program: WebGLProgram | null = null;
  let vbo: WebGLBuffer | null = null;
  const vertices = buildDeterministicTriangleVertices(PRIMITIVE_BATCH_COUNT);

  try {
    const vs = compileBenchShader(activeGl, activeGl.VERTEX_SHADER, BENCH_VS);
    const fs = compileBenchShader(activeGl, activeGl.FRAGMENT_SHADER, BENCH_FS);
    if (!vs || !fs) {
      if (vs) activeGl.deleteShader(vs);
      if (fs) activeGl.deleteShader(fs);
      return run2DFallbackIteration();
    }

    program = activeGl.createProgram();
    if (!program) {
      activeGl.deleteShader(vs);
      activeGl.deleteShader(fs);
      return run2DFallbackIteration();
    }

    activeGl.attachShader(program, vs);
    activeGl.attachShader(program, fs);
    activeGl.linkProgram(program);
    activeGl.deleteShader(vs);
    activeGl.deleteShader(fs);

    if (!activeGl.getProgramParameter(program, activeGl.LINK_STATUS)) {
      return run2DFallbackIteration();
    }

    vbo = activeGl.createBuffer();
    if (!vbo) {
      return run2DFallbackIteration();
    }

    activeGl.bindBuffer(activeGl.ARRAY_BUFFER, vbo);
    activeGl.bufferData(activeGl.ARRAY_BUFFER, vertices, activeGl.STATIC_DRAW);

    const posLoc = activeGl.getAttribLocation(program, 'a_pos');
    const colLoc = activeGl.getAttribLocation(program, 'a_color');
    const passLoc = activeGl.getUniformLocation(program, 'u_pass');

    activeGl.viewport(0, 0, BENCHMARK_WIDTH, BENCHMARK_HEIGHT);
    activeGl.enable(activeGl.BLEND);
    activeGl.blendFunc(activeGl.SRC_ALPHA, activeGl.ONE_MINUS_SRC_ALPHA);
    activeGl.useProgram(program);

    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    if (posLoc >= 0) {
      activeGl.enableVertexAttribArray(posLoc);
      activeGl.vertexAttribPointer(posLoc, 2, activeGl.FLOAT, false, stride, 0);
    }
    if (colLoc >= 0) {
      activeGl.enableVertexAttribArray(colLoc);
      activeGl.vertexAttribPointer(
        colLoc,
        3,
        activeGl.FLOAT,
        false,
        stride,
        2 * Float32Array.BYTES_PER_ELEMENT
      );
    }

    const timerGl = activeGl as unknown as WebGlTimerContext;
    let capability = detectTimingCapability(timerGl, isWebGL2);

    // Warm-up pass (eliminates first-draw JIT/driver compilation bias and validates GPU timer availability)
    const warmupVerts = Math.min(PRIMITIVE_BATCH_COUNT, WARMUP_PRIMITIVE_COUNT) * 3;
    const runWarmupDraw = () => {
      activeGl.clearColor(0.05, 0.05, 0.08, 1.0);
      activeGl.clear(activeGl.COLOR_BUFFER_BIT);
      if (passLoc) activeGl.uniform1f(passLoc, 0.0);
      activeGl.drawArrays(activeGl.TRIANGLES, 0, warmupVerts);
    };

    if (capability.source === 'gpu-timer') {
      const probeRes = await measureWebGlBatch(
        timerGl,
        capability,
        runWarmupDraw,
        isCancelled,
        new Uint8Array(4),
        80
      );
      if (probeRes.timedOut || probeRes.disjoint || probeRes.source !== capability.source) {
        capability = downgradeTimingCapability(capability, timerGl);
      }
    } else {
      runWarmupDraw();
    }

    const warmPixel = new Uint8Array(4);
    activeGl.readPixels(0, 0, 1, 1, activeGl.RGBA, activeGl.UNSIGNED_BYTE, warmPixel);

    if (isCancelled()) {
      return {
        score: 0,
        details: 'Cancelled',
        mode: 'webgl',
        timingSource: capability.source,
        durationMs: 0,
        checksum: 0,
      };
    }

    const executeRenderPasses = () => {
      activeGl.clear(activeGl.COLOR_BUFFER_BIT);
      for (let p = 0; p < DRAW_PASSES; p++) {
        if (passLoc) activeGl.uniform1f(passLoc, p + 1);
        activeGl.drawArrays(activeGl.TRIANGLES, 0, PRIMITIVE_BATCH_COUNT * 3);
      }
    };

    let measureRes = await measureWebGlBatch(
      timerGl,
      capability,
      executeRenderPasses,
      isCancelled,
      new Uint8Array(4)
    );

    if ((measureRes.disjoint || measureRes.timedOut || measureRes.source !== capability.source) && !isCancelled()) {
      capability = downgradeTimingCapability(capability, timerGl);
      measureRes = await measureWebGlBatch(
        timerGl,
        capability,
        executeRenderPasses,
        isCancelled,
        new Uint8Array(4)
      );
    }

    if (isCancelled()) {
      return {
        score: 0,
        details: 'Cancelled',
        mode: 'webgl',
        timingSource: measureRes.source,
        durationMs: 0,
        checksum: 0,
      };
    }

    // Read a 4x4 center patch to compute deterministic checksum and prevent DCE
    const patch = new Uint8Array(4 * 4 * 4);
    activeGl.readPixels(
      Math.floor(BENCHMARK_WIDTH / 2) - 2,
      Math.floor(BENCHMARK_HEIGHT / 2) - 2,
      4,
      4,
      activeGl.RGBA,
      activeGl.UNSIGNED_BYTE,
      patch
    );

    let checksum = 0;
    for (let i = 0; i < patch.length; i += 4) {
      checksum = (checksum + patch[i] + patch[i + 1] + patch[i + 2] + patch[i + 3]) & 0xffff;
    }

    const durationMs = Math.max(measureRes.durationMs, 0.2);
    const totalTriangles = PRIMITIVE_BATCH_COUNT * DRAW_PASSES;
    const trisPerSec = totalTriangles / (durationMs / 1000);
    const rateLabel =
      trisPerSec >= 100_000
        ? `${(trisPerSec / 1e6).toFixed(2)}M tris/s`
        : `${(trisPerSec / 1e3).toFixed(1)}K tris/s`;
    const score = Math.floor(GPU_BENCHMARK_MULTIPLIER / durationMs);
    const timingTag =
      measureRes.source === 'gpu-timer'
        ? 'GPU Timer'
        : measureRes.source === 'fence-sync'
          ? 'Fence Sync'
          : 'Readback Sync';

    return {
      score,
      details: `${rateLabel} · ${timingTag} (${durationMs.toFixed(1)}ms, chk: ${checksum.toString(16)})`,
      mode: 'webgl',
      timingSource: measureRes.source,
      durationMs,
      checksum,
    };
  } finally {
    if (!activeGl.isContextLost()) {
      if (vbo) activeGl.deleteBuffer(vbo);
      if (program) activeGl.deleteProgram(program);
      const loseExt = activeGl.getExtension('WEBGL_lose_context') as { loseContext?: () => void } | null;
      loseExt?.loseContext?.();
    }
  }
};
