import { motion } from 'framer-motion'

interface GPIOScreenProps {
  onBack: () => void
}

export function GPIOScreen({ onBack }: GPIOScreenProps) {
  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">GPIO INTERFACE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">PIN LAYOUT</div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="text-xs text-foreground/50">PIN {i + 1}</div>
                <div className="text-xs text-primary font-semibold">
                  {i % 3 === 0 ? '3.3V' : i % 3 === 1 ? 'GPIO' : 'GND'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">CAPABILITIES</div>
          <div className="text-xs text-foreground space-y-1">
            <div>• Digital I/O operations</div>
            <div>• PWM signal generation</div>
            <div>• UART communication</div>
            <div>• I²C and SPI protocols</div>
            <div>• 1-Wire interface</div>
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">EXAMPLE PROJECTS</div>
          <div className="text-xs text-foreground space-y-1">
            <div>• LED blinker circuits</div>
            <div>• Temperature sensors</div>
            <div>• Motor controllers</div>
            <div>• LCD displays</div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Hardware interface for electronics projects
        </div>
      </div>
    </div>
  )
}