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

## Implementation Phases

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

## Future Additions (Out of Scope)

- Anonymous codes (no email attached)
- User-generated invites ("You have 3 invites")
- Invite expiration
- Referral tracking and rewards
- Multiple invites per email (re-invite flow)
