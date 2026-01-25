# Spiritual Profile Information Architecture Proposal

**Purpose**: Define where Spiritual Profile pages fit in WavePoint's navigation and how they integrate with existing Account and Signal flows.

**Status**: Draft for review

**Date**: 2026-01-24

---

## The Core Insight

A Spiritual Profile is **your identity**, not a feature setting. It deserves prominence as a first-class citizen in the app, not buried under Account or scoped to Signal.

Think of it like this:
- **Account** = Administrative (email, password, subscription, address)
- **Signal** = Feature (capture sightings, view interpretations)
- **Profile** = Identity (who you are spiritually, your cosmic fingerprint)

---

## Proposed IA

```
/                       → Landing / Marketing
/account                → Administrative settings
  /account/address      → Shipping address (existing)
  /account/subscription → Signal subscription (existing, implicit)
/profile                → Your Spiritual Profile (NEW)
  /profile/edit         → Edit birth data (NEW)
/signal                 → Angel number tracking (existing)
  /signal/capture       → Log a sighting (existing)
  /signal/sighting/[id] → View sighting detail (existing)
  /signal/settings      → Signal-specific settings (existing)
/numbers                → Angel number content (existing)
/geometries             → Sacred geometry content (existing)
```

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  WavePoint                    [Profile]  [Signal]  [Account]│
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                           ┌───────────────┐
                           │  Your Profile │
                           │  ────────────│
                           │  ☉ Sun: ♊    │
                           │  ☽ Moon: ♓   │
                           │  ↑ Rising: ♎ │
                           │               │
                           │  [Edit]       │
                           └───────────────┘
```

**Profile** becomes a top-level nav item, sitting between the user's activity (Signal) and their settings (Account).

---

## Page Definitions

### `/profile` - Your Spiritual Profile

**Purpose**: A beautiful, read-focused view of your spiritual identity.

**Content**:
- Chart wheel visualization (Phase 2)
- The Big Three prominently displayed
- Element balance (Fire/Earth/Air/Water distribution)
- Modality balance (Cardinal/Fixed/Mutable)
- Geometry affinities derived from chart
- Number pattern affinities (based on planetary associations)
- "Your Cosmic Fingerprint" summary paragraph

**Empty State** (no profile yet):
- Invitation to "Discover your cosmic blueprint"
- Explanation of what birth data enables
- CTA: "Set up your profile" → `/profile/edit`

**Tone**: Celebratory, identity-affirming. This is YOU.

### `/profile/edit` - Edit Birth Data

**Purpose**: Form-focused page for entering/updating birth data.

**Content**:
- Birth date picker (required)
- Birth time input with "I don't know" option
- Time approximation selector if uncertain ("morning", "afternoon", etc.)
- Location autocomplete (city, country)
- Explanation of why each field matters
- Privacy note: "Your birth data is private and never shared"

**After Save**: Redirect to `/profile` with fresh calculations

**Tone**: Helpful, reassuring about privacy.

### `/account` - Account Settings (Modified)

**Remove**: Birth data (moves to `/profile/edit`)

**Keep**:
- Email display
- Signal subscription management
- Address management
- Password/security actions
- Sign out

**Add**: Link to "View your Profile" if profile exists

---

## User Flows

### Flow 1: New User Onboarding (Signal)

```
Sign Up → Email Verification → Signal Dashboard
                                     │
                                     ▼
                          ┌─────────────────────┐
                          │ "Unlock personalized│
                          │  interpretations"   │
                          │                     │
                          │ [Set up profile]    │
                          │ [Maybe later]       │
                          └─────────────────────┘
                                     │
                                     ▼ (if yes)
                              /profile/edit
                                     │
                                     ▼
                               /profile
                               (celebration!)
                                     │
                                     ▼
                          Back to Signal Dashboard
                          (now personalized)
```

**Key decisions**:
- Profile setup is **prompted but optional** during Signal onboarding
- User can skip and add later from `/profile`
- Signal works without a profile (generic interpretations)

### Flow 2: Existing User Adds Profile

```
Signal Dashboard → Notice: "Add your birth data for personalized insights"
       │
       ▼
    /profile (empty state)
       │
       ▼
    /profile/edit
       │
       ▼
    /profile (populated, celebration)
```

### Flow 3: User Updates Birth Data

```
/profile → [Edit] button → /profile/edit → Save → /profile
```

Or:

```
/account → "View Profile" link → /profile → [Edit] → ...
```

### Flow 4: Viewing Interpretation with Profile Context

```
/signal/sighting/[id]
       │
       ▼
┌─────────────────────────────────────────┐
│  You saw 444 on Jan 24, 2026            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ As a Gemini Sun with Moon in    │    │
│  │ Pisces, 444's earth energy      │    │
│  │ grounds your airy intellect...  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Based on your profile ↗                │
└─────────────────────────────────────────┘
```

The interpretation references the profile, with a subtle link back to `/profile`.

---

## Component Placement

### Header/Nav

```tsx
// Authenticated nav items (left to right or as appropriate)
<NavItem href="/signal">Signal</NavItem>
<NavItem href="/profile">Profile</NavItem>
<NavItem href="/account">Account</NavItem>
```

Or with icons:
```tsx
<NavItem href="/signal" icon={<Sparkles />}>Signal</NavItem>
<NavItem href="/profile" icon={<User />}>Profile</NavItem>
<NavItem href="/account" icon={<Settings />}>Account</NavItem>
```

### Signal Dashboard Prompt

If user has no profile, show a card:

```tsx
<Card>
  <CardTitle>Unlock Personalized Insights</CardTitle>
  <CardDescription>
    Add your birth data to receive interpretations tailored to your unique cosmic blueprint.
  </CardDescription>
  <Button asChild>
    <Link href="/profile">Set Up Profile</Link>
  </Button>
</Card>
```

### Signal Sighting Detail

If user has a profile, show attribution:

```tsx
<Text size="1" color="gray">
  Interpretation personalized for your profile · <Link href="/profile">View</Link>
</Text>
```

---

## Data Model Implications

The schema (`spiritualProfiles`) already supports this IA:
- 1:1 with users (not Signal-specific)
- Contains birth data + calculated chart
- Can be queried by any feature needing personalization

No schema changes needed.

---

## Open Questions

1. **Nav prominence**: Should Profile be in the main nav, or accessible via avatar/dropdown?
   - Recommendation: Main nav for now (it's a key differentiator)

2. **Profile visibility**: Should users be able to share their profile publicly?
   - Recommendation: Not for MVP. Keep private.

3. **Multiple profiles**: Should users be able to have profiles for others (partner, child)?
   - Recommendation: Not for MVP. One profile per user.

4. **Onboarding timing**: Prompt for profile during signup, or after first sighting?
   - Recommendation: After first sighting. Let them experience Signal first, then offer personalization.

---

## Implementation Phases

### Phase 1 (Current roadmap alignment)

- [ ] Create `/profile` page (empty state + populated state)
- [ ] Create `/profile/edit` page (birth data form)
- [ ] Add navigation link to Profile
- [ ] Integrate with Signal interpretation generation

### Phase 2 (Roadmap "User Experience" phase)

- [ ] Chart wheel visualization on `/profile`
- [ ] Geometry affinities display
- [ ] Number pattern trends
- [ ] Birth data onboarding prompt in Signal flow

---

## Alternatives Considered

### Alternative A: Profile under Account (`/account/profile`)

**Rejected because**: Buries identity under settings. Profile is more than a setting.

### Alternative B: Profile under Signal (`/signal/profile`)

**Rejected because**: Couples identity to a single feature. Profile should be available to any future feature.

### Alternative C: No dedicated Profile page

**Rejected because**: Misses opportunity to celebrate user's spiritual identity. The profile visualization is a key differentiator.

---

## Recommendation

**Proceed with `/profile` as a top-level route**, with:
- Read-focused view at `/profile`
- Edit form at `/profile/edit`
- Prompted (not forced) during Signal onboarding
- Referenced subtly in Signal interpretations

This gives the Spiritual Profile the prominence it deserves while keeping Account and Signal focused on their core purposes.
