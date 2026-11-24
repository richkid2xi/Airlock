// TODO: Mock implementation of DataSource
import type { DataSource } from './types.js';

export class MockDataSource implements DataSource {
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
