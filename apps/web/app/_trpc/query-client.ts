import type { AppRouter } from "@repo/trpc/server/routers/_app";
import { toast } from "@repo/ui/components/toast";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

const MAX_QUERY_RETRIES = 3;

const isTRPCClientError = (cause: unknown): cause is TRPCClientError<AppRouter> =>
  cause instanceof TRPCClientError;

const shouldRetryServerStateRequest = (failureCount: number, error: unknown): boolean => {
  if (isTRPCClientError(error) && error.data) {
    const { code } = error.data;
    if (code === "BAD_REQUEST" || code === "FORBIDDEN" || code === "UNAUTHORIZED") {
      return false;
    }
  }

  return failureCount < MAX_QUERY_RETRIES;
};

export const queryClient = new QueryClient({
  // One global mutation onError shows the toast, so views don't repeat it.
  // A mutation can still pass its own onError to override.
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Try again.");
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetryServerStateRequest,
      staleTime: 1000,
    },
    mutations: {
      retry: false,
    },
  },
});
