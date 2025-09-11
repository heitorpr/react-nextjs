'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
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

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('Global error caught:', error, errorInfo);

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
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
              Oops! Something went wrong
            </Typography>

            <Typography variant='h6' component='p' sx={{ mb: 3 }}>
              We&apos;re sorry, but something unexpected happened. Our team has
              been notified and is working to fix the issue.
            </Typography>

            <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Application Error</AlertTitle>
              The application encountered an unexpected error. Please try
              refreshing the page or contact support if the problem persists.
            </Alert>

            <Box display='flex' gap={2} justifyContent='center' flexWrap='wrap'>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                size='large'
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                size='large'
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>

            <Box mt={3}>
              <Typography variant='body2' sx={{ opacity: 0.8 }}>
                Error ID: {Date.now()} | Time: {new Date().toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}
