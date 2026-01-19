# Interaction Patterns

Reusable approaches for common UI moments. These ensure consistency across features and connect back to our design principles.

---

## Empty States

*Principle: Invitation over Instruction*

Empty states are opportunities, not dead ends. Make them spacious and inviting — never broken or accusatory.

### Pattern

| Element | Approach |
|---------|----------|
| Visual | Simple icon or illustration, generous whitespace |
| Headline | Gentle observation, not accusation |
| Description | Meaning or invitation, not guilt |
| Action | Single CTA, understated styling |

### Examples

**Signal collection (no sightings):**
> *Icon: subtle sparkle or geometric form*
>
> **No signals captured yet**
>
> The universe is patient.
>
> [Capture your first]

**Search with no results:**
> **No matches found**
>
> Try a different search term.

**Filtered view with no items:**
> **No sightings of 444 yet**
>
> This number will appear here when you capture it.

### Avoid

- "Get started!" urgency
- Sad/empty imagery (empty boxes, tumbleweeds)
- Multiple CTAs competing for attention
- Making users feel behind

---

## Loading States

*Principle: Quiet Confidence*

Loading should feel intentional, not anxious. We're not apologizing for taking time — we're doing something meaningful.

### Pattern

| Duration | Approach |
|----------|----------|
| < 500ms | No indicator needed |
| 500ms - 2s | Simple indicator (sacred geometry spinner) |
| > 2s | Skeleton screens or progress indication |
| Indeterminate | Contextual language ("Receiving...") |

### Sacred Geometry Spinner

Use rotating geometric forms rather than generic spinners. The Seed of Life or a simple rotating triangle reinforces the brand while indicating activity.

### Skeleton Screens

For content loading, show the structure before the content:
- Gray placeholder shapes matching expected layout
- Subtle pulse animation
- No loading text — the skeleton communicates

### Interpretation Loading

When waiting for AI interpretation:
> *Spinner with:* "Receiving..."

The language matches the spiritual context without being overwrought.

### Avoid

- Generic spinners (circles, dots)
- "Please wait..." messaging
- Progress bars for short operations
- Apologetic language

---

## Celebrations

*Principle: Grounded over Grandiose*

Celebrate meaningfully, not constantly. Reserve significant animation for moments that matter.

### Celebration Tiers

| Moment | Treatment |
|--------|-----------|
| **First catch** (new number) | Full celebration — particles, badge reveal, modal pause |
| **Milestone** (10th sighting, etc.) | Medium — brief animation, acknowledgment text |
| **Repeat sighting** | Subtle — count increment animation, soft glow |
| **Purchase complete** | Warm — confirmation with anticipation language |
| **Account created** | Welcome — orientation focus, not confetti |

### First Catch Celebration

The biggest moment in Signal. User captured a number they've never seen before.

- Full-screen overlay (dismissible)
- Particle burst animation
- "First Catch" badge with the number
- Brief pause before revealing interpretation
- Tap anywhere to continue

### Repeat Sighting

User captured a number they've seen before. Acknowledge without interrupting.

- Count badge increments with animation
- Subtle glow effect on the number
- No modal or overlay
- Flow continues smoothly

### The Rule

**If everything celebrates, nothing feels special.**

Save the big moments for big achievements. Most interactions need only subtle feedback.

---

## Errors

*Principle: Respect the Intelligence*

Honest, calm, actionable. Tell them what happened and what to do. No cutesy language.

### Pattern

| Element | Approach |
|---------|----------|
| What happened | Clear statement of the problem |
| Why (if known) | Brief explanation |
| What to do | Actionable next step |
| Tone | Calm, not apologetic or jokey |

### Examples

**Network error:**
> **Connection lost**
>
> Your sighting wasn't saved. Check your connection and try again.
>
> [Try again]

**Invalid input:**
> **Invalid email format**
>
> *(inline below the field, no modal)*

**Server error:**
> **Something went wrong**
>
> We couldn't save your changes. Please try again.
>
> [Try again]

### Avoid

- "Oops!" or "Uh oh!"
- Blaming the user
- Technical jargon (500 error, timeout exception)
- Hiding that something went wrong
- Excessive apology

---

## Form Validation

*Principle: Private by Default*

Validate helpfully without being intrusive or making users feel watched.

### Timing

| Event | Validation |
|-------|------------|
| On focus | Show requirements as hints |
| On input | No validation (let them type) |
| On blur | Validate and show errors |
| On submit | Validate all, focus first error |

### Visual Treatment

| State | Style |
|-------|-------|
| Default | Standard border |
| Focus | Gold border, no other change |
| Valid | Subtle checkmark (no color change) |
| Invalid | Copper/gold error text below, not aggressive red |

### Password Fields

- Show requirements as a checklist
- Check off requirements as met (subtle checkmarks)
- Don't validate until blur
- Offer show/hide toggle

### Error Messages

- Inline, below the field
- Brief and specific: "Must be at least 8 characters"
- No exclamation points
- No "Please enter a valid..."

### Avoid

- Validating on every keystroke
- Aggressive red coloring
- "Great job!" for valid inputs
- Shaking animations on error
- Blocking submission for optional fields

---

## Transitions

*Principle: Quiet Confidence*

Movement should feel natural and purposeful. Guide attention, don't demand it.

### Duration Guidelines

| Transition | Duration |
|------------|----------|
| Micro (button states) | 100-150ms |
| Small (reveals, fades) | 200-300ms |
| Medium (modals, panels) | 300-400ms |
| Large (page transitions) | 400-500ms |

### Easing

- **ease-out** for entrances (content arriving)
- **ease-in** for exits (content leaving)
- **ease-in-out** for movement (position changes)

### Stagger

When multiple elements animate:
- 50-100ms delay between items
- Limit to 5-7 items before grouping
- Direction should match reading flow

### Avoid

- Bounce effects (too playful)
- Long delays before content appears
- Animating everything (pick what matters)
- Motion that blocks interaction
