# Build, Test, and Development Commands

This file lists commands that actually exist in the current repository.

## Development

- `pnpm run dev` - run both apps (`web` on :3000, `landing` on :3001). Regenerates the Prisma Client first.
- `pnpm run dev:web` - run only the web app
- `pnpm run dev:landing` - run only the landing app

## Build

- `pnpm run build` - production build of both apps
- `pnpm run build:web` - production build of the web app
- `pnpm run build:landing` - production build of the landing app

## Lint, Format, and Type Check

- `pnpm run lint` - run Biome checks for the repository
- `pnpm run lint:fix` - run Biome and apply fixes across the repository
- `pnpm run typecheck` - type-check all packages (`tsc --noEmit` via Turborepo)
- `npx biome check --write path/to/file.ts` - lint and fix a specific touched file

## Tests

Vitest (unit project):

- `pnpm run test` - run the unit test suite once
- `pnpm exec vitest run --project unit path/to/file.test.ts` - run a specific test file
- `pnpm exec vitest run --project unit path/to/file.test.ts -t "test name"` - run one test by name

## Database

- `pnpm run db:generate` - generate the Prisma Client into `packages/database/generated/prisma/`
- `pnpm run db:migrate` - create/apply Prisma migrations
- `pnpm run db:studio` - open Prisma Studio

Schema evolution lives in `packages/database/schema.prisma` and
`packages/database/migrations/`. The generated client is an artifact — never edit
it by hand; run `pnpm run db:generate` after schema changes.

## Operational Scripts

- `pnpm run security:package` - validate the pnpm package-security policy (exact versions, `minimumReleaseAge`, `allowBuilds`)
- `pnpm run build:icons` - regenerate the icon set in `packages/ui`

Review script source before running any mutating script that touches auth or
provider state.
