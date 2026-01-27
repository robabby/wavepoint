# ADR-0002: AI SDK Evaluation

**Status:** Deferred
**Date:** 2026-01-26

## Context

We evaluated the [Vercel AI SDK](https://ai-sdk.dev/) to determine if it should replace our direct Anthropic SDK usage for AI-powered interpretations in Signal.

Current implementation (`src/lib/signal/claude.ts`):
- Direct `@anthropic-ai/sdk` usage (~260 lines)
- Smart model selection (Haiku for quick captures, Sonnet for rich context)
- Synthesis context injection from knowledge graph
- Graceful fallback with 15s timeouts
- No streaming, no structured outputs

Options considered:
1. **Stay with direct Anthropic SDK** - Current approach, minimal complexity
2. **Migrate to AI SDK** - Provider abstraction, streaming, structured outputs, tool calling
3. **Hybrid** - Use AI SDK for new features only

## Decision

Defer adoption of AI SDK until we begin building Layer 3 (Prompt Evolution Engine) or Layer 4 (Temporal Patterns) of our moat architecture. Continue with direct Anthropic SDK for current features.

## Rationale

### Why Defer (Not Reject)?

The AI SDK offers genuine value for our moat strategy, but not for current implementation needs.

| Capability | Current Need | Moat Strategy Alignment |
|------------|--------------|------------------------|
| Provider Abstraction | Low | Medium — A/B test Claude vs GPT |
| Streaming | Low | High — UX improvement |
| Structured Outputs | None | **Critical** — Resonance tracking |
| Tool Calling | None | **Critical** — Dynamic context queries |
| Agents | None | High — Multi-step interpretation |

### Strategic Alignment

From our [VC Evaluation and Moat Analysis](obsidian://open?vault=Obsidian&file=Areas%2FWavePoint%2FStrategy%2FVC%20Evaluation%20and%20Moat%20Analysis):

> "Model weights are commoditized. Prompts can be reverse-engineered. What can't be copied: longitudinal user data, cross-domain synthesis."

The AI SDK doesn't change this calculus — our moat comes from *data* and the *synthesis algorithm*, not LLM infrastructure. But AI SDK makes it easier to *operationalize* that moat:

**Layer 3: Prompt Evolution Engine**

AI SDK's `generateObject()` with Zod schemas enables structured resonance data:

```typescript
const { interpretation, keywords, suggestedReflection } = await generateObject({
  model: anthropic('claude-sonnet-4-20250514'),
  schema: z.object({
    interpretation: z.string(),
    keywords: z.array(z.string()),
    suggestedReflection: z.string(),
  }),
  prompt: buildPrompt(context),
});
```

This makes the feedback loop more granular — track which *keywords* resonate, not just whole interpretations.

**Layer 4: Temporal Patterns**

AI SDK's tool calling lets Claude query user history mid-interpretation:

```typescript
const tools = {
  getUserHistory: tool({
    description: 'Get user sighting history for this pattern',
    parameters: z.object({ pattern: z.string() }),
    execute: async ({ pattern }) => getUserPatternHistory(userId, pattern),
  }),
  getCurrentTransits: tool({
    description: 'Get current planetary transits for user',
    execute: async () => getPersonalTransits(userId),
  }),
};
```

Enables interpretations like: *"You've seen 444 three times this month, each during Mercury's transit through your 6th house..."*

### Why Not Now?

1. **Current implementation works** — Clean, tested, ~260 lines
2. **No immediate features require it** — Streaming, structured outputs not on roadmap yet
3. **Avoid premature abstraction** — Add complexity when it provides value
4. **Vercel ecosystem fit** — When ready, migration will be straightforward (same team builds Next.js)

### Cost-Benefit Summary

| Factor | Direct Anthropic SDK | AI SDK |
|--------|---------------------|--------|
| Complexity | Lower | Higher |
| Dependencies | 1 | 2+ |
| Provider lock-in | Yes | No |
| Streaming | Manual | Built-in |
| Structured outputs | Manual JSON | Zod-validated |
| Tool calling | Manual | First-class |

## Consequences

### Positive

- No unnecessary complexity during growth phase
- Current implementation remains simple and maintainable
- Clear trigger for when to revisit (Layer 3/4 development)
- Migration path is well-defined when needed

### Negative

- No streaming UX for interpretations (minor)
- Provider lock-in to Anthropic (acceptable — we're committed to Claude)
- Must revisit this decision when building resonance tracking

## Migration Path (When Ready)

1. Install `ai` package
2. Replace `@anthropic-ai/sdk` with AI SDK's Anthropic provider
3. Refactor `generateInterpretation()` to use `generateText()` or `generateObject()`
4. Add streaming endpoint for real-time interpretation UX
5. Define tools for synthesis graph queries

## Triggers for Revisiting

- Beginning work on resonance/feedback tracking
- Adding streaming interpretation UX
- A/B testing interpretation quality across providers
- Building agentic interpretation features

## References

- [AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- [AI SDK 6 Release](https://vercel.com/blog/ai-sdk-6)
- [AI SDK GitHub](https://github.com/vercel/ai)
- [Current Claude integration](../src/lib/signal/claude.ts)
