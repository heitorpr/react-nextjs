declare namespace NodeJS {
  interface ProcessEnv {
    // Application Configuration
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_APP_URL: string;

    // API Configuration
    NEXT_PUBLIC_API_URL: string;
    API_SECRET_KEY: string;

    // Database Configuration
    DATABASE_URL?: string;

    // External Services
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    NEXT_PUBLIC_ENABLE_PWA: string;
    NEXT_PUBLIC_ENABLE_DEBUG: string;

    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
