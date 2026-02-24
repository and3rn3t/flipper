import { useState } from 'react'
import { motion } from 'framer-motion'
import { Television, Snowflake, Fan, Play } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface InfraredScreenProps {
  onBack: () => void
}

const devices = [
  { id: 'tv', name: 'TV', icon: Television },
  { id: 'ac', name: 'Air Conditioner', icon: Snowflake },
  { id: 'fan', name: 'Fan', icon: Fan },
]

export function InfraredScreen({ onBack }: InfraredScreenProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [captured, setCaptured] = useState(false)

  const captureSignal = () => {
    setCaptured(true)
    setTimeout(() => {
      setCaptured(false)
    }, 3000)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">INFRARED REMOTE</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {!selectedDevice && (
          <>
            <div className="text-xs text-foreground/50 mb-2">SELECT DEVICE TYPE:</div>
            <div className="grid grid-cols-2 gap-2">
              {devices.map((device) => {
                const Icon = device.icon
                return (
                  <motion.button
                    key={device.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDevice(device.id)}
                    className="p-4 rounded border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors flex flex-col items-center gap-2"
                  >
                    <Icon weight="duotone" className="w-8 h-8 text-primary" />
                    <span className="text-xs text-foreground">{device.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </>
        )}

        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="p-3 rounded border border-primary bg-primary/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-foreground/50">SELECTED</div>
                <div className="text-sm text-primary font-semibold">
                  {devices.find(d => d.id === selectedDevice)?.name}
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-xs text-primary/70 hover:text-primary"
              >
                [CHANGE]
              </button>
            </div>

            {!captured && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={captureSignal}
                className="w-full p-4 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <Play weight="fill" className="w-5 h-5" />
                CAPTURE IR SIGNAL
              </motion.button>
            )}

            {captured && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 rounded border border-primary bg-primary/10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-primary mb-2"
                  >
                    <Play weight="fill" className="w-12 h-12 mx-auto" />
                  </motion.div>
                  <div className="text-sm text-primary mb-1">Signal Captured!</div>
                  <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                    RAW FORMAT
                  </Badge>
                </div>

                <div className="p-3 rounded border border-foreground/20 bg-background/50">
                  <div className="text-xs text-foreground/50 mb-1">PROTOCOL</div>
                  <div className="text-sm text-foreground">NEC</div>
                </div>

                <div className="p-3 rounded border border-foreground/20 bg-background/50">
                  <div className="text-xs text-foreground/50 mb-1">ADDRESS</div>
                  <div className="text-sm text-foreground font-mono">0x04</div>
                </div>

                <div className="p-3 rounded border border-foreground/20 bg-background/50">
                  <div className="text-xs text-foreground/50 mb-1">COMMAND</div>
                  <div className="text-sm text-foreground font-mono">0x08</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Universal remote for IR devices
        </div>
      </div>
    </div>
  )
}