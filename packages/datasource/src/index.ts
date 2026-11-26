import { mockDataSource } from './mock.js';
import type { DataSource } from './types.js';

declare const process: { env: Record<string, string | undefined> } | undefined;

export function createDataSource(): DataSource {
  const mode = typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_MODE;
  if (mode === 'live') {
    throw new Error('Live datasource not implemented in this setup');
  }
  return mockDataSource;
}

export * from './types.js';
export * from './mock.js';