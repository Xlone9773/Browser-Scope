import { describe, it, expect, vi } from 'vitest';
import {
  type DisjointTimerQueryWebGL1Ext,
  type DisjointTimerQueryWebGL2Ext,
  type WebGlTimerContext,
  detectTimingCapability,
  downgradeTimingCapability,
  measureWebGlBatch,
} from '../components/compute/webgl/webglTimer';

const createBaseGlMock = (overrides: Partial<WebGlTimerContext> = {}): WebGlTimerContext => ({
  RGBA: 0x1908,
  UNSIGNED_BYTE: 0x1401,
  SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
  ALREADY_SIGNALED: 0x911a,
  CONDITION_SATISFIED: 0x911c,
  WAIT_FAILED: 0x911d,
  QUERY_RESULT_AVAILABLE: 0x8867,
  QUERY_RESULT: 0x8866,
  getExtension: vi.fn().mockReturnValue(null),
  getParameter: vi.fn().mockReturnValue(false),
  flush: vi.fn(),
  readPixels: vi.fn(),
  ...overrides,
});

describe('WebGL Timing Subsystem', () => {
  describe('detectTimingCapability & downgradeTimingCapability', () => {
    it('selects WebGL2 GPU timer when EXT_disjoint_timer_query_webgl2 is supported', () => {
      const ext2: DisjointTimerQueryWebGL2Ext = {
        TIME_ELAPSED_EXT: 0x88bf,
        GPU_DISJOINT_EXT: 0x8fbb,
      };
      const gl = createBaseGlMock({
        createQuery: vi.fn(),
        deleteQuery: vi.fn(),
        beginQuery: vi.fn(),
        endQuery: vi.fn(),
        getQueryParameter: vi.fn(),
        getExtension: vi.fn((name) => (name === 'EXT_disjoint_timer_query_webgl2' ? ext2 : null)),
      });

      const cap = detectTimingCapability(gl, true);
      expect(cap.source).toBe('gpu-timer');
      expect(cap.glVersion).toBe('WebGL 2.0');
      expect(cap.timerMode).toBe('webgl2');
    });

    it('selects WebGL1 GPU timer when EXT_disjoint_timer_query is supported', () => {
      const ext1: DisjointTimerQueryWebGL1Ext = {
        TIME_ELAPSED_EXT: 0x88bf,
        QUERY_RESULT_AVAILABLE_EXT: 0x8867,
        QUERY_RESULT_EXT: 0x8866,
        GPU_DISJOINT_EXT: 0x8fbb,
        createQueryEXT: vi.fn(),
        deleteQueryEXT: vi.fn(),
        beginQueryEXT: vi.fn(),
        endQueryEXT: vi.fn(),
        getQueryObjectEXT: vi.fn(),
      };
      const gl = createBaseGlMock({
        getExtension: vi.fn((name) => (name === 'EXT_disjoint_timer_query' ? ext1 : null)),
      });

      const cap = detectTimingCapability(gl, false);
      expect(cap.source).toBe('gpu-timer');
      expect(cap.glVersion).toBe('WebGL 1.0');
      expect(cap.timerMode).toBe('webgl1');
    });

    it('falls back to WebGL2 fenceSync when timer query is absent, then readback-sync on WebGL1', () => {
      const gl2 = createBaseGlMock({
        fenceSync: vi.fn(),
        deleteSync: vi.fn(),
        clientWaitSync: vi.fn(),
      });
      const cap2 = detectTimingCapability(gl2, true);
      expect(cap2.source).toBe('fence-sync');
      expect(downgradeTimingCapability({ ...cap2, source: 'gpu-timer', timerMode: 'webgl2' }, gl2).source).toBe('fence-sync');

      const gl1 = createBaseGlMock();
      const cap1 = detectTimingCapability(gl1, false);
      expect(cap1.source).toBe('readback-sync');
      expect(downgradeTimingCapability({ ...cap1, source: 'gpu-timer', timerMode: 'webgl1' }, gl1).source).toBe('readback-sync');
    });
  });

  describe('measureWebGlBatch', () => {
    it('measures nanosecond GPU duration on WebGL2 timer query and deletes query handle', async () => {
      const ext2: DisjointTimerQueryWebGL2Ext = {
        TIME_ELAPSED_EXT: 0x88bf,
        GPU_DISJOINT_EXT: 0x8fbb,
      };
      const mockQuery = { id: 'q2' };
      let pollCount = 0;

      const gl = createBaseGlMock({
        createQuery: vi.fn().mockReturnValue(mockQuery),
        deleteQuery: vi.fn(),
        beginQuery: vi.fn(),
        endQuery: vi.fn(),
        getQueryParameter: vi.fn((_q, pname) => {
          if (pname === 0x8867) {
            pollCount++;
            return pollCount >= 2;
          }
          if (pname === 0x8866) {
            return 25_000_000; // 25 ms in ns
          }
          return 0;
        }),
        getParameter: vi.fn().mockReturnValue(false),
        getExtension: vi.fn((name) => (name === 'EXT_disjoint_timer_query_webgl2' ? ext2 : null)),
      });

      const cap = detectTimingCapability(gl, true);
      const execute = vi.fn();
      const res = await measureWebGlBatch(gl, cap, execute, () => false);

      expect(execute).toHaveBeenCalledTimes(1);
      expect(res.disjoint).toBe(false);
      expect(res.source).toBe('gpu-timer');
      expect(res.durationMs).toBeCloseTo(25, 5);
      expect(gl.deleteQuery).toHaveBeenCalledWith(mockQuery);
    });

    it('rejects dirty timer readings when GPU_DISJOINT_EXT is true', async () => {
      const ext1: DisjointTimerQueryWebGL1Ext = {
        TIME_ELAPSED_EXT: 0x88bf,
        QUERY_RESULT_AVAILABLE_EXT: 0x8867,
        QUERY_RESULT_EXT: 0x8866,
        GPU_DISJOINT_EXT: 0x8fbb,
        createQueryEXT: vi.fn().mockReturnValue({ id: 'q1' }),
        deleteQueryEXT: vi.fn(),
        beginQueryEXT: vi.fn(),
        endQueryEXT: vi.fn(),
        getQueryObjectEXT: vi.fn((_q, pname) => (pname === 0x8867 ? true : 99_000_000)),
      };

      let getParamCalls = 0;
      const gl = createBaseGlMock({
        getParameter: vi.fn(() => {
          getParamCalls++;
          // First call clears old disjoint flag; second call after query reports disjoint=true
          return getParamCalls >= 2;
        }),
        getExtension: vi.fn((name) => (name === 'EXT_disjoint_timer_query' ? ext1 : null)),
      });

      const cap = detectTimingCapability(gl, false);
      const res = await measureWebGlBatch(gl, cap, vi.fn(), () => false);

      expect(res.disjoint).toBe(true);
      expect(res.durationMs).toBe(0);
      expect(ext1.deleteQueryEXT).toHaveBeenCalledTimes(1);
    });

    it('falls back to readback-sync if timer query exceeds polling timeout', async () => {
      const ext2: DisjointTimerQueryWebGL2Ext = {
        TIME_ELAPSED_EXT: 0x88bf,
        GPU_DISJOINT_EXT: 0x8fbb,
      };
      const gl = createBaseGlMock({
        createQuery: vi.fn().mockReturnValue({ id: 'q-timeout' }),
        deleteQuery: vi.fn(),
        beginQuery: vi.fn(),
        endQuery: vi.fn(),
        getQueryParameter: vi.fn().mockReturnValue(false), // never becomes available
        getExtension: vi.fn((name) => (name === 'EXT_disjoint_timer_query_webgl2' ? ext2 : null)),
      });

      const cap = detectTimingCapability(gl, true);
      const res = await measureWebGlBatch(gl, cap, vi.fn(), () => false, new Uint8Array(4), 10);

      expect(res.source).toBe('readback-sync');
      expect(res.disjoint).toBe(false);
      expect(res.timedOut).toBe(true);
      expect(res.durationMs).toBeGreaterThan(0);
      expect(gl.readPixels).toHaveBeenCalledWith(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, expect.any(Uint8Array));
      expect(gl.deleteQuery).toHaveBeenCalledTimes(1);
    });

    it('uses WebGL2 fenceSync polling and falls back to readPixels on WAIT_FAILED', async () => {
      const mockSync = { id: 's1' };
      let waitCalls = 0;
      const glOk = createBaseGlMock({
        fenceSync: vi.fn().mockReturnValue(mockSync),
        deleteSync: vi.fn(),
        clientWaitSync: vi.fn(() => {
          waitCalls++;
          return waitCalls >= 2 ? 0x911c : 0x911b; // TIMEOUT_EXPIRED then CONDITION_SATISFIED
        }),
      });

      const capOk = detectTimingCapability(glOk, true);
      const resOk = await measureWebGlBatch(glOk, capOk, vi.fn(), () => false);
      expect(resOk.source).toBe('fence-sync');
      expect(glOk.deleteSync).toHaveBeenCalledWith(mockSync);

      const glFail = createBaseGlMock({
        fenceSync: vi.fn().mockReturnValue(mockSync),
        deleteSync: vi.fn(),
        clientWaitSync: vi.fn().mockReturnValue(0x911d), // WAIT_FAILED
      });
      const resFail = await measureWebGlBatch(glFail, detectTimingCapability(glFail, true), vi.fn(), () => false);
      expect(resFail.source).toBe('readback-sync');
      expect(glFail.readPixels).toHaveBeenCalled();
      expect(glFail.deleteSync).toHaveBeenCalledWith(mockSync);
    });

    it('executes 1x1 readPixels barrier in readback-sync fallback mode', async () => {
      const gl = createBaseGlMock();
      const cap = detectTimingCapability(gl, false);
      const batchFn = vi.fn();
      const res = await measureWebGlBatch(gl, cap, batchFn, () => false);

      expect(batchFn).toHaveBeenCalledTimes(1);
      expect(res.source).toBe('readback-sync');
      expect(res.durationMs).toBeGreaterThan(0);
      expect(gl.readPixels).toHaveBeenCalledWith(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, expect.any(Uint8Array));
    });
  });
});
