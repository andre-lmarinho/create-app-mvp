---
title: PR Creation Best Practices
impact: HIGH
impactDescription: PRs that don't follow guidelines slow down review cycles
tags: pull-request, code-review, workflow
---

# PR Creation Best Practices

## Draft Mode

Create pull requests in draft mode by default, so that a human reviewer can mark it as ready for review only when it is.

## PR Title

- Use conventional commits: `feat:`, `fix:`, `refactor:`
- Be specific: `fix: handle null contact in case creation`
- Not generic: `fix: bug`

## Size Limits

- **Large PRs** (>500 lines or >10 files) are not recommended
- Split large changes by layer (database migrations, backend, frontend)
- Split by feature component (API, UI, integration)

## PR Requirements

- PR title must follow Conventional Commits specification
- Run type check and linting before pushing
- Run relevant unit tests locally before pushing

## Before Pushing

1. Run `pnpm run typecheck` to check types
2. Run `npx biome check --write .` to lint and format
3. Run relevant tests: `pnpm run test -- --run path/to/file.test.ts`
