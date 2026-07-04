<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Development Guide for AI Agents

You are a senior engineer working in a Turborepo monorepo. Prioritize type safety, security, thin API entrypoints, and small, reviewable diffs.

## Do

- Use explicit Prisma `select`/`include` for performance and security. Avoid broad relation loading unless there is a clear reason.
- Use `import type { X }` for TypeScript type imports.
- Use early returns to reduce nesting.
- Use descriptive errors with operation context and identifiers.
- Use [conventional commits](https://www.conventionalcommits.org).
- Put permission checks in `page.tsx`, never in `layout.tsx`
- Use direct workspace imports through `@repo/*` instead of introducing barrel files.
- Use `ast-grep` for structural search if available; otherwise use `rg`, then `grep`.
- Use Biome for formatting and linting
- Only add code comments that explain **why**, not **what** — see [code comment guidelines](.agents/rules/quality-code-comments.md)
- Always address the user by name in responses
- Always follow the [rules](.agents/rules/)

## Don't

- Never use `as any`.
- Never commit secrets or API keys
- Never put business logic in repositories - that belongs in Services
- Never skip running type checks before pushing
- Never create large PRs (>500 lines or >10 files) - split them instead
- Never add comments that simply restate what the code does (e.g., `// Get the user` above a `getUser()` call)

## Commands

See [.agents/commands.md](.agents/commands.md) for full reference. Key commands:

```bash
pnpm run typecheck             # Type check (always run before pushing)
npx biome check --write .      # Lint and format
pnpm run test                  # Run unit tests
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current repository architecture.

## Boundaries

### Always do

- Run type check on changed files before committing
- Run relevant tests before pushing
- Use `select` in Prisma queries
- Follow [conventional commits](https://www.conventionalcommits.org) for PR titles
- Follow the [rules](.agents/rules/)
- Run Biome before pushing

### Ask first

- Adding new dependencies.
- Creating or changing migrations in `packages/database/migrations`.
- Schema changes to `packages/database/schema.prisma`
- Deleting files
- Running full build suites

### Never do

- Commit secrets, API keys, or `.env` files
- Never commit secrets or API keys
- Use `as any` to bypass type safety
- Force push or rebase shared branches
- Modify generated files directly

## Project Structure

```text
apps/web/app/                    # Main Next.js application
packages/database/               # Database schema (schema.prisma) and migrations
packages/features/               # Feature-specific code
packages/lib/                    # Shared utilities
packages/trpc/                   # tRPC API layer (routers in server/routers/)
packages/ui/                     # Shared UI components
```

### Key files

- Routes: `apps/web/app` (App Router)
- Database schema:  `packages/database/schema.prisma`
- tRPC routers: `packages/trpc/server/routers`

## Tech Stack

- **Framework**: Next.js App Router + React 19
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma
- **API**: tRPC for type-safe APIs
- **Auth**: Better Auth
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit)

## Code Examples

### Good error handling

```typescript
// Good - Descriptive error with context
throw new Error(`Unable to create action: User ${userId} has no available time slots for ${date}`);

// Bad - Generic error
throw new Error("Action failed");
```

For error handling patterns and concrete examples, see [quality-error-handling](.agents/rules/quality-error-handling.md).

### Good Prisma query

```typescript
// Good - explicit column selection for performance and security
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    sessions: { select: { id: true, expiresAt: true } },
  },
});

// Bad - broad includes expose and fetch more than the caller needs
const usersWithEverything = await prisma.user.findMany({
  include: { sessions: true, accounts: true },
});
```

### Good imports

```typescript
// Good - Type imports and direct paths
import type { Session } from "@repo/features/auth/lib/getServerSession";
import { Button } from "@repo/ui/components/button/";

// Bad - Regular import for types, barrel imports
import { Session } from "@repo/features/auth";
import { Button } from "@repo/ui";
```

## PR Checklist

- [ ] Title follows conventional commits: `feat(scope): description`
- [ ] Type check passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint:fix`
- [ ] Relevant tests pass
- [ ] Diff is small and focused (<500 lines, <10 files)
- [ ] No secrets or API keys committed

## When Stuck

- Ask a clarifying question before making large speculative changes
- Propose a short plan for complex tasks
- Open a draft PR with notes if unsure about approach
- Fix type errors before test failures - they're often the root cause
- Run `pnpm db:generate` if you see missing enum/type errors

## Spec-Driven Development (Opt-In)

For complex features, you can use spec-driven development when explicitly requested.

**To enable:** Tell the AI "use spec-driven development" or "follow the spec workflow"

See [specs/README.md](specs/README.md) for the workflow documentation.

## Documentation

For detailed information, see the `.agents/` directory:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Current codebase architecture overview
- **[.agents/README.md](.agents/README.md)** - Rules index and architecture overview
- **[.agents/rules/](.agents/rules/)** - Modular engineering rules
- **[.agents/commands.md](.agents/commands.md)** - Complete command reference
