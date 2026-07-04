import { Icon } from "@repo/ui/components/icon";
import type { IconName } from "@repo/ui/components/icon/icon-names";
import { Tooltip } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/utils/cn";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type React from "react";

type ButtonVariants = VariantProps<typeof buttonVariants>;

type AnchorProps = ButtonVariants &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    icon?: never;
  };

type IconButtonProps = Omit<ButtonVariants, "variant"> &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
    variant: "icon";
    icon: IconName;
    label: string;
  };

type NativeButtonProps = ButtonVariants &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
    icon?: never;
  };

type ButtonProps = AnchorProps | IconButtonProps | NativeButtonProps;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        button: "",
        icon: "group h-8 w-8 p-0 shrink-0",
      },
      color: {
        primary: "bg-primary-main text-white shadow-sm hover:bg-primary-800",
        secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        danger: "bg-error-strong text-white hover:bg-error-strong/90",
        minimal: "bg-transparent text-gray-600 hover:bg-gray-100",
      },
      size: {
        // Text buttons need padding; icon buttons need fixed dimensions.
        sm: "",
        md: "",
      },
    },
    compoundVariants: [
      {
        variant: "button",
        size: "sm",
        className: "px-4 py-2 text-sm",
      },
      {
        variant: "button",
        size: "md",
        className: "px-6 py-3 text-base",
      },
      {
        variant: "icon",
        size: "sm",
        className: "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4",
      },
      {
        variant: "icon",
        size: "md",
        className: "h-10 w-10 [&>svg]:h-6 [&>svg]:w-6",
      },
    ],
    defaultVariants: {
      variant: "button",
      color: "primary",
      size: "sm",
    },
  }
);

export function Button({
  className,
  size,
  variant,
  color,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const resolvedColor = color ?? (variant === "icon" ? "minimal" : "primary");
  const classes = cn(buttonVariants({ size, variant, color: resolvedColor }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as AnchorProps;
    return <a href={href} className={classes} {...anchorProps} />;
  }

  if (variant === "icon") {
    const { icon, label, type = "button", ...buttonProps } = props as IconButtonProps;
    return (
      <Tooltip content={label} side="top">
        <button ref={ref} type={type} aria-label={label} className={classes} {...buttonProps}>
          <Icon name={icon} />
        </button>
      </Tooltip>
    );
  }

  const { type = "button", ...buttonProps } = props as NativeButtonProps;
  return <button ref={ref} type={type} className={classes} {...buttonProps} />;
}
