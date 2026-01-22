# Number Rain Background Implementation Plan

## Overview

Add a subtle "number rain" animated background to the `/numbers` page hero section - a refined, tasteful take on the Matrix digital rain effect using gold-tinted numbers.

## User Decisions

- **Content**: Include angel sequences (0-9 plus 11, 22, 111, 222, 333, 444, 555)
- **Intensity**: Subtle (5-15% opacity)
- **Boundary**: Hero only with fade at bottom
- **Approach**: DOM/CSS (simple, matches existing patterns)

## Design Approach

**DOM-based with CSS keyframe animation**:
- Simple single component (~100 lines)
- Uses CSS `@keyframes fall` with `animation-play-state` for pause
- Matches existing `FirstCatchCelebration` particle pattern
- 25 DOM elements with carefully randomized properties
- Leverages existing `useReducedMotion` hook

**Visual Treatment (Refined)**:
- **Typography**: Use `font-display` (Cinzel Decorative) to match the hero heading - numbers as sacred symbols, not data
- **Opacity layers**: 4-12% base opacity with subtle gold glow (`text-shadow`) for luminosity
- **Depth through blur**: Some particles have `filter: blur(1-2px)` creating atmospheric perspective
- **Size variation**: 0.75rem to 2rem creates depth - larger/sharper numbers feel closer
- **Organic motion**: Add subtle horizontal drift (`translateX`) and slight rotation for ethereal movement
- **Spatial distribution**: Weighted toward edges (15-35% and 65-85% horizontal) to frame content, not compete
- **Colors**: Primarily gold with copper/bronze accents, each with matching glow
- **Speed**: 15-28s per cycle - meditative, dreamlike pace
- **Fade zones**: CSS mask fades top 10% (emergence) and bottom 30% (dissolution)

## Files Created

### 1. `src/components/numbers/NumberRain.tsx`

Client component with:
- 25 particles with randomized properties
- Weighted edge distribution to frame content
- Color configs with matching glow colors
- Respects `useReducedMotion` hook
- `paused` prop for search state

## Files Modified

### 2. `src/styles/globals.css`

Added CSS keyframe animation before Reduced Motion section:
- `@keyframes number-fall` with drift and rotation
- `.animate-number-fall` utility class

### 3. `src/components/numbers/index.ts`

Added export for `NumberRain`.

### 4. `src/app/numbers/NumbersPageClient.tsx`

- Added `relative` to hero section
- Added `NumberRain` component with `paused={isSearching}`
- Added `relative z-10` to `AnimateOnScroll` to layer content above rain

## Verification

- [x] `pnpm check` - no errors
- [x] `pnpm build` - production build succeeds
