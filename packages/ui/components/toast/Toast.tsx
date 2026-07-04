"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@repo/ui/utils/cn";

// Shared manager so non-React code (e.g. the tRPC queryClient) can raise toasts.
export const toastManager = BaseToast.createToastManager();

// Imperative helper: toast.error("...") / toast.success("...").
export const toast = {
  error: (message: string) => toastManager.add({ type: "error", title: message }),
  success: (message: string) => toastManager.add({ type: "success", title: message }),
  message: (message: string) => toastManager.add({ title: message }),
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((item) => (
    <BaseToast.Root
      key={item.id}
      toast={item}
      className={cn(
        "w-80 rounded-lg border bg-card p-4 text-sm shadow-lg",
        "data-[type=error]:border-error-border data-[type=error]:text-error-strong",
        "data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity"
      )}>
      <BaseToast.Title className="font-medium" />
      <BaseToast.Description className="text-gray-600" />
    </BaseToast.Root>
  ));
}

/** Mount once near the app root. Renders toasts raised through `toast`/`toastManager`. */
export function Toaster() {
  return (
    <BaseToast.Provider toastManager={toastManager}>
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed top-4 left-1/2 z-100 flex -translate-x-1/2 flex-col gap-2">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
