import { cn } from "@repo/ui/utils/cn";
import type React from "react";

type LabelProps = Omit<React.ComponentProps<"label">, "htmlFor"> & {
  htmlFor: string;
};

export function Label({ className, ...props }: LabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is required by the type — enforcement is at compile time
    <label className={cn("mb-2 block text-sm font-semibold leading-none text-ink", className)} {...props} />
  );
}
