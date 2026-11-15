import { describe, it, expect, vi, afterEach } from 'vitest';
import { runWebGlBenchmark } from '../components/compute/engines/webglBenchmark';
import { runGpuBenchmarkIteration } from '../components/compute/engines/benchmarkGpuRunner';
import { computeExpectedWebGlPixel } from '../components/compute/webgl/webglFlops';

interface MockWebGLConfig {
  isWebGL2?: boolean;
  failVerification?: boolean;
  alwaysDisjoint?: boolean;
  loseContextExt?: { loseContext: ReturnType<typeof vi.fn> };
}

const createMockWebGLCanvas = (cfg: MockWebGLConfig = {}) => {
  const listeners = new Map<string, Set<(ev: Event) => void>>();
  let contextLost = false;
  let boundGridWidth = 512;
  let boundGridHeight = 512;

  const timerExt2 = {
    TIME_ELAPSED_EXT: 0x88bf,
    GPU_DISJOINT_EXT: 0x8fbb,
  };

  let queryParamCalls = 0;

  const gl = {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    TEXTURE_2D: 0x0de1,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    LINEAR: 0x2601,
    CLAMP_TO_EDGE: 0x812f,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    FRAMEBUFFER: 0x8d40,
    COLOR_ATTACHMENT0: 0x8ce0,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
    TEXTURE0: 0x84c0,
    BLEND: 0x0be2,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    COLOR_BUFFER_BIT: 0x4000,
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_VIEWPORT_DIMS: 0x0d3a,
    QUERY_RESULT_AVAILABLE: 0x8867,
    QUERY_RESULT: 0x8866,
    SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
    ALREADY_SIGNALED: 0x911a,
    CONDITION_SATISFIED: 0x911c,
    WAIT_FAILED: 0x911d,

    isContextLost: vi.fn(() => contextLost),
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ''),
    deleteProgram: vi.fn(),
    useProgram: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    uniform1f: vi.fn(),
    uniform1i: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteBuffer: vi.fn(),
    createTexture: vi.fn(() => ({})),
    bindTexture: vi.fn(),
    texParameteri: vi.fn(),
    texImage2D: vi.fn((_t, _l, _ifmt, w: number, h: number) => {
      boundGridWidth = w;
      boundGridHeight = h;
    }),
    deleteTexture: vi.fn(),
    activeTexture: vi.fn(),
    createFramebuffer: vi.fn(() => ({})),
    bindFramebuffer: vi.fn(),
    framebufferTexture2D: vi.fn(),
    checkFramebufferStatus: vi.fn(() => 0x8cd5),
    deleteFramebuffer: vi.fn(),
    viewport: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    enable: vi.fn(),
    blendFunc: vi.fn(),
    drawArrays: vi.fn(),
    flush: vi.fn(),
    getParameter: vi.fn((pname: number) => {
      if (pname === 0x0d33) return 4096; // MAX_TEXTURE_SIZE
      if (pname === 0x0d3a) return new Int32Array([4096, 4096]); // MAX_VIEWPORT_DIMS
      if (pname === timerExt2.GPU_DISJOINT_EXT) {
        queryParamCalls++;
        if (cfg.alwaysDisjoint) {
          // Clear call (odd) returns false, check call (even) returns true
          return queryParamCalls % 2 === 0;
        }
        return false;
      }
      return null;
    }),
    getExtension: vi.fn((name: string) => {
      if (name === 'EXT_disjoint_timer_query_webgl2' && cfg.isWebGL2 !== false) return timerExt2;
      if (name === 'WEBGL_lose_context') return cfg.loseContextExt ?? { loseContext: vi.fn() };
      return null;
    }),
    createQuery: vi.fn(() => ({})),
    deleteQuery: vi.fn(),
    beginQuery: vi.fn(),
    endQuery: vi.fn(),
    getQueryParameter: vi.fn((_q: unknown, pname: number) => {
      if (pname === 0x8867) return true;
      if (pname === 0x8866) return 20_000_000; // 20 ms
      return 0;
    }),
    readPixels: vi.fn((x: number, y: number, w: number, h: number, _f: number, _t: number, out: Uint8Array) => {
      if (cfg.failVerification) {
        out.fill(0);
        return;
      }
      if (w === 1 && h === 1) {
        const u = (x + 0.5) / boundGridWidth;
        const v = (y + 0.5) / boundGridHeight;
        const [r, g, b, a] = computeExpectedWebGlPixel(u, v, 0);
        out[0] = r;
        out[1] = g;
        out[2] = b;
        out[3] = a;
        return;
      }
      for (let i = 0; i < out.length; i += 4) {
        out[i] = 120;
        out[i + 1] = 80;
        out[i + 2] = 200;
        out[i + 3] = 255;
      }
    }),
  };

  const canvas = {
    width: 600,
    height: 256,
    getContext: vi.fn((type: string) => {
      if (type === 'webgl2') return cfg.isWebGL2 === false ? null : gl;
      if (type === 'webgl' || type === 'experimental-webgl') return gl;
      return null;
    }),
    addEventListener: vi.fn((type: string, cb: (ev: Event) => void) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    }),
    removeEventListener: vi.fn((type: string, cb: (ev: Event) => void) => {
      listeners.get(type)?.delete(cb);
    }),
    triggerContextLost: () => {
      contextLost = true;
      const ev = { preventDefault: vi.fn() } as unknown as Event;
      listeners.get('webglcontextlost')?.forEach((cb) => cb(ev));
      return ev;
    },
  };

  return { canvas: canvas as unknown as HTMLCanvasElement & { triggerContextLost: () => Event }, gl };
};

describe('WebGL Compute Benchmark & GPU Suite Runner', () => {
  const originalCreateElement = document.createElement.bind(document);

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it('runs full WebGL benchmark lifecycle, matches FBO gridSize, and cleans up resources', async () => {
    const { canvas, gl } = createMockWebGLCanvas({ isWebGL2: true });
    const phases: string[] = [];
    let sampleCount = 0;
    let stop = false;
    const onVerification = vi.fn();
    const onCapabilityDetected = vi.fn();
    const onError = vi.fn();

    await runWebGlBenchmark(
      canvas,
      { matrixSize: 1024, shouldRenderPreview: () => false },
      () => false,
      () => stop,
      {
        onPhaseChange: (p) => phases.push(p),
        onVerification,
        onCapabilityDetected,
        onSample: (_g, peak, sustained) => {
          sampleCount++;
          expect(peak).toBeGreaterThan(0);
          expect(sustained).toBeGreaterThan(0);
          if (sampleCount >= 2) stop = true;
        },
        onError,
      }
    );

    expect(phases).toEqual(['verifying', 'calibrating', 'warmup', 'running']);
    expect(onVerification).toHaveBeenCalledWith('passed');
    expect(onCapabilityDetected).toHaveBeenCalledWith({
      glVersion: 'WebGL 2.0',
      timingSource: 'gpu-timer',
      effectiveGridSize: 1024,
    });
    expect(onError).not.toHaveBeenCalled();
    expect(gl.texImage2D).toHaveBeenCalledWith(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1024,
      1024,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    expect(gl.deleteShader).toHaveBeenCalled();
    expect(gl.deleteProgram).toHaveBeenCalled();
    expect(gl.deleteFramebuffer).toHaveBeenCalled();
    expect(gl.deleteTexture).toHaveBeenCalled();
  });

  it('aborts immediately when ALU correctness verification fails without emitting fake GFLOPS', async () => {
    const { canvas } = createMockWebGLCanvas({ failVerification: true });
    const onVerification = vi.fn();
    const onSample = vi.fn();
    const onError = vi.fn();

    await runWebGlBenchmark(
      canvas,
      { matrixSize: 512, shouldRenderPreview: () => false },
      () => false,
      () => false,
      {
        onPhaseChange: vi.fn(),
        onVerification,
        onCapabilityDetected: vi.fn(),
        onSample,
        onError,
      }
    );

    expect(onVerification).toHaveBeenCalledWith('failed');
    expect(onError).toHaveBeenCalledWith('verification');
    expect(onSample).not.toHaveBeenCalled();
  });

  it('downgrades timing capability after repeated GPU_DISJOINT_EXT anomalies', async () => {
    const { canvas } = createMockWebGLCanvas({ isWebGL2: true, alwaysDisjoint: true });
    const capabilities: string[] = [];
    let samples = 0;
    let stop = false;

    await runWebGlBenchmark(
      canvas,
      { matrixSize: 256, shouldRenderPreview: () => false },
      () => false,
      () => stop,
      {
        onPhaseChange: vi.fn(),
        onVerification: vi.fn(),
        onCapabilityDetected: (info) => capabilities.push(info.timingSource),
        onSample: () => {
          samples++;
          if (samples >= 1) stop = true;
        },
        onError: vi.fn(),
      }
    );

    expect(capabilities[0]).toBe('gpu-timer');
    expect(capabilities).toContain('readback-sync');
  });

  it('handles webglcontextlost cleanly and prevents default recovery block', async () => {
    const { canvas } = createMockWebGLCanvas();
    const onError = vi.fn();

    const benchPromise = runWebGlBenchmark(
      canvas,
      { matrixSize: 512, shouldRenderPreview: () => false },
      () => false,
      () => false,
      {
        onPhaseChange: (phase) => {
          if (phase === 'running') {
            const ev = canvas.triggerContextLost();
            expect(ev.preventDefault).toHaveBeenCalled();
          }
        },
        onVerification: vi.fn(),
        onCapabilityDetected: vi.fn(),
        onSample: vi.fn(),
        onError,
      }
    );

    await benchPromise;
    expect(onError).toHaveBeenCalledWith('device-lost');
  });

  it('runs BenchmarkModal GPU test via WebGL with GPU Timer and releases context afterward', async () => {
    const loseContext = vi.fn();
    const { canvas } = createMockWebGLCanvas({ isWebGL2: true, loseContextExt: { loseContext } });

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') return canvas;
      return originalCreateElement(tagName);
    }) as unknown as typeof document.createElement;

    const result = await runGpuBenchmarkIteration();
    expect(result.mode).toBe('webgl');
    expect(result.timingSource).toBe('gpu-timer');
    expect(result.score).toBeGreaterThan(0);
    expect(result.checksum).toBeGreaterThan(0);
    expect(result.details).toContain('GPU Timer');
    expect(loseContext).toHaveBeenCalledTimes(1);
  });

  it('falls back to deterministic 2D sync benchmark when WebGL is unavailable', async () => {
    const mock2dCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]),
      })),
    };

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn((type: string) => (type === '2d' ? mock2dCtx : null)),
        };
      }
      return originalCreateElement(tagName);
    }) as unknown as typeof document.createElement;

    const result = await runGpuBenchmarkIteration();
    expect(result.mode).toBe('2d-fallback');
    expect(result.timingSource).toBe('2d-sync');
    expect(result.score).toBeGreaterThan(0);
    expect(result.checksum).toBe((10 + 20 + 30 + 40 + 50 + 60) & 0xffff);
    expect(result.details).toContain('2D Sync');
  });
});
