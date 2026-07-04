"use client";

import { trpc } from "@repo/trpc/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "./query-client";
import { trpcClient } from "./trpc-client";

type TrpcProviderProps = {
  children: ReactNode;
};

export const TrpcProvider = ({ children }: TrpcProviderProps) => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpc.Provider>
);
