import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../../app/not-found';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Not Found Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 404 page with correct content', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn't find the page/)
    ).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<NotFound />);

    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('navigates to home when Go Home button is clicked', () => {
    render(<NotFound />);

    const goHomeButton = screen.getByText('Go Home');
    expect(goHomeButton.closest('a')).toHaveAttribute('href', '/');
  });

  it('goes back when Go Back button is clicked', () => {
    const backSpy = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    render(<NotFound />);

    fireEvent.click(screen.getByText('Go Back'));

    expect(backSpy).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  it('shows error 404 and timestamp', () => {
    render(<NotFound />);

    expect(screen.getByText(/Error 404/)).toBeInTheDocument();
    // Check for the timestamp pattern in the same text node
    expect(
      screen.getByText(/Error 404.*\|.*\d{1,2}\/\d{1,2}\/\d{4}/)
    ).toBeInTheDocument();
  });

  it('has proper styling with primary theme', () => {
    render(<NotFound />);

    const paper = screen.getByText('404').closest('[class*="MuiPaper"]');
    expect(paper).toBeInTheDocument();
  });
});
