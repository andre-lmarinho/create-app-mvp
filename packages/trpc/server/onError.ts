import type { appRouter } from "@repo/trpc/server/routers/_app";
import type { FetchHandlerRequestOptions } from "@trpc/server/adapters/fetch";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

type OnErrorOptions = Parameters<NonNullable<FetchHandlerRequestOptions<typeof appRouter>["onError"]>>[0];

export function onErrorHandler({ ctx, error, path, type }: OnErrorOptions) {
  const httpStatus = getHTTPStatusCodeFromError(error);
  if (httpStatus < 500) return;

  console.error("trpc.request.failed", {
    code: error.code,
    errorName: error.name,
    httpStatus,
    path,
    requestId: ctx?.requestMeta.requestId ?? null,
    type,
    userId: ctx?.auth?.userId ?? null,
  });
}
