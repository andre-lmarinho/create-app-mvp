import type React from "react";
import type { IconName } from "./icon-names";

type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number | string;
};

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icons use aria-hidden; callers add aria-label when needed
    <svg
      width={size}
      height={size}
      className={className}
      color="inherit"
      fill="none"
      stroke="currentColor"
      aria-hidden
      {...props}>
      <use href={`/icons/sprite.svg#${name}`} color="inherit" />
    </svg>
  );
}
