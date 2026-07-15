import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../utils/error';

describe('getErrorMessage', () => {
  it('should return error message when input is an Error object', () => {
    const error = new Error('Database connection failed');
    expect(getErrorMessage(error)).toBe('Database connection failed');
  });

  it('should return error message when input is an object with a message property', () => {
    const errorObj = { message: 'Failed to fetch resource', code: 500 };
    expect(getErrorMessage(errorObj)).toBe('Failed to fetch resource');
  });

  it('should stringify input when it is a primitive or unhandled type', () => {
    expect(getErrorMessage('Unauthorized access')).toBe('Unauthorized access');
    expect(getErrorMessage(404)).toBe('404');
    expect(getErrorMessage(true)).toBe('true');
  });

  it('should return string representation of null or undefined when passed', () => {
    expect(getErrorMessage(null)).toBe('null');
    expect(getErrorMessage(undefined)).toBe('undefined');
  });

  it('should stringify objects that do not have a message property', () => {
    const customObj = { status: 'error', reason: 'timeout' };
    expect(getErrorMessage(customObj)).toBe('[object Object]');
  });
});
