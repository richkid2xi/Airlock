"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { TxEvent } from "../lib/types";

export function useApprovals() {
  const [held, setHeld] = useState<TxEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setHeld(await dataSource.listHeld());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    return dataSource.subscribeEvents(() => void refresh());
  }, [refresh]);

  const resolve = async (id: string, decision: "approve" | "reject") => {
    const event = await dataSource.resolveHeld(id, decision);
    await refresh();
    return event;
  };

  return { held, loading, resolve, refresh };
}
