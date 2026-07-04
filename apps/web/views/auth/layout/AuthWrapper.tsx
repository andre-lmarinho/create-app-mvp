import { Icon } from "@repo/ui/components/icon";
import type React from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-sans gap-4">
      <div className="relative bg-white rounded-xl shadow-sm w-full max-w-md border border-gray-100 has-[>div:empty]:min-h-40">
        <div
          className="hidden has-[+div:empty]:flex absolute inset-0 flex-col items-center justify-center gap-4"
          role="status"
          aria-live="polite"
          aria-label="Loading">
          <Icon
            name="refresh-cw"
            className="w-7 h-7 text-primary-main animate-spin motion-reduce:animate-none"
          />
          <span className="text-sm text-ink">Loading...</span>
        </div>
        <div className="rounded-xl">{children}</div>
      </div>
    </div>
  );
}
