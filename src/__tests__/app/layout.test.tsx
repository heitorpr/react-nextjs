import { render, screen } from '@testing-library/react';
import RootLayout from '../../app/layout';

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({
    className: 'mocked-inter-font',
  })),
}));

// Mock the Providers component
jest.mock('../../app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='providers-wrapper'>{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('renders the layout component without errors', () => {
    const TestChild = () => <div data-testid='test-child'>Test Content</div>;

    // Test that the component renders without throwing
    expect(() => {
      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      );
    }).not.toThrow();
  });

  it('renders children correctly', () => {
    const TestChild = () => <div data-testid='test-child'>Test Content</div>;

    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    );

    // Check if children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders multiple children correctly', () => {
    const TestChild1 = () => <div data-testid='child-1'>Child 1</div>;
    const TestChild2 = () => <div data-testid='child-2'>Child 2</div>;

    render(
      <RootLayout>
        <TestChild1 />
        <TestChild2 />
      </RootLayout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders with no children', () => {
    expect(() => {
      render(<RootLayout>{null}</RootLayout>);
    }).not.toThrow();
  });

  it('renders with empty children', () => {
    expect(() => {
      render(<RootLayout>{[]}</RootLayout>);
    }).not.toThrow();
  });

  it('renders with complex nested children', () => {
    const ComplexChild = () => (
      <div>
        <h1>Title</h1>
        <p>Paragraph</p>
        <button>Click me</button>
      </div>
    );

    render(
      <RootLayout>
        <ComplexChild />
      </RootLayout>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls Inter font with correct parameters', () => {
    const { Inter } = require('next/font/google');

    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(Inter).toHaveBeenCalledWith({ subsets: ['latin'] });
  });

  it('renders with string children', () => {
    render(<RootLayout>Simple text content</RootLayout>);

    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('renders with mixed children types', () => {
    render(
      <RootLayout>
        <div>Element 1</div>
        Text content
        <span>Element 2</span>
      </RootLayout>
    );

    expect(screen.getByText('Element 1')).toBeInTheDocument();
    expect(screen.getByText('Text content')).toBeInTheDocument();
    expect(screen.getByText('Element 2')).toBeInTheDocument();
  });
});

// Test the metadata export
describe('Layout Metadata', () => {
  it('exports correct metadata', () => {
    // Import the metadata directly to test it
    const { metadata } = require('../../app/layout');

    expect(metadata).toEqual({
      title: 'Hello World Next.js App',
      description: 'A modern Next.js app with Material-UI and TypeScript',
      manifest: '/manifest.json',
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'HelloWorld',
      },
      formatDetection: {
        telephone: false,
      },
      openGraph: {
        type: 'website',
        siteName: 'Hello World Next.js App',
        title: 'Hello World Next.js App',
        description: 'A modern Next.js app with Material-UI and TypeScript',
      },
      icons: {
        icon: '/icons/icon-192x192.png',
        apple: '/icons/icon-192x192.png',
      },
    });
  });

  it('has required metadata properties', () => {
    const { metadata } = require('../../app/layout');

    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
    expect(typeof metadata.title).toBe('string');
    expect(typeof metadata.description).toBe('string');
    expect(metadata.title.length).toBeGreaterThan(0);
    expect(metadata.description.length).toBeGreaterThan(0);
  });

  it('has correct metadata values', () => {
    const { metadata } = require('../../app/layout');

    expect(metadata.title).toBe('Hello World Next.js App');
    expect(metadata.description).toBe(
      'A modern Next.js app with Material-UI and TypeScript'
    );
  });

  it('exports correct viewport configuration', () => {
    const { viewport } = require('../../app/layout');

    expect(viewport).toEqual({
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
      themeColor: '#1976d2',
    });
  });

  it('has required viewport properties', () => {
    const { viewport } = require('../../app/layout');

    expect(viewport).toHaveProperty('width');
    expect(viewport).toHaveProperty('initialScale');
    expect(viewport).toHaveProperty('maximumScale');
    expect(viewport).toHaveProperty('userScalable');
    expect(viewport).toHaveProperty('themeColor');
  });
});
