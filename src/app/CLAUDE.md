# src/app/ — App Router Conventions

## Auth Guard Pattern

```ts
const session = await auth()
if (!session?.user) redirect("/auth/sign-in")
if (!canAccessSignal(session.user)) redirect("/")
```

## Page Requirements

- **Export `metadata`** from every `page.tsx` (title, description)
- **Suspense boundaries**: Wrap async content with `<Suspense fallback={<SacredSpinner />}>`
- **Authenticated routes**: Use sidebar layout (`src/components/sidebar/`)
- **Redirects**: Define in `next.config.js`, not in components

## Route Organization

- Feature pages at top level: `/home`, `/capture`, `/sightings`, `/calendar`
- API routes under `api/` — see `src/app/api/CLAUDE.md`
- Auth pages under `auth/`
- Public content: `/geometries`, `/numbers`, `/numerology`

## Layout Hierarchy

- Root layout: theme provider, analytics, fonts
- Authenticated layout: sidebar wrapper (applies to `/home`, `/sightings`, `/capture`, etc.)
- Public layout: marketing header/footer

## Loading States

Use `loading.tsx` files for route-level suspense, `SacredSpinner` for component-level.
