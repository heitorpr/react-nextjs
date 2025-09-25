import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../../../components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState title='No data' />);

    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <EmptyState title='Custom Title' description='Custom description text' />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders with action button when provided', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState
        title='No items'
        actionLabel='Add Item'
        onAction={mockAction}
      />
    );

    const button = screen.getByText('Add Item');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders with custom icon', () => {
    const customIcon = <div data-testid='custom-icon'>Custom Icon</div>;
    render(<EmptyState title='Custom Icon' icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<EmptyState title='Search' variant='search' />);
    expect(screen.getByText('Search')).toBeInTheDocument();

    rerender(<EmptyState title='Offline' variant='offline' />);
    expect(screen.getByText('Offline')).toBeInTheDocument();

    rerender(<EmptyState title='Create' variant='create' />);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(<EmptyState title='Title only' />);

    expect(screen.getByText('Title only')).toBeInTheDocument();
    // Should not render description paragraph
    expect(
      screen.queryByText('Custom description text')
    ).not.toBeInTheDocument();
  });

  it('renders without action button when not provided', () => {
    render(<EmptyState title='No action' />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom sx styles', () => {
    render(<EmptyState title='Styled' sx={{ backgroundColor: 'red' }} />);

    const paper = screen.getByText('Styled').closest('[class*="MuiPaper"]');
    expect(paper).toBeInTheDocument();
  });
});
