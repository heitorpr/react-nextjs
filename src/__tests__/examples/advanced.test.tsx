import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Example of more advanced testing patterns
describe('Advanced Testing Examples', () => {
  // Example: Testing async behavior
  it('handles async operations', async () => {
    const AsyncComponent = () => {
      const [data, setData] = React.useState('');

      React.useEffect(() => {
        setTimeout(() => setData('Loaded!'), 100);
      }, []);

      return <div>{data || 'Loading...'}</div>;
    };

    render(<AsyncComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loaded!')).toBeInTheDocument();
    });
  });

  // Example: Testing user interactions with userEvent
  it('handles complex user interactions', async () => {
    const user = userEvent.setup();

    const InteractiveComponent = () => {
      const [count, setCount] = React.useState(0);
      const [text, setText] = React.useState('');

      return (
        <div>
          <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Type something'
          />
          <p data-testid='display'>You typed: {text}</p>
        </div>
      );
    };

    render(<InteractiveComponent />);

    // Test button clicking
    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);

    expect(screen.getByText('Count: 2')).toBeInTheDocument();

    // Test typing
    const input = screen.getByPlaceholderText('Type something');
    await user.type(input, 'Hello World!');

    expect(screen.getByTestId('display')).toHaveTextContent(
      'You typed: Hello World!'
    );
  });

  // Example: Testing with custom hooks
  it('demonstrates custom hook testing pattern', () => {
    const useCounter = (initialValue = 0) => {
      const [count, setCount] = React.useState(initialValue);

      const increment = () => setCount(c => c + 1);
      const decrement = () => setCount(c => c - 1);
      const reset = () => setCount(initialValue);

      return { count, increment, decrement, reset };
    };

    const CounterComponent = () => {
      const { count, increment, decrement, reset } = useCounter(5);

      return (
        <div>
          <span data-testid='count'>{count}</span>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
        </div>
      );
    };

    render(<CounterComponent />);

    expect(screen.getByTestId('count')).toHaveTextContent('5');

    fireEvent.click(screen.getByText('+'));
    expect(screen.getByTestId('count')).toHaveTextContent('6');

    fireEvent.click(screen.getByText('-'));
    expect(screen.getByTestId('count')).toHaveTextContent('5');

    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });
});
