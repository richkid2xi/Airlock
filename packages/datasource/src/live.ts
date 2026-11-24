// TODO: Live implementation of DataSource
import type { DataSource } from './types.js';

export class LiveDataSource implements DataSource {
  constructor(private _engineUrl?: string) {}

  async getAgents(): Promise<any[]> {
    return [];
  }
  async getPolicies(): Promise<any[]> {
    return [];
  }
  async getTxEvents(): Promise<any[]> {
    return [];
  }
}
