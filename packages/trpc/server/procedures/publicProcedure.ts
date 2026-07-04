import { createErrorConversionMiddleware } from "@repo/trpc/server/middlewares/errorConversionMiddleware";
import { createPerfMiddleware } from "@repo/trpc/server/middlewares/perfMiddleware";
import { middleware, tRPCContext } from "@repo/trpc/server/trpc";

export const publicProcedure = tRPCContext.procedure
  .use(createPerfMiddleware(middleware))
  .use(createErrorConversionMiddleware(middleware));
