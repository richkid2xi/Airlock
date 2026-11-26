import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "main" | "section" | "article";
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return <Component className={cn("page-shell", className)}>{children}</Component>;
}
