'use client';

import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { EmptyState } from './EmptyState';

interface AsyncWrapperProps {
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  loadingVariant?: 'spinner' | 'skeleton';
  errorVariant?: 'alert' | 'paper' | 'minimal';
  minHeight?: number | string;
}

export const AsyncWrapper: React.FC<AsyncWrapperProps> = ({
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There is no data to display at the moment.',
  emptyActionLabel,
  onEmptyAction,
  loadingMessage = 'Loading...',
  errorTitle = 'Something went wrong',
  errorMessage = 'An error occurred while loading the data.',
  onRetry,
  children,
  sx,
  loadingVariant = 'spinner',
  errorVariant = 'alert',
  minHeight = 200,
}) => {
  const containerSx: SxProps<Theme> = {
    minHeight,
    ...sx,
  };

  if (loading) {
    return (
      <Box sx={containerSx}>
        {loadingVariant === 'spinner' ? (
          <LoadingSpinner message={loadingMessage} />
        ) : (
          <Box sx={{ p: 2 }}>
            {/* Default skeleton loading */}
            <LoadingSpinner message={loadingMessage} />
          </Box>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={containerSx}>
        <ErrorDisplay
          title={errorTitle}
          message={errorMessage}
          error={error}
          onRetry={onRetry}
          variant={errorVariant}
        />
      </Box>
    );
  }

  if (empty) {
    return (
      <Box sx={containerSx}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </Box>
    );
  }

  return <Box sx={containerSx}>{children}</Box>;
};

export default AsyncWrapper;
