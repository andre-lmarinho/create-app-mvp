import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@repo/database/lib/prisma";
import { APP_URL } from "@repo/lib/urls";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "SaaS MVP",
  baseURL: process.env.BETTER_AUTH_URL ?? APP_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  plugins: [nextCookies()],
});
