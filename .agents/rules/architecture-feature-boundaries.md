---
title: Enforce Feature Boundaries Through Public APIs
impact: CRITICAL
impactDescription: Prevents architectural erosion and maintains loose coupling
tags: architecture, boundaries, imports, coupling
---

## Enforce Feature Boundaries Through Public APIs

**Impact: CRITICAL**

Features communicate through well-defined interfaces. If one feature needs data from another, it imports from the other feature's public exports — not by reaching into internal implementation details.

**Incorrect (reaching into internals):**

```typescript
// Bad - Importing an internal mapper that's not part of the public API
import { mapUserRowToUser } from "@repo/features/auth/repositories/UsersRepository";

// Bad - Importing internal computation logic directly
import { computeSessionExpiry } from "@repo/features/auth/lib/internal/expiry";
```

**Correct (using public API):**

```typescript
// Good - Import through the feature's exported types and hooks
import type { Session } from "@repo/features/auth/lib/getServerSession";

// Good - Import through a feature's public hook (in a module/component)
import { useAuth } from "@repo/features/auth/hooks/useAuth";
```

**Shared code placement:**
- Truly generic UI primitives: `packages/ui/`
- Shared Tailwind/theme configuration: `packages/tailwind-config/`
- Prisma client, schema, migrations, and generated types: `packages/database/`

**Benefits:**
- Discoverability: Looking for auth logic? It's all in `packages/features/auth/`
- Easier testing: Test the entire feature as a unit with all pieces in one place
- Loose coupling: Features can evolve independently without breaking each other
- Clear dependencies: When you see `import type { Session } from "@repo/features/auth/lib/getServerSession"`, you know exactly which feature you're depending on
