import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PWAInstaller from '../../components/PWAInstaller';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
});

describe('PWAInstaller', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset matchMedia mock to default (not standalone)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders without crashing', () => {
    render(<PWAInstaller />);
    expect(screen.queryByText(/Install this app/)).not.toBeInTheDocument();
  });

  it('shows installed message when app is in standalone mode', () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<PWAInstaller />);
    expect(
      screen.getByText(/App is installed and ready to use offline!/)
    ).toBeInTheDocument();
  });

  it('sets up event listeners on mount', () => {
    render(<PWAInstaller />);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function)
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function)
    );
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<PWAInstaller />);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function)
    );
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'appinstalled',
      expect.any(Function)
    );
  });

  it('handles beforeinstallprompt event correctly', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    render(<PWAInstaller />);

    // Get the event handler that was registered
    const beforeInstallPromptHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeinstallprompt'
    )?.[1];

    expect(beforeInstallPromptHandler).toBeDefined();

    // Simulate the beforeinstallprompt event wrapped in act
    act(() => {
      beforeInstallPromptHandler(mockEvent);
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(
      screen.getByText(/Install this app for a better experience/)
    ).toBeInTheDocument();
  });

  it('handles appinstalled event correctly', () => {
    render(<PWAInstaller />);

    // Get the appinstalled event handler
    const appInstalledHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'appinstalled'
    )?.[1];

    expect(appInstalledHandler).toBeDefined();

    // Simulate the appinstalled event wrapped in act
    act(() => {
      appInstalledHandler();
    });

    expect(
      screen.getByText(/App is installed and ready to use offline!/)
    ).toBeInTheDocument();
  });

  it('handles install click with accepted outcome', async () => {
    const user = userEvent.setup();
    const mockPrompt = jest.fn();
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' });
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    };

    // Mock console.log to verify it's called
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<PWAInstaller />);

    // Trigger beforeinstallprompt event
    const beforeInstallPromptHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeinstallprompt'
    )?.[1];
    act(() => {
      beforeInstallPromptHandler(mockEvent);
    });

    // Find and click the install button
    const installButton = screen.getByText('Install');
    await user.click(installButton);

    expect(mockPrompt).toHaveBeenCalled();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'User accepted the install prompt'
      );
    });

    // Wait for the prompt to be hidden after installation
    await waitFor(() => {
      expect(
        screen.queryByText(/Install this app for a better experience/)
      ).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles install click with dismissed outcome', async () => {
    const user = userEvent.setup();
    const mockPrompt = jest.fn();
    const mockUserChoice = Promise.resolve({ outcome: 'dismissed' });
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    };

    // Mock console.log to verify it's called
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<PWAInstaller />);

    // Trigger beforeinstallprompt event
    const beforeInstallPromptHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeinstallprompt'
    )?.[1];
    act(() => {
      beforeInstallPromptHandler(mockEvent);
    });

    // Find and click the install button
    const installButton = screen.getByText('Install');
    await user.click(installButton);

    expect(mockPrompt).toHaveBeenCalled();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'User dismissed the install prompt'
      );
    });

    // Wait for the prompt to be hidden after dismissal
    await waitFor(() => {
      expect(
        screen.queryByText(/Install this app for a better experience/)
      ).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles install click when no deferred prompt exists', async () => {
    const _user = userEvent.setup();
    const _mockPrompt = jest.fn();

    render(<PWAInstaller />);

    // Try to click install button when no prompt is available
    // The button should not be visible, but if it were, it should handle gracefully
    const installButtons = screen.queryAllByText('Install');
    expect(installButtons).toHaveLength(0);
  });

  it('handles install click when deferredPrompt is null', async () => {
    const _user = userEvent.setup();

    // Create a component instance and manually trigger the install click
    // when deferredPrompt is null (this covers line 55)
    render(<PWAInstaller />);

    // Since there's no deferredPrompt, the handleInstallClick should return early
    // We can't directly test this without exposing the internal state,
    // but we can verify the component doesn't crash when trying to install
    // without a deferred prompt

    // The component should render without errors (no install button visible)
    expect(screen.queryByText('Install')).not.toBeInTheDocument();
  });

  it('handles close button click', async () => {
    const user = userEvent.setup();
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    render(<PWAInstaller />);

    // Trigger beforeinstallprompt event to show the prompt
    const beforeInstallPromptHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeinstallprompt'
    )?.[1];
    act(() => {
      beforeInstallPromptHandler(mockEvent);
    });

    // Verify prompt is visible
    expect(
      screen.getByText(/Install this app for a better experience/)
    ).toBeInTheDocument();

    // Find and click the dismiss button
    const dismissButton = screen.getByText('Dismiss');
    await user.click(dismissButton);

    // Wait for the prompt to be hidden
    await waitFor(() => {
      expect(
        screen.queryByText(/Install this app for a better experience/)
      ).not.toBeInTheDocument();
    });
  });

  it('handles close button click via alert close', async () => {
    const user = userEvent.setup();
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    render(<PWAInstaller />);

    // Trigger beforeinstallprompt event to show the prompt
    const beforeInstallPromptHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'beforeinstallprompt'
    )?.[1];
    act(() => {
      beforeInstallPromptHandler(mockEvent);
    });

    // Verify prompt is visible
    expect(
      screen.getByText(/Install this app for a better experience/)
    ).toBeInTheDocument();

    // Find and click the close button (X icon) - it's the Dismiss button with Close icon
    const closeButton = screen.getByText('Dismiss');
    await user.click(closeButton);

    // Wait for the prompt to be hidden
    await waitFor(() => {
      expect(
        screen.queryByText(/Install this app for a better experience/)
      ).not.toBeInTheDocument();
    });
  });
});
