"use client";

import { AuthProvider } from "@repo/features/auth/context/AuthProvider";
import { Toaster } from "@repo/ui/components/toast";
import type { ReactNode } from "react";
import { StrictMode } from "react";
import { TrpcProvider } from "./_trpc/trpc-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StrictMode>
      <TrpcProvider>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </TrpcProvider>
    </StrictMode>
  );
}
