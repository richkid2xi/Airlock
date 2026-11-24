import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resultsDir = path.join(rootDir, '.turbo', 'test-results');
const baselinePath = path.join(rootDir, '.test-baseline.json');

let baseline = { total: 0, skipped: 0 };
if (fs.existsSync(baselinePath)) {
  try {
    baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  } catch (err) {
    console.error('Failed to parse .test-baseline.json:', err);
    process.exit(1);
  }
}

let total = 0;
let skipped = 0;
let failed = 0;

if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const fullPath = path.join(resultsDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      // Vitest JSON output has numTotalTests, numFailedTests, numPendingTests
      // Or testResults array
      if (typeof data.numTotalTests === 'number') {
        total += data.numTotalTests;
        failed += data.numFailedTests || 0;
        skipped += (data.numPendingTests || 0) + (data.numTodoTests || 0);
      } else if (Array.isArray(data.testResults)) {
        for (const tr of data.testResults) {
          if (Array.isArray(tr.assertionResults)) {
            for (const ar of tr.assertionResults) {
              total++;
              if (ar.status === 'failed') failed++;
              if (ar.status === 'pending' || ar.status === 'skipped' || ar.status === 'todo') skipped++;
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }
}

console.log(`Test Results Summary: total=${total}, failed=${failed}, skipped=${skipped}`);
console.log(`Baseline: total=${baseline.total}, skipped=${baseline.skipped}`);

if (failed > 0) {
  console.error(`FAIL: ${failed} test(s) failed.`);
  process.exit(1);
}

if (total < baseline.total || skipped > baseline.skipped) {
  console.error(
    `FAIL: Test count dropped from ${baseline.total} to ${total} (or skipped increased from ${baseline.skipped} to ${skipped}). Tests may not be deleted, commented out, or skipped.`
  );
  process.exit(1);
}

if (total > baseline.total) {
  console.log(
    `HINT: Test count increased from ${baseline.total} to ${total}. Run 'pnpm test:baseline' to ratchet the baseline up.`
  );
}

console.log('Test count guard passed.');
process.exit(0);
