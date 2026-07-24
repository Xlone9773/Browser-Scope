import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppPermissions } from '../hooks/useAppPermissions';

describe('useAppPermissions Hook', () => {
  const openModalMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // Setup global browser mocks
    vi.stubGlobal('navigator', {
      permissions: {
        query: vi.fn(),
      },
      mediaDevices: {
        getUserMedia: vi.fn(),
      },
      geolocation: {
        getCurrentPosition: vi.fn(),
      },
      requestMIDIAccess: vi.fn(),
    });

    vi.stubGlobal('Notification', {
      requestPermission: vi.fn(),
    });

    // Mock console.error/debug to prevent cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should initialize with idle status for all permission types', () => {
    const { result } = renderHook(() => useAppPermissions(openModalMock));

    expect(result.current.permStatus).toEqual({
      camera: 'idle',
      microphone: 'idle',
      geolocation: 'idle',
      notifications: 'idle',
      midi: 'idle',
    });
    expect(result.current.geoData).toBeNull();
  });

  it('should check and update permission status successfully', async () => {
    const mockQuery = vi.spyOn(navigator.permissions, 'query').mockResolvedValue({
      state: 'granted',
      onchange: null,
    } as unknown as PermissionStatus);

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.checkPermissionStatus('camera', 'camera');
    });

    expect(mockQuery).toHaveBeenCalledWith({ name: 'camera' as PermissionName });
    expect(result.current.permStatus.camera).toBe('granted');
  });

  it('should handle permission request for camera successfully', async () => {
    const mockTrack = { stop: vi.fn() };
    const mockStream = {
      getTracks: () => [mockTrack],
    };

    const mockGetUserMedia = vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(
      mockStream as unknown as MediaStream
    );

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('camera');
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
    expect(result.current.permStatus.camera).toBe('granted');
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(openModalMock).toHaveBeenCalledWith('camera');
  });

  it('should handle permission request for microphone successfully', async () => {
    const mockTrack = { stop: vi.fn() };
    const mockStream = {
      getTracks: () => [mockTrack],
    };

    const mockGetUserMedia = vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(
      mockStream as unknown as MediaStream
    );

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('microphone');
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(result.current.permStatus.microphone).toBe('granted');
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(openModalMock).toHaveBeenCalledWith('audio');
  });

  it('should handle permission request for geolocation successfully', async () => {
    const mockGetCurrentPosition = vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation(
      (successCallback) => {
        successCallback({
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as unknown as GeolocationPosition);
      }
    );

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('geolocation');
    });

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(result.current.permStatus.geolocation).toBe('granted');
    expect(result.current.geoData).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      isSpoofed: false,
    });
  });

  it('should handle permission request for notifications successfully', async () => {
    const mockRequestPermission = vi.spyOn(Notification, 'requestPermission').mockResolvedValue('granted');

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('notifications');
    });

    expect(mockRequestPermission).toHaveBeenCalled();
    expect(result.current.permStatus.notifications).toBe('granted');
  });

  it('should handle permission request for midi successfully', async () => {
    const mockRequestMIDIAccess = vi.spyOn(navigator, 'requestMIDIAccess').mockResolvedValue({} as unknown as MIDIAccess);

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('midi');
    });

    expect(mockRequestMIDIAccess).toHaveBeenCalled();
    expect(result.current.permStatus.midi).toBe('granted');
    expect(openModalMock).toHaveBeenCalledWith('midi');
  });

  it('should handle permission request failures gracefully', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue({
      name: 'NotAllowedError',
      message: 'Permission denied by user',
    });

    const { result } = renderHook(() => useAppPermissions(openModalMock));

    await act(async () => {
      await result.current.requestPermission('camera');
    });

    expect(result.current.permStatus.camera).toBe('denied');
  });
});
