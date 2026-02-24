import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WaterfallDisplay } from '@/components/diagrams/WaterfallDisplay'
import { Play, Pause, ArrowsClockwise } from '@phosphor-icons/react'

interface SpectrumAnalyzerScreenProps {
  onBack: () => void
}

interface DetectedSignal {
  frequency: number
  strength: number
  type: string
  timestamp: number
}

const frequencyBands = [
  { value: '315', label: '315 MHz', min: 300, max: 330 },
  { value: '433', label: '433 MHz', min: 418, max: 448 },
  { value: '868', label: '868 MHz', min: 853, max: 883 },
  { value: '915', label: '915 MHz', min: 900, max: 930 },
  { value: 'full', label: 'Full Range', min: 300, max: 928 },
]

const signalTypes = ['Remote', 'Sensor', 'Garage', 'Keyfob', 'Weather', 'Unknown']

export function SpectrumAnalyzerScreen({ onBack }: SpectrumAnalyzerScreenProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [selectedBand, setSelectedBand] = useState('433')
  const [detectedSignals, setDetectedSignals] = useState<DetectedSignal[]>([])
  const [peakFrequency, setPeakFrequency] = useState<number | null>(null)

  const currentBand = frequencyBands.find(b => b.value === selectedBand) || frequencyBands[1]

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const freqRange = currentBand.max - currentBand.min
        const newSignal: DetectedSignal = {
          frequency: currentBand.min + Math.random() * freqRange,
          strength: 40 + Math.random() * 60,
          type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
          timestamp: Date.now(),
        }
        
        setDetectedSignals(prev => {
          const updated = [...prev, newSignal]
          return updated.slice(-10)
        })

        setPeakFrequency(newSignal.frequency)
        setTimeout(() => setPeakFrequency(null), 1500)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning, currentBand])

  const handleToggleRunning = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setDetectedSignals([])
    setPeakFrequency(null)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SPECTRUM ANALYZER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="flex gap-2">
          <Button
            onClick={handleToggleRunning}
            className="flex-1 gap-2"
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause weight="fill" className="w-4 h-4" />
                PAUSE
              </>
            ) : (
              <>
                <Play weight="fill" className="w-4 h-4" />
                START
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
          >
            <ArrowsClockwise className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 rounded border border-foreground/20 bg-background/50">
          <div className="text-xs text-foreground/50 mb-2">FREQUENCY BAND</div>
          <Select value={selectedBand} onValueChange={setSelectedBand} disabled={isRunning}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencyBands.map(band => (
                <SelectItem key={band.value} value={band.value}>
                  {band.label} ({band.min}-{band.max} MHz)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 rounded border border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-foreground/50">
              {isRunning ? 'LIVE WATERFALL' : 'PAUSED'}
            </div>
            {detectedSignals.length > 0 && (
              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">
                {detectedSignals.length} signals
              </Badge>
            )}
          </div>
          <WaterfallDisplay
            minFreq={currentBand.min}
            maxFreq={currentBand.max}
            isRunning={isRunning}
            peakFrequency={peakFrequency}
            className="rounded overflow-hidden"
          />
        </div>

        {peakFrequency && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded border border-primary bg-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-foreground/60">SIGNAL DETECTED</div>
                <div className="text-lg font-bold text-primary">
                  {peakFrequency.toFixed(2)} MHz
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                ACTIVE
              </Badge>
            </div>
          </motion.div>
        )}

        {detectedSignals.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-foreground/60">RECENT DETECTIONS:</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {detectedSignals.slice().reverse().map((signal, idx) => (
                <motion.div
                  key={signal.timestamp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 rounded border border-foreground/20 bg-background/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-primary">
                        {signal.frequency.toFixed(2)} MHz
                      </div>
                      <div className="text-xs text-foreground/50">
                        {signal.type} • {signal.strength.toFixed(0)} dBm
                      </div>
                    </div>
                    <div className="w-16 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${(signal.strength / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Real-time frequency analysis with waterfall
        </div>
      </div>
    </div>
  )
}
