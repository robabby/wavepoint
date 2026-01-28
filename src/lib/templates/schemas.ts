/**
 * Zod schemas for template validation.
 *
 * Used by the generation script and for runtime validation.
 *
 * @module templates/schemas
 */

import { z } from "zod";

// =============================================================================
// Shared Schemas
// =============================================================================

const activitySchema = z.enum(["working", "transit", "resting", "socializing", "other"]);
const elementSchema = z.enum(["fire", "water", "earth", "air"]);
const categorySchema = z.enum(["repetition", "sequence", "mirror", "classic"]);

// =============================================================================
// Base Template Schema
// =============================================================================

export const baseTemplateSchema = z.object({
  number: z.string().min(1).max(30),
  category: categorySchema,
  essence: z.string().min(20).max(300),
  expanded: z.string().min(100).max(2000),
  keywords: z.array(z.string()).min(3).max(8),
  elementalAffinity: elementSchema.optional(),
  essenceVariants: z.array(z.string().min(20).max(300)).optional(),
  expandedVariants: z.array(z.string().min(100).max(2000)).optional(),
});

export type BaseTemplateInput = z.infer<typeof baseTemplateSchema>;

// =============================================================================
// Modifier Schemas
// =============================================================================

export const moonModifierSchema = z.object({
  type: z.literal("moon"),
  key: z.string().min(1),
  suffix: z.string().min(20).max(500),
  transition: z.string().min(5).max(200),
  keywords: z.array(z.string()).min(3).max(5),
});

export type MoonModifierInput = z.infer<typeof moonModifierSchema>;

export const moodModifierSchema = z.object({
  type: z.literal("mood"),
  key: z.string().min(1),
  suffix: z.string().min(20).max(500),
  transition: z.string().min(5).max(200),
  keywords: z.array(z.string()).min(3).max(5),
});

export type MoodModifierInput = z.infer<typeof moodModifierSchema>;

export const activityModifierSchema = z.object({
  type: z.literal("activity"),
  key: activitySchema,
  suffix: z.string().min(20).max(500),
  transition: z.string().min(5).max(200),
  keywords: z.array(z.string()).min(3).max(5),
});

export type ActivityModifierInput = z.infer<typeof activityModifierSchema>;

export const elementModifierSchema = z.object({
  type: z.literal("element"),
  key: elementSchema,
  suffix: z.string().min(20).max(500),
  transition: z.string().min(5).max(200),
  keywords: z.array(z.string()).min(3).max(5),
});

export type ElementModifierInput = z.infer<typeof elementModifierSchema>;

// =============================================================================
// Pattern Injection Schema
// =============================================================================

export const patternInjectionSchema = z.object({
  patternType: z.string().min(1),
  template: z.string().min(10).max(500),
  minDataPoints: z.number().int().min(1).max(100),
});

export type PatternInjectionInput = z.infer<typeof patternInjectionSchema>;
