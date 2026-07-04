---
title: Key File Locations
impact: LOW
impactDescription: Quick reference for finding important files
tags: reference, navigation, file-locations
---

# Key File Locations

## Routing

- Web app pages: `apps/web/app/`
- Landing app pages: `apps/landing/app/`
- Web-only views: `apps/web/modules/<area>/`
- Route handlers: `apps/*/app/api/**/route.ts`

## Database

- Schema (source of truth): `packages/database/schema.prisma`
- Migrations: `packages/database/migrations/`
- Generated client: `packages/database/generated/prisma/` (artifact — never edit by hand)

## API

- tRPC root router: `packages/trpc/server/routers/_app.ts`
- Public procedures: `packages/trpc/server/routers/public/<domain>/_router.ts`
- Authenticated procedures: `packages/trpc/server/routers/viewer/<domain>/_router.tsx`
- tRPC handlers: `packages/trpc/server/routers/<namespace>/<domain>/<action>.handler.ts`
- tRPC schemas: `packages/trpc/server/routers/<namespace>/<domain>/<action>.schema.ts`

## Features

- Domain slices: `packages/features/<domain>/` (baseline: `auth`)
- Repositories: `packages/features/<domain>/repositories/<Name>Repository.ts`
- Services: `packages/features/<domain>/services/<Name>Service.ts`

## File Naming Conventions

- **Repository files**: PascalCase + `Repository` suffix (e.g. `UsersRepository.ts`)
- **Service files**: PascalCase + `Service` suffix (e.g. `AuthService.ts`)
- **Handler files**: camelCase + `.handler.ts` (e.g. `createUser.handler.ts`)
- **Schema files**: camelCase + `.schema.ts` (e.g. `createUser.schema.ts`)
- **Components**: PascalCase (e.g. `AppView.tsx`)
- **Tests**: same as source file + `.test.ts`
