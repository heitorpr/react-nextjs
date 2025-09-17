'use client';

import React from 'react';
import {
  Alert,
  AlertTitle,
  Slide,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  /**
   * Whether to show the indicator when offline
   * @default true
   */
  showWhenOffline?: boolean;
  /**
   * Whether to show the indicator when online (briefly)
   * @default false
   */
  showWhenOnline?: boolean;
  /**
   * Duration to show the online indicator in milliseconds
   * @default 3000
   */
  onlineIndicatorDuration?: number;
  /**
   * Whether the indicator can be dismissed
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback when the indicator is dismissed
   */
  onDismiss?: () => void;
}

export default function OfflineIndicator({
  showWhenOffline = true,
  showWhenOnline = false,
  onlineIndicatorDuration = 3000,
  dismissible = false,
  onDismiss,
}: OfflineIndicatorProps): React.JSX.Element | null {
  const isOnline = useOnlineStatus();
  const [showIndicator, setShowIndicator] = React.useState<boolean>(false);
  const [isDismissed, setIsDismissed] = React.useState<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle online status changes
  React.useEffect(() => {
    if (isOnline) {
      if (showWhenOnline) {
        setShowIndicator(true);
        // Auto-hide after duration
        timeoutRef.current = setTimeout(() => {
          setShowIndicator(false);
        }, onlineIndicatorDuration);
      } else {
        setShowIndicator(false);
      }
      // Reset dismissed state when coming back online
      setIsDismissed(false);
    } else {
      if (showWhenOffline) {
        setShowIndicator(true);
      }
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOnline, showWhenOffline, showWhenOnline, onlineIndicatorDuration]);

  // Handle dismiss
  const handleDismiss = (): void => {
    setIsDismissed(true);
    setShowIndicator(false);
    onDismiss?.();
  };

  // Don't show if dismissed or not supposed to show
  if (isDismissed || !showIndicator) {
    return null;
  }

  const isOffline = !isOnline;

  return (
    <Slide direction='down' in={showIndicator} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 56, sm: 64 }, // Responsive: 56px on mobile, 64px on desktop
          left: 0,
          right: 0,
          zIndex: 1200, // Below AppBar (1300) but above other content
          p: 1,
        }}
      >
        <Alert
          severity={isOffline ? 'warning' : 'success'}
          icon={isOffline ? <WifiOffIcon /> : <WifiIcon />}
          action={
            dismissible ? (
              <IconButton
                aria-label='dismiss'
                color='inherit'
                size='small'
                onClick={handleDismiss}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            ) : undefined
          }
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <AlertTitle>
            {isOffline ? 'You are offline' : 'You are back online'}
          </AlertTitle>
          <Typography variant='body2'>
            {isOffline
              ? 'Some features may be limited. Your data will sync when you reconnect.'
              : 'All features are now available.'}
          </Typography>
        </Alert>
      </Box>
    </Slide>
  );
}
