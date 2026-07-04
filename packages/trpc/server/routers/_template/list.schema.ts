import { z } from "zod";

// Naming convention: Z{Action}{Noun}Schema for the Zod object, T… for its inferred type.
export const ZListSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type TListSchema = z.infer<typeof ZListSchema>;
