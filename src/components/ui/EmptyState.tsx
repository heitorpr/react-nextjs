'use client';

import React from 'react';
import { Box, Typography, Button, Paper, SxProps, Theme } from '@mui/material';
import {
  Inbox as InboxIcon,
  SearchOff as SearchOffIcon,
  CloudOff as CloudOffIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'offline' | 'create';
  sx?: SxProps<Theme>;
}

const getDefaultIcon = (variant: string) => {
  switch (variant) {
    case 'search':
      return <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;
    case 'offline':
      return <CloudOffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;
    case 'create':
      return <AddIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;
    default:
      return <InboxIcon sx={{ fontSize: 64, color: 'text.secondary' }} />;
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  sx,
}) => {
  const defaultIcon = getDefaultIcon(variant);
  const displayIcon = icon || defaultIcon;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 6,
        textAlign: 'center',
        maxWidth: 400,
        mx: 'auto',
        backgroundColor: 'background.paper',
        ...sx,
      }}
    >
      <Box sx={{ mb: 3 }}>{displayIcon}</Box>

      <Typography variant='h5' component='h2' gutterBottom color='text.primary'>
        {title}
      </Typography>

      {description && (
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}
        >
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button
          variant='contained'
          onClick={onAction}
          startIcon={variant === 'create' ? <AddIcon /> : undefined}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
