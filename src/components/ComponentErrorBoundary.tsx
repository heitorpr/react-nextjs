'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends Component<Props, State> {
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
      `Component error in ${this.props.componentName || 'unknown component'}:`,
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

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Alert severity='warning' sx={{ m: 1 }}>
          <AlertTitle>
            {this.props.componentName
              ? `${this.props.componentName} Error`
              : 'Component Error'}
          </AlertTitle>
          <Typography variant='body2' sx={{ mb: 1 }}>
            This component encountered an error and couldn&apos;t render
            properly.
          </Typography>
          <Button
            size='small'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={this.handleRetry}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
