import { useEffect, useRef } from 'react'

interface Device {
  name: string
  mac: string
  rssi: number
}

interface BluetoothTopologyProps {
  devices: Device[]
  className?: string
}

export function BluetoothTopology({ devices, className = '' }: BluetoothTopologyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
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

    const width = rect.width
    const height = rect.height

    const centerX = width / 2
    const centerY = height / 2
    const centerRadius = 15

    const drawTopology = () => {
      ctx.clearRect(0, 0, width, height)

      pulseRef.current = (pulseRef.current + 0.02) % (Math.PI * 2)
      const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5

      ctx.fillStyle = 'oklch(0.68 0.18 45 / 0.8)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `oklch(0.68 0.18 45 / ${0.2 + pulse * 0.3})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, centerRadius + 10 + pulse * 5, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = `oklch(0.68 0.18 45 / ${0.1 + pulse * 0.2})`
      ctx.beginPath()
      ctx.arc(centerX, centerY, centerRadius + 20 + pulse * 10, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = 'oklch(0.15 0 0)'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('FZ', centerX, centerY)

      const angleStep = (Math.PI * 2) / Math.max(devices.length, 1)
      const radius = Math.min(width, height) * 0.35

      devices.forEach((device, i) => {
        const angle = angleStep * i - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        const strength = Math.max(0, 1 + device.rssi / 100)
        
        ctx.strokeStyle = `oklch(0.65 0.19 145 / ${0.2 + pulse * 0.1})`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.setLineDash([])

        const deviceRadius = 8
        ctx.fillStyle = `oklch(0.65 0.19 145 / ${0.6 + strength * 0.4})`
        ctx.beginPath()
        ctx.arc(x, y, deviceRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = `oklch(0.65 0.19 145 / ${0.3 + pulse * 0.2})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, deviceRadius + 4 + pulse * 2, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = 'oklch(0.65 0.19 145)'
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        const shortName = device.name.length > 8 ? device.name.substring(0, 8) + '...' : device.name
        ctx.fillText(shortName, x, y + deviceRadius + 6)
      })

      animationFrameRef.current = requestAnimationFrame(drawTopology)
    }

    drawTopology()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [devices])

  return (
    <div className={className}>
      <div className="border border-border rounded bg-card/30 p-3">
        <div className="text-xs text-foreground/60 mb-2 font-mono">NETWORK TOPOLOGY</div>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '150px' }}
        />
      </div>
    </div>
  )
}
