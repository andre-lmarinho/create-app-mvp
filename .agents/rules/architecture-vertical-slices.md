---
title: Organize Code by Domain Using Vertical Slices
impact: CRITICAL
impactDescription: Dramatically improves discoverability and reduces cross-team conflicts
tags: architecture, vertical-slices, ddd, organization
---

## Organize Code by Domain Using Vertical Slices

**Impact: CRITICAL**

The codebase is organized by domain, not by technical layer. `packages/features/` is the heart of this approach. Each folder inside represents a complete vertical slice of the application, driven by the domain it touches.

**Incorrect (traditional layered architecture):**

```
packages/
  components/
    LoginForm.tsx
    AccountCard.tsx
  hooks/
    useAuth.ts
    useSessions.ts
  repositories/
    UsersRepository.ts
    SessionsRepository.ts
```

This creates problems: changes to one feature require touching files scattered across multiple directories, and it's hard to understand what a feature does because its code is fragmented.

**Correct (vertical slice architecture):**

```
packages/
  features/
    auth/
      context/       # tRPC-free provider
      hooks/         # tRPC-free hooks
      lib/           # Better Auth wiring, getServerSession
      server/        # Server actions
      types.ts
    <your-domain>/   # Add new slices here
      repositories/
      services/
      types.ts
  ui/                # Truly generic UI, no domain business rules
```

Each feature folder is a self-contained vertical slice that includes:
- Domain logic: Core business rules and entities specific to that feature
- Application services: Use case orchestration for that domain
- Repositories: Data access specific to that feature's needs
- DTOs: Data transfer objects for crossing boundaries
- UI components: Frontend components related to this feature
- Tests: Unit and integration tests for this feature

**Layer responsibilities:**

| Layer | Path | Purpose |
|-------|------|---------|
| App Router | `apps/*/app/` | Next.js routing, layouts, providers, thin route adapters |
| App modules | `apps/*/modules/` | Route-area presentation shells and tRPC-consuming views |
| Features | `packages/features/` | Domain slices — repositories, services, hooks, components, types |
| tRPC | `packages/trpc/server/` | tRPC routers, handlers, server context |
| UI | `packages/ui/` | Generic UI primitives and class-merge utility |
| Database | `packages/database/` | Prisma client, schema, migrations, and generated types |

**Benefits:**
- Everything related to a feature lives in one directory
- You can understand the entire feature by exploring one directory
- Teams can work on different features without conflicts
- Features are loosely coupled and can evolve independently
