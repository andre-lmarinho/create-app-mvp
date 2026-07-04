import type { Metadata } from "next";

import { TermsContent } from "~/legal/_content/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use | App",
  description: "Example terms of use for App.",
};

export default function TermsOfUse() {
  return <TermsContent />;
}
