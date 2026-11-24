import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const testResultsDir = path.join(rootDir, '.turbo', 'test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// Clean old test results before running
for (const file of fs.readdirSync(testResultsDir)) {
  if (file.endsWith('.json')) {
    fs.unlinkSync(path.join(testResultsDir, file));
  }
}

// Run turbo test:vitest
console.log('> turbo run test:vitest');
const turboResult = spawnSync('pnpm', ['turbo', 'run', 'test:vitest'], {
  stdio: 'inherit',
  shell: true,
  cwd: rootDir,
});

if (turboResult.status !== 0) {
  console.error('Turbo test run failed with exit code:', turboResult.status);
  process.exit(turboResult.status || 1);
}

// Run check-tests.mjs
console.log('> node scripts/check-tests.mjs');
const checkResult = spawnSync('node', ['scripts/check-tests.mjs'], {
  stdio: 'inherit',
  shell: true,
  cwd: rootDir,
});

process.exit(checkResult.status || 0);
