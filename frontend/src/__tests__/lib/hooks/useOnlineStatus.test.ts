import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

// Mock window.navigator
const mockNavigator = {
  onLine: true,
};

// Mock window events
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock window object
Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('useOnlineStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigator.onLine = true;
  });

  it('should return true when navigator.onLine is true', () => {
    mockNavigator.onLine = true;
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('should return false when navigator.onLine is false', () => {
    mockNavigator.onLine = false;
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
  });

  it('should add event listeners for online and offline events', () => {
    renderHook(() => useOnlineStatus());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );
  });

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useOnlineStatus());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );
  });

  it('should update status when online event is fired', () => {
    mockNavigator.onLine = false;
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(false);

    // Get the online event handler
    const onlineHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'online'
    )?.[1];

    expect(onlineHandler).toBeDefined();

    // Simulate going online
    act(() => {
      onlineHandler();
    });

    expect(result.current).toBe(true);
  });

  it('should update status when offline event is fired', () => {
    mockNavigator.onLine = true;
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);

    // Get the offline event handler
    const offlineHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'offline'
    )?.[1];

    expect(offlineHandler).toBeDefined();

    // Simulate going offline
    act(() => {
      offlineHandler();
    });

    expect(result.current).toBe(false);
  });

  it('should return true for SSR when window is undefined', () => {
    // Mock window as undefined (SSR scenario)
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally setting window to undefined for SSR test
    delete global.window;

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    // Restore window
    global.window = originalWindow;
  });
});
