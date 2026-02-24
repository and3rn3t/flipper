import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FlipperDevice } from '../components/FlipperDevice'

describe('FlipperDevice', () => {
  const setup = () => {
    const onNavigate = vi.fn()
    render(
      <FlipperDevice
        screenContent={<div>Test Screen</div>}
        onNavigate={onNavigate}
      />
    )
    return { onNavigate }
  }

  it('renders screen content', () => {
    setup()
    expect(screen.getByText('Test Screen')).toBeInTheDocument()
  })

  it('renders all D-pad buttons with accessible labels', () => {
    setup()
    expect(screen.getByLabelText('Up')).toBeInTheDocument()
    expect(screen.getByLabelText('Down')).toBeInTheDocument()
    expect(screen.getByLabelText('Left')).toBeInTheDocument()
    expect(screen.getByLabelText('Right')).toBeInTheDocument()
    expect(screen.getByLabelText('OK')).toBeInTheDocument()
    // Two back buttons (left and right sides)
    expect(screen.getAllByLabelText('Back')).toHaveLength(2)
  })

  it('calls onNavigate("up") when Up is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getByLabelText('Up'))
    expect(onNavigate).toHaveBeenCalledWith('up')
  })

  it('calls onNavigate("down") when Down is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getByLabelText('Down'))
    expect(onNavigate).toHaveBeenCalledWith('down')
  })

  it('calls onNavigate("left") when Left is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getByLabelText('Left'))
    expect(onNavigate).toHaveBeenCalledWith('left')
  })

  it('calls onNavigate("right") when Right is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getByLabelText('Right'))
    expect(onNavigate).toHaveBeenCalledWith('right')
  })

  it('calls onNavigate("ok") when OK is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getByLabelText('OK'))
    expect(onNavigate).toHaveBeenCalledWith('ok')
  })

  it('calls onNavigate("back") when Back is clicked', () => {
    const { onNavigate } = setup()
    fireEvent.click(screen.getAllByLabelText('Back')[0])
    expect(onNavigate).toHaveBeenCalledWith('back')
  })

  it('renders the device label', () => {
    setup()
    expect(screen.getByText('Flipper Zero')).toBeInTheDocument()
    expect(screen.getByText('Experimentation Lab')).toBeInTheDocument()
  })
})
