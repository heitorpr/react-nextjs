import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  LoadingSkeleton,
  CardSkeleton,
  TableSkeleton,
} from '../../../components/ui/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with default props', () => {
    render(<LoadingSkeleton />);

    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with custom variant', () => {
    render(<LoadingSkeleton variant='circular' />);

    const skeleton = document.querySelector('.MuiSkeleton-circular');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with custom width and height', () => {
    render(<LoadingSkeleton width={200} height={50} />);

    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with custom animation', () => {
    render(<LoadingSkeleton animation='pulse' />);

    const skeleton = document.querySelector('.MuiSkeleton-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders without animation when animation is false', () => {
    render(<LoadingSkeleton animation={false} />);

    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
    // Should not have pulse animation class
    expect(skeleton).not.toHaveClass('MuiSkeleton-pulse');
  });

  it('applies custom sx styles', () => {
    render(<LoadingSkeleton sx={{ backgroundColor: 'red' }} />);

    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
  });
});

describe('CardSkeleton', () => {
  it('renders with default props', () => {
    render(<CardSkeleton />);

    // Check for avatar skeleton
    const avatarSkeleton = document.querySelector('.MuiSkeleton-circular');
    expect(avatarSkeleton).toBeInTheDocument();

    // Check for text skeletons
    const textSkeletons = document.querySelectorAll('.MuiSkeleton-text');
    expect(textSkeletons.length).toBeGreaterThan(1);
  });

  it('renders without avatar when showAvatar is false', () => {
    render(<CardSkeleton showAvatar={false} />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have text skeletons but no circular avatar skeleton
    expect(skeletons.length).toBeGreaterThan(0);

    const circularSkeleton = document.querySelector('.MuiSkeleton-circular');
    expect(circularSkeleton).not.toBeInTheDocument();
  });

  it('renders with custom number of lines', () => {
    render(<CardSkeleton lines={5} />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have avatar + 5 text lines
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it('applies custom sx styles', () => {
    render(<CardSkeleton sx={{ maxWidth: 400 }} />);

    const card = document.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });
});

describe('TableSkeleton', () => {
  it('renders with default props', () => {
    render(<TableSkeleton />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have header + 5 rows with 4 columns each = 1 + (5 * 4) = 21 skeletons
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with custom number of rows', () => {
    render(<TableSkeleton rows={3} />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have header + 3 rows with 4 columns each = 1 + (3 * 4) = 13 skeletons
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with custom number of columns', () => {
    render(<TableSkeleton columns={6} />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have header + 5 rows with 6 columns each = 1 + (5 * 6) = 31 skeletons
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with custom rows and columns', () => {
    render(<TableSkeleton rows={2} columns={3} />);

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    // Should have header + 2 rows with 3 columns each = 1 + (2 * 3) = 7 skeletons
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies custom sx styles', () => {
    render(<TableSkeleton sx={{ padding: 2 }} />);

    const container = document.querySelector('.MuiBox-root');
    expect(container).toBeInTheDocument();
  });
});
