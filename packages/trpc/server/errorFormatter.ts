import type { TRPCDefaultErrorShape } from "@trpc/server";
import { z } from "zod";

type ErrorFormatterOptions = {
  error: {
    cause?: unknown;
  };
  shape: TRPCDefaultErrorShape;
};

export const errorFormatter = ({ error, shape }: ErrorFormatterOptions) => {
  if (error.cause instanceof z.ZodError) {
    const flat = error.cause.flatten();
    const firstFieldError = Object.values(flat.fieldErrors).flat()[0];
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: flat,
      },
      message: firstFieldError ?? "Invalid link.",
    };
  }

  return shape;
};
