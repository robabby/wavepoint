# Invite System Design

## Overview

Closed beta invite system enabling admin-controlled account creation. Only users with valid invite codes can register. Integrates with Brevo for contact management and invite funnel tracking.

## Goals

- Gate registration to invited users only
- Track invite status in both database and Brevo CRM
- Simple admin interface for creating and managing invites
- Foundation for future referral system

## Technical Approach

Database holds invite codes as source of truth. Brevo syncs contact status for CRM visibility. Registration validates code + email match before creating accounts.

## Database Schema

```sql
invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,              -- 'SG-X7K9M2'
  email TEXT NOT NULL,                    -- Invited email (lowercase, trimmed)
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'redeemed'
  brevo_contact_id TEXT,                  -- Brevo contact ID for updates
  redeemed_by UUID REFERENCES users(id),  -- User who redeemed (after signup)
  redeemed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(email)  -- One active invite per email
)
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Email uniqueness | One invite per email prevents duplicates |
| Simple status | Just `pending` and `redeemed`; add `revoked` later if needed |
| Store Brevo contact ID | Enables updates without re-querying by email |
| Link to redeemed user | Supports future referral attribution |

### Code Generation

```typescript
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0/O/1/I confusion
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `SG-${random}`;
}
```

## Registration Flow

### Environment Variable

```bash
NEXT_PUBLIC_INVITES_REQUIRED="true"  # Gates registration, default: false
```

### Flow Diagram

```
User visits /invite/SG-X7K9M2
    │
    └─► Opens AuthModal in sign-up view with code pre-filled
            │
            User enters email + password
            │
            POST /api/auth/register
                ├─► Validate invite code exists and is pending
                ├─► Validate email matches invite email (case-insensitive)
                ├─► If mismatch: "This invite was sent to a different email"
                ├─► Create user (existing flow)
                ├─► Mark invite as redeemed
                └─► Update Brevo contact: INVITE_STATUS = "joined"
```

### Invite Landing Page

Route: `/invite/[code]/page.tsx`

Validates code exists, shows welcome message, opens auth modal with code pre-filled.

### Direct Signup Without Code

When `NEXT_PUBLIC_INVITES_REQUIRED=true` and no code provided:

> "Registration is currently invite-only. Request an invite or enter your code."

## Admin UI

### Access Control

Email allowlist via environment variable:

```bash
ADMIN_EMAILS="rob@example.com"  # Comma-separated
```

The `/admin` layout checks logged-in user's email against this list. Returns 404 for non-admins.

### Page Layout (`/admin/invites`)

```
┌─────────────────────────────────────────────────────────┐
│  Invites                              [+ New Invite]    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ sarah@example.com                               │    │
│  │ SG-X7K9M2 · Sent Jan 15 · Pending        [Copy] │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ mike@example.com                                │    │
│  │ SG-R4T8N1 · Sent Jan 12 · Joined Jan 13        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### New Invite Flow

Form fields:
- Email address (required)

On submit:
1. Generate unique code
2. Insert into `invites` table
3. Create Brevo contact with `INVITE_STATUS = "invited"` (fire-and-forget)
4. Return success with invite code and link for admin to copy

**v1 Note:** Email sending is deferred. Admin manually copies and shares the invite link.

### API Routes

| Route | Method | Purpose | v1 Status |
|-------|--------|---------|-----------|
| `/api/admin/invites` | GET | List all invites | ✓ |
| `/api/admin/invites` | POST | Create new invite | ✓ |
| `/api/admin/invites/[id]/resend` | POST | Resend invite email | Deferred |

## Brevo Integration

### Contact Attributes

Create in Brevo dashboard:

| Attribute | Type | Values |
|-----------|------|--------|
| `INVITE_STATUS` | Category | `invited`, `joined` |
| `INVITE_CODE` | Text | `SG-X7K9M2` |
| `INVITED_AT` | Date | Timestamp |
| `JOINED_AT` | Date | Timestamp |

**Status:** ✅ Attributes created in Brevo dashboard.

### Contact List

Create list: "Beta Users" — all invitees added here.

**Status:** ✅ List created in Brevo dashboard.

### API Integration

```typescript
// On invite creation
await brevo.contacts.createContact({
  email: inviteeEmail,
  listIds: [BETA_USERS_LIST_ID],
  attributes: {
    INVITE_STATUS: 'invited',
    INVITE_CODE: code,
    INVITED_AT: new Date().toISOString(),
  },
});

// On signup (redemption)
await brevo.contacts.updateContact(inviteeEmail, {
  attributes: {
    INVITE_STATUS: 'joined',
    JOINED_AT: new Date().toISOString(),
  },
});
```

### Invite Email Template

Create transactional template in Brevo UI. Dynamic params:
- `{{ params.INVITE_CODE }}` — The code
- `{{ params.INVITE_URL }}` — `https://sacredgeometry.site/invite/SG-X7K9M2`

### Graceful Degradation

Brevo API failures don't block invites. If sync fails:
- Log error for monitoring
- Invite still works (DB is source of truth)
- User can still join even if Brevo update fails

## File Structure

### New Files

```
src/lib/invites/
  index.ts              # Export public functions
  schemas.ts            # Zod validation (email, code format)
  codes.ts              # generateInviteCode() utility
  service.ts            # Database CRUD operations
  brevo.ts              # Brevo contact sync functions

src/lib/auth/
  admin.ts              # isAdmin(), requireAdmin() helpers

src/app/invite/
  [code]/
    page.tsx            # Invite landing page (RSC)
    _components/        # Page-specific client components

src/app/admin/
  layout.tsx            # Admin access check (email allowlist, 404 for non-admins)
  invites/
    page.tsx            # Invite management UI (RSC)
    _components/        # Admin client components (list, card, modal)

src/app/api/admin/
  invites/
    route.ts            # GET (list) + POST (create)
```

### Modified Files

| File | Changes |
|------|---------|
| `src/env.js` | Add `NEXT_PUBLIC_INVITES_REQUIRED`, `ADMIN_EMAILS`, `BREVO_BETA_LIST_ID`, `BREVO_INVITE_TEMPLATE_ID` |
| `src/lib/db/schema.ts` | Add `invites` table definition |
| `src/components/auth/sign-up-form.tsx` | Add invite code field when required |
| `src/app/api/auth/register/route.ts` | Validate invite, mark redeemed, sync Brevo |

## Environment Variables

```bash
# Invite System
NEXT_PUBLIC_INVITES_REQUIRED="false"  # Gate registration (default: false)
ADMIN_EMAILS="rob@example.com"        # Comma-separated admin emails

# Brevo (additional)
BREVO_BETA_LIST_ID="123"              # Beta Users list ID
BREVO_INVITE_TEMPLATE_ID="456"        # Invite email template ID
```

## Feature Flag Behavior

| `INVITES_REQUIRED` | `AUTH_ENABLED` | Behavior |
|--------------------|----------------|----------|
| `false` | `true` | Open registration |
| `true` | `true` | Invite-only registration |
| `true` | `false` | N/A — auth disabled |

## Error Messages

| Scenario | Message |
|----------|---------|
| Invalid code | "Invalid invite code" |
| Already redeemed | "This invite has already been used" |
| Email mismatch | "This invite was sent to a different email address" |
| No code (when required) | "Registration is currently invite-only" |

## Implementation Workflow

This feature will be implemented in three distinct sessions, clearing context between each to maintain quality.

### Session 1: Frontend Design (`/frontend-design`)

Design UI components following project design system. Run parallel sub-agents for independent screens:

| Sub-agent | Focus | Output |
|-----------|-------|--------|
| Admin Invites Page | `/admin/invites` layout, invite cards, new invite modal | Component specs, responsive behavior |
| Invite Landing Page | `/invite/[code]` welcome screen, CTA to auth modal | Component specs, empty/error states |
| Sign-up Form Updates | Invite code field integration, validation UX | Field placement, error display |

**Deliverable:** UI specifications added to this document, mockup references if applicable.

**Then:** Run `/pickup` to capture context, clear session.

---

### Session 2: Feature Development (`/feature-dev`)

Implement backend and frontend with architecture focus. Sequential phases due to dependencies:

**Phase 1: Foundation**
1. Add `invites` table to Drizzle schema
2. Run database migration
3. Create `src/lib/invites/` utilities (code generation, validation)
4. Add environment variables to `src/env.js`

**Phase 2: Brevo Integration**
1. Create Brevo contact sync functions
2. Add error handling with graceful degradation
3. Test contact creation and status updates

**Phase 3: Admin UI**
1. Create admin layout with email allowlist check
2. Build `/admin/invites` page
3. Implement admin API routes (list, create, resend)

**Phase 4: Registration Gating**
1. Add invite code field to sign-up form
2. Update `/api/auth/register` to validate invites
3. Create `/invite/[code]` landing page
4. Wire up Brevo status update on redemption

**Deliverable:** Working invite system behind feature flag.

**Then:** Run `/pickup` to capture context, clear session.

---

### Session 3: Linear Issues

Create work items from the detailed implementation plan:

| Issue | Title | Dependencies |
|-------|-------|--------------|
| SG-TBD | Add invites table schema | Auth system complete |
| SG-TBD | Create invite code utilities | Schema |
| SG-TBD | Implement Brevo contact sync | Utilities |
| SG-TBD | Create admin layout and access control | — |
| SG-TBD | Build admin invites page and API | Admin layout, Brevo sync |
| SG-TBD | Add invite code to sign-up form | Utilities |
| SG-TBD | Gate registration with invite validation | Sign-up form |
| SG-TBD | Create invite landing page | Registration gating |

**Deliverable:** Linear issues created, linked, ready for scheduling.

---

## Implementation Phases (Execution Order)

### Phase 1: Build Foundation
1. Add `invites` table schema
2. Create invite code generation utilities
3. Build Brevo contact sync functions
4. Create admin layout with email allowlist check
5. Build `/admin/invites` page and API routes

### Phase 2: Gate Registration
1. Add invite code field to sign-up form (conditional)
2. Update `/api/auth/register` to validate invites
3. Create `/invite/[code]` landing page
4. Set up Brevo template and contact attributes

### Phase 3: Go Live
1. Set `NEXT_PUBLIC_INVITES_REQUIRED=true`
2. Create first batch of invites
3. Send to initial circle

## UI Specifications

### Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-obsidian` | `#0c0c0c` | Page backgrounds |
| `--color-warm-charcoal` | `#1a1714` | Card backgrounds, input backgrounds |
| `--color-gold` | `#d4a84b` | Primary accent, CTAs, status highlights |
| `--color-gold-bright` | `#e8c068` | Hover states |
| `--color-cream` | `#f5f0e6` | Primary text |
| `--color-warm-gray` | `#b8a99a` | Secondary text |
| `--color-dim` | `#7a6b5a` | Tertiary text, placeholders |
| `--border-gold` | `rgba(212, 168, 75, 0.3)` | Card borders, dividers |
| `--glow-gold` | `rgba(212, 168, 75, 0.2)` | Hover glows |

**Typography:**
- Display: Cinzel Decorative (`font-display`)
- Headings: Cormorant Garamond (`font-heading`)
- Body: Crimson Pro (`font-body`)

---

### Admin Invites Page (`/admin/invites`)

**Purpose:** Manage beta invitations—create, track, and resend.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INVITES                            [+ Create Invite]    │  │
│  │  ───────                                                 │  │
│  │  Manage beta access to the inner circle                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  Stats bar: 12 total · 8 pending · 4 joined                   │
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ◈ sarah@example.com                           [Pending]   ││
│  │   SG-X7K9M2 · Invited Jan 15                              ││
│  │   [Copy Link]                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ◈ mike@example.com                            [Joined]    ││
│  │   SG-R4T8N1 · Joined Jan 13                               ││
│  │   [Copy Link]                                             ││
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

**Component Styles:**

| Element | Classes |
|---------|---------|
| Page title | `font-display text-page-title text-[var(--color-cream)]` |
| Subtitle | `text-[var(--color-warm-gray)]` |
| Create button | `bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] hover:glow-gold` |
| Invite card | `border-[var(--border-gold)]/30 bg-[var(--color-obsidian)] rounded-lg p-4` |
| Email display | `font-medium text-[var(--color-cream)]` |
| Code display | `font-mono text-sm text-[var(--color-gold)] tracking-wider` |
| Pending badge | `bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/30 text-xs px-2 py-0.5 rounded` |
| Joined badge | `bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5 rounded` |
| Action buttons | `text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] text-sm` |

**Create Invite Modal:**
```
┌──────────────────────────────────────────┐
│  CREATE INVITE                     [×]   │
│  ─────────────────                       │
│  Grant access to the inner circle        │
│                                          │
│  Email Address                           │
│  ┌────────────────────────────────────┐  │
│  │ someone@example.com                │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Create Invite              │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Success State (after creation):**
```
┌──────────────────────────────────────────┐
│  INVITE CREATED                    [×]   │
│  ─────────────────                       │
│                                          │
│  Invite link ready to share:             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ sacredgeometry.site/invite/SG-X7K9│  │
│  └────────────────────────────────────┘  │
│           [Copy Link]                    │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │            Done                    │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Empty State:**
```
┌────────────────────────────────────────────────────────────────┐
│                          ◇                                     │
│                                                                │
│               No invites yet                                   │
│     Create your first invite to begin building                 │
│               the inner circle.                                │
│                                                                │
│          ┌─────────────────────────────┐                       │
│          │       Create Invite         │                       │
│          └─────────────────────────────┘                       │
└────────────────────────────────────────────────────────────────┘
```

---

### Invite Landing Page (`/invite/[code]`)

**Purpose:** Welcome invited users and guide them to registration.

**Design Direction:** Ceremonial, welcoming. This is the user's first impression—make it feel like they're being welcomed into something special.

**Valid Invite Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                      ◇ ◇ ◇ ◇ ◇                                │
│                                                                │
│                   YOU'VE BEEN INVITED                          │
│                                                                │
│              Welcome to Sacred Geometry                        │
│                                                                │
│          Your unique access code: SG-X7K9M2                    │
│                                                                │
│          ┌─────────────────────────────────┐                   │
│          │       Accept Invitation         │                   │
│          └─────────────────────────────────┘                   │
│                                                                │
│          This invitation was sent to                           │
│          sarah@example.com                                     │
│                                                                │
│                      ◇ ◇ ◇ ◇ ◇                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Component Styles:**

| Element | Classes |
|---------|---------|
| Decorative pattern | `text-[var(--color-gold)]/40` SVG diamonds, spaced evenly |
| Main heading | `font-display text-hero text-[var(--color-cream)] tracking-wide text-center` |
| Subtitle | `font-heading text-section text-[var(--color-warm-gray)] text-center` |
| Code display | `font-mono text-2xl text-[var(--color-gold)] tracking-[0.3em] glow-gold` |
| CTA button | `bg-[var(--color-gold)] text-[var(--color-obsidian)] px-8 py-4 text-lg hover:glow-gold` |
| Email hint | `text-sm text-[var(--color-dim)] text-center` |

**Animation:**
- Page entrance: `animate-in fade-in duration-500` with slight scale (0.98 → 1.0)
- Code display: Subtle gold pulse animation (opacity 0.8 → 1.0 → 0.8)
- CTA button: Gentle glow intensity increase on hover

**Invalid Code State:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                   INVITATION NOT FOUND                         │
│                                                                │
│           This code doesn't exist or has expired               │
│                                                                │
│          ┌─────────────────────────────────┐                   │
│          │       Return Home               │                   │
│          └─────────────────────────────────┘                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Already Redeemed State:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                  INVITATION ALREADY USED                       │
│                                                                │
│             This code has already been redeemed                │
│                                                                │
│          ┌─────────────────────────────────┐                   │
│          │          Sign In                │                   │
│          └─────────────────────────────────┘                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Already Logged In (Email Matches) State:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                      ◇ ◇ ◇ ◇ ◇                                │
│                                                                │
│                   YOU ALREADY HAVE ACCESS                      │
│                                                                │
│          You're signed in as sarah@example.com                 │
│                                                                │
│          ┌─────────────────────────────────────┐               │
│          │       Continue to Dashboard        │               │
│          └─────────────────────────────────────┘               │
│                                                                │
│                      ◇ ◇ ◇ ◇ ◇                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Already Logged In (Email Mismatch) State:**
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                  SIGNED IN AS DIFFERENT USER                   │
│                                                                │
│          This invite was sent to sarah@example.com             │
│          You're signed in as other@example.com                 │
│                                                                │
│          ┌─────────────────────────────────────┐               │
│          │    Sign Out to Use This Invite     │               │
│          └─────────────────────────────────────┘               │
│                                                                │
│          ┌─────────────────────────────────────┐               │
│          │       Continue as other@...        │               │
│          └─────────────────────────────────────┘               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### Sign-up Form Updates

**Purpose:** Integrate invite code validation into existing auth modal.

**Conditional Display:** Show invite code field only when `NEXT_PUBLIC_INVITES_REQUIRED=true`.

**With Pre-filled Code (from `/invite/[code]`):**
```
┌──────────────────────────────────────────┐
│  CREATE ACCOUNT                    [×]   │
│  ─────────────────                       │
│  Join to save addresses and track orders │
│                                          │
│  Invite Code                             │
│  ┌────────────────────────────────────┐  │
│  │ SG-X7K9M2                      ✓   │  │  ← Pre-filled, readonly, validated
│  └────────────────────────────────────┘  │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐  │
│  │ sarah@example.com                  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Password                                │
│  ┌────────────────────────────────────┐  │
│  │ ••••••••                       👁  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          Create Account            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Already have an account? Sign in        │
└──────────────────────────────────────────┘
```

**Without Code (direct signup attempt):**
```
┌──────────────────────────────────────────┐
│  CREATE ACCOUNT                    [×]   │
│  ─────────────────                       │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ⚠ Registration is invite-only     │  │
│  │                                    │  │
│  │ You need an invite code to join.  │  │
│  │ Already have one? Enter it below. │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Invite Code                             │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│  Format: SG-XXXXXX                       │
│                                          │
│  Email                                   │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Password                                │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          Create Account            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Component Styles:**

| Element | Classes |
|---------|---------|
| Invite code input | Same as other inputs + `font-mono tracking-wider uppercase` |
| Pre-filled state | `bg-[var(--color-warm-charcoal)]/30 cursor-not-allowed` |
| Valid indicator | `text-emerald-400` checkmark icon |
| Format hint | `text-xs text-[var(--color-dim)]` |
| Warning banner | `bg-[var(--color-gold)]/10 border-[var(--color-gold)]/30 rounded-md p-3` |

**Validation Error Messages:**

| Scenario | Message | Display |
|----------|---------|---------|
| Invalid format | "Invalid invite code format" | Below input, red text |
| Code not found | "Invalid invite code" | Below input, red text |
| Already redeemed | "This invite has already been used" | Below input, red text |
| Email mismatch | "This invite was sent to a different email" | Below input, red text |

**AuthProvider Updates:**

Add `inviteCode` to auth modal state for passing from landing page:

```typescript
interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  inviteCode?: string;  // Pre-filled from /invite/[code]
}
```

---

### Responsive Behavior

**Admin Invites Page:**
- Desktop: Cards in single column with comfortable padding
- Mobile: Full-width cards, stacked actions below metadata

**Invite Landing Page:**
- Desktop: Centered content with generous vertical spacing
- Mobile: Reduced vertical spacing, full-width CTA button

**Sign-up Form:**
- Uses existing mobile bottom sheet pattern from AuthModal
- Invite code field appears at top of form fields

---

### Accessibility

- All interactive elements have visible focus states (gold ring)
- Status badges include `aria-label` for screen readers
- Form fields have proper `aria-describedby` for hints and errors
- Color is not the only indicator of status (icons accompany badges)
- Reduced motion: Disable animations via `prefers-reduced-motion`

## Implementation Notes

This section contains refined technical details from codebase analysis, to guide implementation.

### Clarified Decisions

| Question | Decision |
|----------|----------|
| Email field behavior on invite landing | Pre-fill AND lock (readonly) — user cannot change email |
| Invite email sending for v1 | **Deferred** — admin manually shares links |
| Already logged-in user visits invite link | **Smart check**: If logged-in email matches invite email → "You already have access." If mismatch → show sign-out option to use invite. |
| Resend email API for v1 | **Deferred** — remove from v1 scope |
| ADMIN_EMAILS env var scope | Server-only (not NEXT_PUBLIC) |

### Schema Refinements

The proposed schema needs these additions to match codebase patterns:

```typescript
// src/lib/db/schema.ts
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default("pending"),
  brevoContactId: text("brevo_contact_id"),
  redeemedBy: uuid("redeemed_by")
    .references(() => users.id, { onDelete: "set null" }),  // Added onDelete
  redeemedAt: timestamp("redeemed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),  // Added
});

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
```

**Changes from original:**
- Added `updatedAt` column (consistency with other tables)
- Added `onDelete: "set null"` to `redeemedBy` foreign key
- Use camelCase variable names mapping to snake_case SQL columns

### Revised File Structure

```
src/lib/invites/
  index.ts              # Export public functions
  schemas.ts            # Zod validation (renamed from schema.ts for consistency)
  codes.ts              # generateInviteCode() utility
  service.ts            # Database CRUD operations (NEW - follows token-service pattern)
  brevo.ts              # Brevo contact sync functions

src/lib/auth/
  admin.ts              # NEW: isAdmin(), requireAdmin() helpers

src/app/invite/
  [code]/
    page.tsx            # Invite landing page (RSC)
    _components/
      invite-welcome.tsx      # Valid invite welcome UI
      invalid-invite.tsx      # Invalid code state
      already-redeemed.tsx    # Code already used state
      already-logged-in.tsx   # User authenticated (handles email match → "already have access" OR mismatch → sign-out option)

src/app/admin/
  layout.tsx            # Admin access check (email allowlist, returns 404)
  invites/
    page.tsx            # Invite management UI (RSC)
    _components/
      invite-list.tsx         # Client component for list
      invite-card.tsx         # Individual invite display
      create-invite-modal.tsx # Create new invite dialog
```

### Invite Code Flow (URL Parameters)

The invite code flows through the system via URL parameters:

```
/invite/SG-X7K9M2 (Server Component validates code, fetches invite)
    │
    ├─► Invalid code → Render InvalidInvite component
    ├─► Already redeemed → Render AlreadyRedeemed component
    ├─► User logged in → Render AlreadyLoggedIn component
    │
    └─► Valid + not logged in → Render InviteWelcome
            │
            User clicks "Accept Invitation"
            │
            └─► Redirect to /?auth=sign-up&invite=SG-X7K9M2&email=sarah@example.com
                    │
                    AuthProvider reads params, stores in context
                    │
                    SignUpForm receives inviteData from context
                    │
                    └─► Email + code fields are readonly/pre-filled
```

### AuthProvider Context Extension

```typescript
// src/components/auth/auth-provider.tsx

interface InviteData {
  code: string;
  email: string;
}

interface AuthModalContextValue {
  isOpen: boolean;
  view: AuthView;
  inviteData: InviteData | null;  // NEW
  openModal: (view?: AuthView, invite?: InviteData) => void;  // MODIFIED
  closeModal: () => void;
  setView: (view: AuthView) => void;
  clearInviteData: () => void;  // NEW
}
```

**URL params to parse:** `auth`, `invite`, `email` (cleaned after reading)

### Admin Authorization Pattern

```typescript
// src/lib/auth/admin.ts
import { env } from "@/env";
import type { Session } from "next-auth";

export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.email) return false;
  const adminEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(session.user.email.toLowerCase());
}

// Usage in admin layout - return 404 to hide admin routes
if (!isAdmin(session)) {
  notFound();
}

// Usage in API routes - also return 404
if (!isAdmin(session)) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
```

### Registration Route Integration

Insert invite validation **after email normalization, before user existence check**:

```typescript
// src/app/api/auth/register/route.ts (modified flow)

1. Parse input (add optional inviteCode to schema)
2. Normalize email
3. IF env.NEXT_PUBLIC_INVITES_REQUIRED === "true":
   a. Validate invite code exists + status='pending'
   b. Validate email matches invite.email (case-insensitive)
   c. Return 400 with specific error if validation fails
4. Check if user exists (existing 409 logic)
5. Hash password
6. Create user
7. IF invite was validated:
   a. Mark invite as redeemed (set status, redeemed_by, redeemed_at)
   b. Sync Brevo status to "joined" (fire-and-forget)
8. Send verification email (existing fire-and-forget)
9. Return 201
```

**Note:** Neon HTTP driver doesn't support transactions. Accept sequential operations — the email constraint provides sufficient safety.

### Brevo Integration Pattern

Follow existing fire-and-forget pattern from verification emails:

```typescript
// On invite creation (admin route)
void syncInviteToBrevo(email, code, 'invited').catch((err) => {
  console.error("Failed to sync invite to Brevo:", err);
});

// On invite redemption (registration route)
void updateBrevoInviteStatus(email, 'joined').catch((err) => {
  console.error("Failed to update Brevo status:", err);
});
```

**Graceful degradation:** DB is source of truth. Brevo failures are logged but don't block operations.

### Environment Variables (Revised)

```bash
# Invite System
NEXT_PUBLIC_INVITES_REQUIRED="false"  # Gate registration (default: false)
ADMIN_EMAILS=""                       # Server-only, comma-separated admin emails

# Brevo (optional - features disabled if not set)
BREVO_BETA_LIST_ID=""                 # Beta Users list ID (optional for v1)
# BREVO_INVITE_TEMPLATE_ID=""         # Deferred - not needed for v1
```

### v1 Deferred Scope

These items are explicitly out of scope for v1:

- [ ] `POST /api/admin/invites/[id]/resend` — Resend email API
- [ ] "Send invite email now" checkbox in create modal
- [ ] `BREVO_INVITE_TEMPLATE_ID` env var
- [ ] Brevo transactional template for invite emails

Admin will manually copy and share invite links for v1.

### Error Messages

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Missing invite code (when required) | 400 | `{ error: "Invite code is required" }` |
| Invalid code format | 400 | `{ error: "Invalid invite code" }` |
| Code not found | 400 | `{ error: "Invalid invite code" }` |
| Code already redeemed | 400 | `{ error: "This invite has already been used" }` |
| Email mismatch | 400 | `{ error: "This invite was sent to a different email address" }` |
| Admin: email already invited | 409 | `{ error: "This email has already been invited" }` |

**Security note:** Use identical messages for "not found" and "invalid format" to prevent enumeration.

### Build Sequence

**Phase 1: Foundation**
1. Add env vars to `src/env.js`
2. Add `invites` table to `src/lib/db/schema.ts`
3. Run `pnpm drizzle-kit push`
4. Create `src/lib/invites/` module (schemas, codes, service)
5. Create `src/lib/auth/admin.ts` helper

**Phase 2: Brevo Integration**
1. Create `src/lib/invites/brevo.ts` with contact sync functions
2. Add graceful degradation (log errors, don't block)

**Phase 3: Admin UI**
1. Create `src/app/admin/layout.tsx` with access control
2. Create `src/app/admin/invites/page.tsx` (RSC)
3. Create admin client components (list, card, modal)
4. Implement `POST /api/admin/invites` route

**Phase 4: Registration Gating**
1. Extend `AuthProvider` with `inviteData` state
2. Update `SignUpForm` with conditional invite code field
3. Update `signUpSchema` with optional `inviteCode`
4. Modify `/api/auth/register` to validate invites
5. Create `/invite/[code]` landing page

## Relationship to Feature Flags

The invite system gates **account creation**, not feature access. Once a user has an account, their access to specific features is controlled by separate feature flags:

| System | What It Controls |
|--------|------------------|
| Invite System | Who can create an account |
| `NEXT_PUBLIC_SHOP_ENABLED` | Shop visibility for all users |
| `NEXT_PUBLIC_SIGNAL_ENABLED` | Signal visibility for all users |

This means:
- All registered users are in the "beta cohort"
- Feature rollout is controlled independently via flags
- No per-user feature access needed for v1

**Future consideration:** If per-user feature access is needed (e.g., Signal beta for subset of users), add a `feature_access` table or user flags. This is explicitly out of scope for v1.

### Related Plans

- [Signal Feature Plan](./2026-01-18-signal-angel-number-tracking.md) — First feature using this access model

## Linear Issues

Implementation tracked in Linear (all in Backlog):

| Issue | Title | Dependencies |
|-------|-------|--------------|
| [SG-293](https://linear.app/sherpagg/issue/SG-293) | Add invites table schema and environment variables | — |
| [SG-294](https://linear.app/sherpagg/issue/SG-294) | Create invite code utilities module | SG-293 |
| [SG-295](https://linear.app/sherpagg/issue/SG-295) | Create admin authorization helper | — |
| [SG-296](https://linear.app/sherpagg/issue/SG-296) | Implement Brevo contact sync for invites | SG-294 |
| [SG-297](https://linear.app/sherpagg/issue/SG-297) | Build admin layout and access control | SG-295 |
| [SG-298](https://linear.app/sherpagg/issue/SG-298) | Build admin invites page and API | SG-297, SG-296 |
| [SG-299](https://linear.app/sherpagg/issue/SG-299) | Add invite code support to sign-up form | SG-294 |
| [SG-300](https://linear.app/sherpagg/issue/SG-300) | Gate registration with invite validation | SG-299 |
| [SG-301](https://linear.app/sherpagg/issue/SG-301) | Create invite landing page | SG-300 |

## Future Additions (Out of Scope)

- Anonymous codes (no email attached)
- User-generated invites ("You have 3 invites")
- Invite expiration
- Referral tracking and rewards
- Multiple invites per email (re-invite flow)
- Per-user feature access control
