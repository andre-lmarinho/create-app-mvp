---
title: Maintain 80%+ Test Coverage for New Code
impact: HIGH
impactDescription: Prevents bugs and enables confident refactoring
tags: testing, coverage, quality, ci
---

## Maintain 80%+ Test Coverage for New Code

**Impact: HIGH**

Every PR must have near-80%+ test coverage for the code it introduces or modifies. If you add 50 lines of new code, those 50 lines must be covered by tests. If you modify an existing function, your changes must be tested.

**Coverage requirements:**
- Overall test coverage: 80%+ for new code
- Unit test coverage: Near 100%, especially with AI assistance for generating tests

**Incorrect (untested code):**

```typescript
// New utility with no tests
export function computeSessionExpiryStatus(
  session: Session,
  now: Date,
): "valid" | "expiring-soon" | "expired" {
  // Complex logic here...
  // No corresponding test file
}
```

**Correct (comprehensive tests):**

```typescript
// computeSessionExpiryStatus.ts
export function computeSessionExpiryStatus(
  session: Session,
  now: Date,
): "valid" | "expiring-soon" | "expired" {
  // Complex logic here...
}

// computeSessionExpiryStatus.test.ts
describe("computeSessionExpiryStatus", () => {
  it("returns 'expired' when the session has passed expiresAt", () => {
    const session = createMockSession({ expiresAt: "2024-01-01" });
    expect(computeSessionExpiryStatus(session, new Date("2024-03-01"))).toBe("expired");
  });

  it("returns 'expiring-soon' when within the refresh window", () => {
    const now = new Date("2024-02-28");
    const session = createMockSession({ expiresAt: "2024-03-01" });
    expect(computeSessionExpiryStatus(session, now)).toBe("expiring-soon");
  });

  it("returns 'valid' when well inside the session lifetime", () => {
    const now = new Date("2024-02-01");
    const session = createMockSession({ expiresAt: "2024-04-01" });
    expect(computeSessionExpiryStatus(session, now)).toBe("valid");
  });
});
```

**Leverage AI for test generation:**
AI can quickly and intelligently build comprehensive test suites. Manual testing is more and more a thing of the past.
