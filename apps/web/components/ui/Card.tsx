import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function Card({ children, className, href }: CardProps) {
  const baseClasses = cn("product-card block text-left", className);

  if (href) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    if (isInternal) {
      return (
        <Link href={href} className={baseClasses}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return <article className={baseClasses}>{children}</article>;
}
