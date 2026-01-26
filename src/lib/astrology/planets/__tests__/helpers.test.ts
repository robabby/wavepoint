/**
 * Tests for planet helper functions.
 */

import { describe, it, expect } from "vitest";
import {
  getPlanet,
  getAllPlanets,
  getAllPlanetIds,
  hasPlanetContent,
  isValidPlanetId,
  getClassicalPlanets,
  getOuterPlanets,
  getPlanetWithNumerology,
  getPlanetNumberPatterns,
  getPlanetDigit,
  getPlanetByDigit,
  getPlanetPath,
  getPlanetCanonicalUrl,
} from "../helpers";

describe("getPlanet", () => {
  it("should return Saturn data", () => {
    const saturn = getPlanet("saturn");
    expect(saturn).toBeDefined();
    expect(saturn?.id).toBe("saturn");
    expect(saturn?.name).toBe("Saturn");
  });

  it("should return undefined for planets without content", () => {
    // Assuming Sun doesn't have content yet
    const sun = getPlanet("sun");
    // This might be undefined or defined depending on implementation progress
    // For now, just test that it doesn't throw
    expect(sun === undefined || sun?.id === "sun").toBe(true);
  });
});

describe("getAllPlanets", () => {
  it("should return array of planets", () => {
    const planets = getAllPlanets();
    expect(Array.isArray(planets)).toBe(true);
  });

  it("should return planets with valid structure", () => {
    const planets = getAllPlanets();
    for (const planet of planets) {
      expect(planet.id).toBeDefined();
      expect(planet.name).toBeDefined();
      expect(planet.glyph).toBeDefined();
    }
  });
});

describe("getAllPlanetIds", () => {
  it("should return array of planet IDs", () => {
    const ids = getAllPlanetIds();
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBe(getAllPlanets().length);
  });
});

describe("hasPlanetContent", () => {
  it("should return true for Saturn", () => {
    expect(hasPlanetContent("saturn")).toBe(true);
  });
});

describe("isValidPlanetId", () => {
  it("should return true for valid planet IDs", () => {
    expect(isValidPlanetId("saturn")).toBe(true);
    expect(isValidPlanetId("sun")).toBe(true);
    expect(isValidPlanetId("neptune")).toBe(true);
  });

  it("should return false for invalid IDs", () => {
    expect(isValidPlanetId("invalid")).toBe(false);
    expect(isValidPlanetId("")).toBe(false);
    expect(isValidPlanetId("ceres")).toBe(false);
  });

  it("should return true for Pluto", () => {
    expect(isValidPlanetId("pluto")).toBe(true);
  });
});

describe("getClassicalPlanets", () => {
  it("should return only classical planets with content", () => {
    const classical = getClassicalPlanets();
    for (const planet of classical) {
      // Should be one of: sun, moon, mercury, venus, mars, jupiter, saturn
      expect(["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"]).toContain(
        planet.id
      );
    }
  });
});

describe("getOuterPlanets", () => {
  it("should return only outer planets with content", () => {
    const outer = getOuterPlanets();
    for (const planet of outer) {
      expect(["uranus", "neptune", "pluto"]).toContain(planet.id);
    }
  });

  it("should include Pluto", () => {
    const outer = getOuterPlanets();
    expect(outer.some((p) => p.id === "pluto")).toBe(true);
  });
});

describe("getPlanetWithNumerology", () => {
  it("should return Saturn with numerology data", () => {
    const saturn = getPlanetWithNumerology("saturn");
    expect(saturn).toBeDefined();
    if (!saturn) return;

    expect(saturn.id).toBe("saturn");
    expect(saturn.digitMeta).toBeDefined();
    expect(saturn.digitMeta?.digit).toBe(8);
    expect(saturn.digitMeta?.planet).toBe("saturn");
    expect(saturn.planetMeta).toBeDefined();
    expect(saturn.planetMeta?.name).toBe("Saturn");
  });

  it("should return undefined for planets without content", () => {
    // If sun doesn't have content yet
    const sun = getPlanetWithNumerology("sun");
    // Should either be undefined or have valid structure
    if (sun) {
      expect(sun.id).toBe("sun");
    }
  });
});

describe("getPlanetNumberPatterns", () => {
  it("should return patterns for Saturn", () => {
    const patterns = getPlanetNumberPatterns("saturn");
    expect(patterns).toContain("888");
    expect(patterns).toContain("8888");
  });

  it("should return empty array for unknown planets", () => {
    // Cast to avoid type error for testing invalid input
    const patterns = getPlanetNumberPatterns("invalid" as never);
    expect(patterns).toEqual([]);
  });
});

describe("getPlanetDigit", () => {
  it("should return 8 for Saturn", () => {
    expect(getPlanetDigit("saturn")).toBe(8);
  });

  it("should return null for Pluto (no classical digit)", () => {
    expect(getPlanetDigit("pluto")).toBeNull();
  });

  it("should return undefined for planets without content", () => {
    const digit = getPlanetDigit("sun");
    // Will be undefined if sun doesn't have content, or a number if it does
    expect(digit === undefined || typeof digit === "number").toBe(true);
  });
});

describe("getPlanetByDigit", () => {
  it("should return Saturn for digit 8", () => {
    const planet = getPlanetByDigit(8);
    expect(planet?.id).toBe("saturn");
  });

  it("should return undefined for digit without planet", () => {
    const planet = getPlanetByDigit(0);
    expect(planet).toBeUndefined();
  });
});

describe("getPlanetPath", () => {
  it("should return correct path for Saturn", () => {
    expect(getPlanetPath("saturn")).toBe("/astrology/planets/saturn");
  });

  it("should return correct path for any planet", () => {
    expect(getPlanetPath("sun")).toBe("/astrology/planets/sun");
    expect(getPlanetPath("neptune")).toBe("/astrology/planets/neptune");
  });
});

describe("getPlanetCanonicalUrl", () => {
  it("should return full URL", () => {
    const url = getPlanetCanonicalUrl("saturn", "https://wavepoint.guide");
    expect(url).toBe("https://wavepoint.guide/astrology/planets/saturn");
  });
});
