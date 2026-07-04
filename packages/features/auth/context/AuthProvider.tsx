import { authClient } from "@repo/features/auth/lib/auth-client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import type { AuthStatus } from "./auth-context";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data, error, isPending, refetch } = authClient.useSession();

  const signIn = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = email.trim();

      if (!normalizedEmail || !password) {
        throw new Error("Enter your email and password to continue.");
      }

      const { error: signInError } = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        throw new Error(`Unable to sign in: ${signInError.message}`);
      }

      await refetch();
    },
    [refetch]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (signUpError) {
        throw new Error(`Unable to create account: ${signUpError.message}`);
      }

      await refetch();
    },
    [refetch]
  );

  const signOut = useCallback(async () => {
    const { error: signOutError } = await authClient.signOut();

    if (signOutError) {
      const message = `Unable to sign out: ${signOutError.message}`;
      console.error("Sign out failed:", message);
      throw new Error(message);
    }

    await refetch();
    router.replace("/login");
    router.refresh();
  }, [refetch, router]);

  const status: AuthStatus = useMemo(() => {
    if (isPending) return "loading";
    if (error) return "error";
    return data ? "authenticated" : "unauthenticated";
  }, [data, error, isPending]);

  const contextValue = useMemo(
    () => ({
      user: data?.user ?? null,
      session: data?.session ?? null,
      status,
      signIn,
      signUp,
      signOut,
    }),
    [data, status, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
