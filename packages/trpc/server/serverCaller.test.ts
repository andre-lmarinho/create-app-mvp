import { createTRPCInnerContext } from "@repo/trpc/server/createContext";
import { authedProcedure } from "@repo/trpc/server/procedures/authedProcedure";
import { createCallerFactory, router } from "@repo/trpc/server/trpc";
import { describe, expect, it } from "vitest";

describe("serverCaller", () => {
  it("fails UNAUTHORIZED on a protected procedure without an auth context", async () => {
    // A public (auth-less) context must short-circuit any authedProcedure with
    // UNAUTHORIZED before reaching its resolver.
    const ctx = createTRPCInnerContext({
      auth: null,
      requestMeta: { ip: null, requestId: "server-caller-public", userAgent: null },
    });

    const protectedRouter = router({ ping: authedProcedure.query(() => "pong") });
    const caller = createCallerFactory(protectedRouter)(ctx);

    await expect(caller.ping()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
