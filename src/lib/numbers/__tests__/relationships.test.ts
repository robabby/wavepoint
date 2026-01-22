/**
 * Unit tests for number pattern relationships.
 */

import { describe, expect, it } from "vitest";
import { getRelationshipsForPattern, MANUAL_RELATIONSHIPS } from "../relationships";
import {
  getNumberRelationshipCategory,
  getRelationshipLabel,
  RELATIONSHIP_PRIORITY,
} from "../relationship-types";

describe("getRelationshipsForPattern", () => {
  describe("family relationships", () => {
    it("returns 55, 5555 for 555 with type digit-family/amplification", () => {
      const relationships = getRelationshipsForPattern("555");
      const targetIds = relationships.map((r) => r.targetId);

      expect(targetIds).toContain("55");
      expect(targetIds).toContain("5555");

      // Check types
      const to55 = relationships.find((r) => r.targetId === "55");
      const to5555 = relationships.find((r) => r.targetId === "5555");

      expect(to55?.type).toBe("digit-family");
      expect(to5555?.type).toBe("amplification");
    });

    it("returns family links for all triple repeating patterns", () => {
      const triples = ["111", "222", "333", "444", "555", "666", "777", "888", "999"];

      for (const triple of triples) {
        const digit = triple[0];
        const double = `${digit}${digit}`;
        const quad = `${digit}${digit}${digit}${digit}`;

        const relationships = getRelationshipsForPattern(triple as "111");
        const targetIds = relationships.map((r) => r.targetId);

        expect(targetIds).toContain(double);
        expect(targetIds).toContain(quad);
      }
    });
  });

  describe("sequential relationships", () => {
    it("returns 321 as inverse for 123", () => {
      const relationships = getRelationshipsForPattern("123");
      const inverseRel = relationships.find((r) => r.targetId === "321");

      expect(inverseRel).toBeDefined();
      expect(inverseRel?.type).toBe("inverse");
    });

    it("returns 123 as inverse for 321", () => {
      const relationships = getRelationshipsForPattern("321");
      const inverseRel = relationships.find((r) => r.targetId === "123");

      expect(inverseRel).toBeDefined();
      expect(inverseRel?.type).toBe("inverse");
    });

    it("returns ascending siblings for ascending patterns", () => {
      const relationships = getRelationshipsForPattern("123");
      const targetIds = relationships.map((r) => r.targetId);

      // Should include other ascending sequences
      expect(targetIds).toContain("1234");
      expect(targetIds).toContain("12345");
    });
  });

  describe("manual/thematic relationships", () => {
    it("returns 111 with type progression for 999", () => {
      const relationships = getRelationshipsForPattern("999");
      const to111 = relationships.find((r) => r.targetId === "111");

      expect(to111).toBeDefined();
      expect(to111?.type).toBe("progression");
      expect(to111?.context).toBe("Completion enables new beginnings");
    });

    it("returns 999 with type progression for 111", () => {
      const relationships = getRelationshipsForPattern("111");
      const to999 = relationships.find((r) => r.targetId === "999");

      expect(to999).toBeDefined();
      expect(to999?.type).toBe("progression");
    });

    it("manual overrides take precedence over computed", () => {
      // 222 has manual complementary to 444
      const relationships = getRelationshipsForPattern("222");
      const to444 = relationships.find((r) => r.targetId === "444");

      expect(to444).toBeDefined();
      expect(to444?.type).toBe("complementary");
      expect(to444?.context).toBe("Balance meets foundation");
    });
  });

  describe("mirrored relationships", () => {
    it("links mirrored patterns to siblings", () => {
      const relationships = getRelationshipsForPattern("1221");
      const targetIds = relationships.map((r) => r.targetId);

      // Should link to other mirrored patterns
      expect(targetIds).toContain("1331");
      expect(targetIds).toContain("1441");
    });

    it("extracts component triples from mirrored patterns", () => {
      const relationships = getRelationshipsForPattern("1331");
      const targetIds = relationships.map((r) => r.targetId);

      // 1331 contains 33 and 333 as components
      expect(targetIds).toContain("33");
      expect(targetIds).toContain("333");
    });
  });

  describe("clock relationships", () => {
    it("links clock patterns to siblings", () => {
      const relationships = getRelationshipsForPattern("1212");
      const targetIds = relationships.map((r) => r.targetId);

      // Should include other clock patterns
      expect(targetIds.some((id) => ["1313", "1414", "2121", "1010"].includes(id))).toBe(true);
    });
  });

  describe("max relationships limit", () => {
    it("returns at most 9 relationships", () => {
      // Test with a pattern that could have many relationships
      const relationships = getRelationshipsForPattern("1221");
      expect(relationships.length).toBeLessThanOrEqual(9);
    });
  });

  describe("sorting", () => {
    it("sorts by priority * strength (highest first)", () => {
      const relationships = getRelationshipsForPattern("111");

      // Should be sorted - family relationships (high priority) should come first
      const scores = relationships.map(
        (r) => RELATIONSHIP_PRIORITY[r.type] * r.strength
      );

      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]!);
      }
    });
  });
});

describe("getNumberRelationshipCategory", () => {
  it("returns family for digit-family types", () => {
    expect(getNumberRelationshipCategory("same-digit")).toBe("family");
    expect(getNumberRelationshipCategory("digit-family")).toBe("family");
    expect(getNumberRelationshipCategory("amplification")).toBe("family");
  });

  it("returns sequential for sequence types", () => {
    expect(getNumberRelationshipCategory("sequential")).toBe("sequential");
    expect(getNumberRelationshipCategory("ascending")).toBe("sequential");
    expect(getNumberRelationshipCategory("descending")).toBe("sequential");
    expect(getNumberRelationshipCategory("inverse")).toBe("sequential");
  });

  it("returns structural for structure types", () => {
    expect(getNumberRelationshipCategory("contains")).toBe("structural");
    expect(getNumberRelationshipCategory("component")).toBe("structural");
    expect(getNumberRelationshipCategory("mirrored")).toBe("structural");
    expect(getNumberRelationshipCategory("compound")).toBe("structural");
  });

  it("returns thematic for meaning types", () => {
    expect(getNumberRelationshipCategory("thematic")).toBe("thematic");
    expect(getNumberRelationshipCategory("complementary")).toBe("thematic");
    expect(getNumberRelationshipCategory("progression")).toBe("thematic");
  });
});

describe("getRelationshipLabel", () => {
  it("returns human-readable labels", () => {
    expect(getRelationshipLabel("digit-family")).toBe("Family");
    expect(getRelationshipLabel("amplification")).toBe("Amplified");
    expect(getRelationshipLabel("inverse")).toBe("Inverse");
    expect(getRelationshipLabel("progression")).toBe("Progression");
  });
});

describe("MANUAL_RELATIONSHIPS", () => {
  it("has bidirectional relationships", () => {
    // 111 → 999 should have matching 999 → 111
    expect(MANUAL_RELATIONSHIPS["111"]?.some((r) => r.targetId === "999")).toBe(true);
    expect(MANUAL_RELATIONSHIPS["999"]?.some((r) => r.targetId === "111")).toBe(true);

    // 222 → 444 should have matching 444 → 222
    expect(MANUAL_RELATIONSHIPS["222"]?.some((r) => r.targetId === "444")).toBe(true);
    expect(MANUAL_RELATIONSHIPS["444"]?.some((r) => r.targetId === "222")).toBe(true);
  });
});
