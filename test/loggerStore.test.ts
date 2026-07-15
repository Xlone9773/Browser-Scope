import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loggerStore } from '../utils/loggerStore';

describe('LoggerStore Class / Instance', () => {
  beforeEach(() => {
    loggerStore.clearLogs();
    loggerStore.clearConsole();
    loggerStore.setLoggingEnabled(true);
    vi.restoreAllMocks();
  });

  it('should initialize with default empty logs and settings', () => {
    expect(loggerStore.logs).toEqual([]);
    expect(loggerStore.consoleHistory).toEqual([]);
    expect(loggerStore.isLoggingEnabled).toBe(true);
  });

  it('should add logs correctly and limit history to 500 items', () => {
    loggerStore.addLog('INFO', 'Test log message');
    expect(loggerStore.logs.length).toBe(1);
    expect(loggerStore.logs[0]).toContain('INFO: Test log message');

    // Add 510 logs to trigger shift limit
    for (let i = 0; i < 510; i++) {
      loggerStore.addLog('DEBUG', `log-${i}`);
    }
    expect(loggerStore.logs.length).toBe(500);
    expect(loggerStore.logs[499]).toContain('DEBUG: log-509');
  });

  it('should ignore adding logs if logging is disabled', () => {
    loggerStore.setLoggingEnabled(false);
    loggerStore.addLog('ERROR', 'This should be ignored');
    expect(loggerStore.logs).toEqual([]);
  });

  it('should manage custom console entries', () => {
    loggerStore.addConsole('error', 'Critical JS error');
    expect(loggerStore.consoleHistory.length).toBe(1);
    expect(loggerStore.consoleHistory[0].type).toBe('error');
    expect(loggerStore.consoleHistory[0].content).toBe('Critical JS error');

    loggerStore.clearConsole();
    expect(loggerStore.consoleHistory).toEqual([]);
  });

  it('should support subscriber notifications for updates', () => {
    const logSpy = vi.fn();
    const consoleSpy = vi.fn();
    const settingsSpy = vi.fn();

    const unsubLogs = loggerStore.subscribeLogs(logSpy);
    const unsubConsole = loggerStore.subscribeConsole(consoleSpy);
    const unsubSettings = loggerStore.subscribeSettings(settingsSpy);

    loggerStore.addLog('SYSTEM', 'Lighthouse report ready');
    expect(logSpy).toHaveBeenCalledWith(loggerStore.logs);

    loggerStore.addConsole('input', 'document.body');
    expect(consoleSpy).toHaveBeenCalledWith(loggerStore.consoleHistory);

    loggerStore.setLoggingEnabled(false);
    expect(settingsSpy).toHaveBeenCalled();

    unsubLogs();
    unsubConsole();
    unsubSettings();
  });
});
