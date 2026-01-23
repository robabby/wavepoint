/**
 * Unit tests for number pattern data.
 */

import { describe, expect, it } from "vitest";
import { PATTERNS, getBaseMeaning, getEssence } from "../data";
import { NUMBER_PATTERN_IDS } from "../types";

describe("PATTERNS", () => {
  it("contains all 90 patterns", () => {
    expect(Object.keys(PATTERNS)).toHaveLength(91);
  });

  it("has all required fields for each pattern", () => {
    for (const pattern of Object.values(PATTERNS)) {
      expect(pattern.id).toBeDefined();
      expect(pattern.slug).toBeDefined();
      expect(pattern.category).toBeDefined();
      expect(pattern.title).toBeDefined();
      expect(pattern.essence).toBeDefined();
      expect(pattern.meaning).toBeDefined();
      expect(pattern.keywords).toBeDefined();
      expect(pattern.keywords.length).toBeGreaterThan(0);
      expect(typeof pattern.featured).toBe("boolean");
      expect(typeof pattern.excludeFromFeatured).toBe("boolean");
      expect(typeof pattern.order).toBe("number");
    }
  });

  it("has slug equal to id for all patterns", () => {
    for (const pattern of Object.values(PATTERNS)) {
      expect(pattern.slug).toBe(pattern.id);
    }
  });

  it("666 is marked excludeFromFeatured", () => {
    expect(PATTERNS["666"].excludeFromFeatured).toBe(true);
    expect(PATTERNS["666"].featured).toBe(false);
  });

  it("all pattern IDs match the NUMBER_PATTERN_IDS constant", () => {
    const patternIds = Object.keys(PATTERNS).sort();
    const expectedIds = [...NUMBER_PATTERN_IDS].sort();
    expect(patternIds).toEqual(expectedIds);
  });
});

describe("getBaseMeaning", () => {
  it("returns meaning for known patterns", () => {
    const meaning = getBaseMeaning("444");
    expect(meaning).toContain("foundation");
  });

  it("returns fallback for unknown patterns", () => {
    const meaning = getBaseMeaning("98765");
    expect(meaning).toContain("98765");
    expect(meaning).toContain("unique significance");
  });
});

describe("getEssence", () => {
  it("returns essence for known patterns", () => {
    const essence = getEssence("444");
    expect(essence).toBe("Stable ground");
  });

  it("returns undefined for unknown patterns", () => {
    const essence = getEssence("98765");
    expect(essence).toBeUndefined();
  });
});
