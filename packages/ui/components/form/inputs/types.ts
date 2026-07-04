import type { VariantProps } from "class-variance-authority";
import type React from "react";
import type { inputStyles } from "./TextField";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStyles> & {
    isFullWidth?: boolean;
    ref?: React.Ref<HTMLInputElement>;
  };

export type InputFieldProps = InputProps & {
  addOnClassname?: string;
  addOnLeading?: React.ReactNode;
  addOnSuffix?: React.ReactNode;
  containerClassName?: string;
  dataTestid?: string;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  inputIsFullWidth?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  labelProps?: React.ComponentProps<"label">;
  labelSrOnly?: boolean;
  noLabel?: boolean;
  showAsteriskIndicator?: boolean;
};
