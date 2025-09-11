import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentErrorBoundary } from '../../components/ComponentErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Component test error');
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

describe('ComponentErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ComponentErrorBoundary componentName='TestComponent'>
        <ThrowError shouldThrow={false} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders component error UI when there is an error', () => {
    render(
      <ComponentErrorBoundary componentName='TestComponent'>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('TestComponent Error')).toBeInTheDocument();
    expect(
      screen.getByText(/This component encountered an error/)
    ).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders generic component error when no component name is provided', () => {
    render(
      <ComponentErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('Component Error')).toBeInTheDocument();
  });

  it('renders custom fallback UI when provided', () => {
    const customFallback = <div>Custom component error</div>;

    render(
      <ComponentErrorBoundary
        componentName='TestComponent'
        fallback={customFallback}
      >
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('Custom component error')).toBeInTheDocument();
    expect(screen.queryByText('TestComponent Error')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <ComponentErrorBoundary componentName='TestComponent' onError={onError}>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('retries when Retry button is clicked', () => {
    render(
      <ComponentErrorBoundary componentName='TestComponent'>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('TestComponent Error')).toBeInTheDocument();

    // Click Retry - this should call the retry handler
    fireEvent.click(screen.getByText('Retry'));

    // The error boundary should still show the error state
    // because the child component still throws an error
    expect(screen.getByText('TestComponent Error')).toBeInTheDocument();
  });

  it('renders as warning alert', () => {
    render(
      <ComponentErrorBoundary componentName='TestComponent'>
        <ThrowError shouldThrow={true} />
      </ComponentErrorBoundary>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('MuiAlert-standardWarning');
  });
});
