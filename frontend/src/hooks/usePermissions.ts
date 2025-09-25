import { useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';

/**
 * Custom hook for permission and role checking
 * Provides memoized functions for checking user permissions and roles
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return user.permissions.some(
        p => p.id === permission || p.id === 'admin'
      );
    },
    [user]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;
      return user.roles.some(r => r.id === role || r.id === 'admin');
    },
    [user]
  );

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false;
      return permissions.some(permission => hasPermission(permission));
    },
    [user, hasPermission]
  );

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!user) return false;
      return roles.some(role => hasRole(role));
    },
    [user, hasRole]
  );

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false;
      return permissions.every(permission => hasPermission(permission));
    },
    [user, hasPermission]
  );

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useCallback(
    (roles: string[]): boolean => {
      if (!user) return false;
      return roles.every(role => hasRole(role));
    },
    [user, hasRole]
  );

  /**
   * Check if user has access to a route or feature based on requirements
   */
  const hasAccess = useCallback(
    (requirements: {
      requiredRoles?: string[];
      requiredPermissions?: string[];
    }): boolean => {
      if (!user) return false;

      // Check role requirements
      if (requirements.requiredRoles) {
        if (!hasAnyRole(requirements.requiredRoles)) return false;
      }

      // Check permission requirements
      if (requirements.requiredPermissions) {
        if (!hasAnyPermission(requirements.requiredPermissions)) return false;
      }

      return true;
    },
    [user, hasAnyRole, hasAnyPermission]
  );

  /**
   * Get user's role names as an array
   */
  const getUserRoles = useCallback((): string[] => {
    return user?.roles.map(role => role.id) || [];
  }, [user]);

  /**
   * Get user's permission names as an array
   */
  const getUserPermissions = useCallback((): string[] => {
    return user?.permissions.map(permission => permission.id) || [];
  }, [user]);

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAnyRole,
    hasAllPermissions,
    hasAllRoles,
    hasAccess,
    getUserRoles,
    getUserPermissions,
  };
};

/**
 * Legacy compatibility - export individual functions for backward compatibility
 */
export const usePermissionCheck = () => {
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole } =
    usePermissions();

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAnyRole,
  };
};
