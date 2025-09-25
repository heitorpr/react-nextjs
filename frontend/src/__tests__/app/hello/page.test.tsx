import React from 'react';
import { renderWithProviders, screen } from '@/__tests__/utils/test-utils';
import HelloWorldPage from '@/app/hello/page';

describe('Hello World Page', () => {
  it('renders the page heading', () => {
    renderWithProviders(<HelloWorldPage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hello World Function');
  });

  it('renders the info alert', () => {
    renderWithProviders(<HelloWorldPage />);

    const alert = screen.getByText(
      /This is a sample function to demonstrate the system behavior/
    );
    expect(alert).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderWithProviders(<HelloWorldPage />);

    expect(screen.getByText(/Welcome, Test User!/)).toBeInTheDocument();
    expect(
      screen.getByText(/This is the Hello World function page/)
    ).toBeInTheDocument();
  });

  it('shows the system behavior list', () => {
    renderWithProviders(<HelloWorldPage />);

    expect(
      screen.getByText('Authentication and user information display')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Permission-based access control')
    ).toBeInTheDocument();
    expect(screen.getByText('Navigation menu integration')).toBeInTheDocument();
    expect(
      screen.getByText('Responsive layout with Material-UI')
    ).toBeInTheDocument();
  });

  it('displays user information section', () => {
    renderWithProviders(<HelloWorldPage />);

    const userInfoHeading = screen.getByText('User Information:');
    expect(userInfoHeading).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === 'Name: Test User';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === 'Email: test@company.com';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === 'Roles: Administrator';
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent ===
          'Permissions: Read Access, Write Access, Delete Access, Manage Users'
        );
      })
    ).toBeInTheDocument();
  });

  it('shows permission requirement information', () => {
    renderWithProviders(<HelloWorldPage />);

    const permissionInfo = screen.getByText(
      /This function requires 'read' permission to access/
    );
    expect(permissionInfo).toBeInTheDocument();
  });
});
