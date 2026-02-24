import { motion } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface BadUSBScreenProps {
  onBack: () => void
}

const payloads = [
  { id: 'wifi', name: 'WiFi Info Grabber', description: 'Retrieves saved WiFi credentials' },
  { id: 'reverse', name: 'Reverse Shell', description: 'Opens remote connection' },
  { id: 'rickroll', name: 'Harmless Prank', description: 'Opens YouTube video' },
]

export function BadUSBScreen({ onBack }: BadUSBScreenProps) {
  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">BAD USB</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded border-2 border-destructive bg-destructive/10 flex gap-2"
        >
          <Warning weight="fill" className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-xs text-destructive-foreground">
            <span className="font-semibold">EDUCATIONAL ONLY</span>
            <br />
            Unauthorized use of BadUSB payloads is illegal. This simulator demonstrates capabilities for learning purposes only.
          </div>
        </motion.div>

        <div className="text-xs text-foreground/50 mb-2">EXAMPLE PAYLOADS:</div>

        <div className="space-y-2">
          {payloads.map((payload) => (
            <motion.div
              key={payload.id}
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-primary font-semibold">{payload.name}</div>
                <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                  DEMO
                </Badge>
              </div>
              <div className="text-xs text-foreground/60">{payload.description}</div>
            </motion.div>
          ))}
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">HOW IT WORKS:</div>
          <div className="text-xs text-foreground space-y-1">
            <div>• Emulates USB keyboard</div>
            <div>• Types pre-programmed commands</div>
            <div>• Executes in milliseconds</div>
            <div>• No software installation needed</div>
          </div>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">LEGITIMATE USES:</div>
          <div className="text-xs text-foreground space-y-1">
            <div>• IT automation tasks</div>
            <div>• Penetration testing (authorized)</div>
            <div>• System configuration</div>
            <div>• Security research</div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          USB HID emulation for automation
        </div>
      </div>
    </div>
  )
}