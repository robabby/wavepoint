/**
 * Centralized relationship graph for number patterns.
 * Mirrors the architecture from src/lib/data/relationships.ts.
 *
 * Relationships are computed automatically with manual overrides
 * for thematic/spiritual connections.
 */

import { NUMBER_PATTERN_IDS, type NumberPatternId } from "./types";
import {
  type NumberRelationshipMeta,
  type NumberRelationshipType,
  RELATIONSHIP_PRIORITY,
} from "./relationship-types";

/** Maximum relationships to return */
const MAX_RELATIONSHIPS = 9;

// =============================================================================
// MANUAL RELATIONSHIPS
// =============================================================================

/**
 * Manual overrides for thematic/spiritual connections.
 * These take precedence over computed relationships.
 */
export const MANUAL_RELATIONSHIPS: Partial<
  Record<NumberPatternId, NumberRelationshipMeta[]>
> = {
  // Triple progressions (spiritual journey)
  "111": [
    {
      type: "progression",
      targetId: "999",
      strength: 8,
      context: "Beginnings to completion",
    },
  ],
  "999": [
    {
      type: "progression",
      targetId: "111",
      strength: 8,
      context: "Completion enables new beginnings",
    },
  ],

  // Balance and foundation complement each other
  "222": [
    {
      type: "complementary",
      targetId: "444",
      strength: 7,
      context: "Balance meets foundation",
    },
  ],
  "444": [
    {
      type: "complementary",
      targetId: "222",
      strength: 7,
      context: "Foundation meets balance",
    },
  ],

  // Growth and wisdom connection
  "333": [
    {
      type: "thematic",
      targetId: "777",
      strength: 6,
      context: "Growth leads to wisdom",
    },
  ],
  "777": [
    {
      type: "thematic",
      targetId: "333",
      strength: 6,
      context: "Wisdom emerges from growth",
    },
  ],

  // Change and abundance flow
  "555": [
    {
      type: "thematic",
      targetId: "888",
      strength: 6,
      context: "Change creates abundance",
    },
  ],
  "888": [
    {
      type: "thematic",
      targetId: "555",
      strength: 6,
      context: "Abundance through change",
    },
  ],

  // Material/spiritual balance connections
  "666": [
    {
      type: "complementary",
      targetId: "777",
      strength: 7,
      context: "Material and spiritual balance",
    },
  ],
};

// =============================================================================
// COMPUTATION FUNCTIONS
// =============================================================================

/**
 * Compute family relationships for a pattern.
 * Links patterns with the same repeating digit (11 → 111 → 1111).
 */
function computeFamilyRelationships(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  const results: NumberRelationshipMeta[] = [];
  const patternStr = patternId.toString();

  // Check if this is a repeating digit pattern (all same digit)
  const uniqueDigits = new Set(patternStr.split(""));
  if (uniqueDigits.size !== 1) {
    return results;
  }

  const digit = patternStr[0]!;
  const patternLength = patternStr.length;

  // Find other patterns with same digit
  const sameDigitPatterns: NumberPatternId[] = [];

  // Double
  const double = `${digit}${digit}` as NumberPatternId;
  if (NUMBER_PATTERN_IDS.includes(double) && double !== patternId) {
    sameDigitPatterns.push(double);
  }

  // Triple
  const triple = `${digit}${digit}${digit}` as NumberPatternId;
  if (NUMBER_PATTERN_IDS.includes(triple) && triple !== patternId) {
    sameDigitPatterns.push(triple);
  }

  // Quad
  const quad = `${digit}${digit}${digit}${digit}` as NumberPatternId;
  if (NUMBER_PATTERN_IDS.includes(quad) && quad !== patternId) {
    sameDigitPatterns.push(quad);
  }

  // Add relationships with appropriate types
  for (const targetId of sameDigitPatterns) {
    const targetLength = targetId.toString().length;
    let type: NumberRelationshipType;
    let strength: number;

    if (targetLength > patternLength) {
      // Target is longer (amplified version)
      type = "amplification";
      strength = 9;
    } else if (targetLength < patternLength) {
      // Target is shorter (base form)
      type = "digit-family";
      strength = 8;
    } else {
      // Same length (shouldn't happen, but handle it)
      type = "same-digit";
      strength = 10;
    }

    results.push({
      type,
      targetId,
      strength,
      computed: true,
    });
  }

  return results;
}

/**
 * Compute sequential relationships for a pattern.
 * Links ascending/descending sequences and their inverses.
 */
function computeSequentialRelationships(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  const results: NumberRelationshipMeta[] = [];
  const patternStr = patternId.toString();

  // Check if this pattern is sequential (ascending or descending)
  const isAscending = isAscendingSequence(patternStr);
  const isDescending = isDescendingSequence(patternStr);

  if (!isAscending && !isDescending) {
    return results;
  }

  // Find the inverse
  const inverse = patternStr.split("").reverse().join("") as NumberPatternId;
  if (NUMBER_PATTERN_IDS.includes(inverse) && inverse !== patternId) {
    results.push({
      type: "inverse",
      targetId: inverse,
      strength: 8,
      computed: true,
    });
  }

  // Find overlapping/related sequences
  const sequentialPatterns: NumberPatternId[] = [
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "1234",
    "12345",
    "321",
    "432",
    "4321",
    "54321",
  ];

  for (const targetId of sequentialPatterns) {
    if (targetId === patternId || targetId === inverse) continue;

    const targetStr = targetId.toString();
    const targetIsAscending = isAscendingSequence(targetStr);
    const targetIsDescending = isDescendingSequence(targetStr);

    // Same direction sequences
    if (
      (isAscending && targetIsAscending) ||
      (isDescending && targetIsDescending)
    ) {
      // Check for overlap (shared digits in sequence)
      const hasOverlap =
        patternStr.includes(targetStr.slice(0, 2)) ||
        targetStr.includes(patternStr.slice(0, 2));

      if (hasOverlap) {
        results.push({
          type: isAscending ? "ascending" : "descending",
          targetId,
          strength: 6,
          computed: true,
        });
      }
    }
  }

  return results;
}

/**
 * Compute structural relationships for a pattern.
 * Links patterns that contain/are contained by others.
 */
function computeStructuralRelationships(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  const results: NumberRelationshipMeta[] = [];
  const patternStr = patternId.toString();

  // Find patterns contained in this one
  for (const targetId of NUMBER_PATTERN_IDS) {
    if (targetId === patternId) continue;
    const targetStr = targetId.toString();

    // Skip if target is longer or equal length
    if (targetStr.length >= patternStr.length) continue;

    if (patternStr.includes(targetStr)) {
      results.push({
        type: "contains",
        targetId,
        strength: 5,
        computed: true,
      });
    }
  }

  // For compound patterns, find their component triples/doubles
  if (isCompoundPattern(patternStr)) {
    const components = extractComponents(patternStr);
    for (const comp of components) {
      if (NUMBER_PATTERN_IDS.includes(comp as NumberPatternId)) {
        // Avoid duplicate if already in contains
        if (!results.some((r) => r.targetId === comp)) {
          results.push({
            type: "component",
            targetId: comp as NumberPatternId,
            strength: 7,
            computed: true,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Compute mirrored relationships for palindrome patterns.
 * Links patterns in the mirrored category.
 */
function computeMirroredRelationships(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  const results: NumberRelationshipMeta[] = [];
  const patternStr = patternId.toString();

  // Check if this is a palindrome
  const isPalindrome =
    patternStr.length >= 3 &&
    patternStr === patternStr.split("").reverse().join("");

  if (!isPalindrome) {
    return results;
  }

  // Mirrored patterns (1001, 1221, 1331, etc.)
  const mirroredPatterns: NumberPatternId[] = [
    "1001",
    "1221",
    "1331",
    "1441",
    "1551",
    "1661",
    "1771",
    "1881",
    "1991",
  ];

  // Link to other mirrored patterns
  for (const targetId of mirroredPatterns) {
    if (targetId === patternId) continue;

    results.push({
      type: "mirrored",
      targetId,
      strength: 5,
      computed: true,
    });
  }

  // Extract the core triple from mirrored patterns like 1221 → 22, 222
  if (mirroredPatterns.includes(patternId)) {
    const coreDigit = patternStr[1];
    if (coreDigit) {
      const double = `${coreDigit}${coreDigit}` as NumberPatternId;
      const triple =
        `${coreDigit}${coreDigit}${coreDigit}` as NumberPatternId;

      if (NUMBER_PATTERN_IDS.includes(double)) {
        results.push({
          type: "component",
          targetId: double,
          strength: 6,
          computed: true,
        });
      }
      if (NUMBER_PATTERN_IDS.includes(triple)) {
        results.push({
          type: "component",
          targetId: triple,
          strength: 6,
          computed: true,
        });
      }
    }
  }

  return results;
}

/**
 * Compute clock pattern relationships.
 * Links patterns in the clock category to their siblings and components.
 */
function computeClockRelationships(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  const results: NumberRelationshipMeta[] = [];
  const patternStr = patternId.toString();

  // Clock patterns
  const clockPatterns: NumberPatternId[] = [
    "0000",
    "0101",
    "1010",
    "1212",
    "1313",
    "1414",
    "1515",
    "1616",
    "1717",
    "1818",
    "1919",
    "2020",
    "2112",
    "2121",
    "2323",
  ];

  if (!clockPatterns.includes(patternId)) {
    return results;
  }

  // Link to other clock patterns (siblings)
  for (const targetId of clockPatterns) {
    if (targetId === patternId) continue;

    // Prioritize patterns with similar structure
    const targetStr = targetId.toString();
    const similarity = calculateStringSimilarity(patternStr, targetStr);

    if (similarity > 0.3) {
      results.push({
        type: "sequential",
        targetId,
        strength: Math.round(similarity * 6),
        computed: true,
      });
    }
  }

  // Extract component triples from clock patterns
  const digits = patternStr.split("");
  const uniqueDigits = [...new Set(digits)].filter((d) => d !== "0");

  for (const digit of uniqueDigits) {
    const triple = `${digit}${digit}${digit}` as NumberPatternId;
    if (NUMBER_PATTERN_IDS.includes(triple)) {
      results.push({
        type: "component",
        targetId: triple,
        strength: 5,
        computed: true,
      });
    }
  }

  return results;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function isAscendingSequence(str: string): boolean {
  if (str.length < 3) return false;
  for (let i = 1; i < str.length; i++) {
    const prev = parseInt(str[i - 1]!, 10);
    const curr = parseInt(str[i]!, 10);
    if (curr !== prev + 1) return false;
  }
  return true;
}

function isDescendingSequence(str: string): boolean {
  if (str.length < 3) return false;
  for (let i = 1; i < str.length; i++) {
    const prev = parseInt(str[i - 1]!, 10);
    const curr = parseInt(str[i]!, 10);
    if (curr !== prev - 1) return false;
  }
  return true;
}

function isCompoundPattern(str: string): boolean {
  // Compound patterns have repeated pairs (1122, 1133, etc.)
  if (str.length !== 4) return false;
  return str[0] === str[1] && str[2] === str[3] && str[0] !== str[2];
}

function extractComponents(str: string): string[] {
  const components: string[] = [];

  // Extract pairs from compound patterns
  if (str.length === 4) {
    const first = str.slice(0, 2);
    const second = str.slice(2, 4);
    if (first[0] === first[1]) components.push(first);
    if (second[0] === second[1]) components.push(second);
  }

  return components;
}

function calculateStringSimilarity(a: string, b: string): number {
  if (a.length !== b.length) return 0;
  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / a.length;
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Get all relationships for a pattern.
 * Merges computed relationships with manual overrides.
 * Returns up to MAX_RELATIONSHIPS, sorted by priority * strength.
 */
export function getRelationshipsForPattern(
  patternId: NumberPatternId
): NumberRelationshipMeta[] {
  // Return empty if not a valid pattern ID
  if (!NUMBER_PATTERN_IDS.includes(patternId)) {
    return [];
  }

  // Compute all relationships
  const family = computeFamilyRelationships(patternId);
  const sequential = computeSequentialRelationships(patternId);
  const structural = computeStructuralRelationships(patternId);
  const mirrored = computeMirroredRelationships(patternId);
  const clock = computeClockRelationships(patternId);

  const computed = [...family, ...sequential, ...structural, ...mirrored, ...clock];

  // Get manual overrides
  const manual = MANUAL_RELATIONSHIPS[patternId] ?? [];

  // Merge: manual wins on collision (same targetId)
  const manualTargetIds = new Set(manual.map((r) => r.targetId));
  const filteredComputed = computed.filter(
    (r) => !manualTargetIds.has(r.targetId)
  );

  const all = [...manual, ...filteredComputed];

  // Deduplicate by targetId (keep highest score)
  const byTarget = new Map<NumberPatternId, NumberRelationshipMeta>();
  for (const rel of all) {
    const existing = byTarget.get(rel.targetId);
    const score = RELATIONSHIP_PRIORITY[rel.type] * rel.strength;
    const existingScore = existing
      ? RELATIONSHIP_PRIORITY[existing.type] * existing.strength
      : 0;

    if (!existing || score > existingScore) {
      byTarget.set(rel.targetId, rel);
    }
  }

  // Sort by priority * strength (descending)
  const sorted = [...byTarget.values()].sort((a, b) => {
    const scoreA = RELATIONSHIP_PRIORITY[a.type] * a.strength;
    const scoreB = RELATIONSHIP_PRIORITY[b.type] * b.strength;
    return scoreB - scoreA;
  });

  // Return top MAX_RELATIONSHIPS
  return sorted.slice(0, MAX_RELATIONSHIPS);
}
