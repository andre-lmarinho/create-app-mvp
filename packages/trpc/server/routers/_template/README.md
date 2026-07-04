# How to Add a tRPC Endpoint

Each tRPC endpoint has a schema file (Zod input) and a handler file (thin controller).
Domain routers are registered in their namespace (`public/` or `viewer/`).

## Directory Structure

```
routers/
├── _app.ts                                    ← merges all namespace routers
├── public/
│   ├── _router.ts                             ← merges all public domain routers
│   └── <domain>/
│       ├── _router.ts                         ← domain endpoints (register here)
│       ├── list.schema.ts                     ← Zod input schema
│       └── list.handler.ts                    ← thin handler
└── viewer/
    ├── _router.tsx                            ← merges all viewer domain routers
    └── <domain>/
        ├── _router.tsx                        ← domain endpoints (register here)
        ├── list.schema.ts
        └── list.handler.ts
```

## Step-by-Step

### 1. Create schema + handler

```
routers/viewer/tasks/
├── list.schema.ts    ← Zod schema for the input
└── list.handler.ts   ← thin handler, delegates to service
```

### 2. Create domain router

```typescript
// routers/viewer/tasks/_router.tsx
import { authedProcedure } from "@repo/trpc/server/procedures/authedProcedure";
import { router } from "@repo/trpc/server/trpc";
import { listHandler } from "./list.handler";
import { ZListSchema } from "./list.schema";

export const tasksRouter = router({
  list: authedProcedure.input(ZListSchema).query((opts) => listHandler(opts)),
});
```

### 3. Wire into the namespace root

```typescript
// routers/viewer/_router.tsx
import { router } from "@repo/trpc/server/trpc";
import { tasksRouter } from "./tasks/_router";

export const viewerRouter = router({
  tasks: tasksRouter,
});
```

### 4. Wire into `_app.ts`

Already done — `_app.ts` merges `publicRouter` + `viewerRouter`. No changes needed here
unless you create a new namespace.

## Handler Pattern

Handlers do ONLY three things (see `api-thin-controllers.md`):

1. Extract validated input and auth context from `opts`
2. Instantiate repository + service with Prisma
3. Delegate to the service and return the result

```typescript
export async function listHandler({ ctx, input }: HandlerOpts) {
  const repo = new YourDomainRepository(prisma);
  const service = new YourDomainService(repo);
  return service.fetchAll(input.limit);
}
```

## Rules

- Handlers are thin — validate, auth, delegate (see `api-thin-controllers.md`)
- Throw `ApplicationError` in services, not `TRPCError` (see `quality-error-handling.md`)
- Use `authedProcedure` for authenticated endpoints, `publicProcedure` for public ones
- Never import `@repo/trpc` or `@trpc/server` from `packages/features/`
