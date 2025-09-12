import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UIDemoPage from '../../../app/ui-demo/page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the example components
jest.mock('../../../components/examples', () => ({
  UserList: () => <div data-testid='user-list'>User List Component</div>,
  DataTable: () => <div data-testid='data-table'>Data Table Component</div>,
  LoadingExamples: () => (
    <div data-testid='loading-examples'>Loading Examples Component</div>
  ),
}));

describe('UI Demo Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with navigation', () => {
    render(<UIDemoPage />);

    expect(screen.getByText('UI Components Demo')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
  });

  it('renders all tabs', () => {
    render(<UIDemoPage />);

    expect(
      screen.getByRole('tab', { name: 'Loading Examples' })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'User List' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Data Table' })).toBeInTheDocument();
  });

  it('shows Loading Examples tab by default', () => {
    render(<UIDemoPage />);

    expect(screen.getByTestId('loading-examples')).toBeInTheDocument();
    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('switches to User List tab when clicked', () => {
    render(<UIDemoPage />);

    const userListTab = screen.getByRole('tab', { name: 'User List' });
    fireEvent.click(userListTab);

    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-examples')).not.toBeInTheDocument();
    expect(screen.queryByTestId('data-table')).not.toBeInTheDocument();
  });

  it('switches to Data Table tab when clicked', () => {
    render(<UIDemoPage />);

    const dataTableTab = screen.getByRole('tab', { name: 'Data Table' });
    fireEvent.click(dataTableTab);

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-examples')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument();
  });

  it('switches back to Loading Examples tab', () => {
    render(<UIDemoPage />);

    // First switch to User List
    const userListTab = screen.getByRole('tab', { name: 'User List' });
    fireEvent.click(userListTab);
    expect(screen.getByTestId('user-list')).toBeInTheDocument();

    // Then switch back to Loading Examples
    const loadingTab = screen.getByRole('tab', { name: 'Loading Examples' });
    fireEvent.click(loadingTab);

    expect(screen.getByTestId('loading-examples')).toBeInTheDocument();
    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument();
  });

  it('calls router.push when back button is clicked', () => {
    render(<UIDemoPage />);

    const backButton = screen.getByTestId('ArrowBackIcon').closest('button');
    fireEvent.click(backButton!);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('has proper tab accessibility attributes', () => {
    render(<UIDemoPage />);

    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    // Check that the first tab is selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('updates tab selection when switching tabs', () => {
    render(<UIDemoPage />);

    const tabs = screen.getAllByRole('tab');
    const userListTab = tabs[1];

    fireEvent.click(userListTab);

    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });
});
