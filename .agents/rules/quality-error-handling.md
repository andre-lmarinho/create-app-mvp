---
title: Error Handling Patterns
impact: HIGH
impactDescription: Proper error handling keeps application rules decoupled from transport adapters while preserving debuggability and safe client responses
tags: errors, trpc, services, repositories, application-error
---

# Error Handling Patterns

## Descriptive Technical Errors

Always include operation context when throwing technical errors. The message must make it clear what failed and which relevant identifier was involved.

```typescript
// Good - operation and identifier are clear
throw new Error(`UsersRepository.fetchById [user=${userId}]: ${error.message}`);

// Bad - no context for debugging
throw new Error("Fetch failed");
```

## ApplicationError vs TRPCError

Use `ApplicationError` for expected application errors outside the tRPC layer. The tRPC package has `errorConversionMiddleware`, applied through `publicProcedure`, that converts `ApplicationError` instances into `TRPCError` instances.

`ApplicationError` lives in `@repo/lib` so `packages/features/**` can describe application failures without depending on `@repo/trpc` or `@trpc/server`.

### In Feature Services

Services should throw `ApplicationError` when the failure is an expected application state that should preserve API semantics.

```typescript
import { ApplicationError } from "@repo/lib/errors";

throw new ApplicationError("NOT_FOUND", "User not found.");
throw new ApplicationError("FORBIDDEN", "You cannot remove yourself.");
throw new ApplicationError("CONFLICT", "Invite link has already been used.");
throw new ApplicationError("BAD_REQUEST", "Invalid email or password.");
```

When wrapping an unexpected dependency failure inside a service, keep the original error as `cause`.

```typescript
try {
  await provider.sendEmail(message);
} catch (cause) {
  throw new ApplicationError("INTERNAL_SERVER_ERROR", "Unable to send the email.", {
    cause,
  });
}
```

Do not create service-specific error classes that only duplicate `code`, `message`, and `cause`. Prefer `ApplicationError` directly unless the class adds real behavior or a stable domain contract beyond the generic application error shape.

### In Repositories and Gateways

Repositories and gateways should throw technical errors with context. They should not decide HTTP or tRPC semantics.

```typescript
throw new Error(`SessionsRepository.fetchById [session=${id}]: ${error.message}`);
```

Provider-specific gateway errors are allowed when they expose provider details the service must interpret. The service decides whether that becomes an `ApplicationError`, is ignored as idempotent, or remains an unexpected failure.

### In tRPC Routers, Procedures, and Middleware

Use `TRPCError` only at the tRPC adapter layer for errors that are created by the adapter itself: authentication, procedure access checks, request context resolution, or transport-only validation.

```typescript
import { TRPCError } from "@trpc/server";

throw new TRPCError({
  code: "UNAUTHORIZED",
  message: "Authentication required.",
});
```

Do not catch `ApplicationError` in a handler just to wrap it into `TRPCError`. Let `errorConversionMiddleware` do that once.

```typescript
// Good - ApplicationError from the service is converted by publicProcedure
return service.update(input);

// Bad - duplicated conversion that belongs in the tRPC middleware
try {
  return await service.update(input);
} catch (error) {
  if (error instanceof ApplicationError) {
    throw new TRPCError({ code: error.code, message: error.message, cause: error.cause });
  }
  throw error;
}
```

## Import Restrictions

Files in `packages/features/**` must not import from `@trpc/server` or `@repo/trpc`.

Use `ApplicationError` for expected application errors in feature services. Keep repositories focused on data access and technical error context.

```typescript
// Good
import { ApplicationError } from "@repo/lib/errors";

// Bad
import { TRPCError } from "@trpc/server";
import { mapApplicationError } from "@repo/trpc/server/lib/mapApplicationError";
```

## Client Errors

Every mutation error surfaces as a toast automatically: the tRPC `queryClient`
has a global `MutationCache.onError` that calls `toast.error(error.message)`.
So a mutation does **not** need its own `onError` just to show the error.

The toast is built on Base UI (`@repo/ui/components/toast`) — `toast.error()` for
raising, `<Toaster />` mounted once in `providers.tsx`. Don't add a toast library.

```typescript
// Good — the global handler shows the toast; only add onError for extra behavior.
const createUser = trpc.public.auth.createUser.useMutation({
  onSuccess: () => router.replace("/"),
});

// Redundant — don't re-toast what the global handler already toasts.
const createUser = trpc.public.auth.createUser.useMutation({
  onError: (error) => toast.error(error.message),
});
```

Because `ApplicationError` messages cross the boundary as the `TRPCError`
message, the toast shows the message the service chose. Keep those messages
user-facing, not technical.

For a page-level render failure, Next.js uses `error.tsx`; for an unknown route,
`not-found.tsx`. Both apps ship a minimal version. Extend the copy and keep a
clear link back to the app entry point.
