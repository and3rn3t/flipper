import { motion } from 'framer-motion';
import {
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretDown,
  Circle,
  ArrowBendUpLeft,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface FlipperDeviceProps {
  screenContent: React.ReactNode;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => void;
}

export function FlipperDevice({ screenContent, onNavigate }: FlipperDeviceProps) {
  const handleButtonClick = (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => {
    onNavigate(direction);
  };

  return (
    <div className="relative flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-md">
        <div className="relative bg-primary rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-foreground/20 rounded-full" />

          <div className="bg-background rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 h-[280px] sm:h-[320px] border-4 border-primary-foreground/10 shadow-inner overflow-hidden">
            <div className="h-full overflow-y-auto">{screenContent}</div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonClick('back')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Back"
            >
              <ArrowBendUpLeft weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </motion.button>

            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick('up')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                aria-label="Up"
              >
                <CaretUp weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </motion.button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('left')}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                  aria-label="Left"
                >
                  <CaretLeft weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('ok')}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary border-2 border-primary flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                  aria-label="OK"
                >
                  <Circle weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleButtonClick('right')}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                  aria-label="Right"
                >
                  <CaretRight weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick('down')}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
                aria-label="Down"
              >
                <CaretDown weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleButtonClick('back')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border-2 border-primary-foreground/20 flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Back"
            >
              <ArrowBendUpLeft weight="bold" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="font-mono text-xl sm:text-2xl font-bold text-primary mb-1">
            Flipper Zero
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
            Experimentation Lab
          </div>
        </div>
      </div>
    </div>
  );
}
