"use client";

import type { TooltipRoot } from "@base-ui/react/tooltip";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "@repo/ui/utils/cn";
import type React from "react";

type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: TooltipRoot.ChangeEventDetails) => void;
  delay?: number;
  closeDelay?: number;
  className?: string;
};

export function Tooltip({
  children,
  content,
  side = "top",
  sideOffset = 6,
  open,
  defaultOpen,
  onOpenChange,
  delay = 400,
  closeDelay = 0,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseTooltip.Trigger render={children} delay={delay} closeDelay={closeDelay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={sideOffset} positionMethod="fixed" className="z-50">
          <BaseTooltip.Popup
            className={cn(
              "rounded px-2 py-1 text-xs font-semibold shadow-lg",
              "bg-gray-900 text-white",
              "transition-opacity duration-100 data-starting-style:opacity-0 data-ending-style:opacity-0",
              className
            )}>
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
