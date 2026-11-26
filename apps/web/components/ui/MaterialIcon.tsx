"use client";

import { cn } from "@/lib/utils";

type MaterialIconProps = {
  icon: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function MaterialIcon({
  icon,
  size = 20,
  className,
  onClick,
  ariaLabel,
}: MaterialIconProps) {
  return (
    <span
      className={cn(
        "material-symbols-rounded inline-flex items-center justify-center",
        className,
      )}
      style={{ fontSize: size, width: size, height: size }}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon}
    </span>
  );
}