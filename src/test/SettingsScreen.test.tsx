import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsScreen } from '../components/screens/SettingsScreen'

describe('SettingsScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<SettingsScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the Settings header', () => {
    setup()
    expect(screen.getByText('SETTINGS')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    fireEvent.click(screen.getByText('[BACK]'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows about section', () => {
    setup()
    expect(screen.getByText(/About/)).toBeInTheDocument()
    expect(screen.getByText('Flipper Zero Lab')).toBeInTheDocument()
  })

  it('shows keyboard shortcuts section', () => {
    setup()
    expect(screen.getByText(/Keyboard Shortcuts/i)).toBeInTheDocument()
  })

  it('lists correct storage categories', () => {
    setup()
    expect(screen.getByText('Sub-GHz Signals')).toBeInTheDocument()
    expect(screen.getByText('RFID Cards')).toBeInTheDocument()
    expect(screen.getByText('IR Signals')).toBeInTheDocument()
    expect(screen.getByText('Challenge Score')).toBeInTheDocument()
    expect(screen.getByText('Challenge Progress')).toBeInTheDocument()
  })

  it('shows footer with current year', () => {
    setup()
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })
})
