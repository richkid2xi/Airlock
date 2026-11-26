import { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}

export function Label({ htmlFor, children, className, ...props }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn("contact-field-label", className)} {...props}>
      {children}
    </label>
  );
}
