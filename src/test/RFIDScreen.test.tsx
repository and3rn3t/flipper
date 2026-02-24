import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RFIDScreen } from '../components/screens/RFIDScreen'

describe('RFIDScreen', () => {
  const setup = () => {
    const onBack = vi.fn()
    render(<RFIDScreen onBack={onBack} />)
    return { onBack }
  }

  it('renders the RFID/NFC header', () => {
    setup()
    expect(screen.getByText('RFID/NFC READER')).toBeInTheDocument()
  })

  it('renders BACK button that calls onBack', () => {
    const { onBack } = setup()
    fireEvent.click(screen.getByText('[BACK]'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('renders tab navigation (READ, SAVED, WRITE)', () => {
    setup()
    expect(screen.getByText('READ')).toBeInTheDocument()
    expect(screen.getByText('SAVED (0)')).toBeInTheDocument()
    expect(screen.getByText('WRITE')).toBeInTheDocument()
  })

  it('shows scan button in READ tab', () => {
    setup()
    expect(screen.getByText('READ CARD')).toBeInTheDocument()
  })

  it('starts scanning when READ CARD is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('READ CARD'))
    await waitFor(() => {
      expect(screen.getByText('Scanning for card...')).toBeInTheDocument()
    })
  })
})
