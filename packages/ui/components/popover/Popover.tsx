"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { Tooltip } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/utils/cn";
import type React from "react";

type PopoverProps = {
  children: React.ReactNode;
  trigger: React.ReactElement;
  tooltip?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  /** Overrides the role on the Popup element. Defaults to base-ui's `dialog`. */
  role?: string;
  /** Adds an accessible name to the Popup element. */
  ariaLabel?: string;
};

export function Popover({
  children,
  trigger,
  tooltip,
  open,
  onOpenChange,
  side = "bottom",
  className,
  role,
  ariaLabel,
}: PopoverProps) {
  const triggerElement = <BasePopover.Trigger render={trigger} />;

  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      {tooltip ? (
        <Tooltip content={tooltip} side={side}>
          {triggerElement}
        </Tooltip>
      ) : (
        triggerElement
      )}
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          sideOffset={8}
          align="end"
          positionMethod="fixed"
          className="z-50">
          <BasePopover.Popup
            // Default to a non-dialog role so popovers do not match
            // `getByRole("dialog")` queries that target full dialogs.
            role={role ?? "group"}
            aria-label={ariaLabel}
            className={cn(
              "rounded-lg border border-gray-200/80 bg-white shadow-xl outline-none",
              "transition-[transform,opacity] duration-100 ease-out",
              "data-starting-style:opacity-0 data-starting-style:scale-[0.98]",
              "data-ending-style:opacity-0 data-ending-style:scale-[0.98]",
              className
            )}>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
