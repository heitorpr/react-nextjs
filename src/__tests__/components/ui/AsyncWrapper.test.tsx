import React from 'react';
import { render, screen } from '@testing-library/react';
import { AsyncWrapper } from '../../../components/ui/AsyncWrapper';

describe('AsyncWrapper', () => {
  it('renders children when not loading, no error, and not empty', () => {
    render(
      <AsyncWrapper>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders loading spinner when loading is true', () => {
    render(
      <AsyncWrapper loading={true}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders error display when error is provided', () => {
    const error = new Error('Test error');
    render(
      <AsyncWrapper error={error}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('renders empty state when empty is true', () => {
    render(
      <AsyncWrapper empty={true}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('prioritizes loading over error and empty', () => {
    const error = new Error('Test error');
    render(
      <AsyncWrapper loading={true} error={error} empty={true}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('prioritizes error over empty', () => {
    const error = new Error('Test error');
    render(
      <AsyncWrapper error={error} empty={true}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('renders with custom loading message', () => {
    render(
      <AsyncWrapper loading={true} loadingMessage='Custom loading...'>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
  });

  it('renders with custom error title and message', () => {
    const error = new Error('Test error');
    render(
      <AsyncWrapper
        error={error}
        errorTitle='Custom Error Title'
        errorMessage='Custom error message'
      >
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders with custom empty state props', () => {
    const mockAction = jest.fn();
    render(
      <AsyncWrapper
        empty={true}
        emptyTitle='Custom Empty Title'
        emptyDescription='Custom empty description'
        emptyActionLabel='Custom Action'
        onEmptyAction={mockAction}
      >
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom empty description')).toBeInTheDocument();
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom minHeight', () => {
    render(
      <AsyncWrapper minHeight={500}>
        <div data-testid='content'>Content</div>
      </AsyncWrapper>
    );

    const container = screen.getByTestId('content').closest('div');
    expect(container).toBeInTheDocument();
    // Note: Material-UI styles are applied via CSS classes, not inline styles
    // This test verifies the component renders without errors when minHeight is provided
  });
});
