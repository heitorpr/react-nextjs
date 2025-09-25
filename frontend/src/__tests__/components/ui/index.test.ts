import * as UIComponents from '../../../components/ui';

describe('UI Components Index', () => {
  it('exports LoadingSpinner', () => {
    expect(UIComponents.LoadingSpinner).toBeDefined();
    expect(typeof UIComponents.LoadingSpinner).toBe('function');
  });

  it('exports LoadingSkeleton', () => {
    expect(UIComponents.LoadingSkeleton).toBeDefined();
    expect(typeof UIComponents.LoadingSkeleton).toBe('function');
  });

  it('exports CardSkeleton', () => {
    expect(UIComponents.CardSkeleton).toBeDefined();
    expect(typeof UIComponents.CardSkeleton).toBe('function');
  });

  it('exports TableSkeleton', () => {
    expect(UIComponents.TableSkeleton).toBeDefined();
    expect(typeof UIComponents.TableSkeleton).toBe('function');
  });

  it('exports ErrorDisplay', () => {
    expect(UIComponents.ErrorDisplay).toBeDefined();
    expect(typeof UIComponents.ErrorDisplay).toBe('function');
  });

  it('exports EmptyState', () => {
    expect(UIComponents.EmptyState).toBeDefined();
    expect(typeof UIComponents.EmptyState).toBe('function');
  });

  it('exports AsyncWrapper', () => {
    expect(UIComponents.AsyncWrapper).toBeDefined();
    expect(typeof UIComponents.AsyncWrapper).toBe('function');
  });

  it('exports all expected components', () => {
    const expectedExports = [
      'LoadingSpinner',
      'LoadingSkeleton',
      'CardSkeleton',
      'TableSkeleton',
      'ErrorDisplay',
      'EmptyState',
      'AsyncWrapper',
    ];

    expectedExports.forEach(exportName => {
      expect(UIComponents).toHaveProperty(exportName);
      expect(
        UIComponents[exportName as keyof typeof UIComponents]
      ).toBeDefined();
    });
  });
});
