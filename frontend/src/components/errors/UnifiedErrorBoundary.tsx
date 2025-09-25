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
import { ErrorReportingService } from '@/lib/errorReporting';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: ErrorInfo;
}

interface UnifiedErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableErrorReporting?: boolean;
  level?: 'component' | 'page' | 'global';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorInfo: _errorInfo,
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

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
          Something went wrong!
        </Typography>

        <Typography variant='h6' component='p' sx={{ mb: 3 }}>
          An error occurred while loading this page. This might be a temporary
          issue.
        </Typography>

        <Alert severity='error' sx={{ mb: 3, textAlign: 'left' }}>
          <AlertTitle>Error Details</AlertTitle>
          {error.message || 'An unexpected error occurred'}
        </Alert>

        <Box display='flex' gap={2} justifyContent='center' flexWrap='wrap'>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            startIcon={<RefreshIcon />}
            onClick={resetError}
          >
            Try Again
          </Button>
          <Button
            variant='outlined'
            color='inherit'
            size='large'
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        </Box>

        <Box mt={3}>
          <Typography variant='body2' sx={{ opacity: 0.8 }}>
            Error ID: {(error as any).digest || Date.now()} | Time:{' '}
            {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

/**
 * Unified Error Boundary component that can be used at different levels
 */
export class UnifiedErrorBoundary extends Component<
  UnifiedErrorBoundaryProps,
  State
> {
  private errorReportingService: ErrorReportingService;

  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };

    this.errorReportingService = new ErrorReportingService();
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Report error to service
    if (this.props.enableErrorReporting !== false) {
      this.errorReportingService.reportError(error, {
        componentStack: errorInfo.componentStack || undefined,
        errorBoundary: 'UnifiedErrorBoundary',
        extra: {
          level: this.props.level,
        },
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by UnifiedErrorBoundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.handleReset}
          errorInfo={this.state.errorInfo || undefined}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<UnifiedErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <UnifiedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </UnifiedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for programmatic error handling
 */
export function useErrorHandler() {
  const errorReportingService = new ErrorReportingService();

  const handleError = (error: Error, context?: string) => {
    errorReportingService.reportError(error, {
      errorBoundary: context || 'useErrorHandler',
      extra: {
        timestamp: Date.now(),
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${context || 'unknown context'}:`, error);
    }
  };

  return { handleError };
}
