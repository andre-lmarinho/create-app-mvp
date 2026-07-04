import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Shared helper combining clsx and tailwind-merge for predictable Tailwind class unions.
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};
