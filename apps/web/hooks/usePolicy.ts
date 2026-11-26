"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { Policy } from "../lib/types";

export function usePolicy(agentId: string | undefined) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setPolicy(agentId ? await dataSource.getPolicy(agentId) : null);
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const savePolicy = async (patch: Partial<Omit<Policy, "id" | "agentId">>) => {
    if (!agentId) throw new Error("Agent is required");
    const updated = await dataSource.updatePolicy(agentId, patch);
    setPolicy(updated);
    return updated;
  };

  return { policy, loading, refresh, savePolicy };
}
