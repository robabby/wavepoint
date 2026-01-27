# CLAUDE.md

## Project Overview

**WavePoint** — T3 Stack Next.js 16 app for sacred geometry. Uses App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (New York style), Radix UI Themes (dark default), MDX content via `next-mdx-remote`, React Query (server state), Vitest, Stripe (subscriptions), and Auth.js v5 (credentials auth).

## First Time Setup

```bash
cp .env.example .env       # Copy environment template
pnpm install               # Install dependencies
npx drizzle-kit push       # Push schema to database
pnpm check                 # Verify everything works
```

## Commands

```bash
pnpm dev          # Dev server (Turbopack)
pnpm check        # Lint + typecheck
pnpm lint:fix     # ESLint auto-fix
pnpm test         # Vitest
pnpm build        # Production build
```

## Key Patterns

- **Imports**: Use `@/*` for `src/` (e.g., `import { cn } from "@/lib/utils"`)
- **Styling**: `cn()` merges classes via clsx + tailwind-merge
- **Theme**: Light/dark via `src/lib/theme/` context provider
- **Env vars**: Define in `src/env.js`, prefix client vars with `NEXT_PUBLIC_`
- **Feature flags**: Each feature has `isXEnabled()` in its `feature-flags.ts`

---

## Features

### Signal (Angel Number Tracking)

Authenticated users capture angel number sightings with AI-powered interpretations.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/signal/index.ts` | Lib exports: schemas, Claude API, subscriptions |
| `src/hooks/signal/index.ts` | React Query hooks |
| `src/app/signal/` | Pages: dashboard, capture, sighting detail |
| `src/app/api/signal/` | API routes |

**Hooks**: `useSightings`, `useSighting`, `useCreateSighting`, `useUpdateSighting`, `useDeleteSighting`, `useAdjacentSightings`, `useStats`, `useHeatmap`, `useRegenerateInterpretation`

**Feature flag**: `isSignalEnabled()` — requires `NEXT_PUBLIC_SIGNAL_ENABLED=true`

**Subscriptions**: Free tier + Insight tier with interpretation regeneration limits. See `src/lib/signal/subscriptions.ts`.

### Numbers (Angel Number Content Hub)

Public content pages for 90 angel number patterns with meanings and statistics.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/numbers/` | Pattern data, stats queries |
| `src/hooks/numbers/index.ts` | React Query hooks |
| `src/app/numbers/` | Pages: index, pattern detail |

**Hooks**: `usePatterns`, `usePattern`, `useNumberStats`, `useNumberStat`

### Auth (Authentication)

Auth.js v5 with credentials provider, email verification, password reset, and admin roles.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/auth/index.ts` | Auth.js instance (`auth`, `signIn`, `signOut`) |
| `src/lib/auth/config.ts` | Provider configuration |
| `src/lib/auth/tokens.ts` | Verification/reset token utilities |
| `src/app/auth/` | Pages: sign-in, register, verify, reset |

**Feature flag**: `isAuthEnabled()` — requires `NEXT_PUBLIC_AUTH_ENABLED=true`

**Admin check**: `ADMIN_EMAILS` env var (comma-separated)

### Invites (Closed Beta)

Invite code system for gated registration during closed beta.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/invites/` | Code generation, validation, Brevo CRM sync |

**Feature flag**: Requires `NEXT_PUBLIC_INVITES_REQUIRED=true`

### Calendar (Cosmic Calendar)

Multi-scale cosmic calendar with moon phases, personal transits, journal entries, and sightings integration.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/calendar/index.ts` | Lib exports: schemas, types, feature flag |
| `src/lib/transits/index.ts` | Transit calculations for natal chart aspects |
| `src/hooks/calendar/index.ts` | React Query hooks |
| `src/app/calendar/` | Pages: month view, day view |
| `src/app/api/calendar/` | API routes: ephemeris, journal, transits |

**Hooks**: `useEphemeris`, `useEphemerisRange`, `useTransits`, `useJournalEntries`, `useJournalEntry`, `useCreateJournalEntry`, `useUpdateJournalEntry`, `useDeleteJournalEntry`

**Feature flag**: `isCalendarEnabled()` — requires `NEXT_PUBLIC_CALENDAR_ENABLED=true`

**Key features**:
- Month view with moon phase indicators (FULL/NEW labels on peak days)
- Day view with cosmic weather, personal transits, journal, and sightings
- Day-to-day navigation with moon phase previews
- Timezone-aware ephemeris calculations
- Journal entries with cosmic snapshots

### Spiritual Fingerprint (Profile Personalization)

Evolving user profile based on sighting patterns, resonance feedback, and geometry affinities.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/templates/index.ts` | Template-based interpretation assembly |
| `src/lib/patterns/index.ts` | Pattern computation (time, mood, activity, trends) |
| `src/lib/resonance/index.ts` | Resonance feedback types and schemas |
| `src/lib/geometry/index.ts` | Geometry affinity types and schemas |
| `src/hooks/patterns/index.ts` | `usePatterns` hook |
| `src/hooks/resonance/index.ts` | `useResonance`, `useResonanceSummary` hooks |
| `src/hooks/geometry/index.ts` | `useGeometryAffinities`, `useUpdateGeometryAffinity` hooks |
| `src/components/profile/` | ResonanceSummary, PatternsSection, GeometryAffinities |

**Key features**:
- Template system: base templates + modifiers (moon/mood/activity/element) + pattern injections
- Pattern insights: peak hours, day distribution, mood/activity correlations, frequency trends
- Resonance tracking: users mark if interpretations resonate (yes/no/not sure)
- Geometry affinities: 1-5 ratings for Platonic solids with optimistic UI
- Profile integration: "Your Signal Fingerprint" section on /profile

### Geometries (Sacred Geometry Content)

MDX content pages for Platonic solids and patterns with relationship graphs.

| Entry Point | Purpose |
|-------------|---------|
| `src/lib/data/` | Geometry definitions, relationships, helpers |
| `src/content/` | MDX files: `platonic-solids/`, `patterns/` |
| `src/app/geometries/` | Dynamic routes: `[category]/[slug]` |

**Key exports**: `getGeometryBySlug()`, `getRelatedGeometries()`, `getGeometryPath()`

**Adding geometries**: Add to `platonic-solids.ts` or `patterns.ts`, then add relationships to `relationships.ts`. Inverses auto-compute.

---

## UI Components

### Authenticated Sidebar

Collapsible sidebar for authenticated users with navigation and cosmic context.

| Entry Point | Purpose |
|-------------|---------|
| `src/components/sidebar/app-sidebar.tsx` | Main sidebar component |
| `src/components/sidebar/sidebar-nav.tsx` | Navigation sections |
| `src/lib/sidebar/index.ts` | Sidebar state context (`useSidebar`) |

**Features**:
- User identity section with avatar
- Live moon phase display with glow effects
- Quick capture CTA button
- Practice section: Signal, Calendar
- Account section: Profile, Settings, Admin (if admin)
- Collapsible to icon rail (state persisted)
- Mobile drawer variant

**Navigation structure**:
```
PRACTICE
├── Signal (/signal)
└── Calendar (/calendar)

ACCOUNT
├── Profile (/profile)
├── Settings (/settings)
└── Admin (/admin) — admins only
```

---

## Infrastructure

### Database (Drizzle + Neon)

Schema in `src/lib/db/schema.ts`. Tables:

| Domain | Tables |
|--------|--------|
| Auth | `users`, `sessions`, `accounts`, `verificationTokens`, `addresses` |
| Signal | `signalSightings`, `signalInterpretations`, `signalUserActivityStats`, `signalUserNumberStats`, `signalSubscriptions`, `signalSubscriptionUsage` |
| Calendar | `calendarJournalEntries` |
| Profile | `spiritualProfiles` (natal chart data for transits) |
| Fingerprint | `interpretationResonance`, `geometryAffinities`, `userPatternInsights` |
| Beta | `invites`, `waitlistSignups`, `contactSubmissions` |

```bash
npx drizzle-kit push      # Push schema changes
npx drizzle-kit studio    # Open DB GUI
```

### Email (Brevo)

Transactional emails via `src/lib/email/`. Used for verification, password reset, invite codes.

**Optional**: Disabled if `BREVO_API_KEY` not set.

### Rate Limiting

Upstash Redis with in-memory fallback. See `src/lib/rate-limit/`.

**Optional**: Falls back to in-memory if Redis env vars not set.

### Analytics (Mixpanel)

Product analytics via `src/lib/analytics/`. Tracks user behavior, sign-ups, and sessions.

| Export | Purpose |
|--------|---------|
| `AnalyticsProvider` | React provider (initialized in root layout) |
| `track(event, properties)` | Track custom events |
| `identify(userId, properties)` | Identify authenticated users |
| `reset()` | Clear user identity on sign-out |

**Features**: Autocapture, session replay (100%), automatic page views, user identification synced with auth.

**Optional**: Disabled if `NEXT_PUBLIC_MIXPANEL_TOKEN` not set.

### Feature Access

Centralized access control with admin overrides. See `src/lib/features/`.

---

## Development Workflow

- **Feature implementations**: Use `/feature-dev:feature-dev` skill for guided development
- **Prefer agents**: Use Task tool with specialized agents (`feature-dev:code-architect`, `feature-dev:code-explorer`, `feature-dev:code-reviewer`)
- **Sub-agent model**: All sub-agents must use Claude Opus (`model: "opus"`)
- **Code review**: After implementations, use `feature-dev:code-reviewer` agent

### Parallel Development with Git Worktrees

Use git worktrees when implementing plans or working on features that should be isolated from the main workspace. This enables multiple Claude Code instances to work on different branches concurrently.

**When to use worktrees**:
- Before executing an implementation plan
- When starting feature work that needs isolation
- When you want parallel Claude Code instances on different features

**How**: Use `/superpowers:using-git-worktrees` skill to create worktrees with proper setup.

**Worktree location**: `~/Workbench/.worktrees/wavepoint/<branch-name>/`

**Setup in new worktree**:
```bash
pnpm install              # Install dependencies
cp ../.env .env           # Copy env from sibling worktree (or main)
```

**After completion**: Merge or create PR, then remove worktree with `git worktree remove <path>`.

---

## Resources

### PRDs

| Feature | PRD | Status |
|---------|-----|--------|
| Signal | `docs/prds/signal.md` | In Development |
| Numbers | `docs/prds/numbers.md` | Shipped |
| Calendar | `docs/plans/2026-01-26-calendar-implementation.md` | Shipped |
| Fingerprint | `docs/plans/2026-01-26-fingerprint-core.md` | In Development |

### UX Guidelines

Located in `docs/ux/`. Brand positioning: "Modern mystic" — sophisticated spirituality.

Key docs: `personas.md`, `design-principles.md`, `voice-and-tone.md`, `interaction-patterns.md`

### ADRs

Architecture Decision Records in `docs/adr/`.

### Business Context (Obsidian)

Deeper context via MCP: `Areas/WavePoint/PRDs/`, `Areas/WavePoint/Metrics/`, `Areas/WavePoint/Decisions/`

### Linear Integration

- **Project**: WavePoint | **Team**: Sherpa | **Prefix**: `SG-`
- **Branch format**: `sg-<issue-number>-<slugified-title>`
- **Commits**: Reference issue ID (e.g., `SG-74: Add typography`)
- **Auto-close**: Issues marked Done when branch merged

---

## Environment Variables

Source of truth: `src/env.js`. All variables validated with Zod.

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret (min 32 chars) |
| `STRIPE_SECRET_KEY` | Stripe server key (`sk_*`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification (`whsec_*`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client key (`pk_*`) |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_AUTH_ENABLED` | `false` | Enable authentication |
| `NEXT_PUBLIC_SIGNAL_ENABLED` | `false` | Enable Signal feature |
| `NEXT_PUBLIC_CALENDAR_ENABLED` | `false` | Enable Calendar feature |
| `NEXT_PUBLIC_INVITES_REQUIRED` | `false` | Require invite codes for registration |

### Optional Services

| Variable | Description |
|----------|-------------|
| `APP_URL` | Base URL for redirects (default: `http://localhost:3000`) |
| `ANTHROPIC_API_KEY` | Claude API for Signal interpretations |
| `STRIPE_SIGNAL_WEBHOOK_SECRET` | Separate webhook for Signal subscriptions |
| `BREVO_API_KEY` | Brevo transactional email |
| `EMAIL_FROM_ADDRESS` | From address (default: `noreply@wavepoint.space`) |
| `EMAIL_FROM_NAME` | From name (default: `WavePoint`) |
| `BREVO_BETA_LIST_ID` | Beta users list ID |
| `BREVO_CONTACT_LIST_ID` | Contact form submissions list ID |
| `BREVO_WAITLIST_LIST_ID` | Signal waitlist list ID |
| `CONTACT_NOTIFICATION_EMAIL` | Receives contact form notifications |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Mixpanel project token (analytics) |

---

## Directory Structure

```
src/app/                    # App Router pages
  admin/                    # Admin pages
  api/                      # API routes
    calendar/               # Calendar API (ephemeris, journal, transits)
    profile/                # Profile API (geometry-affinities, resonance-summary)
    signal/                 # Signal API (sightings, patterns, resonance)
  auth/                     # Auth pages (sign-in, register, verify)
  calendar/                 # Calendar pages (month view, day/[date])
  contact/                  # Contact form
  geometries/               # Sacred geometry content ([category]/[slug])
  numbers/                  # Angel number content hub
  profile/                  # User profile page
  settings/                 # User settings (profile, address)
  signal/                   # Signal pages (dashboard, capture, sighting)
src/components/
  ui/                       # shadcn/ui components
  calendar/                 # Calendar UI components
  dashboard/                # Modular dashboard sections
  geometry/                 # Geometry-specific components
  profile/                  # Profile components (Fingerprint section)
  sidebar/                  # Authenticated user sidebar
  signal/                   # Signal UI components
src/lib/
  analytics/                # Mixpanel analytics
  auth/                     # Auth.js configuration
  calendar/                 # Calendar: types, schemas, feature flag
  contact/                  # Contact form + Brevo sync
  data/                     # Geometries data
  db/                       # Drizzle ORM + schema
  email/                    # Brevo transactional emails
  features/                 # Feature access control
  geometry/                 # Geometry affinity types/schemas
  invites/                  # Invite code system
  numbers/                  # Angel number patterns
  patterns/                 # Pattern computation for fingerprint
  resonance/                # Resonance feedback types/schemas
  rate-limit/               # Upstash Redis rate limiting
  sidebar/                  # Sidebar state context
  signal/                   # Signal: Claude API, subscriptions
  stripe/                   # Stripe client for subscriptions
  templates/                # Interpretation template system
  theme/                    # Light/dark theme context
  transits/                 # Personal transit calculations
  waitlist/                 # Waitlist signups + Brevo sync
src/hooks/
  calendar/                 # Calendar React Query hooks
  geometry/                 # Geometry affinity hooks
  numbers/                  # Numbers React Query hooks
  patterns/                 # Pattern insights hooks
  resonance/                # Resonance feedback hooks
  signal/                   # Signal React Query hooks
src/content/                # MDX files (platonic-solids/, patterns/)
docs/
  adr/                      # Architecture Decision Records
  plans/                    # Implementation plans
  prds/                     # Product Requirements Documents
  ux/                       # UX guidelines
```

---

## Common Issues

**`pnpm check` fails with env errors**: Copy `.env.example` to `.env` and fill required values.

**Database schema out of sync**: Run `npx drizzle-kit push` after pulling changes.

**Feature not appearing**: Check feature flag is set to `true` in `.env`.

**Rate limiting errors in dev**: Redis env vars optional — falls back to in-memory.

---

## For AI Agents

**Entry points by feature**: Each `src/lib/*/index.ts` exports the public API. Start there.

**Hooks pattern**: React Query hooks in `src/hooks/*/`. Check `index.ts` for available hooks.

**API routes**: Follow `src/app/api/*/` structure. All use `src/lib/` modules.

**Adding features**: Create `src/lib/*/` module, add feature flag, create hooks if client-side state needed.

**Sidebar context**: Use `useSidebar()` from `@/lib/sidebar` for collapse state.

**Transit calculations**: Use `src/lib/transits/` for natal chart transit aspects. Requires user's `spiritualProfiles` data.
