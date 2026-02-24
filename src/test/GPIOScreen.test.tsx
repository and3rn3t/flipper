import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GPIOScreen } from '../components/screens/GPIOScreen'

describe('GPIOScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<GPIOScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the GPIO INTERFACE header', () => {
    setup()
    expect(screen.getByText('GPIO INTERFACE')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    fireEvent.click(screen.getByText('[BACK]'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders the pinout section with pin labels', () => {
    setup()
    expect(screen.getByText('PINOUT — TAP GPIO PINS TO TOGGLE')).toBeInTheDocument()
    expect(screen.getByText('PA7')).toBeInTheDocument()
    expect(screen.getByText('3V3')).toBeInTheDocument()
    expect(screen.getAllByText('GND').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the pin state legend', () => {
    setup()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('LOW')).toBeInTheDocument()
    expect(screen.getByText('OFF')).toBeInTheDocument()
  })

  it('renders example projects', () => {
    setup()
    expect(screen.getByText('LED Blinker')).toBeInTheDocument()
    expect(screen.getByText('UART Logger')).toBeInTheDocument()
    expect(screen.getByText('I2C Scanner')).toBeInTheDocument()
  })

  it('navigates to project view when clicking a project', async () => {
    setup()
    fireEvent.click(screen.getByText('LED Blinker'))
    expect(await screen.findByText('TERMINAL OUTPUT')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE PINS')).toBeInTheDocument()
  })
})
