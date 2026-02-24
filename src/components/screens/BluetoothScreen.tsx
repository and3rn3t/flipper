import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BluetoothTopology } from '@/components/diagrams/BluetoothTopology'
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram'

interface BluetoothScreenProps {
  onBack: () => void
}

interface BluetoothDevice {
  name: string
  mac: string
  rssi: number
  type: 'BLE' | 'Classic'
  services: string[]
}

export function BluetoothScreen({ onBack }: BluetoothScreenProps) {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectedDevices, setDetectedDevices] = useState<BluetoothDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null)

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false)
            return 100
          }
          return prev + 1.5
        })
        
        if (Math.random() > 0.92 && detectedDevices.length < 5) {
          const deviceNames = ['iPhone 14', 'Galaxy Buds', 'MacBook Pro', 'Fitbit Charge', 'Smart Watch', 'BLE Beacon']
          const serviceTypes = [
            ['Heart Rate', 'Battery'],
            ['Audio', 'AVRCP'],
            ['File Transfer', 'Object Push'],
            ['Health', 'Device Info'],
            ['iBeacon', 'Eddystone']
          ]
          
          const name = deviceNames[Math.floor(Math.random() * deviceNames.length)]
          const type: 'BLE' | 'Classic' = Math.random() > 0.5 ? 'BLE' : 'Classic'
          
          const newDevice: BluetoothDevice = {
            name,
            mac: Array.from({ length: 6 }, () => 
              Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
            ).join(':'),
            rssi: -Math.floor(Math.random() * 60 + 30),
            type,
            services: serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
          }
          setDetectedDevices((prev) => [...prev, newDevice])
        }
      }, 80)
      
      return () => clearInterval(interval)
    }
  }, [scanning, detectedDevices.length])

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    setDetectedDevices([])
    setSelectedDevice(null)
  }

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { label: 'Excellent', color: 'text-primary' }
    if (rssi > -65) return { label: 'Good', color: 'text-primary' }
    if (rssi > -75) return { label: 'Fair', color: 'text-foreground/70' }
    return { label: 'Weak', color: 'text-foreground/50' }
  }

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">BLUETOOTH SCANNER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded border border-foreground/20 bg-background/50">
            <div className="text-xs text-foreground/50 mb-1">PROTOCOL</div>
            <div className="text-sm text-primary">Bluetooth 5.0</div>
          </div>
          <div className="p-3 rounded border border-foreground/20 bg-background/50">
            <div className="text-xs text-foreground/50 mb-1">FREQUENCY</div>
            <div className="text-sm text-primary">2.4 GHz</div>
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

            {scanning && detectedDevices.length > 0 && (
              <BluetoothTopology devices={detectedDevices} className="my-2" />
            )}

            {detectedDevices.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-foreground/60">
                  DISCOVERED DEVICES ({detectedDevices.length}):
                </div>
                {detectedDevices.map((device, idx) => {
                  const signal = getSignalStrength(device.rssi)
                  const isSelected = selectedDevice?.mac === device.mac
                  
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
                        onClick={() => setSelectedDevice(isSelected ? null : device)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm text-primary font-semibold mb-1">
                              {device.name}
                            </div>
                            <div className="text-xs text-foreground/60 font-mono">
                              {device.mac}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                            {device.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={signal.color}>
                            RSSI: {device.rssi} dBm ({signal.label})
                          </span>
                          <span className="text-foreground/40">
                            {device.services.length} services
                          </span>
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
                            <div className="text-xs text-foreground/60 mb-2">SERVICES:</div>
                            <div className="flex flex-wrap gap-1">
                              {device.services.map((service, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <ProtocolDiagram
                            title="Bluetooth LE Packet Structure"
                            fields={[
                              { label: 'Preamble', bits: 8, value: '0xAA' },
                              { label: 'Access Address', bits: 32, value: '0x8E89BED6' },
                              { label: 'PDU Header', bits: 16, value: '0x0C12' },
                              { label: 'Payload', bits: 240, value: 'Variable' },
                              { label: 'CRC', bits: 24, value: '0xA3F1C2' },
                            ]}
                            totalBits={320}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            {!scanning && detectedDevices.length === 0 && (
              <div className="p-4 rounded border border-foreground/20 bg-background/30 text-center">
                <div className="text-sm text-foreground/50">No devices found</div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Scans for Bluetooth Classic & BLE devices
        </div>
      </div>
    </div>
  )
}
