import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "light-sm" | "dark-sm";

interface BaseButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  const variantClass = {
    primary: "button-primary",
    secondary: "button-secondary",
    "light-sm": "button-light-sm",
    "dark-sm": "button-dark-sm",
  }[variant];

  const combinedClass = cn("button", variantClass, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    const isInternal = href.startsWith("/") && !href.startsWith("//");

    if (isInternal) {
      return (
        <Link href={href} className={combinedClass} {...(rest as object)}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={combinedClass} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
