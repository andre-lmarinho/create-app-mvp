---
title: Address All Nits Before Merging
impact: HIGH
impactDescription: Prevents codebase degradation over time
tags: quality, code-review, standards
---

## Address All Nits Before Merging

**Impact: HIGH**

Don't wave PRs through with a pile of nits just to avoid being "the difficult one." That's precisely how a clean MVP codebase turns sloppy. Code review isn't about being nice — it's about holding the quality bar while the codebase is still small enough to keep clean cheaply.

**Incorrect approach:**

```
Reviewer: "This variable name could be clearer, but it's fine I guess."
Reviewer: "We usually use early returns here, but this works."
Reviewer: "Approved with minor suggestions."
// PR merged with multiple small issues
```

**Correct approach:**

```
Reviewer: "Please rename `d` to `userData` for clarity."
Reviewer: "Please refactor to use early returns per our standards."
Reviewer: "Requesting changes — please address before merging."
// PR updated to meet standards before merge
```

**The principle:**
Fix nits before merging, not after — follow-up PRs for small cleanups rarely materialize (see [quality-no-followup-prs](quality-no-followup-prs.md)). Every pattern violation you let through becomes the new normal for the next PR.

**Make it normal to challenge shortcuts, respectfully:**
- If someone says "let's just hard-code this for now," ask "what would it take to do it properly the first time?"
- If someone wants to commit untested code, push back — and offer to help.
- If someone copy-pastes instead of extracting a shared utility, call it out.

**Scope note:** This is about correctness, naming, patterns, and structure — not style. Biome owns formatting; don't spend review on what the linter already enforces (see [quality-code-review](quality-code-review.md)).
