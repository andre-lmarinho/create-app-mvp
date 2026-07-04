---
title: Use DTOs at Every Architectural Boundary
impact: CRITICAL
impactDescription: Prevents technology coupling and security risks
tags: data, dto, boundaries, security, types, prisma
---

## Use DTOs at Every Architectural Boundary

**Impact: CRITICAL**

Database types must not leak to the frontend. Returning Prisma-generated types across the wire is a tempting shortcut, but it couples the client to the database schema and risks exposing sensitive fields.

**Problems with leaking database types:**
- Technology coupling (Prisma types end up in React components)
- Security risks (accidental leakage of sensitive fields like password hashes and session tokens)
- Fragile contracts between server and client
- Inability to evolve the database schema independently

**Incorrect (database types leaking):**

```typescript
// tRPC handler returning a Prisma model directly
import type { User } from "@repo/database/generated/prisma/client";

export async function getUserHandler({ ctx, input }): Promise<User> {
  return prisma.user.findFirstOrThrow({ where: { id: input.id } });
  // Leaks every column, including sensitive ones
}

// Frontend coupled to the database shape
import type { User } from "@repo/database/generated/prisma/client";
```

**Correct (explicit DTOs):**

```typescript
// Define the shape the client actually needs
export interface UserDto {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  // Only fields the client needs — no sensitive columns
}

// The repository selects and maps into the DTO
const user = await repo.findById(input.id);
return user; // already a UserDto, not a Prisma row
```

**The standard:**
1. Repositories select only the needed columns and return application-layer DTOs, not raw Prisma rows.
2. Where validation matters at a boundary (e.g. public pages, webhooks), parse through a Zod schema before responding.
3. Never use `as any` in a mapping function. If types don't align, fix the mapping explicitly.

### DTO Location and Naming

**Location**: Shared DTOs go in `@repo/lib/dto/`. Feature-specific DTOs can live in the feature's `types.ts` (e.g. `@repo/features/auth/types`).

**Naming conventions**:
- Base entity: `{Entity}Dto` (e.g. `UserDto`)
- With relations: `{Entity}With{Relations}Dto` (e.g. `UserWithSessionsDto`)
- For specific projections: `{Entity}For{Purpose}Dto` (e.g. `UserForProfileDto`)
- Avoid: `{Entity}Dto2`, `{Entity}DtoForHandler`, and other use-case-specific dumping grounds

**Enum/union pattern** — use string literal unions to stay ORM-agnostic at the boundary:

```typescript
// Good - ORM-agnostic string literal union
export type SessionStatusDto = "ACTIVE" | "EXPIRED" | "REVOKED";

// Bad - re-exporting a Prisma enum to the client
import { SessionStatus } from "@repo/database/generated/prisma/client";
```

### Prisma Boundaries

- **Allowed to import Prisma types/client**: `packages/database`, repository implementations (`packages/features/**/repositories/*Repository.ts`), and low-level data-access code.
- **Not allowed**: feature business logic (non-repository), `packages/trpc/**` handlers, and `apps/**`. These layers work with DTOs.

Yes, this is more code. It's worth it: explicit boundaries prevent the architectural erosion that turns a fast MVP into an unmaintainable one.
