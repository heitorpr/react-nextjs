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

      expect(clientEnv.appName).toBe('Hello World Next.js App');
      expect(clientEnv.appVersion).toBe('1.0.0');
      expect(clientEnv.appUrl).toBe('http://localhost:3000');
      expect(clientEnv.apiUrl).toBe('https://jsonplaceholder.typicode.com');
    });

    it('should use environment variables when set', async () => {
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_VERSION = '2.0.0';
      process.env.NEXT_PUBLIC_APP_URL = 'https://test.com';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com';
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';
      process.env.NEXT_PUBLIC_ENABLE_PWA = 'false';
      process.env.NEXT_PUBLIC_ENABLE_DEBUG = 'true';

      const { clientEnv } = await import('../../lib/env');

      expect(clientEnv.appName).toBe('Test App');
      expect(clientEnv.appVersion).toBe('2.0.0');
      expect(clientEnv.appUrl).toBe('https://test.com');
      expect(clientEnv.apiUrl).toBe('https://api.test.com');
      expect(clientEnv.enableAnalytics).toBe(true);
      expect(clientEnv.enablePWA).toBe(false);
      expect(clientEnv.enableDebug).toBe(true);
    });
  });

  describe('serverEnv', () => {
    it('should have default values when environment variables are not set', async () => {
      process.env = {};

      const { serverEnv } = await import('../../lib/env');

      expect(serverEnv.nodeEnv).toBe('development'); // Default fallback
      expect(serverEnv.apiSecretKey).toBeUndefined();
      expect(serverEnv.databaseUrl).toBeUndefined();
    });

    it('should use environment variables when set', async () => {
      process.env.API_SECRET_KEY = 'test-secret';
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.NODE_ENV = 'production';

      const { serverEnv } = await import('../../lib/env');

      expect(serverEnv.apiSecretKey).toBe('test-secret');
      expect(serverEnv.databaseUrl).toBe('postgresql://test');
      expect(serverEnv.nodeEnv).toBe('production');
    });
  });

  describe('validateEnv', () => {
    it('should return valid when all required variables are set', async () => {
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_URL = 'https://test.com';
      process.env.API_SECRET_KEY = 'test-secret';

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
      expect(validation.missingServerVars).toContain('API_SECRET_KEY');
    });
  });

  describe('getEnvInfo', () => {
    it('should return correct environment info for development', async () => {
      process.env.NODE_ENV = 'development';
      process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
      process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0';
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';
      process.env.NEXT_PUBLIC_ENABLE_PWA = 'false';
      process.env.NEXT_PUBLIC_ENABLE_DEBUG = 'true';

      const { getEnvInfo } = await import('../../lib/env');
      const envInfo = getEnvInfo();

      expect(envInfo.nodeEnv).toBe('development');
      expect(envInfo.isDevelopment).toBe(true);
      expect(envInfo.isProduction).toBe(false);
      expect(envInfo.isTest).toBe(false);
      expect(envInfo.appName).toBe('Test App');
      expect(envInfo.appVersion).toBe('1.0.0');
      expect(envInfo.features.analytics).toBe(true);
      expect(envInfo.features.pwa).toBe(false);
      expect(envInfo.features.debug).toBe(true);
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
