import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GlobalError from '@/app/global-error';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock window.location.href
const originalLocation = window.location;
delete (window as any).location;
(window as any).location = { href: 'http://localhost/' };

describe('GlobalError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message and buttons', () => {
    const mockError = new Error('Test error');
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText('Application Error')).toBeInTheDocument();
    expect(
      screen.getByText(
        'A critical error occurred in the application. Please try refreshing the page or contact support if the problem persists.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('calls reset function when Try Again button is clicked', () => {
    const mockError = new Error('Test error');
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('navigates to home when Go Home button is clicked', () => {
    const mockError = new Error('Test error');
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);

    expect(window.location.href).toBe('http://localhost/');
  });

  it('displays error message in alert', () => {
    const mockError = new Error('Test error message');
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText('Critical Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('handles error without message', () => {
    const mockError = new Error();
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText('Application Error')).toBeInTheDocument();
    expect(screen.getByText('Critical Error')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected application error occurred')
    ).toBeInTheDocument();
  });
});
