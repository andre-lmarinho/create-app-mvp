"use client";

import { useAuth } from "@repo/features/auth/hooks/useAuth";
import { wwwUrl } from "@repo/lib/urls";
import { Button } from "@repo/ui/components/button";
import { EmailField, InputField, PasswordField } from "@repo/ui/components/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignupView = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const isValid = formData.name.trim() && formData.email.trim() && formData.password.length >= 6;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmissionError("");
    setIsSubmitting(true);

    try {
      await signUp(formData.name, formData.email, formData.password);
      router.refresh();
      router.replace("/");
    } catch {
      setSubmissionError("We could not create your account. Check your details and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-1 text-4xl font-normal uppercase tracking-[0.25em] text-ink text-center">App</h1>
      <p className="mb-8 text-center text-sm text-gray-500">Create your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="signup-name"
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
        />
        <EmailField
          id="signup-email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <PasswordField
          id="signup-password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 6 characters"
        />

        <Button type="submit" disabled={!isValid || isSubmitting} size="md" className="w-full">
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
        {submissionError && <p className="text-center text-sm text-error-strong">{submissionError}</p>}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a
            href={wwwUrl("/terms-of-use")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground">
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href={wwwUrl("/privacy-policy")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-4 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="cursor-pointer font-bold text-primary-main hover:underline">
          Sign in
        </button>
      </div>
    </div>
  );
};
