import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loggerStore } from '../loggerStore';

describe('Production LoggerStore Integration Tests', () => {
  beforeEach(() => {
    // Clear log and console histories before each test to ensure test isolation
    loggerStore.clearLogs();
    loggerStore.clearConsole();
    loggerStore.setLoggingEnabled(true);
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('addLog', () => {
    it('should add a log entry into the store with correct prefix format', () => {
      loggerStore.addLog('diagnostic', 'System initialized successfully');
      expect(loggerStore.logs).toHaveLength(1);
      expect(loggerStore.logs[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\] diagnostic: System initialized successfully/);
    });

    it('should respect logging enabled/disabled state', () => {
      loggerStore.setLoggingEnabled(false);
      loggerStore.addLog('warn', 'Should not be captured');
      expect(loggerStore.logs).toHaveLength(0);
    });

    it('should maintain the circular log buffer limit (max 500 entries)', () => {
      // Add 505 entries to verify oldest 5 are discarded
      for (let i = 0; i < 505; i++) {
        loggerStore.addLog('perf', `Iteration ${i}`);
      }
      expect(loggerStore.logs).toHaveLength(500);
      expect(loggerStore.logs[0]).toContain('Iteration 5');
      expect(loggerStore.logs[499]).toContain('Iteration 504');
    });
  });

  describe('addConsole', () => {
    it('should capture console outputs with unique IDs and accurate timestamps', () => {
      loggerStore.addConsole('output', 'Standard log message');
      expect(loggerStore.consoleHistory).toHaveLength(1);
      
      const entry = loggerStore.consoleHistory[0];
      expect(entry.type).toBe('output');
      expect(entry.content).toBe('Standard log message');
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.timestamp).toBe('number');
    });

    it('should normalize warning and information log levels into the "output" class', () => {
      loggerStore.addConsole('warn', 'A minor warning alert');
      loggerStore.addConsole('info', 'Some informative feedback');
      
      expect(loggerStore.consoleHistory).toHaveLength(2);
      expect(loggerStore.consoleHistory[0].type).toBe('output');
      expect(loggerStore.consoleHistory[1].type).toBe('output');
    });

    it('should preserve "error" and "input" types uniquely', () => {
      loggerStore.addConsole('error', 'Unhandled exception');
      loggerStore.addConsole('input', 'user_action_click');
      
      expect(loggerStore.consoleHistory).toHaveLength(2);
      expect(loggerStore.consoleHistory[0].type).toBe('error');
      expect(loggerStore.consoleHistory[1].type).toBe('input');
    });

    it('should maintain console buffer limit (max 500 entries)', () => {
      for (let i = 0; i < 520; i++) {
        loggerStore.addConsole('output', `Console line ${i}`);
      }
      expect(loggerStore.consoleHistory).toHaveLength(500);
      expect(loggerStore.consoleHistory[0].content).toBe('Console line 20');
    });
  });

  describe('Observables & Subscriptions', () => {
    it('should notify subscriber functions on log modifications', () => {
      const listener = vi.fn();
      const unsubscribe = loggerStore.subscribeLogs(listener);

      loggerStore.addLog('info', 'Trigger notification');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(loggerStore.logs);

      unsubscribe();
      loggerStore.addLog('info', 'No notification');
      expect(listener).toHaveBeenCalledTimes(1); // remain 1
    });

    it('should notify subscriber functions on console history modifications', () => {
      const listener = vi.fn();
      const unsubscribe = loggerStore.subscribeConsole(listener);

      loggerStore.addConsole('output', 'Trigger console subscriber');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      loggerStore.addConsole('output', 'Quiet action');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should persist settings in browser localStorage and notify settings subscribers', () => {
      const listener = vi.fn();
      const unsubscribe = loggerStore.subscribeSettings(listener);

      loggerStore.setLoggingEnabled(false);
      expect(localStorage.getItem('developer_logging_enabled')).toBe('false');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });
  });
});
