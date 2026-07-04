import { type AuthContext, createTRPCInnerContext } from "@repo/trpc/server/createContext";
import { createCallerFactory, router } from "@repo/trpc/server/trpc";
import { describe, expect, it } from "vitest";
import { authedProcedure } from "./authedProcedure";

const USER_ID = "00000000-0000-4000-8000-000000000001";

const testRouter = router({
  ping: authedProcedure.query(() => "pong"),
});

function makeCtx(
  auth: AuthContext | null = {
    email: "user@example.com",
    user: { email: "user@example.com", emailVerified: true, id: USER_ID, name: "User" },
    userId: USER_ID,
  }
) {
  return createTRPCInnerContext({
    auth,
    requestMeta: { ip: null, requestId: "test", userAgent: null },
  });
}

describe("authedProcedure", () => {
  it("allows authenticated callers", async () => {
    const caller = createCallerFactory(testRouter)(makeCtx());

    await expect(caller.ping()).resolves.toBe("pong");
  });

  it("requires authentication", async () => {
    const caller = createCallerFactory(testRouter)(makeCtx(null));

    await expect(caller.ping()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
