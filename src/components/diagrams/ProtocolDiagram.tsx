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

  return (
    <div className="space-y-2">
      <div className="text-xs text-foreground/60 font-mono">{title}</div>
      
      <div className="border border-border rounded overflow-hidden">
        <div className="flex h-12">
          {fields.map((field, index) => {
            const widthPercent = (field.bits / totalBits) * 100
            const color = field.color || colors[index % colors.length]
            
            return (
              <motion.div
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative border-r border-background last:border-r-0 flex items-center justify-center"
                style={{ 
                  width: `${widthPercent}%`,
                  backgroundColor: `${color}20`,
                  borderTop: `2px solid ${color}`,
                }}
              >
                <div className="text-center px-1">
                  <div className="text-[0.65rem] font-semibold truncate" style={{ color }}>
                    {field.label}
                  </div>
                  {field.value && (
                    <div className="text-[0.6rem] text-foreground/50 font-mono">
                      {field.value}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <div className="flex text-[0.6rem] text-foreground/40 border-t border-border">
          {fields.map((field, index) => {
            const widthPercent = (field.bits / totalBits) * 100
            return (
              <div
                key={index}
                className="border-r border-border last:border-r-0 py-1 text-center"
                style={{ width: `${widthPercent}%` }}
              >
                {field.bits} bit{field.bits !== 1 ? 's' : ''}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
