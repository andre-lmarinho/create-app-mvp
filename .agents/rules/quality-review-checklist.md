---
title: Code Review Checklist
impact: HIGH
impactDescription: Ensures consistent code quality across all reviews
tags: quality, code-review, checklist
---

## Code Review Checklist

**Impact: HIGH**

A comprehensive checklist for code reviewers to ensure consistent quality standards.

### File Naming Conventions

- **Repository files**: `UsersRepository.ts` — PascalCase + `Repository` suffix
- **Service files**: `AuthService.ts` — PascalCase + `Service` suffix
- **Handler files**: `createUser.handler.ts` — camelCase + `.handler.ts`
- **Schema files**: `createUser.schema.ts` — camelCase + `.schema.ts`
- **New files**: Avoid dot-suffixes like `.service.ts` or `.repository.ts`; reserve `.test.ts`, `.spec.ts`, `.types.ts` for their specific purposes

### Code Quality

- Prefer early returns. It is recommended to throw/return early so we can ensure null-checks and prevent further nesting.
- Prefer Composition over Prop Drilling. Instead of relying on prop drilling, let's try to take advantage of react children feature.
- For Prisma queries:
  - Only select the columns you need — use `select: { id: true, name: true, email: true }`, not an implicit full-row fetch
  - Prefer `select` over `include`; if you must use `include`, scope the relation with a nested `select`
  - Never return sensitive fields (password hashes, session/reset tokens, provider secrets) from tRPC procedures
- Check if there's any O(n^2) logic in backend code; we should aim for O(n log n) or O(n) ideally.

### tRPC / API Changes

When procedures are changed, ensure there are no breaking changes for existing callers. If a breaking change is unavoidable, coordinate with dependent code in the same PR.

### PR Size

For large pull requests (>500 lines changed or >10 files touched), advise splitting into smaller, focused PRs:
- Split by feature boundaries: separate different features or user stories
- Split by layer/component: frontend changes, backend changes, database migrations, and tests in separate PRs
- Split by dependency chain: create PRs that can be merged sequentially
- Split by file/module: group related file changes together
- Suggested pattern: Database migrations → Backend logic → Frontend components → Integration tests
- Benefits: easier review, faster feedback, reduced conflicts, easier rollback, better history
