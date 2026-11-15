// WebGL timing subsystem:
// Priority 1: Hardware GPU Timer Query (EXT_disjoint_timer_query_webgl2 / EXT_disjoint_timer_query)
// Priority 2: WebGL2 non-blocking Fence Sync polling
// Priority 3: Minimal 1x1 pixel readback pipeline barrier

export type TimingSource = 'gpu-timer' | 'fence-sync' | 'readback-sync';

export interface DisjointTimerQueryWebGL2Ext {
  TIME_ELAPSED_EXT: number;
  GPU_DISJOINT_EXT: number;
}

export interface DisjointTimerQueryWebGL1Ext {
  TIME_ELAPSED_EXT: number;
  QUERY_RESULT_AVAILABLE_EXT: number;
  QUERY_RESULT_EXT: number;
  GPU_DISJOINT_EXT: number;
  createQueryEXT(): unknown;
  deleteQueryEXT(query: unknown): void;
  beginQueryEXT(target: number, query: unknown): void;
  endQueryEXT(target: number): void;
  getQueryObjectEXT(query: unknown, pname: number): unknown;
}

export interface WebGlTimerContext {
  RGBA: number;
  UNSIGNED_BYTE: number;
  SYNC_GPU_COMMANDS_COMPLETE?: number;
  ALREADY_SIGNALED?: number;
  CONDITION_SATISFIED?: number;
  WAIT_FAILED?: number;
  QUERY_RESULT_AVAILABLE?: number;
  QUERY_RESULT?: number;
  getExtension(name: string): unknown;
  getParameter(pname: number): unknown;
  flush(): void;
  readPixels(
    x: number,
    y: number,
    width: number,
    height: number,
    format: number,
    type: number,
    pixels: Uint8Array
  ): void;
  createQuery?: () => unknown;
  deleteQuery?: (query: unknown) => void;
  beginQuery?: (target: number, query: unknown) => void;
  endQuery?: (target: number) => void;
  getQueryParameter?: (query: unknown, pname: number) => unknown;
  fenceSync?: (condition: number, flags: number) => unknown;
  deleteSync?: (sync: unknown) => void;
  clientWaitSync?: (sync: unknown, flags: number, timeout: number) => number;
}

export interface TimingCapability {
  source: TimingSource;
  glVersion: 'WebGL 2.0' | 'WebGL 1.0';
  timerMode: 'webgl2' | 'webgl1' | null;
  ext2: DisjointTimerQueryWebGL2Ext | null;
  ext1: DisjointTimerQueryWebGL1Ext | null;
}

export interface BatchMeasureResult {
  durationMs: number;
  disjoint: boolean;
  source: TimingSource;
  timedOut?: boolean;
}

const DEFAULT_GPU_TIMER_TIMEOUT_MS = 300;
const DEFAULT_FENCE_TIMEOUT_MS = 4000;

const delayMs = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const detectTimingCapability = (
  gl: WebGlTimerContext,
  isWebGL2: boolean
): TimingCapability => {
  const glVersion: 'WebGL 2.0' | 'WebGL 1.0' = isWebGL2 ? 'WebGL 2.0' : 'WebGL 1.0';

  if (
    isWebGL2 &&
    typeof gl.createQuery === 'function' &&
    typeof gl.beginQuery === 'function' &&
    typeof gl.endQuery === 'function' &&
    typeof gl.getQueryParameter === 'function' &&
    typeof gl.deleteQuery === 'function'
  ) {
    const ext2 = gl.getExtension('EXT_disjoint_timer_query_webgl2') as DisjointTimerQueryWebGL2Ext | null;
    if (ext2 && typeof ext2.TIME_ELAPSED_EXT === 'number') {
      return {
        source: 'gpu-timer',
        glVersion,
        timerMode: 'webgl2',
        ext2,
        ext1: null,
      };
    }
  }

  const ext1 = gl.getExtension('EXT_disjoint_timer_query') as DisjointTimerQueryWebGL1Ext | null;
  if (
    ext1 &&
    typeof ext1.createQueryEXT === 'function' &&
    typeof ext1.beginQueryEXT === 'function' &&
    typeof ext1.endQueryEXT === 'function' &&
    typeof ext1.getQueryObjectEXT === 'function'
  ) {
    return {
      source: 'gpu-timer',
      glVersion,
      timerMode: 'webgl1',
      ext2: null,
      ext1,
    };
  }

  if (
    isWebGL2 &&
    typeof gl.fenceSync === 'function' &&
    typeof gl.clientWaitSync === 'function' &&
    typeof gl.deleteSync === 'function'
  ) {
    return {
      source: 'fence-sync',
      glVersion,
      timerMode: null,
      ext2: null,
      ext1: null,
    };
  }

  return {
    source: 'readback-sync',
    glVersion,
    timerMode: null,
    ext2: null,
    ext1: null,
  };
};

export const downgradeTimingCapability = (cap: TimingCapability, gl: WebGlTimerContext): TimingCapability => {
  const hasFence =
    cap.glVersion === 'WebGL 2.0' &&
    typeof gl.fenceSync === 'function' &&
    typeof gl.clientWaitSync === 'function' &&
    typeof gl.deleteSync === 'function';

  return {
    source: hasFence ? 'fence-sync' : 'readback-sync',
    glVersion: cap.glVersion,
    timerMode: null,
    ext2: null,
    ext1: null,
  };
};

const runReadbackSync = (
  gl: WebGlTimerContext,
  executeBatch: () => void,
  pixelScratch: Uint8Array
): BatchMeasureResult => {
  const t0 = performance.now();
  executeBatch();
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelScratch);
  const durationMs = Math.max(performance.now() - t0, 0.01);
  return { durationMs, disjoint: false, source: 'readback-sync' };
};

const runFenceSync = async (
  gl: WebGlTimerContext,
  executeBatch: () => void,
  isCancelled: () => boolean,
  pixelScratch: Uint8Array,
  pollTimeoutMs: number = DEFAULT_FENCE_TIMEOUT_MS
): Promise<BatchMeasureResult> => {
  if (
    typeof gl.fenceSync !== 'function' ||
    typeof gl.clientWaitSync !== 'function' ||
    typeof gl.deleteSync !== 'function'
  ) {
    return runReadbackSync(gl, executeBatch, pixelScratch);
  }

  const syncCond = gl.SYNC_GPU_COMMANDS_COMPLETE ?? 0x9117;
  const alreadySignaled = gl.ALREADY_SIGNALED ?? 0x911a;
  const conditionSatisfied = gl.CONDITION_SATISFIED ?? 0x911c;
  const waitFailed = gl.WAIT_FAILED ?? 0x911d;

  const t0 = performance.now();
  executeBatch();
  const sync = gl.fenceSync(syncCond, 0);
  gl.flush();

  if (!sync) {
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelScratch);
    return {
      durationMs: Math.max(performance.now() - t0, 0.01),
      disjoint: false,
      source: 'readback-sync',
    };
  }

  const deadline = performance.now() + pollTimeoutMs;
  try {
    while (!isCancelled()) {
      const status = gl.clientWaitSync(sync, 0, 0);
      if (status === alreadySignaled || status === conditionSatisfied) {
        return {
          durationMs: Math.max(performance.now() - t0, 0.01),
          disjoint: false,
          source: 'fence-sync',
        };
      }
      if (status === waitFailed || performance.now() >= deadline) {
        // Fallback barrier to ensure commands drain cleanly if fence stalls
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelScratch);
        return {
          durationMs: Math.max(performance.now() - t0, 0.01),
          disjoint: false,
          source: 'readback-sync',
          timedOut: status !== waitFailed,
        };
      }
      await delayMs(1);
    }
    return { durationMs: 0, disjoint: false, source: 'fence-sync' };
  } finally {
    gl.deleteSync(sync);
  }
};

const runGpuTimerQuery = async (
  gl: WebGlTimerContext,
  cap: TimingCapability,
  executeBatch: () => void,
  isCancelled: () => boolean,
  pixelScratch: Uint8Array,
  pollTimeoutMs: number = DEFAULT_GPU_TIMER_TIMEOUT_MS
): Promise<BatchMeasureResult> => {
  const isV2 = cap.timerMode === 'webgl2' && cap.ext2 !== null;
  const isV1 = cap.timerMode === 'webgl1' && cap.ext1 !== null;

  if (!isV2 && !isV1) {
    return runReadbackSync(gl, executeBatch, pixelScratch);
  }

  const disjointEnum = isV2 ? cap.ext2!.GPU_DISJOINT_EXT : cap.ext1!.GPU_DISJOINT_EXT;
  const timeElapsedEnum = isV2 ? cap.ext2!.TIME_ELAPSED_EXT : cap.ext1!.TIME_ELAPSED_EXT;

  // Clear any pre-existing disjoint state before starting measurement
  try {
    gl.getParameter(disjointEnum);
  } catch {
    return runReadbackSync(gl, executeBatch, pixelScratch);
  }

  const query = isV2 ? gl.createQuery?.() : cap.ext1!.createQueryEXT();
  if (!query) {
    return runReadbackSync(gl, executeBatch, pixelScratch);
  }

  const cpuFallbackStart = performance.now();
  try {
    if (isV2) {
      gl.beginQuery?.(timeElapsedEnum, query);
      executeBatch();
      gl.endQuery?.(timeElapsedEnum);
    } else {
      cap.ext1!.beginQueryEXT(timeElapsedEnum, query);
      executeBatch();
      cap.ext1!.endQueryEXT(timeElapsedEnum);
    }
    gl.flush();

    const availEnum = isV2
      ? (gl.QUERY_RESULT_AVAILABLE ?? 0x8867)
      : cap.ext1!.QUERY_RESULT_AVAILABLE_EXT;
    const resultEnum = isV2
      ? (gl.QUERY_RESULT ?? 0x8866)
      : cap.ext1!.QUERY_RESULT_EXT;

    const deadline = performance.now() + pollTimeoutMs;
    while (!isCancelled()) {
      const available = isV2
        ? Boolean(gl.getQueryParameter?.(query, availEnum))
        : Boolean(cap.ext1!.getQueryObjectEXT(query, availEnum));

      if (available) {
        const disjoint = Boolean(gl.getParameter(disjointEnum));
        if (disjoint) {
          return { durationMs: 0, disjoint: true, source: 'gpu-timer' };
        }
        const rawNs = isV2
          ? Number(gl.getQueryParameter?.(query, resultEnum))
          : Number(cap.ext1!.getQueryObjectEXT(query, resultEnum));

        if (Number.isFinite(rawNs) && rawNs > 0) {
          return {
            durationMs: rawNs / 1e6,
            disjoint: false,
            source: 'gpu-timer',
          };
        }
        // Invalid or zero timer reading -> mark disjoint so caller discards/downgrades
        return { durationMs: 0, disjoint: true, source: 'gpu-timer' };
      }

      if (performance.now() >= deadline) {
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelScratch);
        return {
          durationMs: Math.max(performance.now() - cpuFallbackStart, 0.01),
          disjoint: false,
          source: 'readback-sync',
          timedOut: true,
        };
      }
      await delayMs(1);
    }

    return { durationMs: 0, disjoint: false, source: 'gpu-timer' };
  } finally {
    if (isV2) {
      gl.deleteQuery?.(query);
    } else {
      cap.ext1!.deleteQueryEXT(query);
    }
  }
};

export const measureWebGlBatch = async (
  gl: WebGlTimerContext,
  capability: TimingCapability,
  executeBatch: () => void,
  isCancelled: () => boolean,
  pixelScratch: Uint8Array = new Uint8Array(4),
  pollTimeoutMs?: number
): Promise<BatchMeasureResult> => {
  if (capability.source === 'gpu-timer') {
    return runGpuTimerQuery(
      gl,
      capability,
      executeBatch,
      isCancelled,
      pixelScratch,
      pollTimeoutMs ?? DEFAULT_GPU_TIMER_TIMEOUT_MS
    );
  }
  if (capability.source === 'fence-sync') {
    return runFenceSync(
      gl,
      executeBatch,
      isCancelled,
      pixelScratch,
      pollTimeoutMs ?? DEFAULT_FENCE_TIMEOUT_MS
    );
  }
  return runReadbackSync(gl, executeBatch, pixelScratch);
};
