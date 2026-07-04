import type React from "react";

import { AuthWrapper } from "../../views/auth/layout/AuthWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
