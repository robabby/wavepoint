# Authentication System Implementation Plan

## Overview

Add email/password authentication to enable:
- Pre-checkout shipping cost estimation (Printful API requires full address)
- Saved shipping addresses for checkout prefill
- Order history tracking

## Linear Issues

| Phase | Issue | Title |
|-------|-------|-------|
| 1 | [SG-267](https://linear.app/sherpagg/issue/SG-267) | Set up Neon database and Drizzle ORM |
| 2 | [SG-268](https://linear.app/sherpagg/issue/SG-268) | Configure Auth.js v5 with Credentials provider |
| 3a | [SG-269](https://linear.app/sherpagg/issue/SG-269) | Create AuthProvider and AuthModal |
| 3b | [SG-270](https://linear.app/sherpagg/issue/SG-270) | Create authentication forms |
| 3c | [SG-271](https://linear.app/sherpagg/issue/SG-271) | Create UserMenu and integrate into header |
| 4 | [SG-272](https://linear.app/sherpagg/issue/SG-272) | Implement email verification flow |
| 5 | [SG-273](https://linear.app/sherpagg/issue/SG-273) | Implement password reset flow |
| 6a | [SG-274](https://linear.app/sherpagg/issue/SG-274) | Create account layout, overview, and orders pages |
| 6b | [SG-275](https://linear.app/sherpagg/issue/SG-275) | Create address management page and API |
| 7 | [SG-276](https://linear.app/sherpagg/issue/SG-276) | Implement account deletion (GDPR compliance) |
| 8a | [SG-277](https://linear.app/sherpagg/issue/SG-277) | Create CheckoutGate component |
| 8b | [SG-278](https://linear.app/sherpagg/issue/SG-278) | Update checkout flow to require authentication |
| 9 | [SG-279](https://linear.app/sherpagg/issue/SG-279) | Implement shipping cost estimates |
| 10 | [SG-280](https://linear.app/sherpagg/issue/SG-280) | Implement rate limiting and account lockout |
| 11 | [SG-281](https://linear.app/sherpagg/issue/SG-281) | Add security headers |

**Dependency chain:** SG-267 → SG-268 → SG-269 → SG-270 → SG-271 → SG-272 → SG-273 → SG-274 → SG-275 → SG-276 → SG-277 → SG-278 → SG-279 → SG-280 → SG-281

## Tech Stack

| Component | Choice | Free Tier |
|-----------|--------|-----------|
| Database | Neon (serverless Postgres) | 0.5GB storage |
| ORM | Drizzle | - |
| Auth | Auth.js v5 (NextAuth) | - |
| Email | Brevo SMTP API | 300/day |

## Key Architecture Decisions

1. **Feature Flag**: Auth UI hidden behind `NEXT_PUBLIC_AUTH_ENABLED` (default: false) until ready for production, mirrors shop feature flag pattern
2. **Auth Modal Approach**: Use modals for sign-in/sign-up (matches CartDrawer/SearchCommand patterns), dedicated pages only for token-based flows (verify email, reset password)
3. **Rate Limiting**: In-memory Map storage (5 attempts/IP/minute) - best-effort on serverless; see Known Limitations
4. **Account Lockout**: Progressive lockout after 10 failed attempts per email
5. **Password Reset**: Included in initial scope
6. **Shipping Estimates**: Both cart drawer AND product pages
7. **Address Management**: Dedicated `/account/address` page
8. **Hard Cutover**: Checkout requires authentication (no guest checkout)

## Database Schema

```sql
-- Users table
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  email_verified TIMESTAMP,
  password_hash TEXT NOT NULL,
  name TEXT,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Verification tokens (email verification + password reset)
verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,           -- email
  token_hash TEXT NOT NULL UNIQUE,    -- SHA-256 hash (not plain token)
  type TEXT NOT NULL,                 -- 'email_verification' | 'password_reset' | 'account_unlock'
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(identifier, type)            -- Prevent duplicate active tokens
)

-- Sessions (Auth.js)
sessions (
  session_token TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
)

-- Shipping addresses (single per user via unique constraint)
addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Orders (webhook-driven)
orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Nullable for backward compat
  stripe_session_id TEXT NOT NULL UNIQUE,
  printful_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, processing, shipped, delivered, cancelled
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,     -- cents
  shipping INTEGER,              -- cents
  total INTEGER NOT NULL,        -- cents
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## New Files

```
src/lib/db/
  index.ts              # Drizzle client export
  schema.ts             # Drizzle schema definitions

src/lib/auth/
  index.ts              # Export auth, signIn, signOut
  config.ts             # Auth.js v5 configuration
  email.ts              # Brevo SMTP utilities with retry logic
  feature-flags.ts      # isAuthEnabled() - mirrors shop pattern
  rate-limit.ts         # In-memory rate limiting + account lockout
  schema.ts             # Zod validation schemas
  tokens.ts             # Token generation and hashing utilities

src/app/api/auth/
  [...nextauth]/route.ts    # Auth.js route handler
  register/route.ts         # POST: create account + send verification
  forgot-password/route.ts  # POST: send reset email
  unlock/route.ts           # POST: unlock account via token

src/app/api/account/
  address/route.ts          # GET/PUT shipping address
  delete/route.ts           # DELETE: account deletion (GDPR)

src/app/api/shipping/
  estimate/route.ts         # POST: Printful shipping rates

src/app/auth/
  verify/page.tsx           # Email verification token page
  reset-password/page.tsx   # Password reset with token
  unlock/page.tsx           # Account unlock token page

src/app/account/
  layout.tsx                # Protected layout with auth check
  page.tsx                  # Account overview with delete option
  address/page.tsx          # Shipping address form
  orders/page.tsx           # Order history

src/components/auth/
  auth-provider.tsx         # SessionProvider + modal state context
  auth-modal.tsx            # Dialog with sign-in/sign-up/forgot-password views
  sign-in-form.tsx          # Email/password form
  sign-up-form.tsx          # Registration form
  forgot-password-form.tsx  # Request reset
  reset-password-form.tsx   # Set new password
  user-menu.tsx             # Header dropdown
  checkout-gate.tsx         # Checkout requirement checks

src/components/shop/
  shipping-estimate.tsx     # Display estimated shipping cost

src/middleware.ts           # Rate limiting middleware

next.config.js              # Add security headers
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/env.js` | Add DATABASE_URL, AUTH_SECRET, BREVO_API_KEY, BREVO_SENDER_EMAIL, NEXT_PUBLIC_AUTH_ENABLED |
| `src/app/layout.tsx` | Wrap with AuthProvider, add AuthModal (outside shop conditional) |
| `src/components/header.tsx` | Add UserMenu (auth) or SignIn button (unauth) |
| `src/components/shop/cart-drawer.tsx` | Add CheckoutGate, ShippingEstimate |
| `src/components/shop/product-details.tsx` | Add ShippingEstimate |
| `src/app/api/checkout/route.ts` | Require auth + verified email, attach userId |
| `src/app/api/webhooks/stripe/route.ts` | Create order record after Printful order |
| `next.config.js` | Add security headers (CSP, X-Frame-Options, etc.) |

## Provider Hierarchy

```tsx
<html>
  <body>
    <Theme appearance="dark">
      {/* AuthProvider wraps everything when auth is enabled */}
      <MaybeAuthProvider enabled={authEnabled}>
        {authEnabled && <AuthModal />}
        {shopEnabled ? (
          <CartProvider>
            <MotionProvider>
              <Header />  {/* Shows UserMenu/SignIn only when authEnabled */}
              <main>{children}</main>
              <Footer />
            </MotionProvider>
          </CartProvider>
        ) : (
          <MotionProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </MotionProvider>
        )}
      </MaybeAuthProvider>
    </Theme>
  </body>
</html>
```

**Note:** When `NEXT_PUBLIC_AUTH_ENABLED=false`:
- AuthProvider not rendered (no SessionProvider overhead)
- AuthModal not rendered
- Header shows no Sign In button or UserMenu
- Account pages return 404 (handled at page level)
- Checkout proceeds without auth gates (existing behavior)

## UI/UX Design Specifications

### Design System Alignment

The auth components follow established patterns from the existing codebase:

| Pattern | Reference Component | Use Case |
|---------|---------------------|----------|
| Dialog (focused action) | SearchCommand | Auth modal, confirmations |
| Sheet (browsing content) | CartDrawer | NOT for auth |
| Loading state | CartDrawer | `Loader2` with `animate-spin` |
| Error display | CartDrawer | Inline, red-400, AlertCircle icon |
| Mobile modal | SearchCommand | Bottom sheet pattern |

### Color Palette (CSS Variables)

```css
/* Backgrounds */
--color-obsidian: #0c0c0c;
--color-warm-charcoal: #1a1714;
--color-dark-bronze: #252019;

/* Primary Accent - Gold */
--color-gold: #d4a84b;
--color-gold-bright: #e8c068;

/* Text */
--color-cream: #f5f0e6;
--color-warm-gray: #b8a99a;
--color-dim: #7a6b5a;

/* Borders */
--border-gold: rgba(212, 168, 75, 0.3);

/* Destructive */
red-400 for errors
```

### Typography

| Role | Font Family | Usage |
|------|-------------|-------|
| Display | Cinzel Decorative (`font-display`) | Hero titles only |
| Heading | Cormorant Garamond (`font-heading`) | Modal titles, section headers |
| Body | Crimson Pro (`font-body`) | Form labels, descriptions, buttons |

### Component Specifications

#### AuthModal (`src/components/auth/auth-modal.tsx`)

**Pattern**: Dialog (like SearchCommand), NOT Sheet

**Rationale**: Auth is a focused action requiring user attention, not browsing content

**Structure**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className={cn(
    // Base styling
    "overflow-hidden p-0",
    "bg-[var(--color-obsidian)] border-[var(--border-gold)]",
    // Desktop: centered
    "sm:!top-[20vh] sm:!translate-y-0 sm:max-w-md sm:rounded-lg",
    // Mobile: bottom sheet
    "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
  )}>
    {/* Multi-view: sign-in | sign-up | forgot-password */}
  </DialogContent>
</Dialog>
```

**View State**:
```tsx
type AuthView = "sign-in" | "sign-up" | "forgot-password";
const [view, setView] = useState<AuthView>("sign-in");
```

**Header Content by View**:
| View | Title | Description |
|------|-------|-------------|
| sign-in | "Welcome Back" | "Sign in to access your account" |
| sign-up | "Create Account" | "Join to save addresses and track orders" |
| forgot-password | "Reset Password" | "We'll send you a reset link" |

#### Form Input Styling

```tsx
<Input
  className={cn(
    "h-11 bg-[var(--color-warm-charcoal)]/50",
    "border-[var(--border-gold)]/30",
    "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
    "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/30",
    "aria-invalid:border-red-400 aria-invalid:ring-red-400/20"
  )}
/>
```

**Password Visibility Toggle**:
```tsx
<div className="relative">
  <Input type={showPassword ? "text" : "password"} className="pr-10" />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
</div>
```

**Submit Button**:
```tsx
<Button
  className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processing...
    </>
  ) : (
    "Sign In"
  )}
</Button>
```

#### UserMenu (`src/components/auth/user-menu.tsx`)

**Desktop**: DropdownMenu component
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-gold)] bg-[var(--color-dark-bronze)] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-warm-charcoal)]">
      <User className="h-4 w-4" />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56 bg-[var(--color-obsidian)] border-[var(--border-gold)]">
    <DropdownMenuLabel>user@example.com</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Account</DropdownMenuItem>
    <DropdownMenuItem>Orders</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-400">Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Mobile**: Integrated into existing mobile menu drawer (no separate component)

#### CheckoutGate (`src/components/auth/checkout-gate.tsx`)

**Placement**: Inside CartDrawer, above checkout button

**States**:

1. **Not authenticated**:
```tsx
<div className="flex flex-col gap-2 rounded-md border border-[var(--border-gold)]/50 bg-[var(--color-warm-charcoal)]/30 p-3">
  <p className="text-sm text-[var(--color-cream)]">Sign in to continue to checkout</p>
  <Button variant="outline" onClick={openAuthModal} className="border-[var(--color-gold)] text-[var(--color-gold)]">
    Sign In
  </Button>
</div>
```

2. **Email not verified**:
```tsx
<div className="flex items-center gap-2 rounded-md border border-amber-400/50 bg-amber-400/10 p-3">
  <Mail className="h-4 w-4 text-amber-400" />
  <div className="flex-1">
    <p className="text-sm text-[var(--color-cream)]">Please verify your email to checkout</p>
    <button className="text-xs text-[var(--color-gold)] hover:underline">Resend verification email</button>
  </div>
</div>
```

3. **No address**:
```tsx
<div className="flex items-center gap-2 rounded-md border border-[var(--border-gold)]/50 bg-[var(--color-warm-charcoal)]/30 p-3">
  <MapPin className="h-4 w-4 text-[var(--color-gold)]" />
  <div className="flex-1">
    <p className="text-sm text-[var(--color-cream)]">Add a shipping address to continue</p>
    <Link href="/account/address?returnTo=/shop" className="text-xs text-[var(--color-gold)] hover:underline">
      Add address →
    </Link>
  </div>
</div>
```

#### ShippingEstimate (`src/components/shop/shipping-estimate.tsx`)

**Placement**: CartDrawer (above subtotal) + ProductDetails page

```tsx
<div className="border-t border-[var(--border-gold)]/30 pt-4">
  {isLoading ? (
    <div className="flex items-center gap-2 text-sm text-[var(--color-dim)]">
      <Loader2 className="h-3 w-3 animate-spin" />
      Calculating shipping...
    </div>
  ) : estimate ? (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-warm-gray)]">Est. Shipping ({estimate.country})</span>
      <span className="text-[var(--color-cream)]">{formatPrice(estimate.cost)}</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-sm text-[var(--color-dim)]">
      <MapPin className="h-3 w-3" />
      <span>Add address for shipping estimate</span>
    </div>
  )}
</div>
```

#### Account Pages (`src/app/account/`)

**Layout Pattern**:
```tsx
<div className="container mx-auto px-4 py-8">
  <div className="grid gap-8 md:grid-cols-[200px_1fr]">
    {/* Sidebar Navigation */}
    <nav className="space-y-1">
      <NavLink href="/account" icon={User}>Overview</NavLink>
      <NavLink href="/account/address" icon={MapPin}>Address</NavLink>
      <NavLink href="/account/orders" icon={Package}>Orders</NavLink>
    </nav>
    <main>{children}</main>
  </div>
</div>
```

**Card Pattern**:
```tsx
<div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/20 p-6">
  <h2 className="font-heading text-lg text-[var(--color-cream)] mb-4">Section Title</h2>
  {/* Content */}
</div>
```

**Delete Account Confirmation**:
```tsx
<AlertDialog>
  <AlertDialogContent className="bg-[var(--color-obsidian)] border-[var(--border-gold)]">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-[var(--color-cream)]">Delete your account?</AlertDialogTitle>
      <AlertDialogDescription className="text-[var(--color-warm-gray)]">
        This will permanently delete your account and all associated data. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white">Delete Account</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Error Message Styling

| Type | Style | Icon |
|------|-------|------|
| Form validation | Inline below field, `text-xs text-red-400` | AlertCircle (h-3 w-3) |
| API errors | Alert box with `border border-red-400/50 bg-red-400/10` | AlertCircle (h-4 w-4) |
| Warnings | Amber-400 with lighter background | Mail or Info |
| Success | Green-400 with check icon | Check |

### Animation Guidelines

| Element | Animation | Library |
|---------|-----------|---------|
| Modal open/close | fade + zoom (Radix default) | Radix Dialog |
| View transitions | slide + fade | Motion (`motion/react`) |
| Form validation error | subtle shake | Motion |
| Button loading | Loader2 spin | CSS `animate-spin` |
| Success states | checkmark scale-in | Motion |

### Mobile Considerations

| Component | Mobile Behavior |
|-----------|-----------------|
| AuthModal | Bottom sheet with `pb-safe`, max-h-85vh |
| UserMenu | Integrated into mobile menu drawer |
| CheckoutGate | Full-width cards, h-11 touch targets |
| Account Pages | Single column, sidebar collapses |

### shadcn Components to Add

```bash
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add alert-dialog
```

### Accessibility Checklist

- [ ] All form inputs have associated `<Label>` elements
- [ ] Error messages linked via `aria-describedby`
- [ ] Focus trap in modal (Dialog handles automatically)
- [ ] Escape key closes modal
- [ ] Loading states use `aria-busy` and descriptive text
- [ ] Color contrast meets WCAG AA (gold on obsidian ✓)
- [ ] Touch targets minimum 44px on mobile

## Implementation Phases

### Phase 1: Database Setup ([SG-267](https://linear.app/sherpagg/issue/SG-267))
1. Create Neon project, get connection string
2. Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`
3. Create `src/lib/db/schema.ts` and `src/lib/db/index.ts`
4. Create `drizzle.config.ts`
5. Run `pnpm drizzle-kit push`
6. Update `src/env.js` with DATABASE_URL validation

### Phase 2: Auth.js Setup ([SG-268](https://linear.app/sherpagg/issue/SG-268))
1. Install: `next-auth@beta`, `@auth/drizzle-adapter`, `bcryptjs`, `@types/bcryptjs`
2. Create `src/lib/auth/config.ts` with Credentials provider
3. Create `src/lib/auth/index.ts` (export auth, signIn, signOut)
4. Create `src/lib/auth/tokens.ts` (SHA-256 hashing utilities)
5. Create `src/app/api/auth/[...nextauth]/route.ts`
6. Update `src/env.js` with AUTH_SECRET validation

### Phase 3: Auth UI Components + Header ([SG-269](https://linear.app/sherpagg/issue/SG-269), [SG-270](https://linear.app/sherpagg/issue/SG-270), [SG-271](https://linear.app/sherpagg/issue/SG-271))
1. Create `src/lib/auth/feature-flags.ts` with `isAuthEnabled()` (mirrors shop pattern)
2. Update `src/env.js` with NEXT_PUBLIC_AUTH_ENABLED validation (default: false)
3. Create `src/lib/auth/schema.ts` (Zod schemas with password policy)
4. Create `src/components/auth/auth-provider.tsx`
5. Create `src/components/auth/auth-modal.tsx`
6. Create `src/components/auth/sign-in-form.tsx`
7. Create `src/components/auth/sign-up-form.tsx`
8. Create `src/components/auth/user-menu.tsx`
9. Update `src/app/layout.tsx` (add AuthProvider, AuthModal conditionally based on feature flag)
10. Update `src/components/header.tsx` (add UserSection conditionally based on feature flag)

### Phase 4: Email Verification ([SG-272](https://linear.app/sherpagg/issue/SG-272))
1. Create `src/lib/auth/email.ts` (Brevo integration with retry)
2. Create `src/app/api/auth/register/route.ts`
3. Create `src/app/auth/verify/page.tsx`

### Phase 5: Password Reset ([SG-273](https://linear.app/sherpagg/issue/SG-273))
1. Create `src/components/auth/forgot-password-form.tsx`
2. Create `src/app/api/auth/forgot-password/route.ts`
3. Create `src/app/auth/reset-password/page.tsx`
4. Create `src/components/auth/reset-password-form.tsx`

### Phase 6: Account Pages ([SG-274](https://linear.app/sherpagg/issue/SG-274), [SG-275](https://linear.app/sherpagg/issue/SG-275))
1. Create `src/app/account/layout.tsx` (protected)
2. Create `src/app/account/page.tsx` (overview with delete option)
3. Create `src/app/account/address/page.tsx`
4. Create `src/app/api/account/address/route.ts`
5. Create `src/app/account/orders/page.tsx`

### Phase 7: Account Deletion / GDPR ([SG-276](https://linear.app/sherpagg/issue/SG-276))
1. Create `src/app/api/account/delete/route.ts`
2. Add delete confirmation dialog to account page
3. Implement cascade: user → sessions → addresses, soft-delete orders

### Phase 8: Checkout Integration ([SG-277](https://linear.app/sherpagg/issue/SG-277), [SG-278](https://linear.app/sherpagg/issue/SG-278))
1. Create `src/components/auth/checkout-gate.tsx`
2. Update `src/components/shop/cart-drawer.tsx` (add CheckoutGate, ShippingEstimate)
3. Update `src/app/api/checkout/route.ts` (require auth, verify email)
4. Update `src/app/api/webhooks/stripe/route.ts` (create order record, handle missing userId)

### Phase 9: Shipping Estimates ([SG-279](https://linear.app/sherpagg/issue/SG-279))
1. Create `src/app/api/shipping/estimate/route.ts` (with timeout and caching)
2. Create `src/components/shop/shipping-estimate.tsx`
3. Add ShippingEstimate to product-details.tsx

### Phase 10: Rate Limiting + Account Lockout ([SG-280](https://linear.app/sherpagg/issue/SG-280))
1. Create `src/lib/auth/rate-limit.ts` (IP + account lockout)
2. Create `src/middleware.ts`
3. Create `src/app/api/auth/unlock/route.ts`
4. Create `src/app/auth/unlock/page.tsx`

### Phase 11: Security Headers ([SG-281](https://linear.app/sherpagg/issue/SG-281))
1. Update `next.config.js` with security headers
2. Verify headers in browser dev tools

## Checkout Flow (with Auth Gates)

```
User clicks "Proceed to Checkout"
    │
    ├─ NOT authenticated → Open AuthModal (onSuccess: retry checkout)
    ├─ Account locked → Show unlock instructions
    ├─ NOT email verified → Show "Verify email" message + resend link
    ├─ NO saved address → Link to /account/address?returnTo=/shop
    │
    └─ All gates pass → POST /api/checkout
        │
        ├─ Server validates: session exists, email verified, not locked
        ├─ Validates cart items against Printful
        ├─ Creates Stripe session with userId in metadata
        │
        └─ Webhook: checkout.session.completed
            ├─ Create Printful order (existing)
            └─ Create order record in database (NEW)
                └─ Handle missing userId gracefully (backward compat)
```

## Environment Variables

```bash
# Feature Flag (default: false)
NEXT_PUBLIC_AUTH_ENABLED="false"

# Database (Neon)
DATABASE_URL="postgresql://..."

# Auth.js
AUTH_SECRET="openssl rand -base64 32"

# Brevo SMTP API
BREVO_API_KEY="xkeysib-..."
BREVO_SENDER_EMAIL="noreply@sacredgeometry.site"
BREVO_SENDER_NAME="Sacred Geometry"
```

**Validation schemas (src/env.js):**
```typescript
// Client-side (public)
NEXT_PUBLIC_AUTH_ENABLED: z.string().transform((v) => v === "true").default("false"),

// Server-side
DATABASE_URL: z.string().startsWith("postgresql://"),
AUTH_SECRET: z.string().min(44), // 32 bytes base64
BREVO_API_KEY: z.string().startsWith("xkeysib-"),
BREVO_SENDER_EMAIL: z.string().email(),
BREVO_SENDER_NAME: z.string().optional().default("Sacred Geometry"),
```

## Error Messages

| Scenario | Message |
|----------|---------|
| Wrong password | "Invalid email or password" |
| Email not found | "Invalid email or password" |
| Email already registered | "An account with this email already exists" |
| Weak password | "Password must be at least 8 characters" |
| Rate limited (IP) | "Too many attempts. Please try again in 1 minute." |
| Account locked | "Account locked due to too many failed attempts. Check your email to unlock." |
| Token expired | "This link has expired. Request a new one." |
| Token invalid | "This link is invalid or has already been used." |
| Email send failed | "Unable to send email. Please try again in a few minutes." |
| Network error | "Connection error. Please check your internet and try again." |
| Server error | "Something went wrong. Please try again." |
| Shipping unavailable | "Shipping estimates temporarily unavailable" |

## Error Handling

### Brevo SMTP Failure
```
1. Wrap calls in try/catch with error logging
2. Retry with exponential backoff (max 3 attempts: 1s, 2s, 4s)
3. Return user-friendly error if all retries fail
4. Log failures for monitoring
```

### Printful API Failure
```
1. Timeout after 5 seconds
2. Show: "Shipping estimates temporarily unavailable"
3. Allow checkout to proceed (Stripe collects address)
4. Cache successful estimates for 15 minutes
```

## Verification Checklist

1. **Auth flow**: Register → receive email → click verify link → sign in works
2. **Password reset**: Forgot password → email → click link → set new password → sign in
3. **Account lockout**: 11th failed attempt → account locked → unlock email sent → click link → can sign in
4. **Account deletion**: Delete account → confirmation → all data removed → confirmation email
5. **Address management**: Save address → see it displayed → edit → changes persist
6. **Checkout gate**:
   - Without auth: clicking checkout opens sign-in modal
   - With locked account: shows unlock instructions
   - Without verified email: shows verification prompt
   - Without address: shows "add address" link
7. **Checkout with auth**: Verified account + saved address → checkout proceeds
8. **Order history**: Complete purchase → order appears in /account/orders
9. **Shipping estimates**:
   - Cart drawer shows estimate when user has saved address
   - Product page shows estimate when user has saved address
   - Printful timeout shows fallback message, checkout still works
10. **Rate limiting**: 6th login attempt within 1 minute returns 429
11. **Security headers**: Check headers in browser dev tools (CSP, X-Frame-Options, etc.)
12. **Token security**: Tokens in DB are SHA-256 hashes, not plain text
13. **Error messages**: All scenarios show correct user-friendly messages
14. **Tests pass**: `pnpm check` and `pnpm test` pass

## Security Measures

| Concern | Mitigation |
|---------|------------|
| Password storage | bcryptjs with cost factor 12 |
| Password policy | Minimum 8 characters (NIST-compliant) |
| Session security | HTTP-only cookies, SameSite=Lax, Secure in production, 30-day rolling |
| Session invalidation | Revoke all sessions on password change (except current) |
| CSRF protection | Auth.js built-in CSRF tokens |
| Rate limiting (IP) | 5 attempts/IP/minute on auth endpoints |
| Account lockout | Lock after 10 failed attempts per email, require email to unlock |
| Email verification tokens | 32 bytes crypto random, SHA-256 hashed, 6-hour expiry, single-use |
| Password reset tokens | 32 bytes crypto random, SHA-256 hashed, 1-hour expiry, single-use |
| Token storage | SHA-256 hash stored in DB, not plain token |
| Timing attacks | Constant-time comparison, generic error messages |
| Input validation | Zod schemas on all forms and API routes |
| SQL injection | Drizzle ORM parameterized queries |
| Security headers | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |

## Design Decisions

### Why Neon + Auth.js (not Supabase)?
- More control over auth flow and customization
- Drizzle ORM provides excellent TypeScript DX
- Separates concerns (database vs auth) for easier debugging
- User preference for Auth.js familiarity

### Why email/password only?
- Simplest UX, no third-party OAuth setup required
- Aligns with cost constraint (no OAuth provider fees)
- Can add OAuth providers later if needed

### Why single address per user?
- Covers majority use case
- Simpler UI/UX
- Can expand to multiple addresses later

### Why webhook-driven order history?
- Single source of truth (order exists after payment confirmed)
- Handles edge cases (payment failures, abandoned checkouts)
- Already have webhook infrastructure in place

### Why auth modal (not dedicated pages)?
- Matches existing patterns: CartDrawer uses Sheet, SearchCommand uses Dialog
- Preserves user context during checkout flow
- Reduces navigation friction for impulse purchases
- Allows checkout-triggered auth with callback on success

### Why in-memory rate limiting?
- No external dependencies (Redis, Upstash)
- Best-effort protection on serverless (see Known Limitations)
- Easy migration path to Redis later
- Account lockout provides additional protection layer

### Why hard cutover (no guest checkout)?
- Simplifies implementation
- Shipping estimates require address anyway
- Users who started checkout before deployment must sign up

## Known Limitations

**In-memory rate limiting on serverless:**
In-memory Map rate limiting is best-effort on Vercel serverless functions. Each function invocation may run in a different container with its own memory. For guaranteed rate limiting, migrate to:
- Upstash Redis (recommended, free tier: 10K commands/day)
- Vercel KV (free tier: 3K commands/day on Hobby)

Account lockout (per-email) provides an additional layer of protection regardless of rate limiting effectiveness.

**Cart storage:**
Cart remains in localStorage (device-specific), not synced to user account. This is a known limitation for MVP.

**Single address:**
Users can only save one shipping address. Multiple addresses deferred to Phase 2.

**Email change:**
Users cannot change their email address in v1. Requires support ticket. Email change flow deferred to Phase 2.

## Deferred to Phase 2

- Redis-backed rate limiting
- Email change flow
- "Logout all devices" feature
- Multiple addresses per user
- Email bounce monitoring
- Cart sync to account
