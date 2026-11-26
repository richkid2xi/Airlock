"use client";

import { useState, type ReactNode } from "react";
import {
  Bot,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Radio,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import { appContent } from "../../content/app";
import { useApprovals } from "../../hooks/useApprovals";
import { AppLink } from "../../lib/navigation";
import { cn } from "../../lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  agents: Bot,
  feed: Radio,
  approvals: ShieldCheck,
  lab: FlaskConical,
};

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--color-primary)" />
      <rect
        x="7"
        y="7"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="white"
        strokeWidth="2.3"
      />
      <circle cx="16" cy="16" r="5" fill="none" stroke="white" strokeWidth="2.3" />
    </svg>
  );
}

type AppShellProps = {
  title: string;
  activeHref: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function AppShell({ title, activeHref, children, actions }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { held } = useApprovals();

  const sidebar = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-border px-5">
        <AppLink
          href="/app"
          aria-label={appContent.brand.homeLabel}
          className="flex items-center gap-3 font-bold text-ink"
        >
          <Logo />
          <span>{appContent.brand.name}</span>
        </AppLink>
        <button
          type="button"
          aria-label={appContent.shell.closeMenu}
          onClick={() => setDrawerOpen(false)}
          className="grid size-11 place-items-center rounded-lg text-muted lg:hidden"
        >
          <X aria-hidden="true" size={20} />
        </button>
      </div>
      <nav className="space-y-1 p-3">
        {appContent.nav.map((item) => {
          const Icon = iconMap[item.icon];
          const active = activeHref === item.href;
          return (
            <AppLink
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-primary/5 hover:text-ink",
              )}
            >
              <Icon aria-hidden="true" size={18} />
              <span className="flex-1">{item.label}</span>
              {item.icon === "approvals" && held.length > 0 && (
                <span className="grid min-w-6 place-items-center rounded-pill bg-warning/20 px-1.5 py-0.5 text-xs font-bold text-ink">
                  {held.length}
                </span>
              )}
            </AppLink>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-sky/10 p-3">
          <WalletCards aria-hidden="true" size={18} className="text-primary" />
          <span className="text-xs font-semibold text-primary">{appContent.shell.demoMode}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-sky/5">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        {sidebar}
      </aside>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={appContent.shell.closeMenu}
            className="absolute inset-0 bg-navy/40"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative flex h-full w-[min(82vw,320px)] flex-col bg-surface shadow-float">
            {sidebar}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            aria-label={appContent.shell.openMenu}
            onClick={() => setDrawerOpen(true)}
            className="grid size-11 place-items-center rounded-lg border border-border text-ink lg:hidden"
          >
            <Menu aria-hidden="true" size={20} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-ink sm:text-2xl">
            {title}
          </h1>
          {actions}
          <span className="hidden rounded-pill bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:inline-flex">
            {appContent.shell.demoMode}
          </span>
          <button
            type="button"
            className="hidden min-h-10 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink md:block"
          >
            {appContent.shell.connectWallet}
          </button>
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-surface">
            {appContent.shell.userInitials}
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}