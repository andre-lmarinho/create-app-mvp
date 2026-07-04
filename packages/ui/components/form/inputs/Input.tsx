"use client";

import { Icon } from "@repo/ui/components/icon";
import { Tooltip } from "@repo/ui/components/tooltip";
import { useCallback, useState } from "react";
import { Input, InputField } from "./TextField";
import type { InputFieldProps, InputProps } from "./types";

export function PasswordField({ ref, ...props }: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleIsPasswordVisible = useCallback(() => setIsPasswordVisible((current) => !current), []);
  const textLabel = isPasswordVisible ? "Hide password" : "Show password";

  return (
    <InputField
      ref={ref}
      type={isPasswordVisible ? "text" : "password"}
      placeholder={props.placeholder || "••••••••••••"}
      {...props}
      addOnSuffix={
        <Tooltip content={textLabel}>
          <button type="button" tabIndex={-1} onClick={toggleIsPasswordVisible} className="h-5">
            <Icon name={isPasswordVisible ? "eye-off" : "eye"} className="h-4 w-4" />
            <span className="sr-only">{textLabel}</span>
          </button>
        </Tooltip>
      }
    />
  );
}

export function EmailInput({ ref, ...props }: InputProps) {
  return (
    <Input
      ref={ref}
      type="email"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect="off"
      inputMode="email"
      {...props}
    />
  );
}

export function EmailField({ ref, ...props }: InputFieldProps) {
  return (
    <InputField
      ref={ref}
      type="email"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect="off"
      inputMode="email"
      {...props}
    />
  );
}
