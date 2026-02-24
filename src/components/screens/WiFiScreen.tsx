import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowsClockwise, FloppyDisk, Trash, WifiHigh, ShieldWarning } from '@phosphor-icons/react';
import { WiFiChannelMap } from '@/components/diagrams/WiFiChannelMap';
import { ProtocolDiagram } from '@/components/diagrams/ProtocolDiagram';
import { useLocalKV } from '@/hooks/use-local-kv';

interface WiFiScreenProps {
  onBack: () => void;
}

interface WiFiNetwork {
  ssid: string;
  bssid: string;
  channel: number;
  signal: number;
  security: string;
  band: '2.4GHz' | '5GHz';
}

type Tab = 'scan' | 'saved' | 'analyze';

export function WiFiScreen({ onBack }: WiFiScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedNetworks, setDetectedNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [savedNetworks, setSavedNetworks] = useLocalKV<WiFiNetwork[]>('wifi-saved', []);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setScanning(false);
            return 100;
          }
          return prev + 1.2;
        });

        if (Math.random() > 0.88 && detectedNetworks.length < 8) {
          const ssids = [
            'Home_Network',
            'Office_WiFi',
            'CoffeeShop_5G',
            'NetGear82',
            'Linksys_2.4',
            'TP-Link_Guest',
            'ATT_WiFi',
            'Xfinity',
          ];
          const securities = ['WPA2-PSK', 'WPA3', 'WPA2-Enterprise', 'Open', 'WEP'];
          const band: '2.4GHz' | '5GHz' = Math.random() > 0.5 ? '2.4GHz' : '5GHz';
          const channels24 = [1, 6, 11];
          const channels5 = [36, 40, 44, 48, 149, 153, 157, 161];

          const newNetwork: WiFiNetwork = {
            ssid: ssids[Math.floor(Math.random() * ssids.length)],
            bssid: Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 256)
                .toString(16)
                .padStart(2, '0')
                .toUpperCase()
            ).join(':'),
            channel:
              band === '2.4GHz'
                ? channels24[Math.floor(Math.random() * channels24.length)]
                : channels5[Math.floor(Math.random() * channels5.length)],
            signal: -Math.floor(Math.random() * 60 + 30),
            security: securities[Math.floor(Math.random() * securities.length)],
            band,
          };
          setDetectedNetworks((prev) => [...prev, newNetwork]);
        }
      }, 70);

      return () => clearInterval(interval);
    }
  }, [scanning, detectedNetworks.length]);

  const startScan = useCallback(() => {
    setScanning(true);
    setProgress(0);
    setDetectedNetworks([]);
    setSelectedNetwork(null);
  }, []);

  const saveNetwork = useCallback(
    (network: WiFiNetwork) => {
      setSavedNetworks((current = []) => {
        if (current.some((n) => n.bssid === network.bssid)) return current;
        return [...current, network];
      });
    },
    [setSavedNetworks]
  );

  const removeNetwork = useCallback(
    (bssid: string) => {
      setSavedNetworks((current = []) => current.filter((n) => n.bssid !== bssid));
    },
    [setSavedNetworks]
  );

  const startAnalysis = useCallback((network: WiFiNetwork) => {
    setSelectedNetwork(network);
    setActiveTab('analyze');
    setAnalyzing(true);
    setAnalyzeProgress(0);
  }, []);

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return { label: 'Excellent', bars: 4, color: 'text-primary' };
    if (signal > -60) return { label: 'Good', bars: 3, color: 'text-primary' };
    if (signal > -70) return { label: 'Fair', bars: 2, color: 'text-foreground/70' };
    return { label: 'Weak', bars: 1, color: 'text-foreground/50' };
  };

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setAnalyzeProgress((prev) => {
          if (prev >= 100) {
            setAnalyzing(false);
            return 100;
          }
          return prev + 2;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scan', label: 'SCAN' },
    { id: 'saved', label: `SAVED (${(savedNetworks ?? []).length})` },
    { id: 'analyze', label: 'ANALYZE' },
  ];

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">WIFI ANALYZER</div>
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
                        DISCOVERED ({detectedNetworks.length}):
                      </div>
                      {detectedNetworks.map((network, idx) => {
                        const signal = getSignalStrength(network.signal);
                        const isSaved = (savedNetworks ?? []).some(
                          (n) => n.bssid === network.bssid
                        );
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
                                      className={`w-1 rounded-full transition-colors ${i < signal.bars ? 'bg-primary' : 'bg-foreground/20'}`}
                                      style={{ height: `${(i + 1) * 3}px` }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                                <div className="flex gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-primary/50 text-primary"
                                  >
                                    Ch {network.channel}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-foreground/30">
                                    {network.band}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startAnalysis(network)}
                                    className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5"
                                  >
                                    <ShieldWarning weight="bold" className="w-3 h-3" /> ANALYZE
                                  </button>
                                  {!isSaved && (
                                    <button
                                      onClick={() => saveNetwork(network)}
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
              {(savedNetworks ?? []).length === 0 ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <WifiHigh weight="duotone" className="w-8 h-8 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">No saved networks</div>
                  <div className="text-xs text-foreground/40 mt-1">
                    Scan and save WiFi networks to see them here
                  </div>
                </div>
              ) : (
                (savedNetworks ?? []).map((network, idx) => {
                  const signal = getSignalStrength(network.signal);
                  return (
                    <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-primary font-semibold mb-1">
                            {network.ssid}
                          </div>
                          <div className="text-xs text-foreground/60 font-mono">
                            {network.bssid}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-foreground/30">
                          {network.security}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={signal.color}>
                          {network.signal} dBm · {network.band} · Ch {network.channel}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startAnalysis(network)}
                            className="text-primary hover:text-primary/80 text-[10px] flex items-center gap-0.5"
                          >
                            <ShieldWarning weight="bold" className="w-3 h-3" /> ANALYZE
                          </button>
                          <button
                            onClick={() => removeNetwork(network.bssid)}
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

          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {!selectedNetwork ? (
                <div className="p-6 rounded border border-foreground/20 bg-background/30 text-center">
                  <WifiHigh weight="duotone" className="w-8 h-8 mx-auto text-foreground/30 mb-2" />
                  <div className="text-sm text-foreground/50">Select a network to analyze</div>
                  <div className="text-xs text-foreground/40 mt-1">
                    Pick from scan results or saved networks
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded border border-primary/50 bg-primary/10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-primary font-semibold">
                        {selectedNetwork.ssid}
                      </div>
                      <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                        {selectedNetwork.security}
                      </Badge>
                    </div>
                    <div className="text-xs text-foreground/60 font-mono">
                      {selectedNetwork.bssid}
                    </div>
                  </div>

                  {analyzing ? (
                    <div className="p-3 rounded border border-primary/30 bg-primary/5">
                      <div className="text-xs text-foreground/50 mb-2">ANALYZING NETWORK...</div>
                      <Progress value={analyzeProgress} className="h-2" />
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded border border-primary/20 bg-card/50">
                        <div className="text-xs text-foreground/60 mb-2">ANALYSIS RESULTS:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-foreground/60">Security:</span>{' '}
                            <span className="text-foreground">{selectedNetwork.security}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60">Band:</span>{' '}
                            <span className="text-foreground">{selectedNetwork.band}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60">Channel:</span>{' '}
                            <span className="text-foreground">{selectedNetwork.channel}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60">Signal:</span>{' '}
                            <span className="text-foreground">{selectedNetwork.signal} dBm</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-foreground/60">Encryption:</span>
                            <span
                              className={`ml-2 ${selectedNetwork.security === 'Open' || selectedNetwork.security === 'WEP' ? 'text-red-400' : 'text-primary'}`}
                            >
                              {selectedNetwork.security === 'Open'
                                ? 'NONE — Vulnerable'
                                : selectedNetwork.security === 'WEP'
                                  ? 'WEAK — Easily cracked'
                                  : selectedNetwork.security === 'WPA3'
                                    ? 'STRONG — SAE protected'
                                    : 'GOOD — PSK/Enterprise'}
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
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40">
          Analyzes WiFi networks on 2.4GHz & 5GHz bands
        </div>
      </div>
    </div>
  );
}
