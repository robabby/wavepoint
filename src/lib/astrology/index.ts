/**
 * Astrology module - Constants, types, and planet content for WavePoint's astrology features.
 *
 * This module provides:
 * - Zodiac sign and planet constants with metadata
 * - Planet content pages (starting with Saturn)
 * - Foundation types for future chart calculations
 *
 * @example
 * ```ts
 * import { ZODIAC_META, getPlanet } from "@/lib/astrology";
 *
 * const saturn = getPlanet("saturn");
 * console.log(saturn?.glyph); // ♄
 *
 * const capricorn = ZODIAC_META.capricorn;
 * console.log(capricorn.glyph); // ♑
 * ```
 */

// Constants
export {
  // Zodiac
  ZODIAC_SIGNS,
  ZODIAC_META,
  type ZodiacSign,
  // Planets
  PLANETS,
  CELESTIAL_BODIES,
  PLANET_META,
  type PlanetId,
  type CelestialBodyId,
  // Angles
  ANGLES,
  type AngleId,
  // Aspects
  ASPECT_TYPES,
  ASPECT_META,
  type MajorAspect,
  type MinorAspect,
  type AspectType,
  // House systems
  HOUSE_SYSTEMS,
  DEFAULT_HOUSE_SYSTEM,
  type HouseSystem,
  // Zodiac systems
  ZODIAC_SYSTEMS,
  DEFAULT_ZODIAC_SYSTEM,
  type ZodiacSystem,
} from "./constants";

// Planet content pages
export * from "./planets";

// Zodiac sign content pages
export * from "./signs";

// Astrological house content pages
export * from "./houses";
