# Database

Prisma + PostgreSQL for this bootstrap. For the broader app architecture, see
[`../../ARCHITECTURE.md`](../../ARCHITECTURE.md); for design rationale, see
[`../../docs/decisions.md`](../../docs/decisions.md).

## Folder layout

- `schema.prisma`: source of truth for database models.
- `migrations/`: source of truth for schema evolution (applied in filename order).
- `lib/prisma.ts`: singleton Prisma Client used by server-side modules.
- `generated/`: generated Prisma client output; ignored by Git and rebuilt by `db:generate`.

## Baseline schema

The baseline ships the Better Auth tables managed through Prisma:

- `user`
- `session`
- `account`
- `verification`

Treat these tables as Better Auth storage, not product-domain models. Product
tables should reference `user.id` from separate migrations instead of adding
business state to Better Auth internals.

## Conventions

- Change models in `schema.prisma`, then create a migration in `migrations/`.
- Run `pnpm run db:generate` after schema changes.
- Query through tRPC handlers/services with explicit Prisma `select`/`include`.
- `DATABASE_URL` is server-only; never expose it to browser code.
