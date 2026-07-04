import { ApplicationError } from "@repo/lib/errors";
import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";

import { createTRPCInnerContext } from "../createContext";
import { createCallerFactory, router } from "../trpc";
import { publicProcedure } from "./publicProcedure";

const testRouter = router({
  fail: publicProcedure.query(() => {
    throw new ApplicationError("CONFLICT", "Application error.");
  }),
});

describe("publicProcedure", () => {
  it("converts ApplicationError into TRPCError", async () => {
    const caller = createCallerFactory(testRouter)(
      createTRPCInnerContext({
        auth: null,
        requestMeta: { ip: null, requestId: "test", userAgent: null },
      })
    );

    await expect(caller.fail()).rejects.toMatchObject({
      code: "CONFLICT",
      message: "Application error.",
    });
    await expect(caller.fail()).rejects.toBeInstanceOf(TRPCError);
  });
});
