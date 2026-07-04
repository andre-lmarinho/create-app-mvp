---
title: Git and CI Workflow
impact: HIGH
impactDescription: Incorrect workflow causes wasted CI cycles and confusion
tags: git, ci, workflow
---

# Git and CI Workflow

## Run Local Checks, Then Push, Then Watch CI

CI runs against the remote repository state, not your local commits. Waiting on CI before pushing is backwards.

**Proper sequence:**
1. Commit locally
2. Run local checks:
- `pnpm run typecheck`
- `npx biome check --write .`
- `pnpm run test` (or the relevant subset)
3. Push to remote
4. Monitor CI status

Do not commit or push unless the user asks. If you are on the default branch, create a feature branch first.

## After Pulling Schema Changes

When you pull changes that touch `packages/database/schema.prisma` or `packages/database/migrations`, regenerate the Prisma Client before typechecking or building so downstream types resolve:

```bash
pnpm run db:generate
```

See [data-prisma-migrations](data-prisma-migrations.md) and [ci-type-check-first](ci-type-check-first.md).

## Never Force Push

**Never force push to `main` or shared branches** — under any circumstances. This is a hard boundary in [CLAUDE.md](../../CLAUDE.md).

## Branch Moves

When asked to move changes to a different branch, use git to move the existing commits rather than redoing the work — it's faster and avoids duplication.
