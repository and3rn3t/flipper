import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FrequencySpectrum } from '@/components/diagrams/FrequencySpectrum'
import { SignalWaveform } from '@/components/diagrams/SignalWaveform'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'
import { Broadcast, Play, FloppyDisk, ArrowsClockwise, Trash } from '@phosphor-icons/react'
import { useLocalKV } from '@/hooks/use-local-kv'

interface SubGHzScreenProps {
  onBack: () => void
}

type View = 'scan' | 'saved' | 'transmit'

interface Signal {
  freq: string
  protocol: string
  strength: number
  raw: string
}

const protocols: Record<string, { title: string; fields: { label: string; bits: number; value: string }[]; totalBits: number }> = {
  Princeton: {
    title: 'Princeton 24-bit',
    fields: [
      { label: 'Sync', bits: 1, value: '0x1' },
      { label: 'Address', bits: 20, value: '0x3A92C' },
      { label: 'Data', bits: 3, value: '0x5' },
    ],
    totalBits: 24,
  },
  KeeLoq: {
    title: 'KeeLoq 66-bit',
    fields: [
      { label: 'Encrypted', bits: 32, value: '0xF29A3C81' },
      { label: 'Serial', bits: 28, value: '0x1A4B3C2' },
      { label: 'Button', bits: 4, value: '0x1' },
      { label: 'Flags', bits: 2, value: '0x2' },
    ],
    totalBits: 66,
  },
  'Star Line': {
    title: 'Star Line Rolling',
    fields: [
      { label: 'Preamble', bits: 8, value: '0xFF' },
      { label: 'Key', bits: 24, value: '0xA7C3F1' },
      { label: 'Counter', bits: 16, value: '0x04E2' },
      { label: 'CRC', bits: 8, value: '0x9B' },
    ],
    totalBits: 56,
  },
  RAW: {
    title: 'RAW Signal',
    fields: [
      { label: 'Carrier', bits: 16, value: '433.92MHz' },
      { label: 'Data', bits: 48, value: 'Unrecognized' },
    ],
    totalBits: 64,
  },
}

export function SubGHzScreen({ onBack }: SubGHzScreenProps) {
  const [view, setView] = useState<View>('scan')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectedSignals, setDetectedSignals] = useState<Signal[]>([])
  const [savedSignals, setSavedSignals] = useLocalKV<Signal[]>('subghz-saved', [])
  const [transmitting, setTransmitting] = useState<number | null>(null)
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null)

  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setScanning(false)
          return 100
        }
        return prev + 1.5
      })
      if (Math.random() > 0.88 && detectedSignals.length < 5) {
        const freqs = ['433.92', '315.00', '868.35', '915.00', '390.00', '433.42']
        const protoNames = ['Princeton', 'KeeLoq', 'Star Line', 'RAW']
        const newSignal: Signal = {
          freq: freqs[Math.floor(Math.random() * freqs.length)],
          protocol: protoNames[Math.floor(Math.random() * protoNames.length)],
          strength: -Math.floor(Math.random() * 50 + 20),
          raw: Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' '),
        }
        setDetectedSignals((prev) => [...prev, newSignal])
      }
    }, 80)
    return () => clearInterval(interval)
  }, [scanning, detectedSignals.length])

  const startScan = useCallback(() => {
    setScanning(true)
    setProgress(0)
    setDetectedSignals([])
    setExpandedSignal(null)
  }, [])

  const saveSignal = useCallback((signal: Signal) => {
    if (!savedSignals.find((s) => s.raw === signal.raw)) {
      setSavedSignals((prev) => [...prev, signal])
    }
  }, [savedSignals])

  const transmitSignal = useCallback((index: number) => {
    setTransmitting(index)
    setTimeout(() => setTransmitting(null), 2000)
  }, [])

  const tabs: { id: View; label: string }[] = [
    { id: 'scan', label: 'SCAN' },
    { id: 'saved', label: `SAVED (${savedSignals.length})` },
    { id: 'transmit', label: 'TX' },
  ]

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SUB-GHZ ANALYZER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">[BACK]</button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 text-[10px] py-1.5 rounded border transition-colors ${
              view === tab.id
                ? 'border-primary bg-primary/15 text-primary font-semibold'
                : 'border-foreground/20 text-foreground/50 hover:text-foreground/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ─── SCAN VIEW ─── */}
          {view === 'scan' && (
            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="p-3 rounded border border-foreground/20 bg-background/50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-foreground/50 mb-1">FREQUENCY RANGE</div>
                  <div className="text-sm text-primary">300–928 MHz</div>
                </div>
                <Broadcast weight="duotone" className="w-6 h-6 text-primary/40" />
              </div>

              {!scanning && progress === 0 && (
                <button onClick={startScan} className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors text-sm">
                  START SCAN
                </button>
              )}

              {!scanning && progress >= 100 && (
                <button onClick={startScan} className="w-full p-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                  <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
                  RESCAN
                </button>
              )}

              {(scanning || progress > 0) && (
                <div className="p-3 rounded border border-primary/50 bg-primary/5">
                  <div className="text-xs text-foreground/50 mb-2">{scanning ? 'SCANNING...' : 'SCAN COMPLETE'}</div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-primary mt-1">{Math.min(progress, 100).toFixed(0)}%</div>
                </div>
              )}

              {scanning && detectedSignals.length > 0 && (
                <FrequencySpectrum activeFrequencies={detectedSignals.map((s) => parseFloat(s.freq))} className="my-2" />
              )}

              {detectedSignals.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-foreground/60">DETECTED ({detectedSignals.length}):</div>
                  {detectedSignals.map((signal, idx) => {
                    const proto = protocols[signal.protocol]
                    const isExpanded = expandedSignal === idx
                    return (
                      <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
                        <div
                          className={`p-3 rounded border cursor-pointer transition-all ${isExpanded ? 'border-primary/60 bg-primary/10' : 'border-primary/30 bg-primary/5 hover:border-primary/40'}`}
                          onClick={() => setExpandedSignal(isExpanded ? null : idx)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-primary font-semibold">{signal.freq} MHz</span>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">{signal.protocol}</Badge>
                              <span className="text-[10px] text-foreground/40">{signal.strength} dBm</span>
                            </div>
                          </div>
                          <div className="h-10">
                            <SignalWaveform type="amplitude" className="w-full h-full" />
                          </div>
                        </div>

                        {isExpanded && proto && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                            <ProtocolDiagram title={proto.title} fields={proto.fields} totalBits={proto.totalBits} />
                            <div className="p-2 rounded border border-foreground/15 bg-background/30">
                              <div className="text-[10px] text-foreground/40 mb-1">RAW DATA</div>
                              <div className="text-[10px] text-foreground/60 font-mono break-all">{signal.raw}</div>
                            </div>
                            {!savedSignals.find((s) => s.raw === signal.raw) && (
                              <button onClick={() => saveSignal(signal)} className="w-full p-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                                <FloppyDisk weight="bold" className="w-3.5 h-3.5" />
                                SAVE SIGNAL
                              </button>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── SAVED VIEW ─── */}
          {view === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {savedSignals.length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <FloppyDisk weight="duotone" className="w-10 h-10 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No saved signals</div>
                  <div className="text-xs text-foreground/30 mt-1">Scan and save signals to build your library</div>
                </div>
              ) : (
                savedSignals.map((signal, idx) => (
                  <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-primary font-semibold">{signal.freq} MHz</span>
                        <Badge variant="outline" className="ml-2 text-[10px] border-primary/50 text-primary">{signal.protocol}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setView('transmit'); transmitSignal(idx) }} className="p-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors" title="Transmit">
                          <Play weight="fill" className="w-3 h-3" />
                        </button>
                        <button onClick={() => setSavedSignals((prev) => prev.filter((_, i) => i !== idx))} className="p-1.5 rounded border border-foreground/30 text-foreground/50 hover:text-destructive hover:border-destructive/40 transition-colors" title="Delete">
                          <Trash weight="bold" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-foreground/40 font-mono break-all">{signal.raw}</div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ─── TRANSMIT VIEW ─── */}
          {view === 'transmit' && (
            <motion.div key="transmit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {savedSignals.length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <Broadcast weight="duotone" className="w-10 h-10 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No signals to transmit</div>
                  <div className="text-xs text-foreground/30 mt-1">Save signals from the scan view first</div>
                </div>
              ) : (
                savedSignals.map((signal, idx) => (
                  <div key={idx} className={`p-3 rounded border transition-all ${transmitting === idx ? 'border-primary bg-primary/15' : 'border-foreground/20 bg-background/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-primary font-semibold">{signal.freq} MHz</span>
                        <span className="text-xs text-foreground/40 ml-2">{signal.protocol}</span>
                      </div>
                      <button
                        onClick={() => transmitSignal(idx)}
                        disabled={transmitting !== null}
                        className="px-3 py-1.5 rounded border border-primary text-primary text-xs font-semibold hover:bg-primary/10 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                      >
                        <Play weight="fill" className="w-3 h-3" />
                        {transmitting === idx ? 'TX...' : 'TRANSMIT'}
                      </button>
                    </div>
                    {transmitting === idx && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                            <Broadcast weight="fill" className="w-4 h-4" />
                          </motion.div>
                          Transmitting on {signal.freq} MHz...
                        </div>
                        <div className="h-10 mt-2">
                          <SignalWaveform type="amplitude" className="w-full h-full" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              )}

              <div className="p-3 rounded border border-foreground/15 bg-background/30">
                <div className="text-[10px] text-foreground/40 uppercase tracking-wider mb-1">Disclaimer</div>
                <div className="text-[10px] text-foreground/30">
                  Transmitting RF signals may be regulated. Only use on systems you own or have permission to test.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Captures & replays 300–928 MHz signals</div>
      </div>
    </div>
  )
}