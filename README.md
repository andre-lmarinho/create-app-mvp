<div align="center">



[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![npm](https://img.shields.io/npm/v/@andre.marinho/create-mvp?label=CLI&color=blue)](https://www.npmjs.com/package/@andre.marinho/create-mvp)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1-111111)](https://www.better-auth.com)
[![tRPC](https://img.shields.io/badge/tRPC-11-2596BE?logo=trpc&logoColor=white)](https://trpc.io)

</div>

# Create App MVP

Create App MVP scaffolds a SaaS monorepo with a web app, a public site, starter
authentication, shared packages, and engineering checks. It provides reusable
infrastructure, not a production-ready product.

## Quick start

**Requirements:** Node.js `>=22`, pnpm `>=10`, and a reachable PostgreSQL database
for the authentication flow.

```bash
npx @andre.marinho/create-mvp my-project
cd my-project
cp apps/web/.env.example apps/web/.env.local
cp apps/landing/.env.example apps/landing/.env.local
```

The CLI copies the template and runs `pnpm install`. The generated project contains
`apps/web`, `apps/landing`, `packages/`, `.agents/`, `docs/`, and `specs/`. The CLI
removes its own `create-mvp/` installer directory from that copy.

Before running the database migration, export the same `DATABASE_URL` in your shell
that you will put in `apps/web/.env.local`. Prisma does not read that file.

Set these variables:

- `apps/web/.env.local`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, and
  `BETTER_AUTH_URL`.
- `apps/web/.env.local` and `apps/landing/.env.local`: `NEXT_PUBLIC_APP_URL` and
  `NEXT_PUBLIC_WWW_URL`. Replace the example URLs with the URLs for your
  environment. For local development, blank values use `http://localhost:3000`
  and `http://localhost:3001`.

```bash
pnpm run db:migrate
pnpm run dev
```

The web app starts on port `3000`. The landing app starts on port `3001`. The
scaffold includes a minimal authentication flow and placeholder legal pages.
Add your product domain and integrations, then review
[production readiness](docs/production-readiness.md) before launch.

## What's included

Batteries included — and, just as importantly, a clear line around what is *not*
included so the base stays neutral.

### 🔌 The stack combo, wired end-to-end

Not four libraries in a folder — one integrated, type-safe path from the database to
the browser, already connected:

- **Prisma 7 + PostgreSQL** — schema as the source of truth, a fail-fast
  [client singleton](packages/database/lib/prisma.ts), driver-adapter connection, and
  the Better Auth tables shipped as the first migration.
- **Better Auth** — sessions, cookies, sign-in/up/out, and password handling through
  the Prisma adapter ([`auth.ts`](packages/features/auth/lib/auth.ts)); server reads go
  through [`getServerSession()`](packages/features/auth/lib/getServerSession.ts).
- **tRPC 11** — the typed API boundary with `public` / `viewer` namespaces, superjson,
  Zod validation, and composable middleware for auth, perf logging, and error
  conversion. Client types flow automatically to React via `@repo/trpc/react`. A
  copy-paste [router scaffold](packages/trpc/server/routers/_template) (Zod schema +
  thin handler + step-by-step README) shows exactly how to add a new domain endpoint.
- **TanStack React Query** — the data layer, with a global mutation-error toast so a
  failed call surfaces to the user for free ([`query-client.ts`](apps/web/app/_trpc/query-client.ts)).
- **`ApplicationError`** — semantic errors (`NOT_FOUND`, `CONFLICT`, …) raised in
  feature code with no tRPC dependency, converted to `TRPCError` exactly once at the
  edge ([`ApplicationError.ts`](packages/lib/errors/ApplicationError.ts)).

The result: add a field to `schema.prisma`, and it's type-checked all the way to the
React component that renders it.

### 🌐 Two apps, two URLs

One monorepo, two independently deployable surfaces — so the public site never ships
your database or auth code:

| App | URL | Port | Responsibility |
| --- | --- | --- | --- |
| [`apps/web`](apps/web) | `app.example.com` | 3000 | Authenticated app: auth pages, tRPC API, Better Auth routes |
| [`apps/landing`](apps/landing) | `www.example.com` | 3001 | Public marketing site + legal pages, zero backend surface |

- **`landing` carries no secrets** — it doesn't depend on `@repo/features`,
  `@repo/trpc`, `@repo/database`, `better-auth`, or `prisma`. Smaller bundle, smaller
  attack surface.
- **Cross-app auth without coupling** — landing learns whether a visitor is signed in
  by calling web's [`/api/auth/status`](apps/web/app/api/auth/status/route.ts)
  (CORS-locked, credentialed, leaks no user data).
- **One URL contract** — [`@repo/lib/urls`](packages/lib/urls/index.ts) is the single
  client-safe place that assembles cross-app links, so origins live in one module.

### 🎨 UI infrastructure

A small, accessible, domain-free design kit in [`packages/ui`](packages/ui) — generic
primitives both apps share, built on **Base UI + class-variance-authority + `cn`**:

- **Components** — [`Button`](packages/ui/components/button/Button.tsx) (a
  discriminated union of native/anchor/icon), `Dialog`, `Popover`, `Tooltip`, `Toast`,
  and a [form kit](packages/ui/components/form) (`Input`, `TextField`, `Label`,
  `InputError`, `HintOrErrors`) that centralizes labels, errors, and accessibility.
- **Build-time icon sprite** — [`build-icons.mjs`](packages/ui/scripts/build-icons.mjs)
  extracts an allowlist from `lucide-static` into one cacheable `sprite.svg` and a
  type-safe `IconName` union. Zero per-icon runtime; unknown names fail typecheck.
- **Imperative toast manager** — lets non-React code (the query client) raise toasts,
  which is what powers the global mutation-error toast above.
- **Tailwind v4 shared theme** — one [`theme.css`](packages/tailwind-config/theme.css)
  with design tokens imported by both apps. Neutral palette, meant to be rebranded.

### 🤖 AI / agent infrastructure

This repo is built to be driven by coding agents (Claude Code, Cursor, …) as
first-class contributors — the conventions are machine-readable, not just prose:

- **[AGENTS.md](AGENTS.md)** (symlinked as `CLAUDE.md`) — the entry-point engineering
  guide: the Do/Don't list, boundaries, and command reference agents read first.
- **[.agents/rules/](.agents/rules/)** — 32 modular, tagged rule files grouped by
  section ([`_sections.md`](.agents/rules/_sections.md)): architecture, quality, data,
  api, performance, testing, patterns, culture, ci, reference. Each is a focused,
  linkable standard an agent (or human) can cite in review.
- **[docs/decisions.md](docs/decisions.md)** — 35 ADRs recording *why* each choice was
  made, so an agent extends the system instead of second-guessing it.
- **[.agents/commands.md](.agents/commands.md)** + **[specs/](specs/)** — a verified
  command list and an opt-in spec-driven workflow for larger features.

### 🛡️ Quality & supply-chain hardening

- **Biome** — one tool for lint + format ([`biome.json`](biome.json)); no ESLint +
  Prettier split. The `noExplicitAny` rule enforces the "never `as any`" boundary.
- **Hardened dependency policy** — [`pnpm-workspace.yaml`](pnpm-workspace.yaml) pins
  exact versions, whitelists which packages may run install scripts, and blocks
  releases newer than 7 days; [`check-package-security.mjs`](scripts/check-package-security.mjs)
  asserts all of it as the **first CI job**.
- **CI + caching** — five parallel GitHub Actions jobs (install/security, lint,
  typecheck, unit, build) with Turbo remote cache and PR-affected app builds.
- **Vitest + Husky** — one unit-test project across the graph, plus a `lint-staged`
  pre-commit hook.

### 🧭 What's intentionally *not* included

So the base stays a wildcard, these are left as **product decisions**, not gaps —
see [production-readiness.md](docs/production-readiness.md): email transport,
OAuth providers, multi-tenancy, billing, file storage, rate limiting, error
tracking/APM, i18n, and background jobs. Add the ones your product needs; skip the
ones it doesn't.

## How it compares

This is an **infrastructure bootstrap, not a finished SaaS**: it wires up the generic
base — the stack, the two apps, CI, the guardrails — and leaves the product domain to
you. That puts it in a different category from boilerplates that ship billing, teams, and
an admin out of the box. Each solves a different problem; the right pick depends on what
you're building.

| Project | Category | Monorepo | Best for |
| --- | --- | --- | --- |
| [create-t3-app](https://github.com/t3-oss/create-t3-app) | Modular typesafe CLI | ❌ | Spinning up a typesafe Next.js app fast |
| [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) | T3 in a monorepo | ✅ | Web + mobile (Expo) sharing one API |
| [nextjs/saas-starter](https://github.com/nextjs/saas-starter) | Reference SaaS | ❌ | Seeing a Stripe SaaS running today |
| [next-forge](https://github.com/vercel/next-forge) | Full Turborepo SaaS | ✅ | Many integrations wired from day one |
| **this repo** | Neutral infra base | ✅ | A clean, isolated base to build on |

Where it tends to help, when the base matters more than the feature inventory:

- **Two isolated apps** — `landing` ships no backend, no secrets, no `@repo/database`.
- **Supply-chain hardening** — pinned versions, an install-script allowlist, and a block
  on freshly published releases, all checked as the first CI job.
- **Recorded decisions** — the ADRs in [docs/decisions.md](docs/decisions.md) and the
  engineering rules in [.agents/rules/](.agents/rules/), written with agent-assisted
  development in mind.
- **Current stack** — Next 16, TypeScript 6, Prisma 7, tRPC 11, Biome.

The flip side of that neutrality: what's left out is a product decision, not a hidden gap
— billing, email, OAuth, i18n, multi-tenancy, and the like are catalogued in
[docs/production-readiness.md](docs/production-readiness.md). And being new and lean, it
doesn't have the community or track record of something like create-t3-app.

## Commands

| Command                                | What it does                                |
| -------------------------------------- | ------------------------------------------- |
| `npx @andre.marinho/create-mvp <name>` | Scaffolds a fresh copy in `<name>/`         |
| `pnpm run dev`                         | Starts `web` (:3000) and `landing` (:3001) |
| `pnpm run build`                       | Production build of both apps               |
| `pnpm run typecheck`                   | Type checking (`tsc --noEmit`)              |
| `pnpm run lint`                        | Lint with Biome                             |
| `pnpm run lint:fix`                    | Lint + format with auto-fix                 |
| `pnpm run test`                        | Unit tests (Vitest)                         |
| `pnpm run db:generate`                 | Generates the Prisma Client                 |
| `pnpm run db:migrate`                  | Applies/creates Prisma migrations           |
| `pnpm run db:studio`                   | Opens Prisma Studio                         |

## Structure

The CLI removes its installer directory from the generated project.

```text
apps/
  web/             Authenticated app: auth pages, tRPC API, auth status
  landing/         Marketing site + legal pages
packages/
  features/        Domains, starting with auth
  trpc/            Routers and procedures
  database/        Prisma schema and migrations
  lib/             Cross-cutting utilities
  ui/              UI primitives and form kit
  tailwind-config/ Shared Tailwind theme
  tsconfig/        Shared TypeScript config
.agents/           Machine-readable rules and command reference
docs/              Architecture documentation and ADRs
specs/             Opt-in spec-driven workflow
scripts/           Operational scripts
```

Responsibility boundaries: `apps/*/app` stays thin (routes, layouts, providers,
page-level auth checks); `packages/features` holds the domain logic;
`packages/trpc` is the typed backend boundary.

## Documentation

- [docs/decisions.md](docs/decisions.md) — the 35 ADRs behind this template (**read first**)
- [docs/production-readiness.md](docs/production-readiness.md) — what to handle before shipping to production
- [ARCHITECTURE.md](ARCHITECTURE.md) — current architecture overview of the repository
- [AGENTS.md](AGENTS.md) — engineering guide and conventions for agents
- [.agents/rules/](.agents/rules/) — modular engineering rules
- [packages/database/README.md](packages/database/README.md) — database and migrations

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org).
- **PRs** small and focused (< 500 lines, < 10 files).
- Run `pnpm run typecheck` and `pnpm run lint:fix` before pushing.
