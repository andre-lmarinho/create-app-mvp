import { prisma } from "@repo/database/lib/prisma";
import { YourDomainRepository } from "@repo/features/_template/repositories/YourDomainRepository";
import type { AuthedTRPCContext } from "@repo/trpc/server/createContext";
import type { z } from "zod";
import type { ZListSchema } from "./list.schema";

type ListHandlerOpts = {
  ctx: AuthedTRPCContext;
  input: z.infer<typeof ZListSchema>;
};

// Thin handler: accept validated input + auth, wire the repository, delegate.
// A plain list needs no service; go through one once a business rule appears.
// See api-thin-controllers.md.
export async function listHandler({ ctx: _ctx, input }: ListHandlerOpts) {
  const repo = new YourDomainRepository(prisma);
  return repo.fetchAll(input.limit);
}
