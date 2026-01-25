#!/usr/bin/env npx tsx

/**
 * Swiss Ephemeris Proof of Concept Test
 *
 * Calculates a birth chart for test data and outputs results for verification
 * against astro.com or other astrological software.
 *
 * Test Data: June 15, 1990 at 14:30 in New York City (40.7128, -74.0060)
 *
 * Usage:
 *   npx tsx scripts/test-ephemeris.ts
 *
 * Expected Results (approximate):
 *   - Sun: ~24 Gemini
 *   - Moon: varies (need to verify)
 *   - Rising: varies based on exact time/location
 */

import {
  calculateChart,
  getChartSummary,
  formatPlanetPosition,
  ZODIAC_META,
  PLANET_META,
  type BirthData,
} from "../src/lib/astrology";

// Test birth data: June 15, 1990 at 14:30 in New York City
const TEST_BIRTH_DATA: BirthData = {
  year: 1990,
  month: 6, // June (1-indexed)
  day: 15,
  hour: 14,
  minute: 30,
  second: 0,
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    name: "New York City, NY, USA",
  },
};

function main() {
  console.log("=".repeat(70));
  console.log("SWISS EPHEMERIS PROOF OF CONCEPT");
  console.log("Using circular-natal-horoscope-js");
  console.log("=".repeat(70));
  console.log();

  // Display input data
  console.log("INPUT DATA:");
  console.log("-".repeat(40));
  console.log(
    `  Date: ${TEST_BIRTH_DATA.year}-${String(TEST_BIRTH_DATA.month).padStart(2, "0")}-${String(TEST_BIRTH_DATA.day).padStart(2, "0")}`
  );
  console.log(
    `  Time: ${String(TEST_BIRTH_DATA.hour).padStart(2, "0")}:${String(TEST_BIRTH_DATA.minute).padStart(2, "0")}:${String(TEST_BIRTH_DATA.second ?? 0).padStart(2, "0")} (local time)`
  );
  console.log(`  Location: ${TEST_BIRTH_DATA.location.name}`);
  console.log(`  Coordinates: ${TEST_BIRTH_DATA.location.latitude}, ${TEST_BIRTH_DATA.location.longitude}`);
  console.log();

  // Calculate the chart
  console.log("Calculating chart...");
  const startTime = performance.now();

  const chart = calculateChart(TEST_BIRTH_DATA, {
    houseSystem: "whole-sign",
    zodiacSystem: "tropical",
    aspectTypes: ["major", "minor"],
  });

  const endTime = performance.now();
  console.log(`  Calculation time: ${(endTime - startTime).toFixed(2)}ms`);
  console.log();

  // Display the Big Three
  console.log("THE BIG THREE:");
  console.log("-".repeat(40));
  const summary = getChartSummary(chart);

  const sunMeta = ZODIAC_META[summary.sun.sign];
  const moonMeta = ZODIAC_META[summary.moon.sign];
  const risingMeta = ZODIAC_META[summary.rising.sign];

  console.log(
    `  ${PLANET_META.sun.glyph} Sun:     ${summary.sun.degree} ${sunMeta.glyph} ${capitalize(summary.sun.sign)}`
  );
  console.log(
    `  ${PLANET_META.moon.glyph} Moon:    ${summary.moon.degree} ${moonMeta.glyph} ${capitalize(summary.moon.sign)}`
  );
  console.log(`  Rising:  ${summary.rising.degree} ${risingMeta.glyph} ${capitalize(summary.rising.sign)}`);
  console.log();

  // Display all planet positions
  console.log("ALL PLANET POSITIONS:");
  console.log("-".repeat(40));

  for (const planet of chart.planetList) {
    const formatted = formatPlanetPosition(planet);
    const houseStr = `(House ${planet.house})`.padStart(12);
    console.log(`  ${formatted} ${houseStr}`);
  }
  console.log();

  // Display angles
  console.log("ANGLES:");
  console.log("-".repeat(40));
  const ascMeta = ZODIAC_META[chart.angles.ascendant.position.sign];
  const mcMeta = ZODIAC_META[chart.angles.midheaven.position.sign];

  console.log(
    `  Ascendant (AC):  ${chart.angles.ascendant.position.formatted} ${ascMeta.glyph} ${capitalize(chart.angles.ascendant.position.sign)}`
  );
  console.log(
    `  Midheaven (MC):  ${chart.angles.midheaven.position.formatted} ${mcMeta.glyph} ${capitalize(chart.angles.midheaven.position.sign)}`
  );
  console.log();

  // Display houses (Whole Sign)
  console.log("HOUSES (Whole Sign):");
  console.log("-".repeat(40));
  for (const house of chart.houses) {
    const signMeta = ZODIAC_META[house.sign];
    console.log(`  House ${String(house.number).padStart(2)}: ${signMeta.glyph} ${capitalize(house.sign)}`);
  }
  console.log();

  // Display major aspects
  console.log("MAJOR ASPECTS:");
  console.log("-".repeat(40));
  const majorAspects = chart.aspects.all.filter((a) =>
    ["conjunction", "opposition", "trine", "square", "sextile"].includes(a.type)
  );

  if (majorAspects.length === 0) {
    console.log("  No major aspects found.");
  } else {
    // Sort by orb (tightest first)
    majorAspects.sort((a, b) => a.orb - b.orb);

    for (const aspect of majorAspects.slice(0, 15)) {
      // Show top 15
      const p1 = aspect.point1.name;
      const p2 = aspect.point2.name;
      const orbStr = `(orb: ${aspect.orb.toFixed(2)}deg)`;
      console.log(`  ${p1} ${aspect.symbol} ${aspect.typeName} ${p2} ${orbStr}`);
    }

    if (majorAspects.length > 15) {
      console.log(`  ... and ${majorAspects.length - 15} more aspects`);
    }
  }
  console.log();

  // Verification notes
  console.log("VERIFICATION NOTES:");
  console.log("-".repeat(40));
  console.log("  Compare these results against astro.com or other software:");
  console.log("  1. Go to astro.com/cgi/chart.cgi");
  console.log("  2. Enter: June 15, 1990, 2:30 PM, New York City");
  console.log("  3. Select Whole Sign houses");
  console.log();
  console.log("  Expected (approximate):");
  console.log("    - Sun should be around 24 Gemini");
  console.log("    - Verify Moon, Rising, and other placements");
  console.log();

  // Raw data access note
  console.log("RAW DATA:");
  console.log("-".repeat(40));
  console.log("  chart._raw contains the original library objects for debugging");
  console.log();

  console.log("=".repeat(70));
  console.log("TEST COMPLETE");
  console.log("=".repeat(70));
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run the test
main();
