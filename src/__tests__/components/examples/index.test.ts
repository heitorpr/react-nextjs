import * as ExampleComponents from '../../../components/examples';

describe('Example Components Index', () => {
  it('exports UserList', () => {
    expect(ExampleComponents.UserList).toBeDefined();
    expect(typeof ExampleComponents.UserList).toBe('function');
  });

  it('exports DataTable', () => {
    expect(ExampleComponents.DataTable).toBeDefined();
    expect(typeof ExampleComponents.DataTable).toBe('function');
  });

  it('exports LoadingExamples', () => {
    expect(ExampleComponents.LoadingExamples).toBeDefined();
    expect(typeof ExampleComponents.LoadingExamples).toBe('function');
  });

  it('exports all expected components', () => {
    const expectedExports = ['UserList', 'DataTable', 'LoadingExamples'];

    expectedExports.forEach(exportName => {
      expect(ExampleComponents).toHaveProperty(exportName);
      expect(
        ExampleComponents[exportName as keyof typeof ExampleComponents]
      ).toBeDefined();
    });
  });
});
