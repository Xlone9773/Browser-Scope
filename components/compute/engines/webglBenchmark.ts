import type { RunPhase } from './webgpuBenchmark';
import { medianOf, percentileOf } from '../metrics';
import {
  WEBGL_ALU_FRAGMENT_SHADER,
  WEBGL_ALU_VERTEX_SHADER,
  WEBGL_BLIT_FRAGMENT_SHADER,
  WEBGL_BLIT_VERTEX_SHADER,
  computeAdaptiveBatchSize,
  computeExpectedWebGlPixel,
  computeWebGlGflops,
  computeWebGlOpsPerDraw,
  resolveEffectiveGridSize,
} from '../webgl/webglFlops';
import {
  type TimingCapability,
  type TimingSource,
  type WebGlTimerContext,
  detectTimingCapability,
  downgradeTimingCapability,
  measureWebGlBatch,
} from '../webgl/webglTimer';

export interface WebGlBenchmarkCallbacks {
  onPhaseChange: (phase: RunPhase) => void;
  onVerification: (status: 'passed' | 'failed') => void;
  onCapabilityDetected: (info: { glVersion: 'WebGL 2.0' | 'WebGL 1.0'; timingSource: TimingSource; effectiveGridSize: number }) => void;
  onSample: (gflops: number, peak: number, sustained: number) => void;
  onError: (kind: 'setup' | 'verification' | 'device-lost') => void;
}

export interface WebGlBenchmarkSettings {
  matrixSize: number;
  shouldRenderPreview: () => boolean;
}

const TARGET_BATCH_MS = 50;
const MAX_BATCH_SIZE = 500;
const WARMUP_MAX_MS = 1500;
const WARMUP_STABLE_THRESHOLD = 0.05;
const SAMPLE_WINDOW = 300;
const MAX_CONSECUTIVE_DISJOINTS = 3;

const compileShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('WebGL shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const createProgram = (
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram | null => {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Shaders are no longer needed once linked into the program
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('WebGL program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

export const verifyWebGlAluOutput = (
  gl: WebGLRenderingContext,
  fbo: WebGLFramebuffer,
  width: number,
  height: number,
  drawSingle: (seed: number) => void
): boolean => {
  if (width <= 0 || height <= 0) return false;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, width, height);
  drawSingle(0);

  const samplePoints: Array<[number, number]> = [
    [Math.floor(width * 0.25), Math.floor(height * 0.25)],
    [Math.floor(width * 0.5), Math.floor(height * 0.5)],
    [Math.floor(width * 0.75), Math.floor(height * 0.75)],
  ];

  const pixel = new Uint8Array(4);
  for (const [px, py] of samplePoints) {
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const u = (px + 0.5) / width;
    const v = (py + 0.5) / height;
    const expected = computeExpectedWebGlPixel(u, v, 0);

    // Must be non-empty alpha and close to CPU reference within 8-bit quantization margin
    if (pixel[3] === 0) return false;
    for (let c = 0; c < 3; c++) {
      if (Math.abs(pixel[c] - expected[c]) > 4) {
        return false;
      }
    }
  }
  return true;
};

export const runWebGlBenchmark = async (
  canvas: HTMLCanvasElement,
  settings: WebGlBenchmarkSettings,
  isCancelled: () => boolean,
  isStopRequested: () => boolean,
  callbacks: WebGlBenchmarkCallbacks
): Promise<void> => {
  const attrs: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  };

  let isWebGL2 = true;
  let gl: WebGLRenderingContext | null = canvas.getContext('webgl2', attrs) as WebGLRenderingContext | null;
  if (!gl) {
    isWebGL2 = false;
    gl = (canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs)) as WebGLRenderingContext | null;
  }

  if (!gl) {
    callbacks.onError('setup');
    return;
  }

  const activeGl = gl;
  let contextLost = activeGl.isContextLost();

  const handleContextLost = (ev: Event) => {
    ev.preventDefault();
    contextLost = true;
    callbacks.onError('device-lost');
  };

  canvas.addEventListener('webglcontextlost', handleContextLost);

  let aluProgram: WebGLProgram | null = null;
  let blitProgram: WebGLProgram | null = null;
  let quadBuffer: WebGLBuffer | null = null;
  let fbo: WebGLFramebuffer | null = null;
  let computeTexture: WebGLTexture | null = null;

  const cleanup = () => {
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    if (!activeGl.isContextLost()) {
      if (fbo) activeGl.deleteFramebuffer(fbo);
      if (computeTexture) activeGl.deleteTexture(computeTexture);
      if (quadBuffer) activeGl.deleteBuffer(quadBuffer);
      if (aluProgram) activeGl.deleteProgram(aluProgram);
      if (blitProgram) activeGl.deleteProgram(blitProgram);
    }
    fbo = null;
    computeTexture = null;
    quadBuffer = null;
    aluProgram = null;
    blitProgram = null;
  };

  try {
    if (contextLost) {
      callbacks.onError('device-lost');
      return;
    }

    aluProgram = createProgram(activeGl, WEBGL_ALU_VERTEX_SHADER, WEBGL_ALU_FRAGMENT_SHADER);
    blitProgram = createProgram(activeGl, WEBGL_BLIT_VERTEX_SHADER, WEBGL_BLIT_FRAGMENT_SHADER);
    if (!aluProgram || !blitProgram) {
      callbacks.onError('setup');
      return;
    }

    quadBuffer = activeGl.createBuffer();
    if (!quadBuffer) {
      callbacks.onError('setup');
      return;
    }
    activeGl.bindBuffer(activeGl.ARRAY_BUFFER, quadBuffer);
    activeGl.bufferData(
      activeGl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      activeGl.STATIC_DRAW
    );

    const maxTexSize = Number(activeGl.getParameter(activeGl.MAX_TEXTURE_SIZE)) || 2048;
    const viewportDims = activeGl.getParameter(activeGl.MAX_VIEWPORT_DIMS) as ArrayLike<number> | null;
    const maxViewport = viewportDims && viewportDims.length >= 2 ? Math.min(viewportDims[0], viewportDims[1]) : 2048;
    const gridSize = resolveEffectiveGridSize(settings.matrixSize, maxTexSize, maxViewport);

    // Offscreen FBO matching requested matrixSize x matrixSize
    computeTexture = activeGl.createTexture();
    fbo = activeGl.createFramebuffer();
    if (!computeTexture || !fbo) {
      callbacks.onError('setup');
      return;
    }

    activeGl.bindTexture(activeGl.TEXTURE_2D, computeTexture);
    activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MIN_FILTER, activeGl.LINEAR);
    activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_MAG_FILTER, activeGl.LINEAR);
    activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_S, activeGl.CLAMP_TO_EDGE);
    activeGl.texParameteri(activeGl.TEXTURE_2D, activeGl.TEXTURE_WRAP_T, activeGl.CLAMP_TO_EDGE);
    activeGl.texImage2D(
      activeGl.TEXTURE_2D,
      0,
      activeGl.RGBA,
      gridSize,
      gridSize,
      0,
      activeGl.RGBA,
      activeGl.UNSIGNED_BYTE,
      null
    );

    activeGl.bindFramebuffer(activeGl.FRAMEBUFFER, fbo);
    activeGl.framebufferTexture2D(
      activeGl.FRAMEBUFFER,
      activeGl.COLOR_ATTACHMENT0,
      activeGl.TEXTURE_2D,
      computeTexture,
      0
    );

    if (activeGl.checkFramebufferStatus(activeGl.FRAMEBUFFER) !== activeGl.FRAMEBUFFER_COMPLETE) {
      callbacks.onError('setup');
      return;
    }

    const aluPosLoc = activeGl.getAttribLocation(aluProgram, 'a_position');
    const aluSeedLoc = activeGl.getUniformLocation(aluProgram, 'u_seed');
    const blitPosLoc = activeGl.getAttribLocation(blitProgram, 'a_position');
    const blitTexLoc = activeGl.getUniformLocation(blitProgram, 'u_texture');

    const drawAluSingle = (seed: number) => {
      if (!aluProgram || !quadBuffer) return;
      activeGl.useProgram(aluProgram);
      activeGl.bindBuffer(activeGl.ARRAY_BUFFER, quadBuffer);
      if (aluPosLoc >= 0) {
        activeGl.enableVertexAttribArray(aluPosLoc);
        activeGl.vertexAttribPointer(aluPosLoc, 2, activeGl.FLOAT, false, 0, 0);
      }
      if (aluSeedLoc) {
        activeGl.uniform1f(aluSeedLoc, seed);
      }
      activeGl.drawArrays(activeGl.TRIANGLES, 0, 6);
    };

    const blitToPreviewCanvas = () => {
      if (!blitProgram || !quadBuffer || !computeTexture) return;
      activeGl.bindFramebuffer(activeGl.FRAMEBUFFER, null);
      activeGl.viewport(0, 0, canvas.width, canvas.height);
      activeGl.useProgram(blitProgram);
      activeGl.bindBuffer(activeGl.ARRAY_BUFFER, quadBuffer);
      if (blitPosLoc >= 0) {
        activeGl.enableVertexAttribArray(blitPosLoc);
        activeGl.vertexAttribPointer(blitPosLoc, 2, activeGl.FLOAT, false, 0, 0);
      }
      activeGl.activeTexture(activeGl.TEXTURE0);
      activeGl.bindTexture(activeGl.TEXTURE_2D, computeTexture);
      if (blitTexLoc) {
        activeGl.uniform1i(blitTexLoc, 0);
      }
      activeGl.drawArrays(activeGl.TRIANGLES, 0, 6);
    };

    let capability: TimingCapability = detectTimingCapability(
      activeGl as unknown as WebGlTimerContext,
      isWebGL2
    );

    callbacks.onCapabilityDetected({
      glVersion: capability.glVersion,
      timingSource: capability.source,
      effectiveGridSize: gridSize,
    });

    // Phase 1: Correctness Verification
    callbacks.onPhaseChange('verifying');
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (isCancelled() || isStopRequested() || contextLost) return;

    const verified = verifyWebGlAluOutput(activeGl, fbo, gridSize, gridSize, drawAluSingle);
    if (isCancelled() || isStopRequested() || contextLost) return;

    callbacks.onVerification(verified ? 'passed' : 'failed');
    if (!verified) {
      callbacks.onError('verification');
      return;
    }

    const timerGl = activeGl as unknown as WebGlTimerContext;
    const pixelScratch = new Uint8Array(4);
    let seedStep = 0;

    const executeComputeBatch = (draws: number) => {
      activeGl.bindFramebuffer(activeGl.FRAMEBUFFER, fbo);
      activeGl.viewport(0, 0, gridSize, gridSize);
      for (let i = 0; i < draws; i++) {
        seedStep = (seedStep + 1) % 32;
        drawAluSingle(seedStep * 0.001);
      }
    };

    // Phase 2: Calibration (decouple batch duration from VSync / rAF)
    callbacks.onPhaseChange('calibrating');
    const singleMeasure = await measureWebGlBatch(
      timerGl,
      capability,
      () => executeComputeBatch(1),
      () => isCancelled() || contextLost,
      pixelScratch,
      250
    );
    if (isCancelled() || contextLost) return;

    let effectiveSingleMs = singleMeasure.durationMs;
    if (
      singleMeasure.disjoint ||
      singleMeasure.timedOut ||
      singleMeasure.source !== capability.source ||
      effectiveSingleMs <= 0
    ) {
      capability = downgradeTimingCapability(capability, timerGl);
      callbacks.onCapabilityDetected({
        glVersion: capability.glVersion,
        timingSource: capability.source,
        effectiveGridSize: gridSize,
      });
      // Re-measure only if the timeout wait itself dominated (< 400ms) or sample was disjoint;
      // if readPixels already drained a genuinely slow (> 400ms) draw, reuse that duration directly.
      if (singleMeasure.disjoint || effectiveSingleMs <= 0 || effectiveSingleMs < 400) {
        const retryMeasure = await measureWebGlBatch(
          timerGl,
          capability,
          () => executeComputeBatch(1),
          () => isCancelled() || contextLost,
          pixelScratch
        );
        if (isCancelled() || contextLost) return;
        effectiveSingleMs = retryMeasure.durationMs;
      }
    }

    const batchSize = computeAdaptiveBatchSize(effectiveSingleMs, TARGET_BATCH_MS, MAX_BATCH_SIZE);
    const opsPerDraw = computeWebGlOpsPerDraw(gridSize, gridSize);

    // Phase 3: Warm-up (allow GPU DVFS clock ramp-up before recording peak/samples)
    callbacks.onPhaseChange('warmup');
    const warmupDeadline = performance.now() + WARMUP_MAX_MS;
    let prevWarmupGflops: number | null = null;
    while (performance.now() < warmupDeadline) {
      if (isCancelled() || isStopRequested() || contextLost) return;
      const warmupRes = await measureWebGlBatch(
        timerGl,
        capability,
        () => executeComputeBatch(batchSize),
        () => isCancelled() || contextLost,
        pixelScratch
      );
      if (isCancelled() || isStopRequested() || contextLost) return;
      if (warmupRes.timedOut || warmupRes.source !== capability.source) {
        capability = downgradeTimingCapability(capability, timerGl);
        callbacks.onCapabilityDetected({
          glVersion: capability.glVersion,
          timingSource: capability.source,
          effectiveGridSize: gridSize,
        });
        continue;
      }
      if (warmupRes.disjoint) continue;
      const warmupGflops = computeWebGlGflops(opsPerDraw, batchSize, warmupRes.durationMs);
      if (
        prevWarmupGflops !== null &&
        prevWarmupGflops > 0 &&
        Math.abs(warmupGflops - prevWarmupGflops) / prevWarmupGflops < WARMUP_STABLE_THRESHOLD
      ) {
        break;
      }
      prevWarmupGflops = warmupGflops;
    }

    // Phase 4: Active Sampling Loop
    callbacks.onPhaseChange('running');
    const samples: number[] = [];
    let consecutiveDisjoints = 0;

    while (!isCancelled() && !isStopRequested() && !contextLost) {
      const sampleRes = await measureWebGlBatch(
        timerGl,
        capability,
        () => executeComputeBatch(batchSize),
        () => isCancelled() || isStopRequested() || contextLost,
        pixelScratch
      );

      if (isCancelled() || isStopRequested() || contextLost) break;

      if (sampleRes.timedOut || sampleRes.source !== capability.source) {
        capability = downgradeTimingCapability(capability, timerGl);
        callbacks.onCapabilityDetected({
          glVersion: capability.glVersion,
          timingSource: capability.source,
          effectiveGridSize: gridSize,
        });
        consecutiveDisjoints = 0;
        continue;
      }

      if (sampleRes.disjoint) {
        consecutiveDisjoints++;
        if (consecutiveDisjoints >= MAX_CONSECUTIVE_DISJOINTS) {
          capability = downgradeTimingCapability(capability, timerGl);
          callbacks.onCapabilityDetected({
            glVersion: capability.glVersion,
            timingSource: capability.source,
            effectiveGridSize: gridSize,
          });
          consecutiveDisjoints = 0;
        }
        continue;
      }
      consecutiveDisjoints = 0;

      const gflopsVal = computeWebGlGflops(opsPerDraw, batchSize, sampleRes.durationMs);
      if (gflopsVal > 0 && Number.isFinite(gflopsVal)) {
        samples.push(gflopsVal);
        if (samples.length > SAMPLE_WINDOW) samples.shift();

        const tailStart = Math.max(0, samples.length - Math.max(1, Math.floor(samples.length * 0.25)));
        const peak = percentileOf(samples, 0.95);
        const sustained = medianOf(samples.slice(tailStart));
        callbacks.onSample(gflopsVal, peak, sustained);
      }

      if (settings.shouldRenderPreview()) {
        blitToPreviewCanvas();
      }

      // Yield briefly to keep UI responsive between GPU batches
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  } finally {
    if (contextLost) {
      callbacks.onError('device-lost');
    }
    cleanup();
  }
};
