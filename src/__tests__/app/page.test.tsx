import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../../app/page'

// Mock window.alert
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})

describe('Home Page', () => {
  beforeEach(() => {
    mockAlert.mockClear()
  })

  afterAll(() => {
    mockAlert.mockRestore()
  })

  it('renders the main heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Hello World!')
  })

  it('renders the welcome message', () => {
    render(<Home />)

    const welcomeMessage = screen.getByText(/Welcome to your modern Next.js app/)
    expect(welcomeMessage).toBeInTheDocument()
  })

  it('renders the app bar with title', () => {
    render(<Home />)

    const appBarTitle = screen.getByText('Hello World App')
    expect(appBarTitle).toBeInTheDocument()
  })

  it('renders the GitHub icon button', () => {
    render(<Home />)

    const githubButton = screen.getByTestId('GitHubIcon')
    expect(githubButton).toBeInTheDocument()
  })

  it('renders the click me button', () => {
    render(<Home />)

    const clickButton = screen.getByRole('button', { name: /click me/i })
    expect(clickButton).toBeInTheDocument()
  })

  it('shows alert when click me button is clicked', () => {
    render(<Home />)

    const clickButton = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(clickButton)

    expect(mockAlert).toHaveBeenCalledWith('Hello from Material-UI!')
  })

  it('renders the features section', () => {
    render(<Home />)

    const featuresHeading = screen.getByRole('heading', { level: 2 })
    expect(featuresHeading).toHaveTextContent('Features')
  })

  it('renders all feature items', () => {
    render(<Home />)

    const features = [
      '✅ Next.js 15 with App Router',
      '✅ TypeScript for type safety',
      '✅ Material-UI for beautiful components',
      '✅ Emotion for styling',
      '✅ Modern React 19 features',
    ]

    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
  })

  it('has proper Material-UI theming', () => {
    render(<Home />)

    // Check if the main container has Material-UI classes
    const container = document.querySelector('.MuiContainer-root')
    expect(container).toBeInTheDocument()
  })
})
