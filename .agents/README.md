# Agent Documentation Index

- **[../AGENTS.md](../AGENTS.md)** - Main guide (structure, tech stack, commands, examples)
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Current codebase architecture overview
- **[commands.md](commands.md)** - Command reference

## Rules Index

### Architecture

- [architecture-vertical-slices](rules/architecture-vertical-slices.md) - Vertical slice architecture
- [architecture-feature-boundaries](rules/architecture-feature-boundaries.md) - Feature boundaries
- [architecture-page-level-auth](rules/architecture-page-level-auth.md) - Auth in page.tsx, not layout.tsx

### Quality

- [quality-avoid-barrel-imports](rules/quality-avoid-barrel-imports.md) - Avoid index.ts barrel imports
- [quality-simplicity](rules/quality-simplicity.md) - Keep code simple
- [quality-no-followup-prs](rules/quality-no-followup-prs.md) - Complete work in PR
- [quality-error-handling](rules/quality-error-handling.md) - TRPCError and plain Error usage
- [quality-pr-creation](rules/quality-pr-creation.md) - PR best practices
- [quality-code-comments](rules/quality-code-comments.md) - Comment guidelines
- [quality-code-review](rules/quality-code-review.md) - Code review focus

### Data Layer

- [data-prefer-select-over-include](rules/data-prefer-select-over-include.md) - Explicit column selection in Prisma queries
- [data-repository-pattern](rules/data-repository-pattern.md) - Repository pattern
- [data-repository-methods](rules/data-repository-methods.md) - Repository method standards

### API

- [api-no-breaking-changes](rules/api-no-breaking-changes.md) - API stability
- [api-thin-controllers](rules/api-thin-controllers.md) - Thin controller pattern

### Performance

- [performance-avoid-quadratic](rules/performance-avoid-quadratic.md) - Avoid O(n²) algorithms

### Testing

- [testing-coverage-requirements](rules/testing-coverage-requirements.md) - Test coverage standards
- [testing-incremental](rules/testing-incremental.md) - Incremental test fixing

### Patterns

- [patterns-factory-pattern](rules/patterns-factory-pattern.md) - Factory pattern

### Reference

- [reference-file-locations](rules/reference-file-locations.md) - Key file paths
