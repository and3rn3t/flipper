import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trash, GithubLogo, Info, Database, ArrowSquareOut } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface SettingsScreenProps {
  onBack: () => void
}

const storageKeys = [
  { key: 'flipper-kv:subghz-saved', label: 'Sub-GHz Signals' },
  { key: 'flipper-kv:rfid-saved', label: 'RFID Cards' },
  { key: 'flipper-kv:ir-saved', label: 'IR Signals' },
  { key: 'flipper-kv:challenge-scores', label: 'Challenge Progress' },
]

const techStack = [
  'React 19',
  'TypeScript 5.7',
  'Vite 7',
  'Tailwind CSS v4',
  'Framer Motion',
  'Radix UI',
  'Phosphor Icons',
]

function getStorageSize(key: string): number {
  try {
    const val = localStorage.getItem(key)
    return val ? new Blob([val]).size : 0
  } catch {
    return 0
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [cleared, setCleared] = useState<string | null>(null)

  const clearKey = useCallback((key: string) => {
    try {
      localStorage.removeItem(key)
      setCleared(key)
      setTimeout(() => setCleared(null), 1500)
    } catch {
      // ignore
    }
  }, [])

  const clearAll = useCallback(() => {
    storageKeys.forEach(({ key }) => {
      try { localStorage.removeItem(key) } catch { /* ignore */ }
    })
    setCleared('all')
    setTimeout(() => setCleared(null), 1500)
  }, [])

  const totalBytes = storageKeys.reduce((sum, { key }) => sum + getStorageSize(key), 0)

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">SETTINGS</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">[BACK]</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* ─── ABOUT ─── */}
        <div className="space-y-2">
          <div className="text-[10px] text-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
            <Info weight="bold" className="w-3 h-3" /> About
          </div>
          <div className="p-3 rounded border border-foreground/20 bg-background/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-semibold">Flipper Zero Lab</span>
              <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">v1.0.0</Badge>
            </div>
            <p className="text-[11px] text-foreground/50 leading-relaxed">
              An interactive experimentation dashboard showcasing the Flipper Zero's capabilities through simulations and educational content. Built as a portfolio project.
            </p>
            <a
              href="https://github.com/and3rn3t/flipper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-primary/70 hover:text-primary transition-colors"
            >
              <GithubLogo weight="bold" className="w-3.5 h-3.5" />
              View on GitHub
              <ArrowSquareOut weight="bold" className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ─── TECH STACK ─── */}
        <div className="space-y-2">
          <div className="text-[10px] text-foreground/40 uppercase tracking-wider">Tech Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px] border-foreground/20 text-foreground/60">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* ─── SAVED DATA ─── */}
        <div className="space-y-2">
          <div className="text-[10px] text-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
            <Database weight="bold" className="w-3 h-3" /> Saved Data
            <span className="ml-auto text-foreground/30">{formatBytes(totalBytes)}</span>
          </div>

          {storageKeys.map(({ key, label }) => {
            const size = getStorageSize(key)
            const isCleared = cleared === key || cleared === 'all'
            return (
              <div key={key} className="p-2.5 rounded border border-foreground/20 bg-background/50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-foreground/70">{label}</div>
                  <div className="text-[10px] text-foreground/40">{formatBytes(size)}</div>
                </div>
                {isCleared ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary">
                    Cleared
                  </motion.span>
                ) : (
                  <button
                    onClick={() => clearKey(key)}
                    disabled={size === 0}
                    className="p-1.5 rounded border border-foreground/20 text-foreground/40 hover:text-destructive hover:border-destructive/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={`Clear ${label}`}
                  >
                    <Trash weight="bold" className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}

          <button
            onClick={clearAll}
            disabled={totalBytes === 0}
            className="w-full p-2 rounded border border-destructive/40 text-destructive text-xs hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Trash weight="bold" className="w-3.5 h-3.5" />
            CLEAR ALL DATA
          </button>
        </div>

        {/* ─── KEYBOARD SHORTCUTS ─── */}
        <div className="space-y-2">
          <div className="text-[10px] text-foreground/40 uppercase tracking-wider">Keyboard Shortcuts</div>
          <div className="p-3 rounded border border-foreground/20 bg-background/50 grid grid-cols-2 gap-y-1.5 gap-x-4 text-[10px]">
            <div className="text-foreground/50">Arrow Keys</div>
            <div className="text-foreground/70">Navigate menu</div>
            <div className="text-foreground/50">Enter</div>
            <div className="text-foreground/70">Select / OK</div>
            <div className="text-foreground/50">Escape / Backspace</div>
            <div className="text-foreground/70">Go back</div>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Flipper Zero Lab • 2026</div>
      </div>
    </div>
  )
}
