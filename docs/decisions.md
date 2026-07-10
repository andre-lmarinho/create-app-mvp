# Bootstrap Decisions

The record of the architecture and code decisions that shape this template. It is the
**"why"** layer: read it before adopting the bootstrap as a baseline.
[`ARCHITECTURE.md`](../ARCHITECTURE.md) describes the current **"what"** (layout, ports,
data stores); this file explains the trade-offs behind it.
[`production-readiness.md`](production-readiness.md) is the **"what's left for you"** layer —
the cross-cutting concerns to handle before shipping a real product.

Each entry keeps only what was **decided** and its **consequences** — the alternatives
that were weighed are intentionally omitted. Decisions are grounded in code and
configuration actually present in the repo; where the baseline ships a *convention* with
no implementation yet, it is flagged as such.

## Index

| # | Decision |
|---|----------|
| **Foundation & Tooling** ||
| ADR-001 | Turborepo + pnpm workspaces monorepo |
| ADR-002 | Prisma + Better Auth + tRPC as the default base |
| ADR-003 | Two Next.js apps: authenticated `web` + public `landing` |
| ADR-004 | Thin App Router entrypoints; views in `views/` |
| ADR-005 | Shared strict TypeScript configs + path aliases |
| ADR-006 | Acyclic package graph, direct imports, no wide barrels |
| ADR-007 | Biome as the single lint + format tool |
| ADR-008 | Husky + lint-staged pre-commit |
| ADR-009 | Hardened dependency policy verified in CI |
| ADR-010 | Parallel CI + Turbo remote cache + affected builds |
| ADR-011 | Environment & deployment: app-local env, server-only vs public, Vercel |
| ADR-035 | Public legal documents live in the landing app |
| ADR-036 | Cross-app URL helpers in `@repo/lib` |
| **Data & Identity** ||
| ADR-012 | Prisma + PostgreSQL via driver adapter and generated client |
| ADR-013 | Prisma client singleton, fail-fast, server-only |
| ADR-014 | Baseline schema limited to Better Auth tables |
| ADR-015 | Better Auth as the identity system |
| ADR-016 | Auth as the first vertical slice |
| ADR-017 | Prisma isolated behind repositories; `select` over `include`; shape conventions left open |
| **API Layer (tRPC)** ||
| ADR-018 | tRPC as the typed API boundary (superjson, `public`/`viewer`) |
| ADR-019 | Per-request context from the Better Auth session |
| ADR-020 | Procedure composition via middleware |
| ADR-021 | `ApplicationError` in `@repo/lib` + conversion middleware |
| ADR-022 | Minimal tRPC observability |
| ADR-023 | In-process `serverCaller` for SSR |
| ADR-024 | Better Auth native flows for login/signup/signout |
| **Client & UI** ||
| ADR-025 | React Query data layer: global toast + conditional retry |
| ADR-026 | Client-side auth composition (providers, context, forms) |
| ADR-027 | Generic UI package: Base UI + CVA + `cn` |
| ADR-028 | Icon system as a build-time SVG sprite |
| ADR-029 | Tailwind v4 with a shared CSS theme |
| ADR-030 | Cross-app auth via `/api/auth/status`; per-app error pages |
| **Security, Testing & Governance** ||
| ADR-031 | Page-level authorization (never in layouts) |
| ADR-032 | Vitest single unit project |
| ADR-033 | `.agents/` rules + spec-driven ADRs as governance |

---

# Foundation & Tooling

## ADR-001: Turborepo + pnpm workspaces monorepo

### Context

The product has two deployable surfaces that share types, UI, and auth but ship
independently. A single package couples deploys; separate repos force publishing the
shared contract.

### Decision

Use **Turborepo + pnpm workspaces**. `pnpm-workspace.yaml` globs `apps/*` and
`packages/*`; `turbo.json` defines the `build`/`typecheck`/`dev` graph with topological
`dependsOn: ["^build"]`. The root delegates to packages via `turbo run` and owns
repo-wide tasks (`test`, `security:package`, `db:*`). Internal packages are linked as
`workspace:*` and namespaced `@repo/*`.

### Consequences

- Shared code is imported directly through `@repo/*` with no publish step; a contract and
  its consumers change in one PR.
- The package dependency graph drives typecheck, build, and cache.
- Apps deploy independently without duplicating internal packages.

## ADR-002: Prisma + Better Auth + tRPC as the default base

### Context

This bootstrap is tRPC-first: the UI talks to tRPC, server modules own product
authorization, and the database needs a consistent interface for schema, migrations,
seeds, transactions, and tests. Product schemas change per project, so the baseline does
not assume domain entities — it ships reusable infrastructure plus one example slice
(`auth`).

### Decision

Use **Prisma** for persistence (with `schema.prisma` as the source of truth), **Better
Auth** for authentication/sessions through the Prisma adapter, and **tRPC** as the typed
contract between UI and server. Product authorization stays in server/tRPC modules; the
database protects invariants with constraints, indexes, and foreign keys.

### Consequences

- Users, sessions, external accounts, and future domain records live in the same
  relational database; migrations, seeds, Studio, and transactions run through Prisma.
- The bootstrap handles sessions, cookies, verification, and expiration; product domain
  models are added per project.
- The baseline ships only the Better Auth tables (`user`, `session`, `account`,
  `verification`) — see ADR-014.

## ADR-003: Two Next.js apps — authenticated `web` + public `landing`

### Context

The marketing site is public and cacheable with no backend needs; the app is
authenticated and owns the API. Bundling them couples deploys and bloats the public site.

### Decision

Ship two Next.js 16 apps: `apps/web` (port 3000 — auth pages, tRPC + Better Auth routes,
auth status) and `apps/landing` (port 3001 — marketing only). `landing` does **not**
depend on `@repo/features`, `@repo/trpc`, `@repo/database`, `better-auth`, or `prisma`;
it uses `@repo/lib` (client-safe URL helpers, ADR-036), `@repo/tailwind-config`,
`@vercel/analytics`, and `@vercel/speed-insights`.
Each app has its own build script, env, and Vercel deployment, with distinct
`@repo/web#build` / `@repo/landing#build` entries in `turbo.json`.

### Consequences

- The landing bundle never ships database/auth code or secrets; its build surface and
  attack surface are smaller.
- Anything shared between apps must live in `packages/*`, reinforcing ADR-006 and ADR-016.
- Landing learns auth state only through the web app's status endpoint (ADR-030).

## ADR-004: Thin App Router entrypoints; views in `views/`

### Context

Route files can accumulate transport, data, and presentation until they become large,
untestable modules.

### Decision

Keep `app/*` thin — routing, metadata, providers, redirects, and API handlers only. Page
UI lives in `apps/web/views/*` and `apps/landing/views/*` (reached via the `~/*` alias),
and reusable primitives live in `packages/ui`. On web, `app/layout.tsx` mounts global
providers and `app/page.tsx` performs the auth gate; on landing, `app/page.tsx` renders
`views/HomeView.tsx`.

### Consequences

- A route reveals at a glance which gates and providers apply.
- Client-side views import hooks/components without turning layouts into rule sites.
- Business logic stays out of route handlers; future tRPC handlers and pages must stay
  thin too.

## ADR-005: Shared strict TypeScript configs + path aliases

### Context

Seven packages and two apps each need a `tsconfig`; drift causes inconsistent strictness
and resolution.

### Decision

Centralize config in **`@repo/tsconfig`** with three presets: `base.json` (ES2022,
`moduleResolution: bundler`, `isolatedModules`, `strict`, `noEmit`, `@repo/*` paths),
`react-library.json` (DOM + React JSX + test types), and `nextjs.json` (adds the Next
plugin). Apps extend these and add a local `~/*` alias (`./views/*` in both apps).
`vitest.config.ts` mirrors the `@repo/*` aliases.

### Consequences

- `strict` and the "never `as any`" rule are uniform across the whole graph.
- `@repo/*` resolves identically in tsc, Next, and Vitest; `~/*` separates app-local code
  from shared packages.

## ADR-006: Acyclic package graph, direct imports, no wide barrels

### Context

Unmanaged imports produce cycles that break builds and type inference, and wide barrel
`index.ts` files defeat tree-shaking.

### Decision

Enforce a layered, acyclic hierarchy — `lib → database → ui → features → trpc → apps`.
`packages/features/**` must not import `@repo/trpc`/`@trpc/server`; `@repo/lib` must not
reach up into features/trpc. Import concrete source files
(`@repo/ui/components/button/Button`), not wide barrels. Small per-component/per-folder
`index.ts` inside a package are acceptable (e.g. `ui/components/form`,
`lib/errors`); repo-wide `@repo/*` barrels are not.

### Consequences

- The layering is real: `ApplicationError` lives in `@repo/lib` precisely so features can
  describe failures without depending on tRPC (ADR-021).
- Cycles surface as type errors in `pnpm typecheck` before merge; the reader sees exactly
  which seam is consumed.

## ADR-007: Biome as the single lint + format tool

### Context

Linting + formatting via ESLint + Prettier means two toolchains, two configs, and slower
CI.

### Decision

Use **Biome** as the one tool for both. [`biome.json`](../biome.json): 110-col width,
2-space indent, double quotes, ES5 trailing commas, React `recommended` domain, CSS
parser with Tailwind directives. Test files relax `noExplicitAny`/`noImgElement`. Code
review skips style since Biome owns it.

### Consequences

- `pnpm lint` / `lint:fix` cover lint + format; CI has one `lint` job.
- The `noExplicitAny` rule reinforces the "never `as any`" boundary in `AGENTS.md`.

## ADR-008: Husky + lint-staged pre-commit

### Context

Style/lint failures caught only in CI waste a round-trip.

### Decision

Run a Husky `pre-commit` hook (`npx lint-staged`) that applies
`biome check --write --no-errors-on-unmatched` to staged files. Setup is opt-in
(`pnpm exec husky init`).

### Consequences

- Commits are auto-formatted before leaving the machine; CI `lint` becomes a backstop.

## ADR-009: Hardened dependency policy verified in CI

### Context

`pnpm install` can execute arbitrary lifecycle scripts and pull freshly-published,
potentially compromised versions. A bootstrap others adopt should be safe by default and
verifiably so.

### Decision

Encode a defensive policy in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml):
`allowBuilds` whitelists exactly which packages may run install scripts
(`@prisma/engines`, `esbuild`, `prisma`, `sharp`); `minimumReleaseAge: 10080` (7 days,
strict) blocks brand-new releases; `saveExact: true` pins versions; `lockfile: true`.
[`scripts/check-package-security.mjs`](../scripts/check-package-security.mjs) asserts all
of this plus exact-semver deps and a pinned `packageManager`, and runs as the first CI
job (`security:package`).

### Consequences

- A supply-chain attack has a ≥7-day detection window before it can resolve here.
- New dependencies require an exact version and, if they need build scripts, an explicit
  `allowBuilds` entry — matching the "Ask first: adding dependencies" boundary.

## ADR-010: Parallel CI + Turbo remote cache + affected builds

### Context

CI must gate quality without becoming the bottleneck as the monorepo grows.

### Decision

Run five independent GitHub Actions jobs — `install` (also runs `security:package`),
`lint`, `typecheck`, `unit`, `build` — with `concurrency` cancel-in-progress. Turbo remote
cache is enabled globally (`TURBO_TOKEN`/`TURBO_TEAM`). On pull requests, build scopes to
`turbo run build --filter=./apps/* --affected` (with `fetch-depth: 0`); on `main` it
builds everything. Each app's `build` task declares its exact `env` allowlist so cache
keys stay correct.

### Consequences

- Failures are isolated by category; PRs skip unaffected app builds.
- Correct caching depends on the `turbo.json` `env` lists staying in sync with real usage.

## ADR-011: Environment & deployment — app-local env, server-only vs public, Vercel

### Context

Next.js exposes `NEXT_PUBLIC_*` to the browser; secrets must never leak, and Turbo needs
to know which variables affect each app's cache.

### Decision

Use **app-local** `.env.local` files (never committed; `.env.example` is). `DATABASE_URL`,
`BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are **server-only** (web only);
`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_WWW_URL` are the only intentionally client-visible
values and are shared by both apps for cross-app links and CORS. `turbo.json` lists each
task's `env` explicitly. Prisma loads env via `dotenv/config` in `prisma.config.ts`.
Deploy target is **Vercel** — two projects from one monorepo, with light observability
(`@vercel/analytics`, `@vercel/speed-insights`) mounted on landing.

### Consequences

- Landing never receives `DATABASE_URL`/`BETTER_AUTH_SECRET`.
- Changing an app's `.env*` invalidates only that app's build; new build-time env vars
  must be added to `turbo.json`.
- `NEXT_PUBLIC_WWW_URL` drives the status endpoint's CORS (ADR-030); `NEXT_PUBLIC_APP_URL`
  drives landing's "Open app" link.

## ADR-035: Public legal documents live in the landing app

### Context

Privacy Policy and Terms of Use are a baseline requirement for any product, but they are
public, static, cacheable pages with no backend needs — while `web` is the authenticated
app that owns the API and secrets (ADR-003). Placing them in `web` would ship legal prose
behind the auth surface and couple it to the app deploy; the reference stacks surveyed
either co-locate the pages with marketing (Rallly) or link out to an external site
(Cal, Plane).

### Decision

Serve legal documents from the **landing** app. Two static routes under the `(legal)`
group — `app/(legal)/privacy-policy/page.tsx` and `.../terms-of-use/page.tsx` — are thin
server components that delegate to content components
([`PrivacyContent`](../apps/landing/views/legal/_content/PrivacyContent.tsx),
[`UseContent`](../apps/landing/views/legal/_content/UseContent.tsx)) rendered as semantic
HTML inside a Tailwind Typography `prose` article (ADR-029). The landing
[`Footer`](../apps/landing/views/layout/Footer.tsx) links to both as same-app navigation;
the web [`SignupView`](../apps/web/views/auth/SignupView.tsx) references them cross-origin
through `NEXT_PUBLIC_WWW_URL` (ADR-011) in an "By creating an account, you agree to…"
consent line. Content is single-language placeholder text, explicitly flagged to be
replaced with reviewed copy before publishing; a separate Cookie Policy page and consent
banner are deferred, with cookie/analytics disclosure folded into the Privacy page until
non-essential cookies are introduced.

### Consequences

- Legal content ships with the public marketing bundle, inherits landing's static caching,
  and never sits behind the authenticated app or its secrets (ADR-003).
- The only cross-app coupling is a URL: web builds the consent links from
  `NEXT_PUBLIC_WWW_URL`, so the documents have one canonical home that both apps point at
  (ADR-011, ADR-030). That variable must be set per environment or the signup links resolve
  against the app origin and 404.
- Current copy is placeholder that must be replaced with legal text reviewed for the
  operator's entity and jurisdiction before publishing — one of the adopter caveats in
  [`production-readiness.md`](production-readiness.md).

## ADR-036: Cross-app URL helpers in `@repo/lib`

### Context

The two apps sit at two public origins and link to each other — `landing` → `web` for
login/signup CTAs, `web` → `landing` for the legal pages (ADR-035). The origins already
exist as `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_WWW_URL` (ADR-011), but callers assembled
links inline (`${env}/signup`, trailing-slash `.replace`), duplicating the same
normalization across both apps.

### Decision

Add a small, client-safe module — [`@repo/lib/urls`](../packages/lib/urls/index.ts) — that
treats the two origins as one contract. It exports the resolved origins `APP_URL` / `WWW_URL`
(protocol-normalized, falling back to `localhost:3000` / `:3001`) for callers that need the
bare origin — Better Auth `baseURL` and the auth-status CORS header — plus `appUrl(path)` /
`wwwUrl(path)` helpers that build absolute links with `new URL()` and strip the trailing
slash, used for the landing CTAs and the signup consent links. Cross-origin links render as
plain `<a>`, not `next/link`, because navigation leaves the current app. Heavier patterns the
analysis surfaced — edge redirects for wrong-domain routes, a `redirectTo` allowlist,
short-URL origins, and cross-subdomain session cookies — are deferred until a real need.

### Consequences

- URL assembly (protocol, trailing slash, path joining) lives in one lowest-layer module;
  the four call sites just import it, keeping features free of origin plumbing (ADR-006).
- The module reads only `NEXT_PUBLIC_*`, so it is client-safe and both apps import it without
  pulling in server code.
- The two origins stay the single contract between apps; `web` never depends on `landing` at
  runtime, only on a public URL (extends ADR-030).
- Open-redirect safety is not wired because no `redirectTo` / `callbackUrl` crosses origins
  yet; add an origin allowlist with the first such flow — tracked in
  [`production-readiness.md`](production-readiness.md).

---

# Data & Identity

## ADR-012: Prisma + PostgreSQL via driver adapter and generated client

### Context

The stack needs a consistent interface for schema, migrations, seeds, transactions, and
tests, integrated with the Better Auth adapter. Prisma 7 changes client generation and
connection.

### Decision

Use **Prisma 7 + PostgreSQL** with the `prisma-client` generator (output
`./generated/prisma`, `importFileExtension = "ts"`) and the `@prisma/adapter-pg` driver
adapter. `schema.prisma` is the schema source of truth; `packages/database/migrations` is
the source of truth for evolution. `prisma.config.ts` sets `schema` and `migrations.path`.
Models map to lowercase tables via `@@map` (`user`, `session`, …); migrations are named
`YYYYMMDDHHMMSS_description`. `db:generate` is wired into `dev`, `test`, and the package
`build`/`typecheck` so generated types never go stale.

### Consequences

- The generated client is a first-class in-repo artifact (git-ignored, rebuilt in
  CI/local), never hand-edited.
- Any schema edit requires `pnpm db:generate`; raw SQL uses snake_case table names.

## ADR-013: Prisma client singleton, fail-fast, server-only

### Context

Next.js dev HMR re-imports modules; a fresh `PrismaClient` per import exhausts Postgres
connections.

### Decision

Export a module **singleton** from [`lib/prisma.ts`](../packages/database/lib/prisma.ts):
reuse `globalThis.prisma` when present, assign the global only when
`NODE_ENV !== "production"`, and **throw immediately** if `DATABASE_URL` is missing. The
client is constructed with `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
`@repo/database` is imported only by server-only packages (`@repo/features`,
`@repo/trpc`); no `"use client"` file imports it.

### Consequences

- One pooled client per process in prod; a stable reused client across HMR in dev.
- Env misconfiguration fails early and loudly; `DATABASE_URL` never reaches the browser.

## ADR-014: Baseline schema limited to Better Auth tables

### Context

Product schemas differ per project, so the bootstrap must not presume domain entities.

### Decision

Ship only the Better Auth tables — `user`, `session`, `account`, `verification` — with
`onDelete: Cascade` FKs and indexes on `session.userId`/`token` and `account.userId`. The
single initial migration documents exactly this. Product models are added per project in
later migrations and should reference `user.id` for ownership.

### Consequences

- The bootstrap is neutral: no tenant, workspace, billing, or domain objects assumed.
- Business state must not be added to Better Auth's internal tables without a clear reason.

## ADR-015: Better Auth as the identity system

### Context

The bootstrap needs users, sessions, and sign-in/up/out over the same Prisma store,
without hand-rolling security-critical auth.

### Decision

Use **Better Auth** via its Prisma adapter
([`auth.ts`](../packages/features/auth/lib/auth.ts)): `emailAndPassword` enabled with
`autoSignIn: true` and `minPasswordLength: 6`, the `nextCookies()` plugin, and `baseURL`
from `BETTER_AUTH_URL ?? APP_URL` (`@repo/lib/urls`, ADR-036). HTTP endpoints are
mounted through `toNextJsHandler(auth)` at the catch-all `app/api/auth/[...all]/route.ts`
(`runtime: "nodejs"`). Server reads go through `getServerSession()`.

### Consequences

- Sessions, cookies, verification, and expiry are the library's responsibility; signup
  auto-signs-in.
- Future policies (OAuth, password reset, cross-subdomain cookies, MFA) evolve the central
  Better Auth config, not per-feature code.

## ADR-016: Auth as the first vertical slice

### Context

Domain logic should be reusable across entry points (tRPC handlers, scripts, SSR), but
tRPC-consuming React views are app-specific.

### Decision

Model auth as the first **vertical slice** in `packages/features/auth` (framework-agnostic:
`lib/auth.ts`, `auth-client.ts`, `getServerSession.ts`, the tRPC-free
`AuthProvider`/`useAuth`). tRPC-consuming views (`LoginView`, `SignupView`, `AppView`)
live in `apps/web/views/*`. Apps consume the slice through direct public exports
(`@repo/features/auth/hooks/useAuth`, `.../lib/getServerSession`).

### Consequences

- `packages/features` stays importable by tRPC handlers and scripts without pulling in the
  React Query client, upholding the acyclic graph (ADR-006).
- A feature spans two locations, split by *framework coupling*; `packages/ui` stays free of
  domain rules. The auth slice is the template for new domains.

## ADR-017: Prisma isolated behind repositories; `select` over `include`; shape conventions left open

### Context

Prisma must not leak past the data layer: generated types spread across handlers and React
couple the product to the ORM, and that coupling is expensive to retrofit away. A stricter
question — whether the template should also mandate a DTO convention (naming, a shared shape
layer, Zod schemas at boundaries) — was considered and deliberately rejected: every
convention the template forces narrows which projects it serves, and rules in
`.agents/rules/` are actively enforced by AI agents, which makes a wrong default costly to
walk back.

### Decision

Prisma is confined to repositories and low-level data access. Repositories hold no business
logic, use explicit `select` over `include`, and return explicit typed shapes — never raw
Prisma rows. How those shapes are named, whether they form a DTO layer, whether Prisma's
generated enum types may reach consumers, and where shared shapes live is **left
undefined** — each project defines its own convention if and when it needs one.

### Consequences

- The `_template` slice types its returns in its own `types.ts` with plain names; the
  template ships no DTO rule and no shared shape package.
- Teams that want a DTO convention (e.g. a shared `lib/dto` layer) add it per project.
- No product models exist beyond auth today.

---

# API Layer (tRPC)

## ADR-018: tRPC as the typed API boundary (superjson, `public`/`viewer`)

### Context

The UI and server must share one type-safe contract, split into unauthenticated and
authenticated surfaces.

### Decision

Use **tRPC** as the product API boundary. [`trpc.ts`](../packages/trpc/server/trpc.ts)
initializes with **superjson** (so `Date`/`Map`/`Set` survive the wire) and a custom
`errorFormatter`. The root router splits into `public` (unauthenticated) and `viewer`
(authenticated) namespaces — both empty in the baseline. The web app mounts
`fetchRequestHandler` at `app/api/trpc/[trpc]/route.ts` (`force-dynamic`, `nodejs`).
`@repo/trpc/react` exports `trpc`, `RouterInputs`, and `RouterOutputs`. Zod (validated by
the `errorFormatter`) is the input-schema library. Better Auth keeps its native routes;
tRPC is reserved for product domains.

### Consequences

- `AppRouter` is the single source of truth for client types; superjson is configured
  symmetrically on both ends.
- The `public`/`viewer` split makes the auth boundary a structural property of the tree;
  new procedures choose `publicProcedure` vs `authedProcedure` explicitly.

## ADR-019: Per-request context from the Better Auth session

### Context

Procedures need the authenticated user plus per-request metadata, and public procedures
must remain possible.

### Decision

Build one context per request in
[`createContext.ts`](../packages/trpc/server/createContext.ts): validate the Better Auth
session (`auth.api.getSession`), shape it via `buildAuthContext`, and attach
`TRPCRequestMeta` (`ip`, `requestId` from header or `crypto.randomUUID()`, `userAgent`).
`authedProcedure` is the authentication seam — it throws `TRPCError UNAUTHORIZED` when
`ctx.auth` is null and narrows the context to a non-null `auth`.

### Consequences

- Authed procedures receive a typed, non-null `auth`; public ones work without a session.
- Logs correlate errors and slow calls by `requestId`/`userId`; tests build context
  in-memory via `createTRPCInnerContext`.

## ADR-020: Procedure composition via middleware

### Context

Cross-cutting concerns (perf logging, error normalization, auth) should apply uniformly,
not per procedure.

### Decision

Compose base procedures from middleware.
[`publicProcedure`](../packages/trpc/server/procedures/publicProcedure.ts) = base
`.use(perfMiddleware).use(errorConversionMiddleware)`;
[`authedProcedure`](../packages/trpc/server/procedures/authedProcedure.ts) extends it with
the auth guard (ADR-019). Both are unit-tested.

### Consequences

- Every procedure inherits perf timing + error conversion; authed ones add a guaranteed
  `auth`.
- Handlers stay thin (transport/auth only), delegating domain logic to services/repositories.

## ADR-021: `ApplicationError` in `@repo/lib` + conversion middleware

### Context

Feature services must raise semantic failures (`NOT_FOUND`, `CONFLICT`, …) without
importing `@trpc/server`, and something must translate them to tRPC codes exactly once.

### Decision

Define [`ApplicationError`](../packages/lib/errors/ApplicationError.ts) in `@repo/lib`
with a fixed `ApplicationErrorCode` union that mirrors tRPC codes (`BAD_REQUEST`,
`CONFLICT`, `FORBIDDEN`, `INTERNAL_SERVER_ERROR`, `NOT_FOUND`, `TOO_MANY_REQUESTS`,
`UNAUTHORIZED`). `errorConversionMiddleware` (inside `publicProcedure`) calls
`mapApplicationError` on thrown errors and non-ok results, converting `ApplicationError`
(or a `TRPCError` whose cause is one) into a `TRPCError`, preserving `cause`. Handlers must
**not** re-wrap; repositories throw context-rich technical `Error`s instead.

### Consequences

- `packages/features/**` describes failures with no tRPC dependency, preserving the
  acyclic graph.
- Conversion happens exactly once; the client receives consistent codes, and the same
  union drives the client retry policy (ADR-025). No Prisma enums are used — error and UI
  states are TS string-literal unions, keeping the boundary ORM-agnostic.

## ADR-022: Minimal tRPC observability

### Context

Operators need to see failures and slow calls without a full APM stack, and validation
errors should be legible on the client.

### Decision

Add lightweight instrumentation at the tRPC edge:
[`perfMiddleware`](../packages/trpc/server/middlewares/perfMiddleware.ts) warns
`trpc.procedure.slow` past 1000 ms; [`onError.ts`](../packages/trpc/server/onError.ts)
logs structured `trpc.request.failed` only for HTTP ≥ 500;
[`errorFormatter.ts`](../packages/trpc/server/errorFormatter.ts) flattens Zod errors,
promotes the first field error to the message, and attaches `zodError` to `data`.

### Consequences

- Logs carry `requestId`, `path`, `type`, and `userId`; expected 4xx don't pollute server
  logs.
- The 1000 ms threshold is a simple constant that can become configuration if needed;
  clients can render per-field Zod errors from `error.data`.

## ADR-023: In-process `serverCaller` for SSR

### Context

Server components/actions sometimes need to invoke procedures without an HTTP round-trip,
and must not run protected procedures unauthenticated.

### Decision

Provide [`serverCaller.ts`](../packages/trpc/server/serverCaller.ts) built from
`createCallerFactory(appRouter)`: `getPublicServerCaller()` runs with `auth: null` (a
protected procedure fails `UNAUTHORIZED`), and `getAuthedServerCaller(session)` builds
`AuthContext` from a verified session and throws if it lacks a user. Request meta uses
sentinel `requestId`s. `createTRPCInnerContext` is shared with the HTTP path.

### Consequences

- SSR calls procedures with no network hop while the public/authed distinction stays
  explicit and type-checked (covered by `serverCaller.test.ts`).

## ADR-024: Better Auth native flows for login/signup/signout

### Context

Auth flows already exist in Better Auth; re-implementing them as tRPC procedures would
duplicate the provider.

### Decision

Delegate login, signup, and signout to the Better Auth client (`authClient.signIn.email`,
`.signUp.email`, `.signOut`) via `AuthProvider`, with the catch-all route handler
(ADR-015). tRPC is reserved for product procedures outside the provider's auth core; the
`public`/`viewer` routers stay empty until a domain needs them.

### Consequences

- Auth UI depends on `AuthProvider` + the Better Auth client, not on tRPC.
- Docs that mention a `public.auth` procedure describe a possible direction, not the
  current state. Future auth customization first asks whether it belongs in Better Auth
  config/hooks or a feature service.

---

# Client & UI

## ADR-025: React Query data layer — global toast + conditional retry

### Context

Every mutation needs to surface errors, and query retries should not hammer the server on
deterministic 4xx failures.

### Decision

Wire tRPC to TanStack React Query with `httpBatchLink` + superjson. In
[`query-client.ts`](../apps/web/app/_trpc/query-client.ts), a global
`MutationCache.onError` calls `toast.error(...)` so views only add `onError` to *augment*.
`shouldRetryServerStateRequest` disables retries for `BAD_REQUEST`/`FORBIDDEN`/
`UNAUTHORIZED` (the definitive `ApplicationErrorCode`s) and caps others at 3; queries set
`refetchOnWindowFocus: false`, `staleTime: 1000`; mutations don't retry.

### Consequences

- Mutation errors toast for free; deterministic client errors don't retry.
- Server-state policy is consistent app-wide; the toast helper must be callable from
  non-React code (ADR-027), which is what lets the queryClient raise it.

## ADR-026: Client-side auth composition (providers, context, forms)

### Context

Client auth state must be available across the tree with loading/error states and typed
actions, and global providers must mount in a single, consistent order.

### Decision

Centralize global client providers in
[`providers.tsx`](../apps/web/app/providers.tsx): `StrictMode > TrpcProvider >
AuthProvider`, plus `Toaster`. `AuthContext`/`AuthProvider`/`useAuth` expose
`user`/`session`/`status` (`idle | loading | authenticated | unauthenticated | error`)
and `signIn`/`signUp`/`signOut`, memoized with `useCallback`/`useMemo` and re-`refetch`ing
after each action; `useAuth` throws outside the provider. Auth forms (`LoginView`,
`SignupView`) are client components with local `useState`, minimal validation, generic
error messages, and `router.refresh()` + `router.replace("/")` after success.

### Consequences

- The whole authed app has tRPC, React Query, auth context, and toast in one provider
  order; landing does not inherit these.
- `router.refresh()` drops the Router Cache entry captured while unauthenticated so the
  server gate re-runs; complex forms may later justify a form library, but not yet.

## ADR-027: Generic UI package — Base UI + CVA + `cn`

### Context

The apps need accessible, themeable primitives that stay generic (no domain rules).

### Decision

`packages/ui` wraps **Base UI** (`@base-ui/react`) primitives (`Dialog`, `Popover`,
`Tooltip`, `Toast`) and builds typed variants with **class-variance-authority**; `cn`
merges classes via `clsx` + `tailwind-merge`. `Button` is a discriminated union of
anchor/icon/native (icon buttons auto-wrap in a `Tooltip`; `href` renders an `<a>`). Form
inputs (`EmailInput`, `PasswordField`, `InputField`, `TextField`, `InputError`,
`HintsOrErrors`) centralize labels, errors, hints, and accessibility. `Toast` uses an
imperative `createToastManager()` so non-React code (the queryClient) can raise toasts,
with a single `<Toaster />` mounted at the app root.

### Consequences

- `packages/ui` stays domain-free and reusable by both apps; accessibility comes from Base
  UI, local wrappers add only styling + ergonomics.
- The imperative toast manager is what enables the global mutation toast (ADR-025).

## ADR-028: Icon system as a build-time SVG sprite

### Context

The apps need a consistent, type-safe icon set with no per-icon JS runtime.

### Decision

Generate icons at build time.
[`build-icons.mjs`](../packages/ui/scripts/build-icons.mjs) reads an allowlist
(`icon-list.mjs`), extracts symbols from `lucide-static`, and emits `sprite.svg` into both
apps' `public/icons/` plus a generated `icon-names.ts` `IconName` union. `Icon.tsx` renders
`<svg><use href="/icons/sprite.svg#name" /></svg>`, `aria-hidden` by default; functional
icons get an `aria-label` on the parent (e.g. icon `Button`).

### Consequences

- Adding an icon = edit the list + run `pnpm build:icons`; unknown names fail typecheck.
- Icons load from one cacheable static asset per app; sprite and union are generated
  artifacts, never hand-edited.

## ADR-029: Tailwind v4 with a shared CSS theme

### Context

Styling should be utility-first with a consistent design system shared by both apps,
without a JS Tailwind config.

### Decision

Use **Tailwind CSS v4** with a shared
[`theme.css`](../packages/tailwind-config/theme.css): `@import "tailwindcss"`, CSS custom
properties in `:root`, `@theme inline` mapping tokens, and `@source` scanning
`apps/**` + `packages/**`. Both apps import it once in their root layout; each app's
`postcss.config.mjs` pulls in `@tailwindcss/postcss`. The palette is intentionally neutral
and meant to be replaced with brand colors.

### Consequences

- Web and landing share tokens (`primary`, `ink`, `background`, `card`, error colors) from
  one file; global visual changes are evaluated across both apps.
- The shared CSS must include app + package sources for classes to be detected.

## ADR-030: Cross-app auth via `/api/auth/status`; per-app error pages

### Context

Landing sometimes needs to know whether a visitor is signed in without importing the auth
stack, and each app needs its own error/not-found pages.

### Decision

Expose [`/api/auth/status`](../apps/web/app/api/auth/status/route.ts) on web, returning
`{ authenticated: boolean }` with `cache-control: private, no-store` and CORS restricted to
`WWW_URL` (`@repo/lib/urls`, ADR-036) with credentials — never wildcard. Landing calls it with `credentials: "include"`. Each app ships an `error.tsx`
(client, "Try again" + `console.error`) and `not-found.tsx` (server, link home).

### Consequences

- Landing checks auth without knowing Better Auth/tRPC; the endpoint leaks no user data.
- If previews need multiple origins, evolve to an allowlist, not `*`.

---

# Security, Testing & Governance

## ADR-031: Page-level authorization (never in layouts)

### Context

Next.js layouts don't re-run on every navigation and are bypassed by direct requests, so
an auth check placed there can leak protected content.

### Decision

Gate authorization inside each protected `page.tsx` / server component.
`apps/web/app/page.tsx` calls `getServerSession()` and `redirect("/login")` when absent;
the login page redirects to `/` when a session exists. Layouts (e.g. the `(auth)`
`AuthWrapper`) handle only presentation. tRPC's `authedProcedure` (ADR-019) is the second,
API-side enforcement point.

### Consequences

- Every protected route validates the session before rendering; an expired session
  redirects on the next navigation instead of staying "stuck".
- Finer-grained domain rules belong in server modules / tRPC procedures, not layouts.

## ADR-032: Vitest single unit project

### Context

Packages across the graph need fast unit tests with shared aliases and a DOM for React
components, without per-package config drift.

### Decision

Run one root **Vitest** `unit` project on `jsdom` ([`vitest.config.ts`](../vitest.config.ts)),
mirroring the `@repo/*` aliases, stubbing auth/DB env vars, and loading `vitest.setup.ts`
(`@testing-library/jest-dom/vitest` + `cleanup`). No React Vite plugin is needed. `pnpm
test` runs `db:generate` first, then `vitest run --project unit`. Baseline coverage targets
observable contracts: UI primitives (roles/labels/states) and tRPC (`publicProcedure`,
`authedProcedure`, `serverCaller`). Rules target ~80%+ coverage for new code, fixing types
before tests.

### Consequences

- Every package tests through one config with consistent aliases and env.
- There is no e2e for real login/signup against a database yet; new slices bring
  proportional tests.

## ADR-033: `.agents/` rules + spec-driven ADRs as governance

### Context

Conventions that live only in prose are not reliably applied by people or AI agents.

### Decision

Encode conventions as modular, tagged rule files in
[`.agents/rules/`](../.agents/rules/) (grouped by `_sections.md`: architecture, quality,
data, api, performance, testing, patterns, culture, ci, reference), with `AGENTS.md`
(symlinked `CLAUDE.md`) as the entry point. Record decisions as ADRs in a consistent
format: `docs/decisions.md` holds stable bootstrap decisions (this file);
`specs/*/decisions.md` and `tmp/decisions/*` hold per-feature or in-progress analyses,
using the opt-in spec-driven workflow.

### Consequences

- The decisions here and the rules are two views of the same intent — rules are
  prescriptive, this doc descriptive.
- Analyses in `tmp/` are promoted to `docs/` or `specs/` once they become stable decisions;
  ADRs discourage reopening trade-offs without new context.
