/**
 * Tests for planet page data.
 */

import { describe, it, expect } from "vitest";
import {
  PLANET_PAGE_DATA,
  getAvailablePlanets,
  getAvailablePlanetIds,
} from "../data";
import { CONTENT_PLANET_IDS, CLASSICAL_PLANETS, OUTER_PLANETS } from "../types";

describe("PLANET_PAGE_DATA", () => {
  it("should have Saturn data", () => {
    expect(PLANET_PAGE_DATA.saturn).toBeDefined();
  });

  it("should have complete Saturn structure", () => {
    const saturn = PLANET_PAGE_DATA.saturn;
    expect(saturn).toBeDefined();
    if (!saturn) return;

    // Core fields
    expect(saturn.id).toBe("saturn");
    expect(saturn.name).toBe("Saturn");
    expect(saturn.glyph).toBe("♄");
    expect(saturn.archetype).toBeDefined();
    expect(saturn.keywords).toBeInstanceOf(Array);
    expect(saturn.keywords.length).toBeGreaterThan(0);

    // Element and associations
    expect(saturn.element).toBe("earth");
    expect(saturn.dayOfWeek).toBe("Saturday");
    expect(saturn.metal).toBe("Lead");
    expect(saturn.type).toBe("social");

    // Rulerships
    expect(saturn.rulerships).toBeInstanceOf(Array);
    expect(saturn.rulerships.length).toBeGreaterThan(0);
    expect(saturn.rulerships.some((r) => r.sign === "Capricorn")).toBe(true);
    expect(saturn.rulerships.some((r) => r.sign === "Aquarius")).toBe(true);

    // Dignities
    expect(saturn.dignities).toBeInstanceOf(Array);
    expect(saturn.dignities.some((d) => d.type === "exaltation")).toBe(true);
    expect(saturn.dignities.some((d) => d.type === "fall")).toBe(true);
    expect(saturn.dignities.some((d) => d.type === "detriment")).toBe(true);

    // Numerology connection
    expect(saturn.numerology).toBeDefined();
    expect(saturn.numerology.digit).toBe(8);
    expect(saturn.numerology.traditions).toBeInstanceOf(Array);
    expect(saturn.numerology.confidence).toBe("established");
    expect(saturn.numerology.relatedPatterns).toContain("888");

    // Geometry connection
    expect(saturn.geometry).toBeDefined();
    expect(saturn.geometry?.geometry).toBe("cube");

    // Content sections
    expect(saturn.coreArchetype).toBeDefined();
    expect(saturn.coreArchetype.primaryClaim).toBeDefined();
    expect(saturn.coreArchetype.sources).toBeInstanceOf(Array);
    expect(saturn.coreArchetype.sources.length).toBeGreaterThan(0);

    expect(saturn.elementalNature).toBeDefined();
    expect(saturn.elementalNature.primaryClaim).toBeDefined();

    // SEO
    expect(saturn.metaDescription).toBeDefined();
    expect(saturn.seoKeywords).toBeInstanceOf(Array);
    expect(saturn.seoKeywords.length).toBeGreaterThan(0);
  });
});

describe("CONTENT_PLANET_IDS", () => {
  it("should have 9 planet IDs (excluding Pluto)", () => {
    expect(CONTENT_PLANET_IDS).toHaveLength(9);
  });

  it("should include all expected planets", () => {
    const expected = [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ];
    for (const planet of expected) {
      expect(CONTENT_PLANET_IDS).toContain(planet);
    }
  });

  it("should NOT include pluto", () => {
    expect(CONTENT_PLANET_IDS).not.toContain("pluto");
  });
});

describe("CLASSICAL_PLANETS", () => {
  it("should have 7 classical planets", () => {
    expect(CLASSICAL_PLANETS).toHaveLength(7);
  });

  it("should include Sun through Saturn", () => {
    const expected = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];
    for (const planet of expected) {
      expect(CLASSICAL_PLANETS).toContain(planet);
    }
  });

  it("should NOT include outer planets", () => {
    expect(CLASSICAL_PLANETS).not.toContain("uranus");
    expect(CLASSICAL_PLANETS).not.toContain("neptune");
  });
});

describe("OUTER_PLANETS", () => {
  it("should have 2 outer planets", () => {
    expect(OUTER_PLANETS).toHaveLength(2);
  });

  it("should include Uranus and Neptune", () => {
    expect(OUTER_PLANETS).toContain("uranus");
    expect(OUTER_PLANETS).toContain("neptune");
  });
});

describe("getAvailablePlanets", () => {
  it("should return planets with content", () => {
    const planets = getAvailablePlanets();
    expect(planets.length).toBeGreaterThan(0);
  });

  it("should include Saturn", () => {
    const planets = getAvailablePlanets();
    expect(planets.some((p) => p.id === "saturn")).toBe(true);
  });
});

describe("getAvailablePlanetIds", () => {
  it("should return planet IDs with content", () => {
    const ids = getAvailablePlanetIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain("saturn");
  });
});
