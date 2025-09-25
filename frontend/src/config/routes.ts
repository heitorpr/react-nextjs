import { MenuItem } from '@/types/auth';

// Route configuration for middleware
export const ROUTE_CONFIGS = {
  '/admin': {
    requiredRoles: ['admin'],
  },
  '/operations': {
    requiredRoles: ['admin', 'operator'],
  },
  '/hello': {
    requiredPermissions: ['read'],
  },
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/auth/signin',
  '/auth/error',
  '/unauthorized',
] as const;

// Navigation menu configuration
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Dashboard',
    requiredPermissions: ['read'],
  },
  {
    id: 'hello',
    label: 'Hello World',
    path: '/hello',
    icon: 'Home',
    requiredPermissions: ['read'],
  },
  {
    id: 'operations',
    label: 'Operations',
    path: '/operations',
    icon: 'Settings',
    requiredRoles: ['admin', 'operator'],
  },
  {
    id: 'admin',
    label: 'Administration',
    path: '/admin',
    icon: 'People',
    requiredRoles: ['admin'],
  },
] as const;

// Dashboard quick actions configuration
export const QUICK_ACTIONS = [
  {
    title: 'Hello World',
    description: 'Sample function to demonstrate system behavior',
    icon: 'Home',
    path: '/hello',
    requiredPermissions: ['read'],
  },
  {
    title: 'Operations',
    description: 'Operational functions and tools',
    icon: 'Settings',
    path: '/operations',
    requiredRoles: ['admin', 'operator'],
  },
  {
    title: 'Administration',
    description: 'User and system administration',
    icon: 'People',
    path: '/admin',
    requiredRoles: ['admin'],
  },
] as const;

// Type guards for route checking
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname as any);
}

export function getRouteConfig(pathname: string) {
  for (const [path, config] of Object.entries(ROUTE_CONFIGS)) {
    if (pathname.startsWith(path)) {
      return config;
    }
  }
  return null;
}
