import { render, screen } from '@testing-library/react';
import { Providers } from '../../app/providers';

// Test component to verify theme is applied
const TestComponent = () => (
  <div data-testid='test-component'>
    <h1>Test Component</h1>
  </div>
);

describe('Providers', () => {
  it('renders children with Material-UI theme provider', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const testComponent = screen.getByTestId('test-component');
    expect(testComponent).toBeInTheDocument();
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('applies Material-UI theme correctly', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Check if CssBaseline is applied (should have Material-UI global styles)
    const body = document.body;
    expect(body).toHaveStyle('margin: 0');
  });
});
