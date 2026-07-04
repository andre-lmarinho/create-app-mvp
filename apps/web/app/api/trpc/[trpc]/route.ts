import { createTRPCContext } from "@repo/trpc/server/createContext";
import { onErrorHandler } from "@repo/trpc/server/onError";
import { appRouter } from "@repo/trpc/server/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = (request: Request) =>
  fetchRequestHandler({
    createContext: createTRPCContext,
    endpoint: "/api/trpc",
    onError: onErrorHandler,
    req: request,
    router: appRouter,
  });

export { handler as GET, handler as POST };
