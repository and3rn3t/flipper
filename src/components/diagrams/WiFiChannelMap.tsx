import { useEffect, useRef } from 'react'

interface Network {
  ssid: string
  channel: number
  signal: number
  band: '2.4GHz' | '5GHz'
}

interface WiFiChannelMapProps {
  networks: Network[]
  className?: string
}

export function WiFiChannelMap({ networks, className = '' }: WiFiChannelMapProps) {
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      pulseRef.current = (pulseRef.current + 0.03) % (Math.PI * 2)
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7

      const channels24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      const channels5 = [36, 40, 44, 48, 149, 153, 157, 161]
      
      const halfHeight = height / 2
      const channelWidth24 = width / channels24.length
      const channelWidth5 = width / channels5.length

      ctx.fillStyle = 'oklch(0.65 0.19 145 / 0.1)'
      ctx.fillRect(0, 0, width, halfHeight)
      ctx.fillRect(0, halfHeight, width, halfHeight)

      ctx.strokeStyle = 'oklch(0.65 0.19 145 / 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, halfHeight)
      ctx.lineTo(width, halfHeight)
      ctx.stroke()

      ctx.fillStyle = 'oklch(0.65 0.19 145 / 0.6)'
      ctx.font = '9px "JetBrains Mono", monospace'
      ctx.textAlign = 'left'
      ctx.fillText('2.4 GHz', 5, 12)
      ctx.fillText('5 GHz', 5, halfHeight + 12)

      const networks24 = networks.filter(n => n.band === '2.4GHz')
      const networks5 = networks.filter(n => n.band === '5GHz')

      networks24.forEach(network => {
        const channelIndex = channels24.indexOf(network.channel)
        if (channelIndex === -1) return
        
        const x = channelIndex * channelWidth24 + channelWidth24 / 2
        const strength = Math.min(1, (network.signal + 90) / 50)
        const barHeight = strength * (halfHeight - 30)
        
        const gradient = ctx.createLinearGradient(x, halfHeight - 10, x, halfHeight - 10 - barHeight)
        gradient.addColorStop(0, `oklch(0.68 0.18 45 / ${0.3 * pulse})`)
        gradient.addColorStop(1, `oklch(0.68 0.18 45 / ${0.8 * pulse})`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x - 3, halfHeight - 10 - barHeight, 6, barHeight)
        
        ctx.fillStyle = 'oklch(0.68 0.18 45)'
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(network.channel.toString(), x, halfHeight - 12 - barHeight)
      })

      networks5.forEach(network => {
        const channelIndex = channels5.indexOf(network.channel)
        if (channelIndex === -1) return
        
        const x = channelIndex * channelWidth5 + channelWidth5 / 2
        const strength = Math.min(1, (network.signal + 90) / 50)
        const barHeight = strength * (halfHeight - 30)
        
        const gradient = ctx.createLinearGradient(x, height - 10, x, height - 10 - barHeight)
        gradient.addColorStop(0, `oklch(0.68 0.18 45 / ${0.3 * pulse})`)
        gradient.addColorStop(1, `oklch(0.68 0.18 45 / ${0.8 * pulse})`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x - 3, height - 10 - barHeight, 6, barHeight)
        
        ctx.fillStyle = 'oklch(0.68 0.18 45)'
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(network.channel.toString(), x, height - 12 - barHeight)
      })

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [networks])

  return (
    <div className={className}>
      <div className="border border-border rounded bg-card/30 p-3">
        <div className="text-xs text-foreground/60 mb-2 font-mono">CHANNEL UTILIZATION</div>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '140px' }}
        />
      </div>
    </div>
  )
}
