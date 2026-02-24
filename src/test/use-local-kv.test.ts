import { describe, it, expect } from 'vitest'
import { useLocalKV } from '../hooks/use-local-kv'
import { renderHook, act } from '@testing-library/react'

describe('useLocalKV', () => {
  it('returns default value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalKV('test-key-1', 42))
    expect(result.current[0]).toBe(42)
  })

  it('persists values to localStorage', () => {
    const { result } = renderHook(() => useLocalKV('test-key-2', 0))

    act(() => {
      result.current[1](100)
    })

    expect(result.current[0]).toBe(100)
    expect(localStorage.getItem('flipper-kv:test-key-2')).toBe('100')
  })

  it('supports updater function', () => {
    const { result } = renderHook(() => useLocalKV('test-key-3', 10))

    act(() => {
      result.current[1]((current) => current + 5)
    })

    expect(result.current[0]).toBe(15)
  })

  it('reads stored value on mount', () => {
    localStorage.setItem('flipper-kv:test-key-4', JSON.stringify('hello'))

    const { result } = renderHook(() => useLocalKV('test-key-4', 'default'))
    expect(result.current[0]).toBe('hello')
  })

  it('handles arrays', () => {
    const { result } = renderHook(() => useLocalKV<string[]>('test-key-5', []))

    act(() => {
      result.current[1]((current) => [...current, 'item1'])
    })

    expect(result.current[0]).toEqual(['item1'])
  })
})
