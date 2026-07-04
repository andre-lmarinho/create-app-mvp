---
title: Prefer Explicit select over include in Prisma Queries
impact: HIGH
impactDescription: Reduces data transfer and improves query performance
tags: prisma, database, performance, security
---

## Prefer Explicit `select` over `include` in Prisma Queries

**Impact: HIGH (Reduces data transfer and improves query performance)**

Prisma returns every scalar field of a model by default, and `include` pulls in every field of the related model too. Using explicit `select` fetches only the fields you need, improving performance and preventing accidental exposure of sensitive data.

**Incorrect (implicit full-row and broad include):**

```typescript
// Returns ALL scalar fields, including sensitive ones like password hashes and tokens
const user = await prisma.user.findMany();

// include pulls every field of the relation too
const users = await prisma.user.findMany({
  include: { sessions: true },
});
```

**Correct (explicit column selection):**

```typescript
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, emailVerified: true },
});

// With relations — select only the relation fields you need
const usersWithSessions = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    sessions: { select: { id: true, expiresAt: true } },
  },
});
```

**Keep the `select` inline at the query.** Write the projection directly on each query
rather than extracting shared `select` constants. An inline `select` keeps the whole query
readable in one place; a `*_SELECT` constant forces the reader to jump to its definition to
learn which columns load. Accept the small repetition — it reads better than the indirection.

**Benefits:**
- **Performance**: Smaller payloads, faster queries
- **Security**: Prevents accidental exposure of sensitive fields (e.g., password hashes, session/reset tokens)
- **Clarity**: Makes data requirements explicit

**Exception:** Omit `select` only when you genuinely need every scalar field, which is rare. Prefer `select` over `include` in all cases; if you must use `include`, scope it with a nested `select`. Document the reason when you fetch everything.
