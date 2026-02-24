import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Lock, CheckCircle, XCircle, Star } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { cn } from '@/lib/utils'
import { RFIDChallengeScreen } from './challenges/RFIDChallengeScreen'
import { SubGHzChallengeScreen } from './challenges/SubGHzChallengeScreen'
import { InfraredChallengeScreen } from './challenges/InfraredChallengeScreen'
import { BadUSBChallengeScreen } from './challenges/BadUSBChallengeScreen'

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
  }
]

export function ChallengeScreen({ onBack }: ChallengeScreenProps) {
  const [completedChallenges, setCompletedChallenges] = useKV<string[]>('completed-challenges', [])
  const [totalScore, setTotalScore] = useKV<number>('challenge-score', 0)
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

  const handleChallengeComplete = (challengeId: string, points: number) => {
    setCompletedChallenges((current = []) => {
      if (!current.includes(challengeId)) {
        return [...current, challengeId]
      }
      return current
    })
    setTotalScore((current = 0) => current + points)
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
          <div className="text-xs text-foreground/60">
            {completedChallenges?.length || 0}/{challenges.length} Challenges Completed
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
                onClick={() => !isCompleted && setSelectedChallenge(challenge.id)}
                className={cn(
                  'p-3 rounded border-2 cursor-pointer transition-all',
                  isCompleted 
                    ? 'border-foreground/20 bg-foreground/5 opacity-60' 
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
