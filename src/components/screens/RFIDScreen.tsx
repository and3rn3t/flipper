import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from '@phosphor-icons/react'

interface RFIDScreenProps {
  onBack: () => void
}

export function RFIDScreen({ onBack }: RFIDScreenProps) {
  const [scanning, setScanning] = useState(false)
  const [cardData, setCardData] = useState<{ uid: string, type: string, sectors: number } | null>(null)

  const startScan = () => {
    setScanning(true)
    setTimeout(() => {
      const cards = [
        { uid: '04:A2:F3:12:8B:90:80', type: 'MIFARE Classic 1K', sectors: 16 },
        { uid: '08:B4:E2:45:1C:23:41', type: 'MIFARE Ultralight', sectors: 4 },
        { uid: '05:C3:D1:77:9A:FF:22', type: 'NTAG213', sectors: 8 },
      ]
      setCardData(cards[Math.floor(Math.random() * cards.length)])
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">RFID/NFC READER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {!scanning && !cardData && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={startScan}
            className="w-full p-4 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            READ CARD
          </motion.button>
        )}

        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded border border-primary/50 bg-primary/5 flex flex-col items-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mb-4"
            >
              <CreditCard weight="duotone" className="w-16 h-16 text-primary" />
            </motion.div>
            <div className="text-sm text-primary">Scanning for card...</div>
            <div className="text-xs text-foreground/50 mt-2">Place card near reader</div>
          </motion.div>
        )}

        {cardData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-4 rounded border border-primary bg-primary/10 flex items-center gap-3">
              <CreditCard weight="duotone" className="w-12 h-12 text-primary" />
              <div className="flex-1">
                <div className="text-sm text-primary font-semibold mb-1">Card Detected</div>
                <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                  {cardData.type}
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded border border-foreground/20 bg-background/50">
              <div className="text-xs text-foreground/50 mb-1">UID</div>
              <div className="text-sm text-primary font-mono">{cardData.uid}</div>
            </div>

            <div className="p-3 rounded border border-foreground/20 bg-background/50">
              <div className="text-xs text-foreground/50 mb-1">TYPE</div>
              <div className="text-sm text-foreground">{cardData.type}</div>
            </div>

            <div className="p-3 rounded border border-foreground/20 bg-background/50">
              <div className="text-xs text-foreground/50 mb-1">MEMORY</div>
              <div className="text-sm text-foreground">{cardData.sectors} sectors available</div>
            </div>

            <button
              onClick={() => {
                setCardData(null)
              }}
              className="w-full p-3 rounded border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-colors"
            >
              SCAN ANOTHER
            </button>
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Reads 125kHz RFID & 13.56MHz NFC cards
        </div>
      </div>
    </div>
  )
}