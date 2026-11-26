"use client";

import { useCallback, useEffect, useState } from "react";
import { dataSource } from "../lib/datasource";
import type { Scenario, TxEvent } from "../lib/types";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setScenarios(await dataSource.listScenarios());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runScenario = (
    id: string,
    onStep: (step: Scenario["steps"][number]) => void,
  ): Promise<TxEvent> => dataSource.runScenario(id, onStep);

  const resetDemo = async () => {
    await dataSource.resetDemo();
    await refresh();
  };

  return { scenarios, loading, runScenario, resetDemo };
}
