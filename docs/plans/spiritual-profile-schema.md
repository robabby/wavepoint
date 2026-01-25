# Spiritual Profile Schema Design

**Purpose**: Database schema for storing user birth data and calculated astrological chart data.

**Audience**: Development team implementing astrology integration.

**Last Updated**: 2026-01-24

---

## Overview

The Spiritual Profile stores everything needed to personalize Signal interpretations with astrology:

1. **Birth Data** - User-provided date, time (optional), and location
2. **Calculated Chart** - Sun/Moon/Rising signs, all planet positions
3. **Element Balance** - Pre-computed element counts for fast queries
4. **Synthesis Data** - Derived data for pattern matching

---

## Design Decisions

### 1. One Profile Per User (1:1)

Each user has exactly one spiritual profile. If they want to update their birth data, they update the existing profile rather than creating a new one.

**Rationale**: Simpler data model, avoids complexity of managing multiple profiles.

### 2. Store Both Raw and Computed Data

We store the birth data (input) AND the calculated chart (output). The chart can be recalculated if our algorithms improve, but we always preserve the original input.

**Rationale**:
- Avoid recalculating on every query
- Allow bulk recalculation if we upgrade the ephemeris library
- Enable quick reads without computation

### 3. JSON for Detailed Positions

Full planet positions and aspects are stored as JSONB. The "Big Three" (Sun, Moon, Rising) get dedicated columns for fast queries.

**Rationale**:
- Dedicated columns for common queries (`WHERE sun_sign = 'capricorn'`)
- JSONB for full chart (rarely queried directly, used for interpretation context)

### 4. Element Balance as Integers

Pre-computed counts of planets in each element (Fire: 3, Earth: 2, etc.).

**Rationale**: Enables queries like "users with heavy Earth emphasis" without parsing JSON.

### 5. Birth Time Handling

- `birthTime` is nullable (many users don't know their birth time)
- `birthTimeApproximate` flag indicates confidence level
- When no birth time, Rising sign is null and house placements are omitted

**Rationale**: Graceful degradation - we can still provide Sun/Moon interpretation without birth time.

---

## Schema Definition

```sql
CREATE TABLE spiritual_profiles (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User relationship (1:1)
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Birth Date (required)
  birth_date DATE NOT NULL,

  -- Birth Time (optional - not everyone knows their birth time)
  birth_time TIME,
  birth_time_approximate BOOLEAN NOT NULL DEFAULT false,

  -- Birth Location (required for any chart calculation)
  birth_city TEXT NOT NULL,
  birth_country TEXT NOT NULL,
  birth_latitude NUMERIC(9,6) NOT NULL,  -- -90 to 90, 6 decimal precision
  birth_longitude NUMERIC(10,6) NOT NULL, -- -180 to 180, 6 decimal precision
  birth_timezone TEXT NOT NULL,           -- IANA timezone, e.g., 'America/New_York'

  -- The Big Three (denormalized for fast queries)
  sun_sign TEXT,          -- 'aries', 'taurus', etc.
  sun_degree NUMERIC(5,2), -- 0.00 to 29.99
  moon_sign TEXT,
  moon_degree NUMERIC(5,2),
  rising_sign TEXT,       -- NULL if no birth time
  rising_degree NUMERIC(5,2),

  -- Element Balance (pre-computed for pattern matching)
  element_fire INTEGER NOT NULL DEFAULT 0,   -- Count of planets in fire signs
  element_earth INTEGER NOT NULL DEFAULT 0,
  element_air INTEGER NOT NULL DEFAULT 0,
  element_water INTEGER NOT NULL DEFAULT 0,

  -- Modality Balance (pre-computed)
  modality_cardinal INTEGER NOT NULL DEFAULT 0,
  modality_fixed INTEGER NOT NULL DEFAULT 0,
  modality_mutable INTEGER NOT NULL DEFAULT 0,

  -- Full Chart Data (JSONB for detailed positions)
  chart_data JSONB,

  -- Calculation Metadata
  calculated_at TIMESTAMP WITH TIME ZONE,
  calculation_version TEXT,  -- e.g., 'v1.0.0' - allows bulk recalc on upgrade

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_spiritual_profiles_user_id ON spiritual_profiles(user_id);
CREATE INDEX idx_spiritual_profiles_sun_sign ON spiritual_profiles(sun_sign);
CREATE INDEX idx_spiritual_profiles_moon_sign ON spiritual_profiles(moon_sign);
CREATE INDEX idx_spiritual_profiles_rising_sign ON spiritual_profiles(rising_sign);

-- GIN index for JSONB queries (if needed)
CREATE INDEX idx_spiritual_profiles_chart_data ON spiritual_profiles USING GIN (chart_data);
```

---

## Drizzle Schema

```typescript
import {
  pgTable,
  uuid,
  text,
  date,
  time,
  boolean,
  numeric,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const spiritualProfiles = pgTable(
  "spiritual_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    // Birth Date (required)
    birthDate: date("birth_date", { mode: "date" }).notNull(),

    // Birth Time (optional)
    birthTime: time("birth_time"),
    birthTimeApproximate: boolean("birth_time_approximate").notNull().default(false),

    // Birth Location (required)
    birthCity: text("birth_city").notNull(),
    birthCountry: text("birth_country").notNull(),
    birthLatitude: numeric("birth_latitude", { precision: 9, scale: 6 }).notNull(),
    birthLongitude: numeric("birth_longitude", { precision: 10, scale: 6 }).notNull(),
    birthTimezone: text("birth_timezone").notNull(),

    // The Big Three (denormalized)
    sunSign: text("sun_sign"),
    sunDegree: numeric("sun_degree", { precision: 5, scale: 2 }),
    moonSign: text("moon_sign"),
    moonDegree: numeric("moon_degree", { precision: 5, scale: 2 }),
    risingSign: text("rising_sign"),
    risingDegree: numeric("rising_degree", { precision: 5, scale: 2 }),

    // Element Balance
    elementFire: integer("element_fire").notNull().default(0),
    elementEarth: integer("element_earth").notNull().default(0),
    elementAir: integer("element_air").notNull().default(0),
    elementWater: integer("element_water").notNull().default(0),

    // Modality Balance
    modalityCardinal: integer("modality_cardinal").notNull().default(0),
    modalityFixed: integer("modality_fixed").notNull().default(0),
    modalityMutable: integer("modality_mutable").notNull().default(0),

    // Full Chart Data (JSONB)
    chartData: jsonb("chart_data"),

    // Calculation Metadata
    calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: "date" }),
    calculationVersion: text("calculation_version"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("spiritual_profiles_sun_sign_idx").on(table.sunSign),
    index("spiritual_profiles_moon_sign_idx").on(table.moonSign),
    index("spiritual_profiles_rising_sign_idx").on(table.risingSign),
  ]
);
```

---

## chartData JSONB Structure

The `chart_data` column stores the full chart for detailed queries:

```typescript
interface ChartData {
  // All planet positions
  planets: {
    [planetId: string]: {
      sign: string;
      degree: number;
      longitude: number;
      isRetrograde: boolean;
      house: number | null;  // null if no birth time
    };
  };

  // House cusps (only if birth time known)
  houses?: {
    number: number;
    sign: string;
    degree: number;
  }[];

  // Angles (only if birth time known)
  angles?: {
    ascendant: { sign: string; degree: number; longitude: number };
    midheaven: { sign: string; degree: number; longitude: number };
  };

  // Major aspects (optional - can compute on demand)
  aspects?: {
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
    isApplying: boolean;
  }[];

  // Calculation source
  meta: {
    library: string;      // "circular-natal-horoscope-js"
    version: string;      // "1.0.0"
    houseSystem: string;  // "whole-sign"
    zodiacSystem: string; // "tropical"
  };
}
```

---

## Usage Examples

### Create Profile

```typescript
import { db } from "@/lib/db";
import { spiritualProfiles } from "@/lib/db/schema";
import { calculateChart } from "@/lib/astrology";

async function createSpiritualProfile(userId: string, birthData: BirthData) {
  // Calculate the chart
  const chart = calculateChart(birthData);

  // Compute element balance
  const elements = computeElementBalance(chart);
  const modalities = computeModalityBalance(chart);

  // Insert profile
  const [profile] = await db
    .insert(spiritualProfiles)
    .values({
      userId,
      birthDate: new Date(birthData.year, birthData.month - 1, birthData.day),
      birthTime: birthData.hour !== undefined
        ? `${birthData.hour}:${birthData.minute}:00`
        : null,
      birthTimeApproximate: false,
      birthCity: birthData.location.name ?? "Unknown",
      birthCountry: "US", // Would come from geocoding
      birthLatitude: birthData.location.latitude.toString(),
      birthLongitude: birthData.location.longitude.toString(),
      birthTimezone: "America/New_York", // Would come from geocoding

      // Big Three
      sunSign: chart.sunSign,
      sunDegree: chart.planets.sun.position.signDegrees.toString(),
      moonSign: chart.moonSign,
      moonDegree: chart.planets.moon.position.signDegrees.toString(),
      risingSign: chart.risingSign,
      risingDegree: chart.angles.ascendant.position.signDegrees.toString(),

      // Element balance
      ...elements,

      // Modality balance
      ...modalities,

      // Full chart
      chartData: serializeChartData(chart),
      calculatedAt: new Date(),
      calculationVersion: "v1.0.0",
    })
    .returning();

  return profile;
}
```

### Query by Element Balance

```typescript
// Find users with strong Earth emphasis (4+ planets in Earth signs)
const earthyUsers = await db
  .select()
  .from(spiritualProfiles)
  .where(gte(spiritualProfiles.elementEarth, 4));

// Find users with element imbalance (one element has 0)
const imbalancedUsers = await db
  .select()
  .from(spiritualProfiles)
  .where(
    or(
      eq(spiritualProfiles.elementFire, 0),
      eq(spiritualProfiles.elementEarth, 0),
      eq(spiritualProfiles.elementAir, 0),
      eq(spiritualProfiles.elementWater, 0)
    )
  );
```

### Query for Signal Integration

```typescript
// Get profile for interpretation context
async function getProfileForInterpretation(userId: string) {
  const profile = await db.query.spiritualProfiles.findFirst({
    where: eq(spiritualProfiles.userId, userId),
  });

  if (!profile) return null;

  return {
    sunSign: profile.sunSign,
    moonSign: profile.moonSign,
    risingSign: profile.risingSign,
    elementBalance: {
      fire: profile.elementFire,
      earth: profile.elementEarth,
      air: profile.elementAir,
      water: profile.elementWater,
    },
    chartData: profile.chartData as ChartData,
  };
}
```

---

## Migration Strategy

### Phase 1: Add Table (Non-Breaking)

1. Add `spiritual_profiles` table via migration
2. No existing tables are modified
3. All fields allow null initially for gradual population

### Phase 2: Onboarding Flow

1. Build birth data collection UI (separate ticket)
2. Optional onboarding step during signup
3. Available in account settings for existing users

### Phase 3: Signal Integration

1. Check for profile when generating interpretations
2. If profile exists, include astrology context in prompt
3. Graceful fallback if no profile

---

## Open Questions

1. **Geocoding**: How to convert "New York City" to lat/lng/timezone?
   - Option A: Google Places API (accurate but costs)
   - Option B: Open-source geocoding (free but less accurate)
   - Recommendation: Start with a simple city picker, defer full geocoding

2. **Birth Time UX**: How to handle "I don't know my exact time"?
   - Option A: Skip birth time entirely
   - Option B: Offer presets ("morning", "afternoon", "evening", "night")
   - Recommendation: Allow skip, note that Rising sign won't be available

3. **Recalculation**: When do we recalculate charts?
   - On ephemeris library upgrade
   - On user birth data edit
   - Batch job for algorithm improvements

---

## Related Documents

- [[Synthesis Framework Design v1]] - How this data feeds into pattern synthesis
- [[Swiss Ephemeris POC]] - The calculation engine
- [[Domain Research]] - Astrology concepts reference
