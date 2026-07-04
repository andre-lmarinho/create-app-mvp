"use client";

import { trpc } from "@repo/trpc/react";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: "/api/trpc",
    }),
  ],
});
