"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { AppStats } from "../lib/types";

export function useStats() {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setStats(await dataSource.getStats());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    return dataSource.subscribeEvents(() => void refresh());
  }, [refresh]);

  return { stats, loading, refresh };
}
