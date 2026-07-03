import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BadUSBScreen } from '../components/screens/BadUSBScreen'

describe('BadUSBScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<BadUSBScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the BAD USB header', () => {
    setup()
    expect(screen.getByText('BAD USB')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    fireEvent.click(screen.getByText('[BACK]'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows educational disclaimer', () => {
    setup()
    expect(screen.getByText('EDUCATIONAL ONLY')).toBeInTheDocument()
  })

  it('renders payload list', () => {
    setup()
    expect(screen.getByText('Harmless Prank')).toBeInTheDocument()
    expect(screen.getByText('WiFi Info Grabber')).toBeInTheDocument()
    expect(screen.getByText('System Info Export')).toBeInTheDocument()
  })

  it('navigates to editor view when selecting a payload', async () => {
    setup()
    fireEvent.click(screen.getByText('Harmless Prank'))
    expect(await screen.findByText('DUCKYSCRIPT EDITOR')).toBeInTheDocument()
    expect(screen.getByText('RUN')).toBeInTheDocument()
  })

  it('shows execution preview in editor', async () => {
    setup()
    fireEvent.click(screen.getByText('Harmless Prank'))
    expect(await screen.findByText('EXECUTION PREVIEW')).toBeInTheDocument()
  })
})
