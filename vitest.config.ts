import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@repo/features": resolve("packages/features"),
      "@repo/lib": resolve("packages/lib"),
      "@repo/trpc": resolve("packages/trpc"),
      "@repo/ui": resolve("packages/ui"),
    },
  },
  test: {
    name: "unit",
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      BETTER_AUTH_SECRET: "test-better-auth-secret",
      BETTER_AUTH_URL: "http://localhost:3000",
      DATABASE_URL: "postgresql://user:password@localhost:5432/app",
    },
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/e2e/**"],
  },
});
