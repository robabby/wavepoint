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

  it("should have Pluto data", () => {
    expect(PLANET_PAGE_DATA.pluto).toBeDefined();
  });

  it("should have complete Pluto structure with null digit", () => {
    const pluto = PLANET_PAGE_DATA.pluto;
    expect(pluto).toBeDefined();
    if (!pluto) return;

    // Core fields
    expect(pluto.id).toBe("pluto");
    expect(pluto.name).toBe("Pluto");
    expect(pluto.glyph).toBe("♇");
    expect(pluto.archetype).toBe("The Transformer");
    expect(pluto.element).toBe("water");
    expect(pluto.type).toBe("transpersonal");

    // No dayOfWeek or metal (not classical)
    expect(pluto.dayOfWeek).toBeUndefined();
    expect(pluto.metal).toBeUndefined();

    // Rulerships
    expect(pluto.rulerships).toBeInstanceOf(Array);
    expect(pluto.rulerships.length).toBe(1);
    expect(pluto.rulerships[0]?.sign).toBe("Scorpio");
    expect(pluto.rulerships[0]?.modern).toBe(true);
    expect(pluto.rulerships[0]?.traditional).toBe(false);

    // Dignities
    expect(pluto.dignities).toBeInstanceOf(Array);
    expect(pluto.dignities.some((d) => d.type === "exaltation" && d.sign === "Leo")).toBe(true);
    expect(pluto.dignities.some((d) => d.type === "detriment" && d.sign === "Taurus")).toBe(true);
    expect(pluto.dignities.some((d) => d.type === "fall" && d.sign === "Aquarius")).toBe(true);

    // Numerology connection - Pluto has NULL digit
    expect(pluto.numerology).toBeDefined();
    expect(pluto.numerology.digit).toBeNull();
    expect(pluto.numerology.traditions).toHaveLength(0);
    expect(pluto.numerology.relatedPatterns).toHaveLength(0);
    expect(pluto.numerology.confidence).toBe("wavepoint-only");

    // Geometry connection
    expect(pluto.geometry).toBeDefined();
    expect(pluto.geometry?.geometry).toBe("icosahedron");
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
  it("should have 10 planet IDs (including Pluto)", () => {
    expect(CONTENT_PLANET_IDS).toHaveLength(10);
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
      "pluto",
    ];
    for (const planet of expected) {
      expect(CONTENT_PLANET_IDS).toContain(planet);
    }
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
  it("should have 3 outer planets", () => {
    expect(OUTER_PLANETS).toHaveLength(3);
  });

  it("should include Uranus, Neptune, and Pluto", () => {
    expect(OUTER_PLANETS).toContain("uranus");
    expect(OUTER_PLANETS).toContain("neptune");
    expect(OUTER_PLANETS).toContain("pluto");
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
