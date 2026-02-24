import { useState, useCallback } from 'react'

/**
 * A localStorage-backed replacement for @github/spark's useKV hook.
 * Provides persistent key-value storage with the same API shape.
 */
export function useLocalKV<T>(key: string, defaultValue: T): [T, (updater: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`flipper-kv:${key}`)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // Ignore parse errors, fall through to default
    }
    return defaultValue
  })

  const setStoredValue = useCallback(
    (updater: T | ((current: T) => T)) => {
      setValue((current) => {
        const next = typeof updater === 'function'
          ? (updater as (current: T) => T)(current ?? defaultValue)
          : updater
        try {
          localStorage.setItem(`flipper-kv:${key}`, JSON.stringify(next))
        } catch {
          // Ignore storage errors (quota exceeded, etc.)
        }
        return next
      })
    },
    [key, defaultValue]
  )

  return [value, setStoredValue]
}
