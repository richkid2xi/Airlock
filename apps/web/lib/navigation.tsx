"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

type AppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  children: ReactNode;
};

export function AppLink({ href, children, onClick, ...props }: AppLinkProps) {
  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}

export function useAppNavigate() {
  const router = useRouter();
  return (href: string) => router.push(href);
}

export function useAppParams<T extends string = string>() {
  return useParams<Record<T, string>>();
}