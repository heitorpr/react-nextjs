import {
  getUserRoles,
  getUserPermissions,
  ROLES,
  PERMISSIONS,
} from '@/config/auth';
import { User, Role, Permission } from '@/types/auth';
import { Session } from 'next-auth';

/**
 * Authentication service for managing user data and permissions
 * Centralizes all auth-related business logic
 */
export class AuthService {
  /**
   * Create a user object with roles and permissions from session data
   */
  static createUserFromSession(session: Session, token: any): User {
    const email = session.user?.email || '';
    const roleIds = getUserRoles(email);
    const roles = roleIds.map(roleId => ROLES[roleId]).filter(Boolean);
    const permissions = getUserPermissions(email);

    return {
      id: token.sub || '',
      email: session.user?.email || '',
      name: session.user?.name || '',
      image: session.user?.image || undefined,
      roles,
      permissions,
    };
  }

  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    return user.permissions.some(p => p.id === permission || p.id === 'admin');
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: User | null, role: string): boolean {
    if (!user) return false;
    return user.roles.some(r => r.id === role || r.id === 'admin');
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.some(permission => this.hasPermission(user, permission));
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: User | null, roles: string[]): boolean {
    if (!user) return false;
    return roles.some(role => this.hasRole(user, role));
  }

  /**
   * Check if user has access to a feature based on requirements
   */
  static hasAccess(
    user: User | null,
    requirements: {
      requiredRoles?: string[];
      requiredPermissions?: string[];
    }
  ): boolean {
    if (!user) return false;

    // Check role requirements
    if (requirements.requiredRoles) {
      if (!this.hasAnyRole(user, requirements.requiredRoles)) return false;
    }

    // Check permission requirements
    if (requirements.requiredPermissions) {
      if (!this.hasAnyPermission(user, requirements.requiredPermissions))
        return false;
    }

    return true;
  }

  /**
   * Get all available roles
   */
  static getAllRoles(): Role[] {
    return Object.values(ROLES);
  }

  /**
   * Get all available permissions
   */
  static getAllPermissions(): Permission[] {
    return Object.values(PERMISSIONS);
  }

  /**
   * Get role by ID
   */
  static getRoleById(roleId: string): Role | undefined {
    return ROLES[roleId];
  }

  /**
   * Get permission by ID
   */
  static getPermissionById(permissionId: string): Permission | undefined {
    return PERMISSIONS[permissionId];
  }

  /**
   * Check if an email is allowed to sign in
   * In a real application, this would check against a whitelist or database
   */
  static isEmailAllowed(email: string): boolean {
    // For now, allow all emails - in production, implement proper whitelist logic
    return email.includes('@');
  }

  /**
   * Get user's effective permissions (including inherited from roles)
   */
  static getUserEffectivePermissions(user: User | null): Permission[] {
    if (!user) return [];

    // Get permissions from roles
    const rolePermissions = user.roles.flatMap(role => role.permissions);

    // Get direct permissions
    const directPermissions = user.permissions;

    // Combine and deduplicate
    const allPermissions = [...rolePermissions, ...directPermissions];
    const uniquePermissions = Array.from(
      new Map(allPermissions.map(p => [p.id, p])).values()
    );

    return uniquePermissions;
  }
}
