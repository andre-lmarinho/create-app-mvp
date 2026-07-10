---
title: Leverage AI for Boilerplate and Testing
impact: MEDIUM
impactDescription: Accelerates development while maintaining quality
tags: culture, ai, automation, testing
---

## Leverage AI for Boilerplate and Testing

**Impact: MEDIUM**

Generate the bulk of boilerplate and non-critical code with AI so human attention goes to complex business logic and critical architecture. In a bootstrap MVP this is how you move fast without cutting corners on the parts that matter.

**Where AI excels:**
- Boilerplate (basic repository CRUD, Zod schemas)
- Comprehensive test suites
- Documentation
- Repetitive refactoring
- Code review assistance

**Where humans must focus:**
- Complex business logic
- Critical architectural decisions
- Security-sensitive code (auth, billing, secret handling)
- Performance-critical algorithms
- Domain-specific edge cases

**Example — AI-assisted test generation:**

```typescript
// Human writes the function
export function computeSessionExpiryStatus(
  session: Session,
  now: Date,
): "valid" | "expiring-soon" | "expired" {
  // domain logic...
}

// AI generates comprehensive tests, including edge cases a human might miss
describe("computeSessionExpiryStatus", () => {
  it("returns 'expired' once the session has passed expiresAt", () => { /* ... */ });
  it("returns 'expiring-soon' within the refresh window", () => { /* ... */ });
  it("returns 'valid' well inside the session lifetime", () => { /* ... */ });
  it("handles the exact expiresAt boundary correctly", () => { /* ... */ });
});
```

**The bar stays the same:** AI accelerates the work, it does not lower the standard. Everything in these rules — type safety, explicit Prisma `select`, thin controllers, test coverage — still applies to AI-generated code, and it must pass typecheck, lint, and tests before merging. See [testing-coverage-requirements](testing-coverage-requirements.md).
