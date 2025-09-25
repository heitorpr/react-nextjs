'use client';

import React from 'react';
import { Container, Paper, SxProps, Theme } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  elevation?: number;
  sx?: SxProps<Theme>;
  disablePadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  elevation = 1,
  sx,
  disablePadding = false,
}) => {
  const content = (
    <Container maxWidth={maxWidth} sx={{ py: disablePadding ? 0 : 4, ...sx }}>
      {children}
    </Container>
  );

  if (elevation === 0) {
    return content;
  }

  return <Paper elevation={elevation}>{content}</Paper>;
};

export default PageContainer;
