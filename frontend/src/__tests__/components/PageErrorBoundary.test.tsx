import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageErrorBoundary } from '../../components/PageErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Page test error');
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

describe('PageErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError shouldThrow={false} />
      </PageErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders page error UI when there is an error', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();
    expect(screen.getByText('Error in Test Page')).toBeInTheDocument();
    expect(
      screen.getByText(/This page encountered an error/)
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('renders generic page error when no page name is provided', () => {
    render(
      <PageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(screen.getAllByText('Page Error')).toHaveLength(2); // Title and alert title
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <PageErrorBoundary pageName='Test Page' onError={onError}>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('retries when Try Again button is clicked', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(screen.getByText('Page Error')).toBeInTheDocument();

    // Click Try Again - this should call the retry handler
    fireEvent.click(screen.getByText('Try Again'));

    // The error boundary should still show the error state
    // because the child component still throws an error
    expect(screen.getByText('Page Error')).toBeInTheDocument();
  });

  it('goes back when Go Back button is clicked', () => {
    const backSpy = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    fireEvent.click(screen.getByText('Go Back'));

    expect(backSpy).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  it('shows contact support message', () => {
    render(
      <PageErrorBoundary pageName='Test Page'>
        <ThrowError shouldThrow={true} />
      </PageErrorBoundary>
    );

    expect(
      screen.getByText(/If this problem persists, please contact support/)
    ).toBeInTheDocument();
  });
});
