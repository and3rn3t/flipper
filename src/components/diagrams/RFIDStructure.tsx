import { motion } from 'framer-motion'
import { Lock, LockOpen } from '@phosphor-icons/react'

interface RFIDStructureProps {
  cardType: 'mifare' | 'em4100' | 'hid'
}

const cardStructures = {
  mifare: {
    name: 'MIFARE Classic 1K',
    sectors: 16,
    blocksPerSector: 4,
    description: '16 sectors × 4 blocks × 16 bytes = 1024 bytes total',
    features: [
      { label: 'Sector 0', locked: false, special: 'Manufacturer Block' },
      { label: 'Sectors 1-15', locked: true, special: 'Data Sectors' },
    ]
  },
  em4100: {
    name: 'EM4100 (125kHz)',
    sectors: 1,
    blocksPerSector: 1,
    description: '64-bit read-only structure',
    features: [
      { label: 'Header', locked: false, special: '9 bits' },
      { label: 'Customer ID', locked: false, special: '32 bits' },
      { label: 'Checksum', locked: false, special: '4 bits' },
    ]
  },
  hid: {
    name: 'HID Prox',
    sectors: 1,
    blocksPerSector: 1,
    description: '26-bit Wiegand format',
    features: [
      { label: 'Parity', locked: false, special: '1 bit' },
      { label: 'Facility Code', locked: false, special: '8 bits' },
      { label: 'Card Number', locked: false, special: '16 bits' },
      { label: 'Parity', locked: false, special: '1 bit' },
    ]
  }
}

export function RFIDStructure({ cardType }: RFIDStructureProps) {
  const structure = cardStructures[cardType]

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs text-foreground/60 font-mono mb-1">{structure.name}</div>
        <div className="text-[0.65rem] text-foreground/50">{structure.description}</div>
      </div>

      {cardType === 'mifare' && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 16 }).map((_, sectorIdx) => (
              <motion.div
                key={sectorIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: sectorIdx * 0.03 }}
                className="relative"
              >
                <div className={`
                  aspect-square rounded border-2 flex items-center justify-center text-[0.6rem] font-mono
                  ${sectorIdx === 0 
                    ? 'border-primary bg-primary/20 text-primary' 
                    : 'border-foreground/20 bg-card text-foreground/60'
                  }
                `}>
                  {sectorIdx}
                  {sectorIdx > 0 && (
                    <Lock weight="fill" className="absolute top-0.5 right-0.5 w-2 h-2 text-foreground/40" />
                  )}
                  {sectorIdx === 0 && (
                    <LockOpen weight="fill" className="absolute top-0.5 right-0.5 w-2 h-2 text-primary/60" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {structure.features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="flex items-center gap-2 p-2 rounded border border-border bg-card/30"
          >
            {feature.locked ? (
              <Lock weight="fill" className="w-3 h-3 text-foreground/40 flex-shrink-0" />
            ) : (
              <LockOpen weight="fill" className="w-3 h-3 text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[0.65rem] font-semibold text-foreground truncate">{feature.label}</div>
              <div className="text-[0.6rem] text-foreground/50">{feature.special}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
