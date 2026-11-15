// Pure WebGL ALU shader definitions, deterministic FLOP accounting,
// pixel-level verification reference math, and adaptive batch sizing helpers.

export const WEBGL_ALU_ITERATIONS = 100;

// Per loop iteration: two vec4 updates, each performing:
//   mul (4) + add (4) + clamp(min 4 + max 4) = 16 FLOPs -> 32 FLOPs per iteration.
// Closing dot(a, b): 4 muls + 3 adds = 7 FLOPs.
export const WEBGL_FLOPS_PER_INVOCATION = WEBGL_ALU_ITERATIONS * 2 * (4 * 2 + 4 * 2) + 7;

export const WEBGL_ALU_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const WEBGL_ALU_FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform float u_seed;

void main() {
  vec4 a = vec4(v_uv.x * 0.5 + 0.1 + u_seed * 0.1, v_uv.y * 0.5 - 0.2 - u_seed * 0.1, 0.35, -0.25);
  vec4 b = vec4(-0.45, 0.48, -0.42 + u_seed * 0.08, 0.44);
  vec4 c = vec4(0.18 + v_uv.x * 0.25 + u_seed * 0.05, -0.15 + v_uv.y * 0.25, 0.12 - v_uv.x * 0.1, -0.14 + v_uv.y * 0.1);
  vec4 d = vec4(-0.16 + v_uv.y * 0.2, 0.19 - v_uv.x * 0.2 + u_seed * 0.04, -0.11 + v_uv.y * 0.1, 0.15);

  for (int i = 0; i < ${WEBGL_ALU_ITERATIONS}; i++) {
    a = clamp(a * b + c, vec4(-4.0), vec4(4.0));
    b = clamp(b * a + d, vec4(-4.0), vec4(4.0));
  }

  float finalVal = dot(a, b);
  gl_FragColor = vec4(
    fract(abs(finalVal) * 0.75 + 0.125) * 0.75 + 0.125,
    fract(abs(a.x) * 0.85 + 0.125) * 0.75 + 0.125,
    fract(abs(b.y) * 0.85 + 0.125) * 0.75 + 0.125,
    1.0
  );
}
`;

export const WEBGL_BLIT_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const WEBGL_BLIT_FRAGMENT_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, v_uv);
}
`;

const clampVal = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

const fractVal = (v: number): number => v - Math.floor(v);

/**
 * Computes the expected RGBA [0..255] output for the WebGL ALU shader at
 * normalized UV coordinates `(u, v)` and `seed`, allowing CPU ground-truth
 * verification against `gl.readPixels` to detect silent shader failures or DCE.
 */
export const computeExpectedWebGlPixel = (
  u: number,
  v: number,
  seed: number = 0
): [number, number, number, number] => {
  const a: [number, number, number, number] = [
    u * 0.5 + 0.1 + seed * 0.1,
    v * 0.5 - 0.2 - seed * 0.1,
    0.35,
    -0.25,
  ];
  const b: [number, number, number, number] = [-0.45, 0.48, -0.42 + seed * 0.08, 0.44];
  const c: [number, number, number, number] = [
    0.18 + u * 0.25 + seed * 0.05,
    -0.15 + v * 0.25,
    0.12 - u * 0.1,
    -0.14 + v * 0.1,
  ];
  const d: [number, number, number, number] = [
    -0.16 + v * 0.2,
    0.19 - u * 0.2 + seed * 0.04,
    -0.11 + v * 0.1,
    0.15,
  ];

  for (let i = 0; i < WEBGL_ALU_ITERATIONS; i++) {
    for (let k = 0; k < 4; k++) {
      a[k] = clampVal(a[k] * b[k] + c[k], -4.0, 4.0);
    }
    for (let k = 0; k < 4; k++) {
      b[k] = clampVal(b[k] * a[k] + d[k], -4.0, 4.0);
    }
  }

  const finalVal = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const r = fractVal(Math.abs(finalVal) * 0.75 + 0.125) * 0.75 + 0.125;
  const g = fractVal(Math.abs(a[0]) * 0.85 + 0.125) * 0.75 + 0.125;
  const bl = fractVal(Math.abs(b[1]) * 0.85 + 0.125) * 0.75 + 0.125;

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(bl * 255),
    255,
  ];
};

/**
 * Clamps requested compute grid dimension to hardware texture & viewport limits.
 */
export const resolveEffectiveGridSize = (
  requestedSize: number,
  maxTextureSize: number,
  maxViewportDim: number
): number => {
  const safeReq = Math.max(16, Math.floor(requestedSize));
  const hwCap = Math.max(16, Math.min(maxTextureSize || safeReq, maxViewportDim || safeReq));
  return Math.min(safeReq, hwCap);
};

/**
 * Total countable ALU floating-point operations executed in a single full-grid draw call.
 */
export const computeWebGlOpsPerDraw = (gridWidth: number, gridHeight: number): number => {
  if (gridWidth <= 0 || gridHeight <= 0) return 0;
  return gridWidth * gridHeight * WEBGL_FLOPS_PER_INVOCATION;
};

/**
 * Converts completed batch draw count and elapsed GPU/sync time (ms) into GFLOPS.
 */
export const computeWebGlGflops = (
  opsPerDraw: number,
  drawCount: number,
  durationMs: number
): number => {
  if (opsPerDraw <= 0 || drawCount <= 0 || !Number.isFinite(durationMs) || durationMs <= 0) {
    return 0;
  }
  const seconds = durationMs / 1000;
  return (opsPerDraw * drawCount) / seconds / 1e9;
};

/**
 * Chooses a batch draw count targeting `targetBatchMs` (default 50ms) so fast GPUs
 * are decoupled from rAF/VSync limits while slow GPUs do not trigger TDR timeouts.
 */
export const computeAdaptiveBatchSize = (
  singleDrawMs: number,
  targetBatchMs: number = 50,
  maxBatchSize: number = 500
): number => {
  const safeSingle = Number.isFinite(singleDrawMs) ? Math.max(singleDrawMs, 0.05) : 10;
  const raw = Math.round(targetBatchMs / safeSingle);
  return Math.max(1, Math.min(maxBatchSize, raw));
};
