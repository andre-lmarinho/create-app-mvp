"use client";

import { cn } from "@repo/ui/utils/cn";
import { cva } from "class-variance-authority";
import type React from "react";
import { useId } from "react";
import { HintsOrErrors } from "./HintOrErrors";
import { Label } from "./Label";
import type { InputFieldProps, InputProps } from "./types";

export const inputStyles = cva(
  [
    "rounded-lg border border-gray-300 bg-white text-ink placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-main/50",
    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
    "transition-colors",
  ],
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm",
        md: "p-3 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export function Input({ className, isFullWidth = true, size = "md", ref, ...props }: InputProps) {
  return (
    <input ref={ref} className={cn(inputStyles({ size }), isFullWidth && "w-full", className)} {...props} />
  );
}

type AddonProps = {
  children: React.ReactNode;
  className?: string;
};

function Addon({ children, className }: AddonProps) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center text-gray-500", className)}>{children}</div>
  );
}

export function InputField(props: InputFieldProps) {
  const generatedId = useId();
  const {
    addOnClassname,
    addOnLeading,
    addOnSuffix,
    className,
    containerClassName,
    dataTestid,
    error,
    hint,
    id,
    inputIsFullWidth = true,
    label,
    labelClassName,
    labelProps,
    labelSrOnly,
    name,
    noLabel,
    required,
    showAsteriskIndicator,
    size = "md",
    ref,
    ...passThrough
  } = props;
  const inputId = id ?? generatedId;

  return (
    <div className={cn(containerClassName)}>
      {label && !noLabel ? (
        <Label
          htmlFor={inputId}
          {...labelProps}
          className={cn(labelClassName, labelSrOnly && "sr-only", error && "text-error-strong")}>
          {label}
          {showAsteriskIndicator && required ? <span className="ml-1 text-error-strong">*</span> : null}
        </Label>
      ) : null}
      {addOnLeading || addOnSuffix ? (
        <div
          className={cn(
            inputStyles({ size }),
            "flex min-w-0 items-center gap-2 focus-within:ring-2 focus-within:ring-primary-main/50",
            inputIsFullWidth && "w-full",
            error && "border-error-strong"
          )}>
          {addOnLeading ? <Addon className={addOnClassname}>{addOnLeading}</Addon> : null}
          <input
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            data-testid={dataTestid ? `${dataTestid}-input` : undefined}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed",
              className
            )}
            {...passThrough}
          />
          {addOnSuffix ? <Addon className={addOnClassname}>{addOnSuffix}</Addon> : null}
        </div>
      ) : (
        <Input
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          size={size}
          data-testid={dataTestid ? `${dataTestid}-input` : undefined}
          className={cn(error && "border-error-strong", className)}
          {...passThrough}
        />
      )}
      <HintsOrErrors error={error} hint={hint} />
    </div>
  );
}
