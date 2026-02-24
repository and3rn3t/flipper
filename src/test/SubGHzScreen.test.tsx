import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubGHzScreen } from '../components/screens/SubGHzScreen'

describe('SubGHzScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<SubGHzScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the Sub-GHz header', () => {
    setup()
    expect(screen.getByText('SUB-GHZ ANALYZER')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    fireEvent.click(screen.getByText('[BACK]'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders SCAN tab by default', () => {
    setup()
    expect(screen.getByText('SCAN')).toBeInTheDocument()
    expect(screen.getByText('SAVED (0)')).toBeInTheDocument()
    expect(screen.getByText('TX')).toBeInTheDocument()
  })

  it('shows scanning UI with start button', () => {
    setup()
    expect(screen.getByText('START SCAN')).toBeInTheDocument()
  })

  it('starts scanning when START SCAN is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('START SCAN'))
    await waitFor(() => {
      expect(screen.getByText('SCANNING...')).toBeInTheDocument()
    })
  })
})
