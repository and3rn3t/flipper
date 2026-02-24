import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChallengeScreen, challenges } from '../components/screens/ChallengeScreen'

describe('ChallengeScreen', () => {
  it('renders all challenges', () => {
    render(<ChallengeScreen onBack={() => {}} />)
    for (const challenge of challenges) {
      expect(screen.getByText(challenge.title)).toBeInTheDocument()
    }
  })

  it('shows score display', () => {
    render(<ChallengeScreen onBack={() => {}} />)
    expect(screen.getByText('Your Score')).toBeInTheDocument()
  })

  it('has 7 challenges totaling 1700 points', () => {
    expect(challenges).toHaveLength(7)
    const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0)
    expect(totalPoints).toBe(1700)
  })
})
