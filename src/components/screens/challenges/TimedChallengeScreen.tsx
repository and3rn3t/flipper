import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Timer, CreditCard, XCircle } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TimedChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

export function TimedChallengeScreen({ onComplete, onBack }: TimedChallengeScreenProps) {
  const [step, setStep] = useState<'ready' | 'scanning' | 'complete' | 'failed'>('ready')
  const [timeRemaining, setTimeRemaining] = useState(15)
  const [cardsScanned, setCardsScanned] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  const requiredCards = 5
  const cardIds = [
    'A3:7F:2E:91:C4',
    'B2:8E:3D:82:F5',
    'C1:9D:4C:73:E6',
    'D0:AC:5B:64:D7',
    'E9:BB:6A:55:C8'
  ]

  useEffect(() => {
    if (step === 'scanning' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            if (cardsScanned < requiredCards) {
              setStep('failed')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeRemaining, cardsScanned])

  const startChallenge = () => {
    setStep('scanning')
    setTimeRemaining(15)
    setCardsScanned(0)
  }

  const scanCard = () => {
    if (isScanning || cardsScanned >= requiredCards) return
    
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setCardsScanned((c) => {
            const newCount = c + 1
            if (newCount >= requiredCards) {
              setTimeout(() => {
                setStep('complete')
                setTimeout(onComplete, 1500)
              }, 500)
            }
            return newCount
          })
          return 0
        }
        return prev + 10
      })
    }, 50)
  }

  const retry = () => {
    setStep('ready')
    setCardsScanned(0)
    setTimeRemaining(15)
    setScanProgress(0)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SPEED CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Clone {requiredCards} employee badges before time runs out
          </div>
        </div>

        {step === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 rounded border border-foreground/20 bg-background/50 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <Timer weight="fill" className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-lg font-bold text-primary">15 Seconds</div>
                  <div className="text-xs text-foreground/60">Time Limit</div>
                </div>
              </div>
              <div className="text-xs text-foreground/70 space-y-1">
                <div>• Scan and clone {requiredCards} different badges</div>
                <div>• Each scan takes approximately 1 second</div>
                <div>• Work fast but stay accurate</div>
              </div>
            </div>
            <button
              onClick={startChallenge}
              className="w-full p-4 rounded border-2 border-primary bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/80 transition-colors"
            >
              START CHALLENGE
            </button>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className={cn(
              'p-4 rounded border-2 transition-all',
              timeRemaining <= 5 ? 'border-red-400 bg-red-400/10' : 'border-primary bg-primary/10'
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer weight="fill" className={cn(
                    'w-6 h-6',
                    timeRemaining <= 5 ? 'text-red-400' : 'text-primary'
                  )} />
                  <span className="text-2xl font-bold">
                    {timeRemaining}s
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{cardsScanned}/{requiredCards}</div>
                  <div className="text-xs text-foreground/60">Scanned</div>
                </div>
              </div>
              <Progress 
                value={(cardsScanned / requiredCards) * 100} 
                className="h-3"
              />
            </div>

            <div className="space-y-2">
              {cardIds.slice(0, requiredCards).map((id, index) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-3 rounded border-2 transition-all',
                    index < cardsScanned 
                      ? 'border-green-400 bg-green-400/10'
                      : index === cardsScanned && isScanning
                      ? 'border-primary bg-primary/10'
                      : 'border-foreground/20 bg-background/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard weight="duotone" className="w-5 h-5" />
                      <span className="text-sm font-mono">{id}</span>
                    </div>
                    {index < cardsScanned && (
                      <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  {index === cardsScanned && isScanning && (
                    <Progress value={scanProgress} className="h-1 mt-2" />
                  )}
                </motion.div>
              ))}
            </div>

            {!isScanning && cardsScanned < requiredCards && (
              <button
                onClick={scanCard}
                className="w-full p-4 rounded border-2 border-primary bg-primary text-primary-foreground font-bold hover:bg-primary/80 transition-colors"
              >
                SCAN NEXT CARD
              </button>
            )}
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">MISSION SUCCESS!</div>
            <div className="text-sm text-foreground/80 mb-2">
              All badges cloned in {15 - timeRemaining} seconds
            </div>
            <div className="text-xs text-foreground/60">Challenge Complete +350 pts</div>
          </motion.div>
        )}

        {step === 'failed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="p-4 rounded border-2 border-red-400 bg-red-400/20 text-center">
              <XCircle weight="fill" className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-red-400 mb-1">TIME&apos;S UP!</div>
              <div className="text-sm text-foreground/80 mb-2">
                Only scanned {cardsScanned}/{requiredCards} badges
              </div>
            </div>
            <button
              onClick={retry}
              className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
            >
              TRY AGAIN
            </button>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Race against the clock to complete the mission
        </div>
      </div>
    </div>
  )
}
