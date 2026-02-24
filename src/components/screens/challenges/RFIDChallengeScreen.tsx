import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface RFIDChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

export function RFIDChallengeScreen({ onComplete, onBack }: RFIDChallengeScreenProps) {
  const [step, setStep] = useState<'read' | 'clone' | 'verify' | 'complete'>('read')
  const [progress, setProgress] = useState(0)
  const [cardData, setCardData] = useState<string | null>(null)

  const targetCardId = 'A3:7F:2E:91:C4'

  useEffect(() => {
    if (step === 'read') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setCardData(targetCardId)
            setTimeout(() => setStep('clone'), 500)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleClone = () => {
    setStep('clone')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setStep('verify'), 500)
          return 100
        }
        return prev + 3
      })
    }, 80)
  }

  const handleVerify = () => {
    setStep('verify')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setStep('complete')
            setTimeout(onComplete, 1500)
          }, 500)
          return 100
        }
        return prev + 4
      })
    }, 100)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">RFID CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Clone the employee badge to gain building access
          </div>
        </div>

        <div className="space-y-2">
          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'read' ? 'border-primary bg-primary/10' : 
            cardData ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard weight="duotone" className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Step 1: Read Card</span>
              </div>
              {cardData && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'read' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-foreground/60">Scanning badge...</div>
              </div>
            )}
            {cardData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-primary font-mono"
              >
                ID: {cardData}
              </motion.div>
            )}
          </div>

          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'clone' ? 'border-primary bg-primary/10' : 
            step === 'verify' || step === 'complete' ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20 opacity-50'
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Step 2: Clone Data</span>
              {(step === 'verify' || step === 'complete') && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'clone' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-foreground/60">Writing to blank card...</div>
              </div>
            )}
            {cardData && step === 'read' && (
              <button
                onClick={handleClone}
                className="w-full mt-2 p-2 rounded border-2 border-primary bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                START CLONE
              </button>
            )}
          </div>

          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'verify' ? 'border-primary bg-primary/10' : 
            step === 'complete' ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20 opacity-50'
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Step 3: Verify</span>
              {step === 'complete' && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'verify' && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-foreground/60">Testing cloned badge...</div>
              </div>
            )}
            {step === 'clone' && progress === 100 && (
              <button
                onClick={handleVerify}
                className="w-full mt-2 p-2 rounded border-2 border-primary bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                VERIFY CLONE
              </button>
            )}
          </div>
        </div>

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">ACCESS GRANTED!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +100 pts</div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Clone RFID badges for authorized access
        </div>
      </div>
    </div>
  )
}
