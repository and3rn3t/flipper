# Copilot Instructions

See the full guidance in AI_INSTRUCTIONS.md. Use these repo-specific defaults unless the user says otherwise.

## Repo defaults

- Stack: React 19 + Vite + TypeScript + Tailwind v4.
- Prefer existing UI components in src/components/ui before creating new ones.
- For screens, follow patterns in src/components/screens and keep layout stable unless asked.
- For diagrams, use src/components/diagrams and keep sizing and tokens consistent.
- Use the class merge helper `cn` from src/lib/utils when combining Tailwind classes.
- Use the @/* path alias for imports where it fits existing usage.
- Avoid new dependencies unless explicitly approved.

## Coding style

- Match the current file's formatting (quotes, semicolons, spacing).
- Keep changes minimal and scoped to the requested files.
- Update related docs only when behavior changes.

## Verification

- Suggest the smallest reasonable check (lint, type-check, or a quick UI spot check).
