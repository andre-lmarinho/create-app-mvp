---
title: Keep Controllers Thin - HTTP Concerns Only
impact: HIGH
impactDescription: Enables technology-agnostic business logic
tags: api, controllers, http, separation-of-concerns
---

## Keep Controllers Thin - HTTP Concerns Only

**Impact: HIGH**

tRPC procedures and route handlers are thin layers that handle only transport concerns. They validate input, enforce auth, and delegate to repositories or service functions. No domain logic should live inside them.

**Procedure/handler responsibilities (and ONLY these):**
- Validate incoming input (Zod schemas)
- Enforce workspace/user authorization
- Instantiate repositories with the Prisma client
- Delegate to repositories or service functions
- Return the result

**Procedures should NOT:**
- Contain domain rules or complex conditionals
- Directly build complex Prisma queries that belong in a repository
- Perform multi-step orchestration that belongs in a service function

**Incorrect (business logic in tRPC procedure):**

```typescript
updateName: authedProcedure
  .input(z.object({ name: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Business logic in procedure - BAD
    const user = await prisma.user.findFirst({
      where: { id: ctx.auth.userId },
      select: { id: true, name: true, emailVerified: true },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    if (!user.emailVerified) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Verify your email before editing your profile." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: input.name },
    });
  }),
```

**Correct (thin procedure delegating to handler):**

```typescript
// _router.tsx
updateName: authedProcedure
  .input(ZUpdateNameSchema)
  .mutation((opts) => updateNameHandler(opts)),

// updateName.handler.ts - business logic lives in a service; the handler stays thin
import { ApplicationError } from "@repo/lib/errors";
import { prisma } from "@repo/database/lib/prisma";

export async function updateNameHandler({ ctx, input }: HandlerOptions) {
  const repo = new UsersRepository(prisma);

  const user = await repo.findById(ctx.auth.userId);
  if (!user) {
    throw new ApplicationError("NOT_FOUND", "User not found.");
  }

  return repo.updateName(user.id, input.name);
}
```

> Note: prefer `ApplicationError` for expected application failures in handlers and services. `errorConversionMiddleware` converts it to `TRPCError` at the adapter boundary. Reserve raw `TRPCError` for transport-only concerns (auth, request context). See [quality-error-handling](quality-error-handling.md).

**The principle:**
tRPC is a delivery mechanism. The way we transfer data between client and server should not influence how our core application logic works.
