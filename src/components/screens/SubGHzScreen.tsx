import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FrequencySpectrum } from '@/components/diagrams/FrequencySpectrum'
import { SignalWaveform } from '@/components/diagrams/SignalWaveform'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'

interface SubGHzScreenProps {
  onBack: () => void
}

export function SubGHzScreen({ onBack }: SubGHzScreenProps) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectedSignals, setDetectedSignals] = useState<Array<{ freq: string, protocol: string }>>([])

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false)
            return 100
          }
          return prev + 2
        })
        
        if (Math.random() > 0.85 && detectedSignals.length < 3) {
          const freqs = ['433.92', '315.00', '868.35', '915.00']
          const protocols = ['Princeton', 'KeeLoq', 'Star Line', 'RAW']
          const newSignal = {
            freq: freqs[Math.floor(Math.random() * freqs.length)],
            protocol: protocols[Math.floor(Math.random() * protocols.length)]
          }
          setDetectedSignals((prev) => [...prev, newSignal])
        }
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [scanning, detectedSignals.length])

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    setDetectedSignals([])
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SUB-GHZ ANALYZER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">FREQUENCY RANGE</div>
          <div className="text-sm text-primary">300-928 MHz</div>
        </div>

        {!scanning && progress === 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={startScan}
            className="w-full p-4 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            START SCAN
          </motion.button>
        )}

        {(scanning || progress > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3 rounded border border-primary/50 bg-primary/5">
              <div className="text-xs text-foreground/50 mb-2">
                {scanning ? 'SCANNING...' : 'SCAN COMPLETE'}
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-primary mt-1">{progress}%</div>
            </div>

            {scanning && (
              <FrequencySpectrum 
                activeFrequencies={detectedSignals.map(s => parseFloat(s.freq))} 
                className="my-2"
              />
            )}

            {detectedSignals.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-foreground/60">DETECTED SIGNALS:</div>
                {detectedSignals.map((signal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                  >
                    <div className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-primary font-semibold">{signal.freq} MHz</span>
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                          {signal.protocol}
                        </Badge>
                      </div>
                      <div className="h-12">
                        <SignalWaveform type="amplitude" className="w-full h-full" />
                      </div>
                    </div>
                    {idx === 0 && signal.protocol === 'Princeton' && (
                      <ProtocolDiagram
                        title="Princeton 24-bit Protocol"
                        fields={[
                          { label: 'Sync', bits: 4, value: '0xF' },
                          { label: 'Address', bits: 20, value: '0x3A92C' },
                        ]}
                        totalBits={24}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Captures 300-928 MHz wireless signals
        </div>
      </div>
    </div>
  )
}