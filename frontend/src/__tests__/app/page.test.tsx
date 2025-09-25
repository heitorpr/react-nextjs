import React from 'react';
import {
  renderWithProviders,
  screen,
  fireEvent,
} from '@/__tests__/utils/test-utils';
import Dashboard from '@/app/page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard heading', () => {
    renderWithProviders(<Dashboard />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Operations Dashboard');
  });

  it('renders the welcome message with user name', () => {
    renderWithProviders(<Dashboard />);

    const welcomeMessage = screen.getByText(/Welcome back, Test User!/);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('renders the info alert', () => {
    renderWithProviders(<Dashboard />);

    const alert = screen.getByText(
      /This is the main dashboard for the operations backoffice system/
    );
    expect(alert).toBeInTheDocument();
  });

  it('renders the Hello World function card', () => {
    renderWithProviders(<Dashboard />);

    const helloWorldCard = screen.getByText('Hello World');
    expect(helloWorldCard).toBeInTheDocument();

    const helloWorldDescription = screen.getByText(
      'Sample function to demonstrate system behavior'
    );
    expect(helloWorldDescription).toBeInTheDocument();
  });

  it('renders the Operations card', () => {
    renderWithProviders(<Dashboard />);

    const operationsCard = screen.getByText('Operations');
    expect(operationsCard).toBeInTheDocument();

    const operationsDescription = screen.getByText(
      'Operational functions and tools'
    );
    expect(operationsDescription).toBeInTheDocument();
  });

  it('renders the Administration card', () => {
    renderWithProviders(<Dashboard />);

    const adminCard = screen.getByText('Administration');
    expect(adminCard).toBeInTheDocument();

    const adminDescription = screen.getByText('User and system administration');
    expect(adminDescription).toBeInTheDocument();
  });

  it('navigates to Hello World function when clicked', () => {
    renderWithProviders(<Dashboard />);

    // Find the Hello World card specifically
    const helloWorldCard = screen
      .getByText('Hello World')
      .closest('.MuiCard-root');
    const helloWorldButton = helloWorldCard?.querySelector('button');
    fireEvent.click(helloWorldButton!);

    expect(mockPush).toHaveBeenCalledWith('/hello');
  });

  it('renders system information section', () => {
    renderWithProviders(<Dashboard />);

    const systemInfoHeading = screen.getByText('System Information');
    expect(systemInfoHeading).toBeInTheDocument();

    const userInfo = screen.getByText(/Test User \(test@company.com\)/);
    expect(userInfo).toBeInTheDocument();

    const rolesInfo = screen.getByText(/Administrator/);
    expect(rolesInfo).toBeInTheDocument();
  });

  it('shows all quick action cards for admin user', () => {
    renderWithProviders(<Dashboard />);

    const accessButtons = screen.getAllByText('Access Function');
    expect(accessButtons).toHaveLength(3); // Hello World, Operations, Administration
  });
});
