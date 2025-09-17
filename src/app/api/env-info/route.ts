import { NextResponse } from 'next/server';
import { serverEnv, validateEnv } from '@/lib/env';

export async function GET() {
  try {
    // Validate environment variables
    const validation = validateEnv();

    // Only return sensitive info in development
    const isDevelopment = serverEnv.nodeEnv === 'development';

    const response = {
      environment: serverEnv.nodeEnv,
      isDevelopment,
      validation: {
        isValid: validation.isValid,
        missingClientVars: validation.missingClientVars,
        missingServerVars: isDevelopment ? validation.missingServerVars : [],
      },
      // Only include sensitive data in development
      ...(isDevelopment && {
        serverConfig: {
          hasApiSecret: !!serverEnv.apiSecretKey,
          hasDatabaseUrl: !!serverEnv.databaseUrl,
        },
      }),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Failed to get environment info' },
      { status: 500 }
    );
  }
}
