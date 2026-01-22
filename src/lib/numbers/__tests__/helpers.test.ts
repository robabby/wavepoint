/**
 * Unit tests for number pattern helpers.
 */

import { describe, expect, it } from "vitest";
import {
  getAllPatterns,
  getPatternByNumber,
  getPatternsByCategory,
  getFeaturedPatterns,
  getRelatedPatterns,
  searchPatterns,
  isKnownPattern,
  getPatternsByIds,
  getNextPattern,
  getPreviousPattern,
  getPatternCount,
  getPatternCountByCategory,
} from "../helpers";
import { NUMBER_PATTERN_IDS } from "../types";

describe("getPatternByNumber", () => {
  it("returns pattern for valid number", () => {
    const pattern = getPatternByNumber("444");
    expect(pattern).toBeDefined();
    expect(pattern?.id).toBe("444");
    expect(pattern?.title).toBe("Stability & Foundation");
  });

  it("returns undefined for unknown number", () => {
    const pattern = getPatternByNumber("98765");
    expect(pattern).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    const pattern = getPatternByNumber("");
    expect(pattern).toBeUndefined();
  });
});

describe("getAllPatterns", () => {
  it("returns all 90 patterns", () => {
    const patterns = getAllPatterns();
    expect(patterns).toHaveLength(90);
  });

  it("returns patterns sorted by category then order", () => {
    const patterns = getAllPatterns();

    // First should be doubles (new category order)
    expect(patterns[0]?.category).toBe("double");
    expect(patterns[0]?.id).toBe("11");

    // Find where triples start
    const firstTriple = patterns.find((p) => p.category === "triple");
    expect(firstTriple?.id).toBe("111");
  });
});

describe("getPatternsByCategory", () => {
  it("returns all triple patterns", () => {
    const patterns = getPatternsByCategory("triple");
    expect(patterns).toHaveLength(9);
    expect(patterns.every((p) => p.category === "triple")).toBe(true);
  });

  it("returns all double patterns", () => {
    const patterns = getPatternsByCategory("double");
    expect(patterns).toHaveLength(9);
    expect(patterns.map((p) => p.id)).toEqual(["11", "22", "33", "44", "55", "66", "77", "88", "99"]);
  });

  it("returns patterns sorted by order", () => {
    const patterns = getPatternsByCategory("triple");
    for (let i = 1; i < patterns.length; i++) {
      expect(patterns[i]!.order).toBeGreaterThanOrEqual(patterns[i - 1]!.order);
    }
  });
});

describe("getFeaturedPatterns", () => {
  it("returns featured patterns excluding 666", () => {
    const featured = getFeaturedPatterns();

    expect(featured.every((p) => p.featured)).toBe(true);
    expect(featured.every((p) => !p.excludeFromFeatured)).toBe(true);
    expect(featured.find((p) => p.id === "666")).toBeUndefined();
  });

  it("includes commonly featured patterns", () => {
    const featured = getFeaturedPatterns();
    const ids = featured.map((p) => p.id);

    expect(ids).toContain("111");
    expect(ids).toContain("444");
    expect(ids).toContain("777");
    expect(ids).toContain("1111");
  });
});

describe("getRelatedPatterns", () => {
  it("returns related patterns for 111 (computed family + thematic)", () => {
    const related = getRelatedPatterns("111");
    const ids = related.map((p) => p.id);

    // Family relationships (computed)
    expect(ids).toContain("11");
    expect(ids).toContain("1111");
    // Thematic relationship (manual override)
    expect(ids).toContain("999");
  });

  it("returns computed family relationships for 555", () => {
    // Previously returned empty, now computes digit-family relationships
    const related = getRelatedPatterns("555");
    const ids = related.map((p) => p.id);

    expect(ids).toContain("55");
    expect(ids).toContain("5555");
  });

  it("returns empty array for unknown pattern", () => {
    // Cast to bypass type checking for test
    const related = getRelatedPatterns("999999" as "111");
    expect(related).toEqual([]);
  });
});

describe("searchPatterns", () => {
  it("finds patterns by number", () => {
    const results = searchPatterns("444");
    expect(results.find((p) => p.id === "444")).toBeDefined();
  });

  it("finds patterns by partial number", () => {
    const results = searchPatterns("11");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("11");
    expect(ids).toContain("111");
    expect(ids).toContain("1111");
  });

  it("finds patterns by keyword", () => {
    const results = searchPatterns("manifestation");
    expect(results.find((p) => p.id === "111")).toBeDefined();
    expect(results.find((p) => p.id === "1111")).toBeDefined();
  });

  it("finds patterns by title", () => {
    const results = searchPatterns("stability");
    expect(results.find((p) => p.id === "444")).toBeDefined();
  });

  it("finds patterns by essence", () => {
    const results = searchPatterns("trust");
    expect(results.find((p) => p.id === "222")).toBeDefined();
  });

  it("returns empty array for no matches", () => {
    const results = searchPatterns("xyznonexistent");
    expect(results).toEqual([]);
  });

  it("returns empty array for empty query", () => {
    const results = searchPatterns("");
    expect(results).toEqual([]);
  });

  it("is case insensitive", () => {
    const results = searchPatterns("MANIFESTATION");
    expect(results.find((p) => p.id === "111")).toBeDefined();
  });
});

describe("isKnownPattern", () => {
  it("returns true for known patterns", () => {
    expect(isKnownPattern("111")).toBe(true);
    expect(isKnownPattern("444")).toBe(true);
    expect(isKnownPattern("1234")).toBe(true);
    expect(isKnownPattern("789")).toBe(true); // Now a known sequential pattern
  });

  it("returns false for unknown patterns", () => {
    expect(isKnownPattern("98765")).toBe(false);
    expect(isKnownPattern("12")).toBe(false);
    expect(isKnownPattern("")).toBe(false);
  });
});

describe("getPatternsByIds", () => {
  it("returns patterns for valid IDs", () => {
    const patterns = getPatternsByIds(["111", "444", "777"]);
    expect(patterns).toHaveLength(3);
    expect(patterns.map((p) => p.id)).toEqual(["111", "444", "777"]);
  });

  it("filters out invalid IDs", () => {
    const patterns = getPatternsByIds(["111", "invalid" as "111", "444"]);
    expect(patterns).toHaveLength(2);
  });

  it("returns empty array for empty input", () => {
    const patterns = getPatternsByIds([]);
    expect(patterns).toEqual([]);
  });
});

describe("getNextPattern", () => {
  it("returns next pattern in category", () => {
    const next = getNextPattern("111");
    expect(next?.id).toBe("222");
  });

  it("returns undefined for last pattern in category", () => {
    const next = getNextPattern("999");
    expect(next).toBeUndefined();
  });

  it("returns undefined for unknown pattern", () => {
    const next = getNextPattern("invalid" as "111");
    expect(next).toBeUndefined();
  });
});

describe("getPreviousPattern", () => {
  it("returns previous pattern in category", () => {
    const prev = getPreviousPattern("222");
    expect(prev?.id).toBe("111");
  });

  it("returns undefined for first pattern in category", () => {
    const prev = getPreviousPattern("111");
    expect(prev).toBeUndefined();
  });

  it("returns undefined for unknown pattern", () => {
    const prev = getPreviousPattern("invalid" as "111");
    expect(prev).toBeUndefined();
  });
});

describe("getPatternCount", () => {
  it("returns total count of patterns", () => {
    expect(getPatternCount()).toBe(NUMBER_PATTERN_IDS.length);
    expect(getPatternCount()).toBe(90);
  });
});

describe("getPatternCountByCategory", () => {
  it("returns correct counts per category", () => {
    expect(getPatternCountByCategory("double")).toBe(9);
    expect(getPatternCountByCategory("triple")).toBe(9);
    expect(getPatternCountByCategory("quad")).toBe(9);
    expect(getPatternCountByCategory("sequential")).toBe(13);
    expect(getPatternCountByCategory("mirrored")).toBe(9);
    expect(getPatternCountByCategory("clock")).toBe(15);
    expect(getPatternCountByCategory("sandwich")).toBe(12);
    expect(getPatternCountByCategory("compound")).toBe(14);
  });
});
