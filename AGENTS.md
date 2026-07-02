# AGENTS.md — Flipper Zero Lab

Interactive experimentation dashboard showcasing Flipper Zero capabilities through simulations and educational content. Portfolio project — **no hardware required**; everything is simulated in-browser.

## Stack

- React 19 + TypeScript + Vite, npm; Tailwind v4 (via `@tailwindcss/vite`), Radix UI primitives, framer-motion, Phosphor icons
- Cloudflare Pages (`wrangler.toml`, project `flipper-zero-lab`), output `dist/`
- Tests: Vitest (`src/test/`)

## Commands

```bash
npm install
npm run dev          # vite dev server (port 5000; `npm run kill` frees it)
npm run test         # vitest run
npm run lint         # eslint
npm run type-check   # tsc -b
npm run format       # prettier
npm run build        # tsc -b && vite build
npm run deploy       # build + wrangler pages deploy dist — only when asked
```

## Repo conventions

- Prefer existing UI components in `src/components/ui` before creating new ones.
- For screens, follow patterns in `src/components/screens`; keep layout stable unless asked.
- For diagrams, use `src/components/diagrams`; keep sizing and design tokens consistent.
- Simulations must stay faithful to real Flipper Zero behavior — verify hardware claims before adding educational content.
- `DEVELOPMENT.md`, `PRD.md`, and `AI_INSTRUCTIONS.md` hold deeper context; check them before larger changes.
- Conventional commits: `type(scope): description`.
- Don't commit or deploy unless explicitly asked.
