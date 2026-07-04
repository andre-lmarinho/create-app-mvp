---
title: Isolate Technology Choices Behind Repositories
impact: CRITICAL
impactDescription: Enables technology changes without codebase-wide refactors
tags: data, repository, prisma, isolation
---

## Isolate Technology Choices Behind Repositories

**Impact: CRITICAL**

Technology choices must not seep through the application. Direct Prisma client calls scattered across the codebase create massive coupling and make technology changes prohibitively expensive.

**Incorrect (Prisma leaking throughout codebase):**

```typescript
// In a tRPC handler — direct Prisma usage outside a repository
import { prisma } from "@repo/database/lib/prisma";

async function getUser(id: string) {
  return prisma.user.findFirst({ where: { id } });
}
```

**Correct (Repository abstraction):**

```typescript
// In UsersRepository.ts — Prisma is contained here
import type { PrismaClient } from "@repo/database/generated/prisma/client";
import type { UserDto } from "@repo/features/auth/types";

export class UsersRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<UserDto | null> {
    return this.db.user.findFirst({
      where: { id },
      select: { id: true, name: true, email: true, emailVerified: true, image: true },
    });
  }
}

// In tRPC handler — no Prisma knowledge
import { prisma } from "@repo/database/lib/prisma";

const repo = new UsersRepository(prisma);
const user = await repo.findById(input.id);
```

**The standard:**
- All database access must go through Repository classes or tRPC procedures
- Repositories are the only code that knows about Prisma
- No business logic should be in repositories
- Repositories receive `PrismaClient` via constructor injection
