import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

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
})
