/**
 * Unit tests for component breakdown.
 */

import { describe, expect, it } from "vitest";
import {
  generateComponentBreakdown,
  hasRecognizableElements,
} from "../component-breakdown";

describe("generateComponentBreakdown", () => {
  describe("repeating digit patterns", () => {
    it("handles all same digits", () => {
      const breakdown = generateComponentBreakdown("444444");
      expect(breakdown.number).toBe("444444");
      expect(breakdown.synthesizedMeaning).toContain("energy of 4");
      expect(breakdown.synthesizedMeaning).toContain("amplified 6 times");
    });

    it("recognizes known triple patterns within number", () => {
      const breakdown = generateComponentBreakdown("7444");
      const tripleComponent = breakdown.components.find((c) => c.digit === "444");

      expect(tripleComponent).toBeDefined();
      expect(tripleComponent?.patternId).toBe("444");
    });
  });

  describe("sequential patterns", () => {
    it("identifies ascending sequences", () => {
      const breakdown = generateComponentBreakdown("456");
      expect(breakdown.synthesizedMeaning).toContain("ascending");
      expect(breakdown.synthesizedMeaning).toContain("forward momentum");
    });

    it("identifies descending sequences", () => {
      const breakdown = generateComponentBreakdown("987");
      expect(breakdown.synthesizedMeaning).toContain("descending");
      expect(breakdown.synthesizedMeaning).toContain("release");
    });
  });

  describe("palindrome patterns", () => {
    it("identifies palindromes", () => {
      const breakdown = generateComponentBreakdown("12321");
      expect(breakdown.synthesizedMeaning).toContain("mirrored");
      expect(breakdown.synthesizedMeaning).toContain("balance");
    });
  });

  describe("mixed number analysis", () => {
    it("breaks down unfamiliar numbers into components", () => {
      const breakdown = generateComponentBreakdown("847");
      expect(breakdown.components.length).toBeGreaterThan(0);

      // Should have components for 8, 4, and 7
      const digits = breakdown.components.map((c) => c.digit);
      expect(digits).toContain("8");
      expect(digits).toContain("4");
      expect(digits).toContain("7");
    });

    it("provides meanings for individual digits", () => {
      const breakdown = generateComponentBreakdown("8");
      expect(breakdown.components[0]?.meaning).toContain("Abundance");
    });
  });

  describe("edge cases", () => {
    it("handles single digit", () => {
      const breakdown = generateComponentBreakdown("5");
      expect(breakdown.components).toHaveLength(1);
      expect(breakdown.components[0]?.digit).toBe("5");
      expect(breakdown.components[0]?.meaning).toContain("Change");
    });

    it("handles unknown digit (outside 0-9)", () => {
      // This shouldn't happen in practice but test defensively
      const breakdown = generateComponentBreakdown("a");
      expect(breakdown.components).toHaveLength(1);
    });
  });
});

describe("hasRecognizableElements", () => {
  it("returns true for known patterns", () => {
    expect(hasRecognizableElements("444")).toBe(true);
    expect(hasRecognizableElements("1111")).toBe(true);
    expect(hasRecognizableElements("1234")).toBe(true);
  });

  it("returns true for numbers containing known patterns", () => {
    expect(hasRecognizableElements("7444")).toBe(true); // contains 444
    expect(hasRecognizableElements("5111")).toBe(true); // contains 111
  });

  it("returns true for ascending sequences", () => {
    expect(hasRecognizableElements("456")).toBe(true);
    expect(hasRecognizableElements("789")).toBe(true);
  });

  it("returns true for descending sequences", () => {
    expect(hasRecognizableElements("654")).toBe(true);
    expect(hasRecognizableElements("987")).toBe(true);
  });

  it("returns true for palindromes", () => {
    expect(hasRecognizableElements("121")).toBe(true);
    expect(hasRecognizableElements("12321")).toBe(true);
    expect(hasRecognizableElements("14541")).toBe(true);
  });

  it("returns false for unrecognizable patterns", () => {
    expect(hasRecognizableElements("847")).toBe(false);
    expect(hasRecognizableElements("52")).toBe(false);
  });
});
