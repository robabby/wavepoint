# Phase 7: Testing & Polish

**Linear:** [SG-292](https://linear.app/sherpagg/issue/SG-292)
**Branch:** `sg-292-signal-phase-7-testing-polish`

## Overview

Write tests, perform E2E testing, and final verification before merge.

## Tasks

### 1. API Route Tests

Create `src/app/api/signal/sightings/__tests__/route.test.ts`:

```typescript
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { POST, GET } from "../route";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth");
vi.mock("@/lib/db");
vi.mock("@/lib/signal/claude");

const mockAuth = auth as Mock;

describe("POST /api/signal/sightings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost/api/signal/sightings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: "444" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid number", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });

    const request = new Request("http://localhost/api/signal/sightings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: "abc" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("creates sighting successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    // ... mock db and claude

    const request = new Request("http://localhost/api/signal/sightings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: "444" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### 2. Component Tests

Test key components:

```typescript
// src/components/signal/__tests__/mood-selector.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MoodSelector } from "../mood-selector";

describe("MoodSelector", () => {
  it("toggles mood selection", () => {
    const onChange = vi.fn();
    render(<MoodSelector selected={[]} onChange={onChange} />);

    fireEvent.click(screen.getByText("Calm"));
    expect(onChange).toHaveBeenCalledWith(["calm"]);
  });

  it("limits to 3 selections", () => {
    const onChange = vi.fn();
    render(
      <MoodSelector
        selected={["calm", "energized", "reflective"]}
        onChange={onChange}
      />
    );

    // Fourth selection should be disabled
    const inspiredButton = screen.getByText("Inspired").closest("button");
    expect(inspiredButton).toBeDisabled();
  });
});
```

### 3. E2E Tests (Full Capture Flow)

If using Playwright:

```typescript
// e2e/signal.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Signal", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    // ... authenticate
  });

  test("complete capture flow", async ({ page }) => {
    await page.goto("/signal");

    // Navigate to capture
    await page.click('text="Capture"');
    expect(page.url()).toContain("/signal/capture");

    // Enter number
    await page.click('button:has-text("4")');
    await page.click('button:has-text("4")');
    await page.click('button:has-text("4")');

    // Submit
    await page.click('button:has-text("Continue")');

    // Select mood (optional)
    await page.click('text="Grateful"');
    await page.click('button:has-text("Continue")');

    // Verify interpretation appears
    await expect(page.locator('[data-testid="interpretation"]')).toBeVisible();
  });
});
```

### 4. Manual Testing Checklist

| Test | Status |
|------|--------|
| Sign in to account | ☐ |
| Navigate to /signal | ☐ |
| Capture a number (e.g., 444) | ☐ |
| Add mood + note | ☐ |
| Verify interpretation appears | ☐ |
| Check collection shows sighting | ☐ |
| Capture same number, verify count increases | ☐ |
| Capture new number, verify "first catch" celebration | ☐ |
| Delete a sighting | ☐ |
| Regenerate interpretation | ☐ |
| Test NumberPad input mode | ☐ |
| Test SacredNumberWheel input mode | ☐ |
| Test input mode toggle persistence | ☐ |

### 5. Final Verification

```bash
# Type check and lint
pnpm check

# Run tests
pnpm test

# Production build
pnpm build

# Test production build locally
pnpm start
# Navigate to /signal and test
```

## Test Coverage Targets

| Area | Target |
|------|--------|
| API routes | 80%+ |
| Hooks | 70%+ |
| Components | Key interactions |
| E2E | Happy path |

## Verification

- [ ] All API route tests pass
- [ ] Component tests pass
- [ ] E2E tests pass
- [ ] Manual testing complete
- [ ] `pnpm check` passes
- [ ] `pnpm build` succeeds
- [ ] Production build works correctly

## Definition of Done

- All tests passing
- No TypeScript errors
- No ESLint errors
- Manual testing complete
- Feature flag tested (on/off)
- Edge cases verified
- Ready for merge

## Post-Merge

- Deploy to staging
- Enable feature flag for beta testing
- Monitor for errors
- Collect user feedback
