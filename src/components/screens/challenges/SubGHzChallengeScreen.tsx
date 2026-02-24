import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Broadcast, Play } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SubGHzChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

export function SubGHzChallengeScreen({ onComplete, onBack }: SubGHzChallengeScreenProps) {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'replay' | 'complete'>('capture')
  const [capturing, setCapturing] = useState(false)
  const [capturedSignal, setCapturedSignal] = useState(false)
  const [signalStrength, setSignalStrength] = useState(0)

  const correctFrequency = 433.92

  const handleCapture = () => {
    setCapturing(true)
    let strength = 0
    const interval = setInterval(() => {
      strength += Math.random() * 20
      setSignalStrength(Math.min(strength, 100))
      
      if (strength >= 100) {
        clearInterval(interval)
        setCapturedSignal(true)
        setCapturing(false)
        setTimeout(() => setStep('analyzing'), 500)
        setTimeout(() => setStep('replay'), 1500)
      }
    }, 150)
  }

  const handleReplay = () => {
    setStep('replay')
    setTimeout(() => {
      setStep('complete')
      setTimeout(onComplete, 1500)
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SUB-GHZ CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Capture and replay the garage door opener signal
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">TARGET FREQUENCY</div>
          <div className="text-lg text-primary font-bold">{correctFrequency} MHz</div>
        </div>

        <div className={cn(
          'p-3 rounded border-2 transition-all',
          step === 'capture' ? 'border-primary bg-primary/10' : 
          capturedSignal ? 'border-green-400/50 bg-green-400/10' : 'border-foreground/20'
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Broadcast weight="duotone" className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">Capture Signal</span>
            </div>
            {capturedSignal && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
          </div>
          
          {!capturing && !capturedSignal && (
            <button
              onClick={handleCapture}
              className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            >
              <Play weight="fill" />
              START CAPTURE
            </button>
          )}

          {capturing && (
            <div className="space-y-2">
              <div className="text-xs text-foreground/60 mb-2">Listening for signal...</div>
              <div className="h-16 flex items-end gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-primary rounded-t"
                    animate={{
                      height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
                    }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
              <div className="text-xs text-primary">Signal Strength: {Math.round(signalStrength)}%</div>
            </div>
          )}

          {capturedSignal && step !== 'capture' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="text-xs text-foreground/60">Captured Signal Data:</div>
              <div className="font-mono text-xs text-primary bg-background/50 p-2 rounded">
                RAW: 0x{Math.random().toString(16).substring(2, 10).toUpperCase()}
              </div>
            </motion.div>
          )}
        </div>

        {step === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded border-2 border-primary bg-primary/10"
          >
            <div className="text-sm font-semibold mb-2">Analyzing Protocol...</div>
            <div className="space-y-1 text-xs text-foreground/60">
              <div>✓ Frequency: {correctFrequency} MHz</div>
              <div>✓ Modulation: AM650</div>
              <div>✓ Protocol: Princeton</div>
            </div>
          </motion.div>
        )}

        {step === 'replay' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded border-2 border-primary bg-primary/10"
          >
            <div className="text-sm font-semibold mb-2">Ready to Replay</div>
            <button
              onClick={handleReplay}
              className="w-full p-3 rounded border-2 border-primary bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
            >
              <Broadcast weight="fill" />
              TRANSMIT SIGNAL
            </button>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">DOOR OPENED!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +200 pts</div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Capture and replay wireless signals
        </div>
      </div>
    </div>
  )
}
