import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Television, Snowflake, Fan, Play, FloppyDisk, Trash, ArrowsClockwise } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { InfraredTiming } from '@/components/diagrams/InfraredTiming'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'

interface InfraredScreenProps {
  onBack: () => void
}

type View = 'remote' | 'library' | 'capture'

interface IRSignal {
  device: string
  button: string
  protocol: string
  address: string
  command: string
}

interface RemoteButton {
  label: string
  command: string
  wide?: boolean
}

const deviceConfigs: Record<string, {
  name: string
  icon: typeof Television
  protocol: string
  address: string
  buttons: RemoteButton[]
  protocolFields: { label: string; bits: number; value?: string }[]
  totalBits: number
}> = {
  tv: {
    name: 'Samsung TV',
    icon: Television,
    protocol: 'NEC',
    address: '0x07',
    buttons: [
      { label: 'POWER', command: '0x02', wide: true },
      { label: 'VOL +', command: '0x07' },
      { label: 'VOL -', command: '0x0B' },
      { label: 'CH +', command: '0x12' },
      { label: 'CH -', command: '0x10' },
      { label: 'MUTE', command: '0x0F' },
      { label: 'INPUT', command: '0x58' },
      { label: 'MENU', command: '0x1A' },
    ],
    protocolFields: [
      { label: 'Address', bits: 8, value: '0x07' },
      { label: 'Addr Inv', bits: 8, value: '0xF8' },
      { label: 'Command', bits: 8 },
      { label: 'Cmd Inv', bits: 8 },
    ],
    totalBits: 32,
  },
  ac: {
    name: 'Daikin AC',
    icon: Snowflake,
    protocol: 'Samsung32',
    address: '0x01',
    buttons: [
      { label: 'POWER', command: '0xC0', wide: true },
      { label: 'TEMP +', command: '0x44' },
      { label: 'TEMP -', command: '0x45' },
      { label: 'COOL', command: '0x40' },
      { label: 'HEAT', command: '0x41' },
      { label: 'FAN', command: '0x43' },
      { label: 'SWING', command: '0x49' },
      { label: 'TIMER', command: '0x50' },
    ],
    protocolFields: [
      { label: 'Custom', bits: 8, value: '0x01' },
      { label: 'Custom Inv', bits: 8, value: '0xFE' },
      { label: 'Data', bits: 8 },
      { label: 'Data Inv', bits: 8 },
    ],
    totalBits: 32,
  },
  fan: {
    name: 'Ceiling Fan',
    icon: Fan,
    protocol: 'RC5',
    address: '0x17',
    buttons: [
      { label: 'POWER', command: '0x0C', wide: true },
      { label: 'SPEED 1', command: '0x01' },
      { label: 'SPEED 2', command: '0x02' },
      { label: 'SPEED 3', command: '0x03' },
      { label: 'OSCILLATE', command: '0x09' },
      { label: 'LIGHT', command: '0x0D' },
    ],
    protocolFields: [
      { label: 'Start', bits: 2, value: '11' },
      { label: 'Toggle', bits: 1, value: 'T' },
      { label: 'Address', bits: 5, value: '0x17' },
      { label: 'Command', bits: 6 },
    ],
    totalBits: 14,
  },
}

export function InfraredScreen({ onBack }: InfraredScreenProps) {
  const [view, setView] = useState<View>('remote')
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [lastSignal, setLastSignal] = useState<IRSignal | null>(null)
  const [transmitting, setTransmitting] = useState(false)
  const [savedSignals, setSavedSignals] = useState<IRSignal[]>([])
  const [capturedSignal, setCapturedSignal] = useState<IRSignal | null>(null)
  const [capturing, setCapturing] = useState(false)

  const sendButton = useCallback((deviceId: string, btn: RemoteButton) => {
    const cfg = deviceConfigs[deviceId]
    const sig: IRSignal = { device: cfg.name, button: btn.label, protocol: cfg.protocol, address: cfg.address, command: btn.command }
    setLastSignal(sig)
    setTransmitting(true)
    setTimeout(() => setTransmitting(false), 600)
  }, [])

  const saveSignal = useCallback((sig: IRSignal) => {
    if (!savedSignals.find((s) => s.device === sig.device && s.button === sig.button)) {
      setSavedSignals((prev) => [...prev, sig])
    }
  }, [savedSignals])

  const startCapture = useCallback(() => {
    setCapturing(true)
    setCapturedSignal(null)
    setTimeout(() => {
      const devices = Object.values(deviceConfigs)
      const d = devices[Math.floor(Math.random() * devices.length)]
      const b = d.buttons[Math.floor(Math.random() * d.buttons.length)]
      setCapturedSignal({ device: 'Unknown', button: b.label, protocol: d.protocol, address: d.address, command: b.command })
      setCapturing(false)
    }, 2500)
  }, [])

  const tabs: { id: View; label: string }[] = [
    { id: 'remote', label: 'REMOTE' },
    { id: 'library', label: `LIBRARY (${savedSignals.length})` },
    { id: 'capture', label: 'CAPTURE' },
  ]

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">INFRARED</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">[BACK]</button>
      </div>

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
          {/* ─── REMOTE VIEW ─── */}
          {view === 'remote' && (
            <motion.div key="remote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!selectedDevice ? (
                <>
                  <div className="text-xs text-foreground/50 mb-1">SELECT DEVICE:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(deviceConfigs).map(([id, cfg]) => {
                      const Icon = cfg.icon
                      return (
                        <motion.button
                          key={id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDevice(id)}
                          className="p-3 rounded border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors flex flex-col items-center gap-1.5"
                        >
                          <Icon weight="duotone" className="w-7 h-7 text-primary" />
                          <span className="text-[10px] text-foreground">{cfg.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => { const Icon = deviceConfigs[selectedDevice].icon; return <Icon weight="duotone" className="w-5 h-5 text-primary" /> })()}
                      <span className="text-sm text-primary font-semibold">{deviceConfigs[selectedDevice].name}</span>
                      <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">{deviceConfigs[selectedDevice].protocol}</Badge>
                    </div>
                    <button onClick={() => { setSelectedDevice(null); setLastSignal(null) }} className="text-xs text-primary/70 hover:text-primary">[CHANGE]</button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {deviceConfigs[selectedDevice].buttons.map((btn) => (
                      <motion.button
                        key={btn.label}
                        whileTap={{ scale: 0.93, backgroundColor: 'oklch(0.72 0.19 70 / 0.3)' }}
                        onClick={() => sendButton(selectedDevice, btn)}
                        className={`p-2.5 rounded border border-foreground/25 bg-background/50 text-xs text-foreground/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors font-semibold ${btn.wide ? 'col-span-2' : ''}`}
                      >
                        {btn.label}
                      </motion.button>
                    ))}
                  </div>

                  {transmitting && lastSignal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded border border-primary bg-primary/15 text-center">
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.3, repeat: 2 }}>
                        <Play weight="fill" className="w-6 h-6 mx-auto text-primary mb-1" />
                      </motion.div>
                      <div className="text-[10px] text-primary">TX: {lastSignal.button}</div>
                    </motion.div>
                  )}

                  {lastSignal && !transmitting && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      <div className="p-2.5 rounded border border-foreground/20 bg-background/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[10px] text-foreground/50">LAST SIGNAL: {lastSignal.button}</div>
                          <button onClick={() => saveSignal(lastSignal)} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5">
                            <FloppyDisk weight="bold" className="w-3 h-3" /> SAVE
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div><span className="text-foreground/40">PROTO:</span> <span className="text-foreground">{lastSignal.protocol}</span></div>
                          <div><span className="text-foreground/40">ADDR:</span> <span className="text-primary">{lastSignal.address}</span></div>
                          <div><span className="text-foreground/40">CMD:</span> <span className="text-primary">{lastSignal.command}</span></div>
                        </div>
                      </div>

                      <ProtocolDiagram
                        title={`${deviceConfigs[selectedDevice].protocol} Frame`}
                        fields={deviceConfigs[selectedDevice].protocolFields.map((f) =>
                          f.label === 'Command' || f.label === 'Data'
                            ? { ...f, value: lastSignal.command }
                            : f.label === 'Cmd Inv' || f.label === 'Data Inv'
                              ? { ...f, value: `~${lastSignal.command}` }
                              : f
                        )}
                        totalBits={deviceConfigs[selectedDevice].totalBits}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ─── LIBRARY VIEW ─── */}
          {view === 'library' && (
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {savedSignals.length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <FloppyDisk weight="duotone" className="w-10 h-10 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No saved signals</div>
                  <div className="text-xs text-foreground/30 mt-1">Send remote commands then save them</div>
                </div>
              ) : (
                savedSignals.map((sig, idx) => (
                  <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="text-xs text-primary font-semibold">{sig.button}</div>
                        <div className="text-[10px] text-foreground/40">{sig.device} • {sig.protocol}</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setLastSignal(sig); setTransmitting(true); setTimeout(() => setTransmitting(false), 600) }} className="p-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors" title="Replay">
                          <Play weight="fill" className="w-3 h-3" />
                        </button>
                        <button onClick={() => setSavedSignals((prev) => prev.filter((_, i) => i !== idx))} className="p-1.5 rounded border border-foreground/30 text-foreground/50 hover:text-destructive hover:border-destructive/40 transition-colors" title="Delete">
                          <Trash weight="bold" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 text-[10px] text-foreground/40">
                      <span>ADDR: {sig.address}</span>
                      <span>CMD: {sig.command}</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ─── CAPTURE VIEW ─── */}
          {view === 'capture' && (
            <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!capturing && !capturedSignal && (
                <div className="space-y-3">
                  <div className="p-4 rounded border border-foreground/20 bg-background/30 text-center">
                    <div className="text-sm text-foreground/50 mb-1">Point a remote at the IR receiver</div>
                    <div className="text-xs text-foreground/30">Press any button on the remote to capture</div>
                  </div>
                  <button onClick={startCapture} className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                    <Play weight="fill" className="w-4 h-4" />
                    START CAPTURE
                  </button>
                </div>
              )}

              {capturing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded border border-primary/50 bg-primary/5 flex flex-col items-center">
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Play weight="duotone" className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div className="text-sm text-primary mt-3">Listening for IR signal...</div>
                  <div className="text-xs text-foreground/40 mt-1">Point remote at receiver</div>
                </motion.div>
              )}

              {capturedSignal && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-3 rounded border border-primary bg-primary/15">
                    <div className="text-sm text-primary font-semibold mb-1">Signal Captured!</div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div><span className="text-foreground/40">PROTO:</span> <span className="text-foreground">{capturedSignal.protocol}</span></div>
                      <div><span className="text-foreground/40">ADDR:</span> <span className="text-primary">{capturedSignal.address}</span></div>
                      <div><span className="text-foreground/40">CMD:</span> <span className="text-primary">{capturedSignal.command}</span></div>
                    </div>
                  </div>

                  <InfraredTiming protocol={capturedSignal.protocol === 'NEC' ? 'nec' : capturedSignal.protocol === 'RC5' ? 'rc5' : 'nec'} />

                  <div className="flex gap-2">
                    <button onClick={() => saveSignal(capturedSignal)} className="flex-1 p-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5">
                      <FloppyDisk weight="bold" className="w-3.5 h-3.5" /> SAVE
                    </button>
                    <button onClick={() => { setCapturedSignal(null) }} className="flex-1 p-2 rounded border border-foreground/30 text-foreground/60 text-xs hover:bg-foreground/5 transition-colors flex items-center justify-center gap-1.5">
                      <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" /> CAPTURE AGAIN
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Universal remote for IR devices</div>
      </div>
    </div>
  )
}