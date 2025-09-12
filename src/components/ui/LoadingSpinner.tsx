'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  color?: 'primary' | 'secondary' | 'inherit';
  sx?: SxProps<Theme>;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Loading...',
  color = 'primary',
  sx,
  fullScreen = false,
}) => {
  const containerSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999,
    }),
    ...sx,
  };

  return (
    <Box sx={containerSx}>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant='body2' color='text.secondary'>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
