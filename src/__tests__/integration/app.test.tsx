import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../../app/page'

describe('App Integration Tests', () => {
  it('renders the complete app with all components', () => {
    render(<Home />)

    // Check main structure
    expect(screen.getByText('Hello World App')).toBeInTheDocument()
    expect(screen.getByText('Hello World!')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()

    // Check interactive elements
    const clickButton = screen.getByRole('button', { name: /click me/i })
    const githubButton = screen.getByTestId('GitHubIcon')

    expect(clickButton).toBeInTheDocument()
    expect(githubButton).toBeInTheDocument()
  })

  it('handles user interactions correctly', () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const clickButton = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(clickButton)

    expect(mockAlert).toHaveBeenCalledWith('Hello from Material-UI!')

    mockAlert.mockRestore()
  })

  it('displays all feature items correctly', () => {
    render(<Home />)

    const expectedFeatures = [
      '✅ Next.js 15 with App Router',
      '✅ TypeScript for type safety',
      '✅ Material-UI for beautiful components',
      '✅ Emotion for styling',
      '✅ Modern React 19 features',
    ]

    expectedFeatures.forEach(feature => {
      const featureElement = screen.getByText(feature)
      expect(featureElement).toBeInTheDocument()
    })
  })
})
