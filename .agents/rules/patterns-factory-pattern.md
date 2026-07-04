---
title: Use Factory Pattern to Push Conditionals to Entry Points
impact: HIGH
impactDescription: Keeps services focused and prevents complexity accumulation
tags: patterns, factory, conditionals, single-responsibility
---

## Use Factory Pattern to Push Conditionals to Entry Points

**Impact: HIGH**

If statements belong at the entry point, not scattered throughout your services. This is one of the most important architectural principles for maintaining clean, focused code that doesn't spiral into unmaintainable complexity.
**The problem with scattered conditionals:**
A service is written for a clear, specific purpose. Then a new product requirement arrives, and someone adds an if statement. A few years later, that service is littered with conditional checks. The service becomes:
- Complicated and hard to read
- Difficult to understand and reason about
- More susceptible to bugs
- Violating single responsibility
- Nearly impossible to test thoroughly

**Incorrect (conditionals scattered in service):**

```typescript
class AuthNotificationService {
  async notify(user: User, event: string) {
    if (event === "signed-up") {
      // Sign-up-specific logic
      if (!user.emailVerified) {
        // Send verification email...
      }
    } else if (event === "signed-in") {
      // Sign-in-specific logic
    } else if (event === "password-reset") {
      // Password-reset-specific logic
    }
  }
}
```

**Correct (Factory pattern with specialized services):**

```typescript
// Factory decides at entry point which handler to use
function createAuthEventHandler(event: AuthEvent): AuthEventHandler {
  switch (event) {
    case AuthEvent.SignedUp:
      return new SignedUpHandler();
    case AuthEvent.SignedIn:
      return new SignedInHandler();
    case AuthEvent.PasswordReset:
      return new PasswordResetHandler();
    default:
      throw new Error(`No handler for auth event: ${event}`);
  }
}

// Each handler is focused and clean — no conditionals
class SignedUpHandler implements AuthEventHandler {
  async handle(user: User) {
    // Only sign-up logic here
  }
}

// In tRPC procedure — factory at the entry point
const handler = createAuthEventHandler(input.event);
await handler.handle(user);
```

**Benefits:**
- Services stay focused with one responsibility
- Changes are isolated to specific service implementations
- Testing is straightforward - test each service independently
- New requirements don't pollute existing code

**Guidelines:**
- Push conditionals up to controllers, factories, or routing logic
- Keep services pure and focused on a single responsibility
- Prefer polymorphism over conditionals
- Watch for if statement accumulation during code review
