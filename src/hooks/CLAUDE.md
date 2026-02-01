# src/hooks/ — React Query Conventions

## All hooks are `"use client"`

Every hook file needs the `"use client"` directive.

## Naming Pattern

| Hook | Purpose | Example |
|------|---------|---------|
| `use<Resources>` | List query | `useSightings()` |
| `use<Resource>` | Detail query | `useSighting(id)` |
| `useCreate<Resource>` | Create mutation | `useCreateSighting()` |
| `useUpdate<Resource>` | Update mutation | `useUpdateSighting()` |
| `useDelete<Resource>` | Delete mutation | `useDeleteSighting()` |

## Query Key Factory

Each feature defines a key factory (see `signal/query-keys.ts`):
```ts
export const sightingKeys = {
  all: ["sightings"] as const,
  lists: () => [...sightingKeys.all, "list"] as const,
  list: (filters: Filters) => [...sightingKeys.lists(), filters] as const,
  details: () => [...sightingKeys.all, "detail"] as const,
  detail: (id: string) => [...sightingKeys.details(), id] as const,
}
```

## Mutations

- Invalidate related queries on success via `queryClient.invalidateQueries()`
- Use optimistic updates for immediate UI feedback where appropriate

## Barrel Exports

Every feature dir has `index.ts` re-exporting all hooks.
