import type { ReactNode } from "react";

export default function LegalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <article className="prose prose-gray mx-auto max-w-3xl py-12">{children}</article>;
}
