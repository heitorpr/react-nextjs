import React from 'react';
import { renderWithProviders, screen } from '@/__tests__/utils/test-utils';
import Dashboard from '@/app/page';

describe('App Integration Tests', () => {
  it('renders the complete app with all components', () => {
    renderWithProviders(<Dashboard />);

    // Check main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Operations Dashboard')).toBeInTheDocument();

    // Check welcome message
    expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();

    // Check info alert
    expect(
      screen.getByText(
        /This is the main dashboard for the operations backoffice system/
      )
    ).toBeInTheDocument();

    // Check function cards
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();

    // Check system information
    expect(screen.getByText('System Information')).toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    renderWithProviders(<Dashboard />);

    // Check that access buttons are interactive
    const accessButtons = screen.getAllByText('Access Function');
    expect(accessButtons).toHaveLength(3);

    accessButtons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });

  it('displays all function cards correctly', () => {
    renderWithProviders(<Dashboard />);

    const expectedFunctions = ['Hello World', 'Operations', 'Administration'];

    expectedFunctions.forEach(functionName => {
      expect(screen.getByText(functionName)).toBeInTheDocument();
    });

    // Check descriptions
    expect(
      screen.getByText('Sample function to demonstrate system behavior')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Operational functions and tools')
    ).toBeInTheDocument();
    expect(
      screen.getByText('User and system administration')
    ).toBeInTheDocument();
  });
});
