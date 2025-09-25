'use client';

import React from 'react';
import { Box, Container, Typography, SxProps, Theme } from '@mui/material';

interface DashboardLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: SxProps<Theme>;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  sx,
}) => {
  return (
    <Container maxWidth={maxWidth} sx={{ mt: 4, mb: 4, ...sx }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 4 }}>
          {title && (
            <Typography variant='h4' component='h1' gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant='subtitle1' color='text.secondary'>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {children}
    </Container>
  );
};

export default DashboardLayout;
