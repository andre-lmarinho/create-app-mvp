---
title: Prevent Circular Dependencies Between Packages
impact: CRITICAL
impactDescription: Prevents build failures, type errors, and keeps the dependency graph acyclic
tags: architecture, dependencies, packages, imports, circular
---

## Prevent Circular Dependencies Between Packages

**Impact: CRITICAL**

Circular dependencies between packages cause build failures, type errors, and make the codebase unmaintainable. The dependency graph must be acyclic, flowing from low-level utilities up to high-level apps.

The dependency hierarchy (from lowest to highest):

```
@repo/lib          (lowest — no feature/trpc dependencies)
  ↓
@repo/database     (Prisma client, schema, generated types)
  ↓
@repo/ui           (generic primitives — depends only on lib/config)
  ↓
@repo/features     (domain slices — repositories, services, hooks, components)
  ↓
@repo/trpc         (routers, handlers)
  ↓
apps/web · apps/landing   (highest — may depend on all packages)
```

**Benefits:**
- **Predictable behavior**: code behaves as the layering suggests — no surprises from circular imports
- **Build reliability**: no circular-dependency errors during compilation or bundling
- **Easier testing**: lower-level packages test in isolation without pulling in the whole tree
- **Clear mental model**: developers reason about the system without tracking hidden cycles

### `@repo/lib`

Lowest layer. Holds cross-cutting utilities like `ApplicationError`.

**Rules:**
1. No file in `@repo/lib` imports from `@repo/features`
2. No file in `@repo/lib` imports from `@repo/trpc` or `@trpc/server`

**Incorrect:**

```typescript
// Bad - lib reaching up into features or trpc
import { UsersRepository } from "@repo/features/auth/repositories/UsersRepository";
import { TRPCError } from "@trpc/server";
```

**Correct:**

```typescript
// Good - lib depends only on itself and external packages
import { ApplicationError } from "@repo/lib/errors";
```

### `@repo/features`

Domain slices. Framework-agnostic: repositories, services, types.

**Rules:**
4. No file in `packages/features/**` imports from `@repo/trpc` or `@trpc/server` (enforced by [quality-error-handling](quality-error-handling.md))
5. No file in `packages/features/**` imports from `apps/web/**` or `apps/landing/**`

**Incorrect:**

```typescript
// Bad - features importing from trpc or an app
import { publicProcedure } from "@repo/trpc/server/trpc";
import { getServerSession } from "../../apps/web/lib/auth";
```

**Correct:**

```typescript
// Good - features import from lib, database, and ui
import { ApplicationError } from "@repo/lib/errors";
import { prisma } from "@repo/database/lib/prisma";
import type { PrismaClient } from "@repo/database/generated/prisma/client";
```

### `@repo/trpc`

**Rules:**
6. No file in `@repo/trpc` imports from `apps/web/**` or `apps/landing/**`

**Correct:**

```typescript
// Good - trpc imports from features, lib, and database
import { UsersRepository } from "@repo/features/auth/repositories/UsersRepository";
import { prisma } from "@repo/database/lib/prisma";
```

## Enforcement

- Prefer direct workspace imports through `@repo/*`; do not introduce barrel files to paper over cycles ([quality-avoid-barrel-imports](quality-avoid-barrel-imports.md)).
- Run `pnpm run typecheck` before pushing — cycles frequently surface as type errors first.
- Flag forbidden import paths in code review.
