import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Cpu, Lightning, Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface GPIOChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

type PinState = 'off' | 'low' | 'high'

export function GPIOChallengeScreen({ onComplete, onBack }: GPIOChallengeScreenProps) {
  const [step, setStep] = useState<'config' | 'sequence' | 'testing' | 'complete'>('config')
  const [pinStates, setPinStates] = useState<Record<number, PinState>>({
    3: 'off',
    5: 'off',
    7: 'off',
    11: 'off'
  })
  
  const correctSequence = [
    { pin: 3, state: 'high' },
    { pin: 5, state: 'high' },
    { pin: 7, state: 'low' },
    { pin: 11, state: 'high' }
  ]

  const togglePin = (pin: number) => {
    setPinStates(prev => {
      const current = prev[pin] || 'off'
      const next = current === 'off' ? 'low' : current === 'low' ? 'high' : 'off'
      return { ...prev, [pin]: next }
    })
  }

  const checkSequence = () => {
    const isCorrect = correctSequence.every(
      ({ pin, state }) => pinStates[pin] === state
    )
    
    if (isCorrect) {
      setStep('testing')
      setTimeout(() => {
        setStep('complete')
        setTimeout(onComplete, 1500)
      }, 2000)
    }
  }

  const getPinColor = (state: PinState) => {
    switch (state) {
      case 'high': return 'bg-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]'
      case 'low': return 'bg-blue-400 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'
      default: return 'bg-foreground/10 border-foreground/20'
    }
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">GPIO CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground mb-2">
            Bypass the electronic lock by setting the correct GPIO pin states
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-background/50">
            <Warning weight="fill" className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <div className="text-xs text-foreground/70">
              Configure the pins to match the required voltage levels
            </div>
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">PIN CONFIGURATION</div>
          <div className="space-y-2">
            {[3, 5, 7, 11].map((pin) => (
              <motion.div
                key={pin}
                whileTap={{ scale: 0.95 }}
                onClick={() => step === 'config' && togglePin(pin)}
                className={cn(
                  'p-3 rounded border-2 cursor-pointer transition-all',
                  getPinColor(pinStates[pin]),
                  step === 'config' ? 'hover:scale-[1.02]' : 'pointer-events-none'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightning weight="fill" className="w-4 h-4" />
                    <span className="text-sm font-semibold">GPIO Pin {pin}</span>
                  </div>
                  <div className="text-xs font-bold uppercase">
                    {pinStates[pin] === 'high' && 'HIGH (3.3V)'}
                    {pinStates[pin] === 'low' && 'LOW (0V)'}
                    {pinStates[pin] === 'off' && 'OFF'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">REQUIRED SEQUENCE</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-background/50">Pin 3: <span className="text-green-400">HIGH</span></div>
            <div className="p-2 rounded bg-background/50">Pin 5: <span className="text-green-400">HIGH</span></div>
            <div className="p-2 rounded bg-background/50">Pin 7: <span className="text-blue-400">LOW</span></div>
            <div className="p-2 rounded bg-background/50">Pin 11: <span className="text-green-400">HIGH</span></div>
          </div>
        </div>

        {step === 'config' && (
          <button
            onClick={checkSequence}
            className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
          >
            <Cpu weight="fill" />
            TEST CONFIGURATION
          </button>
        )}

        {step === 'testing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded border-2 border-primary bg-primary/10"
          >
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Cpu weight="fill" className="w-5 h-5 text-primary" />
              </motion.div>
              Verifying Pin States...
            </div>
            <div className="space-y-1 text-xs text-foreground/60">
              <div>✓ Reading GPIO configuration</div>
              <div>✓ Checking voltage levels</div>
              <div>✓ Triggering lock mechanism</div>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">LOCK BYPASSED!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +250 pts</div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Tap pins to cycle: OFF → LOW → HIGH
        </div>
      </div>
    </div>
  )
}
