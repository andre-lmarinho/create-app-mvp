import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type { ReactNode } from "react";

import { Footer } from "~/layout/Footer";

import "@repo/tailwind-config/theme.css";

export default function WwwRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background text-foreground">{children}</main>
        <Footer />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
