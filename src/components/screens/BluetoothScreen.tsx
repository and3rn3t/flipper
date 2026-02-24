import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowsClockwise, FloppyDisk, Trash, BluetoothConnected } from '@phosphor-icons/react';
import { BluetoothTopology } from '@/components/diagrams/BluetoothTopology';
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram';
import { useLocalKV } from '@/hooks/use-local-kv';

interface BluetoothScreenProps {
  onBack: () => void;
}

interface BluetoothDevice {
  name: string;
  mac: string;
  rssi: number;
  type: 'BLE' | 'Classic';
  services: string[];
}

type Tab = 'scan' | 'saved' | 'connect';

export function BluetoothScreen({ onBack }: BluetoothScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedDevices, setDetectedDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [savedDevices, setSavedDevices] = useLocalKV<BluetoothDevice[]>('bt-saved', []);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false);
            return 100;
          }
          return prev + 1.5;
        });

        if (Math.random() > 0.92 && detectedDevices.length < 5) {
          const deviceNames = [
            'iPhone 14',
            'Galaxy Buds',
            'MacBook Pro',
            'Fitbit Charge',
            'Smart Watch',
            'BLE Beacon',
          ];
          const serviceTypes = [
            ['Heart Rate', 'Battery'],
            ['Audio', 'AVRCP'],
            ['File Transfer', 'Object Push'],
            ['Health', 'Device Info'],
            ['iBeacon', 'Eddystone'],
          ];

          const name = deviceNames[Math.floor(Math.random() * deviceNames.length)];
          const type: 'BLE' | 'Classic' = Math.random() > 0.5 ? 'BLE' : 'Classic';

          const newDevice: BluetoothDevice = {
            name,
            mac: Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 256)
                .toString(16)
                .padStart(2, '0')
                .toUpperCase()
            ).join(':'),
            rssi: -Math.floor(Math.random() * 60 + 30),
            type,
            services: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
          };
          setDetectedDevices((prev) => [...prev, newDevice]);
        }
      }, 80);

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
    (device: BluetoothDevice) => {
      setSavedDevices((current = []) => {
        if (current.some((d) => d.mac === device.mac)) return current;
        return [...current, device];
      });
    },
    [setSavedDevices]
  );

  const removeDevice = useCallback(
    (mac: string) => {
      setSavedDevices((current = []) => current.filter((d) => d.mac !== mac));
    },
    [setSavedDevices]
  );

  const simulateConnect = useCallback((device: BluetoothDevice) => {
    setSelectedDevice(device);
    setConnecting(true);
    setConnected(false);
    setActiveTab('connect');
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  }, []);

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { label: 'Excellent', color: 'text-primary' };
    if (rssi > -65) return { label: 'Good', color: 'text-primary' };
    if (rssi > -75) return { label: 'Fair', color: 'text-foreground/70' };
    return { label: 'Weak', color: 'text-foreground/50' };
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scan', label: 'SCAN' },
    { id: 'saved', label: `SAVED (${(savedDevices ?? []).length})` },
    { id: 'connect', label: 'CONNECT' },
  ];

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">BLUETOOTH SCANNER</div>
        <button onClick={onBack} className="text-xs text-primary hover:text-primary/80">
          [BACK]
        </button>
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
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
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
                        DISCOVERED ({detectedDevices.length}):
                      </div>
                      {detectedDevices.map((device, idx) => {
                        const signal = getSignalStrength(device.rssi);
                        const isSaved = (savedDevices ?? []).some((d) => d.mac === device.mac);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="p-3 rounded border border-primary/30 bg-primary/5 hover:border-primary/40 transition-all">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="text-sm text-primary font-semibold mb-1">
                                    {device.name}
                                  </div>
                                  <div className="text-xs text-foreground/60 font-mono">
                                    {device.mac}
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-primary/50 text-primary"
                                >
                                  {device.type}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className={signal.color}>
                                  RSSI: {device.rssi} dBm ({signal.label})
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => simulateConnect(device)}
                                    className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5"
                                  >
                                    <BluetoothConnected weight="bold" className="w-3 h-3" /> PAIR
                                  </button>
                                  {!isSaved && (
                                    <button
                                      onClick={() => saveDevice(device)}
                                      className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5"
                                    >
                                      <FloppyDisk weight="bold" className="w-3 h-3" /> SAVE
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {!scanning && progress >= 100 && (
                    <button
                      onClick={startScan}
                      className="w-full p-2.5 rounded border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" /> RESCAN
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {(savedDevices ?? []).length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <BluetoothConnected
                    weight="duotone"
                    className="w-8 h-8 mx-auto text-foreground/30 mb-2"
                  />
                  <div className="text-sm text-foreground/50">No saved devices</div>
                  <div className="text-xs text-foreground/40 mt-1">
                    Scan and save BT devices to see them here
                  </div>
                </div>
              ) : (
                (savedDevices ?? []).map((device, idx) => {
                  const signal = getSignalStrength(device.rssi);
                  return (
                    <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-primary font-semibold mb-1">
                            {device.name}
                          </div>
                          <div className="text-xs text-foreground/60 font-mono">{device.mac}</div>
                        </div>
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                          {device.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={signal.color}>RSSI: {device.rssi} dBm</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => simulateConnect(device)}
                            className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5"
                          >
                            <BluetoothConnected weight="bold" className="w-3 h-3" /> PAIR
                          </button>
                          <button
                            onClick={() => removeDevice(device.mac)}
                            className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-0.5"
                          >
                            <Trash weight="bold" className="w-3 h-3" /> DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {activeTab === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {!selectedDevice ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <BluetoothConnected
                    weight="duotone"
                    className="w-8 h-8 mx-auto text-foreground/30 mb-2"
                  />
                  <div className="text-sm text-foreground/50">Select a device to connect</div>
                  <div className="text-xs text-foreground/40 mt-1">
                    Scan or pick from saved devices
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded border border-primary/50 bg-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-primary font-semibold">
                        {selectedDevice.name}
                      </div>
                      <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                        {selectedDevice.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-foreground/60 font-mono mb-2">
                      {selectedDevice.mac}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : connecting ? 'bg-yellow-400 animate-pulse' : 'bg-foreground/30'}`}
                      />
                      <span className="text-xs text-foreground/70">
                        {connected ? 'CONNECTED' : connecting ? 'PAIRING...' : 'DISCONNECTED'}
                      </span>
                    </div>
                  </div>

                  {connecting && (
                    <div className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="text-xs text-foreground/50 mb-2">
                        ESTABLISHING CONNECTION...
                      </div>
                      <Progress value={connecting ? 60 : 100} className="h-2" />
                    </div>
                  )}

                  {connected && (
                    <>
                      <div className="p-3 rounded border border-primary/20 bg-card/50">
                        <div className="text-xs text-foreground/60 mb-2">SERVICES:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedDevice.services.map((service, i) => (
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

                      <button
                        onClick={() => {
                          setConnected(false);
                          setSelectedDevice(null);
                        }}
                        className="w-full p-2 rounded border border-red-500/40 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-colors"
                      >
                        DISCONNECT
                      </button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">Scans for Bluetooth Classic & BLE devices</div>
      </div>
    </div>
  );
}
