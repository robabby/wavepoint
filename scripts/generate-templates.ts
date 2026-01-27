#!/usr/bin/env npx tsx
/**
 * Template Generation Script
 *
 * Uses Claude API to bootstrap ~130 interpretation templates.
 * Run with: npx tsx scripts/generate-templates.ts
 *
 * Outputs TypeScript files to src/lib/templates/data/
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import {
  baseTemplateSchema,
  moonModifierSchema,
  moodModifierSchema,
  activityModifierSchema,
  elementModifierSchema,
  patternInjectionSchema,
  type BaseTemplateInput,
  type MoonModifierInput,
  type MoodModifierInput,
  type ActivityModifierInput,
  type ElementModifierInput,
  type PatternInjectionInput,
} from "../src/lib/templates/schemas";

// =============================================================================
// Configuration
// =============================================================================

const DATA_DIR = join(process.cwd(), "src/lib/templates/data");

const VOICE_GUIDELINES = `
Voice: "Modern mystic" - sophisticated spirituality.

Do:
- Use present tense, active voice
- Balance mystical insight with practical grounding
- Acknowledge uncertainty without undermining meaning
- Speak directly to the user ("you" not "one")
- Include subtle calls to reflection

Don't:
- Over-promise or make absolute claims
- Use clichéd spiritual language ("the universe wants...")
- Be preachy or prescriptive
- Include specific timing predictions
- Reference other users' experiences

Example tone:
"Triple fours speak to foundation and stability—not as something to achieve, but as something already present beneath the surface. When this pattern appears, it often marks a moment where your deeper structures are becoming visible to you."
`;

// =============================================================================
// Template Definitions
// =============================================================================

const BASE_TEMPLATES = {
  repetition: ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"],
  sequence: [
    "123", "234", "345", "456", "567", "678", "789",
    "321", "432", "543", "654", "765", "876", "987",
  ],
  mirror: [
    "1001", "1221", "1331", "1441", "1551",
    "2112", "2332", "2552",
    "3113", "3223",
  ],
  classic: [
    "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "0000",
    "1010", "1212", "1313", "1414", "1515",
    "2020", "2121", "2323",
    "911", "1234", "4321",
    "717", "818", "919",
  ],
};

const MOON_PHASES = [
  "new_moon",
  "waxing_crescent",
  "first_quarter",
  "waxing_gibbous",
  "full_moon",
  "waning_gibbous",
  "last_quarter",
  "waning_crescent",
] as const;

const MOODS = [
  "calm", "energized", "reflective", "anxious", "grateful", "inspired",
  "curious", "hopeful", "peaceful", "confused", "excited", "uncertain",
];

const ACTIVITIES = ["working", "transit", "resting", "socializing", "other"] as const;

const ELEMENTS = ["fire", "water", "earth", "air"] as const;

const PATTERN_TYPES = [
  "time_peak", "mood_correlation", "activity_correlation", "frequency_trend",
  "moon_correlation", "weekday_pattern", "number_pairing", "streak_pattern",
  "milestone", "recurrence",
] as const;

// =============================================================================
// Anthropic Client
// =============================================================================

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY environment variable not set");
    process.exit(1);
  }
  return new Anthropic({ apiKey });
}

// =============================================================================
// Generation Functions
// =============================================================================

async function generateBaseTemplate(
  client: Anthropic,
  number: string,
  category: string
): Promise<BaseTemplateInput> {
  const prompt = `Generate an angel number interpretation template for the number "${number}" in the "${category}" category.

${VOICE_GUIDELINES}

Respond with valid JSON only, no markdown:
{
  "number": "${number}",
  "category": "${category}",
  "essence": "1-2 sentence core meaning (20-300 chars)",
  "expanded": "2-3 paragraphs full interpretation (100-2000 chars). Include line breaks between paragraphs.",
  "keywords": ["3-8 keywords for semantic matching"],
  "elementalAffinity": "fire" | "water" | "earth" | "air" | null
}

For elementalAffinity, only include if there's a clear elemental connection to the number's meaning. Most numbers won't have one.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  if (json.elementalAffinity === null) {
    delete json.elementalAffinity;
  }

  const result = baseTemplateSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for ${number}:`, result.error.format());
    throw new Error(`Validation failed for base template ${number}`);
  }

  return result.data;
}

async function generateMoonModifier(
  client: Anthropic,
  phase: (typeof MOON_PHASES)[number]
): Promise<MoonModifierInput> {
  const phaseName = phase.replace(/_/g, " ");

  const prompt = `Generate a moon phase modifier for angel number interpretations during the "${phaseName}" phase.

${VOICE_GUIDELINES}

This modifier will be APPENDED to base number interpretations to add lunar context.

Respond with valid JSON only, no markdown:
{
  "type": "moon",
  "key": "${phase}",
  "suffix": "1-3 sentences that add ${phaseName} context to any number interpretation (max 500 chars). This will be appended as a new paragraph.",
  "transition": "Short connecting phrase like 'Under the ${phaseName},' or 'With the moon in ${phaseName} phase,' (max 200 chars)",
  "keywords": ["3-5 keywords related to ${phaseName}"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  const result = moonModifierSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for moon ${phase}:`, result.error.format());
    throw new Error(`Validation failed for moon modifier ${phase}`);
  }

  return result.data;
}

async function generateMoodModifier(
  client: Anthropic,
  mood: string
): Promise<MoodModifierInput> {
  const prompt = `Generate a mood modifier for angel number interpretations when the user feels "${mood}".

${VOICE_GUIDELINES}

This modifier will be APPENDED to base number interpretations to add emotional context.

Respond with valid JSON only, no markdown:
{
  "type": "mood",
  "key": "${mood}",
  "suffix": "1-3 sentences that add context for feeling ${mood} to any number interpretation (max 500 chars). This will be appended as a new paragraph.",
  "transition": "Short connecting phrase like 'When feeling ${mood},' or 'In this ${mood} state,' (max 200 chars)",
  "keywords": ["3-5 keywords related to ${mood}"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  const result = moodModifierSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for mood ${mood}:`, result.error.format());
    throw new Error(`Validation failed for mood modifier ${mood}`);
  }

  return result.data;
}

async function generateActivityModifier(
  client: Anthropic,
  activity: (typeof ACTIVITIES)[number]
): Promise<ActivityModifierInput> {
  const prompt = `Generate an activity modifier for angel number interpretations when the user is "${activity}".

${VOICE_GUIDELINES}

This modifier will be APPENDED to base number interpretations to add activity context.

Respond with valid JSON only, no markdown:
{
  "type": "activity",
  "key": "${activity}",
  "suffix": "1-3 sentences that add context for ${activity} to any number interpretation (max 500 chars). This will be appended as a new paragraph.",
  "transition": "Short connecting phrase like 'While ${activity},' (max 200 chars)",
  "keywords": ["3-5 keywords related to ${activity}"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  const result = activityModifierSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for activity ${activity}:`, result.error.format());
    throw new Error(`Validation failed for activity modifier ${activity}`);
  }

  return result.data;
}

async function generateElementModifier(
  client: Anthropic,
  element: (typeof ELEMENTS)[number]
): Promise<ElementModifierInput> {
  const elementDescriptions = {
    fire: "passionate, transformative, action-oriented (Aries, Leo, Sagittarius)",
    water: "emotional, intuitive, deep-feeling (Cancer, Scorpio, Pisces)",
    earth: "grounded, practical, stability-seeking (Taurus, Virgo, Capricorn)",
    air: "intellectual, communicative, idea-driven (Gemini, Libra, Aquarius)",
  };

  const prompt = `Generate an element modifier for angel number interpretations for users with a ${element} dominant element.

${element} characteristics: ${elementDescriptions[element]}

${VOICE_GUIDELINES}

This modifier will be APPENDED to base number interpretations for users whose natal chart shows ${element} dominance.

Respond with valid JSON only, no markdown:
{
  "type": "element",
  "key": "${element}",
  "suffix": "1-3 sentences that add ${element} element resonance to any number interpretation (max 500 chars). This will be appended as a new paragraph.",
  "transition": "Short connecting phrase like 'Through your ${element} nature,' (max 200 chars)",
  "keywords": ["3-5 keywords related to ${element} element"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  const result = elementModifierSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for element ${element}:`, result.error.format());
    throw new Error(`Validation failed for element modifier ${element}`);
  }

  return result.data;
}

async function generatePatternInjection(
  client: Anthropic,
  patternType: (typeof PATTERN_TYPES)[number]
): Promise<PatternInjectionInput> {
  const patternDescriptions: Record<string, string> = {
    time_peak: "User tends to see numbers at specific times of day. Placeholders: {{peakTime}}, {{count}}",
    mood_correlation: "Number correlates with certain moods. Placeholders: {{mood}}, {{count}}, {{percentage}}",
    activity_correlation: "Number appears during specific activities. Placeholders: {{activity}}, {{count}}",
    frequency_trend: "Number frequency is increasing/decreasing. Placeholders: {{trend}}, {{change}}",
    moon_correlation: "Number appears more in certain moon phases. Placeholders: {{moonPhase}}, {{count}}",
    weekday_pattern: "Number clusters on certain days. Placeholders: {{dayOfWeek}}, {{count}}",
    number_pairing: "Number often appears with another number. Placeholders: {{pairedNumber}}, {{count}}",
    streak_pattern: "User is on a seeing streak. Placeholders: {{streakDays}}, {{number}}",
    milestone: "User reached a sighting milestone. Placeholders: {{milestone}}, {{number}}, {{totalCount}}",
    recurrence: "Number is recurring after absence. Placeholders: {{daysSince}}, {{number}}",
  };

  const minDataPointsGuide: Record<string, number> = {
    time_peak: 10,
    mood_correlation: 5,
    activity_correlation: 5,
    frequency_trend: 15,
    moon_correlation: 8,
    weekday_pattern: 14,
    number_pairing: 5,
    streak_pattern: 3,
    milestone: 1,
    recurrence: 3,
  };

  const prompt = `Generate a pattern injection template for personalized angel number interpretations.

Pattern type: ${patternType}
Description: ${patternDescriptions[patternType]}

${VOICE_GUIDELINES}

This template will be INJECTED into interpretations when the user's data shows this pattern.
Use {{placeholders}} that will be filled with actual data.

Respond with valid JSON only, no markdown:
{
  "patternType": "${patternType}",
  "template": "1-3 sentences using the placeholders to create personalized insight (10-500 chars)",
  "minDataPoints": ${minDataPointsGuide[patternType]}
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const json = JSON.parse(text);

  const result = patternInjectionSchema.safeParse(json);
  if (!result.success) {
    console.error(`Validation failed for pattern ${patternType}:`, result.error.format());
    throw new Error(`Validation failed for pattern injection ${patternType}`);
  }

  return result.data;
}

// =============================================================================
// TypeScript File Generation
// =============================================================================

function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function formatBaseTemplate(t: BaseTemplateInput): string {
  const lines = [
    `  {`,
    `    number: "${t.number}",`,
    `    category: "${t.category}",`,
    `    essence: "${escapeString(t.essence)}",`,
    `    expanded: "${escapeString(t.expanded)}",`,
    `    keywords: [${t.keywords.map(k => `"${escapeString(k)}"`).join(", ")}],`,
  ];
  if (t.elementalAffinity) {
    lines.push(`    elementalAffinity: "${t.elementalAffinity}",`);
  }
  lines.push(`  }`);
  return lines.join("\n");
}

function formatModifier(m: MoonModifierInput | MoodModifierInput | ActivityModifierInput | ElementModifierInput): string {
  return `  {
    type: "${m.type}",
    key: "${m.key}",
    suffix: "${escapeString(m.suffix)}",
    transition: "${escapeString(m.transition)}",
    keywords: [${m.keywords.map(k => `"${escapeString(k)}"`).join(", ")}],
  }`;
}

function formatInjection(i: PatternInjectionInput): string {
  return `  {
    patternType: "${i.patternType}",
    template: "${escapeString(i.template)}",
    minDataPoints: ${i.minDataPoints},
  }`;
}

async function writeBaseTemplateFile(
  category: string,
  templates: BaseTemplateInput[]
): Promise<void> {
  const content = `/**
 * ${category.charAt(0).toUpperCase() + category.slice(1)} templates (${templates.map(t => t.number).join(", ")})
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { BaseTemplate } from "../../types";

const templates: BaseTemplate[] = [
${templates.map(formatBaseTemplate).join(",\n")}
];

export default templates;
`;

  const filePath = join(DATA_DIR, "base", `${category}.ts`);
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${templates.length} templates)`);
}

async function writeMoonModifiersFile(modifiers: MoonModifierInput[]): Promise<void> {
  const content = `/**
 * Moon phase modifiers.
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { MoonModifier } from "../../types";

const modifiers: MoonModifier[] = [
${modifiers.map(formatModifier).join(",\n")}
];

export default modifiers;
`;

  const filePath = join(DATA_DIR, "modifiers", "moon.ts");
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${modifiers.length} modifiers)`);
}

async function writeMoodModifiersFile(modifiers: MoodModifierInput[]): Promise<void> {
  const content = `/**
 * Mood modifiers.
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { MoodModifier } from "../../types";

const modifiers: MoodModifier[] = [
${modifiers.map(formatModifier).join(",\n")}
];

export default modifiers;
`;

  const filePath = join(DATA_DIR, "modifiers", "mood.ts");
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${modifiers.length} modifiers)`);
}

async function writeActivityModifiersFile(modifiers: ActivityModifierInput[]): Promise<void> {
  const content = `/**
 * Activity modifiers.
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { ActivityModifier } from "../../types";

const modifiers: ActivityModifier[] = [
${modifiers.map(formatModifier).join(",\n")}
];

export default modifiers;
`;

  const filePath = join(DATA_DIR, "modifiers", "activity.ts");
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${modifiers.length} modifiers)`);
}

async function writeElementModifiersFile(modifiers: ElementModifierInput[]): Promise<void> {
  const content = `/**
 * Element modifiers.
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { ElementModifier } from "../../types";

const modifiers: ElementModifier[] = [
${modifiers.map(formatModifier).join(",\n")}
];

export default modifiers;
`;

  const filePath = join(DATA_DIR, "modifiers", "element.ts");
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${modifiers.length} modifiers)`);
}

async function writeInjectionsFile(injections: PatternInjectionInput[]): Promise<void> {
  const content = `/**
 * Pattern injection templates.
 *
 * Generated by scripts/generate-templates.ts
 * DO NOT EDIT MANUALLY
 */

import type { PatternInjection } from "../types";

const injections: PatternInjection[] = [
${injections.map(formatInjection).join(",\n")}
];

export default injections;
`;

  const filePath = join(DATA_DIR, "injections.ts");
  await writeFile(filePath, content);
  console.log(`  ✓ Wrote ${filePath} (${injections.length} injections)`);
}

// =============================================================================
// Cache for incremental generation
// =============================================================================

interface GenerationCache {
  base: Record<string, BaseTemplateInput[]>;
  moon: MoonModifierInput[];
  mood: MoodModifierInput[];
  activity: ActivityModifierInput[];
  element: ElementModifierInput[];
  injections: PatternInjectionInput[];
}

const CACHE_FILE = join(DATA_DIR, ".generation-cache.json");

async function loadCache(): Promise<GenerationCache> {
  try {
    if (existsSync(CACHE_FILE)) {
      const content = await readFile(CACHE_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // Ignore cache errors
  }
  return {
    base: { repetition: [], sequence: [], mirror: [], classic: [] },
    moon: [],
    mood: [],
    activity: [],
    element: [],
    injections: [],
  };
}

async function saveCache(cache: GenerationCache): Promise<void> {
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// =============================================================================
// Batch Generation
// =============================================================================

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAllBaseTemplates(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n📖 Generating base templates...\n");

  for (const [category, numbers] of Object.entries(BASE_TEMPLATES)) {
    console.log(`Category: ${category} (${numbers.length} templates)`);

    const existing = cache.base[category] ?? [];
    const existingNumbers = new Set(existing.map(t => t.number));

    for (const number of numbers) {
      if (existingNumbers.has(number)) {
        console.log(`  ⏭ Skipping ${number} (cached)`);
        continue;
      }

      try {
        const template = await generateBaseTemplate(client, number, category);
        existing.push(template);
        cache.base[category] = existing;
        await saveCache(cache);
        console.log(`  ✓ Generated ${number}`);
        await sleep(500);
      } catch (error) {
        console.error(`  ✗ Failed to generate ${number}:`, error);
      }
    }

    // Write the TypeScript file for this category
    if (existing.length > 0) {
      await writeBaseTemplateFile(category, existing);
    }
  }
}

async function generateAllMoonModifiers(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n🌙 Generating moon modifiers...\n");

  const existingKeys = new Set(cache.moon.map(m => m.key));

  for (const phase of MOON_PHASES) {
    if (existingKeys.has(phase)) {
      console.log(`  ⏭ Skipping ${phase} (cached)`);
      continue;
    }

    try {
      const modifier = await generateMoonModifier(client, phase);
      cache.moon.push(modifier);
      await saveCache(cache);
      console.log(`  ✓ Generated ${phase}`);
      await sleep(500);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${phase}:`, error);
    }
  }

  if (cache.moon.length > 0) {
    await writeMoonModifiersFile(cache.moon);
  }
}

async function generateAllMoodModifiers(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n😊 Generating mood modifiers...\n");

  const existingKeys = new Set(cache.mood.map(m => m.key));

  for (const mood of MOODS) {
    if (existingKeys.has(mood)) {
      console.log(`  ⏭ Skipping ${mood} (cached)`);
      continue;
    }

    try {
      const modifier = await generateMoodModifier(client, mood);
      cache.mood.push(modifier);
      await saveCache(cache);
      console.log(`  ✓ Generated ${mood}`);
      await sleep(500);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${mood}:`, error);
    }
  }

  if (cache.mood.length > 0) {
    await writeMoodModifiersFile(cache.mood);
  }
}

async function generateAllActivityModifiers(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n💼 Generating activity modifiers...\n");

  const existingKeys = new Set(cache.activity.map(m => m.key));

  for (const activity of ACTIVITIES) {
    if (existingKeys.has(activity)) {
      console.log(`  ⏭ Skipping ${activity} (cached)`);
      continue;
    }

    try {
      const modifier = await generateActivityModifier(client, activity);
      cache.activity.push(modifier);
      await saveCache(cache);
      console.log(`  ✓ Generated ${activity}`);
      await sleep(500);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${activity}:`, error);
    }
  }

  if (cache.activity.length > 0) {
    await writeActivityModifiersFile(cache.activity);
  }
}

async function generateAllElementModifiers(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n🔥 Generating element modifiers...\n");

  const existingKeys = new Set(cache.element.map(m => m.key));

  for (const element of ELEMENTS) {
    if (existingKeys.has(element)) {
      console.log(`  ⏭ Skipping ${element} (cached)`);
      continue;
    }

    try {
      const modifier = await generateElementModifier(client, element);
      cache.element.push(modifier);
      await saveCache(cache);
      console.log(`  ✓ Generated ${element}`);
      await sleep(500);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${element}:`, error);
    }
  }

  if (cache.element.length > 0) {
    await writeElementModifiersFile(cache.element);
  }
}

async function generateAllPatternInjections(
  client: Anthropic,
  cache: GenerationCache
): Promise<void> {
  console.log("\n🔮 Generating pattern injections...\n");

  const existingTypes = new Set(cache.injections.map(i => i.patternType));

  for (const patternType of PATTERN_TYPES) {
    if (existingTypes.has(patternType)) {
      console.log(`  ⏭ Skipping ${patternType} (cached)`);
      continue;
    }

    try {
      const injection = await generatePatternInjection(client, patternType);
      cache.injections.push(injection);
      await saveCache(cache);
      console.log(`  ✓ Generated ${patternType}`);
      await sleep(500);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${patternType}:`, error);
    }
  }

  if (cache.injections.length > 0) {
    await writeInjectionsFile(cache.injections);
  }
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  console.log("🚀 Template Generation Script");
  console.log("==============================\n");

  const client = getClient();
  const cache = await loadCache();

  // Parse command line args for selective generation
  const args = process.argv.slice(2);
  const generateAll = args.length === 0 || args.includes("--all");
  const generateBase = generateAll || args.includes("--base");
  const generateMoon = generateAll || args.includes("--moon");
  const generateMood = generateAll || args.includes("--mood");
  const generateActivity = generateAll || args.includes("--activity");
  const generateElement = generateAll || args.includes("--element");
  const generatePatterns = generateAll || args.includes("--patterns");

  if (generateBase) await generateAllBaseTemplates(client, cache);
  if (generateMoon) await generateAllMoonModifiers(client, cache);
  if (generateMood) await generateAllMoodModifiers(client, cache);
  if (generateActivity) await generateAllActivityModifiers(client, cache);
  if (generateElement) await generateAllElementModifiers(client, cache);
  if (generatePatterns) await generateAllPatternInjections(client, cache);

  // Summary
  console.log("\n📊 Summary:");
  console.log(`  Base templates: ${Object.values(cache.base).flat().length}`);
  console.log(`  Moon modifiers: ${cache.moon.length}`);
  console.log(`  Mood modifiers: ${cache.mood.length}`);
  console.log(`  Activity modifiers: ${cache.activity.length}`);
  console.log(`  Element modifiers: ${cache.element.length}`);
  console.log(`  Pattern injections: ${cache.injections.length}`);

  console.log("\n✅ Generation complete!");
}

main().catch(console.error);
