import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import OfflineIndicator from '../../components/OfflineIndicator';
import { useOnlineStatus } from '../../lib/hooks/useOnlineStatus';

// Mock the useOnlineStatus hook
jest.mock('../../lib/hooks/useOnlineStatus');
const mockUseOnlineStatus = useOnlineStatus as jest.MockedFunction<
  typeof useOnlineStatus
>;

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should not render when online by default', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<OfflineIndicator />);

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
    expect(screen.queryByText('You are back online')).not.toBeInTheDocument();
  });

  it('should render offline indicator when offline', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator />);

    expect(screen.getByText('You are offline')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Some features may be limited. Your data will sync when you reconnect.'
      )
    ).toBeInTheDocument();
  });

  it('should render online indicator when showWhenOnline is true', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<OfflineIndicator showWhenOnline={true} />);

    expect(screen.getByText('You are back online')).toBeInTheDocument();
    expect(
      screen.getByText('All features are now available.')
    ).toBeInTheDocument();
  });

  it('should auto-hide online indicator after duration', async () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(
      <OfflineIndicator showWhenOnline={true} onlineIndicatorDuration={1000} />
    );

    expect(screen.getByText('You are back online')).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.queryByText('You are back online')).not.toBeInTheDocument();
    });
  });

  it('should show dismiss button when dismissible is true', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator dismissible={true} />);

    expect(screen.getByLabelText('dismiss')).toBeInTheDocument();
  });

  it('should not show dismiss button when dismissible is false', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator dismissible={false} />);

    expect(screen.queryByLabelText('dismiss')).not.toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    const mockOnDismiss = jest.fn();
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator dismissible={true} onDismiss={mockOnDismiss} />);

    const dismissButton = screen.getByLabelText('dismiss');
    dismissButton.click();

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('should hide indicator after dismiss', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator dismissible={true} />);

    expect(screen.getByText('You are offline')).toBeInTheDocument();

    const dismissButton = screen.getByLabelText('dismiss');
    dismissButton.click();

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
  });

  it('should reset dismissed state when going offline after being online', () => {
    const { rerender } = render(<OfflineIndicator dismissible={true} />);

    // Start offline
    mockUseOnlineStatus.mockReturnValue(false);
    rerender(<OfflineIndicator dismissible={true} />);

    expect(screen.getByText('You are offline')).toBeInTheDocument();

    // Dismiss the indicator
    const dismissButton = screen.getByLabelText('dismiss');
    dismissButton.click();

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();

    // Go online
    mockUseOnlineStatus.mockReturnValue(true);
    rerender(<OfflineIndicator dismissible={true} />);

    // Go offline again
    mockUseOnlineStatus.mockReturnValue(false);
    rerender(<OfflineIndicator dismissible={true} />);

    // Should show again (dismissed state should be reset)
    expect(screen.getByText('You are offline')).toBeInTheDocument();
  });

  it('should not show when showWhenOffline is false', () => {
    mockUseOnlineStatus.mockReturnValue(false);

    render(<OfflineIndicator showWhenOffline={false} />);

    expect(screen.queryByText('You are offline')).not.toBeInTheDocument();
  });

  it('should not show when showWhenOnline is false and online', () => {
    mockUseOnlineStatus.mockReturnValue(true);

    render(<OfflineIndicator showWhenOnline={false} />);

    expect(screen.queryByText('You are back online')).not.toBeInTheDocument();
  });
});
