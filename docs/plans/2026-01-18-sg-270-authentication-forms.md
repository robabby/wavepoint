# SG-270: Authentication Forms Implementation Plan

## Overview

Replace placeholder forms in `auth-modal.tsx` with functional React Hook Form implementations for sign-in, sign-up, and forgot-password flows.

## Prerequisites

- ✅ SG-267: Neon database + Drizzle ORM
- ✅ SG-268: Auth.js v5 with Credentials provider
- ✅ SG-269: AuthProvider and AuthModal with placeholders

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form library | React Hook Form + shadcn Form | Better validation UX, type-safe |
| Validation | Zod schemas | Already in codebase, works with RHF |
| Auth actions | Separate `actions.ts` file | Separates API logic from UI |
| Password toggle | Reusable `PasswordInput` component | Used in both sign-in and sign-up |
| Forgot password | Functional placeholder | Shows "Coming Soon" after submit |

## Dependencies to Install

```bash
pnpm add react-hook-form @hookform/resolvers
pnpm dlx shadcn@latest add form label
```

## Files to Create

### 1. `src/lib/auth/schemas.ts` - Validation Schemas

```typescript
import { z } from "zod";

// Sign-in: just needs valid email and non-empty password
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Sign-up: stricter password requirements
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// Forgot password: just email
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

// Inferred types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
```

### 2. `src/lib/auth/actions.ts` - Auth Action Utilities

```typescript
"use client";

import { signIn } from "next-auth/react";
import type { SignInFormData, SignUpFormData } from "./schemas";

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Sign in with credentials
 */
export async function signInWithCredentials(
  data: SignInFormData
): Promise<AuthResult> {
  try {
    const result = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Register a new user and auto sign-in
 */
export async function registerUser(
  data: SignUpFormData
): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        password: data.password,
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Registration failed",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}
```

### 3. `src/components/auth/password-input.tsx` - Password Field with Toggle

```typescript
"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          disabled={disabled}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-[var(--color-dim)] hover:text-[var(--color-gold)]",
            "transition-colors focus:outline-none",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
```

### 4. `src/app/api/auth/register/route.ts` - Registration API

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signUpSchema } from "@/lib/auth/schemas";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    await db.insert(users).values({
      email: normalizedEmail,
      passwordHash,
      name: name.trim(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
```

### 5. `src/components/auth/sign-in-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInSchema, type SignInFormData } from "@/lib/auth/schemas";
import { signInWithCredentials } from "@/lib/auth/actions";
import { useAuthModal, type AuthView } from "./auth-provider";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function SignInForm({ onSwitchView }: SignInFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal } = useAuthModal();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    const result = await signInWithCredentials(data);

    if (result.success) {
      closeModal();
    } else {
      setError(result.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Your password"
                    autoComplete="current-password"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSwitchView("forgot-password")}
            className="text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-400/50 bg-red-400/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Switch to sign-up */}
        <p className="text-center text-sm text-[var(--color-warm-gray)]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("sign-up")}
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Create one
          </button>
        </p>
      </form>
    </Form>
  );
}
```

### 6. `src/components/auth/sign-up-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, type SignUpFormData } from "@/lib/auth/schemas";
import { registerUser, signInWithCredentials } from "@/lib/auth/actions";
import { useAuthModal, type AuthView } from "./auth-provider";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function SignUpForm({ onSwitchView }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal } = useAuthModal();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    // Register the user
    const registerResult = await registerUser(data);

    if (!registerResult.success) {
      setError(registerResult.error);
      return;
    }

    // Auto sign-in after successful registration
    const signInResult = await signInWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (signInResult.success) {
      closeModal();
    } else {
      // Registration succeeded but sign-in failed - redirect to sign-in
      onSwitchView("sign-in");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-400/50 bg-red-400/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Switch to sign-in */}
        <p className="text-center text-sm text-[var(--color-warm-gray)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("sign-in")}
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Sign in
          </button>
        </p>
      </form>
    </Form>
  );
}
```

### 7. `src/components/auth/forgot-password-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/auth/schemas";
import { type AuthView } from "./auth-provider";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function ForgotPasswordForm({ onSwitchView }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitted(true);
  };

  // Success state - "Coming Soon" placeholder
  if (isSubmitted) {
    return (
      <div className="space-y-4">
        {/* Back to sign-in */}
        <button
          type="button"
          onClick={() => onSwitchView("sign-in")}
          className="flex items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
            <CheckCircle className="h-6 w-6 text-[var(--color-gold)]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg text-[var(--color-cream)]">
              Coming Soon
            </h3>
            <p className="text-sm text-[var(--color-warm-gray)]">
              Password reset functionality is not yet available.
              Please contact support if you need to recover your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Back to sign-in */}
        <button
          type="button"
          onClick={() => onSwitchView("sign-in")}
          className="flex items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        <div className="space-y-3">
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </>
          )}
        </Button>

        {/* Info text */}
        <p className="text-center text-xs text-[var(--color-dim)]">
          We&apos;ll send a password reset link to your email address.
        </p>
      </form>
    </Form>
  );
}
```

### 8. Modify `src/components/auth/auth-modal.tsx`

**Changes:**
1. Remove the three placeholder functions (`SignInPlaceholder`, `SignUpPlaceholder`, `ForgotPasswordPlaceholder`)
2. Import the real form components
3. Update the render section to use real components

```typescript
// Add imports at top
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { ForgotPasswordForm } from "./forgot-password-form";

// Remove lines 33-175 (placeholder functions)

// Update lines 214-216 to:
{view === "sign-in" && <SignInForm onSwitchView={setView} />}
{view === "sign-up" && <SignUpForm onSwitchView={setView} />}
{view === "forgot-password" && <ForgotPasswordForm onSwitchView={setView} />}
```

## Build Sequence

### Step 1: Install Dependencies
```bash
pnpm add react-hook-form @hookform/resolvers
pnpm dlx shadcn@latest add form label
```

### Step 2: Create Validation Schemas
- Create `src/lib/auth/schemas.ts`
- Define `signInSchema`, `signUpSchema`, `forgotPasswordSchema`
- Export type definitions

### Step 3: Create Auth Actions
- Create `src/lib/auth/actions.ts`
- Implement `signInWithCredentials()` and `registerUser()`

### Step 4: Create Password Input Component
- Create `src/components/auth/password-input.tsx`
- Implement visibility toggle with Eye/EyeOff icons

### Step 5: Create Register API Route
- Create `src/app/api/auth/register/route.ts`
- Implement user creation with bcrypt hashing
- Handle duplicate email error (409)

### Step 6: Create Sign-In Form
- Create `src/components/auth/sign-in-form.tsx`
- Use React Hook Form with Zod resolver
- Call `signInWithCredentials()` on submit

### Step 7: Create Sign-Up Form
- Create `src/components/auth/sign-up-form.tsx`
- Use React Hook Form with Zod resolver
- Call `registerUser()` then auto sign-in on success

### Step 8: Create Forgot Password Form
- Create `src/components/auth/forgot-password-form.tsx`
- Show "Coming Soon" placeholder after submit

### Step 9: Update Auth Modal
- Modify `src/components/auth/auth-modal.tsx`
- Remove placeholder components
- Import and use real form components

### Step 10: Verify
- Run `pnpm check` (lint + typecheck)
- Test all three form flows manually

## Error Handling

| Scenario | User Message |
|----------|--------------|
| Invalid credentials | "Invalid email or password" |
| Duplicate email | "An account with this email already exists" |
| Network error | "An unexpected error occurred" |
| Validation error | Inline field messages |

## Testing Checklist

- [ ] Sign-in with valid credentials → modal closes, session active
- [ ] Sign-in with wrong password → "Invalid email or password"
- [ ] Sign-in with non-existent email → "Invalid email or password"
- [ ] Sign-up with new email → auto sign-in, modal closes
- [ ] Sign-up with existing email → "An account with this email already exists"
- [ ] Sign-up with weak password → validation error
- [ ] Forgot password → "Coming Soon" message
- [ ] Password visibility toggle works
- [ ] Loading spinners appear during submission
- [ ] View switching works (sign-in ↔ sign-up ↔ forgot-password)
- [ ] `pnpm check` passes

## Security Notes

- Passwords hashed with bcrypt (cost factor 12)
- Same error for invalid email vs password (prevents user enumeration)
- Email normalized to lowercase
- Inputs validated server-side with Zod
