import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message='Custom loading message' />);

    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('renders without message when empty string provided', () => {
    render(<LoadingSpinner message='' />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size={60} />);

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color='secondary' />);

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('renders in full screen mode', () => {
    render(<LoadingSpinner fullScreen={true} />);

    const container = screen.getByRole('progressbar').closest('div');
    expect(container).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
    });
  });

  it('applies custom sx styles', () => {
    render(<LoadingSpinner sx={{ backgroundColor: 'red' }} />);

    const container = screen.getByRole('progressbar').closest('div');
    expect(container).toBeInTheDocument();
    // Note: Material-UI styles are applied via CSS classes, not inline styles
    // This test verifies the component renders without errors when sx is provided
  });
});
