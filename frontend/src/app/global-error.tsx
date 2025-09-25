'use client';

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): React.JSX.Element {
  return (
    <html>
      <body>
        <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'error.light',
              color: 'white',
            }}
          >
            <Box display='flex' justifyContent='center' mb={2}>
              <ErrorIcon sx={{ fontSize: 64 }} />
            </Box>

            <Typography variant='h3' component='h1' gutterBottom>
              Application Error
            </Typography>

            <Typography variant='h6' component='p' sx={{ mb: 3 }}>
              A critical error occurred in the application. Please try
              refreshing the page or contact support if the problem persists.
            </Typography>

            <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Critical Error</AlertTitle>
              {error.message || 'An unexpected application error occurred'}
            </Alert>

            <Box display='flex' gap={2} justifyContent='center' flexWrap='wrap'>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                startIcon={<RefreshIcon />}
                onClick={reset}
              >
                Try Again
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                size='large'
                startIcon={<HomeIcon />}
                onClick={() => (window.location.href = '/')}
              >
                Go Home
              </Button>
            </Box>

            <Box mt={3}>
              <Typography variant='body2' sx={{ opacity: 0.8 }}>
                Error ID: {error.digest || Date.now()} | Time:{' '}
                {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </body>
    </html>
  );
}
