/**
 * Tests for planetary associations module.
 */

import { describe, it, expect } from "vitest";
import {
  DIGIT_PLANETARY_META,
  PLANET_META,
  ELEMENT_META,
  GEOMETRY_META,
  AGRIPPA_ANGEL_NUMBER_CONNECTIONS,
  getDominantDigit,
  getUniqueDigits,
  getPatternPlanetaryMeta,
  getPlanetSymbol,
  hasAgrippaConnection,
} from "../planetary";
import {
  getPatternWithPlanetary,
  getPatternsByPlanet,
  getPatternsByElement,
} from "../helpers";

describe("DIGIT_PLANETARY_META", () => {
  it("should have entries for digits 1-9", () => {
    expect(Object.keys(DIGIT_PLANETARY_META)).toHaveLength(9);
    for (let i = 1; i <= 9; i++) {
      expect(DIGIT_PLANETARY_META[i]).toBeDefined();
    }
  });

  it("should have consistent structure", () => {
    for (const [digit, meta] of Object.entries(DIGIT_PLANETARY_META)) {
      expect(meta.digit).toBe(parseInt(digit, 10));
      expect(meta.planet).toBeDefined();
      expect(meta.symbol).toBeDefined();
      expect(meta.element).toBeDefined();
      expect(meta.confidence).toBeDefined();
      expect(meta.traits).toBeInstanceOf(Array);
      expect(meta.traditions).toBeInstanceOf(Array);
    }
  });

  it("should match cross-traditional consensus", () => {
    // High confidence associations from multiple traditions
    expect(DIGIT_PLANETARY_META[1]!.planet).toBe("sun");
    expect(DIGIT_PLANETARY_META[2]!.planet).toBe("moon");
    expect(DIGIT_PLANETARY_META[3]!.planet).toBe("jupiter");
    expect(DIGIT_PLANETARY_META[5]!.planet).toBe("mercury");
    expect(DIGIT_PLANETARY_META[6]!.planet).toBe("venus");
    expect(DIGIT_PLANETARY_META[8]!.planet).toBe("saturn");
    expect(DIGIT_PLANETARY_META[9]!.planet).toBe("mars");
  });
});

describe("AGRIPPA_ANGEL_NUMBER_CONNECTIONS", () => {
  it("should have 111 as Sun's magic constant", () => {
    expect(AGRIPPA_ANGEL_NUMBER_CONNECTIONS[111]).toBeDefined();
    expect(AGRIPPA_ANGEL_NUMBER_CONNECTIONS[111].planet).toBe("sun");
  });

  it("should have 666 as Sun's magic square total", () => {
    expect(AGRIPPA_ANGEL_NUMBER_CONNECTIONS[666]).toBeDefined();
    expect(AGRIPPA_ANGEL_NUMBER_CONNECTIONS[666].planet).toBe("sun");
  });

  it("should match Agrippa's 6×6 Sun square", () => {
    const sunMeta = DIGIT_PLANETARY_META[6]!; // Venus rules 6, but Sun rules 6×6 square
    expect(sunMeta.agrippaSquare?.magicConstant).toBe(111);
    expect(sunMeta.agrippaSquare?.totalSum).toBe(666);
  });
});

describe("getDominantDigit", () => {
  it("should return the repeated digit for uniform patterns", () => {
    expect(getDominantDigit("111")).toBe(1);
    expect(getDominantDigit("222")).toBe(2);
    expect(getDominantDigit("7777")).toBe(7);
  });

  it("should return most frequent digit for mixed patterns", () => {
    expect(getDominantDigit("1221")).toBe(1); // 1 and 2 both appear twice, first wins
    expect(getDominantDigit("1112")).toBe(1); // 1 appears three times
    expect(getDominantDigit("2211")).toBe(2); // 2 and 1 both appear twice, first wins
    expect(getDominantDigit("3331")).toBe(3); // 3 appears three times
  });

  it("should ignore zeros", () => {
    expect(getDominantDigit("1001")).toBe(1);
    expect(getDominantDigit("0000")).toBe(0); // All zeros returns 0
  });
});

describe("getUniqueDigits", () => {
  it("should return sorted unique digits", () => {
    expect(getUniqueDigits("111")).toEqual([1]);
    expect(getUniqueDigits("1234")).toEqual([1, 2, 3, 4]);
    expect(getUniqueDigits("1221")).toEqual([1, 2]);
    expect(getUniqueDigits("1001")).toEqual([0, 1]);
  });
});

describe("getPatternPlanetaryMeta", () => {
  it("should return solar energy for 111", () => {
    const meta = getPatternPlanetaryMeta("111");
    expect(meta.primaryPlanet).toBe("sun");
    expect(meta.primarySymbol).toBe("☉");
    expect(meta.primaryElement).toBe("fire");
  });

  it("should return lunar energy for 222", () => {
    const meta = getPatternPlanetaryMeta("222");
    expect(meta.primaryPlanet).toBe("moon");
    expect(meta.primarySymbol).toBe("☽");
    expect(meta.primaryElement).toBe("water");
  });

  it("should include Agrippa note for special numbers", () => {
    const meta111 = getPatternPlanetaryMeta("111");
    expect(meta111.agrippaNote).toContain("magic constant");
    expect(meta111.agrippaNote).toContain("Sun");
  });

  it("should handle mixed patterns", () => {
    const meta1234 = getPatternPlanetaryMeta("1234");
    expect(meta1234.planets).toContain("sun");
    expect(meta1234.planets).toContain("moon");
    expect(meta1234.planets).toContain("jupiter");
    expect(meta1234.planets).toContain("uranus");
  });

  it("should handle patterns with zero", () => {
    const meta1001 = getPatternPlanetaryMeta("1001");
    expect(meta1001.elements).toContain("ether"); // Zero adds ether
    expect(meta1001.energyDescription).toContain("zero");
  });
});

describe("getPatternWithPlanetary", () => {
  it("should enrich known patterns with planetary data", () => {
    const pattern = getPatternWithPlanetary("111");
    expect(pattern).toBeDefined();
    expect(pattern?.id).toBe("111");
    expect(pattern?.planetary.primaryPlanet).toBe("sun");
    expect(pattern?.planetary.primarySymbol).toBe("☉");
  });

  it("should return undefined for unknown patterns", () => {
    const pattern = getPatternWithPlanetary("99999");
    expect(pattern).toBeUndefined();
  });
});

describe("getPatternsByPlanet", () => {
  it("should return all Sun-ruled patterns", () => {
    const sunPatterns = getPatternsByPlanet("sun");
    expect(sunPatterns.length).toBeGreaterThan(0);
    // All patterns with 1 should be included
    expect(sunPatterns.some((p) => p.id === "111")).toBe(true);
    expect(sunPatterns.some((p) => p.id === "1111")).toBe(true);
  });

  it("should return all Saturn-ruled patterns", () => {
    const saturnPatterns = getPatternsByPlanet("saturn");
    expect(saturnPatterns.length).toBeGreaterThan(0);
    // All patterns with 8 should be included
    expect(saturnPatterns.some((p) => p.id === "888")).toBe(true);
    expect(saturnPatterns.some((p) => p.id === "8888")).toBe(true);
  });
});

describe("getPatternsByElement", () => {
  it("should return all Fire element patterns", () => {
    const firePatterns = getPatternsByElement("fire");
    expect(firePatterns.length).toBeGreaterThan(0);
    // Sun (1) and Mars (9) are fire
    expect(firePatterns.some((p) => p.id === "111")).toBe(true);
    expect(firePatterns.some((p) => p.id === "999")).toBe(true);
  });

  it("should return all Water element patterns", () => {
    const waterPatterns = getPatternsByElement("water");
    expect(waterPatterns.length).toBeGreaterThan(0);
    // Moon (2) is water
    expect(waterPatterns.some((p) => p.id === "222")).toBe(true);
  });
});

describe("PLANET_META", () => {
  it("should have all required planets", () => {
    const expectedPlanets = [
      "sun", "moon", "mercury", "venus", "mars",
      "jupiter", "saturn", "uranus", "neptune"
    ];
    for (const planet of expectedPlanets) {
      expect(PLANET_META[planet as keyof typeof PLANET_META]).toBeDefined();
    }
  });

  it("should have symbols for all planets", () => {
    expect(getPlanetSymbol("sun")).toBe("☉");
    expect(getPlanetSymbol("moon")).toBe("☽");
    expect(getPlanetSymbol("mars")).toBe("♂");
    expect(getPlanetSymbol("venus")).toBe("♀");
  });
});

describe("ELEMENT_META", () => {
  it("should map elements to Platonic solids", () => {
    expect(ELEMENT_META.fire.geometry).toBe("tetrahedron");
    expect(ELEMENT_META.water.geometry).toBe("icosahedron");
    expect(ELEMENT_META.air.geometry).toBe("octahedron");
    expect(ELEMENT_META.earth.geometry).toBe("cube");
    expect(ELEMENT_META.ether.geometry).toBe("dodecahedron");
  });
});

describe("GEOMETRY_META", () => {
  it("should have all five Platonic solids", () => {
    const solids = ["tetrahedron", "cube", "octahedron", "icosahedron", "dodecahedron"];
    for (const solid of solids) {
      expect(GEOMETRY_META[solid as keyof typeof GEOMETRY_META]).toBeDefined();
    }
  });

  it("should have correct face counts", () => {
    expect(GEOMETRY_META.tetrahedron.faces).toBe(4);
    expect(GEOMETRY_META.cube.faces).toBe(6);
    expect(GEOMETRY_META.octahedron.faces).toBe(8);
    expect(GEOMETRY_META.icosahedron.faces).toBe(20);
    expect(GEOMETRY_META.dodecahedron.faces).toBe(12);
  });
});

describe("hasAgrippaConnection", () => {
  it("should return true for 111", () => {
    expect(hasAgrippaConnection("111")).toBe(true);
  });

  it("should return true for 666", () => {
    expect(hasAgrippaConnection("666")).toBe(true);
  });

  it("should return false for non-special patterns", () => {
    expect(hasAgrippaConnection("222")).toBe(false);
  });
});
