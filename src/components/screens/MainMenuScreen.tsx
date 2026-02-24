import { motion } from 'framer-motion'
import { Broadcast, CreditCard, LightbulbFilament, Cpu, Keyboard, Trophy, BookOpen, BluetoothConnected, WifiHigh, Graph, ChartLine, GearSix } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MainMenuScreenProps {
  selectedIndex: number
}

const menuItems = [
  { id: 'subghz', label: 'Sub-GHz', icon: Broadcast, description: 'Radio Frequency Scanner' },
  { id: 'spectrum', label: 'Spectrum', icon: ChartLine, description: 'Waterfall Analyzer' },
  { id: 'rfid', label: 'RFID/NFC', icon: CreditCard, description: 'Contactless Reader' },
  { id: 'infrared', label: 'Infrared', icon: LightbulbFilament, description: 'Universal Remote' },
  { id: 'bluetooth', label: 'Bluetooth', icon: BluetoothConnected, description: 'BT/BLE Scanner' },
  { id: 'wifi', label: 'WiFi', icon: WifiHigh, description: 'Network Analyzer' },
  { id: 'zigbee', label: 'Zigbee', icon: Graph, description: 'Mesh Network' },
  { id: 'gpio', label: 'GPIO', icon: Cpu, description: 'Hardware Interface' },
  { id: 'badusb', label: 'Bad USB', icon: Keyboard, description: 'USB Emulation' },
  { id: 'education', label: 'Education', icon: BookOpen, description: 'Learn & Understand' },
  { id: 'challenge', label: 'Challenges', icon: Trophy, description: 'Security Puzzles' },
  { id: 'settings', label: 'Settings', icon: GearSix, description: 'About & Data' },
]

export function MainMenuScreen({ selectedIndex }: MainMenuScreenProps) {
  return (
    <div className="h-full flex flex-col font-mono">
      <div className="border-b border-foreground/20 pb-2 mb-3">
        <div className="text-sm text-foreground/60">MAIN MENU</div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isSelected = index === selectedIndex
          
          return (
            <motion.div
              key={item.id}
              animate={{
                backgroundColor: isSelected ? 'rgba(239, 108, 34, 0.2)' : 'rgba(0, 0, 0, 0)',
                borderColor: isSelected ? 'rgb(239, 108, 34)' : 'rgba(37, 171, 58, 0.2)',
              }}
              className={cn(
                'p-3 rounded border-2 cursor-pointer transition-colors',
                isSelected && 'shadow-lg'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  weight="duotone" 
                  className={cn(
                    'w-6 h-6',
                    isSelected ? 'text-primary' : 'text-foreground/60'
                  )} 
                />
                <div className="flex-1">
                  <div className={cn(
                    'text-sm font-semibold',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}>
                    {item.label}
                  </div>
                  <div className="text-xs text-foreground/50">
                    {item.description}
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="border-t border-foreground/20 pt-2 mt-3">
        <div className="text-xs text-foreground/40 text-center">
          Press OK to select • Use arrows to navigate
        </div>
      </div>
    </div>
  )
}

export { menuItems }