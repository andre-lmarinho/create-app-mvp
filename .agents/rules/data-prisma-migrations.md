---
title: Prisma Schema and Migrations
impact: HIGH
impactDescription: Schema changes affect all downstream code and deployments
tags: prisma, database, migrations, schema
---

# Prisma Schema and Migrations

The schema is the source of truth at `packages/database/schema.prisma`; migrations live in `packages/database/migrations`. Both are gated in [CLAUDE.md](../../CLAUDE.md) under "Ask first" — confirm before changing them.

## After Schema Changes

After editing `packages/database/schema.prisma`, regenerate the Prisma Client so TypeScript types stay in sync:

```bash
pnpm run db:generate
```

Run this especially:
- After adding, renaming, or removing fields on a model
- After pulling changes that touch the schema or migrations
- When type errors reference stale model shapes (a regenerate often resolves them before you debug further)

The generated client lands in `packages/database/generated/` and is a generated artifact — never edit it by hand.

## Creating Migrations

```bash
# Create and apply a development migration
pnpm run db:migrate --filter @repo/database -- --name migration_name

# Create the SQL without applying it (for review or manual edits)
pnpm run db:migrate --filter @repo/database -- --create-only --name migration_name
```

`db:migrate` wraps `prisma migrate dev --config prisma.config.ts`, so flags pass through after `--`.

## Timestamp Fields

When adding `createdAt` / `updatedAt` fields:
- Use `@default(now())` for `createdAt` on new rows.
- Use `@updatedAt` on `updatedAt` so Prisma bumps it on every write.
- If existing rows should stay null, do **not** set a default — only new rows should get timestamps automatically.

## Keep Migration History Clean

- One focused migration per logical change; give it a descriptive `--name`.
- While iterating on a not-yet-merged feature, consolidate throwaway migrations rather than shipping a trail of half-steps. See the [Prisma squashing guide](https://www.prisma.io/docs/orm/prisma-migrate/workflows/squashing-migrations).
- Never edit a migration that has already been applied to a shared or production database — add a new one instead.

## Order of Operations

Update the schema and generate the migration **first**, then write the application code that depends on the new fields. Writing code against fields that don't exist yet produces confusing type errors.
