import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/app/theme';
import { AuthProvider } from '../../components/AuthProvider';
import { User } from '@/types/auth';

// Mock user for testing
export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@company.com',
  name: 'Test User',
  image: 'https://example.com/avatar.jpg',
  roles: [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all functions',
      permissions: [
        {
          id: 'read',
          name: 'Read Access',
          description: 'Can view content',
          resource: '*',
          action: 'read',
        },
        {
          id: 'write',
          name: 'Write Access',
          description: 'Can modify content',
          resource: '*',
          action: 'write',
        },
        {
          id: 'delete',
          name: 'Delete Access',
          description: 'Can delete content',
          resource: '*',
          action: 'delete',
        },
        {
          id: 'manage_users',
          name: 'Manage Users',
          description: 'Can manage user accounts',
          resource: 'users',
          action: 'manage',
        },
      ],
    },
  ],
  permissions: [
    {
      id: 'read',
      name: 'Read Access',
      description: 'Can view content',
      resource: '*',
      action: 'read',
    },
    {
      id: 'write',
      name: 'Write Access',
      description: 'Can modify content',
      resource: '*',
      action: 'write',
    },
    {
      id: 'delete',
      name: 'Delete Access',
      description: 'Can delete content',
      resource: '*',
      action: 'delete',
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Can manage user accounts',
      resource: 'users',
      action: 'manage',
    },
  ],
};

// Mock NextAuth session
export const mockSession = {
  user: mockUser,
  expires: '2024-12-31T23:59:59.999Z',
};

// Mock useAuth hook
export const mockUseAuth = {
  user: mockUser,
  loading: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
  hasPermission: jest.fn((permission: string) => {
    return mockUser.permissions.some(
      p => p.id === permission || p.id === 'admin'
    );
  }),
  hasRole: jest.fn((role: string) => {
    return mockUser.roles.some(r => r.id === role || r.id === 'admin');
  }),
};

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession, status: 'authenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(() => Promise.resolve(mockSession)),
}));

// Mock useAuth hook
jest.mock('../../components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='auth-provider-mock'>{children}</div>
  ),
  useAuth: () => mockUseAuth,
}));

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: User | null;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { user: _user = mockUser, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };

// Simple test to avoid empty test suite error
describe('Test Utils', () => {
  it('should export renderWithProviders function', () => {
    expect(renderWithProviders).toBeDefined();
    expect(typeof renderWithProviders).toBe('function');
  });
});
