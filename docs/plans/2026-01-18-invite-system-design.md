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
- Checkbox: "Send invite email now" (optional)

On submit:
1. Generate unique code
2. Insert into `invites` table
3. Create Brevo contact with `INVITE_STATUS = "invited"`
4. Send invite email if checkbox selected

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/invites` | GET | List all invites |
| `/api/admin/invites` | POST | Create new invite |
| `/api/admin/invites/[id]/resend` | POST | Resend invite email |

## Brevo Integration

### Contact Attributes

Create in Brevo dashboard:

| Attribute | Type | Values |
|-----------|------|--------|
| `INVITE_STATUS` | Text | `invited`, `joined` |
| `INVITE_CODE` | Text | `SG-X7K9M2` |
| `INVITED_AT` | Date | Timestamp |
| `JOINED_AT` | Date | Timestamp |

### Contact List

Create list: "Beta Users" — all invitees added here.

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
  schema.ts             # Zod validation (email, code format)
  codes.ts              # generateInviteCode() utility
  brevo.ts              # Brevo contact sync functions

src/app/invite/
  [code]/page.tsx       # Invite landing page

src/app/admin/
  layout.tsx            # Admin access check (email allowlist)
  invites/
    page.tsx            # Invite management UI

src/app/api/admin/
  invites/
    route.ts            # GET (list) + POST (create)
    [id]/
      resend/route.ts   # POST resend email
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
│  │   [Copy Link]  [Resend Email]                             ││
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
│  ☐ Send invite email immediately         │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Create Invite              │  │
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

## Future Additions (Out of Scope)

- Anonymous codes (no email attached)
- User-generated invites ("You have 3 invites")
- Invite expiration
- Referral tracking and rewards
- Multiple invites per email (re-invite flow)
