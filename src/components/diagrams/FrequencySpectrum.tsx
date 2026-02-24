import { useEffect, useRef } from 'react'

interface FrequencySpectrumProps {
  activeFrequencies?: number[]
  minFreq?: number
  maxFreq?: number
  className?: string
}

export function FrequencySpectrum({ 
  activeFrequencies = [], 
  minFreq = 300, 
  maxFreq = 928,
  className = '' 
}: FrequencySpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const noiseRef = useRef<number[]>([])

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
    const bars = 100

    if (noiseRef.current.length === 0) {
      noiseRef.current = Array.from({ length: bars }, () => Math.random() * 0.2)
    }

    const drawSpectrum = () => {
      ctx.clearRect(0, 0, width, height)

      const barWidth = width / bars
      const freqRange = maxFreq - minFreq

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth
        const freq = minFreq + (i / bars) * freqRange

        let barHeight = noiseRef.current[i] * height
        noiseRef.current[i] = Math.max(0.05, noiseRef.current[i] * 0.95 + Math.random() * 0.05)

        activeFrequencies.forEach(activeFreq => {
          const distance = Math.abs(freq - activeFreq)
          if (distance < 10) {
            const strength = 1 - (distance / 10)
            barHeight = Math.max(barHeight, strength * height * 0.8)
            noiseRef.current[i] = Math.max(noiseRef.current[i], strength * 0.8)
          }
        })

        const gradient = ctx.createLinearGradient(x, height, x, height - barHeight)
        gradient.addColorStop(0, 'oklch(0.68 0.18 45 / 0.3)')
        gradient.addColorStop(0.5, 'oklch(0.68 0.18 45 / 0.6)')
        gradient.addColorStop(1, 'oklch(0.68 0.18 45)')

        ctx.fillStyle = gradient
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)
      }

      ctx.strokeStyle = 'oklch(0.65 0.19 145 / 0.3)'
      ctx.lineWidth = 1
      const midY = height / 2
      ctx.beginPath()
      ctx.moveTo(0, midY)
      ctx.lineTo(width, midY)
      ctx.stroke()

      animationFrameRef.current = requestAnimationFrame(drawSpectrum)
    }

    drawSpectrum()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeFrequencies, minFreq, maxFreq])

  return (
    <div className={className}>
      <div className="border border-border rounded bg-card/30 p-2">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100px' }}
        />
        <div className="flex justify-between text-[0.6rem] text-foreground/40 font-mono mt-1">
          <span>{minFreq} MHz</span>
          <span>{maxFreq} MHz</span>
        </div>
      </div>
    </div>
  )
}
