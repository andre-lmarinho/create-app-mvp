"use client";

import { Button } from "@repo/ui/components/button";
import { useEffect } from "react";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error("Page render failed", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-primary-200 bg-white p-8 shadow-xl text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-primary-main">Something went wrong</h1>
        <p className="text-sm leading-6 text-gray-600">The page failed to load. Try again in a moment.</p>
        <Button type="button" onClick={reset} className="w-full" size="md">
          Try again
        </Button>
      </div>
    </div>
  );
}
