'use client';

import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
  Paper,
  SxProps,
  Theme,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error | string;
  severity?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
  sx?: SxProps<Theme>;
  variant?: 'alert' | 'paper' | 'minimal';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  severity = 'error',
  showRetry = true,
  showHome = false,
  onRetry,
  onGoHome,
  sx,
  variant = 'alert',
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  if (variant === 'minimal') {
    return (
      <Box sx={{ textAlign: 'center', p: 2, ...sx }}>
        <ErrorIcon color='error' sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant='h6' color='error' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {message}
        </Typography>
        {showRetry && (
          <Button
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{ mr: showHome ? 1 : 0 }}
          >
            Try Again
          </Button>
        )}
        {showHome && (
          <Button
            variant='contained'
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        )}
      </Box>
    );
  }

  if (variant === 'paper') {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto',
          ...sx,
        }}
      >
        <ErrorIcon color='error' sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant='h4' color='error' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          {message}
        </Typography>
        {errorMessage && (
          <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Error Details</AlertTitle>
            {errorMessage}
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {showRetry && (
            <Button
              variant='contained'
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Try Again
            </Button>
          )}
          {showHome && (
            <Button
              variant='outlined'
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
          )}
        </Box>
      </Paper>
    );
  }

  // Default alert variant
  return (
    <Alert
      severity={severity}
      sx={{
        '& .MuiAlert-message': {
          width: '100%',
        },
        ...sx,
      }}
    >
      <AlertTitle>{title}</AlertTitle>
      <Typography variant='body2' sx={{ mb: errorMessage ? 2 : 0 }}>
        {message}
      </Typography>
      {errorMessage && (
        <Box
          component='pre'
          sx={{
            fontSize: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            p: 1,
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 200,
            fontFamily: 'monospace',
          }}
        >
          {errorMessage}
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {showRetry && (
          <Button
            size='small'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
          >
            Retry
          </Button>
        )}
        {showHome && (
          <Button
            size='small'
            variant='text'
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            Home
          </Button>
        )}
      </Box>
    </Alert>
  );
};

export default ErrorDisplay;
