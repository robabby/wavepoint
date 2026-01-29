import type { ArchetypeSlug } from "@/lib/archetypes";
import type { MajorArcanaSlug } from "@/lib/tarot";

/**
 * Systems represented in the constellation
 */
export type ConstellationSystem = "jungian" | "tarot";

/**
 * How the entry was added
 */
export type ConstellationSource = "computed" | "user_added";

/**
 * Current status of the entry
 */
export type ConstellationStatus = "active" | "dismissed";

/**
 * A constellation entry from the database
 */
export interface ConstellationEntry {
  id: string;
  userId: string;
  system: ConstellationSystem;
  identifier: ArchetypeSlug | MajorArcanaSlug;
  source: ConstellationSource;
  status: ConstellationStatus;
  derivedFrom: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API response for constellation entries
 */
export interface ConstellationResponse {
  entries: ConstellationEntry[];
}

/**
 * Input for updating an entry's status
 */
export interface UpdateConstellationInput {
  system: ConstellationSystem;
  identifier: string;
  status: ConstellationStatus;
}

/**
 * Input for adding a user-chosen entry
 */
export interface AddConstellationInput {
  system: ConstellationSystem;
  identifier: string;
}

/**
 * A computed entry before DB insertion
 */
export interface ComputedEntry {
  system: ConstellationSystem;
  identifier: string;
  derivedFrom: string;
}
