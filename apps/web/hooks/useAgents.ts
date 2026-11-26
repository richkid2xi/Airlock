"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { Agent } from "../lib/types";

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setAgents(await dataSource.listAgents());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createAgent = async (input: {
    name: string;
    balanceUsd: number;
    template?: "conservative" | "balanced" | "custom";
  }) => {
    const created = await dataSource.createAgent(input);
    if (input.template && input.template !== "custom") {
      await dataSource.updatePolicy(created.agent.id, {
        perTxCapUsd: input.template === "conservative" ? 100 : 500,
        dailyCapUsd: input.template === "conservative" ? 500 : 2000,
      });
    }
    await refresh();
    return created;
  };

  const freezeAgent = async (id: string, frozen: boolean) => {
    const updated = await dataSource.freezeAgent(id, frozen);
    await refresh();
    return updated;
  };

  return { agents, loading, refresh, createAgent, freezeAgent };
}
