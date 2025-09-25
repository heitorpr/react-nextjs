'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  title?: string;
  description?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card sx={{ maxWidth: 600, margin: 2 }}>
          <CardContent>
            <Box display='flex' alignItems='center' gap={1} mb={2}>
              <ErrorIcon color='error' />
              <Typography variant='h6' component='h2' color='error'>
                {this.props.title || 'Something went wrong'}
              </Typography>
            </Box>

            <Alert severity='error' sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {this.props.description ||
                'An unexpected error occurred. Please try again or contact support if the problem persists.'}
            </Alert>

            <Box display='flex' gap={2} mb={2}>
              <Button
                variant='contained'
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant='outlined'
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>

            {this.props.showDetails && this.state.error && (
              <Box mt={2}>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Error Details:
                </Typography>
                <Box
                  component='pre'
                  sx={{
                    backgroundColor: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Box>
              </Box>
            )}

            <Box mt={2} display='flex' alignItems='center' gap={1}>
              <BugReportIcon color='action' fontSize='small' />
              <Typography variant='caption' color='text.secondary'>
                Error ID: {Date.now()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
