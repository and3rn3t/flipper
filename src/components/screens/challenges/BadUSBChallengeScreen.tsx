import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Keyboard, Play } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface BadUSBChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

const payloadSteps = [
  'DELAY 1000',
  'GUI r',
  'DELAY 500',
  'STRING cmd',
  'ENTER',
  'DELAY 750',
  'STRING echo Success > C:\\result.txt',
  'ENTER'
]

export function BadUSBChallengeScreen({ onComplete, onBack }: BadUSBChallengeScreenProps) {
  const [executing, setExecuting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [complete, setComplete] = useState(false)

  const handleExecute = () => {
    setExecuting(true)
    setCurrentStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      setCurrentStep(step)
      
      if (step >= payloadSteps.length) {
        clearInterval(interval)
        setExecuting(false)
        setComplete(true)
        setTimeout(onComplete, 1500)
      }
    }, 600)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">BAD USB CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Execute a keystroke payload to create a success file
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Keyboard weight="duotone" className="w-5 h-5 text-primary" />
            <span className="text-xs text-foreground/60">PAYLOAD SCRIPT</span>
          </div>
          <div className="bg-background rounded p-2 space-y-1">
            {payloadSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.4 }}
                animate={{
                  opacity: currentStep > index ? 1 : 0.4,
                  color: currentStep > index ? 'oklch(0.65 0.19 145)' : 'oklch(0.50 0.15 145)'
                }}
                className="text-xs font-mono flex items-center gap-2"
              >
                {currentStep > index && (
                  <CheckCircle weight="fill" className="w-3 h-3 text-green-400" />
                )}
                {currentStep === index && (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
                {currentStep < index && <div className="w-3 h-3" />}
                <span>{step}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {!executing && !complete && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleExecute}
            className="w-full p-4 rounded border-2 border-primary bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
          >
            <Play weight="fill" />
            EXECUTE PAYLOAD
          </motion.button>
        )}

        {executing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded border-2 border-primary bg-primary/10"
          >
            <div className="text-sm text-primary mb-2">Executing...</div>
            <div className="text-xs text-foreground/60">
              Step {currentStep}/{payloadSteps.length}
            </div>
          </motion.div>
        )}

        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">PAYLOAD EXECUTED!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +300 pts</div>
            <div className="mt-3 p-2 rounded bg-background/50 text-xs font-mono text-primary">
              C:\result.txt created successfully
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Automate keystroke injection attacks
        </div>
      </div>
    </div>
  )
}
