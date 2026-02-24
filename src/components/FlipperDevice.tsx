import { motion } from 'framer-motion'
import { CaretLeft, CaretRight, CaretUp, CaretDown, Circle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FlipperDeviceProps {
  screenContent: React.ReactNode
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => void
}

export function FlipperDevice({ screenContent, onNavigate }: FlipperDeviceProps) {
  const handleButtonClick = (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => {
    onNavigate(direction)
  }

  return (
    <div className="relative flex items-center justify-center p-8">
      <div className="relative w-full max-w-md">
        <div className="relative bg-primary rounded-3xl p-6 shadow-2xl">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-foreground/20 rounded-full" />
          
          <div className="bg-background rounded-2xl p-4 mb-6 min-h-[320px] border-4 border-primary-foreground/10 shadow-inner overflow-hidden">
            <div className="h-full flex flex-col">
              {screenContent}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonClick('back')}
              className="w-12 h-12 rounded-full bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
            >
              <CaretLeft weight="bold" className="w-6 h-6 text-foreground" />
            </motion.button>

            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick('up')}
                className="w-12 h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
              >
                <CaretUp weight="bold" className="w-6 h-6 text-foreground" />
              </motion.button>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('left')}
                  className="w-12 h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <CaretLeft weight="bold" className="w-6 h-6 text-foreground" />
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('ok')}
                  className="w-14 h-14 rounded-full bg-primary border-2 border-primary flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                >
                  <Circle weight="fill" className="w-6 h-6 text-primary-foreground" />
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('right')}
                  className="w-12 h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                >
                  <CaretRight weight="bold" className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick('down')}
                className="w-12 h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
              >
                <CaretDown weight="bold" className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonClick('back')}
              className="w-12 h-12 rounded-full bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
            >
              <CaretRight weight="bold" className="w-6 h-6 text-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="font-mono text-2xl font-bold text-primary mb-1">
            Flipper Zero
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            Experimentation Lab
          </div>
        </div>
      </div>
    </div>
  )
}