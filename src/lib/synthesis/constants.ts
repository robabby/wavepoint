/**
 * Constants for the Synthesis module.
 */

import { NODE_TYPES, EDGE_TYPES } from "./types";

export { NODE_TYPES, EDGE_TYPES };

/**
 * Maximum prompt context tokens for synthesis
 */
export const MAX_SYNTHESIS_PROMPT_TOKENS = 300;

/**
 * Default query depth for synthesis traversal
 */
export const DEFAULT_MAX_DEPTH = 2;

/**
 * Default minimum weight for edge traversal
 */
export const DEFAULT_MIN_WEIGHT = 5;
