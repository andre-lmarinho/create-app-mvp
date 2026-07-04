import { auth as betterAuth } from "@repo/features/auth/lib/auth";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

type AuthUser = {
  email: string;
  emailVerified: boolean;
  id: string;
  image?: string | null;
  name: string;
};

export type AuthContext = {
  email: string | null;
  user: AuthUser;
  userId: string;
};

export function buildAuthContext(user: AuthUser | null | undefined): AuthContext | null {
  if (!user?.id) return null;
  return { email: user.email ?? null, user, userId: user.id };
}

export type TRPCRequestMeta = {
  ip: string | null;
  requestId: string;
  userAgent: string | null;
};

export type CreateTRPCInnerContextInput = {
  auth: AuthContext | null;
  requestMeta: TRPCRequestMeta;
};

export function createTRPCInnerContext(input: CreateTRPCInnerContextInput) {
  return {
    auth: input.auth,
    requestMeta: input.requestMeta,
  };
}

function createRequestMeta(req: Request): TRPCRequestMeta {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
    requestId: req.headers.get("x-request-id") || crypto.randomUUID(),
    userAgent: req.headers.get("user-agent") || null,
  };
}

export const createTRPCContext = async ({ req }: FetchCreateContextFnOptions) => {
  try {
    const session = await betterAuth.api.getSession({
      headers: req.headers,
    });

    return createTRPCInnerContext({
      auth: buildAuthContext(session?.user),
      requestMeta: createRequestMeta(req),
    });
  } catch (error) {
    throw new Error(`Failed to create tRPC context for ${req.method} ${new URL(req.url).pathname}.`, {
      cause: error,
    });
  }
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCInnerContext>>;
export type AuthedTRPCContext = TRPCContext & { auth: AuthContext };
