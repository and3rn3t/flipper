import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MainMenuScreen, menuItems } from '../components/screens/MainMenuScreen'

describe('MainMenuScreen', () => {
  it('renders the MAIN MENU header', () => {
    render(<MainMenuScreen selectedIndex={0} />)
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
  })

  it('renders all menu items with labels and descriptions', () => {
    render(<MainMenuScreen selectedIndex={0} />)
    for (const item of menuItems) {
      expect(screen.getByText(item.label)).toBeInTheDocument()
      expect(screen.getByText(item.description)).toBeInTheDocument()
    }
  })

  it('has exactly 12 menu items', () => {
    expect(menuItems).toHaveLength(12)
  })

  it('each menu item has a unique id', () => {
    const ids = menuItems.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('renders the footer help text', () => {
    render(<MainMenuScreen selectedIndex={0} />)
    expect(screen.getByText(/Press OK to select/)).toBeInTheDocument()
  })

  it('calls onSelect when a menu item is clicked', () => {
    const onSelect = vi.fn()
    render(<MainMenuScreen selectedIndex={0} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Sub-GHz'))
    expect(onSelect).toHaveBeenCalledWith('subghz')
  })
})
