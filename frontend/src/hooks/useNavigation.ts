import { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePermissions } from './usePermissions';
import { MENU_ITEMS } from '@/config/routes';

/**
 * Custom hook for navigation functionality
 */
export const useNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasAccess } = usePermissions();
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Navigate to a specific path
   */
  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  /**
   * Navigate back
   */
  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Get available menu items for the current user
   */
  const getAvailableMenuItems = useCallback(() => {
    return MENU_ITEMS.filter(item =>
      hasAccess({
        requiredRoles: item.requiredRoles,
        requiredPermissions: item.requiredPermissions,
      })
    );
  }, [hasAccess]);

  /**
   * Check if a menu item is active
   */
  const isMenuItemActive = useCallback(
    (itemPath: string) => {
      return pathname === itemPath;
    },
    [pathname]
  );

  /**
   * Toggle mobile drawer
   */
  const toggleMobileDrawer = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  /**
   * Close mobile drawer
   */
  const closeMobileDrawer = useCallback(() => {
    setMobileOpen(false);
  }, []);

  /**
   * Handle navigation with mobile drawer management
   */
  const handleNavigation = useCallback(
    (path: string) => {
      navigateTo(path);
      closeMobileDrawer();
    },
    [navigateTo, closeMobileDrawer]
  );

  return {
    pathname,
    mobileOpen,
    navigateTo,
    navigateBack,
    getAvailableMenuItems,
    isMenuItemActive,
    toggleMobileDrawer,
    closeMobileDrawer,
    handleNavigation,
  };
};
