import { env } from "@/env";

/**
 * Check if the Signal feature is enabled.
 *
 * In production (Vercel), this defaults to false unless NEXT_PUBLIC_SIGNAL_ENABLED=true is set.
 * In local development, set NEXT_PUBLIC_SIGNAL_ENABLED=true in .env.local.
 */
export function isSignalEnabled(): boolean {
  return env.NEXT_PUBLIC_SIGNAL_ENABLED;
}

/**
 * Check if AI-powered interpretations are enabled.
 * When disabled, interpretations use deterministic synthesis instead of Claude API calls.
 * Defaults to true — set NEXT_PUBLIC_AI_ENABLED=false to disable.
 */
export function isAIEnabled(): boolean {
  return env.NEXT_PUBLIC_AI_ENABLED;
}
