"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { TxEvent } from "../lib/types";

export function useFeed(
  filter?: { agentId?: string; verdict?: TxEvent["verdict"] },
  paused = false,
) {
  const [events, setEvents] = useState<TxEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setEvents(await dataSource.listEvents(filter));
    setLoading(false);
  }, [filter?.agentId, filter?.verdict]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (paused) return;
    return dataSource.subscribeEvents((event) => {
      if (filter?.agentId && event.agentId !== filter.agentId) return;
      if (filter?.verdict && event.verdict !== filter.verdict) return;
      setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)]);
    });
  }, [filter?.agentId, filter?.verdict, paused]);

  return { events, loading, refresh };
}
