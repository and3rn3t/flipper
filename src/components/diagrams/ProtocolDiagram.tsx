import { motion } from 'framer-motion'

interface ProtocolField {
  label: string
  bits: number
  color?: string
  value?: string
}

interface ProtocolDiagramProps {
  title: string
  fields: ProtocolField[]
  totalBits?: number
}

export function ProtocolDiagram({ title, fields, totalBits = 32 }: ProtocolDiagramProps) {
  const colors = [
    'oklch(0.68 0.18 45)',
    'oklch(0.65 0.19 145)',
    'oklch(0.70 0.15 200)',
    'oklch(0.72 0.16 280)',
    'oklch(0.68 0.17 350)',
  ]

  // Give each field a flex value based on bit count, but enforce a minimum so
  // narrow fields stay readable. The minimum is expressed in the same "flex
  // unit" space – fields whose natural proportion is below this threshold get
  // bumped up, and the remaining space is distributed proportionally.
  const MIN_FLEX = 3 // minimum flex units for any field
  const flexValues = fields.map((f) => Math.max(f.bits / totalBits * 100, MIN_FLEX))

  return (
    <div className="space-y-2">
      <div className="text-xs text-foreground/60 font-mono">{title}</div>

      <div className="border border-border rounded overflow-x-auto">
        <div className="flex" style={{ minWidth: `${fields.length * 56}px` }}>
          {fields.map((field, index) => {
            const color = field.color || colors[index % colors.length]

            return (
              <motion.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative border-r border-background last:border-r-0 flex flex-col items-center justify-center py-1.5"
                style={{
                  flex: flexValues[index],
                  minWidth: 56,
                  backgroundColor: `${color}20`,
                  borderTop: `2px solid ${color}`,
                }}
              >
                <div className="text-[0.65rem] font-semibold leading-tight text-center px-1" style={{ color }}>
                  {field.label}
                </div>
                {field.value && (
                  <div className="text-[0.55rem] text-foreground/50 font-mono leading-tight mt-0.5">
                    {field.value}
                  </div>
                )}
                <div className="text-[0.5rem] text-foreground/35 mt-0.5">
                  {field.bits}b
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
