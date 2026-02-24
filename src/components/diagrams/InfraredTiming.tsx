import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface InfraredTimingProps {
  protocol: 'nec' | 'rc5' | 'sony'
  className?: string
}

const protocolData = {
  nec: {
    name: 'NEC Protocol',
    agc: 9000,
    agcSpace: 4500,
    pulses: [
      { type: 'agc', duration: 9000, label: 'AGC Burst' },
      { type: 'space', duration: 4500, label: 'Space' },
      { type: 'data', duration: 560, label: 'Logical 0' },
      { type: 'space', duration: 560, label: '' },
      { type: 'data', duration: 560, label: 'Logical 1' },
      { type: 'space', duration: 1690, label: '' },
    ]
  },
  rc5: {
    name: 'RC5 Protocol',
    agc: 889,
    agcSpace: 889,
    pulses: [
      { type: 'data', duration: 889, label: 'Start 1' },
      { type: 'space', duration: 889, label: '' },
      { type: 'data', duration: 889, label: 'Start 2' },
      { type: 'space', duration: 889, label: '' },
      { type: 'data', duration: 889, label: 'Toggle' },
      { type: 'space', duration: 889, label: '' },
    ]
  },
  sony: {
    name: 'Sony SIRC',
    agc: 2400,
    agcSpace: 600,
    pulses: [
      { type: 'agc', duration: 2400, label: 'AGC' },
      { type: 'space', duration: 600, label: 'Space' },
      { type: 'data', duration: 600, label: 'Bit 0' },
      { type: 'space', duration: 600, label: '' },
      { type: 'data', duration: 1200, label: 'Bit 1' },
      { type: 'space', duration: 600, label: '' },
    ]
  }
}

export function InfraredTiming({ protocol, className = '' }: InfraredTimingProps) {
  const data = protocolData[protocol]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const progressRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 20
    const graphHeight = height - padding * 2

    const totalDuration = data.pulses.reduce((sum, p) => sum + p.duration, 0)

    const drawTiming = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = 'oklch(0.68 0.18 45)'
      ctx.fillStyle = 'oklch(0.68 0.18 45 / 0.3)'
      ctx.lineWidth = 2

      let currentX = padding
      const availableWidth = width - padding * 2

      data.pulses.forEach((pulse, index) => {
        const pulseWidth = (pulse.duration / totalDuration) * availableWidth
        const currentProgress = progressRef.current * data.pulses.length

        if (pulse.type === 'data' || pulse.type === 'agc') {
          ctx.beginPath()
          ctx.rect(currentX, padding, pulseWidth, graphHeight)
          
          if (index < currentProgress) {
            ctx.fill()
          }
          ctx.stroke()

          if (pulse.label) {
            ctx.fillStyle = 'oklch(0.65 0.19 145)'
            ctx.font = '9px JetBrains Mono'
            ctx.textAlign = 'center'
            ctx.fillText(pulse.label, currentX + pulseWidth / 2, padding - 5)
          }
        } else {
          ctx.strokeStyle = 'oklch(0.65 0.19 145 / 0.3)'
          ctx.beginPath()
          ctx.moveTo(currentX, padding + graphHeight)
          ctx.lineTo(currentX + pulseWidth, padding + graphHeight)
          ctx.stroke()
          ctx.strokeStyle = 'oklch(0.68 0.18 45)'
        }

        ctx.fillStyle = 'oklch(0.65 0.19 145 / 0.5)'
        ctx.font = '8px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(`${pulse.duration}µs`, currentX + pulseWidth / 2, height - 5)

        currentX += pulseWidth
      })

      progressRef.current = (progressRef.current + 0.01) % 1
      animationFrameRef.current = requestAnimationFrame(drawTiming)
    }

    drawTiming()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [protocol])

  return (
    <div className={className}>
      <div className="text-xs text-foreground/60 font-mono mb-2">{data.name}</div>
      <div className="border border-border rounded bg-card/30 p-2">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '80px' }}
        />
      </div>
      <div className="text-[0.6rem] text-foreground/50 mt-1 text-center font-mono">
        Pulse timing diagram (microseconds)
      </div>
    </div>
  )
}
