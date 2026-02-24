import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InfraredScreen } from '../components/screens/InfraredScreen'

describe('InfraredScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<InfraredScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the Infrared header', () => {
    setup()
    expect(screen.getByText('INFRARED')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    const backBtn = screen.getByText('[BACK]')
    backBtn.click()
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders tab navigation', () => {
    setup()
    expect(screen.getByText('REMOTE')).toBeInTheDocument()
    expect(screen.getByText('LIBRARY (0)')).toBeInTheDocument()
    expect(screen.getByText('CAPTURE')).toBeInTheDocument()
  })

  it('shows device selector in remote view', () => {
    setup()
    expect(screen.getByText('Samsung TV')).toBeInTheDocument()
  })

  it('renders remote buttons after selecting a device', async () => {
    setup()
    // Click Samsung TV to select it
    fireEvent.click(screen.getByText('Samsung TV'))
    // Buttons appear after device selection
    expect(await screen.findByText('POWER')).toBeInTheDocument()
  })
})
