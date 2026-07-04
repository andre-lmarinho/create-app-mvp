export type ApplicationErrorCode =
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND"
  | "TOO_MANY_REQUESTS"
  | "UNAUTHORIZED";

export class ApplicationError extends Error {
  constructor(
    readonly code: ApplicationErrorCode,
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "ApplicationError";
  }
}
