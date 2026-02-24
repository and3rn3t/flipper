import { useEffect, useRef } from 'react'

interface GPIOPinoutProps {
  activePins?: number[]
  className?: string
}

export function GPIOPinout({ activePins = [], className = '' }: GPIOPinoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const pulseRef = useRef(0)

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

    const w = rect.width
    const h = rect.height

    const pinLabels = [
      ['3V3', 'GND', 'PA7', 'PA6', 'PA4', 'PB3', 'PB2', 'PC3', 'PA14'],
      ['PA13', 'TX', 'RX', 'PC1', 'PC0', '5V', 'GND', 'iBTN', 'GND'],
    ]
    const pinTypes = [
      ['pwr', 'gnd', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio'],
      ['gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'pwr', 'gnd', 'gpio', 'gnd'],
    ]

    // Map pin index (1-18) to row/col
    const pinIndex = (row: number, col: number) => row * 9 + col + 1

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pulseRef.current += 0.03

      const padX = 8
      const padY = 4
      const colW = (w - padX * 2) / 9
      const rowH = (h - padY * 2 - 14) / 2
      const pinR = Math.min(colW, rowH) * 0.28
      const startY = padY + 12

      // Board outline
      ctx.strokeStyle = 'rgba(37, 171, 58, 0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(2, 2, w - 4, h - 4, 6)
      ctx.stroke()

      // Title
      ctx.fillStyle = 'rgba(37, 171, 58, 0.5)'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GPIO HEADER', w / 2, padY + 8)

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 9; col++) {
          const x = padX + col * colW + colW / 2
          const y = startY + row * rowH + rowH / 2 + 4
          const id = pinIndex(row, col)
          const type = pinTypes[row][col]
          const label = pinLabels[row][col]
          const isActive = activePins.includes(id)

          // Pin circle
          const pulse = Math.sin(pulseRef.current + id * 0.3) * 0.15 + 0.85
          if (type === 'pwr') {
            ctx.fillStyle = isActive ? `rgba(250, 180, 50, ${0.8 * pulse})` : 'rgba(250, 180, 50, 0.4)'
          } else if (type === 'gnd') {
            ctx.fillStyle = isActive ? `rgba(100, 150, 255, ${0.7 * pulse})` : 'rgba(100, 150, 255, 0.35)'
          } else {
            ctx.fillStyle = isActive ? `rgba(37, 171, 58, ${0.9 * pulse})` : 'rgba(37, 171, 58, 0.25)'
          }

          ctx.beginPath()
          ctx.arc(x, y, pinR, 0, Math.PI * 2)
          ctx.fill()

          // Glow ring on active
          if (isActive) {
            const glow = Math.sin(pulseRef.current * 2 + id) * 0.3 + 0.5
            ctx.strokeStyle = type === 'pwr'
              ? `rgba(250, 180, 50, ${glow})`
              : type === 'gnd'
              ? `rgba(100, 150, 255, ${glow})`
              : `rgba(37, 171, 58, ${glow})`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(x, y, pinR + 3, 0, Math.PI * 2)
            ctx.stroke()
          }

          // Pin inner dot
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
          ctx.beginPath()
          ctx.arc(x, y, pinR * 0.35, 0, Math.PI * 2)
          ctx.fill()

          // Label
          ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'
          ctx.font = `${Math.max(7, Math.min(9, colW * 0.4))}px JetBrains Mono, monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, x, y + pinR + 9)
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [activePins])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-[90px] ${className}`}
    />
  )
}
