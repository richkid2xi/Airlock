// TODO: Agent SDK: airlock.submit(tx, intent) client
export interface AirlockClientConfig {
  engineUrl: string;
}

export class AirlockClient {
  constructor(private config: AirlockClientConfig) {}

  async submit(_tx: any, _intent?: string): Promise<any> {
    // TODO: implement submit
    return { verdict: 'pending' };
  }
}
