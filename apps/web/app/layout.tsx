import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "./providers";

import "@repo/tailwind-config/theme.css";

export const metadata: Metadata = {
  title: "App",
  description: "A Turborepo + Next.js + tRPC + Prisma + Better Auth bootstrap.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
