import React from 'react'
import { render, screen } from '@testing-library/react'
import PWAInstaller from '../../components/PWAInstaller'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
})

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
})

describe('PWAInstaller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<PWAInstaller />)
    expect(screen.queryByText(/Install this app/)).not.toBeInTheDocument()
  })

  it('shows installed message when app is in standalone mode', () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(<PWAInstaller />)
    expect(screen.getByText(/App is installed and ready to use offline!/)).toBeInTheDocument()
  })

  it('sets up event listeners on mount', () => {
    render(<PWAInstaller />)

    expect(mockAddEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
    expect(mockAddEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
  })

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<PWAInstaller />)

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
    expect(mockRemoveEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
  })
})
