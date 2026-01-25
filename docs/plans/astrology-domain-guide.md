# Astrology Domain Guide for WavePoint Synthesis

**Purpose**: Comprehensive domain reference for building the Sacred Geometry x Numerology x Astrology synthesis framework.

**Audience**: Development team (human + AI) implementing astrology features.

**Last Updated**: 2026-01-24

---

## Table of Contents

1. [Core Concepts](#core-concepts)
   - [Natal Charts](#natal-charts)
   - [House Systems](#house-systems)
   - [Planets](#planets)
   - [Aspects](#aspects)
   - [Zodiac Signs](#zodiac-signs)
   - [Transits](#transits)
   - [Progressions](#progressions)
2. [Prioritization for Synthesis](#prioritization-for-synthesis)
3. [Key Relationships](#key-relationships)
4. [Glossary](#glossary)
5. [Implementation Notes](#implementation-notes)

---

## Core Concepts

### Natal Charts

A natal chart (birth chart) is a snapshot of the sky at the exact moment and location of birth. It maps where each planet was positioned relative to the zodiac and the local horizon.

#### Required Inputs

| Input | Required | Notes |
|-------|----------|-------|
| **Date of birth** | Yes | Full date (day, month, year) |
| **Time of birth** | Highly recommended | Determines Ascendant and house placements. Unknown time = degraded experience |
| **Location of birth** | Yes | City/coordinates for accurate house calculations |

#### What a Natal Chart Contains

1. **Planetary Positions**: Where each planet was in the zodiac (sign + degree)
2. **House Placements**: Which life area each planet occupies
3. **Ascendant (Rising Sign)**: The sign rising on the eastern horizon at birth
4. **Midheaven (MC)**: The highest point in the sky, related to career/public life
5. **Aspects**: Angular relationships between planets
6. **Nodes**: Lunar nodes indicating karmic direction

#### The Core Formula

> "Planets show **what** is happening, Signs show **how** it's happening, Houses show **where** it's happening."

This is the essential interpretive framework. Example:
- Mars (energy, drive) in Virgo (methodical, analytical) in the 10th house (career)
- = Someone who channels drive methodically into professional achievement

---

### House Systems

Houses divide the chart into 12 sections representing different life areas. Different house systems calculate these divisions differently.

#### Comparison of Major Systems

| System | Calculation | Pros | Cons | WavePoint Recommendation |
|--------|-------------|------|------|--------------------------|
| **Whole Sign** | Each sign = one house, starting with Ascendant sign | Simplest; oldest (Greek/Babylonian); works at all latitudes; best for timing techniques | MC can "float" into 9th/10th/11th house | **Primary for MVP** |
| **Placidus** | Time-based divisions (how long degrees take to rise) | Most popular in modern Western astrology; psychological depth; customized to exact birth time | Breaks at extreme latitudes; houses can be unequal/missing; complex calculation | Secondary option |
| **Equal** | 30-degree segments from Ascendant degree | Simple; consistent; works at all latitudes | Less traditional; MC also floats | Fallback option |

#### Recommendation for WavePoint

**Use Whole Sign as default** because:
1. Simpler to implement and explain
2. Works reliably at all latitudes (global user base)
3. Aligns with traditional astrology revival
4. Best for transit interpretations (our primary use case with Signal)

Offer Placidus as an advanced option for users who prefer it.

#### The 12 Houses

| House | Life Area | Keywords | Element Affinity |
|-------|-----------|----------|------------------|
| 1st | Self | Identity, appearance, first impressions | Fire (Aries) |
| 2nd | Resources | Money, possessions, values, self-worth | Earth (Taurus) |
| 3rd | Communication | Siblings, short travel, learning, writing | Air (Gemini) |
| 4th | Home | Family, roots, private life, emotional security | Water (Cancer) |
| 5th | Creativity | Romance, children, play, self-expression | Fire (Leo) |
| 6th | Service | Health, daily work, routines, pets | Earth (Virgo) |
| 7th | Partnership | Marriage, contracts, open enemies, one-on-one | Air (Libra) |
| 8th | Transformation | Death/rebirth, shared resources, intimacy, occult | Water (Scorpio) |
| 9th | Philosophy | Higher education, travel, religion, publishing | Fire (Sagittarius) |
| 10th | Career | Public image, achievement, authority, reputation | Earth (Capricorn) |
| 11th | Community | Friends, groups, hopes, humanitarian ideals | Air (Aquarius) |
| 12th | Transcendence | Unconscious, solitude, dreams, hidden enemies | Water (Pisces) |

---

### Planets

#### Traditional Seven (Classical)

The seven visible celestial bodies used since antiquity. These are the foundation for synthesis.

| Planet | Symbol | Keywords | Day | Metal | Number | Element |
|--------|--------|----------|-----|-------|--------|---------|
| **Sun** | ☉ | Identity, will, vitality, ego, father | Sunday | Gold | 1 | Fire |
| **Moon** | ☽ | Emotions, instincts, mother, habits, unconscious | Monday | Silver | 2 | Water |
| **Mercury** | ☿ | Communication, intellect, travel, trickster | Wednesday | Mercury | 5 | Air |
| **Venus** | ♀ | Love, beauty, harmony, values, pleasure | Friday | Copper | 6 | Earth |
| **Mars** | ♂ | Action, energy, drive, aggression, desire | Tuesday | Iron | 9 | Fire |
| **Jupiter** | ♃ | Expansion, wisdom, luck, philosophy, excess | Thursday | Tin | 3 | Ether |
| **Saturn** | ♄ | Structure, discipline, time, karma, limitation | Saturday | Lead | 8 | Earth |

#### Modern Outer Planets

Discovered after telescope invention. Used in modern Western astrology but not traditional systems.

| Planet | Symbol | Keywords | Discovery | Number | Notes |
|--------|--------|----------|-----------|--------|-------|
| **Uranus** | ⛢ | Revolution, innovation, disruption, awakening | 1781 | 4 | Replaces Rahu in Vedic |
| **Neptune** | ♆ | Dreams, spirituality, illusion, transcendence | 1846 | 7 | Replaces Ketu in Vedic |
| **Pluto** | ♇ | Transformation, power, death/rebirth, shadow | 1930 | - | Debated status |

#### Benefic vs. Malefic (Traditional Classification)

| Benefic (Positive) | Malefic (Challenging) | Variable |
|--------------------|----------------------|----------|
| Jupiter (Greater) | Saturn (Greater) | Mercury |
| Venus (Lesser) | Mars (Lesser) | Moon |

This distinction is fundamental to traditional interpretation but less emphasized in modern psychological astrology.

#### Planetary Dignities

Planets have varying strength depending on which sign they occupy.

| Planet | Domicile (Rules) | Exaltation | Detriment | Fall |
|--------|------------------|------------|-----------|------|
| Sun | Leo | Aries | Aquarius | Libra |
| Moon | Cancer | Taurus | Capricorn | Scorpio |
| Mercury | Gemini, Virgo | Virgo | Sagittarius, Pisces | Pisces |
| Venus | Taurus, Libra | Pisces | Scorpio, Aries | Virgo |
| Mars | Aries, Scorpio | Capricorn | Taurus, Libra | Cancer |
| Jupiter | Sagittarius, Pisces | Cancer | Gemini, Virgo | Capricorn |
| Saturn | Capricorn, Aquarius | Libra | Cancer, Leo | Aries |

**Significance for Synthesis**: A planet in domicile/exaltation is "strong" and expresses easily. In detriment/fall, it struggles but may develop depth through challenge. This maps to number patterns that feel "natural" vs. those that feel like "lessons."

---

### Aspects

Aspects are angular relationships between planets that create harmony or tension.

#### Major Aspects (Ptolemaic)

| Aspect | Angle | Symbol | Nature | Orb (typical) | Meaning |
|--------|-------|--------|--------|---------------|---------|
| **Conjunction** | 0° | ☌ | Neutral (depends on planets) | 8-10° | Fusion, intensification, new beginnings |
| **Opposition** | 180° | ☍ | Hard | 8-10° | Polarity, tension, awareness through contrast |
| **Trine** | 120° | △ | Soft | 6-8° | Harmony, ease, natural talent |
| **Square** | 90° | □ | Hard | 6-8° | Tension, challenge, motivation through friction |
| **Sextile** | 60° | ⚹ | Soft | 4-6° | Opportunity, cooperation, gentle support |

#### Minor Aspects

| Aspect | Angle | Nature | Notes |
|--------|-------|--------|-------|
| Quincunx/Inconjunct | 150° | Challenging | Awkward adjustment, blind spots |
| Semi-sextile | 30° | Mildly beneficial | Subtle connection |
| Semi-square | 45° | Mildly challenging | Friction, irritation |
| Sesquiquadrate | 135° | Mildly challenging | Tension requiring action |
| Quintile | 72° | Creative | Talent, genius aspects |

#### Orbs

The "orb" is how far from exact an aspect can be and still count. Tighter orbs = stronger effects.

**For WavePoint MVP**: Focus on major aspects with moderate orbs (6-8°). Minor aspects can be Phase 2.

---

### Zodiac Signs

#### The 12 Signs with Elements and Modalities

| Sign | Symbol | Element | Modality | Ruling Planet | Keywords |
|------|--------|---------|----------|---------------|----------|
| **Aries** | ♈ | Fire | Cardinal | Mars | Initiative, courage, impulsiveness |
| **Taurus** | ♉ | Earth | Fixed | Venus | Stability, sensuality, stubbornness |
| **Gemini** | ♊ | Air | Mutable | Mercury | Communication, curiosity, duality |
| **Cancer** | ♋ | Water | Cardinal | Moon | Nurturing, emotion, protectiveness |
| **Leo** | ♌ | Fire | Fixed | Sun | Creativity, pride, generosity |
| **Virgo** | ♍ | Earth | Mutable | Mercury | Analysis, service, perfectionism |
| **Libra** | ♎ | Air | Cardinal | Venus | Balance, harmony, indecision |
| **Scorpio** | ♏ | Water | Fixed | Mars/Pluto | Intensity, transformation, secrecy |
| **Sagittarius** | ♐ | Fire | Mutable | Jupiter | Adventure, philosophy, restlessness |
| **Capricorn** | ♑ | Earth | Cardinal | Saturn | Ambition, discipline, responsibility |
| **Aquarius** | ♒ | Air | Fixed | Saturn/Uranus | Innovation, independence, detachment |
| **Pisces** | ♓ | Water | Mutable | Jupiter/Neptune | Intuition, compassion, escapism |

#### Elements

| Element | Signs | Quality | Platonic Solid | Numbers |
|---------|-------|---------|----------------|---------|
| **Fire** | Aries, Leo, Sagittarius | Transformation, will, action | Tetrahedron | 1, 9 |
| **Earth** | Taurus, Virgo, Capricorn | Manifestation, stability, grounding | Cube | 4, 6, 8 |
| **Air** | Gemini, Libra, Aquarius | Intellect, communication, movement | Octahedron | 5 |
| **Water** | Cancer, Scorpio, Pisces | Emotion, intuition, flow | Icosahedron | 2, 7 |
| **Ether** | (Dodecahedron) | Transcendence, unity, cosmos | Dodecahedron | 3 |

#### Modalities

| Modality | Signs | Quality | Seasonal Position |
|----------|-------|---------|-------------------|
| **Cardinal** | Aries, Cancer, Libra, Capricorn | Initiating, leading, starting | Begin each season |
| **Fixed** | Taurus, Leo, Scorpio, Aquarius | Sustaining, persisting, stabilizing | Middle of each season |
| **Mutable** | Gemini, Virgo, Sagittarius, Pisces | Adapting, transforming, transitioning | End of each season |

---

### Transits

Transits are the current positions of planets in the sky and how they relate to a natal chart.

#### Key Concepts

- **Transiting planet**: Where a planet is NOW
- **Natal planet**: Where a planet was at BIRTH
- **Transit aspect**: When transiting planet forms an aspect to a natal planet

#### Transit Speed and Duration

| Planet | Orbit Period | Transit Duration per Sign | Significance |
|--------|--------------|---------------------------|--------------|
| Moon | 27.5 days | 2.5 days | Moods, daily fluctuations |
| Sun | 1 year | 1 month | Monthly themes |
| Mercury | 88 days | 14-30 days | Communication cycles |
| Venus | 225 days | 23-60 days | Relationship/value themes |
| Mars | 2 years | 1.5-2 months | Energy/conflict cycles |
| Jupiter | 12 years | 1 year | Growth/expansion cycles |
| Saturn | 29 years | 2.5 years | Discipline/karma cycles |
| Uranus | 84 years | 7 years | Revolutionary change |
| Neptune | 165 years | 14 years | Spiritual dissolution |
| Pluto | 248 years | 12-30 years | Deep transformation |

#### Key Transit Concepts for Signal Integration

1. **Saturn Return** (~29 years): Major life transition, adulthood milestone
2. **Jupiter Return** (~12 years): Expansion cycles, new chapters
3. **Mercury Retrograde** (3x/year): Communication review period
4. **Lunar Phase**: 29.5-day emotional cycle

---

### Progressions

Secondary progressions use symbolic time: one day after birth = one year of life.

#### How It Works

- Person born April 2, 1982
- To calculate progressed chart for 2007 (25 years later)
- Look at planetary positions for April 27, 1982 (25 days later)

#### What Moves Significantly

| Planet | Progressed Speed | Significance |
|--------|------------------|--------------|
| Moon | ~12-13° per year | Emotional themes by sign/house (full cycle = 27 years) |
| Sun | ~1° per year | Identity evolution (30 years per sign) |
| Mercury | Variable | Mental development |
| Venus | Variable | Relationship/value evolution |
| Mars | Slow | Action/drive evolution |
| Outer planets | Barely move | Not significant in progressions |

#### Key Events

- **Progressed Sun changing signs**: Major identity shift
- **Progressed Moon changing signs**: Emotional focus shift (every 2.5 years)
- **Progressed planet crossing an angle**: Life milestone

**For WavePoint**: Progressions are Phase 3+ material. Focus on transits first.

---

## Prioritization for Synthesis

### Phase 1: MVP (Essential)

These elements are required for meaningful personalization with Signal.

| Element | Why Essential | Implementation Notes |
|---------|---------------|---------------------|
| **Sun Sign** | Primary identity | Easy calculation, familiar to users |
| **Moon Sign** | Emotional nature | Requires birth time for accuracy |
| **Rising Sign** | Personality expression | Requires birth time + location |
| **Element Balance** | Fire/Earth/Air/Water distribution | Count planets by element |
| **Current Outer Planet Transits** | Saturn, Jupiter, Uranus, Neptune, Pluto aspects to natal | Long-lasting, interpretively rich |

### Phase 2: Enhanced (Nice-to-Have)

| Element | Value Added | Complexity |
|---------|-------------|------------|
| Full house placements | Deeper personalization | Medium |
| Major natal aspects | Character depth | Medium |
| Inner planet transits | Daily/weekly relevance | Higher (faster updates) |
| Mercury retrograde awareness | Popular, practical | Low |

### Phase 3: Advanced (Future)

| Element | Value Added | Complexity |
|---------|-------------|------------|
| Secondary progressions | Long-term evolution | High |
| Solar arc directions | Life timing | Medium |
| Lunar nodes | Karmic direction | Medium |
| Asteroids (Chiron, etc.) | Nuanced interpretation | High |

### Minimum Viable Astrology for Phase 1

```
Input:
- Birth date (required)
- Birth time (optional but encouraged)
- Birth location (required)

Calculate:
- Sun sign and degree
- Moon sign (approximate if no birth time)
- Rising sign (if birth time available)
- Element balance (count of planets in each element)
- Current Saturn, Jupiter transits to natal Sun/Moon

Output for Signal interpretations:
- "As a Virgo Sun..." (if Sun-related number pattern)
- "With Saturn currently in your 4th house..." (if stability-related pattern)
- "Your natal Moon in Scorpio deepens the meaning of 888..." (emotional+abundance)
```

---

## Key Relationships

### Elements to Sacred Geometry

| Element | Platonic Solid | Properties | Synthesis Notes |
|---------|----------------|------------|-----------------|
| **Fire** | Tetrahedron | 4 faces, triangular, simplest | Fire signs (Aries/Leo/Sag) + patterns with 1, 9 |
| **Earth** | Cube (Hexahedron) | 6 faces, square, most stable | Earth signs (Taurus/Virgo/Cap) + patterns with 4, 6, 8 |
| **Air** | Octahedron | 8 faces, triangular, dual of cube | Air signs (Gem/Lib/Aqua) + patterns with 5 |
| **Water** | Icosahedron | 20 faces, triangular, most complex | Water signs (Cancer/Scorp/Pisces) + patterns with 2, 7 |
| **Ether/Spirit** | Dodecahedron | 12 faces, pentagonal, cosmic | Jupiter patterns (3), transcendence patterns |

### Elements to Number Patterns

| Element | Primary Numbers | Pattern Examples | Interpretation Flavor |
|---------|-----------------|------------------|----------------------|
| **Fire** | 1, 9 | 111, 999, 1919 | Initiation, will, transformation |
| **Earth** | 4, 6, 8 | 444, 666, 888, 4444 | Stability, nurturing, abundance |
| **Air** | 5 | 555, 5555 | Change, movement, communication |
| **Water** | 2, 7 | 222, 777, 2222, 7777 | Intuition, emotion, spirituality |
| **Ether** | 3 | 333, 3333 | Expansion, wisdom, cosmic connection |

### Planets to Numbers (Already Implemented in `planetary.ts`)

| Number | Planet | Already in Codebase | Confidence |
|--------|--------|---------------------|------------|
| 1 | Sun | Yes | Very High |
| 2 | Moon | Yes | Very High |
| 3 | Jupiter | Yes | High |
| 4 | Uranus/Rahu | Yes | Moderate |
| 5 | Mercury | Yes | High |
| 6 | Venus | Yes | High |
| 7 | Neptune/Ketu | Yes | Moderate |
| 8 | Saturn | Yes | Very High |
| 9 | Mars | Yes | Very High |

### Fire Signs to Number Patterns

| Sign | Ruling Planet | Related Numbers | Pattern Affinity |
|------|---------------|-----------------|------------------|
| **Aries** | Mars (9) | 9, 1 (Mars drive + new beginnings) | 111, 999, 1919 |
| **Leo** | Sun (1) | 1 (pure solar) | 111, 1111 |
| **Sagittarius** | Jupiter (3) | 3 (expansion) | 333, 1234 (forward motion) |

### Earth Signs to Number Patterns

| Sign | Ruling Planet | Related Numbers | Pattern Affinity |
|------|---------------|-----------------|------------------|
| **Taurus** | Venus (6) | 6, 4 (stability) | 666, 444 |
| **Virgo** | Mercury (5) | 5, 6 (service) | 555, 666 |
| **Capricorn** | Saturn (8) | 8, 4 (structure) | 888, 444 |

### Water Signs to Number Patterns

| Sign | Ruling Planet | Related Numbers | Pattern Affinity |
|------|---------------|-----------------|------------------|
| **Cancer** | Moon (2) | 2 (emotion) | 222, 2222 |
| **Scorpio** | Mars/Pluto (9) | 9, 7 (transformation) | 999, 777, 909 |
| **Pisces** | Jupiter/Neptune (3, 7) | 3, 7 (transcendence) | 333, 777 |

### Air Signs to Number Patterns

| Sign | Ruling Planet | Related Numbers | Pattern Affinity |
|------|---------------|-----------------|------------------|
| **Gemini** | Mercury (5) | 5 (communication) | 555, 5555 |
| **Libra** | Venus (6) | 6 (harmony) | 666, 1221 (balance) |
| **Aquarius** | Saturn/Uranus (8, 4) | 4, 8 (innovation) | 444, 888 |

---

## Glossary

### Essential Terms

| Term | Definition | WavePoint Usage |
|------|------------|-----------------|
| **Natal Chart** | Map of sky at birth moment | Foundation for personalization |
| **Ascendant (Rising)** | Sign on eastern horizon at birth | Personality expression |
| **Midheaven (MC)** | Highest point in chart | Career/public image |
| **Transit** | Current planetary position relative to natal | Real-time interpretation context |
| **Aspect** | Angular relationship between planets | Energy dynamics |
| **Orb** | Allowed deviation from exact aspect | Calculation tolerance |
| **House** | Chart section representing life area | Where energy manifests |
| **Sign** | Zodiac constellation/30-degree segment | How energy expresses |
| **Domicile** | Sign a planet rules | Planet at full strength |
| **Exaltation** | Sign where planet is honored | Planet elevated |
| **Detriment** | Sign opposite domicile | Planet challenged |
| **Fall** | Sign opposite exaltation | Planet weakened |

### Technical Terms

| Term | Definition | Technical Notes |
|------|------------|-----------------|
| **Ephemeris** | Table of planetary positions over time | Swiss Ephemeris is gold standard |
| **Tropical Zodiac** | Signs based on seasons (equinoxes) | Western astrology default |
| **Sidereal Zodiac** | Signs based on actual constellations | Vedic astrology default |
| **Benefic** | Favorable planet (Jupiter, Venus) | Traditional classification |
| **Malefic** | Challenging planet (Saturn, Mars) | Traditional classification |
| **Retrograde** | Planet appearing to move backward | Special interpretive meaning |
| **Station** | Planet changing direction | Heightened influence |
| **Cazimi** | Planet within 17' of Sun | Extremely powerful |
| **Combustion** | Planet within 8-17' of Sun | Weakened by Sun's light |

### Synthesis Terms (WavePoint-Specific)

| Term | Definition |
|------|------------|
| **Spiritual Profile** | User's combined geometry, numerology, and astrology data |
| **Synthesis Edge** | Connection between geometry, number, and astrology elements |
| **Resonance** | User feedback on interpretation accuracy |
| **Elemental Balance** | Distribution of planets across Fire/Earth/Air/Water |
| **Pattern Affinity** | Which number patterns resonate with user's chart |

---

## Implementation Notes

### Swiss Ephemeris

The Swiss Ephemeris is the industry standard for astrological calculations, providing:

- Planetary positions with 0.0001-degree precision
- Coverage from 13000 BCE to 17000 CE
- All major house systems
- Aspect calculations

**npm package**: `swisseph` (Node.js bindings)
**WebAssembly options**: `swisseph-wasm`, `astro-sweph`

### Calculation Requirements

1. **Birth Time Handling**
   - Unknown time: Use noon as default, flag as "approximate"
   - Known time: Convert to UTC, apply timezone
   - Partial knowledge ("morning"): Use 9am, note uncertainty

2. **House Calculation**
   - Requires geographic coordinates (lat/long)
   - Location autocomplete needed (Google Places or similar)
   - Store coordinates, not just city name

3. **Aspect Calculation**
   - Compare each planet pair
   - Check if angular difference is within orb
   - Store: planets involved, aspect type, orb tightness

### Data Model Sketch

```typescript
interface SpiritualProfile {
  // Birth Data
  birthDate: Date;
  birthTime?: string; // HH:mm or null
  birthTimeApproximate: boolean;
  birthLocation: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };

  // Calculated Chart
  chart: {
    sunSign: ZodiacSign;
    sunDegree: number;
    moonSign: ZodiacSign;
    moonDegree: number;
    risingSign?: ZodiacSign; // Only if birth time known
    risingDegree?: number;

    planets: PlanetPosition[];
    houses?: HousePosition[]; // Only if birth time known
    aspects: Aspect[];
  };

  // Derived Analysis
  analysis: {
    elementBalance: ElementBalance;
    modalityBalance: ModalityBalance;
    dominantPlanets: Planet[];
    patternAffinities: PatternAffinity[];
  };
}
```

### Error Handling

| Scenario | Approach |
|----------|----------|
| No birth time | Calculate without houses/rising; note limitation |
| Unknown location | Require location; can't calculate houses without it |
| Future dates | Reject; natal charts are for past/present births |
| Ancient dates | Swiss Ephemeris handles; may note reduced accuracy |

---

## Sources

This document synthesizes information from multiple sources:

- [Cafe Astrology - Birth Chart Interpretations](https://cafeastrology.com/natalastrology.html)
- [Astro-Seek - House Systems Calculator](https://horoscopes.astro-seek.com/astrology-house-systems-calculator)
- [Kelly Surtees - Why I Switched to Whole Sign Houses](https://www.kellysastrology.com/2018/07/16/why-i-switched-to-whole-sign-houses/)
- [Astro Butterfly - Which House System Should You Use](https://astrobutterfly.com/2023/09/19/which-house-system-should-you-use/)
- [Wikipedia - Planets in Astrology](https://en.wikipedia.org/wiki/Planets_in_astrology)
- [The Astrology Podcast - Significations of the Seven Traditional Planets](https://theastrologypodcast.com/2016/02/24/significations-of-seven-traditional-planets/)
- [Centre of Excellence - Major and Minor Aspects](https://www.centreofexcellence.com/major-and-minor-aspects-in-astrology/)
- [Almanac - Modalities in Astrology](https://www.almanac.com/cardinal-fixed-mutable-cardinal-signs)
- [Almanac - Zodiac Elements](https://www.almanac.com/zodiac-elements-fire-earth-air-water-explained)
- [Wikipedia - Astrological Progression](https://en.wikipedia.org/wiki/Astrological_progression)
- [Cafe Astrology - Secondary Progressions](https://cafeastrology.com/secondaryprogressions.html)
- [Saturn and Honey - Essential Dignities](https://www.saturnandhoney.com/blog/domicile-exaltation-detriment-and-fall-in-astrology)
- [AstroStyle - Master Numbers](https://astrostyle.com/astrology/master-numbers/)
- [Astrology-API.io - Birth Chart API](https://astrology-api.io/p/birth-chart-api)
- [Wikipedia - Platonic Solid](https://en.wikipedia.org/wiki/Platonic_solid)

---

## Next Steps

1. **Swiss Ephemeris Spike** - Validate library can produce accurate charts
2. **Synthesis Framework Design** - Map specific edges between systems
3. **Spiritual Profile Schema** - Full database design
4. **Birth Data UX** - Design the onboarding flow for capturing birth data
