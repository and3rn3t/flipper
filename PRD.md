# Planning Guide

A Flipper Zero experimentation dashboard that showcases the device's capabilities through interactive simulations and educational content about its various tools and features.

**Experience Qualities**:
1. **Playful** - The interface should feel like an actual hacking tool with a retro-tech aesthetic that mirrors the Flipper Zero's own screen and button layout
2. **Educational** - Each feature should clearly explain what the Flipper Zero does, how it works, and legitimate use cases
3. **Interactive** - Users can simulate different Flipper Zero operations and see visual feedback of how they work

**Complexity Level**: Light Application (multiple features with basic state)
This is a showcase/educational tool with multiple interactive simulations representing different Flipper Zero capabilities. Each feature operates independently with simple state management for tracking user interactions and simulation results.

## Essential Features

### Device Simulator
- **Functionality**: Visual replica of the Flipper Zero device with working button navigation
- **Purpose**: Give users a feel for the actual device interface and navigation
- **Trigger**: Loads on app start as the central element
- **Progression**: User sees device → clicks directional buttons → navigates through menus → selects tools → views simulations
- **Success criteria**: All button interactions work smoothly, menu navigation feels authentic to real device

### Sub-GHz Analyzer
- **Functionality**: Simulates scanning for radio frequencies and displays signal patterns
- **Purpose**: Demonstrates the device's ability to capture and analyze wireless signals
- **Trigger**: Selected from main device menu
- **Progression**: User starts scan → animated frequency spectrum appears → detects signals → shows signal details and waveforms
- **Success criteria**: Visual feedback is clear, frequencies display realistically, users understand what's being captured

### Spectrum Analyzer with Waterfall Display
- **Functionality**: Real-time frequency spectrum analyzer with cascading waterfall visualization showing signal activity over time
- **Purpose**: Provides advanced signal visualization capabilities for monitoring RF activity across different frequency bands
- **Trigger**: Selected from main device menu
- **Progression**: User selects frequency band → starts analyzer → waterfall display scrolls showing signal intensity → detected signals highlighted → signal details logged
- **Success criteria**: Waterfall display updates smoothly, color gradient clearly shows signal strength, frequency bands are selectable, detected signals are logged with details

### RFID/NFC Reader
- **Functionality**: Simulates reading contactless cards and tags
- **Purpose**: Shows how Flipper reads access cards, keyfobs, and NFC tags
- **Trigger**: Selected from device menu
- **Progression**: User initiates scan → animation shows RF field → simulated card detected → displays card data (UID, type, sectors)
- **Success criteria**: Clear visual indication of scanning, realistic card data display, educational notes about card types

### Infrared Remote
- **Functionality**: Interactive IR remote that can "learn" and replay IR signals
- **Purpose**: Demonstrates universal remote capabilities
- **Trigger**: Selected from device menu
- **Progression**: User chooses device type → selects capture mode → simulates capturing IR signal → can replay to control virtual devices
- **Success criteria**: Multiple device types available, capture animation is satisfying, replay shows visual confirmation

### GPIO Toolkit
- **Functionality**: Shows GPIO pinout and simulates basic electronics projects
- **Purpose**: Highlights the hardware hacking and electronics prototyping capabilities
- **Trigger**: Selected from device menu
- **Progression**: User views pinout diagram → selects example project → sees circuit diagram → simulates running code on GPIO pins
- **Success criteria**: Clear pinout visualization, interesting example projects, educational value for hardware beginners

### BadUSB Creator
- **Functionality**: Visual payload creator for BadUSB attacks (ethical/educational only)
- **Purpose**: Demonstrates USB HID emulation capabilities
- **Trigger**: Selected from device menu
- **Progression**: User selects payload template → customizes script → sees preview of what it would do → views keystroke simulation
- **Success criteria**: Clear ethical warnings, educational context provided, interesting payloads shown safely

## Edge Case Handling
- **No Flipper Device Required**: App is entirely simulated - no actual Flipper Zero connection needed
- **Educational Warnings**: All "hacking" features include prominent disclaimers about legal and ethical usage
- **Mobile Adaptation**: Device simulator scales appropriately on mobile, touch-friendly buttons
- **Incomplete Actions**: Users can exit simulations mid-process and return to menu without breaking state
- **Information Overload**: Technical details are collapsed by default with "Learn More" expansions

## Design Direction
The design should evoke a cyberpunk/hacker aesthetic with a retro-tech twist - think monochrome terminal green meets orange accent highlights. The interface should feel technical and authentic without being intimidating, balancing nerdy appeal with accessibility. The Flipper Zero's signature orange color should be a key accent throughout.

## Color Selection
A dark, terminal-inspired palette with high-tech accents that reference the Flipper Zero's physical design and screen.

- **Primary Color**: Deep cyber black (oklch(0.15 0 0)) - Conveys technical depth, terminal aesthetic, hacker tool vibe
- **Secondary Colors**: 
  - Matrix green (oklch(0.65 0.19 145)) - Classic terminal/hacker green for text and success states
  - Deep slate (oklch(0.25 0.01 240)) - Subtle backgrounds for cards and elevated surfaces
- **Accent Color**: Flipper orange (oklch(0.68 0.18 45)) - The signature Flipper Zero color for CTAs, active states, and highlights
- **Foreground/Background Pairings**: 
  - Primary (Deep Black oklch(0.15 0 0)): Matrix Green text (oklch(0.65 0.19 145)) - Ratio 5.2:1 ✓
  - Secondary (Deep Slate oklch(0.25 0.01 240)): Matrix Green text (oklch(0.65 0.19 145)) - Ratio 4.1:1 ✓
  - Accent (Flipper Orange oklch(0.68 0.18 45)): Deep Black text (oklch(0.15 0 0)) - Ratio 6.8:1 ✓
  - Deep Slate cards on Deep Black background - Ratio 1.8:1 (subtle depth)

## Font Selection
Typography should feel technical and monospaced where appropriate, evoking terminal interfaces and hardware documentation, while maintaining readability for longer educational content.

- **Typographic Hierarchy**: 
  - H1 (App Title): JetBrains Mono Bold/32px/tight tracking - Tech-forward, matches device aesthetic
  - H2 (Tool Names): JetBrains Mono SemiBold/24px/normal tracking - Clear hierarchy, consistent monospace feel
  - H3 (Sections): Space Grotesk SemiBold/18px/normal tracking - Slightly softer for subsections
  - Body Text: Space Grotesk Regular/16px/1.5 line-height - Readable for educational content, tech aesthetic
  - Device Screen Text: JetBrains Mono Regular/14px/1.3 line-height - Authentic monospace for device display
  - Labels/Captions: Space Grotesk Medium/13px/uppercase - Technical specification feel

## Animations
Animations should feel snappy and technical - like a well-optimized embedded system. Use brief, purposeful transitions that enhance the feeling of navigating a hardware device.

- Quick button presses with subtle haptic-style feedback (100ms scale bounce)
- Smooth but fast menu transitions (200ms slide with easing)
- Scanning animations with progressive reveal and slight glow effects
- Signal waveforms and frequency displays with continuous smooth animations
- Device screen updates with authentic pixel-perfect transitions mimicking the real Flipper Zero display
- Success/detection moments with satisfying orange pulse highlights

## Component Selection

- **Components**: 
  - Card (device display, tool panels, info sections) - with custom border glow effects for active states
  - Button (navigation, actions) - styled as retro device buttons with orange highlights
  - Tabs (switching between different tools/features) - styled as menu items
  - Dialog (detailed explanations, warnings) - for ethical usage disclaimers
  - Progress (scanning animations) - customized with green/orange colors
  - Badge (signal types, card protocols, status indicators) - monospace styling
  - Separator (dividing sections) - subtle green glow lines
  - ScrollArea (for longer technical content)

- **Customizations**: 
  - Custom Flipper Zero device frame component with authentic proportions
  - Animated frequency spectrum visualizer (canvas-based)
  - Custom waveform/signal display components
  - Monochrome "screen" component that mimics the actual Flipper Zero LCD
  - Custom directional pad (D-pad) button cluster
  - GPIO pinout diagram (SVG-based)

- **States**: 
  - Buttons: Idle (slate with orange border), Hover (orange glow), Active (orange fill), Pressed (scale down + bright orange)
  - Device screen: Off (dark), Active (green glow), Scanning (pulsing), Success (orange flash)
  - Scan indicators: Idle → Scanning (animated) → Found (pulse) → Display data
  - Navigation: Current section highlighted in orange, others in muted green

- **Icon Selection**: 
  - Radio (waves icon) for Sub-GHz
  - Contactless (credit card icon) for RFID/NFC  
  - LightbulbFilament for infrared
  - Chip for GPIO
  - Keyboard for BadUSB
  - CaretRight/CaretLeft for navigation
  - Play/Pause for simulations
  - Warning for ethical disclaimers

- **Spacing**: 
  - Consistent 4/8/16/24/32px spacing scale
  - Device frame: 32px padding
  - Tool cards: 24px internal padding, 16px gaps between
  - Button cluster: 8px gaps between buttons
  - Content sections: 24px vertical rhythm

- **Mobile**: 
  - Device simulator scales to fit viewport width while maintaining aspect ratio
  - Navigation buttons increase touch target size to 48px minimum
  - Tool selection switches from side panel to bottom tabs
  - Detailed technical info moves to expandable accordions
  - Landscape orientation recommended message for optimal experience
