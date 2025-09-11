import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Error from '../../app/error';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

describe('Error Page', () => {
  const mockError = {
    message: 'Test error message',
    digest: undefined,
  } as Error & { digest?: string };
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error page with error message', () => {
    render(<Error error={mockError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(
      screen.getByText(/An error occurred while loading this page/)
    ).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders error page with digest when provided', () => {
    const errorWithDigest = { ...mockError, digest: 'error-123' };

    render(<Error error={errorWithDigest} reset={mockReset} />);

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    // The digest is in the same text node, so we can check for the pattern
    expect(screen.getByText(/Error ID:.*error-123/)).toBeInTheDocument();
  });

  it('renders error page with timestamp when no digest', () => {
    render(<Error error={mockError} reset={mockReset} />);

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Time:/)).toBeInTheDocument();
  });

  it('calls reset function when Try Again button is clicked', () => {
    render(<Error error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByText('Try Again'));

    expect(mockReset).toHaveBeenCalled();
  });

  it('navigates to home when Go Home button is clicked', () => {
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: 'http://localhost:3000' };

    render(<Error error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByText('Go Home'));

    // The href gets set to '/' but the full URL becomes 'http://localhost/'
    expect((window as any).location.href).toBe('http://localhost/');
  });

  it('shows error details alert', () => {
    render(<Error error={mockError} reset={mockReset} />);

    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
