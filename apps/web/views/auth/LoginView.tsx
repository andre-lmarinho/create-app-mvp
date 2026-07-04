"use client";

import { useAuth } from "@repo/features/auth/hooks/useAuth";
import { Button } from "@repo/ui/components/button";
import { EmailInput, InputError, PasswordField } from "@repo/ui/components/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginView = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      await signIn(email, password);
      // refresh() first drops any Router Cache entry for "/" captured while
      // unauthenticated, so the server gate re-runs against the fresh session.
      router.refresh();
      router.replace("/");
    } catch {
      setError("Invalid email or password.");
      setIsPending(false);
    }
  };

  return (
    <div className="p-8 md:p-12">
      <div className="space-y-6 pb-4">
        <h1 className="text-4xl mb-8 font-normal text-ink tracking-[0.25em] text-center uppercase">App</h1>

        <form onSubmit={handleSubmit} className="space-y-4 pt-8">
          <EmailInput
            name="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Email"
            required
            disabled={isPending}
          />
          <PasswordField
            name="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            required
            disabled={isPending}
          />
          {error && <InputError message={error} />}
          <Button type="submit" disabled={isPending} size="md" className="w-full">
            Sign in
          </Button>
        </form>
      </div>

      <div className="pt-4 border-t border-gray-100 text-center">
        <span className="text-gray-600">Need an account? </span>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="cursor-pointer font-bold text-primary-main hover:underline">
          Create account
        </button>
      </div>
    </div>
  );
};
