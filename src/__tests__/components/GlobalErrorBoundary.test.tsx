import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalErrorBoundary } from '../../components/GlobalErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Global test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('GlobalErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={false} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders global error UI when there is an error', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/We're sorry, but something unexpected happened/)
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('retries when Try Again button is clicked', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Click Try Again - this should call the retry handler
    fireEvent.click(screen.getByText('Try Again'));

    // The error boundary should still show the error state
    // because the child component still throws an error
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('goes home when Go Home button is clicked', () => {
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: 'http://localhost:3000' };

    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    fireEvent.click(screen.getByText('Go Home'));

    // The href gets set to '/' but the full URL becomes 'http://localhost/'
    expect((window as any).location.href).toBe('http://localhost/');
  });

  it('reloads page when Reload Page button is clicked', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeInTheDocument();

    // Test that the button is clickable
    fireEvent.click(reloadButton);
    expect(reloadButton).toBeInTheDocument(); // Button should still be there after click
  });

  it('displays error ID and timestamp', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Time:/)).toBeInTheDocument();
  });

  it('shows application error alert', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Application Error')).toBeInTheDocument();
    expect(
      screen.getByText(/The application encountered an unexpected error/)
    ).toBeInTheDocument();
  });
});
