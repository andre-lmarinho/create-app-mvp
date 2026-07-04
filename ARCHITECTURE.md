# Architecture Overview

This is an infrastructure bootstrap: a Turborepo monorepo with two Next.js apps,
a tRPC API boundary, Prisma for PostgreSQL, and Better Auth for identity. It
ships an authentication skeleton and the minimal Better Auth tables — domain
features, tables, and integrations are added per project.

For design rationale and trade-offs, see [`docs/decisions.md`](docs/decisions.md).

## 1. Project Structure

```text
apps/
  web/                  # Authenticated app: auth pages, API routes (tRPC, auth status)
  landing/              # Public marketing/landing app
packages/
  features/             # Vertical domain slices (baseline: auth)
  trpc/                 # tRPC routers, procedures, server context + React client
  database/             # Prisma schema, migrations, generated client
  ui/                   # Generic UI primitives + class-merge utility
  lib/                  # Cross-cutting helpers (e.g. ApplicationError)
  tailwind-config/      # Shared Tailwind config
  tsconfig/             # Shared TypeScript config
```

- `packages/ui` is generic UI; it should not accumulate domain business rules.
- Features talk to each other through public exports, not internal paths.

## 2. Core Components

### 2.1. Web App (`apps/web`)

Authenticated surface. Runs on port 3000. Contains:

- `app/(auth)/*`: login and signup.
- `app/page.tsx`: page-level auth gate + server bootstrap.
- `app/providers.tsx` + `app/_trpc/*`: tRPC client, React Query, auth provider.
- `app/api/trpc/[trpc]/route.ts`: tRPC Route Handler.
- `app/api/auth/status/route.ts`: cross-app auth check the landing app can call.

### 2.2. Landing App (`apps/landing`)

Public marketing site. Runs on port 3001. Intentionally avoids the tRPC/backend
surface. It can check whether a visitor is signed in by calling the web app's
`/api/auth/status` with credentials.

### 2.3. tRPC API (`packages/trpc`)

The typed backend boundary. The root router exposes two namespaces:

- `public`: unauthenticated procedures (baseline: `auth`, e.g. signup).
- `viewer`: authenticated procedures (empty baseline — add your domains here).

Key files:

- `server/routers/_app.ts`: root router.
- `server/createContext.ts`: validates the Better Auth session, builds request context.
- `server/procedures/publicProcedure.ts`: base procedure with error-conversion middleware.
- `server/procedures/authedProcedure.ts`: requires an authenticated user.

### 2.4. Domain Features (`packages/features`)

Business logic organized by domain, not by technical layer. Each slice holds its
server logic, hooks, tests, and types. The
baseline ships one slice, `auth`, as the template for how a feature is built.

## 3. Data Stores

### 3.1. PostgreSQL + Prisma

Schema evolution lives in `packages/database/schema.prisma` and
`packages/database/migrations`. The baseline ships the Better Auth tables:
`user`, `session`, `account`, and `verification`. Add domain models per project.

Data-access pattern:

- Server modules import the singleton Prisma client from `@repo/database/lib/prisma`.
- Use explicit Prisma `select`/`include` for user-facing reads.
- Keep business rules in feature/server modules, not in database helpers.
- `DATABASE_URL` is server-only and never reaches browser code.

### 3.2. Better Auth

Manages users, sessions, sign-in, sign-up, sign-out, and password reset through
the Prisma adapter.

- `getServerSession()` verifies SSR sessions.
- `createContext()` validates each tRPC request.
- `AuthProvider` tracks browser session state.

### 3.3. Runtime Cache / Queue

No Redis, durable queue, or separate cache service. Client API caching is handled
by TanStack React Query.

## 4. External Integrations

### Database/Auth

PostgreSQL via Prisma and Better Auth's Prisma adapter. `DATABASE_URL` and
`BETTER_AUTH_SECRET` are server-only.

### Vercel

Hosting, Node runtime, analytics, and speed insights via `@vercel/analytics` and
`@vercel/speed-insights`.

## 5. Deployment

Two Vercel deployments from one monorepo:

| App           | Build              | Dev port |
| ------------- | ------------------ | -------- |
| `apps/web`     | `pnpm run build:web`     | 3000 |
| `apps/landing` | `pnpm run build:landing` | 3001 |

Turborepo caches builds; on PRs, only affected apps are built.

## 6. Security

- Authorization checks live in `page.tsx` / server components, never in `layout.tsx`.
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, and provider secrets stay server-side.
- tRPC `authedProcedure` is the application authorization boundary.
- Domain tables should model ownership explicitly and enforce access in server modules.

## 7. Development & Testing

- `pnpm run dev`: run both apps. `pnpm run dev:web` / `pnpm run dev:landing` for one.
- `pnpm run typecheck`: type-check all packages.
- `pnpm run lint`: Biome.
- `pnpm run test`: Vitest unit project.
- `pnpm run db:generate`: generate Prisma Client.
- `pnpm run db:migrate`: create/apply Prisma migrations.
- `pnpm run db:studio`: inspect local data with Prisma Studio.

## 8. Environment

App-local env files: `apps/web/.env.local` and `apps/landing/.env.local`. The web
app needs `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`; both apps
share `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_WWW_URL` for cross-app linking. See
each app's `.env.example`.
