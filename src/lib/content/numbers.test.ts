import { describe, it, expect } from "vitest";
import {
  numberContentExists,
  getAllNumberContentPatterns,
} from "./numbers";

describe("numbers content loader", () => {
  describe("numberContentExists", () => {
    it("returns true for existing pattern content", () => {
      expect(numberContentExists("111")).toBe(true);
    });

    it("returns false for non-existing pattern content", () => {
      expect(numberContentExists("nonexistent")).toBe(false);
    });

    it("returns false for patterns without MDX files", () => {
      // 123 exists in data but has no MDX file
      expect(numberContentExists("123")).toBe(false);
    });
  });

  describe("getAllNumberContentPatterns", () => {
    it("returns array of available patterns", () => {
      const patterns = getAllNumberContentPatterns();
      expect(patterns).toContain("111");
    });

    it("returns only pattern strings without .mdx extension", () => {
      const patterns = getAllNumberContentPatterns();
      patterns.forEach((pattern) => {
        expect(pattern).not.toContain(".mdx");
      });
    });
  });

  // Note: getNumberContent() is async and requires React compilation
  // It will be tested via integration tests when the pages are built
});
