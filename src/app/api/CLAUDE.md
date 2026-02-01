# src/app/api/ — API Route Pattern

## Standard Route Structure

```ts
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Rate limit
    const rateLimitResult = await rateLimit(session.user.id)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rateLimitResult.retryAfter) } }
      )
    }

    // 3. Parse + validate
    const body = await req.json()
    const data = mySchema.parse(body)

    // 4. Business logic
    const result = await doThing(data)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

## Conventions

- Schemas from `@/lib/<feature>/schemas` — never define inline
- Rate limit returns 429 with `Retry-After` header
- Wrap everything in outer try/catch returning 500
- JSON parse errors caught by the outer try/catch
