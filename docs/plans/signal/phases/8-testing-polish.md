# Phase 8: Testing & Polish

**Linear:** [SG-292](https://linear.app/sherpagg/issue/SG-292)
**Branch:** `sg-292-signal-phase-8-testing-polish`

## Overview

Write tests for API routes and critical component logic. E2E tests deferred to post-v1 stabilization.

## Testing Strategy

**Scope for v1:**
- API routes (high value — bugs cause data loss)
- Component logic (medium value — tricky edge cases)

**Deferred:**
- E2E tests (high maintenance, add after feature stabilizes)

## Tasks

### 1. API Route Tests

Create test files for each API route. Focus on:
- Authentication checks (401 for unauthenticated)
- Validation (400 for invalid input)
- Authorization (404 for other user's data)
- Happy path (200/201 for valid requests)

#### Sightings CRUD Tests

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

  it("returns 400 for invalid number (non-digits)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });

    const request = new Request("http://localhost/api/signal/sightings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: "abc" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid mood tags", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });

    const request = new Request("http://localhost/api/signal/sightings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: "444", moodTags: ["invalid-mood"] }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  // Add more tests for happy path with mocked db/claude
});

describe("GET /api/signal/sightings", () => {
  it("returns 401 if not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost/api/signal/sightings");
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  // Add tests for filtering, pagination
});
```

#### Delete Sighting Tests

Create `src/app/api/signal/sightings/[id]/__tests__/route.test.ts`:

```typescript
describe("DELETE /api/signal/sightings/[id]", () => {
  it("returns 401 if not authenticated", async () => {
    // ...
  });

  it("returns 404 for non-existent sighting", async () => {
    // ...
  });

  it("returns 404 for other user's sighting", async () => {
    // Verify ownership check
  });

  it("deletes sighting and updates stats", async () => {
    // Happy path
  });
});
```

#### Stats Tests

Create `src/app/api/signal/stats/__tests__/route.test.ts`:

```typescript
describe("GET /api/signal/stats", () => {
  it("returns 401 if not authenticated", async () => {
    // ...
  });

  it("returns aggregated stats for user", async () => {
    // ...
  });
});
```

### 2. Component Logic Tests

Test critical component behaviors. Focus on state management and edge cases.

#### MoodSelector Tests

Create `src/components/signal/__tests__/mood-selector.test.tsx`:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MoodSelector } from "../mood-selector";

describe("MoodSelector", () => {
  it("toggles mood selection on click", () => {
    const onChange = vi.fn();
    render(<MoodSelector selected={[]} onChange={onChange} />);

    fireEvent.click(screen.getByText("Calm"));
    expect(onChange).toHaveBeenCalledWith(["calm"]);
  });

  it("removes mood when clicking selected mood", () => {
    const onChange = vi.fn();
    render(<MoodSelector selected={["calm"]} onChange={onChange} />);

    fireEvent.click(screen.getByText("Calm"));
    expect(onChange).toHaveBeenCalledWith([]);
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

  it("allows deselection when at max", () => {
    const onChange = vi.fn();
    render(
      <MoodSelector
        selected={["calm", "energized", "reflective"]}
        onChange={onChange}
      />
    );

    // Can still deselect
    fireEvent.click(screen.getByText("Calm"));
    expect(onChange).toHaveBeenCalledWith(["energized", "reflective"]);
  });
});
```

#### NumberPad Tests

Create `src/components/signal/__tests__/number-pad.test.tsx`:

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberPad } from "../number-pad";

describe("NumberPad", () => {
  it("builds number from digit clicks", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("4"));

    // Display should show 444
    expect(screen.getByText("444")).toBeInTheDocument();
  });

  it("clears on Clear click", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("Clear"));

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("limits to 10 digits", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    // Click 11 times
    for (let i = 0; i < 11; i++) {
      fireEvent.click(screen.getByText("1"));
    }

    // Should only have 10 digits
    expect(screen.getByText("1111111111")).toBeInTheDocument();
  });

  it("quick-select sets value", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText("1111"));

    expect(screen.getByText("1111")).toBeInTheDocument();
  });

  it("submits on Continue click", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText("444"));
    fireEvent.click(screen.getByText("Continue"));

    expect(onSubmit).toHaveBeenCalledWith("444");
  });

  it("disables Continue when empty", () => {
    const onSubmit = vi.fn();
    render(<NumberPad onSubmit={onSubmit} />);

    const continueButton = screen.getByText("Continue");
    expect(continueButton).toBeDisabled();
  });
});
```

### 3. Manual Testing Checklist

| Test | Status |
|------|--------|
| Sign in to account | ☐ |
| Navigate to /signal (authenticated) | ☐ |
| Navigate to /signal (unauthenticated) → redirects | ☐ |
| Feature flag off → 404 | ☐ |
| Capture a number via NumberPad | ☐ |
| Add mood + note | ☐ |
| Verify interpretation appears | ☐ |
| Check collection shows sighting | ☐ |
| Capture same number → count increases | ☐ |
| Capture new number → first-catch celebration | ☐ |
| Delete a sighting | ☐ |
| Regenerate interpretation | ☐ |
| Filter collection by number | ☐ |
| Test SacredNumberWheel input mode | ☐ |
| Test input mode toggle persistence | ☐ |

### 4. Final Verification

```bash
# Type check and lint
pnpm check

# Run tests
pnpm test

# Production build
pnpm build

# Test production build locally
pnpm start
# Navigate to /signal and verify
```

## Test Coverage Guidelines

| Area | Target | Rationale |
|------|--------|-----------|
| API routes | 80%+ | Bugs cause data loss |
| Component logic | Key interactions | Edge cases matter |
| E2E | Deferred | Add post-stabilization |

## Verification

- [ ] All API route tests pass
- [ ] Component logic tests pass
- [ ] Manual testing complete
- [ ] `pnpm check` passes
- [ ] `pnpm build` succeeds
- [ ] Feature flag tested (on/off)

## Definition of Done

- All tests passing
- No TypeScript errors
- No ESLint errors
- Manual testing complete
- Feature flag behavior verified
- Ready for merge

## Post-Merge

1. Deploy to staging
2. Enable feature flag for beta testing
3. Monitor for errors
4. Collect user feedback
5. Consider E2E tests after feature stabilizes
