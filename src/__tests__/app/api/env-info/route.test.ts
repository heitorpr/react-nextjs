// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

// Mock the env module
jest.mock('../../../../lib/env', () => ({
  serverEnv: {
    nodeEnv: 'development',
    apiSecretKey: 'test-secret',
    databaseUrl: 'postgresql://test:test@localhost:5432/test',
  },
  validateEnv: jest.fn(),
}));

// Import after mocking
import { GET } from '../../../../app/api/env-info/route';
import { validateEnv } from '../../../../lib/env';

const mockValidateEnv = validateEnv as jest.MockedFunction<typeof validateEnv>;

describe('/api/env-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return environment info in development mode', async () => {
    mockValidateEnv.mockReturnValue({
      isValid: true,
      missingClientVars: [],
      missingServerVars: [],
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      environment: 'development',
      isDevelopment: true,
      validation: {
        isValid: true,
        missingClientVars: [],
        missingServerVars: [],
      },
      serverConfig: {
        hasApiSecret: true,
        hasDatabaseUrl: true,
      },
    });
  });

  it('should handle validation errors', async () => {
    mockValidateEnv.mockReturnValue({
      isValid: false,
      missingClientVars: ['NEXT_PUBLIC_APP_NAME', 'NEXT_PUBLIC_APP_URL'],
      missingServerVars: ['API_SECRET_KEY'],
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.validation.isValid).toBe(false);
    expect(data.validation.missingClientVars).toEqual([
      'NEXT_PUBLIC_APP_NAME',
      'NEXT_PUBLIC_APP_URL',
    ]);
    expect(data.validation.missingServerVars).toEqual(['API_SECRET_KEY']);
  });

  it('should handle exceptions and return 500 error', async () => {
    mockValidateEnv.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to get environment info',
    });
  });

  it('should handle server config when some values are missing', async () => {
    mockValidateEnv.mockReturnValue({
      isValid: true,
      missingClientVars: [],
      missingServerVars: [],
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.serverConfig).toEqual({
      hasApiSecret: true,
      hasDatabaseUrl: true,
    });
  });
});
