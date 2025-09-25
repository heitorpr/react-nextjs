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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  pageName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PageErrorBoundary extends Component<Props, State> {
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
    console.error(
      `Page error in ${this.props.pageName || 'unknown page'}:`,
      error,
      errorInfo
    );

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
          <CardContent>
            <Box display='flex' alignItems='center' gap={1} mb={2}>
              <ErrorIcon color='error' />
              <Typography variant='h5' component='h2' color='error'>
                Page Error
              </Typography>
            </Box>

            <Alert severity='error' sx={{ mb: 2 }}>
              <AlertTitle>
                {this.props.pageName
                  ? `Error in ${this.props.pageName}`
                  : 'Page Error'}
              </AlertTitle>
              This page encountered an error and couldn&apos;t load properly.
              You can try refreshing or go back to the previous page.
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
                startIcon={<ArrowBackIcon />}
                onClick={this.handleGoBack}
              >
                Go Back
              </Button>
            </Box>

            <Typography variant='body2' color='text.secondary'>
              If this problem persists, please contact support.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
