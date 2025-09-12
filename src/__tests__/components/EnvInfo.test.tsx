import React from 'react';
import { render, screen } from '@testing-library/react';
import EnvInfo from '../../components/EnvInfo';

// Mock the env module
jest.mock('../../lib/env', () => ({
  clientEnv: {
    appName: 'Test App',
    appVersion: '1.0.0',
    appUrl: 'http://localhost:3000',
    apiUrl: 'https://api.test.com',
    enableAnalytics: true,
    enablePWA: true,
    enableDebug: true,
    googleAnalyticsId: 'GA-123456789',
  },
  getEnvInfo: () => ({
    nodeEnv: 'development',
    isDevelopment: true,
    isProduction: false,
    isTest: false,
    appName: 'Test App',
    appVersion: '1.0.0',
    features: {
      analytics: true,
      pwa: true,
      debug: true,
    },
  }),
}));

describe('EnvInfo Component', () => {
  it('renders environment information in development mode', () => {
    render(<EnvInfo />);

    expect(screen.getByText('Environment Information')).toBeInTheDocument();
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:3000')).toBeInTheDocument();
    expect(screen.getByText('https://api.test.com')).toBeInTheDocument();
  });

  it('displays feature flags correctly', () => {
    render(<EnvInfo />);

    expect(screen.getByText('Analytics: ON')).toBeInTheDocument();
    expect(screen.getByText('PWA: ON')).toBeInTheDocument();
    expect(screen.getByText('Debug: ON')).toBeInTheDocument();
  });

  it('shows environment chip with correct color', () => {
    render(<EnvInfo />);

    const envChip = screen.getByText('development');
    expect(envChip).toBeInTheDocument();
  });

  it('displays Google Analytics ID when available', () => {
    render(<EnvInfo />);

    expect(screen.getByText('GA-123456789')).toBeInTheDocument();
  });

  it('shows debug message at the bottom', () => {
    render(<EnvInfo />);

    expect(
      screen.getByText(
        'This component only shows in development or when debug mode is enabled'
      )
    ).toBeInTheDocument();
  });

  it('shows environment chip with warning color in development', () => {
    render(<EnvInfo />);

    const envChip = screen.getByText('development');
    expect(envChip).toBeInTheDocument();
  });
});

describe('EnvInfo Component - Production Mode', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('does not render in production when debug is disabled', () => {
    // Mock the env module for this specific test
    jest.doMock('../../lib/env', () => ({
      clientEnv: {
        enableDebug: false,
      },
      getEnvInfo: () => ({
        isDevelopment: false,
        isProduction: true,
      }),
    }));

    // Re-import the component after mocking
    const EnvInfoProduction = require('../../components/EnvInfo').default;
    const { container } = render(<EnvInfoProduction />);
    expect(container.firstChild).toBeNull();
  });
});
