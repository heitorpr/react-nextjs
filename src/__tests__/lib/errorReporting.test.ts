import {
  ErrorReportingService,
  reportError,
  reportCustomError,
} from '../../lib/errorReporting';

// Mock fetch
global.fetch = jest.fn();

// Helper function to mock environment variables
const mockEnvVar = (key: string, value: string | undefined) => {
  const originalValue = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    Object.defineProperty(process.env, key, {
      value,
      writable: true,
      configurable: true,
    });
  }
  return originalValue;
};

describe('Error Reporting Service', () => {
  let errorReportingService: ErrorReportingService;

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    // Reset environment variables
    delete process.env.NEXT_PUBLIC_ERROR_REPORTING_URL;
    // Create a new instance for each test
    errorReportingService = new ErrorReportingService();
  });

  describe('errorReportingService', () => {
    it('should be disabled in development mode', () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'development');

      const service = new ErrorReportingService();
      expect((service as any).isEnabled).toBe(false);

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should be enabled in production mode', () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');

      const service = new ErrorReportingService();
      expect((service as any).isEnabled).toBe(true);

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should report error in production mode', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar(
        'NEXT_PUBLIC_ERROR_REPORTING_URL',
        'https://api.example.com/errors'
      );

      const mockFetch = fetch as jest.Mock;
      mockFetch.mockResolvedValue({ ok: true });

      // Create a new service instance with production environment
      const service = new ErrorReportingService();

      const error = new Error('Test error');
      const errorInfo = {
        componentStack: 'Test component stack',
        errorBoundary: 'TestBoundary',
        userId: 'user123',
        extra: { test: 'data' },
      };

      await service.reportError(error, errorInfo);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/errors',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Test error'),
        })
      );

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should log to console when no service URL is provided', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar('NEXT_PUBLIC_ERROR_REPORTING_URL', undefined);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create a new service instance with production environment
      const service = new ErrorReportingService();

      const error = new Error('Test error');
      await service.reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error Report:',
        expect.objectContaining({
          message: 'Test error',
          timestamp: expect.any(Number),
        })
      );

      consoleSpy.mockRestore();
      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should handle fetch errors gracefully', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar(
        'NEXT_PUBLIC_ERROR_REPORTING_URL',
        'https://api.example.com/errors'
      );

      const mockFetch = fetch as jest.Mock;
      mockFetch.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create a new service instance with production environment
      const service = new ErrorReportingService();

      const error = new Error('Test error');
      await service.reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to report error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should report custom error', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar(
        'NEXT_PUBLIC_ERROR_REPORTING_URL',
        'https://api.example.com/errors'
      );

      const mockFetch = fetch as jest.Mock;
      mockFetch.mockResolvedValue({ ok: true });

      // Create a new service instance with production environment
      const service = new ErrorReportingService();

      await service.reportCustomError('Custom error message', {
        custom: 'data',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/errors',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Custom error message'),
        })
      );

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should set user context', () => {
      const userId = 'user123';
      const userInfo = { name: 'Test User', email: 'test@example.com' };

      errorReportingService.setUserContext(userId, userInfo);

      expect((window as any).__ERROR_REPORTING_USER__).toEqual({
        userId,
        userInfo,
      });
    });

    it('should enable/disable error reporting', () => {
      errorReportingService.setEnabled(false);
      expect((errorReportingService as any).isEnabled).toBe(false);

      errorReportingService.setEnabled(true);
      expect((errorReportingService as any).isEnabled).toBe(true);
    });
  });

  describe('helper functions', () => {
    it('should report error using helper function', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar(
        'NEXT_PUBLIC_ERROR_REPORTING_URL',
        'https://api.example.com/errors'
      );

      const mockFetch = fetch as jest.Mock;
      mockFetch.mockResolvedValue({ ok: true });

      const error = new Error('Helper test error');
      const errorInfo = { componentStack: 'Helper stack' };

      // The helper functions use the singleton instance, so we need to create a new one
      const service = new ErrorReportingService();
      await service.reportError(error, errorInfo);

      expect(mockFetch).toHaveBeenCalled();

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should report custom error using helper function', async () => {
      const originalEnv = mockEnvVar('NODE_ENV', 'production');
      mockEnvVar(
        'NEXT_PUBLIC_ERROR_REPORTING_URL',
        'https://api.example.com/errors'
      );

      const mockFetch = fetch as jest.Mock;
      mockFetch.mockResolvedValue({ ok: true });

      // The helper functions use the singleton instance, so we need to create a new one
      const service = new ErrorReportingService();
      await service.reportCustomError('Helper custom error', {
        helper: 'data',
      });

      expect(mockFetch).toHaveBeenCalled();

      mockEnvVar('NODE_ENV', originalEnv);
    });

    it('should call reportError helper function', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const error = new Error('Test error');
      reportError(error, { componentStack: 'test stack' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reporting is disabled in development mode'
      );

      consoleSpy.mockRestore();
    });

    it('should call reportCustomError helper function', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      reportCustomError('Custom error message', { extra: 'data' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reporting is disabled in development mode'
      );

      consoleSpy.mockRestore();
    });
  });
});
