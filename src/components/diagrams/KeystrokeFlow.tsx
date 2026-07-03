import { useEffect, useRef } from 'react'

interface KeystrokeFlowProps {
  steps?: string[]
  currentStep?: number
  className?: string
}

export function KeystrokeFlow({ steps = [], currentStep = -1, className = '' }: KeystrokeFlowProps) {
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

    const w = rect.width
    const h = rect.height

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      phaseRef.current += 0.04

      if (steps.length === 0) {
        // Idle state — show USB connection animation
        const cx = w / 2
        const cy = h / 2

        // USB plug shape
        const plugW = 28
        const plugH = 18
        ctx.strokeStyle = 'rgba(239, 108, 34, 0.5)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(cx - plugW / 2, cy - plugH / 2, plugW, plugH, 3)
        ctx.stroke()

        // USB prongs
        ctx.fillStyle = 'rgba(239, 108, 34, 0.6)'
        ctx.fillRect(cx - 6, cy - 3, 3, 6)
        ctx.fillRect(cx + 3, cy - 3, 3, 6)

        // Connection line
        const pulse = Math.sin(phaseRef.current) * 0.4 + 0.6
        ctx.strokeStyle = `rgba(239, 108, 34, ${pulse * 0.4})`
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(cx + plugW / 2 + 4, cy)
        ctx.lineTo(w - 10, cy)
        ctx.stroke()
        ctx.setLineDash([])

        // Target computer
        ctx.strokeStyle = `rgba(37, 171, 58, ${pulse * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(w - 34, cy - 10, 24, 16, 2)
        ctx.stroke()
        // Screen
        ctx.fillStyle = `rgba(37, 171, 58, ${pulse * 0.15})`
        ctx.fillRect(w - 32, cy - 8, 20, 12)

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.font = '8px JetBrains Mono, monospace'
        ctx.textAlign = 'center'
        ctx.fillText('HID EMULATION', cx, cy + plugH / 2 + 12)

        animationFrameRef.current = requestAnimationFrame(draw)
        return
      }

      // Active state — show keystroke packets flowing
      const nodeCount = Math.min(steps.length, 6)
      const nodeW = Math.max(20, (w - 20) / nodeCount - 4)
      const nodeH = 16
      const startX = 10
      const cy = h / 2 - 4

      for (let i = 0; i < nodeCount; i++) {
        const x = startX + i * (nodeW + 4)
        const isDone = i < currentStep
        const isActive = i === currentStep

        // Connection line to next
        if (i < nodeCount - 1) {
          const nextX = startX + (i + 1) * (nodeW + 4)
          if (isDone) {
            ctx.strokeStyle = 'rgba(37, 171, 58, 0.5)'
          } else if (isActive) {
            const pulse = Math.sin(phaseRef.current * 3) * 0.3 + 0.5
            ctx.strokeStyle = `rgba(239, 108, 34, ${pulse})`
            // Animated packet
            const packetX = x + nodeW + (nextX - x - nodeW) * ((Math.sin(phaseRef.current * 2) + 1) / 2)
            ctx.fillStyle = `rgba(239, 108, 34, ${pulse})`
            ctx.beginPath()
            ctx.arc(packetX, cy + nodeH / 2, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
          }
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x + nodeW, cy + nodeH / 2)
          ctx.lineTo(nextX, cy + nodeH / 2)
          ctx.stroke()
        }

        // Node box
        if (isDone) {
          ctx.fillStyle = 'rgba(37, 171, 58, 0.15)'
          ctx.strokeStyle = 'rgba(37, 171, 58, 0.5)'
        } else if (isActive) {
          const glow = Math.sin(phaseRef.current * 2) * 0.15 + 0.25
          ctx.fillStyle = `rgba(239, 108, 34, ${glow})`
          ctx.strokeStyle = 'rgba(239, 108, 34, 0.8)'
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        }
        ctx.lineWidth = isActive ? 1.5 : 1
        ctx.beginPath()
        ctx.roundRect(x, cy, nodeW, nodeH, 3)
        ctx.fill()
        ctx.stroke()

        // Step label
        ctx.fillStyle = isDone
          ? 'rgba(37, 171, 58, 0.8)'
          : isActive
          ? 'rgba(239, 108, 34, 0.9)'
          : 'rgba(255, 255, 255, 0.25)'
        ctx.font = `${Math.max(7, Math.min(8, nodeW * 0.35))}px JetBrains Mono, monospace'`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${i + 1}`, x + nodeW / 2, cy + nodeH / 2)
      }

      // Status bar
      const barY = cy + nodeH + 10
      const progress = currentStep >= 0 ? Math.min((currentStep + 1) / steps.length, 1) : 0
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.roundRect(startX, barY, w - 20, 4, 2)
      ctx.fill()

      if (progress > 0) {
        ctx.fillStyle = progress >= 1 ? 'rgba(37, 171, 58, 0.6)' : 'rgba(239, 108, 34, 0.6)'
        ctx.beginPath()
        ctx.roundRect(startX, barY, (w - 20) * progress, 4, 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [steps, currentStep])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-[60px] ${className}`}
    />
  )
}
