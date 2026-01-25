# Swiss Ephemeris Research for WavePoint Astrology Engine

> Research conducted: January 2026
> Goal: Evaluate Swiss Ephemeris for building an in-house astrology calculation engine

---

## Executive Summary

The Swiss Ephemeris is the industry standard for astrological calculations, used by professional tools like astro.com. For WavePoint's Next.js/Vercel deployment, there are three viable approaches:

1. **WebAssembly (Recommended)**: `sweph-wasm` - serverless compatible, no native dependencies
2. **Native Node.js**: `sweph` - highest precision, but complex serverless deployment
3. **Pure JavaScript**: `circular-natal-horoscope-js` - zero dependencies, easier deployment, lower precision

**Recommendation**: Start with `sweph-wasm` for serverless compatibility, falling back to Moshier mode (built-in) to avoid ephemeris file hosting complexity.

---

## 1. npm Package Evaluation

### Primary Packages Compared

| Package | Type | TypeScript | Weekly Downloads | Last Updated | License | Serverless |
|---------|------|------------|------------------|--------------|---------|------------|
| `sweph` | Native addon | Yes (built-in) | ~234 | May 2025 | AGPL-3.0 | Difficult |
| `sweph-wasm` | WebAssembly | Yes | Low | Active | AGPL-3.0 | Yes |
| `swisseph` | Native addon | No | Moderate | Unmaintained | GPL-2.0 | Difficult |
| `circular-natal-horoscope-js` | Pure JS | Yes | Moderate | Active | Unlicense | Yes |
| `@nrweb/astro-calc` | TypeScript | Yes | Low | 2024 | MIT | Yes |
| `astrologer` | TypeScript | Yes | Low | Active | Unknown | Yes |

### Detailed Package Analysis

#### `sweph` (timotejroiko/sweph)
**The definitive Swiss Ephemeris bindings for Node.js**

- **Pros**:
  - 100% API coverage of Swiss Ephemeris
  - Built-in TypeScript declarations and ESM exports
  - Version-matched to Swiss Ephemeris releases (currently 2.10.03b)
  - Actively maintained (last release May 2025)
  - Full intellisense documentation

- **Cons**:
  - Native C/C++ addon - requires compilation
  - Node.js only - won't work in browsers or Edge runtime
  - Requires Python, Make, GCC (Linux), Xcode (Mac), or Visual C++ Build Tools
  - Single-threaded C library - process-wide settings affect all worker threads
  - AGPL-3.0 license (requires open-sourcing your app or purchasing commercial license)

- **Installation**:
  ```bash
  npm install sweph          # AGPL-3.0 (latest)
  npm install sweph@gpl      # GPL-2.0 (v2.10.0 and earlier)
  ```

#### `sweph-wasm` (PtPrashantTripathi/sweph-wasm)
**Swiss Ephemeris compiled to WebAssembly**

- **Pros**:
  - WebAssembly - works in browsers AND Node.js 14+
  - No native compilation required
  - Serverless compatible
  - 25+ house systems supported
  - Full TypeScript support
  - Eclipse calculations, coordinate transformations, fixed stars

- **Cons**:
  - AGPL-3.0 license
  - Less community adoption than native `sweph`
  - Bundle size not documented (likely 1-2MB)
  - Ephemeris files cached in memory (cold start implications)

- **Installation**:
  ```bash
  npm install sweph-wasm
  ```

#### `circular-natal-horoscope-js`
**Pure JavaScript using Moshier ephemeris**

- **Pros**:
  - Zero dependencies on native code
  - Works everywhere (browser, Node.js, serverless)
  - TypeScript compatible
  - **Unlicense** - public domain, no licensing concerns
  - Includes aspects calculation with configurable orbs
  - 7 house systems: Placidus, Koch, Topocentric, Regiomontanus, Campanus, Whole Sign, Equal
  - Tropical and Sidereal zodiac support
  - ~235kb minified bundle

- **Cons**:
  - Lower precision than Swiss Ephemeris (0.1 arcsec vs 0.001 arcsec)
  - Only covers CE dates (> year 0)
  - Based on Moshier (DE404), not full Swiss Ephemeris (DE431)
  - Time range: 3000 BC - 3000 AD only

- **Installation**:
  ```bash
  npm install circular-natal-horoscope-js
  ```

#### `@nrweb/astro-calc`
**TypeScript library using Swiss Ephemeris + astronomy-engine**

- **Pros**:
  - Comprehensive feature set (planets, aspects, houses, lots, scoring)
  - MIT license - commercially friendly
  - Built-in aspect grading ("perfect", "joining", "assembly")
  - Calculates astrological challenges (Algol transit, aneretic degrees, Via Combusta)
  - ~293kb bundle size

- **Cons**:
  - Low adoption (~published 7 months ago)
  - Dependencies on both Swiss Ephemeris and astronomy-engine
  - Limited documentation

---

## 2. Data File Requirements

### Swiss Ephemeris Data Files

The Swiss Ephemeris requires external data files for maximum precision:

| File Type | Size | Coverage | Purpose |
|-----------|------|----------|---------|
| Planetary (sepl*.se1) | ~500KB each | 600 years per file | Sun, Moon, planets |
| Lunar (sem*.se1) | ~1.3MB each | 600 years per file | Detailed Moon data |
| Asteroid (seas*.se1) | ~200KB | Main asteroids | Ceres, Pallas, Juno, Vesta |
| **Total core files** | **~90-100MB** | 13000 BC - 17000 AD | Full precision |

**File naming convention**: `sepl_18.se1` covers years 1800-2400

### Moshier Mode (No Files Required)

Swiss Ephemeris includes **built-in Moshier interpolation**:
- No data files needed
- Precision: 0.1 arcsec (vs 0.001 arcsec with files)
- Coverage: 3000 BC - 3000 AD
- **Sufficient for most astrological applications**

### Licensing for Data Files

- Data files are part of Swiss Ephemeris distribution
- Same AGPL/commercial licensing applies
- Can be downloaded from: `ftp://www.astro.com/pub/swisseph/ephe`

### Deployment Strategies

| Strategy | Pros | Cons |
|----------|------|------|
| **Moshier mode** | Zero config, instant deploys | Lower precision, limited time range |
| **Bundle minimal files** | Single file for 1800-2400 | Increases bundle size by ~2MB |
| **External CDN/S3** | Full precision, any time range | Cold start latency, additional infra |
| **Edge caching** | Fast after first load | Complex setup, cost |

**Recommendation**: Start with Moshier mode. 0.1 arcsec is more than adequate for birth charts (astrologers argue about 1-degree orbs, not sub-arcsecond precision).

---

## 3. Capabilities Assessment

### Calculation Features

| Feature | sweph | sweph-wasm | circular-natal-horoscope-js |
|---------|-------|------------|------------------------------|
| Planet positions | All bodies | All bodies | Sun through Pluto |
| Lunar nodes | Yes | Yes | Yes (North/South) |
| Lilith | Yes | Yes | Yes |
| Asteroids | 300,000+ | Yes | No |
| Fixed stars | Yes | Yes | No |
| House cusps | Yes | Yes | Yes (7 systems) |
| Aspects | Manual calc | Manual calc | Built-in with orbs |
| Eclipses | Yes | Yes | No |
| Heliacal events | Yes | Yes | No |
| Retrograde | Yes | Yes | Yes |
| Sidereal zodiac | Yes | Yes | Yes |

### House Systems Supported

Swiss Ephemeris supports 15+ house systems:
- **P** - Placidus (default)
- **K** - Koch
- **W** - Whole Sign
- **E/A** - Equal House
- **C** - Campanus
- **R** - Regiomontanus
- **T** - Topocentric (Polich/Page)
- **M** - Morinus
- **O** - Porphyry
- **B** - Alcabitius
- **G** - Gauquelin sectors
- **H** - Horizon/Azimuth
- **U** - Krusinski-Pisa-Goelzer
- **V** - Equal/Vehlow
- **X** - Axial rotation/Meridian
- **Y** - APC houses

### Accuracy Comparison

| Source | Precision | Notes |
|--------|-----------|-------|
| Swiss Ephemeris (with files) | 0.001 arcsec | Matches Astronomical Almanac |
| Swiss Ephemeris (Moshier) | 0.1 arcsec | Based on DE404 |
| JPL DE431 (raw) | Maximum | 2.8GB data files |
| circular-natal-horoscope-js | 0.1 arcsec | Based on Moshier |

**Context**: 1 degree = 3600 arcseconds. Even "low precision" Moshier at 0.1 arcsec is:
- 36,000x more precise than typical orb discussions (1 degree)
- Sufficient for all practical astrological applications
- Professional astrologers cannot distinguish the difference

### Performance Characteristics

Based on general serverless function behavior:

| Factor | Native (sweph) | WebAssembly (sweph-wasm) | Pure JS |
|--------|---------------|--------------------------|---------|
| Cold start | Higher (binary init) | Moderate (WASM init) | Lowest |
| Warm execution | Fastest | Fast | Good |
| Memory | ~50-100MB base | ~30-50MB base | ~10-20MB |
| Bundle size | Native binary | ~1-2MB WASM | ~235KB |

---

## 4. Implementation Considerations

### Vercel/Serverless Compatibility

| Package | Vercel Serverless | Vercel Edge | Notes |
|---------|-------------------|-------------|-------|
| sweph | Possible but complex | No | Native addons need special config |
| sweph-wasm | Yes | Possibly | WASM works in serverless |
| circular-natal-horoscope-js | Yes | Yes | Pure JS, no issues |

**Native Addon Challenges on Vercel**:
1. Requires `node-loader` webpack configuration
2. Native modules must be marked as externals
3. Binary must be compiled for Amazon Linux 2 (Lambda runtime)
4. `includeFiles` configuration in vercel.json needed for data files

**Recommended Architecture**:
```
┌─────────────────────────────────────────────────┐
│  Next.js API Route (/api/chart/calculate)       │
│  - Vercel Serverless Function                   │
│  - Uses sweph-wasm or circular-natal-horoscope  │
│  - Moshier mode (no external files)             │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│  Response                                        │
│  - Planet positions (longitude, latitude, speed)│
│  - House cusps for selected system              │
│  - Calculated aspects with orbs                 │
└─────────────────────────────────────────────────┘
```

### Caching Strategies

1. **Request-level caching**: Same birth data = same chart (deterministic)
   ```typescript
   const cacheKey = `chart:${birthDate}:${birthTime}:${lat}:${lng}:${houseSystem}`;
   ```

2. **Edge caching**: Cache calculated charts at CDN edge
   - Vercel Edge Config or KV store
   - 24-hour TTL (charts don't change)

3. **Database caching**: Store calculated charts in PostgreSQL
   - Neon supports JSON columns for chart data
   - Query by user + birth data hash

### Memory and CPU Recommendations

For Vercel Serverless Functions:
- **Memory**: 512MB-1024MB recommended
- **Timeout**: 10-30 seconds for complex calculations
- **Region**: Closer to users for lower latency

---

## 5. Proof-of-Concept Scope

### Minimum Viable Spike

**Goal**: Validate Swiss Ephemeris can run on Vercel and produce accurate charts

#### Phase 1: Library Validation (2-4 hours)
```typescript
// Test script: scripts/test-ephemeris.ts
import { /* library */ } from 'sweph-wasm'; // or alternative

const testBirthData = {
  date: new Date('1990-06-15T14:30:00'),
  latitude: 40.7128,  // NYC
  longitude: -74.0060,
  houseSystem: 'P' // Placidus
};

// Expected outputs to verify:
// 1. Sun position (should be ~24° Gemini)
// 2. Moon position
// 3. Ascendant
// 4. House cusps (1-12)
// 5. Major aspects
```

#### Phase 2: Accuracy Verification
1. Generate chart for known birth data
2. Compare against astro.com Extended Chart Selection
3. Verify planet positions match within 1 degree
4. Verify house cusps match within 1 degree
5. Document any discrepancies

**Test cases**:
| Test | Birth Data | Verify Against |
|------|------------|----------------|
| Modern date | June 15, 1990 14:30 NYC | astro.com |
| Historical date | Jan 1, 1900 12:00 London | astro.com |
| Different house systems | Same data, Placidus vs Whole Sign | astro.com |

#### Phase 3: Vercel Deployment Test
1. Create `/api/chart/test` endpoint
2. Deploy to Vercel preview
3. Measure cold start time
4. Measure warm execution time
5. Test error handling (invalid dates, coordinates)

### API Design for POC

```typescript
// POST /api/chart/calculate
interface ChartRequest {
  birthDate: string;        // ISO 8601
  birthTime: string;        // HH:mm
  latitude: number;
  longitude: number;
  houseSystem?: 'P' | 'W' | 'K' | 'E';  // Default: Placidus
  zodiacType?: 'tropical' | 'sidereal';
}

interface ChartResponse {
  planets: {
    name: string;
    longitude: number;      // 0-360
    latitude: number;
    speed: number;
    retrograde: boolean;
    sign: string;
    degree: number;         // 0-30 within sign
  }[];
  houses: {
    number: number;
    cusp: number;
    sign: string;
  }[];
  angles: {
    ascendant: number;
    midheaven: number;
    descendant: number;
    imumCoeli: number;
  };
  aspects: {
    planet1: string;
    planet2: string;
    aspect: string;         // conjunction, opposition, trine, etc.
    orb: number;
    applying: boolean;
  }[];
  metadata: {
    calculatedAt: string;
    ephemerisType: 'swiss' | 'moshier';
    precision: string;
  };
}
```

---

## 6. Licensing Considerations

### AGPL-3.0 Implications

Both `sweph` and `sweph-wasm` use AGPL-3.0:
- **Copyleft**: Your entire application must be open-sourced under AGPL
- **Network use**: Even SaaS deployments trigger copyleft requirements
- **Not compatible** with proprietary/closed-source applications

### Options for WavePoint

1. **Open source under AGPL**: Make WavePoint fully open source
2. **Purchase commercial license**: Contact Astrodienst for professional license
   - Allows LGPL-3.0 usage
   - Enables proprietary distribution
3. **Use Unlicensed alternatives**: `circular-natal-horoscope-js` (public domain)
4. **Hybrid approach**:
   - Use licensed library for calculations
   - Keep business logic proprietary
   - Consult lawyer for compliance

### Commercial License Pricing

From astro.com Swiss Ephemeris price list:
- Professional licenses available
- Contact Astrodienst for current pricing
- License valid for 99 years

---

## 7. Recommendations

### For WavePoint MVP

**Recommended Stack**:
```
Primary: circular-natal-horoscope-js
- Zero licensing concerns (Unlicense/public domain)
- Serverless compatible out of the box
- TypeScript support
- Sufficient precision for astrological use
- Built-in aspects calculation
```

**Alternative if higher precision needed**:
```
sweph-wasm in Moshier mode
- WebAssembly works in Vercel
- No data files needed
- Must address AGPL licensing
```

### Implementation Priority

1. **Week 1**: POC with `circular-natal-horoscope-js`
   - Validate calculations against astro.com
   - Build basic API endpoint
   - Test Vercel deployment

2. **Week 2**: If precision issues arise
   - Evaluate `sweph-wasm`
   - Address licensing implications
   - Test WASM in serverless

3. **Future**: If advanced features needed (asteroids, fixed stars, eclipses)
   - Consider commercial Swiss Ephemeris license
   - Evaluate dedicated calculation service

### Files Structure for Implementation

```
src/lib/astrology/
├── index.ts                 # Public exports
├── calculations/
│   ├── chart.ts            # Birth chart calculation
│   ├── planets.ts          # Planet position logic
│   ├── houses.ts           # House cusp calculation
│   └── aspects.ts          # Aspect calculation
├── types/
│   └── chart.ts            # TypeScript interfaces
└── constants/
    ├── planets.ts          # Planet definitions
    ├── signs.ts            # Zodiac sign definitions
    └── aspects.ts          # Aspect definitions
```

---

## References

- [sweph GitHub](https://github.com/timotejroiko/sweph)
- [sweph-wasm GitHub](https://github.com/PtPrashantTripathi/sweph-wasm)
- [CircularNatalHoroscopeJS GitHub](https://github.com/0xStarcat/CircularNatalHoroscopeJS)
- [Swiss Ephemeris Official](https://www.astro.com/swisseph/swephinfo_e.htm)
- [Swiss Ephemeris Documentation](https://www.astro.com/swisseph/swisseph.htm)
- [Swiss Ephemeris Download](https://www.astro.com/swisseph/swedownload_e.htm)
- [Swiss Ephemeris License](https://github.com/aloistr/swisseph/blob/master/LICENSE)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Moshier Ephemeris](https://www.moshier.net/)
