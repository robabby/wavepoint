# src/components/ — UI Conventions

## shadcn/ui

Components in `ui/` are shadcn/ui (New York style). **Never hand-write** — add via:
```bash
npx shadcn@latest add <component>
```

## Styling

- Use `cn()` from `@/lib/utils` for conditional classNames (clsx + tailwind-merge)
- Theme: custom context from `@/lib/theme/` — **not** next-themes
- Animations: Framer Motion via `motion-provider.tsx`

## Component Defaults

- **Server components by default** — add `"use client"` only when state/effects needed
- **Loading spinner**: Use `SacredSpinner` (not a raw spinner)
- **Icons**: Import from `lucide-react`

## Design Identity: "Modern Mystic"

Sophisticated spirituality — not new-age kitsch.

- **"Quiet Confidence"**: Subtle animations over flashy. Reserve celebration for meaningful moments. Gold glow is earned, not everywhere.
- **"Grounded over Grandiose"**: Precise language, no breathless hyperbole.
- **Voice**: Calm not cold, knowledgeable not academic, present not precious.
- See `docs/ux/design-principles.md` and `docs/ux/voice-and-tone.md` for full guidance.

## Directory Structure

- `ui/` — shadcn/ui primitives (don't modify unless necessary)
- `sidebar/` — authenticated sidebar navigation
- `dashboard/` — modular dashboard section components
- Feature dirs (`calendar/`, `signal/`, `numerology/`, etc.) — feature-specific UI
