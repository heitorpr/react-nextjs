import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { usePermissions } from './usePermissions';
import { QUICK_ACTIONS } from '@/config/routes';

/**
 * Custom hook for dashboard functionality
 */
export const useDashboard = () => {
  const { user } = useAuth();
  const { hasAccess } = usePermissions();
  const router = useRouter();

  /**
   * Navigate to a specific function
   */
  const navigateToFunction = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  /**
   * Get available quick actions for the current user
   */
  const getAvailableActions = useCallback(() => {
    return QUICK_ACTIONS.filter(action =>
      hasAccess({
        requiredRoles: (action as any).requiredRoles as string[],
        requiredPermissions: (action as any).requiredPermissions as string[],
      })
    );
  }, [hasAccess]);

  /**
   * Check if user has access to a specific action
   */
  const hasActionAccess = useCallback(
    (action: any) => {
      return hasAccess({
        requiredRoles: action.requiredRoles as string[],
        requiredPermissions: action.requiredPermissions as string[],
      });
    },
    [hasAccess]
  );

  /**
   * Get system information for the dashboard
   */
  const getSystemInfo = useCallback(() => {
    return {
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'Operations Backoffice',
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      user: user?.name || 'Unknown User',
      roles: user?.roles.map(role => role.name).join(', ') || 'No roles',
    };
  }, [user]);

  return {
    user,
    navigateToFunction,
    getAvailableActions,
    hasActionAccess,
    getSystemInfo,
  };
};
