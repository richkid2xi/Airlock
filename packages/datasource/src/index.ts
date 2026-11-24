// TODO: picks implementation by NEXT_PUBLIC_MODE = mock|live, default mock
import { MockDataSource } from './mock.js';
import { LiveDataSource } from './live.js';
import type { DataSource } from './types.js';

export * from './types.js';
export * from './mock.js';
export * from './live.js';

declare const process: { env: Record<string, string | undefined> } | undefined;

export function createDataSource(): DataSource {
  const mode = typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_MODE;
  if (mode === 'live') {
    return new LiveDataSource(process?.env?.NEXT_PUBLIC_ENGINE_URL);
  }
  return new MockDataSource();
}

