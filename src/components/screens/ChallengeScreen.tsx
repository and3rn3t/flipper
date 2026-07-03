import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Lock, CheckCircle, Star, ArrowClockwise } from '@phosphor-icons/react'
import { useLocalKV } from '@/hooks/use-local-kv'
import { cn } from '@/lib/utils'
import { RFIDChallengeScreen } from './challenges/RFIDChallengeScreen'
import { SubGHzChallengeScreen } from './challenges/SubGHzChallengeScreen'
import { InfraredChallengeScreen } from './challenges/InfraredChallengeScreen'
import { BadUSBChallengeScreen } from './challenges/BadUSBChallengeScreen'
import { GPIOChallengeScreen } from './challenges/GPIOChallengeScreen'
import { MultiToolChallengeScreen } from './challenges/MultiToolChallengeScreen'
import { TimedChallengeScreen } from './challenges/TimedChallengeScreen'

interface ChallengeScreenProps {
  onBack: () => void
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tool: string
  points: number
}

export const challenges: Challenge[] = [
  {
    id: 'rfid-clone',
    title: 'Access Card Clone',
    description: 'Clone the employee badge to gain access',
    difficulty: 'Easy',
    tool: 'RFID',
    points: 100
  },
  {
    id: 'subghz-unlock',
    title: 'Garage Door Unlock',
    description: 'Capture and replay the garage door signal',
    difficulty: 'Medium',
    tool: 'Sub-GHz',
    points: 200
  },
  {
    id: 'infrared-tv',
    title: 'Universal Remote',
    description: 'Find the correct IR code to control the TV',
    difficulty: 'Easy',
    tool: 'Infrared',
    points: 100
  },
  {
    id: 'badusb-payload',
    title: 'Payload Delivery',
    description: 'Execute the correct keystroke sequence',
    difficulty: 'Hard',
    tool: 'Bad USB',
    points: 300
  },
  {
    id: 'gpio-bypass',
    title: 'Electronic Lock Bypass',
    description: 'Configure GPIO pins to unlock the electronic lock',
    difficulty: 'Medium',
    tool: 'GPIO',
    points: 250
  },
  {
    id: 'speed-run',
    title: 'Speed Clone Challenge',
    description: 'Clone 5 badges in 15 seconds',
    difficulty: 'Hard',
    tool: 'RFID',
    points: 350
  },
  {
    id: 'vault-heist',
    title: 'Vault Heist',
    description: 'Use multiple tools to break into the vault',
    difficulty: 'Hard',
    tool: 'Multi-Tool',
    points: 400
  }
]

export function ChallengeScreen({ onBack }: ChallengeScreenProps) {
  const [completedChallenges, setCompletedChallenges] = useLocalKV<string[]>('completed-challenges', [])
  const [totalScore, setTotalScore] = useLocalKV<number>('challenge-score', 0)
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

  const handleChallengeComplete = (challengeId: string, points: number) => {
    const alreadyCompleted = (completedChallenges ?? []).includes(challengeId)
    if (!alreadyCompleted) {
      setCompletedChallenges((current = []) => [...current, challengeId])
      setTotalScore((current = 0) => current + points)
    }
    setSelectedChallenge(null)
  }

  const handleChallengeBack = () => {
    setSelectedChallenge(null)
  }

  if (selectedChallenge === 'rfid-clone') {
    return <RFIDChallengeScreen onComplete={() => handleChallengeComplete('rfid-clone', 100)} onBack={handleChallengeBack} />
  }
  
  if (selectedChallenge === 'subghz-unlock') {
    return <SubGHzChallengeScreen onComplete={() => handleChallengeComplete('subghz-unlock', 200)} onBack={handleChallengeBack} />
  }
  
  if (selectedChallenge === 'infrared-tv') {
    return <InfraredChallengeScreen onComplete={() => handleChallengeComplete('infrared-tv', 100)} onBack={handleChallengeBack} />
  }
  
  if (selectedChallenge === 'badusb-payload') {
    return <BadUSBChallengeScreen onComplete={() => handleChallengeComplete('badusb-payload', 300)} onBack={handleChallengeBack} />
  }

  if (selectedChallenge === 'gpio-bypass') {
    return <GPIOChallengeScreen onComplete={() => handleChallengeComplete('gpio-bypass', 250)} onBack={handleChallengeBack} />
  }

  if (selectedChallenge === 'speed-run') {
    return <TimedChallengeScreen onComplete={() => handleChallengeComplete('speed-run', 350)} onBack={handleChallengeBack} />
  }

  if (selectedChallenge === 'vault-heist') {
    return <MultiToolChallengeScreen onComplete={() => handleChallengeComplete('vault-heist', 400)} onBack={handleChallengeBack} />
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">CHALLENGE MODE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded border-2 border-primary bg-primary/10"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy weight="fill" className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Your Score</span>
            </div>
            <div className="text-lg font-bold text-primary">{totalScore}</div>
          </div>
          <div className="text-xs text-foreground/60 flex items-center justify-between">
            <span>{completedChallenges?.length || 0}/{challenges.length} Challenges Completed</span>
            {(completedChallenges?.length || 0) > 0 && (
              <button
                onClick={() => { setCompletedChallenges([]); setTotalScore(0) }}
                className="flex items-center gap-1 text-foreground/40 hover:text-destructive transition-colors"
              >
                <ArrowClockwise weight="bold" className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="text-xs text-foreground/50 mb-2">AVAILABLE CHALLENGES:</div>
          {challenges.map((challenge, index) => {
            const isCompleted = completedChallenges?.includes(challenge.id) || false
            const difficultyColor = 
              challenge.difficulty === 'Easy' ? 'text-green-400' :
              challenge.difficulty === 'Medium' ? 'text-yellow-400' :
              'text-red-400'

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedChallenge(challenge.id)}
                className={cn(
                  'p-3 rounded border-2 cursor-pointer transition-all',
                  isCompleted 
                    ? 'border-green-400/20 bg-green-400/5 hover:border-green-400/40 hover:bg-green-400/10' 
                    : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-sm font-semibold', isCompleted ? 'text-foreground/60' : 'text-foreground')}>
                        {challenge.title}
                      </span>
                      {isCompleted && (
                        <CheckCircle weight="fill" className="w-4 h-4 text-green-400" />
                      )}
                      {!isCompleted && (
                        <Lock weight="fill" className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-foreground/50 mb-2">
                      {challenge.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/40">{challenge.tool}</span>
                      <span className="text-xs text-foreground/20">•</span>
                      <span className={cn('text-xs font-semibold', difficultyColor)}>
                        {challenge.difficulty}
                      </span>
                      {isCompleted && (
                        <>
                          <span className="text-xs text-foreground/20">•</span>
                          <span className="text-xs text-green-400/70">Replay</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Star weight="fill" className="w-3 h-3 text-primary" />
                      <span className="text-xs font-bold text-primary">{challenge.points}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Solve security puzzles to earn points
        </div>
      </div>
    </div>
  )
}
