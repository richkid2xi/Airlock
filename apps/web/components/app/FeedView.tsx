"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Radio } from "lucide-react";
import { appContent } from "../../content/app";
import { useAgents } from "../../hooks/useAgents";
import { useFeed } from "../../hooks/useFeed";
import type { TxEvent } from "../../lib/types";
import { cn, formatRelativeTime } from "../../lib/utils";
import AppShell from "./AppShell";
import { EmptyState, LoadingSkeleton, VerdictBadge } from "./AppPrimitives";
import TxDetailDrawer from "./TxDetailDrawer";

export default function FeedView() {
  const [paused, setPaused] = useState(false);
  const [verdict, setVerdict] = useState<"" | TxEvent["verdict"]>("");
  const [agentId, setAgentId] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TxEvent | null>(null);
  const filter = useMemo(
    () => ({
      agentId: agentId || undefined,
      verdict: verdict || undefined,
    }),
    [agentId, verdict],
  );
  const { events, loading } = useFeed(filter, paused);
  const { agents } = useAgents();
  const names = new Map(agents.map((agent) => [agent.id, agent.name]));
  const visible = events.filter((event) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      event.intentText.toLowerCase().includes(query) ||
      event.reason.toLowerCase().includes(query)
    );
  });
  const pauseButton = (
    <button
      type="button"
      onClick={() => setPaused((current) => !current)}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink"
    >
      {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
      <span className="hidden sm:inline">
        {paused ? appContent.feed.resume : appContent.feed.pause}
      </span>
    </button>
  );

  return (
    <AppShell title={appContent.feed.title} activeHref="/app/feed" actions={pauseButton}>
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-success">
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
          <span className="relative inline-flex size-3 rounded-full bg-success" />
        </span>
        <Radio aria-hidden="true" size={16} />
        {appContent.feed.live}
      </div>
      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[160px_220px_1fr]">
          <label className="text-xs font-semibold text-muted">
            {appContent.feed.verdict}
            <select
              value={verdict}
              onChange={(event) => setVerdict(event.target.value as "" | TxEvent["verdict"])}
              className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink"
            >
              {appContent.feed.verdictOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted">
            {appContent.feed.agent}
            <select
              value={agentId}
              onChange={(event) => setAgentId(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink"
            >
              <option value="">{appContent.feed.allAgents}</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted">
            {appContent.feed.search}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={appContent.feed.search}
              className="mt-1 min-h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-card border border-border bg-surface shadow-soft">
        <div className="hidden grid-cols-[90px_130px_1.6fr_1fr_90px_1fr] gap-3 border-b border-border bg-sky/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted md:grid">
          {appContent.feed.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton rows={6} />
          </div>
        ) : visible.length === 0 ? (
          <div className="p-4">
            <EmptyState title={appContent.feed.empty} />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {visible.map((event) => (
              <motion.button
                layout
                key={event.id}
                type="button"
                onClick={() => setSelected(event)}
                className="grid w-full gap-2 border-b border-border px-4 py-4 text-left last:border-0 md:grid-cols-[90px_130px_1.6fr_1fr_90px_1fr] md:items-center md:gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xs text-muted">{formatRelativeTime(event.ts)}</span>
                <span className="text-sm font-semibold text-ink">
                  {names.get(event.agentId) ?? event.agentId}
                </span>
                <span className="truncate text-sm text-ink">{event.intentText}</span>
                <span className="flex flex-wrap gap-1">
                  {event.programs.map((program) => (
                    <span
                      key={program}
                      className="rounded-pill bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                    >
                      {program}
                    </span>
                  ))}
                </span>
                <span>
                  <VerdictBadge verdict={event.verdict} />
                </span>
                <span className="truncate text-xs text-muted">{event.reason}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </section>
      <TxDetailDrawer
        event={selected}
        agentName={selected ? (names.get(selected.agentId) ?? selected.agentId) : ""}
        onClose={() => setSelected(null)}
      />
    </AppShell>
  );
}
