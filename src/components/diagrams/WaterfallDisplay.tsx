import { useEffect, useRef } from 'react'

interface WaterfallDisplayProps {
  minFreq: number
  maxFreq: number
  isRunning: boolean
  peakFrequency?: number | null
  className?: string
}

export function WaterfallDisplay({ 
  minFreq, 
  maxFreq, 
  isRunning, 
  peakFrequency,
  className = '' 
}: WaterfallDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const dataBufferRef = useRef<ImageData | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const numBins = Math.floor(width)

    if (!dataBufferRef.current || dataBufferRef.current.width !== numBins) {
      dataBufferRef.current = ctx.createImageData(numBins, height)
    }

    const generateSpectrumLine = (): number[] => {
      const line: number[] = []
      const freqRange = maxFreq - minFreq
      
      for (let i = 0; i < numBins; i++) {
        const freq = minFreq + (i / numBins) * freqRange
        
        let intensity = Math.random() * 20
        
        if (peakFrequency) {
          const distance = Math.abs(freq - peakFrequency)
          const bandwidth = freqRange * 0.02
          if (distance < bandwidth) {
            intensity += 80 * Math.exp(-(distance * distance) / (bandwidth * bandwidth / 2))
          }
        }
        
        const noise = Math.sin(timeRef.current * 0.1 + i * 0.05) * 5 + 
                     Math.sin(timeRef.current * 0.05 + i * 0.1) * 3
        intensity += noise
        
        if (Math.random() > 0.98) {
          intensity += Math.random() * 40
        }
        
        line.push(Math.max(0, Math.min(100, intensity)))
      }
      
      return line
    }

    const intensityToColor = (intensity: number): [number, number, number] => {
      const normalized = intensity / 100
      
      if (normalized < 0.25) {
        const t = normalized / 0.25
        return [
          Math.floor(10 + t * 10),
          Math.floor(10 + t * 10),
          Math.floor(20 + t * 30)
        ]
      } else if (normalized < 0.5) {
        const t = (normalized - 0.25) / 0.25
        return [
          Math.floor(20 + t * 20),
          Math.floor(10 + t * 80),
          Math.floor(50 + t * 50)
        ]
      } else if (normalized < 0.75) {
        const t = (normalized - 0.5) / 0.25
        return [
          Math.floor(40 + t * 120),
          Math.floor(90 + t * 90),
          Math.floor(100 - t * 80)
        ]
      } else {
        const t = (normalized - 0.75) / 0.25
        return [
          Math.floor(160 + t * 95),
          Math.floor(180 - t * 30),
          Math.floor(20 + t * 10)
        ]
      }
    }

    const animate = () => {
      if (!isRunning) return

      timeRef.current += 1

      const buffer = dataBufferRef.current
      if (!buffer) return

      const spectrumLine = generateSpectrumLine()
      
      const tempData = new Uint8ClampedArray(buffer.data)
      
      for (let y = height - 1; y > 0; y--) {
        for (let x = 0; x < numBins; x++) {
          const srcIndex = ((y - 1) * numBins + x) * 4
          const dstIndex = (y * numBins + x) * 4
          
          tempData[dstIndex] = tempData[srcIndex]
          tempData[dstIndex + 1] = tempData[srcIndex + 1]
          tempData[dstIndex + 2] = tempData[srcIndex + 2]
          tempData[dstIndex + 3] = 255
        }
      }
      
      for (let x = 0; x < numBins; x++) {
        const intensity = spectrumLine[x]
        const [r, g, b] = intensityToColor(intensity)
        const index = x * 4
        
        tempData[index] = r
        tempData[index + 1] = g
        tempData[index + 2] = b
        tempData[index + 3] = 255
      }
      
      buffer.data.set(tempData)
      
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)
      
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = numBins
      tempCanvas.height = height
      const tempCtx = tempCanvas.getContext('2d')
      if (tempCtx) {
        tempCtx.putImageData(buffer, 0, 0)
        ctx.drawImage(tempCanvas, 0, 0, numBins, height, 0, 0, width, height)
      }
      
      ctx.strokeStyle = 'rgba(104, 179, 114, 0.2)'
      ctx.lineWidth = 1
      for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.fillStyle = 'rgba(104, 179, 114, 0.6)'
      ctx.textAlign = 'left'
      ctx.fillText(`${maxFreq} MHz`, 4, 10)
      ctx.fillText(`${minFreq} MHz`, 4, height - 4)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (isRunning) {
      animate()
    } else {
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, height)
      
      ctx.font = '12px JetBrains Mono, monospace'
      ctx.fillStyle = 'rgba(104, 179, 114, 0.4)'
      ctx.textAlign = 'center'
      ctx.fillText('PAUSED', width / 2, height / 2)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [minFreq, maxFreq, isRunning, peakFrequency])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '200px', display: 'block' }}
    />
  )
}
