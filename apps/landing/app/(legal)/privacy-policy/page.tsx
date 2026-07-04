import type { Metadata } from "next";

import { PrivacyContent } from "~/legal/_content/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | App",
  description: "Example privacy policy for App.",
};

export default function PrivacyPolicy() {
  return <PrivacyContent />;
}
