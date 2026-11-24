import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/agent.ts'],
  format: ['esm'],
  clean: true,
  sourcemap: true,
  target: 'node20',
});
