---
title: Avoid Barrel Imports
impact: MEDIUM
impactDescription: Improves tree-shaking and reduces bundle size
tags: imports, performance, bundling
---

## Avoid Barrel Imports

**Impact: MEDIUM (Improves tree-shaking and reduces bundle size)**

Barrel files (`index.ts` that re-export from multiple modules) can hurt tree-shaking and increase bundle sizes. Import directly from source files instead.

**Incorrect (importing from barrel files):**

```typescript
// Importing from index.ts barrel files
import { UsersRepository, SessionsRepository } from "./repositories";

// Importing from a shared barrel
import { Button } from "@repo/ui/components";
```

**Correct (importing directly from source):**

```typescript
// Import directly from source files
import { UsersRepository } from "./repositories/UsersRepository";
import { SessionsRepository } from "./repositories/SessionsRepository";

// Import directly from component path
import { Button } from "@repo/ui/components/button/Button";
```
