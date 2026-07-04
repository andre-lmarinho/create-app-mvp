import { Icon } from "@repo/ui/components/icon";
import { cn } from "@repo/ui/utils/cn";
import type React from "react";
import { InputError } from "./InputError";

type HintsOrErrorsProps = {
  error?: React.ReactNode;
  hint?: React.ReactNode;
  hintErrors?: Array<{ id?: string; label: React.ReactNode; valid?: boolean }>;
};

export function HintsOrErrors({ error, hint, hintErrors }: HintsOrErrorsProps) {
  if (error) return <InputError message={error} />;

  if (hintErrors?.length) {
    return (
      <ul className="mt-2 space-y-1 text-sm text-gray-600">
        {hintErrors.map((item) => (
          <li
            key={item.id ?? String(item.label)}
            className={cn("flex items-center gap-2", item.valid === true && "text-green-700")}>
            <Icon name={item.valid === true ? "check" : "x"} className="h-3 w-3 shrink-0" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (!hint) return null;

  return <p className="mt-2 text-sm text-gray-500">{hint}</p>;
}
