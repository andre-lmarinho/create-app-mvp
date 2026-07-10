# Production Readiness

This bootstrap ships working infrastructure — auth, database, tRPC, UI, CI — behind a
deliberately neutral surface. It runs and it is type-safe, which is exactly why some
production concerns are easy to overlook: the app works fine without them. This document
lists the cross-cutting things an adopter must consciously handle before taking the
template to production as a real product.

**What this is *not*.** This is not a list of unbuilt features. Empty `public` / `viewer`
routers, the absence of product repositories, services, and domain models, and having
no business logic yet are the expected starting point — you fill those with your product.
Product-direction choices are also out of scope: the UI ships in English because a bootstrap
has to pick one language, not because English is "correct"; localization, branding voice, and
which features exist are your calls, not gaps. The items below are different — they are
legal, security, and operational concerns that apply no matter what you build on top.

---

## Legal & consent

**Legal pages are placeholders.** The routes under `apps/landing/app/(legal)/` —
`privacy-policy` and `terms-of-use` — ship example text explicitly marked to be replaced
(ADR-035). Before publishing, replace them with a Privacy Policy and Terms of Use reviewed
for your operating entity and jurisdiction. The shipped text is a stand-in, not a draft to
tweak.

**There is no cookie consent banner or cookie policy.** The landing app ships with
`@vercel/analytics` and `@vercel/speed-insights` mounted, and adopters typically add more
tools (marketing pixels, session replay, A/B testing, third-party embeds). Whether any of
these requires a consent banner and a cookie policy depends on each tool's cookie/tracking
behavior and the privacy laws of the jurisdiction you deploy under — this bootstrap can't
determine either for you. Confirm the tools' behavior against the providers' own
documentation and confirm your obligations through your own legal review. If consent is
required, gate the affected scripts behind it rather than loading them on page load.

**Consent to the Terms and Privacy Policy is passive, not recorded.** The signup form
(`apps/web/views/auth/SignupView.tsx`) shows a "By creating an account, you agree to…" line
linking both documents. There is no checkbox and nothing is persisted. If your product needs
provable opt-in, capture explicit consent and store it (user id + document version +
timestamp).

## Authentication

The Better Auth setup (`packages/features/auth/lib/auth.ts`) is intentionally minimal: email
and password with `autoSignIn`. Before production, decide and wire the parts a real identity
flow needs.

**Email verification is not enforced.** `requireEmailVerification` is unset and `autoSignIn`
is on, so new users are signed in immediately with unverified addresses. Decide whether your
product tolerates that.

**No email transport is configured**, so verification and password-reset emails cannot be
sent, and there is no forgot-password / reset flow. If you offer email + password login, wire
an email provider and Better Auth's send hooks, then enable verification and reset.

**The password minimum is 6 characters** (`minPasswordLength: 6`) — fine for a demo, weak for
production. Raise it, and consider breach-check or complexity rules for your risk profile.

**Consider abuse protection** — rate limiting on the auth endpoints, and cross-subdomain
session cookies if `app.` and `www.` must share a login (today cross-app auth is read-only via
`/api/auth/status`, ADR-030).

## Operations

**Error visibility is minimal.** tRPC logs slow calls and 5xx responses server-side
(ADR-022); there is no error tracking or APM. Add one (e.g. Sentry) plus log aggregation
before real traffic, so you see failures you did not reproduce locally.

**Set real secrets and URLs per environment.** `.env.example` carries placeholders;
`DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are server-only (ADR-011).
`NEXT_PUBLIC_WWW_URL` must be set — the signup legal links and the landing→web auth-status
CORS both depend on it (ADR-030); if it is empty, the consent links resolve against the app
origin and 404.

**Replace placeholder branding and metadata.** The "App" wordmark, `example.com` contact
addresses, page metadata, favicon/OG images, and the neutral theme palette (ADR-029) are
stand-ins meant to be replaced before launch.
