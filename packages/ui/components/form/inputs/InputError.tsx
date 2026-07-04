import { Icon } from "@repo/ui/components/icon";

type InputErrorProps = {
  message: React.ReactNode;
};

export function InputError({ message }: InputErrorProps) {
  if (!message) return null;

  return (
    <div data-testid="field-error" className="mt-2 flex items-center gap-2 text-sm text-error-strong">
      <Icon name="alert-triangle" className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
