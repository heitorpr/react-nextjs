/**
 * Error reporting utility
 * Can be easily integrated with services like Sentry, LogRocket, etc.
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  extra?: Record<string, any>;
}

export class ErrorReportingService {
  private isEnabled: boolean;
  private serviceUrl?: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.serviceUrl = process.env.NEXT_PUBLIC_ERROR_REPORTING_URL;
  }

  /**
   * Report an error to the error reporting service
   */
  async reportError(
    error: Error,
    errorInfo?: {
      componentStack?: string;
      errorBoundary?: string;
      userId?: string;
      extra?: Record<string, any>;
    }
  ): Promise<void> {
    if (!this.isEnabled) {
      console.warn('Error reporting is disabled in development mode');
      return;
    }

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server',
      userId: errorInfo?.userId,
      extra: errorInfo?.extra,
    };

    try {
      if (this.serviceUrl) {
        await fetch(this.serviceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
      } else {
        // Fallback: log to console in production
        console.error('Error Report:', errorReport);
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Report a custom error message
   */
  async reportCustomError(
    message: string,
    extra?: Record<string, any>
  ): Promise<void> {
    const error = new Error(message);
    await this.reportError(error, { extra });
  }

  /**
   * Set user context for error reports
   */
  setUserContext(userId: string, userInfo?: Record<string, any>): void {
    // This would typically be used with services like Sentry
    // For now, we'll store it in a way that can be used in error reports
    if (typeof window !== 'undefined') {
      (window as any).__ERROR_REPORTING_USER__ = { userId, userInfo };
    }
  }

  /**
   * Enable or disable error reporting
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Create a singleton instance
export const errorReportingService = new ErrorReportingService();

// Helper function for use in error boundaries
export const reportError = (
  error: Error,
  errorInfo?: {
    componentStack?: string;
    errorBoundary?: string;
    userId?: string;
    extra?: Record<string, any>;
  }
): void => {
  errorReportingService.reportError(error, errorInfo);
};

// Helper function for custom error reporting
export const reportCustomError = (
  message: string,
  extra?: Record<string, any>
): void => {
  errorReportingService.reportCustomError(message, extra);
};
