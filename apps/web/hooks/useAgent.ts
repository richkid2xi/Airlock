"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { Agent } from "../lib/types";

export function useAgent(id: string | undefined) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setAgent(id ? await dataSource.getAgent(id) : null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setFrozen = async (frozen: boolean) => {
    if (!id) return;
    setAgent(await dataSource.freezeAgent(id, frozen));
  };

  return { agent, loading, refresh, setFrozen };
}
