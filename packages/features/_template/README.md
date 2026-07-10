# Feature Slice Template

Each feature domain lives in `packages/features/<domain>/`.
Copy this directory, rename `YourDomain` to your domain, and fill in the implementations.

## Directory Structure

```
packages/features/<domain>/
├── types.ts                              # The shapes the slice exposes + private inputs
├── repositories/<Name>Repository.ts      # Data access — Prisma isolated here
└── services/<Name>Service.ts             # Business logic — uses repo, throws ApplicationError
```

## Layer Responsibilities

### `types.ts` — the slice's shapes

The shapes the slice exposes to consumers, plus inputs that stay inside the slice (e.g.
repository query filters). Expose only the fields consumers need — never a raw Prisma row.
How your project organizes shared shapes beyond a single slice is your call — this
template takes no position.

### `repositories/<Name>Repository.ts` — Data Access

Responsibilities (ONLY these):
- Write the `select` inline on each query — favor readability over shared `*_SELECT` constants
- Return the slice's exposed types, never raw Prisma rows
- Accept `PrismaClient` via constructor injection

Rules:
- NO business logic, NO validation, NO orchestration
- Methods return the slice's types or `null` (never throw `ApplicationError`)
- Use explicit `select` clauses, never broad `include`
- Throw only technical errors (e.g. DB connection failure), wrap with context

### `services/<Name>Service.ts` — Business Logic

Responsibilities:
- Validate inputs and enforce business rules
- Throw `ApplicationError` for expected failures
- Orchestrate multiple repository calls when needed

Rules:
- NEVER import from `@repo/trpc`, `@trpc/server`, or `next/navigation`
- NEVER throw `TRPCError` — throw `ApplicationError` (converted automatically by middleware)
- NEVER access `PrismaClient` directly — use the repository

## Step-by-Step: Using This Template

1. **Copy** `packages/features/_template/` → `packages/features/<domain>/`
2. **Replace** `YourDomain` with your domain name in every file and symbol
3. **Define the slice's types** in `types.ts` — only fields the consumer needs
4. **Wire the repository** — write the `select` inline, inject `PrismaClient`
5. **Wire the service** — inject the repository, add business rules, throw `ApplicationError`
6. **Expose via tRPC** — create schema + handler + router in `packages/trpc/server/routers/`
7. **Create the view** — add a client component in `apps/web/views/<domain>/`
8. **Add the route** — create `page.tsx` in `apps/web/app/(app)/<domain>/` with auth gate

## Rules

- `packages/features/**` must NOT import `@repo/trpc` or `@trpc/server`
- Repositories never hold business logic (see `data-repository-pattern.md`)
- Services throw `ApplicationError`, not `TRPCError` (see `quality-error-handling.md`)
- Never expose raw Prisma rows or generated types to consumers
- Use `import type { X }` for type-only imports
- Always use explicit Prisma `select` for performance and security
