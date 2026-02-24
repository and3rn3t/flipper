import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface SignalWaveformProps {
  type: 'amplitude' | 'frequency' | 'digital' | 'pulse'
  animated?: boolean
  color?: string
  className?: string
}

export function SignalWaveform({ type, animated = true, color = 'oklch(0.68 0.18 45)', className = '' }: SignalWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const phaseRef = useRef(0)

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
    const centerY = height / 2

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      const points = 200
      
      for (let i = 0; i < points; i++) {
        const x = (i / points) * width
        const normalizedX = (i / points) * Math.PI * 4
        let y = centerY

        switch (type) {
          case 'amplitude':
            y = centerY + Math.sin(normalizedX + phaseRef.current) * (height * 0.35) * 
                (0.5 + 0.5 * Math.sin(normalizedX * 0.3))
            break
          
          case 'frequency':
            y = centerY + Math.sin(normalizedX * (1 + 0.5 * Math.sin(normalizedX * 0.2 + phaseRef.current))) * (height * 0.35)
            break
          
          case 'digital': {
            const segmentWidth = width / 16
            const segment = Math.floor(i / (points / 16))
            const pattern = [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1]
            const offset = Math.floor(phaseRef.current / 0.5) % pattern.length
            y = centerY + (pattern[(segment + offset) % pattern.length] ? -height * 0.3 : height * 0.3)
            break
          }
          
          case 'pulse': {
            const pulseWidth = 0.1
            const pulsePeriod = Math.PI * 0.5
            const mod = (normalizedX + phaseRef.current) % pulsePeriod
            y = centerY + (mod < pulseWidth ? -height * 0.35 : height * 0.35)
            break
          }
        }

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      if (animated) {
        phaseRef.current += 0.05
        animationFrameRef.current = requestAnimationFrame(drawWaveform)
      }
    }

    drawWaveform()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [type, animated, color])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
