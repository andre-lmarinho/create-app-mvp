---
title: Repository Method Naming Conventions
impact: HIGH
impactDescription: Improves code discoverability and reusability
tags: data, repository, naming, conventions, methods
---

## Repository Method Naming Conventions

**Impact: HIGH**

Repository methods should follow consistent naming conventions to improve discoverability and promote code reuse across different features.

### Rule 1: Don't include the repository's entity name in method names

Method names should be concise and avoid redundancy since the repository class name already indicates the entity type.

```typescript
// Good - Concise method names
class UsersRepository {
  fetchAll() { ... }
  findById(id: string) { ... }
  create(payload: UserInsert) { ... }
  softDelete(id: string) { ... }
}

// Bad - Redundant entity name in methods
class UsersRepository {
  fetchAllUsers() { ... }
  findUserById(id: string) { ... }
  createUser(payload: UserInsert) { ... }
  deleteUser(id: string) { ... }
}
```

### Rule 2: Use `with` or `include` keywords for methods that fetch relational data

When a method retrieves additional related entities, make this explicit in the method name.

```typescript
// Good - Clear indication of included relations
class UsersRepository {
  fetchAll() {
    return this.db.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  fetchAllWithSessions() {
    return this.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        sessions: { select: { id: true, expiresAt: true } },
      },
    });
  }
}

// Bad - Unclear what data is included
class UsersRepository {
  fetchAll() {
    return this.db.user.findMany({
      // Silently fetches relations
      select: {
        id: true,
        name: true,
        email: true,
        sessions: { select: { id: true, expiresAt: true } },
      },
    });
  }
}
```

### Rule 3: Keep methods generic and reusable — avoid use-case-specific names

Repository methods should describe what data they return, not how or where it's used.

```typescript
// Good - Generic, reusable methods
class SessionsRepository {
  fetchByUserId(userId: string) { ... }
  fetchByDateRange(start: Date, end: Date) { ... }
}

// Bad - Use-case-specific method names
class SessionsRepository {
  fetchForAccountDashboard(userId: string) { ... }
  fetchForUserActivityFeed(userId: string) { ... }
}
```

### Rule 4: No business logic in repositories

Repositories should only handle data access. Business logic, validations, and complex transformations belong in the tRPC procedure or a service function.

```typescript
// Good - Repository only handles data access
class UsersRepository {
  async updateName(id: string, name: string) {
    await this.db.user.update({
      where: { id },
      data: { name },
    });
  }
}

// Bad - Business logic in repository
class UsersRepository {
  async verifyEmail(id: string) {
    // Validation logic doesn't belong here
    const user = await this.findById(id);
    if (user?.emailVerified) {
      throw new Error("Email already verified");
    }
    // ...
  }
}
```

### Summary

- Method names should be concise: `fetchAll` not `fetchAllUsers`
- Use `with`/`include` keywords when fetching relations: `fetchAllWithSessions`
- Keep methods generic and reusable: `fetchByUserId` not `fetchForAccountDashboard`
- No business logic in repositories
