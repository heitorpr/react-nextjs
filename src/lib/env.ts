/**
 * Environment variables configuration and validation
 */

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Hello World Next.js App',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
} as const;

// Server-side environment variables (not prefixed)
export const serverEnv = {
  apiSecretKey: process.env.API_SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

// Environment validation
export function validateEnv() {
  const requiredClientVars = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL',
  ] as const;
  const requiredServerVars = ['API_SECRET_KEY'] as const;

  const missingClientVars = requiredClientVars.filter(
    varName => !process.env[varName]
  );

  const missingServerVars = requiredServerVars.filter(
    varName => !process.env[varName]
  );

  if (missingClientVars.length > 0) {
    console.warn(
      `Missing required client environment variables: ${missingClientVars.join(', ')}`
    );
  }

  if (missingServerVars.length > 0) {
    console.warn(
      `Missing required server environment variables: ${missingServerVars.join(', ')}`
    );
  }

  return {
    isValid: missingClientVars.length === 0 && missingServerVars.length === 0,
    missingClientVars,
    missingServerVars,
  };
}

// Environment info for debugging
export function getEnvInfo() {
  return {
    nodeEnv: serverEnv.nodeEnv,
    isDevelopment: serverEnv.nodeEnv === 'development',
    isProduction: serverEnv.nodeEnv === 'production',
    isTest: serverEnv.nodeEnv === 'test',
    appName: clientEnv.appName,
    appVersion: clientEnv.appVersion,
    features: {
      analytics: clientEnv.enableAnalytics,
      pwa: clientEnv.enablePWA,
      debug: clientEnv.enableDebug,
    },
  };
}
