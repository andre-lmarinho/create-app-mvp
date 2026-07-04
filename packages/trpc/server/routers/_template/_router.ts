import { authedProcedure } from "@repo/trpc/server/procedures/authedProcedure";
// For public endpoints, import publicProcedure instead of authedProcedure:
// import { publicProcedure } from "@repo/trpc/server/procedures/publicProcedure";
import { router } from "@repo/trpc/server/trpc";
import { listHandler } from "./list.handler";
import { ZListSchema } from "./list.schema";

/**
 * Domain router template.
 *
 * Usage:
 *   - Copy this file to `packages/trpc/server/routers/viewer/<domain>/_router.tsx`
 *     for authenticated endpoints
 *   - Copy this file to `packages/trpc/server/routers/public/<domain>/_router.ts`
 *     for public endpoints
 *   - Replace `yourDomain` with your domain name
 *   - Import and merge into `viewer/_router.tsx` or `public/_router.ts`
 *
 * Wire into the namespace router:
 * ```typescript
 * // packages/trpc/server/routers/viewer/_router.tsx
 * import { yourDomainRouter } from "./your-domain/_router";
 * export const viewerRouter = router({
 *   yourDomain: yourDomainRouter,
 * });
 * ```
 */
export const yourDomainRouter = router({
  list: authedProcedure.input(ZListSchema).query((opts) => listHandler(opts)),
});
