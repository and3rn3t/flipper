import { useState } from 'react'
import { FlipperDevice } from './components/FlipperDevice'
import { MainMenuScreen, menuItems } from './components/screens/MainMenuScreen'
import { SubGHzScreen } from './components/screens/SubGHzScreen'
import { SpectrumAnalyzerScreen } from './components/screens/SpectrumAnalyzerScreen'
import { RFIDScreen } from './components/screens/RFIDScreen'
import { InfraredScreen } from './components/screens/InfraredScreen'
import { BluetoothScreen } from './components/screens/BluetoothScreen'
import { WiFiScreen } from './components/screens/WiFiScreen'
import { ZigbeeScreen } from './components/screens/ZigbeeScreen'
import { GPIOScreen } from './components/screens/GPIOScreen'
import { BadUSBScreen } from './components/screens/BadUSBScreen'
import { EducationScreen } from './components/screens/EducationScreen'
import { ChallengeScreen } from './components/screens/ChallengeScreen'
import { Card } from './components/ui/card'

type Screen = 'menu' | 'subghz' | 'spectrum' | 'rfid' | 'infrared' | 'bluetooth' | 'wifi' | 'zigbee' | 'gpio' | 'badusb' | 'education' | 'challenge'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0)

  const handleNavigate = (direction: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => {
    if (currentScreen === 'menu') {
      if (direction === 'up') {
        setSelectedMenuIndex((prev) => Math.max(0, prev - 1))
      } else if (direction === 'down') {
        setSelectedMenuIndex((prev) => Math.min(menuItems.length - 1, prev + 1))
      } else if (direction === 'ok') {
        const selected = menuItems[selectedMenuIndex]
        setCurrentScreen(selected.id as Screen)
      }
    } else {
      if (direction === 'back') {
        setCurrentScreen('menu')
      }
    }
  }

  const handleBackToMenu = () => {
    setCurrentScreen('menu')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'subghz':
        return <SubGHzScreen onBack={handleBackToMenu} />
      case 'spectrum':
        return <SpectrumAnalyzerScreen onBack={handleBackToMenu} />
      case 'rfid':
        return <RFIDScreen onBack={handleBackToMenu} />
      case 'infrared':
        return <InfraredScreen onBack={handleBackToMenu} />
      case 'bluetooth':
        return <BluetoothScreen onBack={handleBackToMenu} />
      case 'wifi':
        return <WiFiScreen onBack={handleBackToMenu} />
      case 'zigbee':
        return <ZigbeeScreen onBack={handleBackToMenu} />
      case 'gpio':
        return <GPIOScreen onBack={handleBackToMenu} />
      case 'badusb':
        return <BadUSBScreen onBack={handleBackToMenu} />
      case 'education':
        return <EducationScreen onBack={handleBackToMenu} />
      case 'challenge':
        return <ChallengeScreen onBack={handleBackToMenu} />
      default:
        return <MainMenuScreen selectedIndex={selectedMenuIndex} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-primary mb-2">
            Flipper Zero
          </h1>
          <p className="text-foreground/60 text-sm md:text-base">
            Interactive Experimentation Lab
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <FlipperDevice
              screenContent={renderScreen()}
              onNavigate={handleNavigate}
            />
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">
                About Flipper Zero
              </h2>
              <p className="text-sm text-foreground/80 mb-4">
                Flipper Zero is a portable multi-tool for pentesters and hardware hackers. 
                It's designed for interaction with access control systems, radio protocols, 
                RFID, NFC, and more.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold text-foreground">Educational Tool:</span> Designed for 
                    security research, penetration testing, and learning about wireless protocols.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold text-foreground">Open Source:</span> Fully hackable with 
                    custom firmware, plugins, and community-built applications.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-foreground/70">
                    <span className="font-semibold text-foreground">Legal & Ethical:</span> Always use responsibly 
                    and only on systems you own or have permission to test.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold font-mono text-primary mb-3">
                How to Use This Simulator
              </h2>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>• Use the <span className="text-primary font-semibold">arrow buttons</span> to navigate the menu</p>
                <p>• Press the <span className="text-primary font-semibold">center button (OK)</span> to select a tool</p>
                <p>• Press the <span className="text-primary font-semibold">back button</span> to return to the menu</p>
                <p>• Each tool simulates real Flipper Zero capabilities</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App