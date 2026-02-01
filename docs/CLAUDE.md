# docs/ — Document Taxonomy

## Directories

| Dir | Contents | Naming |
|-----|----------|--------|
| `prds/` | Product requirement docs | `<feature>.md` |
| `plans/` | Implementation plans | `YYYY-MM-DD-<description>.md` |
| `adr/` | Architecture Decision Records | Numbered (`001-`, `002-`, ...) |
| `ux/` | Voice, tone, personas, design principles | Descriptive names |

## Before Implementing a Feature

1. Check `prds/` for the feature's product spec — note the **Status** field
2. Check `plans/` for existing implementation plans
3. Check `adr/` for relevant architecture decisions
4. Reference `ux/` docs for copy tone and interaction patterns

## PRD Status Values

- **Shipped** — live in production
- **In Development** — actively being built
- **Planned** — specced but not started

## Business Context

Deeper business context (metrics, decisions, strategy) lives in Obsidian vault via MCP:
`Areas/WavePoint/PRDs/`, `Areas/WavePoint/Metrics/`, `Areas/WavePoint/Decisions/`
