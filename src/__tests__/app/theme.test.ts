import { theme } from '../../app/theme'

describe('Theme Configuration', () => {
  it('has correct primary color', () => {
    expect(theme.palette.primary.main).toBe('#1976d2')
  })

  it('has correct secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#dc004e')
  })

  it('is in light mode', () => {
    expect(theme.palette.mode).toBe('light')
  })

  it('has correct typography font family', () => {
    const expectedFontFamily = [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(',')

    expect(theme.typography.fontFamily).toBe(expectedFontFamily)
  })

  it('has all required theme properties', () => {
    expect(theme).toHaveProperty('palette')
    expect(theme).toHaveProperty('typography')
    expect(theme).toHaveProperty('spacing')
    expect(theme).toHaveProperty('breakpoints')
    expect(theme).toHaveProperty('shadows')
    expect(theme).toHaveProperty('transitions')
  })
})
