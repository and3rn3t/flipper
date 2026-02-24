import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { WiFiChannelMap } from '@/components/diagrams/WiFiChannelMap'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'

interface WiFiScreenProps {
  onBack: () => void
}

interface WiFiNetwork {
  ssid: string
  bssid: string
  channel: number
  signal: number
  security: string
  band: '2.4GHz' | '5GHz'
}

export function WiFiScreen({ onBack }: WiFiScreenProps) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectedNetworks, setDetectedNetworks] = useState<WiFiNetwork[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null)

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false)
            return 100
          }
          return prev + 1.2
        })
        
        if (Math.random() > 0.88 && detectedNetworks.length < 8) {
          const ssids = ['Home_Network', 'Office_WiFi', 'CoffeeShop_5G', 'NetGear82', 'Linksys_2.4', 'TP-Link_Guest', 'ATT_WiFi', 'Xfinity']
          const securities = ['WPA2-PSK', 'WPA3', 'WPA2-Enterprise', 'Open', 'WEP']
          const band: '2.4GHz' | '5GHz' = Math.random() > 0.5 ? '2.4GHz' : '5GHz'
          const channels24 = [1, 6, 11]
          const channels5 = [36, 40, 44, 48, 149, 153, 157, 161]
          
          const newNetwork: WiFiNetwork = {
            ssid: ssids[Math.floor(Math.random() * ssids.length)],
            bssid: Array.from({ length: 6 }, () => 
              Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
            ).join(':'),
            channel: band === '2.4GHz' 
              ? channels24[Math.floor(Math.random() * channels24.length)]
              : channels5[Math.floor(Math.random() * channels5.length)],
            signal: -Math.floor(Math.random() * 60 + 30),
            security: securities[Math.floor(Math.random() * securities.length)],
            band
          }
          setDetectedNetworks((prev) => [...prev, newNetwork])
        }
      }, 70)
      
      return () => clearInterval(interval)
    }
  }, [scanning, detectedNetworks.length])

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    setDetectedNetworks([])
    setSelectedNetwork(null)
  }

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return { label: 'Excellent', bars: 4, color: 'text-primary' }
    if (signal > -60) return { label: 'Good', bars: 3, color: 'text-primary' }
    if (signal > -70) return { label: 'Fair', bars: 2, color: 'text-foreground/70' }
    return { label: 'Weak', bars: 1, color: 'text-foreground/50' }
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">WIFI ANALYZER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded border border-foreground/20 bg-background/50">
            <div className="text-xs text-foreground/50 mb-1">BANDS</div>
            <div className="text-sm text-primary">2.4 / 5 GHz</div>
          </div>
          <div className="p-3 rounded border border-foreground/20 bg-background/50">
            <div className="text-xs text-foreground/50 mb-1">STANDARD</div>
            <div className="text-sm text-primary">802.11ax</div>
          </div>
        </div>

        {!scanning && progress === 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={startScan}
            className="w-full p-4 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            START SCAN
          </motion.button>
        )}

        {(scanning || progress > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3 rounded border border-primary/50 bg-primary/5">
              <div className="text-xs text-foreground/50 mb-2">
                {scanning ? 'SCANNING...' : 'SCAN COMPLETE'}
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-primary mt-1">{progress.toFixed(0)}%</div>
            </div>

            {scanning && detectedNetworks.length > 0 && (
              <WiFiChannelMap networks={detectedNetworks} className="my-2" />
            )}

            {detectedNetworks.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-foreground/60">
                  DISCOVERED NETWORKS ({detectedNetworks.length}):
                </div>
                {detectedNetworks.map((network, idx) => {
                  const signal = getSignalStrength(network.signal)
                  const isSelected = selectedNetwork?.bssid === network.bssid
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2"
                    >
                      <div 
                        className={`p-3 rounded border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary/50 bg-primary/10' 
                            : 'border-primary/30 bg-primary/5 hover:border-primary/40'
                        }`}
                        onClick={() => setSelectedNetwork(isSelected ? null : network)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-primary font-semibold mb-1">
                              {network.ssid}
                            </div>
                            <div className="text-xs text-foreground/60 font-mono">
                              {network.bssid}
                            </div>
                          </div>
                          <div className="flex gap-1 items-center">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-colors ${
                                  i < signal.bars ? 'bg-primary' : 'bg-foreground/20'
                                }`}
                                style={{ height: `${(i + 1) * 3}px` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className={signal.color}>
                            {network.signal} dBm ({signal.label})
                          </span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                              Ch {network.channel}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-foreground/30">
                              {network.band}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="p-3 rounded border border-primary/20 bg-card/50">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-foreground/60">Security:</span>
                                <span className="ml-2 text-foreground">{network.security}</span>
                              </div>
                              <div>
                                <span className="text-foreground/60">Band:</span>
                                <span className="ml-2 text-foreground">{network.band}</span>
                              </div>
                              <div>
                                <span className="text-foreground/60">Channel:</span>
                                <span className="ml-2 text-foreground">{network.channel}</span>
                              </div>
                              <div>
                                <span className="text-foreground/60">BSSID:</span>
                                <span className="ml-2 text-foreground font-mono text-[0.65rem]">
                                  {network.bssid.substring(0, 11)}...
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <ProtocolDiagram
                            title="802.11 MAC Frame Structure"
                            fields={[
                              { label: 'Frame Control', bits: 16, value: '0x0008' },
                              { label: 'Duration', bits: 16, value: '0x002C' },
                              { label: 'Address 1', bits: 48, value: 'Destination' },
                              { label: 'Address 2', bits: 48, value: 'Source' },
                              { label: 'Address 3', bits: 48, value: 'BSSID' },
                              { label: 'Seq Control', bits: 16, value: '0x1234' },
                              { label: 'Payload', bits: 192, value: 'Variable' },
                              { label: 'FCS', bits: 32, value: '0xA1B2C3D4' },
                            ]}
                            totalBits={416}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            {!scanning && detectedNetworks.length === 0 && (
              <div className="p-4 rounded border border-foreground/20 bg-background/30 text-center">
                <div className="text-sm text-foreground/50">No networks found</div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Analyzes WiFi networks on 2.4GHz & 5GHz bands
        </div>
      </div>
    </div>
  )
}
