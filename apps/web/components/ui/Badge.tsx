import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "index" | "status";
}

export function Badge({ children, className, variant = "index" }: BadgeProps) {
  if (variant === "status") {
    return (
      <span className={cn("glass-chip badge-status", className)}>
        <span className="status-dot" aria-hidden="true" />
        {children}
      </span>
    );
  }
  return <span className={cn("badge-index", className)}>{children}</span>;
}
