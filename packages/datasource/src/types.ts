// TODO: DataSource interface
export interface DataSource {
  getAgents(): Promise<any[]>;
  getPolicies(): Promise<any[]>;
  getTxEvents(): Promise<any[]>;
}
