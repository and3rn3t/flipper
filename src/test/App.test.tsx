import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import App from '../App'

function pressKey(key: string) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
}

beforeEach(() => {
  window.location.hash = ''
})

describe('App', () => {
  it('renders the page heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Flipper Zero')
  })

  it('renders the main menu by default', () => {
    render(<App />)
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
    expect(screen.getByText('Sub-GHz')).toBeInTheDocument()
  })

  it('renders the info cards', () => {
    render(<App />)
    expect(screen.getByText('About Flipper Zero')).toBeInTheDocument()
    expect(screen.getByText('Controls')).toBeInTheDocument()
  })

  it('renders all 11 menu items', () => {
    render(<App />)
    const labels = ['Sub-GHz', 'Spectrum', 'RFID/NFC', 'Infrared', 'Bluetooth', 'WiFi', 'Zigbee', 'GPIO', 'Bad USB', 'Education', 'Challenges']
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})

describe('Keyboard navigation', () => {
  it('navigates to a screen with Enter', async () => {
    render(<App />)
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()

    // Press Enter on first item (Sub-GHz, index 0)
    pressKey('Enter')
    // Hash should update immediately
    expect(window.location.hash).toBe('#subghz')
    // Old screen exits via AnimatePresence
    await waitFor(() => {
      expect(screen.queryByText('MAIN MENU')).not.toBeInTheDocument()
    })
  })

  it('returns to menu with Escape', async () => {
    render(<App />)

    // Navigate into Sub-GHz
    pressKey('Enter')
    expect(window.location.hash).toBe('#subghz')
    await waitFor(() => {
      expect(screen.queryByText('MAIN MENU')).not.toBeInTheDocument()
    })

    // Press Escape to go back
    pressKey('Escape')
    await waitFor(() => {
      expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
    })
  })

  it('does not go below last menu item', () => {
    render(<App />)

    // Press down 20 times (more than 11 items)
    for (let i = 0; i < 20; i++) {
      pressKey('ArrowDown')
    }
    // Should still render normally without errors
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
  })
})

describe('Hash routing', () => {
  it('opens the correct screen from initial hash', () => {
    window.location.hash = '#gpio'
    render(<App />)
    // Should NOT show the main menu
    expect(screen.queryByText('MAIN MENU')).not.toBeInTheDocument()
  })

  it('falls back to menu for an invalid hash', () => {
    window.location.hash = '#nonexistent'
    render(<App />)
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
  })

  it('updates hash when navigating via Enter', () => {
    render(<App />)

    // Navigate down once to Spectrum (index 1), then enter
    pressKey('ArrowDown')
    pressKey('Enter')
    expect(window.location.hash).toBe('#spectrum')
  })

  it('clears hash when returning to menu', () => {
    render(<App />)

    pressKey('Enter')  // enter Sub-GHz
    pressKey('Escape') // back to menu
    expect(window.location.hash).toBe('')
  })
})
