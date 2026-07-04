import type { Session } from "@repo/features/auth/lib/getServerSession";
import type { AuthContext } from "@repo/trpc/server/createContext";
import { buildAuthContext, createTRPCInnerContext } from "@repo/trpc/server/createContext";
import { appRouter } from "@repo/trpc/server/routers/_app";
import { createCallerFactory } from "@repo/trpc/server/trpc";

const callerFactory = createCallerFactory(appRouter);

function buildServerContext(auth: AuthContext | null) {
  return createTRPCInnerContext({
    auth,
    requestMeta: {
      ip: null,
      requestId: auth ? "server-caller-authed" : "server-caller-public",
      userAgent: null,
    },
  });
}

/**
 * In-process tRPC caller for unauthenticated server-side use (public procedures).
 * Reaching a protected procedure through it fails `UNAUTHORIZED`.
 */
export async function getPublicServerCaller() {
  return callerFactory(buildServerContext(null));
}

export async function getAuthedServerCaller(session: Session) {
  const auth = buildAuthContext(session.user);
  if (!auth) {
    throw new Error("Cannot create authenticated tRPC caller without a session user.");
  }

  return callerFactory(buildServerContext(auth));
}
