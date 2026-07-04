"use client";

import { useAuth } from "@repo/features/auth/hooks/useAuth";
import { Button } from "@repo/ui/components/button";

const resolveDisplayName = (user: ReturnType<typeof useAuth>["user"]): string => {
  return user?.name?.trim() || user?.email || "guest";
};

const AppView = () => {
  const { user, signOut } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold text-ink">Hello, {resolveDisplayName(user)}</h1>
      <p className="text-gray-500">You are signed in. This is the app starting point.</p>
      <Button type="button" onClick={() => signOut()} size="md">
        Sign out
      </Button>
    </main>
  );
};

export default AppView;
