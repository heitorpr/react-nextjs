import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { mockSession } from '@/__tests__/utils/test-utils';

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession, status: 'authenticated' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='session-provider'>{children}</div>
  ),
}));

// Test component to access auth context
function TestComponent() {
  const { user, loading, hasPermission, hasRole } = useAuth();

  return (
    <div>
      <div data-testid='user-name'>{user?.name}</div>
      <div data-testid='user-email'>{user?.email}</div>
      <div data-testid='loading'>{loading.toString()}</div>
      <div data-testid='has-read-permission'>
        {hasPermission('read').toString()}
      </div>
      <div data-testid='has-admin-role'>{hasRole('admin').toString()}</div>
    </div>
  );
}

describe('AuthProvider', () => {
  it('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('session-provider')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@company.com'
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('checks permissions correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-read-permission')).toHaveTextContent('true');
  });

  it('checks roles correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('has-admin-role')).toHaveTextContent('true');
  });

  it('throws error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
