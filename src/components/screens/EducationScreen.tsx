import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  Broadcast,
  CreditCard,
  LightbulbFilament,
  Cpu,
  Keyboard,
  ShieldCheck,
  BluetoothConnected,
  WifiHigh,
  Graph,
  ChartLine,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FrequencySpectrum } from '@/components/diagrams/FrequencySpectrum';
import { RFIDStructure } from '@/components/diagrams/RFIDStructure';
import { InfraredTiming } from '@/components/diagrams/InfraredTiming';
import { BluetoothTopology } from '@/components/diagrams/BluetoothTopology';
import { WiFiChannelMap } from '@/components/diagrams/WiFiChannelMap';
import { ZigbeeMeshNetwork } from '@/components/diagrams/ZigbeeMeshNetwork';
import { GPIOPinout } from '@/components/diagrams/GPIOPinout';
import { KeystrokeFlow } from '@/components/diagrams/KeystrokeFlow';

interface EducationScreenProps {
  onBack: () => void;
}

type Topic =
  | 'overview'
  | 'subghz'
  | 'rfid'
  | 'infrared'
  | 'bluetooth'
  | 'wifi'
  | 'zigbee'
  | 'spectrum'
  | 'gpio'
  | 'badusb'
  | 'security';

// Sample data for education diagrams
const sampleBTDevices = [
  { name: 'Smart Watch', mac: '4A:C3:1B:22:0F:D1', rssi: -45, type: 'BLE' as const },
  { name: 'Headphones', mac: '7E:12:A8:3C:5D:9F', rssi: -62, type: 'Classic' as const },
  { name: 'BLE Beacon', mac: '01:F0:8B:45:22:CC', rssi: -70, type: 'BLE' as const },
];
const sampleWiFiNetworks = [
  { ssid: 'Home_WiFi', channel: 6, signal: -42, band: '2.4GHz' as const },
  { ssid: 'Office_5G', channel: 36, signal: -55, band: '5GHz' as const },
  { ssid: 'Guest_Net', channel: 11, signal: -68, band: '2.4GHz' as const },
];
const sampleZigbeeDevices = [
  { name: 'Coordinator', address: '0x0000', type: 'Coordinator' as const, lqi: 255 },
  { name: 'Light Switch', address: '0x1A2B', type: 'Router' as const, lqi: 200 },
  { name: 'Temp Sensor', address: '0x3C4D', type: 'End Device' as const, lqi: 160 },
];

const topicDiagrams: Partial<Record<Topic, () => React.ReactNode>> = {
  subghz: () => <FrequencySpectrum activeFrequencies={[433.92, 868.35]} className="h-20 rounded" />,
  rfid: () => <RFIDStructure cardType="mifare" />,
  infrared: () => <InfraredTiming protocol="nec" className="h-20 rounded" />,
  bluetooth: () => <BluetoothTopology devices={sampleBTDevices} className="h-20 rounded" />,
  wifi: () => <WiFiChannelMap networks={sampleWiFiNetworks} className="h-20 rounded" />,
  zigbee: () => <ZigbeeMeshNetwork devices={sampleZigbeeDevices} className="h-20 rounded" />,
  gpio: () => <GPIOPinout activePins={[3, 5, 7]} className="h-20 rounded" />,
  badusb: () => (
    <KeystrokeFlow steps={['Open Terminal', 'Run Script', 'Exfiltrate']} className="h-20 rounded" />
  ),
};

const topics = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'subghz', label: 'Sub-GHz', icon: Broadcast },
  { id: 'rfid', label: 'RFID/NFC', icon: CreditCard },
  { id: 'infrared', label: 'Infrared', icon: LightbulbFilament },
  { id: 'bluetooth', label: 'Bluetooth', icon: BluetoothConnected },
  { id: 'wifi', label: 'WiFi', icon: WifiHigh },
  { id: 'zigbee', label: 'Zigbee', icon: Graph },
  { id: 'spectrum', label: 'Spectrum', icon: ChartLine },
  { id: 'gpio', label: 'GPIO', icon: Cpu },
  { id: 'badusb', label: 'Bad USB', icon: Keyboard },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

const educationContent: Record<
  Topic,
  { title: string; sections: { heading: string; content: string }[] }
> = {
  overview: {
    title: 'Flipper Zero Overview',
    sections: [
      {
        heading: 'What is Flipper Zero?',
        content:
          'A portable multi-tool for pentesters and hardware hackers. It combines multiple capabilities: radio protocols, RFID/NFC reading, infrared control, GPIO interfacing, and USB device emulation in a single device.',
      },
      {
        heading: 'Core Philosophy',
        content:
          'Designed to be educational, open-source, and versatile. Every feature is meant to help security researchers understand how wireless protocols and access control systems work.',
      },
      {
        heading: 'Legal Usage',
        content:
          'Only use on systems you own or have explicit permission to test. Unauthorized access to systems is illegal. Flipper Zero is a tool for learning and authorized security testing.',
      },
    ],
  },
  subghz: {
    title: 'Sub-GHz Radio',
    sections: [
      {
        heading: 'Frequency Bands',
        content:
          'Operates on 300-928 MHz bands. Common uses: garage door openers, wireless doorbells, car key fobs, weather stations, and tire pressure sensors.',
      },
      {
        heading: 'Modulation Types',
        content:
          'Supports AM (Amplitude Modulation) and FM (Frequency Modulation). Different protocols use different modulation schemes - ASK, FSK, PSK, and OOK.',
      },
      {
        heading: 'Signal Analysis',
        content:
          'Can capture, analyze, and replay signals. Frequency analyzer helps identify active transmissions. Read RAW mode captures unknown protocols for later analysis.',
      },
      {
        heading: 'Security Implications',
        content:
          'Many devices use rolling codes to prevent replay attacks. Static codes are vulnerable. Always test on your own devices to understand security mechanisms.',
      },
    ],
  },
  rfid: {
    title: 'RFID & NFC',
    sections: [
      {
        heading: 'Low Frequency (125 kHz)',
        content:
          'Used for access cards, animal ID tags, and older security systems. Simple protocols, often no encryption. Can read, emulate, and clone tags.',
      },
      {
        heading: 'High Frequency (13.56 MHz)',
        content:
          'NFC technology, MIFARE cards, payment cards (limited), hotel keycards. More complex protocols with authentication and encryption.',
      },
      {
        heading: 'Card Types',
        content:
          'EM4100 (read-only), HID Prox (common access control), MIFARE Classic (encrypted sectors), MIFARE Ultralight (lightweight NFC), and many more.',
      },
      {
        heading: 'Read vs Emulate',
        content:
          'Reading captures card data. Emulation makes Flipper act as the card. Some systems detect emulation. Understanding card structure is key to successful use.',
      },
    ],
  },
  infrared: {
    title: 'Infrared Control',
    sections: [
      {
        heading: 'IR Protocols',
        content:
          'Supports NEC, Samsung, Sony, RC5, RC6, and many more. Each manufacturer uses different encoding schemes. Universal remotes work by storing multiple protocols.',
      },
      {
        heading: 'Learning Mode',
        content:
          'Can learn commands from existing remotes by capturing IR signals. Stores timing and pulse patterns. Create custom remote layouts for any device.',
      },
      {
        heading: 'Universal Library',
        content:
          'Built-in database of common TV, AC, and audio device codes. Quickly test devices without capturing signals first.',
      },
      {
        heading: 'Applications',
        content:
          'Control TVs, air conditioners, projectors, soundbars, and more. Great for understanding consumer electronics communication protocols.',
      },
    ],
  },
  gpio: {
    title: 'GPIO Interface',
    sections: [
      {
        heading: 'Pin Functions',
        content:
          'General Purpose Input/Output pins for custom hardware projects. Supports digital I/O, UART, SPI, I2C protocols. Power output available for external devices.',
      },
      {
        heading: 'UART Communication',
        content:
          'Serial communication at various baud rates. Debug embedded systems, communicate with microcontrollers, or interface with serial devices.',
      },
      {
        heading: 'SPI & I2C',
        content:
          'Common protocols for sensors and peripherals. Read temperature sensors, control displays, or communicate with other embedded systems.',
      },
      {
        heading: 'Hardware Hacking',
        content:
          'Connect to PCB test points, debug firmware, sniff communication between components. Essential for reverse engineering hardware.',
      },
    ],
  },
  bluetooth: {
    title: 'Bluetooth & BLE',
    sections: [
      {
        heading: 'Bluetooth Versions',
        content:
          'Classic Bluetooth (BR/EDR) operates at 2.4 GHz for audio streaming and file transfers. Bluetooth Low Energy (BLE) uses minimal power for IoT devices, beacons, and wearables.',
      },
      {
        heading: 'BLE Advertising',
        content:
          'BLE devices broadcast advertisement packets containing device name, services, and manufacturer data. Scanning these packets reveals nearby devices and their capabilities.',
      },
      {
        heading: 'GATT Services',
        content:
          'The Generic Attribute Profile defines how BLE devices expose data. Services contain characteristics (readable/writable values). Standard profiles exist for heart rate, battery, and more.',
      },
      {
        heading: 'Security Considerations',
        content:
          'BLE pairing can use Just Works (no authentication), Passkey, or Numeric Comparison methods. Older devices with weak pairing are vulnerable to eavesdropping and MITM attacks.',
      },
    ],
  },
  wifi: {
    title: 'WiFi Analysis',
    sections: [
      {
        heading: '802.11 Standards',
        content:
          'WiFi operates on 2.4 GHz (802.11b/g/n) and 5 GHz (802.11a/n/ac/ax) bands. Each band has multiple channels. Understanding channel allocation is key to network analysis.',
      },
      {
        heading: 'Network Discovery',
        content:
          'Access points broadcast beacon frames with SSID, channel, security type, and supported rates. Passive scanning listens for beacons; active scanning sends probe requests.',
      },
      {
        heading: 'Security Protocols',
        content:
          'WPA3 is the current standard, using SAE (Simultaneous Authentication of Equals). WPA2 uses a 4-way handshake with PSK or Enterprise (802.1X). WEP and open networks are insecure.',
      },
      {
        heading: 'Frame Structure',
        content:
          'WiFi frames have a MAC header (addresses, frame type), body (data/management payload), and FCS (error check). Management frames handle association, authentication, and beacons.',
      },
    ],
  },
  zigbee: {
    title: 'Zigbee & Mesh',
    sections: [
      {
        heading: 'Zigbee Overview',
        content:
          'IEEE 802.15.4 based protocol operating at 2.4 GHz with mesh networking. Designed for low-power IoT: smart home devices, industrial sensors, and building automation.',
      },
      {
        heading: 'Network Topology',
        content:
          'Three device types: Coordinator (forms and manages network), Router (extends range and relays messages), and End Device (low-power sensors/actuators that sleep between transmissions).',
      },
      {
        heading: 'Mesh Networking',
        content:
          'Messages hop between routers to reach distant devices. Self-healing: if a router fails, the network finds alternative paths. PAN ID identifies each network.',
      },
      {
        heading: 'Security Model',
        content:
          'Uses AES-128 encryption with network keys distributed by the Trust Center (coordinator). Key transport during joining is a known vulnerability in some implementations.',
      },
    ],
  },
  spectrum: {
    title: 'Spectrum Analysis',
    sections: [
      {
        heading: 'What is Spectrum Analysis?',
        content:
          'Visualizing radio frequency energy across a range of frequencies. Reveals active transmitters, interference sources, and signal characteristics. Essential for RF troubleshooting.',
      },
      {
        heading: 'Frequency Bands',
        content:
          'Sub-1 GHz (IoT, remotes), 2.4 GHz (WiFi, Bluetooth, Zigbee, microwaves), 5 GHz (WiFi, radar). Each band has regulatory limits on power and usage.',
      },
      {
        heading: 'Waterfall Display',
        content:
          'A time-frequency visualization where color represents signal strength. Scrolls over time, showing how RF activity changes. Useful for identifying intermittent transmissions.',
      },
      {
        heading: 'Signal Characteristics',
        content:
          'Key parameters: center frequency, bandwidth, modulation type, signal strength (dBm), and duty cycle. Understanding these helps identify and classify unknown signals.',
      },
    ],
  },
  badusb: {
    title: 'Bad USB',
    sections: [
      {
        heading: 'HID Emulation',
        content:
          'Flipper can act as a USB keyboard or mouse. When plugged in, computer sees it as a trusted input device. Can execute pre-programmed keystroke sequences.',
      },
      {
        heading: 'DuckyScript',
        content:
          'Simple scripting language for automating keystrokes. Can open applications, type commands, and navigate interfaces programmatically.',
      },
      {
        heading: 'Payload Examples',
        content:
          'System information gathering, network reconnaissance, demonstration of USB attack vectors. Educational use helps understand endpoint security.',
      },
      {
        heading: 'Defense Awareness',
        content:
          'Understanding USB attacks helps implement defenses: disable unused ports, use endpoint protection, and maintain physical security of systems.',
      },
    ],
  },
  security: {
    title: 'Security Best Practices',
    sections: [
      {
        heading: 'Responsible Use',
        content:
          'Only test systems you own or have written permission to test. Unauthorized access is illegal regardless of intent. Always follow ethical guidelines.',
      },
      {
        heading: 'Learning Approach',
        content:
          'Use Flipper Zero to understand security weaknesses in your own systems. Test your home security, car key fobs, and access cards to learn.',
      },
      {
        heading: 'Defense in Depth',
        content:
          'No single security measure is perfect. Layer defenses: use encryption, rolling codes, multi-factor authentication, and physical security.',
      },
      {
        heading: 'Reporting Vulnerabilities',
        content:
          'If you discover security issues, report them responsibly to manufacturers. Many have bug bounty programs. Help make systems more secure.',
      },
    ],
  },
};

export function EducationScreen({ onBack }: EducationScreenProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('overview');

  const content = educationContent[selectedTopic];

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3 flex items-center justify-between">
        <div className="text-sm text-foreground/60">EDUCATION</div>
        <button
          onClick={onBack}
          className="text-xs text-foreground/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={12} />
          BACK
        </button>
      </div>

      <div className="flex-1 flex gap-3 overflow-hidden">
        <div className="w-24 flex-shrink-0 space-y-1 overflow-y-auto">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isSelected = topic.id === selectedTopic;

            return (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id as Topic)}
                animate={{
                  backgroundColor: isSelected ? 'rgba(239, 108, 34, 0.15)' : 'rgba(0, 0, 0, 0)',
                  borderColor: isSelected ? 'rgb(239, 108, 34)' : 'rgba(37, 171, 58, 0.2)',
                }}
                className="w-full p-2 rounded border flex flex-col items-center gap-1 transition-all hover:border-primary/50"
              >
                <Icon
                  weight={isSelected ? 'fill' : 'regular'}
                  className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-foreground/60')}
                />
                <span
                  className={cn(
                    'text-[0.65rem] text-center leading-tight',
                    isSelected ? 'text-primary font-semibold' : 'text-foreground/60'
                  )}
                >
                  {topic.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <motion.div
            key={selectedTopic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-sm font-bold text-primary mb-3 border-b border-primary/30 pb-1">
              {content.title}
            </h2>

            {topicDiagrams[selectedTopic] && (
              <div className="mb-3 rounded border border-primary/20 overflow-hidden">
                {topicDiagrams[selectedTopic]!()}
              </div>
            )}

            <div className="space-y-3">
              {content.sections.map((section, index) => (
                <div key={index} className="bg-card/30 border border-border rounded p-2.5">
                  <h3 className="text-xs font-semibold text-foreground mb-1.5">
                    {section.heading}
                  </h3>
                  <p className="text-[0.7rem] text-foreground/70 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
