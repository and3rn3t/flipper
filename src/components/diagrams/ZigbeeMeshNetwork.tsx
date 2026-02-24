import { useEffect, useRef } from 'react'

interface Device {
  name: string
  address: string
  type: 'Coordinator' | 'Router' | 'End Device'
  lqi: number
}

interface ZigbeeMeshNetworkProps {
  devices: Device[]
  className?: string
}

export function ZigbeeMeshNetwork({ devices, className = '' }: ZigbeeMeshNetworkProps) {
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

    const width = rect.width
    const height = rect.height

    const centerX = width / 2
    const centerY = height / 2

    const drawMesh = () => {
      ctx.clearRect(0, 0, width, height)

      pulseRef.current = (pulseRef.current + 0.02) % (Math.PI * 2)
      const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5

      const coordinator = devices.find(d => d.type === 'Coordinator')
      const routers = devices.filter(d => d.type === 'Router')
      const endDevices = devices.filter(d => d.type === 'End Device')

      if (coordinator) {
        ctx.fillStyle = 'oklch(0.68 0.18 45)'
        ctx.beginPath()
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = `oklch(0.68 0.18 45 / ${0.3 + pulse * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, 20 + pulse * 8, 0, Math.PI * 2)
        ctx.stroke()

        ctx.strokeStyle = `oklch(0.68 0.18 45 / ${0.1 + pulse * 0.1})`
        ctx.beginPath()
        ctx.arc(centerX, centerY, 32 + pulse * 12, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = 'oklch(0.15 0 0)'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('C', centerX, centerY)
      }

      const routerRadius = Math.min(width, height) * 0.3
      const routerAngleStep = (Math.PI * 2) / Math.max(routers.length, 1)
      
      routers.forEach((router, i) => {
        const angle = routerAngleStep * i - Math.PI / 2
        const x = centerX + Math.cos(angle) * routerRadius
        const y = centerY + Math.sin(angle) * routerRadius

        ctx.strokeStyle = `oklch(0.65 0.19 145 / ${0.3 + pulse * 0.1})`
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = 'oklch(0.68 0.18 45 / 0.7)'
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = `oklch(0.68 0.18 45 / ${0.2 + pulse * 0.15})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, 16 + pulse * 4, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = 'oklch(0.15 0 0)'
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('R', x, y)
      })

      const endDeviceRadius = Math.min(width, height) * 0.45
      const endDeviceAngleStep = (Math.PI * 2) / Math.max(endDevices.length, 1)
      
      endDevices.forEach((device, i) => {
        const angle = endDeviceAngleStep * i - Math.PI / 4
        const x = centerX + Math.cos(angle) * endDeviceRadius
        const y = centerY + Math.sin(angle) * endDeviceRadius

        let connectX = centerX
        let connectY = centerY

        if (routers.length > 0) {
          const nearestRouter = routers[i % routers.length]
          const routerIndex = routers.indexOf(nearestRouter)
          const routerAngle = routerAngleStep * routerIndex - Math.PI / 2
          connectX = centerX + Math.cos(routerAngle) * routerRadius
          connectY = centerY + Math.sin(routerAngle) * routerRadius
        }

        ctx.strokeStyle = `oklch(0.65 0.19 145 / ${0.2 + pulse * 0.05})`
        ctx.lineWidth = 1
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(connectX, connectY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = 'oklch(0.65 0.19 145 / 0.5)'
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'oklch(0.15 0 0)'
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('E', x, y)
      })

      animationFrameRef.current = requestAnimationFrame(drawMesh)
    }

    drawMesh()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [devices])

  return (
    <div className={className}>
      <div className="border border-border rounded bg-card/30 p-3">
        <div className="text-xs text-foreground/60 mb-2 font-mono">MESH TOPOLOGY</div>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '160px' }}
        />
        <div className="flex justify-center gap-4 mt-2 text-[0.65rem] text-foreground/50 font-mono">
          <span><span className="text-primary">C</span>=Coordinator</span>
          <span><span className="text-primary">R</span>=Router</span>
          <span><span className="text-foreground/60">E</span>=End Device</span>
        </div>
      </div>
    </div>
  )
}
