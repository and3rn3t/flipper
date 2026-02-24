import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Lightning, ArrowLeft } from '@phosphor-icons/react'

interface GPIOScreenProps {
  onBack: () => void
}

type PinState = 'OFF' | 'HIGH' | 'LOW'

interface Pin {
  id: number
  label: string
  type: 'power' | 'gpio' | 'ground'
  state: PinState
  description: string
}

const initialPins: Pin[] = [
  { id: 1, label: '3V3', type: 'power', state: 'HIGH', description: '3.3V Power' },
  { id: 2, label: 'GND', type: 'ground', state: 'LOW', description: 'Ground' },
  { id: 3, label: 'PA7', type: 'gpio', state: 'OFF', description: 'GPIO / ADC' },
  { id: 4, label: 'PA6', type: 'gpio', state: 'OFF', description: 'GPIO / ADC' },
  { id: 5, label: 'PA4', type: 'gpio', state: 'OFF', description: 'GPIO / SPI' },
  { id: 6, label: 'PB3', type: 'gpio', state: 'OFF', description: 'GPIO / SPI' },
  { id: 7, label: 'PB2', type: 'gpio', state: 'OFF', description: 'GPIO / SPI' },
  { id: 8, label: 'PC3', type: 'gpio', state: 'OFF', description: 'GPIO / I2C' },
  { id: 9, label: 'PA14', type: 'gpio', state: 'OFF', description: 'GPIO / SWCLK' },
  { id: 10, label: 'PA13', type: 'gpio', state: 'OFF', description: 'GPIO / SWDIO' },
  { id: 11, label: 'TX', type: 'gpio', state: 'OFF', description: 'UART Transmit' },
  { id: 12, label: 'RX', type: 'gpio', state: 'OFF', description: 'UART Receive' },
  { id: 13, label: 'PC1', type: 'gpio', state: 'OFF', description: 'GPIO / IRQ' },
  { id: 14, label: 'PC0', type: 'gpio', state: 'OFF', description: 'GPIO / 1-Wire' },
  { id: 15, label: '5V', type: 'power', state: 'HIGH', description: '5V Power' },
  { id: 16, label: 'GND', type: 'ground', state: 'LOW', description: 'Ground' },
  { id: 17, label: 'iButton', type: 'gpio', state: 'OFF', description: '1-Wire / iButton' },
  { id: 18, label: 'GND', type: 'ground', state: 'LOW', description: 'Ground' },
]

interface Project {
  name: string
  description: string
  pinConfig: Record<number, PinState>
  code: string[]
  output: string[]
}

const exampleProjects: Project[] = [
  {
    name: 'LED Blinker',
    description: 'Toggle an LED on PA7 at 1Hz',
    pinConfig: { 3: 'HIGH', 2: 'LOW' },
    code: [
      '> gpio mode PA7 OUTPUT',
      '> gpio set PA7 HIGH',
      '  [PA7] -> 3.3V (LED ON)',
      '> delay 500ms',
      '> gpio set PA7 LOW',
      '  [PA7] -> 0V (LED OFF)',
      '> delay 500ms',
      '  Loop: repeating...',
    ],
    output: ['LED ON', 'LED OFF', 'LED ON', 'LED OFF', 'Cycle: 4'],
  },
  {
    name: 'UART Logger',
    description: 'Read serial data on RX, echo on TX',
    pinConfig: { 11: 'HIGH', 12: 'HIGH' },
    code: [
      '> uart init 115200 8N1',
      '  UART ready on TX/RX',
      '> uart listen',
      '  RX <- 0x48 0x65 0x6C 0x6C 0x6F',
      '  Decoded: "Hello"',
      '> uart send "ACK"',
      '  TX -> 0x41 0x43 0x4B',
    ],
    output: ['UART 115200 baud', 'RX: "Hello"', 'TX: "ACK"', 'Bytes: 8'],
  },
  {
    name: 'I2C Scanner',
    description: 'Scan I2C bus for connected devices',
    pinConfig: { 8: 'HIGH', 5: 'HIGH' },
    code: [
      '> i2c init 400kHz',
      '  SCL: PC3, SDA: PA4',
      '> i2c scan',
      '  Scanning 0x01..0x7F',
      '  Found: 0x27 (LCD)',
      '  Found: 0x48 (TMP102)',
      '  Found: 0x68 (MPU6050)',
      '  Scan complete: 3 devices',
    ],
    output: ['I2C @ 400kHz', 'Devices: 3', '0x27 LCD', '0x48 Temp', '0x68 IMU'],
  },
]

type View = 'pins' | 'project'

export function GPIOScreen({ onBack }: GPIOScreenProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins)
  const [view, setView] = useState<View>('pins')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const togglePin = (pinId: number) => {
    setPins(prev => prev.map(p => {
      if (p.id !== pinId || p.type !== 'gpio') return p
      const next: PinState = p.state === 'OFF' ? 'HIGH' : p.state === 'HIGH' ? 'LOW' : 'OFF'
      return { ...p, state: next }
    }))
  }

  const runProject = (project: Project) => {
    setSelectedProject(project)
    setView('project')
    setCodeLines([])
    setIsRunning(true)

    // Apply project pin configuration
    setPins(prev => prev.map(p => ({
      ...p,
      state: project.pinConfig[p.id] ?? (p.type === 'power' ? 'HIGH' : p.type === 'ground' ? 'LOW' : 'OFF')
    })))

    // Animate code lines appearing one by one
    project.code.forEach((_, i) => {
      setTimeout(() => {
        setCodeLines(prev => [...prev, project.code[i]])
        if (i === project.code.length - 1) {
          setIsRunning(false)
        }
      }, (i + 1) * 400)
    })
  }

  const stateColor = (state: PinState) => {
    if (state === 'HIGH') return 'text-green-400 border-green-400/50 bg-green-400/10'
    if (state === 'LOW') return 'text-blue-400 border-blue-400/50 bg-blue-400/10'
    return 'text-foreground/40 border-foreground/20 bg-foreground/5'
  }

  const stateIndicator = (state: PinState) => {
    if (state === 'HIGH') return '●'
    if (state === 'LOW') return '○'
    return '–'
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {view === 'project' && (
            <button onClick={() => { setView('pins'); setSelectedProject(null); setCodeLines([]) }} className="text-xs text-primary hover:text-primary/80">
              <ArrowLeft weight="bold" className="w-3 h-3" />
            </button>
          )}
          <Cpu weight="duotone" className="w-4 h-4 text-primary" />
          <div className="text-sm text-foreground/60">GPIO INTERFACE</div>
        </div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'pins' ? (
            <motion.div
              key="pins"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Pin Grid */}
              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-xs text-foreground/50 mb-2">PINOUT — TAP GPIO PINS TO TOGGLE</div>
                <div className="grid grid-cols-2 gap-1">
                  {pins.map((pin) => (
                    <motion.button
                      key={pin.id}
                      whileTap={pin.type === 'gpio' ? { scale: 0.95 } : undefined}
                      onClick={() => togglePin(pin.id)}
                      disabled={pin.type !== 'gpio'}
                      className={`p-1.5 rounded border text-left transition-colors ${stateColor(pin.state)} ${pin.type === 'gpio' ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold">{pin.label}</span>
                        <span className="text-[10px]">{stateIndicator(pin.state)}</span>
                      </div>
                      <div className="text-[9px] opacity-60 truncate">{pin.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-3 px-2">
                <div className="flex items-center gap-1">
                  <span className="text-green-400 text-[10px]">●</span>
                  <span className="text-[10px] text-foreground/50">HIGH</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-400 text-[10px]">○</span>
                  <span className="text-[10px] text-foreground/50">LOW</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-foreground/40 text-[10px]">–</span>
                  <span className="text-[10px] text-foreground/50">OFF</span>
                </div>
              </div>

              {/* Example Projects */}
              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-xs text-foreground/50 mb-2">EXAMPLE PROJECTS</div>
                <div className="space-y-1.5">
                  {exampleProjects.map((project, i) => (
                    <motion.button
                      key={project.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => runProject(project)}
                      className="w-full text-left p-2 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightning weight="fill" className="w-3 h-3 text-primary shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-foreground">{project.name}</div>
                          <div className="text-[10px] text-foreground/50">{project.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="project"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {/* Project header */}
              <div className="p-2 rounded border border-primary/30 bg-primary/5">
                <div className="text-xs font-semibold text-primary">{selectedProject?.name}</div>
                <div className="text-[10px] text-foreground/50">{selectedProject?.description}</div>
              </div>

              {/* Active Pins */}
              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-[10px] text-foreground/50 mb-1">ACTIVE PINS</div>
                <div className="flex flex-wrap gap-1">
                  {pins.filter(p => p.state !== 'OFF' && p.type === 'gpio').map(p => (
                    <span key={p.id} className={`text-[10px] px-1.5 py-0.5 rounded border ${stateColor(p.state)}`}>
                      {p.label}: {p.state}
                    </span>
                  ))}
                  {pins.filter(p => p.state !== 'OFF' && p.type === 'gpio').length === 0 && (
                    <span className="text-[10px] text-foreground/30">No GPIO pins active</span>
                  )}
                </div>
              </div>

              {/* Code Terminal */}
              <div className="p-2 rounded border border-foreground/20 bg-background/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] text-foreground/50">TERMINAL OUTPUT</div>
                  {isRunning && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-[10px] text-green-400"
                    >
                      RUNNING...
                    </motion.div>
                  )}
                </div>
                <div className="space-y-0.5 min-h-[80px]">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[10px] font-mono ${line.startsWith('>') ? 'text-green-400' : 'text-foreground/60'}`}
                    >
                      {line}
                    </motion.div>
                  ))}
                  {codeLines.length > 0 && !isRunning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-primary mt-1 border-t border-foreground/10 pt-1"
                    >
                      ✓ Execution complete
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Output Summary */}
              {!isRunning && codeLines.length > 0 && selectedProject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded border border-green-400/30 bg-green-400/5"
                >
                  <div className="text-[10px] text-foreground/50 mb-1">OUTPUT SUMMARY</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.output.map((item, i) => (
                      <span key={i} className="text-[10px] text-green-400 px-1.5 py-0.5 rounded border border-green-400/30 bg-green-400/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          {view === 'pins' ? 'Tap GPIO pins to toggle • Select project to simulate' : 'Simulated GPIO execution'}
        </div>
      </div>
    </div>
  )
}