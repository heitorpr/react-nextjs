declare namespace NodeJS {
  interface ProcessEnv {
    // Application Configuration
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_APP_URL: string;

    // Authentication Configuration
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
