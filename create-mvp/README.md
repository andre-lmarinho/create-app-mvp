# @andre.marinho/create-mvp

[![npm version](https://img.shields.io/npm/v/@andre.marinho/create-mvp?color=blue)](https://www.npmjs.com/package/@andre.marinho/create-mvp)
[![license](https://img.shields.io/npm/l/@andre.marinho/create-mvp)](https://github.com/andre-lmarinho/saas-mvp)
[![node](https://img.shields.io/node/v/@andre.marinho/create-mvp)](https://nodejs.org)

Scaffold a production-grade SaaS starter in one command: a Turborepo monorepo with
two Next.js apps, an end-to-end type-safe tRPC API, Prisma + PostgreSQL, Better
Auth, and Tailwind CSS — wired together, tested, and hardened, so you start from a
working skeleton instead of a blank folder.

```bash
npx @andre.marinho/create-mvp my-app
```

## What you get

An infrastructure bootstrap for SaaS MVPs — the generic base is done, the product
domain is deliberately left to you:

- **Next.js 16 (App Router) + React 19** — two independently deployable apps: an
  authenticated `web` app and a public `landing` site that ships no backend code,
  no secrets, and no database access.
- **tRPC 11** — typed API boundary with `public`/`viewer` namespaces, Zod
  validation, superjson, and composable middleware. Add a field to the Prisma
  schema and it's type-checked all the way to the React component.
- **Prisma 7 + PostgreSQL** — schema as the source of truth, fail-fast client
  singleton, and the Better Auth tables shipped as the first migration.
- **Better Auth** — sessions, cookies, sign-in/up/out, and password handling
  already wired through the Prisma adapter.
- **Tailwind CSS 4 + UI kit** — a small, accessible, domain-free component kit
  (Base UI + CVA): buttons, dialogs, toasts, a form kit, and a build-time icon
  sprite.
- **Quality infrastructure** — Biome (lint + format), Vitest, five parallel CI
  jobs with Turbo remote cache, and supply-chain hardening (pinned versions,
  install-script allowlist, new-release cooldown).
- **AI-ready conventions** — machine-readable engineering rules (`.agents/rules/`),
  35 recorded ADRs, and an `AGENTS.md` entry point, so coding agents extend the
  system instead of second-guessing it.

## Requirements

- Node.js `>=22`
- [pnpm](https://pnpm.io) `>=10` (the monorepo requires it; the CLI runs
  `pnpm install` for you)
- A reachable PostgreSQL instance (for the auth flow)

## Usage

```bash
# Scaffold into a new directory
npx @andre.marinho/create-mvp my-app

# Or scaffold into the current directory
npx @andre.marinho/create-mvp .
```

Then:

```bash
cd my-app
cp apps/web/.env.example apps/web/.env.local
cp apps/landing/.env.example apps/landing/.env.local
pnpm run dev
```

`web` starts on `:3000` and `landing` on `:3001`. Point `DATABASE_URL` at your
Postgres instance, set `BETTER_AUTH_SECRET`, and start building.

## How it works

The CLI copies the latest
[`andre-lmarinho/saas-mvp`](https://github.com/andre-lmarinho/saas-mvp) template
via [degit](https://github.com/Rich-Harris/degit) — no git history, no
configuration prompts — removes the installer from the copy, and installs
dependencies with pnpm. What lands in your folder is a plain monorepo you own
entirely; there is no runtime dependency on this package.

## Documentation

The template ships its documentation with the scaffold:

- [Decision records](https://github.com/andre-lmarinho/saas-mvp/blob/main/docs/decisions.md)
  — the ADRs behind the stack (**read first**)
- [Production readiness](https://github.com/andre-lmarinho/saas-mvp/blob/main/docs/production-readiness.md)
  — what's intentionally left out (billing, email, OAuth, i18n, …) and yours to decide
- [Architecture overview](https://github.com/andre-lmarinho/saas-mvp/blob/main/ARCHITECTURE.md)

## License

[MIT](https://github.com/andre-lmarinho/saas-mvp)
