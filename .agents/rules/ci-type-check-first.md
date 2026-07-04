---
title: Type Check Before Tests
impact: HIGH
impactDescription: Type errors are often the root cause of test failures
tags: ci, typescript, type-check, workflow
---

# Type Check Before Tests

## Priority Order

When fixing a broken build, prioritize type errors before failing tests.

1. Run `pnpm run typecheck` first
2. Fix all TypeScript errors
3. Then run `pnpm run test`

## Why Type Check First

Type errors are often the root cause of test failures. Fixing types first:
- Eliminates cascading failures
- Ensures the code compiles correctly
- Catches issues that tests might miss

This mirrors [testing-incremental](testing-incremental.md): fix types before test failures, one file at a time.

## Stale Prisma Types

If you hit type errors that reference model fields you know exist — missing fields, missing enum members, or a model that "doesn't exist" — regenerate the Prisma Client before debugging further:

```bash
pnpm run db:generate
```

The generated client can lag behind `packages/database/schema.prisma` after a schema edit or a branch switch, and a regenerate usually clears these errors. See [data-prisma-migrations](data-prisma-migrations.md).

## Before Concluding CI Is Unrelated

Always run `pnpm run typecheck` locally before assuming a CI failure is unrelated to your change. Even errors in files you didn't touch can be caused by your change through type inference or shared types.
