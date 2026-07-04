---
title: packages/features vs app modules
impact: HIGH
impactDescription: Wrong placement causes tight coupling and import cycles
tags: architecture, features, modules, trpc
---

# `packages/features` vs app `modules`

## `packages/features` — framework-agnostic domain code

`packages/features` contains only framework-agnostic domain code:
- Repositories (data access)
- Services (business logic)
- Core utilities, types, and interfaces
- Presentational components and hooks that do **not** depend on tRPC

**Files in `packages/features/**` must NOT import from `@repo/trpc` or `@trpc/server`** (also enforced by [quality-error-handling](quality-error-handling.md) and [architecture-circular-dependencies](architecture-circular-dependencies.md)).

## App `modules` — presentation shells that use tRPC

Route-area presentation shells and views that consume the typed tRPC React client
live next to the app that renders them, in `apps/<app>/modules/`:
- Views that call `@repo/trpc/react` queries/mutations
- tRPC-aware hooks
- Web-only composition wired to the App Router pages in `apps/<app>/app/`

## Example Structure

```
packages/features/auth/
├── server/                     # Server actions / logic — OK here
├── hooks/useAuth.ts            # tRPC-free hook — OK here
├── context/                    # tRPC-free provider — OK here
└── types.ts                    # Types/DTOs — OK here

apps/web/modules/auth/
└── LoginView.tsx               # Consumes app hooks/actions — MUST be in the app
```

## Why This Matters

```typescript
// ❌ Bad - tRPC-consuming view inside packages/features
// packages/features/auth/components/LoginView.tsx
import { trpc } from "@repo/trpc/react";

// ✅ Good - tRPC-consuming view in the app that renders it
// apps/web/modules/auth/LoginView.tsx
import { trpc } from "@repo/trpc/react";
```

Keeping `packages/features` free of tRPC keeps it portable — repositories and
services can be reused by tRPC handlers, scripts, and future entry points without
dragging in the React/tRPC client. This is the pattern already in place (see
`apps/web/modules/auth/LoginView.tsx`).
