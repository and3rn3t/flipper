import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, LightbulbFilament } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface InfraredChallengeScreenProps {
  onComplete: () => void
  onBack: () => void
}

const irCodes = [
  { name: 'Samsung', code: '0xE0E040BF' },
  { name: 'LG', code: '0x20DF10EF' },
  { name: 'Sony', code: '0xA90' },
  { name: 'Philips', code: '0x100C' }
]

export function InfraredChallengeScreen({ onComplete, onBack }: InfraredChallengeScreenProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<'success' | 'fail' | null>(null)

  const correctCode = irCodes[1]

  const handleTest = (code: typeof irCodes[0]) => {
    setSelectedCode(code.code)
    setTesting(true)
    setResult(null)

    setTimeout(() => {
      const isCorrect = code.code === correctCode.code
      setResult(isCorrect ? 'success' : 'fail')
      setTesting(false)
      
      if (isCorrect) {
        setTimeout(onComplete, 1500)
      }
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">INFRARED CHALLENGE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border-2 border-primary/50 bg-primary/10">
          <div className="text-xs text-foreground/60 mb-2">MISSION:</div>
          <div className="text-sm text-foreground">
            Find the correct IR code to turn on the TV
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-foreground/50 mb-2">SELECT TV BRAND:</div>
          {irCodes.map((code) => {
            const isSelected = selectedCode === code.code
            const isCorrect = result === 'success' && isSelected
            const isFailed = result === 'fail' && isSelected
            
            return (
              <motion.div
                key={code.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'p-3 rounded border-2 transition-all cursor-pointer',
                  isCorrect && 'border-green-400 bg-green-400/20',
                  isFailed && 'border-red-400 bg-red-400/20',
                  !isSelected && !testing && 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10',
                  isSelected && testing && 'border-primary bg-primary/10',
                  result && !isSelected && 'opacity-50'
                )}
                onClick={() => !testing && !result && handleTest(code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LightbulbFilament 
                      weight="duotone" 
                      className={cn(
                        'w-6 h-6',
                        isCorrect && 'text-green-400',
                        isFailed && 'text-red-400',
                        !result && 'text-primary'
                      )}
                    />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{code.name}</div>
                      <div className="text-xs text-foreground/50 font-mono">{code.code}</div>
                    </div>
                  </div>
                  {isCorrect && <CheckCircle weight="fill" className="w-5 h-5 text-green-400" />}
                  {isFailed && <XCircle weight="fill" className="w-5 h-5 text-red-400" />}
                </div>

                {isSelected && testing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 pt-3 border-t border-foreground/20"
                  >
                    <div className="text-xs text-foreground/60 mb-2">Transmitting IR signal...</div>
                    <div className="flex gap-1 justify-center">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {result === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded border-2 border-green-400 bg-green-400/20 text-center"
          >
            <CheckCircle weight="fill" className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-400 mb-1">TV POWERED ON!</div>
            <div className="text-xs text-foreground/60">Challenge Complete +100 pts</div>
          </motion.div>
        )}

        {result === 'fail' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded border border-red-400/50 bg-red-400/10"
          >
            <div className="text-sm text-red-400 text-center">
              Wrong code. Try another brand.
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Test IR codes to control devices
        </div>
      </div>
    </div>
  )
}

function XCircle(props: { weight: string; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={props.className}
    >
      <circle cx="128" cy="128" r="96" fill="currentColor" opacity="0.2" />
      <line
        x1="160"
        y1="96"
        x2="96"
        y2="160"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="160"
        y1="160"
        x2="96"
        y2="96"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}
