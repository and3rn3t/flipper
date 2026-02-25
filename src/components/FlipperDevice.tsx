import { motion } from 'framer-motion';
import {
  CaretLeft,
  CaretRight,
  CaretUp,
  CaretDown,
  ArrowBendUpLeft,
} from '@phosphor-icons/react';

interface FlipperDeviceProps {
  screenContent: React.ReactNode;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => void;
}

export function FlipperDevice({ screenContent, onNavigate }: FlipperDeviceProps) {
  return (
    <div className="relative flex items-center justify-center px-2 py-4 sm:p-8">
      <div className="relative w-full max-w-md">
        {/* GPIO pins row along the top */}
        <div className="flex justify-center gap-[3px] px-12">
          {Array.from({ length: 26 }).map((_, i) => (
            <div
              key={i}
              className="w-[3px] h-2.5 rounded-t-[1px]"
              style={{ background: 'linear-gradient(to bottom, #c9a84c, #e8c858)' }}
            />
          ))}
        </div>

        {/* Device body */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #f0ece5 0%, #e8e4dc 40%, #dfdbd3 100%)',
            borderRadius: '18px',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.6),
              0 2px 0 #ccc8be,
              0 4px 0 #bfbab0,
              0 6px 8px rgba(0,0,0,0.25),
              0 16px 40px rgba(0,0,0,0.35)
            `,
          }}
        >
          {/* Top edge — IR window + status LEDs */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <div
              className="w-7 h-2.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #1a0f2e, #2d1b4e)' }}
              title="IR Blaster"
            />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/50 shadow-[0_0_4px_rgba(74,222,128,0.4)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400/30" />
            </div>
          </div>

          {/* Parting line */}
          <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-[#ccc7be] to-transparent" />

          {/* Screen area */}
          <div className="px-4 pt-3 pb-3">
            <div
              className="rounded-xl h-[260px] sm:h-[300px] overflow-hidden"
              style={{
                background: 'var(--background)',
                border: '3px solid #2a2a3e',
                boxShadow: `
                  inset 0 2px 10px rgba(0,0,0,0.7),
                  0 1px 0 rgba(255,255,255,0.15)
                `,
              }}
            >
              <div className="h-full overflow-y-auto p-3">{screenContent}</div>
            </div>
          </div>

          {/* Controls section */}
          <div className="flex items-center justify-between px-5 pb-4 pt-1 gap-3">
            {/* Back button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('back')}
              className="flex items-center justify-center transition-colors"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #e2ded5 0%, #d4cfC6 100%)',
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.5),
                  0 2px 4px rgba(0,0,0,0.2),
                  0 1px 0 #c5c0b6
                `,
              }}
              aria-label="Back"
            >
              <ArrowBendUpLeft weight="bold" className="w-[18px] h-[18px] text-[#6b665d]" />
            </motion.button>

            {/* D-pad */}
            <div className="relative" style={{ width: 160, height: 160 }}>
              {/* D-pad base ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #d8d3ca 0%, #c8c3b9 100%)',
                  boxShadow: `
                    inset 0 2px 6px rgba(0,0,0,0.12),
                    0 1px 0 rgba(255,255,255,0.4)
                  `,
                }}
              />

              {/* Up */}
              <div className="absolute" style={{ top: 6, left: '50%', transform: 'translateX(-50%)' }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNavigate('up')}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '14px 14px 6px 6px',
                    background: 'linear-gradient(180deg, #e6e2d9 0%, #d6d1c7 100%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                  }}
                  aria-label="Up"
                >
                  <CaretUp weight="bold" className="w-[18px] h-[18px] text-[#7a756b]" />
                </motion.button>
              </div>

              {/* Down */}
              <div className="absolute" style={{ bottom: 6, left: '50%', transform: 'translateX(-50%)' }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNavigate('down')}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '6px 6px 14px 14px',
                    background: 'linear-gradient(180deg, #dedad0 0%, #cecac0 100%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                  aria-label="Down"
                >
                  <CaretDown weight="bold" className="w-[18px] h-[18px] text-[#7a756b]" />
                </motion.button>
              </div>

              {/* Left */}
              <div className="absolute" style={{ left: 6, top: '50%', transform: 'translateY(-50%)' }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNavigate('left')}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '14px 6px 6px 14px',
                    background: 'linear-gradient(90deg, #e4e0d7 0%, #d6d1c7 100%)',
                    boxShadow: '2px 0 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                  }}
                  aria-label="Left"
                >
                  <CaretLeft weight="bold" className="w-[18px] h-[18px] text-[#7a756b]" />
                </motion.button>
              </div>

              {/* Right */}
              <div className="absolute" style={{ right: 6, top: '50%', transform: 'translateY(-50%)' }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onNavigate('right')}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '6px 14px 14px 6px',
                    background: 'linear-gradient(270deg, #e4e0d7 0%, #d6d1c7 100%)',
                    boxShadow: '-2px 0 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                  }}
                  aria-label="Right"
                >
                  <CaretRight weight="bold" className="w-[18px] h-[18px] text-[#7a756b]" />
                </motion.button>
              </div>

              {/* Center OK button */}
              <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onNavigate('ok')}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 44,
                    height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, #e0dcd3 0%, #cdc8be 100%)',
                  boxShadow: `
                    inset 0 -2px 4px rgba(0,0,0,0.08),
                    0 2px 6px rgba(0,0,0,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.5)
                  `,
                }}
                  aria-label="OK"
                >
                  <span className="text-[10px] font-bold text-[#6b665d] tracking-wider select-none">
                    OK
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Spacer to balance the layout */}
            <div className="w-[44px]" />
          </div>

          {/* Bottom branding */}
          <div className="flex items-center justify-between px-5 pb-3">
            <span
              className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase select-none"
              style={{ color: '#9e998f' }}
            >
              Flipper Zero
            </span>
            {/* Speaker grille */}
            <div className="flex gap-[2px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[3px] h-3 rounded-full bg-[#ccc7be]" />
              ))}
            </div>
          </div>
        </div>

        {/* USB-C port on the bottom */}
        <div className="flex justify-center">
          <div
            className="h-[5px] rounded-b-[3px]"
            style={{
              width: 32,
              background: 'linear-gradient(180deg, #888, #666)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
            title="USB-C"
          />
        </div>

        {/* Subtitle */}
        <div className="mt-4 text-center">
          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
            Experimentation Lab
          </div>
        </div>
      </div>
    </div>
  );
}
