"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { appContent } from "../../content/app";
import { useAgents } from "../../hooks/useAgents";
import { useApprovals } from "../../hooks/useApprovals";
import { useFeed } from "../../hooks/useFeed";
import { useStats } from "../../hooks/useStats";
import { AppLink } from "../../lib/navigation";
import { cn, formatCurrency, formatRelativeTime } from "../../lib/utils";
import AppShell from "./AppShell";
import { LoadingSkeleton, VerdictBadge } from "./AppPrimitives";

type CardProps = { className?: string };

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const end = value;
    const diff = end - start;
    const duration = 400;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, display]);

  return (
    <span
      className="text-[var(--text-primary)] font-medium tabular-nums"
      style={{ fontFeatureSettings: '"tnum" 1' }}
    >
      {formatCurrency(display)}
    </span>
  );
}

function MetricTile({
  label,
  value,
  delta,
  tone,
  href,
}: {
  label: string;
  value: ReactNode;
  delta: string;
  tone: "primary" | "success" | "danger" | "warning";
  href?: string;
}) {
  const toneClass = {
    primary: "text-[var(--color-primary)]",
    success: "text-[var(--color-success)]",
    danger: "text-[var(--color-danger)]",
    warning: "text-[var(--color-warning)]",
  }[tone];

  const inner = (
    <>
      <p className="text-[var(--text-secondary)] text-[12px] leading-none uppercase tracking-[0.05em]">
        {label}
      </p>
      <p className="mt-1 text-[28px] font-medium leading-none">{value}</p>
      <p className={`mt-1.5 text-[12px] leading-none ${tone === "warning" ? toneClass : "text-[var(--color-muted)]"}`}>
        {delta}
      </p>
    </>
  );

  const classes = cn(
    "flex flex-col rounded-lg border border-border p-4 bg-[var(--color-surface)] transition hover:bg-[var(--color-primary)/10] duration-200",
    href && "cursor-pointer",
  );

  if (href) {
    return (
      <AppLink href={href} className={classes}>
        {inner}
      </AppLink>
    );
  }

  return <div className={classes}>{inner}</div>;
}

function StatsCard({ className }: CardProps) {
  const { stats, loading } = useStats();

  const items: {
    label: string;
    value: ReactNode;
    delta: string;
    tone: "primary" | "success" | "danger" | "warning";
    href?: string;
  }[] = [
    {
      label: appContent.dashboard.statLabels[0],
      value: loading || !stats ? <span>—</span> : <CountUp value={stats.fundsProtectedUsd} />,
      delta: "+$0 today",
      tone: "primary",
    },
    {
      label: appContent.dashboard.statLabels[1],
      value: loading || !stats ? <span>—</span> : <CountUp value={stats.allowedCount} />,
      delta: "+0 today",
      tone: "success",
    },
    {
      label: appContent.dashboard.statLabels[2],
      value: loading || !stats ? <span>—</span> : <CountUp value={stats.blockedCount} />,
      delta: "+0 today",
      tone: "danger",
    },
    {
      label: appContent.dashboard.statLabels[3],
      value: loading || !stats ? <span>—</span> : <CountUp value={stats.heldCount} />,
      delta: stats && stats.heldCount > 0 ? `${stats.heldCount} waiting` : "0 today",
      tone: "warning",
      href: stats && stats.heldCount > 0 ? "/app/approvals" : undefined,
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {items.map((m) => (
        <MetricTile key={m.label} {...m} />
      ))}
    </div>
  );
}

function ChartCard({ className }: CardProps) {
  const { stats, loading } = useStats();

  return (
    <div className={cn("rounded-lg border border-border bg-[var(--color-surface)] p-4", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[var(--text-primary)] text-[16px] font-medium leading-none">
            {appContent.dashboard.chartTitle}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)] text-[13px] leading-none">
            {appContent.dashboard.chartDescription}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
            <div className="size-2 rounded-full bg-[var(--color-primary)]" />
            <span className="text-[var(--text-secondary)] text-[11px] leading-none">Allowed</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
            <div className="size-2 rounded-full bg-[var(--color-danger)]" />
            <span className="text-[var(--text-secondary)] text-[11px] leading-none">Blocked</span>
          </div>
        </div>
      </div>
      <div className="h-56 w-full">
        {loading || !stats ? (
          <div className="h-full animate-pulse rounded-lg bg-[var(--color-surface)]" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.series}>
              <CartesianGrid stroke="var(--border-default)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} width={28} />
              <Tooltip />
              <Bar dataKey="allowed" stackId="a" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="blocked" stackId="a" fill="var(--color-danger)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function AttentionCard({ className }: CardProps) {
  const { loading, resolve, held } = useApprovals();

  return (
    <div className={cn("rounded-lg border border-border bg-[var(--color-surface)] p-4 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] text-[16px] font-medium leading-none">
            {appContent.approvals.title}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)] text-[13px] leading-none">
            {loading ? "Loading" : `${held.length} waiting`}
          </p>
        </div>
        <AppLink href="/app/approvals" className="text-[var(--color-primary)] text-xs font-medium hover:underline">
          {appContent.dashboard.viewAll}
        </AppLink>
      </div>

      {loading ? (
        <LoadingSkeleton rows={2} />
      ) : held.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-[var(--color-surface)] px-3 py-8 text-center">
          <p className="text-[var(--text-primary)] text-[13px] font-medium">{appContent.approvals.emptyTitle}</p>
          <p className="mt-0.5 text-[var(--text-secondary)] text-[12px] leading-none">{appContent.approvals.emptyBody}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {held.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center gap-2 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--text-primary)] leading-none">
                  {event.intentText}
                </p>
                <p className="mt-0.5 truncate text-[12px] leading-none text-[var(--text-secondary)]">
                  {formatRelativeTime(event.ts)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void resolve(event.id, "approve")}
                className="shrink-0 rounded-md bg-[var(--color-primary)] px-2 py-1 text-[11px] font-medium text-[var(--text-primary)]"
              >
                {appContent.common.approve}
              </button>
              <button
                type="button"
                onClick={() => void resolve(event.id, "reject")}
                className="shrink-0 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-[var(--text-primary)]"
              >
                {appContent.common.reject}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LiveFeedCard({ className }: CardProps) {
  const { events, loading } = useFeed();

  return (
    <div className={cn("rounded-lg border border-border bg-[var(--color-surface)] p-4 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] text-[16px] font-medium leading-none">
            {appContent.dashboard.liveTitle}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)] text-[13px] leading-none">
            {appContent.dashboard.liveDescription}
          </p>
        </div>
        <AppLink href="/app/feed" className="text-[var(--color-primary)] text-xs font-medium hover:underline">
          {appContent.dashboard.viewAll}
        </AppLink>
      </div>
      <div className="space-y-1">
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-8 text-center">
            <p className="text-[var(--text-primary)] text-[13px] font-medium">No activity yet</p>
            <p className="mt-0.5 text-[var(--text-secondary)] text-[12px] leading-none">Live transactions appear here</p>
          </div>
        ) : (
          events.slice(0, 8).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-[var(--color-primary)/10] duration-150"
            >
              <VerdictBadge verdict={event.verdict} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--text-primary)] leading-none">
                  {event.intentText}
                </p>
                <p className="mt-0.5 truncate text-[12px] leading-none text-[var(--text-secondary)]">{event.reason}</p>
              </div>
              <span className="shrink-0 text-[12px] leading-none text-[var(--text-secondary)]">
                {formatRelativeTime(event.ts)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AgentsCard({ className }: CardProps) {
  const { agents, loading } = useAgents();

  return (
    <div className={cn("rounded-lg border border-border bg-[var(--color-surface)] p-4 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] text-[16px] font-medium leading-none">
            {appContent.dashboard.agentsTitle}
          </h2>
          <p className="mt-1 text-[var(--text-secondary)] text-[13px] leading-none">
            {appContent.dashboard.agentsDescription}
          </p>
        </div>
        <AppLink href="/app/agents" className="text-[var(--color-primary)] text-xs font-medium hover:underline">
          {appContent.dashboard.viewAll}
        </AppLink>
      </div>
      <div className="space-y-1">
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-8 text-center">
            <p className="text-[var(--text-primary)] text-[13px] font-medium">No agents yet</p>
            <p className="mt-0.5 text-[var(--text-secondary)] text-[12px] leading-none">Create your first agent</p>
          </div>
        ) : (
          agents.map((agent) => (
            <AppLink
              key={agent.id}
              href={`/app/agents/${agent.id}`}
              className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-[var(--color-primary)/10] duration-150"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    agent.status === "active" ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]",
                  )}
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--text-primary)] leading-none">
                    {agent.name}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] leading-none text-[var(--text-secondary)]">
                    {formatRelativeTime(agent.createdAt)}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[13px] font-medium tabular-nums text-[var(--text-primary)]">
                {formatCurrency(agent.balanceUsd)}
              </span>
            </AppLink>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardView() {
  return (
    <AppShell title={appContent.dashboard.title} activeHref="/app">
      <div className="grid grid-cols-12 gap-4">
        <StatsCard className="col-span-12" />
        <ChartCard className="col-span-12 xl:col-span-8" />
        <AttentionCard className="col-span-12 xl:col-span-4" />
        <LiveFeedCard className="col-span-12 xl:col-span-8" />
        <AgentsCard className="col-span-12 xl:col-span-4" />
      </div>
    </AppShell>
  );
}