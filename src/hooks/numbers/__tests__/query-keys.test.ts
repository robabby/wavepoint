import { describe, expect, it } from "vitest";

import { numbersKeys } from "../query-keys";

describe("numbersKeys", () => {
  describe("all", () => {
    it("returns base key", () => {
      expect(numbersKeys.all).toEqual(["numbers"]);
    });
  });

  describe("patterns", () => {
    it("returns patterns key", () => {
      expect(numbersKeys.patterns()).toEqual(["numbers", "patterns"]);
    });
  });

  describe("patternsList", () => {
    it("returns key without filters", () => {
      expect(numbersKeys.patternsList()).toEqual([
        "numbers",
        "patterns",
        undefined,
      ]);
    });

    it("returns key with category filter", () => {
      expect(numbersKeys.patternsList({ category: "triple" })).toEqual([
        "numbers",
        "patterns",
        { category: "triple" },
      ]);
    });

    it("returns key with featured filter", () => {
      expect(numbersKeys.patternsList({ featured: true })).toEqual([
        "numbers",
        "patterns",
        { featured: true },
      ]);
    });

    it("returns key with both filters", () => {
      expect(
        numbersKeys.patternsList({ category: "quad", featured: true })
      ).toEqual(["numbers", "patterns", { category: "quad", featured: true }]);
    });
  });

  describe("pattern", () => {
    it("returns key for specific pattern", () => {
      expect(numbersKeys.pattern("444")).toEqual([
        "numbers",
        "patterns",
        "444",
      ]);
    });
  });

  describe("stats", () => {
    it("returns stats base key", () => {
      expect(numbersKeys.stats()).toEqual(["numbers", "stats"]);
    });
  });

  describe("allStats", () => {
    it("returns all stats key", () => {
      expect(numbersKeys.allStats()).toEqual(["numbers", "stats", "all"]);
    });
  });

  describe("patternStat", () => {
    it("returns key for specific pattern stat", () => {
      expect(numbersKeys.patternStat("444")).toEqual([
        "numbers",
        "stats",
        "444",
      ]);
    });
  });
});
