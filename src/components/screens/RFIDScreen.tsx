import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { CreditCard, FloppyDisk, Copy, ArrowsClockwise, Trash, CheckCircle } from '@phosphor-icons/react'
import { RFIDStructure } from '@/components/diagrams/RFIDStructure'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'
import { useLocalKV } from '@/hooks/use-local-kv'

interface RFIDScreenProps {
  onBack: () => void
}

type View = 'read' | 'saved' | 'write'

interface CardData {
  uid: string
  type: string
  sectors: number
  frequency: string
  standard: string
}

const cardPool: CardData[] = [
  { uid: '04:A2:F3:12:8B:90:80', type: 'MIFARE Classic 1K', sectors: 16, frequency: '13.56 MHz', standard: 'ISO 14443A' },
  { uid: '08:B4:E2:45:1C:23:41', type: 'MIFARE Ultralight', sectors: 4, frequency: '13.56 MHz', standard: 'ISO 14443A' },
  { uid: '05:C3:D1:77:9A:FF:22', type: 'NTAG213', sectors: 8, frequency: '13.56 MHz', standard: 'ISO 14443A' },
  { uid: '01:23:45:67:89', type: 'MIFARE DESFire EV1', sectors: 28, frequency: '13.56 MHz', standard: 'ISO 14443A' },
  { uid: 'E0:04:01:50:A3:2B:1C:FF', type: 'iCLASS SE', sectors: 32, frequency: '13.56 MHz', standard: 'ISO 15693' },
  { uid: '72:00:15:A4:3E', type: 'EM4100', sectors: 1, frequency: '125 kHz', standard: 'EM Marine' },
  { uid: '1A:00:43:7F:B2', type: 'HID Prox', sectors: 1, frequency: '125 kHz', standard: 'HID' },
]

const protocolMap: Record<string, { title: string; fields: { label: string; bits: number; value?: string }[]; totalBits: number }> = {
  'MIFARE Classic 1K': {
    title: 'MIFARE Classic 1K Structure',
    fields: [
      { label: 'UID', bits: 32, value: '4 bytes' },
      { label: 'BCC', bits: 8, value: 'Check' },
      { label: 'SAK', bits: 8, value: '0x08' },
      { label: 'ATQA', bits: 16, value: '0x0004' },
      { label: 'Data', bits: 768, value: '16 sectors × 4 blocks' },
    ],
    totalBits: 832,
  },
  'MIFARE Ultralight': {
    title: 'MIFARE Ultralight Structure',
    fields: [
      { label: 'UID', bits: 56, value: '7 bytes' },
      { label: 'Data', bits: 128, value: '16 pages × 4B' },
      { label: 'Lock', bits: 16, value: 'Config' },
      { label: 'OTP', bits: 32, value: 'One-time' },
    ],
    totalBits: 232,
  },
  'NTAG213': {
    title: 'NTAG213 NFC Tag',
    fields: [
      { label: 'UID', bits: 56, value: '7 bytes' },
      { label: 'CC', bits: 32, value: 'Compat.' },
      { label: 'NDEF', bits: 1120, value: '144 bytes' },
      { label: 'Lock', bits: 24, value: 'Config' },
    ],
    totalBits: 1232,
  },
  'EM4100': {
    title: 'EM4100 125kHz',
    fields: [
      { label: 'Header', bits: 9, value: '0x1FF' },
      { label: 'Data', bits: 40, value: '10 nibbles' },
      { label: 'Parity', bits: 14, value: 'Col+Row' },
      { label: 'Stop', bits: 1, value: '0' },
    ],
    totalBits: 64,
  },
}

export function RFIDScreen({ onBack }: RFIDScreenProps) {
  const [view, setView] = useState<View>('read')
  const [scanning, setScanning] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [savedCards, setSavedCards] = useLocalKV<CardData[]>('rfid-saved', [])
  const [writeTarget, setWriteTarget] = useState<CardData | null>(null)
  const [writing, setWriting] = useState(false)
  const [writeSuccess, setWriteSuccess] = useState(false)

  const startScan = useCallback(() => {
    setScanning(true)
    setCardData(null)
    setTimeout(() => {
      setCardData(cardPool[Math.floor(Math.random() * cardPool.length)])
      setScanning(false)
    }, 2000)
  }, [])

  const saveCard = useCallback((card: CardData) => {
    if (!savedCards.find((c) => c.uid === card.uid)) {
      setSavedCards((prev) => [...prev, card])
    }
  }, [savedCards])

  const startWrite = useCallback((card: CardData) => {
    setWriteTarget(card)
    setView('write')
    setWriting(true)
    setWriteSuccess(false)
    setTimeout(() => {
      setWriting(false)
      setWriteSuccess(true)
    }, 3000)
  }, [])

  const tabs: { id: View; label: string }[] = [
    { id: 'read', label: 'READ' },
    { id: 'saved', label: `SAVED (${savedCards.length})` },
    { id: 'write', label: 'WRITE' },
  ]

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">RFID/NFC READER</div>
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
          {/* ─── READ VIEW ─── */}
          {view === 'read' && (
            <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!scanning && !cardData && (
                <button onClick={startScan} className="w-full p-3 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors text-sm">
                  READ CARD
                </button>
              )}

              {scanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded border border-primary/50 bg-primary/5 flex flex-col items-center">
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="mb-3">
                    <CreditCard weight="duotone" className="w-14 h-14 text-primary" />
                  </motion.div>
                  <div className="text-sm text-primary">Scanning for card...</div>
                  <div className="text-xs text-foreground/50 mt-1">Place card near reader</div>
                </motion.div>
              )}

              {cardData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-3 rounded border border-primary bg-primary/10 flex items-center gap-3">
                    <CreditCard weight="duotone" className="w-10 h-10 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-primary font-semibold mb-0.5">Card Detected</div>
                      <Badge variant="outline" className="border-primary/50 text-primary text-[10px]">{cardData.type}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded border border-foreground/20 bg-background/50">
                      <div className="text-[10px] text-foreground/50 mb-0.5">UID</div>
                      <div className="text-xs text-primary font-mono truncate">{cardData.uid}</div>
                    </div>
                    <div className="p-2.5 rounded border border-foreground/20 bg-background/50">
                      <div className="text-[10px] text-foreground/50 mb-0.5">FREQUENCY</div>
                      <div className="text-xs text-foreground">{cardData.frequency}</div>
                    </div>
                    <div className="p-2.5 rounded border border-foreground/20 bg-background/50">
                      <div className="text-[10px] text-foreground/50 mb-0.5">STANDARD</div>
                      <div className="text-xs text-foreground">{cardData.standard}</div>
                    </div>
                    <div className="p-2.5 rounded border border-foreground/20 bg-background/50">
                      <div className="text-[10px] text-foreground/50 mb-0.5">MEMORY</div>
                      <div className="text-xs text-foreground">{cardData.sectors} sectors</div>
                    </div>
                  </div>

                  {cardData.type === 'MIFARE Classic 1K' && (
                    <RFIDStructure cardType="mifare" />
                  )}

                  {protocolMap[cardData.type] && (
                    <ProtocolDiagram
                      title={protocolMap[cardData.type].title}
                      fields={protocolMap[cardData.type].fields}
                      totalBits={protocolMap[cardData.type].totalBits}
                    />
                  )}

                  <div className="flex gap-2">
                    {!savedCards.find((c) => c.uid === cardData.uid) && (
                      <button onClick={() => saveCard(cardData)} className="flex-1 p-2 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5">
                        <FloppyDisk weight="bold" className="w-3.5 h-3.5" />
                        SAVE
                      </button>
                    )}
                    <button onClick={startScan} className="flex-1 p-2 rounded border border-foreground/30 text-foreground/60 text-xs hover:bg-foreground/5 transition-colors flex items-center justify-center gap-1.5">
                      <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
                      RESCAN
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── SAVED VIEW ─── */}
          {view === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {savedCards.length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <FloppyDisk weight="duotone" className="w-10 h-10 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No saved cards</div>
                  <div className="text-xs text-foreground/30 mt-1">Read cards and save them to your library</div>
                </div>
              ) : (
                savedCards.map((card, idx) => (
                  <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">{card.type}</Badge>
                        <div className="text-xs text-foreground/50 font-mono mt-1 truncate">{card.uid}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startWrite(card)} className="p-1.5 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors" title="Clone / Write">
                          <Copy weight="bold" className="w-3 h-3" />
                        </button>
                        <button onClick={() => setSavedCards((prev) => prev.filter((_, i) => i !== idx))} className="p-1.5 rounded border border-foreground/30 text-foreground/50 hover:text-destructive hover:border-destructive/40 transition-colors" title="Delete">
                          <Trash weight="bold" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 text-[10px] text-foreground/40">
                      <span>{card.frequency}</span>
                      <span>•</span>
                      <span>{card.standard}</span>
                      <span>•</span>
                      <span>{card.sectors} sectors</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ─── WRITE / CLONE VIEW ─── */}
          {view === 'write' && (
            <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!writeTarget ? (
                <div className="space-y-3">
                  <div className="p-4 rounded border border-foreground/20 bg-background/30 text-center">
                    <Copy weight="duotone" className="w-10 h-10 mx-auto text-foreground/30 mb-2" />
                    <div className="text-sm text-foreground/50">Select a card to clone</div>
                    <div className="text-xs text-foreground/30 mt-1">Choose from your saved cards below</div>
                  </div>
                  {savedCards.length > 0 ? (
                    savedCards.map((card, idx) => (
                      <button key={idx} onClick={() => startWrite(card)} className="w-full p-3 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors text-left">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-primary font-semibold">{card.type}</div>
                            <div className="text-[10px] text-foreground/40 font-mono">{card.uid}</div>
                          </div>
                          <Copy weight="bold" className="w-4 h-4 text-primary/50" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-foreground/40 text-center">No saved cards available. Read and save a card first.</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded border border-primary bg-primary/10">
                    <div className="text-xs text-foreground/50 mb-1">WRITING</div>
                    <div className="text-sm text-primary font-semibold">{writeTarget.type}</div>
                    <div className="text-xs text-foreground/50 font-mono">{writeTarget.uid}</div>
                  </div>

                  {writing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded border border-primary/50 bg-primary/5 flex flex-col items-center">
                      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                        <CreditCard weight="duotone" className="w-12 h-12 text-primary" />
                      </motion.div>
                      <div className="text-sm text-primary mt-3">Writing to blank card...</div>
                      <div className="text-xs text-foreground/40 mt-1">Hold card steady</div>
                    </motion.div>
                  )}

                  {writeSuccess && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded border border-primary bg-primary/15 text-center">
                      <CheckCircle weight="duotone" className="w-10 h-10 mx-auto text-primary mb-2" />
                      <div className="text-sm text-primary font-semibold">Clone Complete</div>
                      <div className="text-xs text-foreground/50 mt-1">Card data written successfully</div>
                    </motion.div>
                  )}

                  <button onClick={() => { setWriteTarget(null); setWriteSuccess(false) }} className="w-full p-2 rounded border border-foreground/30 text-foreground/60 text-xs hover:bg-foreground/5 transition-colors">
                    {writeSuccess ? 'CLONE ANOTHER' : 'CANCEL'}
                  </button>

                  <div className="p-3 rounded border border-foreground/15 bg-background/30">
                    <div className="text-[10px] text-foreground/40 uppercase tracking-wider mb-1">Disclaimer</div>
                    <div className="text-[10px] text-foreground/30">
                      Cloning access cards without authorization is illegal. Only use on cards you own or have permission to duplicate.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Reads 125kHz RFID & 13.56MHz NFC cards</div>
      </div>
    </div>
  )
}