/**
 * Environment variables configuration and validation
 */

// Client-side environment variables (prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Operations Backoffice',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
} as const;

// Server-side environment variables (not prefixed)
export const serverEnv = {
  nodeEnv: process.env.NODE_ENV || 'development',
  // Authentication
  nextAuthUrl: process.env.NEXTAUTH_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Backend API
  apiUrl: process.env.API_URL,
} as const;

// Environment validation
export function validateEnv() {
  const requiredClientVars = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_URL',
  ] as const;
  const requiredServerVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ] as const;

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
      // Features can be added here when needed
    },
  };
}
