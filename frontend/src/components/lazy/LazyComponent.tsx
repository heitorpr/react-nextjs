'use client';

import React, { Suspense, ReactNode } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingText?: string;
}

const DefaultFallback: React.FC<{ loadingText?: string }> = ({
  loadingText = 'Loading...',
}) => (
  <Box
    display='flex'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'
    minHeight={200}
    gap={2}
  >
    <CircularProgress />
    <Typography variant='body2' color='text.secondary'>
      {loadingText}
    </Typography>
  </Box>
);

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  loadingText,
}) => {
  const fallbackComponent = fallback || (
    <DefaultFallback loadingText={loadingText} />
  );

  return <Suspense fallback={fallbackComponent}>{children}</Suspense>;
};

export default LazyComponent;
