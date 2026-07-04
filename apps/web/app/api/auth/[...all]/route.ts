import { auth } from "@repo/features/auth/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
