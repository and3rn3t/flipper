import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Toaster, toast } from 'sonner'

type Screen = 'menu' | 'subghz' | 'spectrum' | 'rfid' | 'infrared' | 'bluetooth' | 'wifi' | 'zigbee' | 'gpio' | 'badusb' | 'education' | 'challenge'

const validScreens: Screen[] = ['menu', 'subghz', 'spectrum', 'rfid', 'infrared', 'bluetooth', 'wifi', 'zigbee', 'gpio', 'badusb', 'education', 'challenge']

function getScreenFromHash(): Screen {
  const hash = window.location.hash.replace('#', '')
  if (validScreens.includes(hash as Screen)) return hash as Screen
  return 'menu'
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(getScreenFromHash)
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 1 = forward, -1 = back

  // Sync hash → state on popstate (browser back/forward)
  useEffect(() => {
    const onHashChange = () => {
      const screen = getScreenFromHash()
      setDirection(screen === 'menu' ? -1 : 1)
      setCurrentScreen(screen)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigateToScreen = useCallback((screen: Screen) => {
    setDirection(screen === 'menu' ? -1 : 1)
    setCurrentScreen(screen)
    window.location.hash = screen === 'menu' ? '' : screen
  }, [])

  const handleNavigate = useCallback((dir: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => {
    if (currentScreen === 'menu') {
      if (dir === 'up') {
        setSelectedMenuIndex((prev) => Math.max(0, prev - 1))
      } else if (dir === 'down') {
        setSelectedMenuIndex((prev) => Math.min(menuItems.length - 1, prev + 1))
      } else if (dir === 'ok') {
        const selected = menuItems[selectedMenuIndex]
        navigateToScreen(selected.id as Screen)
        toast(`Opening ${selected.label}`, {
          description: selected.description,
          duration: 1500,
        })
      } else if (dir === 'left') {
        setSelectedMenuIndex((prev) => Math.max(0, prev - 1))
      } else if (dir === 'right') {
        setSelectedMenuIndex((prev) => Math.min(menuItems.length - 1, prev + 1))
      }
    } else {
      if (dir === 'back') {
        navigateToScreen('menu')
      }
    }
  }, [currentScreen, selectedMenuIndex, navigateToScreen])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          handleNavigate('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          handleNavigate('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleNavigate('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNavigate('right')
          break
        case 'Enter':
          e.preventDefault()
          handleNavigate('ok')
          break
        case 'Escape':
        case 'Backspace':
          e.preventDefault()
          handleNavigate('back')
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNavigate])

  const handleBackToMenu = useCallback(() => {
    navigateToScreen('menu')
  }, [navigateToScreen])

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

  const screenVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -30 : 30,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'oklch(0.25 0.01 240)',
            border: '1px solid oklch(0.30 0.05 240)',
            color: 'oklch(0.65 0.19 145)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono text-primary mb-1 md:mb-2">
            Flipper Zero
          </h1>
          <p className="text-foreground/60 text-xs sm:text-sm md:text-base">
            Interactive Experimentation Lab
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
          <div>
            <FlipperDevice
              screenContent={
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentScreen}
                    custom={direction}
                    variants={screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="h-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              }
              onNavigate={handleNavigate}
            />
          </div>

          <div className="space-y-4">
            <Card className="p-4 md:p-6 bg-card border-border">
              <h2 className="text-lg md:text-xl font-semibold font-mono text-primary mb-3">
                About Flipper Zero
              </h2>
              <p className="text-xs md:text-sm text-foreground/80 mb-4">
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

            <Card className="p-4 md:p-6 bg-card border-border">
              <h2 className="text-lg md:text-xl font-semibold font-mono text-primary mb-3">
                Controls
              </h2>
              <div className="space-y-2 text-xs md:text-sm text-foreground/80">
                <p>• <span className="text-primary font-semibold">Arrow keys</span> or <span className="text-primary font-semibold">D-pad buttons</span> to navigate</p>
                <p>• <span className="text-primary font-semibold">Enter</span> or <span className="text-primary font-semibold">OK button</span> to select</p>
                <p>• <span className="text-primary font-semibold">Escape</span> or <span className="text-primary font-semibold">Back button</span> to go back</p>
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