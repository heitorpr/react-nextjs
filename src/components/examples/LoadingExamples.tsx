'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
} from '@mui/material';
import {
  LoadingSpinner,
  LoadingSkeleton,
  CardSkeleton,
  TableSkeleton,
  ErrorDisplay,
  EmptyState,
} from '../ui';

export const LoadingExamples: React.FC = () => {
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const triggerEmpty = () => {
    setShowEmpty(true);
    setTimeout(() => setShowEmpty(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Loading & Error UI Components
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        Examples of various loading states, error displays, and empty states.
      </Typography>

      <Grid container spacing={4}>
        {/* Loading Spinners */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Loading Spinners
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <LoadingSpinner size={40} message='Loading data...' />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <LoadingSpinner
                    size={60}
                    message='Processing request...'
                    color='secondary'
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <LoadingSpinner size={30} message='' color='inherit' />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Loading Skeletons */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Loading Skeletons
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <LoadingSkeleton variant='text' width='100%' height={20} />
                <LoadingSkeleton variant='text' width='80%' height={20} />
                <LoadingSkeleton variant='text' width='60%' height={20} />
                <LoadingSkeleton
                  variant='rectangular'
                  width='100%'
                  height={100}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Card Skeleton
              </Typography>
              <CardSkeleton showAvatar={true} lines={3} />
            </CardContent>
          </Card>
        </Grid>

        {/* Table Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Table Skeleton
              </Typography>
              <TableSkeleton rows={4} columns={3} />
            </CardContent>
          </Card>
        </Grid>

        {/* Error Displays */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Error Displays
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ErrorDisplay
                  title='Network Error'
                  message='Unable to connect to the server.'
                  variant='alert'
                  showRetry={true}
                />
                <Button
                  variant='outlined'
                  onClick={triggerError}
                  disabled={showError}
                >
                  {showError ? 'Error Displayed' : 'Show Error'}
                </Button>
                {showError && (
                  <ErrorDisplay
                    title='Temporary Error'
                    message='This error will disappear in 3 seconds.'
                    variant='minimal'
                    showRetry={false}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Empty States */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Empty States
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <EmptyState
                  title='No items found'
                  description='There are no items to display at the moment.'
                  variant='default'
                />
                <Button
                  variant='outlined'
                  onClick={triggerEmpty}
                  disabled={showEmpty}
                >
                  {showEmpty ? 'Empty State Shown' : 'Show Empty State'}
                </Button>
                {showEmpty && (
                  <EmptyState
                    title='Create your first item'
                    description='Get started by creating your first item.'
                    actionLabel='Create Item'
                    onAction={() => console.log('Create item clicked')}
                    variant='create'
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Screen Loading */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Full Screen Loading
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Click the button below to see a full-screen loading overlay.
              </Typography>
              <Button
                variant='contained'
                onClick={() => {
                  // Simulate full screen loading
                  const overlay = document.createElement('div');
                  overlay.style.position = 'fixed';
                  overlay.style.top = '0';
                  overlay.style.left = '0';
                  overlay.style.right = '0';
                  overlay.style.bottom = '0';
                  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                  overlay.style.display = 'flex';
                  overlay.style.alignItems = 'center';
                  overlay.style.justifyContent = 'center';
                  overlay.style.zIndex = '9999';

                  const spinner = document.createElement('div');
                  spinner.innerHTML = `
                    <div style="text-align: center;">
                      <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                      <div style="color: #666; font-size: 14px;">Loading...</div>
                    </div>
                    <style>
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    </style>
                  `;

                  overlay.appendChild(spinner);
                  document.body.appendChild(overlay);

                  setTimeout(() => {
                    document.body.removeChild(overlay);
                  }, 3000);
                }}
              >
                Show Full Screen Loading
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadingExamples;
