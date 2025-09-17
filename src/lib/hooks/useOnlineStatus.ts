'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status
 * Uses the Navigator.onLine API and listens for online/offline events
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // Initialize with the current online status
    if (typeof window !== 'undefined') {
      return navigator.onLine;
    }
    // Default to true for SSR
    return true;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = (): void => {
      setIsOnline(true);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
