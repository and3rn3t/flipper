import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Warning, Keyboard, Play, ArrowLeft } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface BadUSBScreenProps {
  onBack: () => void
}

interface Payload {
  id: string
  name: string
  description: string
  script: string[]
  actions: string[]
}

const payloads: Payload[] = [
  {
    id: 'rickroll',
    name: 'Harmless Prank',
    description: 'Opens a browser to a YouTube video',
    script: [
      'REM Harmless prank payload',
      'DELAY 500',
      'GUI r',
      'DELAY 300',
      'STRING https://youtu.be/dQw4w9WgXcQ',
      'ENTER',
      'DELAY 1000',
      'REM Done!',
    ],
    actions: [
      '⏳ Wait 500ms',
      '⌨️ Win+R → Open Run dialog',
      '⏳ Wait 300ms',
      '⌨️ Typing URL...',
      '⌨️ https://youtu.be/dQw4w9WgXcQ',
      '↵ Press Enter',
      '⏳ Wait 1000ms',
      '✅ Browser opens video',
    ],
  },
  {
    id: 'wifi',
    name: 'WiFi Info Grabber',
    description: 'Retrieves saved WiFi network names',
    script: [
      'REM WiFi credential display',
      'DELAY 500',
      'GUI r',
      'DELAY 300',
      'STRING cmd /k netsh wlan show profiles',
      'ENTER',
      'DELAY 2000',
      'REM Displays saved networks',
    ],
    actions: [
      '⏳ Wait 500ms',
      '⌨️ Win+R → Open Run dialog',
      '⏳ Wait 300ms',
      '⌨️ Typing command...',
      '⌨️ cmd /k netsh wlan show profiles',
      '↵ Press Enter',
      '⏳ Wait 2000ms',
      '✅ Shows saved WiFi profiles',
    ],
  },
  {
    id: 'sysinfo',
    name: 'System Info Export',
    description: 'Exports system information to a text file',
    script: [
      'REM System information export',
      'DELAY 500',
      'GUI r',
      'DELAY 300',
      'STRING cmd',
      'ENTER',
      'DELAY 500',
      'STRING systeminfo > %TEMP%\\info.txt',
      'ENTER',
      'REM Saved to temp folder',
    ],
    actions: [
      '⏳ Wait 500ms',
      '⌨️ Win+R → Open Run dialog',
      '⏳ Wait 300ms',
      '⌨️ Type: cmd',
      '↵ Press Enter → CMD opens',
      '⏳ Wait 500ms',
      '⌨️ Type: systeminfo > %TEMP%\\info.txt',
      '↵ Press Enter',
      '⏳ Collecting system info...',
      '✅ Info saved to temp folder',
    ],
  },
]

type View = 'list' | 'editor' | 'running'

export function BadUSBScreen({ onBack }: BadUSBScreenProps) {
  const [view, setView] = useState<View>('list')
  const [selectedPayload, setSelectedPayload] = useState<Payload | null>(null)
  const [editableScript, setEditableScript] = useState<string>('')
  const [currentLine, setCurrentLine] = useState(-1)
  const [executedActions, setExecutedActions] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const selectPayload = (payload: Payload) => {
    setSelectedPayload(payload)
    setEditableScript(payload.script.join('\n'))
    setView('editor')
    setCurrentLine(-1)
    setExecutedActions([])
    setIsComplete(false)
  }

  const runPayload = () => {
    if (!selectedPayload) return
    setView('running')
    setCurrentLine(-1)
    setExecutedActions([])
    setIsComplete(false)

    let line = 0
    intervalRef.current = setInterval(() => {
      if (line < selectedPayload.actions.length) {
        setCurrentLine(line)
        setExecutedActions(prev => [...prev, selectedPayload.actions[line]])
        line++
      } else {
        clearInterval(intervalRef.current)
        setIsComplete(true)
      }
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const goBack = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (view === 'running') {
      setView('editor')
      setCurrentLine(-1)
      setExecutedActions([])
      setIsComplete(false)
    } else if (view === 'editor') {
      setView('list')
      setSelectedPayload(null)
    } else {
      onBack()
    }
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <button onClick={goBack} className="text-xs text-primary hover:text-primary/80">
              <ArrowLeft weight="bold" className="w-3 h-3" />
            </button>
          )}
          <Keyboard weight="duotone" className="w-4 h-4 text-primary" />
          <div className="text-sm text-foreground/60">BAD USB</div>
        </div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 rounded border-2 border-destructive bg-destructive/10 flex gap-2"
              >
                <Warning weight="fill" className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div className="text-[10px] text-destructive-foreground">
                  <span className="font-semibold">EDUCATIONAL ONLY</span> — Unauthorized use of BadUSB payloads is illegal.
                </div>
              </motion.div>

              <div className="text-xs text-foreground/50">SELECT PAYLOAD TO CUSTOMIZE:</div>

              <div className="space-y-1.5">
                {payloads.map((payload, i) => (
                  <motion.button
                    key={payload.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => selectPayload(payload)}
                    className="w-full text-left p-2 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs text-primary font-semibold">{payload.name}</span>
                      <Badge variant="outline" className="text-[9px] border-primary/50 text-primary px-1 py-0">
                        DUCKY
                      </Badge>
                    </div>
                    <div className="text-[10px] text-foreground/50">{payload.description}</div>
                  </motion.button>
                ))}
              </div>

              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-[10px] text-foreground/50 mb-1">HOW IT WORKS</div>
                <div className="text-[10px] text-foreground/70 space-y-0.5">
                  <div>• Emulates USB HID keyboard</div>
                  <div>• Uses DuckyScript language</div>
                  <div>• Executes keystrokes in milliseconds</div>
                  <div>• No drivers or software needed</div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'editor' && selectedPayload && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-primary font-semibold">{selectedPayload.name}</div>
                <button
                  onClick={runPayload}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-green-400/50 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
                >
                  <Play weight="fill" className="w-3 h-3" />
                  RUN
                </button>
              </div>

              {/* Script Editor */}
              <div className="rounded border border-foreground/20 bg-background/80 overflow-hidden">
                <div className="text-[10px] text-foreground/50 px-2 py-1 border-b border-foreground/10 bg-foreground/5">
                  DUCKYSCRIPT EDITOR
                </div>
                <textarea
                  value={editableScript}
                  onChange={(e) => setEditableScript(e.target.value)}
                  className="w-full bg-transparent text-[10px] text-foreground font-mono p-2 outline-none resize-none min-h-[120px] leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Preview */}
              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-[10px] text-foreground/50 mb-1">EXECUTION PREVIEW</div>
                <div className="space-y-0.5">
                  {selectedPayload.actions.map((action, i) => (
                    <div key={i} className="text-[10px] text-foreground/60">
                      <span className="text-foreground/30 mr-1">{i + 1}.</span>{action}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'running' && selectedPayload && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Script with highlight */}
              <div className="rounded border border-foreground/20 bg-background/80 overflow-hidden">
                <div className="text-[10px] text-foreground/50 px-2 py-1 border-b border-foreground/10 bg-foreground/5 flex items-center justify-between">
                  <span>EXECUTING PAYLOAD</span>
                  {!isComplete && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-green-400"
                    >
                      RUNNING
                    </motion.span>
                  )}
                  {isComplete && <span className="text-green-400">DONE</span>}
                </div>
                <div className="p-2 space-y-0.5">
                  {selectedPayload.script.map((line, i) => (
                    <motion.div
                      key={i}
                      className={`text-[10px] font-mono px-1 rounded transition-colors ${
                        i === currentLine
                          ? 'bg-primary/20 text-primary'
                          : i < currentLine
                          ? 'text-foreground/40'
                          : 'text-foreground/20'
                      }`}
                    >
                      <span className="text-foreground/20 mr-1 inline-block w-3 text-right">{i + 1}</span>
                      {line}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Live Actions */}
              <div className="p-2 rounded border border-foreground/20 bg-background/50">
                <div className="text-[10px] text-foreground/50 mb-1">KEYSTROKE LOG</div>
                <div className="space-y-0.5 min-h-[60px]">
                  {executedActions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-foreground/70"
                    >
                      {action}
                    </motion.div>
                  ))}
                </div>
              </div>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded border border-green-400/30 bg-green-400/5 text-center"
                >
                  <div className="text-xs text-green-400 font-semibold">✓ Payload Executed</div>
                  <div className="text-[10px] text-foreground/50 mt-1">
                    {selectedPayload.script.length} lines • {selectedPayload.actions.length} keystrokes
                  </div>
                  <button
                    onClick={() => { setView('editor'); setCurrentLine(-1); setExecutedActions([]); setIsComplete(false) }}
                    className="text-[10px] text-primary hover:text-primary/80 mt-1"
                  >
                    [EDIT & RE-RUN]
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          {view === 'list' ? 'USB HID emulation • DuckyScript payloads' :
           view === 'editor' ? 'Edit script then press RUN to simulate' :
           'Simulated keystroke injection'}
        </div>
      </div>
    </div>
  )
}