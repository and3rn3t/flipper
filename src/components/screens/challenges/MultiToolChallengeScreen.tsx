import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Broadcast, Lightning, Lock } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface MultiToolChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

type Step = 'intro' | 'rfid' | 'subghz' | 'gpio' | 'complete'

export function MultiToolChallengeScreen({ onComplete, onBack }: MultiToolChallengeScreenProps) {
  const [step, setStep] = useState<Step>('intro')
  const [rfidProgress, setRfidProgress] = useState(0)
  const [subghzProgress, setSubghzProgress] = useState(0)
  const [gpioUnlocked, setGpioUnlocked] = useState(false)
  const [selectedPins, setSelectedPins] = useState<number[]>([])

  const correctPins = [2, 5, 8]

  useEffect(() => {
    if (step === 'rfid') {
      const interval = setInterval(() => {
        setRfidProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('subghz'), 800)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [step])

  useEffect(() => {
    if (step === 'subghz') {
      const interval = setInterval(() => {
        setSubghzProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('gpio'), 800)
            return 100
          }
          return prev + 3
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [step])

  const togglePin = (pin: number) => {
    setSelectedPins(prev => 
      prev.includes(pin) 
        ? prev.filter(p => p !== pin)
        : [...prev, pin]
    )
  }

  const checkGpio = () => {
    const isCorrect = 
      correctPins.length === selectedPins.length &&
      correctPins.every(pin => selectedPins.includes(pin))
    
    if (isCorrect) {
      setGpioUnlocked(true)
      setTimeout(() => {
        setStep('complete')
        setTimeout(onComplete, 1500)
      }, 1500)
    }
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">VAULT HEIST</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Break into the high-security vault using multiple Flipper tools
          </div>
        </div>

        <div className="space-y-2">
          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'intro' || step === 'rfid' ? 'border-primary bg-primary/10' : 
            rfidProgress === 100 ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20 opacity-50'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard weight="duotone" className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Phase 1: Clone Badge</span>
              </div>
              {rfidProgress === 100 && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'intro' && (
              <button
                onClick={() => setStep('rfid')}
                className="w-full p-2 rounded border border-primary text-primary text-xs hover:bg-primary/10 transition-colors"
              >
                START PHASE 1
              </button>
            )}
            {step === 'rfid' && (
              <div className="space-y-2">
                <Progress value={rfidProgress} className="h-2" />
                <div className="text-xs text-foreground/60">Reading security badge...</div>
              </div>
            )}
            {rfidProgress === 100 && (
              <div className="text-xs text-primary font-mono">
                ✓ Badge cloned: ID A7:3E:F2:91
              </div>
            )}
          </div>

          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'subghz' ? 'border-primary bg-primary/10' : 
            subghzProgress === 100 ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20 opacity-50'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Broadcast weight="duotone" className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Phase 2: Disable Alarm</span>
              </div>
              {subghzProgress === 100 && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'subghz' && (
              <div className="space-y-2">
                <Progress value={subghzProgress} className="h-2" />
                <div className="text-xs text-foreground/60">Jamming 315 MHz alarm signal...</div>
              </div>
            )}
            {subghzProgress === 100 && (
              <div className="text-xs text-primary font-mono">
                ✓ Alarm disabled successfully
              </div>
            )}
          </div>

          <div className={cn(
            'p-3 rounded border-2 transition-all',
            step === 'gpio' ? 'border-primary bg-primary/10' : 
            gpioUnlocked ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20 opacity-50'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightning weight="duotone" className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Phase 3: Unlock Vault</span>
              </div>
              {gpioUnlocked && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
            </div>
            {step === 'gpio' && !gpioUnlocked && (
              <div className="space-y-3">
                <div className="text-xs text-foreground/60 mb-2">
                  Select the correct GPIO pins to trigger the vault mechanism
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pin) => (
                    <motion.button
                      key={pin}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePin(pin)}
                      className={cn(
                        'p-3 rounded border-2 text-xs font-semibold transition-all',
                        selectedPins.includes(pin)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-foreground/20 bg-background/50 text-foreground/60 hover:border-primary/50'
                      )}
                    >
                      {pin}
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={checkGpio}
                  disabled={selectedPins.length !== 3}
                  className={cn(
                    'w-full p-2 rounded border-2 text-sm font-semibold transition-colors',
                    selectedPins.length === 3
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                      : 'border-foreground/20 bg-foreground/5 text-foreground/40 cursor-not-allowed'
                  )}
                >
                  ACTIVATE PINS
                </button>
              </div>
            )}
            {gpioUnlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-primary font-mono"
              >
                ✓ Vault unlocked: Pins {correctPins.join(', ')} activated
              </motion.div>
            )}
          </div>
        </div>

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <Lock weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">VAULT OPENED!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +400 pts</div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Multi-tool security bypass challenge
        </div>
      </div>
    </div>
  )
}
