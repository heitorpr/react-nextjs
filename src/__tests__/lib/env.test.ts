// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Environment Configuration', () => {
  describe('clientEnv', () => {
    it('should have default values when environment variables are not set', async () => {
      process.env = {};

      const { clientEnv } = await import('../../lib/env');

      expect(clientEnv.appName).toBe('Operations Backoffice');
      expect(clientEnv.appVersion).toBe('1.0.0');
      expect(clientEnv.appUrl).toBe('http://localhost:3000');
    });

    it('should use environment variables when set', async () => {
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_VERSION = '2.0.0';
      process.env.NEXT_PUBLIC_APP_URL = 'https://test.com';

      const { clientEnv } = await import('../../lib/env');

      expect(clientEnv.appName).toBe('Test App');
      expect(clientEnv.appVersion).toBe('2.0.0');
      expect(clientEnv.appUrl).toBe('https://test.com');
    });
  });

  describe('serverEnv', () => {
    it('should have default values when environment variables are not set', async () => {
      process.env = {};

      const { serverEnv } = await import('../../lib/env');

      expect(serverEnv.nodeEnv).toBe('development'); // Default fallback
      expect(serverEnv.nextAuthUrl).toBeUndefined();
      expect(serverEnv.nextAuthSecret).toBeUndefined();
      expect(serverEnv.googleClientId).toBeUndefined();
      expect(serverEnv.googleClientSecret).toBeUndefined();
    });

    it('should use environment variables when set', async () => {
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
      process.env.NODE_ENV = 'production';

      const { serverEnv } = await import('../../lib/env');

      expect(serverEnv.nextAuthUrl).toBe('http://localhost:3000');
      expect(serverEnv.nextAuthSecret).toBe('test-secret');
      expect(serverEnv.googleClientId).toBe('test-client-id');
      expect(serverEnv.googleClientSecret).toBe('test-client-secret');
      expect(serverEnv.nodeEnv).toBe('production');
    });
  });

  describe('validateEnv', () => {
    it('should return valid when all required variables are set', async () => {
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_URL = 'https://test.com';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

      const { validateEnv } = await import('../../lib/env');
      const validation = validateEnv();

      expect(validation.isValid).toBe(true);
      expect(validation.missingClientVars).toHaveLength(0);
      expect(validation.missingServerVars).toHaveLength(0);
    });

    it('should return invalid when required variables are missing', async () => {
      process.env = {};

      const { validateEnv } = await import('../../lib/env');
      const validation = validateEnv();

      expect(validation.isValid).toBe(false);
      expect(validation.missingClientVars).toContain('NEXT_PUBLIC_APP_NAME');
      expect(validation.missingClientVars).toContain('NEXT_PUBLIC_APP_URL');
      expect(validation.missingServerVars).toContain('NEXTAUTH_URL');
      expect(validation.missingServerVars).toContain('NEXTAUTH_SECRET');
      expect(validation.missingServerVars).toContain('GOOGLE_CLIENT_ID');
      expect(validation.missingServerVars).toContain('GOOGLE_CLIENT_SECRET');
    });
  });

  describe('getEnvInfo', () => {
    it('should return correct environment info for development', async () => {
      process.env.NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';

      const { getEnvInfo } = await import('../../lib/env');
      const envInfo = getEnvInfo();

      expect(envInfo.nodeEnv).toBe('development');
      expect(envInfo.isDevelopment).toBe(true);
      expect(envInfo.isProduction).toBe(false);
      expect(envInfo.isTest).toBe(false);
      expect(envInfo.appName).toBe('Test App');
      expect(envInfo.appVersion).toBe('1.0.0');
      expect(envInfo.features).toEqual({});
    });

    it('should return correct environment info for production', async () => {
      process.env.NODE_ENV = 'production';

      const { getEnvInfo } = await import('../../lib/env');
      const envInfo = getEnvInfo();

      expect(envInfo.nodeEnv).toBe('production');
      expect(envInfo.isDevelopment).toBe(false);
      expect(envInfo.isProduction).toBe(true);
      expect(envInfo.isTest).toBe(false);
    });
  });
});
