import type { Metadata } from "next";

import { HomeView } from "~/HomeView";

export const metadata: Metadata = {
  title: "App",
  description: "A Turborepo + Next.js + tRPC + Prisma + Better Auth bootstrap.",
};

export default function Home() {
  return <HomeView />;
}
