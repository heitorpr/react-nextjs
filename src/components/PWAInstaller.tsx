'use client';

import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, Box, Typography } from '@mui/material';
import { GetApp, Close } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller(): React.JSX.Element {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // eslint-disable-next-line no-console
      console.log('User accepted the install prompt');
    } else {
      // eslint-disable-next-line no-console
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleClose = (): void => {
    setShowInstallPrompt(false);
  };

  if (isInstalled) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant='body2' color='success.main'>
          ✅ App is installed and ready to use offline!
        </Typography>
      </Box>
    );
  }

  return (
    <Snackbar
      open={showInstallPrompt}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity='info'
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color='inherit'
              size='small'
              onClick={handleInstallClick}
              startIcon={<GetApp />}
            >
              Install
            </Button>
            <Button
              color='inherit'
              size='small'
              onClick={handleClose}
              startIcon={<Close />}
            >
              Dismiss
            </Button>
          </Box>
        }
        sx={{ width: '100%' }}
      >
        Install this app for a better experience with offline support!
      </Alert>
    </Snackbar>
  );
}
