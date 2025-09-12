'use client';

import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  sx?: SxProps<Theme>;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  animation = 'wave',
  sx,
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={sx}
    />
  );
};

interface CardSkeletonProps {
  showAvatar?: boolean;
  lines?: number;
  sx?: SxProps<Theme>;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showAvatar = true,
  lines = 3,
  sx,
}) => {
  return (
    <Card sx={{ maxWidth: 345, ...sx }}>
      <CardContent>
        {showAvatar && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant='circular' width={40} height={40} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant='text' width='60%' height={20} />
              <Skeleton variant='text' width='40%' height={16} />
            </Box>
          </Box>
        )}
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant='text'
            width={index === lines - 1 ? '70%' : '100%'}
            height={20}
            sx={{ mb: 1 }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  sx?: SxProps<Theme>;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  sx,
}) => {
  return (
    <Box sx={sx}>
      {/* Header skeleton */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant='text'
            width={`${100 / columns}%`}
            height={24}
          />
        ))}
      </Box>
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={`row-${rowIndex}`} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant='text'
              width={`${100 / columns}%`}
              height={20}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
