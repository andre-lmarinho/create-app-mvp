"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Icon } from "@repo/ui/components/icon";
import { cva } from "class-variance-authority";
import type React from "react";

const popupVariants = cva(
  "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] flex flex-col overflow-visible rounded-lg bg-background shadow-xl outline-none transition-[transform,opacity] duration-100 ease-out data-starting-style:opacity-0 data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:scale-[0.98]",
  {
    variants: {
      size: {
        md: "max-w-md max-h-[calc(100vh-2rem)]",
        lg: "max-w-2xl max-h-[calc(100vh-2rem)]",
        full: "w-full max-w-full md:w-11/12 lg:max-w-[80vw] max-h-[calc(100dvh-2rem)] min-h-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type DialogProps = {
  children: React.ReactNode;
  title: string;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actionsRef?: React.RefObject<BaseDialog.Root.Actions | null>;
  size?: "md" | "lg" | "full";
};

export type DialogActions = BaseDialog.Root.Actions;

export function Dialog({ children, title, trigger, open, onOpenChange, actionsRef, size }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange} actionsRef={actionsRef}>
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed z-40 inset-0 bg-black/40 transition-opacity duration-100 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <BaseDialog.Popup className={popupVariants({ size })} data-repo-dialog-popup>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
            <BaseDialog.Title className="text-lg font-semibold text-gray-800">{title}</BaseDialog.Title>
            <BaseDialog.Close className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <Icon name="x" className="w-5 h-5" />
            </BaseDialog.Close>
          </div>
          <div className="min-h-0 space-y-4 overflow-y-auto p-6 flex flex-1 flex-col">{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
