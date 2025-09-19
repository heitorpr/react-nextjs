import { Role, Permission } from '@/types/auth';

// Mock data for users and permissions
// In a real application, this would come from a database
export const PERMISSIONS: Record<string, Permission> = {
  read: {
    id: 'read',
    name: 'Read Access',
    description: 'Can view content',
    resource: '*',
    action: 'read',
  },
  write: {
    id: 'write',
    name: 'Write Access',
    description: 'Can modify content',
    resource: '*',
    action: 'write',
  },
  delete: {
    id: 'delete',
    name: 'Delete Access',
    description: 'Can delete content',
    resource: '*',
    action: 'delete',
  },
  manage_users: {
    id: 'manage_users',
    name: 'Manage Users',
    description: 'Can manage user accounts',
    resource: 'users',
    action: 'manage',
  },
} as const;

export const ROLES: Record<string, Role> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all functions',
    permissions: [
      PERMISSIONS.read,
      PERMISSIONS.write,
      PERMISSIONS.delete,
      PERMISSIONS.manage_users,
    ],
  },
  operator: {
    id: 'operator',
    name: 'Operator',
    description: 'Access to operational functions',
    permissions: [PERMISSIONS.read, PERMISSIONS.write],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [PERMISSIONS.read],
  },
} as const;

// Mock user data mapping emails to roles
// In a real application, this would come from a database
export const USER_ROLES: Record<string, string[]> = {
  'admin@company.com': ['admin'],
  'operator@company.com': ['operator'],
  'viewer@company.com': ['viewer'],
  'test@company.com': ['admin'], // For testing purposes
  'heitorprodrigues@gmail.com': ['viewer'], // Add your email with viewer role
  // Default role for any other authenticated user
  default: ['viewer'],
} as const;

// Helper functions for role and permission management
export function getUserRoles(email: string): string[] {
  return USER_ROLES[email] || USER_ROLES['default'];
}

export function getRoleById(roleId: string): Role | undefined {
  return ROLES[roleId];
}

export function getPermissionById(
  permissionId: string
): Permission | undefined {
  return PERMISSIONS[permissionId];
}

export function getUserPermissions(email: string): Permission[] {
  const roleIds = getUserRoles(email);
  const roles = roleIds
    .map(roleId => getRoleById(roleId))
    .filter(Boolean) as Role[];
  const permissions = roles.flatMap(role => role.permissions);

  // Remove duplicates
  const uniquePermissions = Array.from(new Set(permissions.map(p => p.id)))
    .map(id => getPermissionById(id))
    .filter(Boolean) as Permission[];

  return uniquePermissions;
}
