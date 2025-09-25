import { useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { usePermissions } from './usePermissions';

/**
 * Hook that memoizes permission checks to avoid unnecessary recalculations
 */
export const useMemoizedPermissions = () => {
  const { user } = useAuth();
  const { hasPermission, hasRole, hasAccess } = usePermissions();

  // Memoize user permissions and roles for performance
  const memoizedUserPermissions = useMemo(() => {
    return user?.permissions.map(p => p.id) || [];
  }, [user?.permissions]);

  const memoizedUserRoles = useMemo(() => {
    return user?.roles.map(r => r.id) || [];
  }, [user?.roles]);

  // Memoize common permission checks
  const isAdmin = useMemo(() => {
    return hasRole('admin');
  }, [hasRole]);

  const canRead = useMemo(() => {
    return hasPermission('read');
  }, [hasPermission]);

  const canWrite = useMemo(() => {
    return hasPermission('write');
  }, [hasPermission]);

  const canDelete = useMemo(() => {
    return hasPermission('delete');
  }, [hasPermission]);

  const canManageUsers = useMemo(() => {
    return hasPermission('manage_users');
  }, [hasPermission]);

  const isOperator = useMemo(() => {
    return hasRole('operator');
  }, [hasRole]);

  const isViewer = useMemo(() => {
    return hasRole('viewer');
  }, [hasRole]);

  return {
    user,
    memoizedUserPermissions,
    memoizedUserRoles,
    isAdmin,
    canRead,
    canWrite,
    canDelete,
    canManageUsers,
    isOperator,
    isViewer,
    hasPermission,
    hasRole,
    hasAccess,
  };
};
