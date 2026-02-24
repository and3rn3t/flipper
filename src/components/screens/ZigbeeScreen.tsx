import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowsClockwise, FloppyDisk, Trash, Graph } from '@phosphor-icons/react';
import { ZigbeeMeshNetwork } from '@/components/diagrams/ZigbeeMeshNetwork';
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram';
import { useLocalKV } from '@/hooks/use-local-kv';

interface ZigbeeScreenProps {
  onBack: () => void;
}

interface ZigbeeDevice {
  name: string;
  address: string;
  type: 'Coordinator' | 'Router' | 'End Device';
  channel: number;
  lqi: number;
  panId: string;
}

type Tab = 'scan' | 'saved';

export function ZigbeeScreen({ onBack }: ZigbeeScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedDevices, setDetectedDevices] = useState<ZigbeeDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<ZigbeeDevice | null>(null);
  const [savedDevices, setSavedDevices] = useLocalKV<ZigbeeDevice[]>('zigbee-saved', []);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false);
            return 100;
          }
          return prev + 1.3;
        });

        if (Math.random() > 0.9 && detectedDevices.length < 6) {
          const deviceNames = [
            'Smart Bulb',
            'Motion Sensor',
            'Door Lock',
            'Thermostat',
            'Smart Plug',
            'Light Switch',
          ];
          const deviceTypes: Array<'Coordinator' | 'Router' | 'End Device'> = [
            'Coordinator',
            'Router',
            'End Device',
          ];
          const channels = [11, 15, 20, 25, 26];

          const type =
            detectedDevices.length === 0
              ? 'Coordinator'
              : deviceTypes[Math.floor(Math.random() * 3)];

          const newDevice: ZigbeeDevice = {
            name: deviceNames[Math.floor(Math.random() * deviceNames.length)],
            address:
              '0x' +
              Array.from({ length: 4 }, () =>
                Math.floor(Math.random() * 65536)
                  .toString(16)
                  .padStart(4, '0')
                  .toUpperCase()
              ).join(''),
            type,
            channel: channels[Math.floor(Math.random() * channels.length)],
            lqi: Math.floor(Math.random() * 155 + 100),
            panId:
              '0x' +
              Math.floor(Math.random() * 65536)
                .toString(16)
                .padStart(4, '0')
                .toUpperCase(),
          };
          setDetectedDevices((prev) => [...prev, newDevice]);
        }
      }, 75);

      return () => clearInterval(interval);
    }
  }, [scanning, detectedDevices.length]);

  const startScan = useCallback(() => {
    setScanning(true);
    setProgress(0);
    setDetectedDevices([]);
    setSelectedDevice(null);
  }, []);

  const saveDevice = useCallback(
    (device: ZigbeeDevice) => {
      setSavedDevices((current = []) => {
        if (current.some((d) => d.address === device.address)) return current;
        return [...current, device];
      });
    },
    [setSavedDevices]
  );

  const removeDevice = useCallback(
    (address: string) => {
      setSavedDevices((current = []) => current.filter((d) => d.address !== address));
    },
    [setSavedDevices]
  );

  const getLQIQuality = (lqi: number) => {
    if (lqi > 200) return { label: 'Excellent', color: 'text-primary' };
    if (lqi > 150) return { label: 'Good', color: 'text-primary' };
    if (lqi > 100) return { label: 'Fair', color: 'text-foreground/70' };
    return { label: 'Poor', color: 'text-foreground/50' };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Coordinator':
        return 'border-primary text-primary';
      case 'Router':
        return 'border-accent text-accent';
      case 'End Device':
        return 'border-foreground/50 text-foreground/70';
      default:
        return 'border-foreground/30';
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scan', label: 'SCAN' },
    { id: 'saved', label: `SAVED (${(savedDevices ?? []).length})` },
  ]

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">ZIGBEE SCANNER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">[BACK]</button>
      </div>

      <div className="flex gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-[10px] font-semibold rounded border transition-colors ${
              activeTab === tab.id
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-foreground/20 text-foreground/50 hover:border-primary/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'scan' && (
            <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded border border-foreground/20 bg-background/50">
                  <div className="text-xs text-foreground/50 mb-1">PROTOCOL</div>
                  <div className="text-sm text-primary">IEEE 802.15.4</div>
                </div>
                <div className="p-3 rounded border border-foreground/20 bg-background/50">
                  <div className="text-xs text-foreground/50 mb-1">FREQUENCY</div>
                  <div className="text-sm text-primary">2.4 GHz</div>
                </div>
              </div>

              {!scanning && progress === 0 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={startScan}
                  className="w-full p-4 rounded border-2 border-primary bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                >
                  START SCAN
                </motion.button>
              )}

              {(scanning || progress > 0) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-3 rounded border border-primary/50 bg-primary/5">
                    <div className="text-xs text-foreground/50 mb-2">{scanning ? 'SCANNING...' : 'SCAN COMPLETE'}</div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-primary mt-1">{progress.toFixed(0)}%</div>
                  </div>

                  {scanning && detectedDevices.length > 0 && (
                    <ZigbeeMeshNetwork devices={detectedDevices} className="my-2" />
                  )}

                  {detectedDevices.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-foreground/60">DISCOVERED ({detectedDevices.length}):</div>
                      {detectedDevices.map((device, idx) => {
                        const quality = getLQIQuality(device.lqi)
                        const isSaved = (savedDevices ?? []).some((d) => d.address === device.address)
                        const isSelected = selectedDevice?.address === device.address
                        return (
                          <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                            <div
                              className={`p-3 rounded border cursor-pointer transition-all ${
                                isSelected ? 'border-primary/50 bg-primary/10' : 'border-primary/30 bg-primary/5 hover:border-primary/40'
                              }`}
                              onClick={() => setSelectedDevice(isSelected ? null : device)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="text-sm text-primary font-semibold mb-1">{device.name}</div>
                                  <div className="text-xs text-foreground/60 font-mono">{device.address}</div>
                                </div>
                                <Badge variant="outline" className={`text-xs ${getTypeColor(device.type)}`}>{device.type}</Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                                <span className={quality.color}>LQI: {device.lqi} ({quality.label})</span>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs border-primary/50 text-primary">Ch {device.channel}</Badge>
                                  {!isSaved && (
                                    <button onClick={(e) => { e.stopPropagation(); saveDevice(device) }} className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5">
                                      <FloppyDisk weight="bold" className="w-3 h-3" /> SAVE
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                                <div className="p-3 rounded border border-primary/20 bg-card/50">
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div><span className="text-foreground/60">Type:</span> <span className="text-foreground">{device.type}</span></div>
                                    <div><span className="text-foreground/60">Channel:</span> <span className="text-foreground">{device.channel}</span></div>
                                    <div><span className="text-foreground/60">LQI:</span> <span className="text-foreground">{device.lqi}</span></div>
                                    <div><span className="text-foreground/60">PAN ID:</span> <span className="text-foreground font-mono">{device.panId}</span></div>
                                  </div>
                                </div>
                                <ProtocolDiagram
                                  title="Zigbee Frame Structure"
                                  fields={[
                                    { label: 'Preamble', bits: 32, value: '0x00000000' },
                                    { label: 'SFD', bits: 8, value: '0xA7' },
                                    { label: 'Frame Len', bits: 8, value: '0x15' },
                                    { label: 'Frame Ctrl', bits: 16, value: '0x8841' },
                                    { label: 'Seq #', bits: 8, value: '0x3C' },
                                    { label: 'PAN ID', bits: 16, value: device.panId },
                                    { label: 'Dest', bits: 16, value: '0xFFFF' },
                                    { label: 'Source', bits: 16, value: device.address.substring(0, 6) },
                                    { label: 'Payload', bits: 128, value: 'Variable' },
                                    { label: 'FCS', bits: 16, value: '0xE2C3' },
                                  ]}
                                  totalBits={264}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {!scanning && progress >= 100 && (
                    <button onClick={startScan} className="w-full p-2.5 rounded border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5">
                      <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" /> RESCAN
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {(savedDevices ?? []).length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <Graph weight="duotone" className="w-8 h-8 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No saved devices</div>
                  <div className="text-xs text-foreground/40 mt-1">Scan and save Zigbee devices to see them here</div>
                </div>
              ) : (
                (savedDevices ?? []).map((device, idx) => {
                  const quality = getLQIQuality(device.lqi)
                  return (
                    <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-primary font-semibold mb-1">{device.name}</div>
                          <div className="text-xs text-foreground/60 font-mono">{device.address}</div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(device.type)}`}>{device.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={quality.color}>LQI: {device.lqi} · Ch {device.channel}</span>
                        <button onClick={() => removeDevice(device.address)} className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-0.5">
                          <Trash weight="bold" className="w-3 h-3" /> DELETE
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Scans for Zigbee mesh network devices</div>
      </div>
    </div>
  )
}
