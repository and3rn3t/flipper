import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

  it('has exactly 11 menu items', () => {
    expect(menuItems).toHaveLength(11)
  })

  it('each menu item has a unique id', () => {
    const ids = menuItems.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('renders the footer help text', () => {
    render(<MainMenuScreen selectedIndex={0} />)
    expect(screen.getByText(/Press OK to select/)).toBeInTheDocument()
  })

  it('accepts different selectedIndex values without crashing', () => {
    const { unmount } = render(<MainMenuScreen selectedIndex={0} />)
    unmount()

    const { unmount: unmount2 } = render(<MainMenuScreen selectedIndex={5} />)
    unmount2()

    render(<MainMenuScreen selectedIndex={10} />)
    expect(screen.getByText('MAIN MENU')).toBeInTheDocument()
  })
})
