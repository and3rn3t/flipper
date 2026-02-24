import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ErrorFallback rethrows in dev mode, so we need to mock import.meta.env.DEV
// @ts-expect-error stubEnv expects boolean but Vite's DEV is actually string-based in test env
vi.stubEnv('DEV', '')

// Must import AFTER stubbing env so the module reads the stubbed value
const { ErrorFallback } = await import('../ErrorFallback')

describe('ErrorFallback', () => {
  const testError = new Error('Test explosion')

  it('renders the error message', () => {
    render(<ErrorFallback error={testError} resetErrorBoundary={() => {}} />)
    expect(screen.getByText('System Error')).toBeInTheDocument()
    expect(screen.getByText('Test explosion')).toBeInTheDocument()
  })

  it('renders the Diagnostic Output label', () => {
    render(<ErrorFallback error={testError} resetErrorBoundary={() => {}} />)
    expect(screen.getByText('Diagnostic Output')).toBeInTheDocument()
  })

  it('has a Retry button that calls resetErrorBoundary', () => {
    const reset = vi.fn()
    render(<ErrorFallback error={testError} resetErrorBoundary={reset} />)
    fireEvent.click(screen.getByText('Retry'))
    expect(reset).toHaveBeenCalledOnce()
  })

  it('has a Main Menu button that clears hash and calls resetErrorBoundary', () => {
    window.location.hash = '#subghz'
    const reset = vi.fn()
    render(<ErrorFallback error={testError} resetErrorBoundary={reset} />)
    fireEvent.click(screen.getByText('Main Menu'))
    expect(window.location.hash).toBe('')
    expect(reset).toHaveBeenCalledOnce()
  })
})
