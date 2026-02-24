# Flipper Zero Lab

An interactive experimentation dashboard showcasing the [Flipper Zero](https://flipperzero.one/)'s capabilities through simulations and educational content. Built as a portfolio project - no hardware required.

## Features

- **12 interactive tools** - Sub-GHz scanner, RFID/NFC reader, Infrared remote, Bluetooth/WiFi/Zigbee scanners, GPIO toolkit, BadUSB creator, Spectrum Analyzer, and more
- **Authentic device replica** - physical D-pad navigation, retro-tech aesthetic, monochrome screen that mimics the real Flipper Zero
- **Data persistence** - saved signals, cards, and IR commands survive page reload via localStorage
- **Security challenges** - 7 puzzles (1700+ points) testing protocol knowledge across multiple tools
- **Education hub** - 12 topics covering RF fundamentals, RFID memory structures, Bluetooth protocols, and more
- **Keyboard navigation** - arrow keys, Enter, Escape/Backspace for full keyboard-driven interaction
- **Deep-link routing** - hash-based URLs for every screen (`#subghz`, `#rfid`, etc.)
- **Code-split** - lazy-loaded screens for fast initial load

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (oklch color system) |
| Animation | Framer Motion |
| Icons | Phosphor Icons |
| UI Kit | Radix UI / shadcn/ui |
| Testing | Vitest + React Testing Library |
| Deploy | Cloudflare Pages |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`tsc -b && vite build`) |
| `npm run preview` | Preview production build |
| `npm test` | Run tests with Vitest |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  App.tsx                    # Root shell, routing, keyboard nav
  components/
    FlipperDevice.tsx        # Physical device replica
    screens/                 # 12 tool screens + 7 challenge screens
    diagrams/                # Canvas & SVG visualizations
    ui/                      # shadcn/ui components
  hooks/
    use-local-kv.ts          # localStorage persistence hook
  test/                      # Vitest test suites
```

## License

MIT
