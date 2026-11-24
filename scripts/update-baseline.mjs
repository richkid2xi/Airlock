import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resultsDir = path.join(rootDir, '.turbo', 'test-results');
const baselinePath = path.join(rootDir, '.test-baseline.json');

let total = 0;
let skipped = 0;
let failed = 0;

if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const fullPath = path.join(resultsDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
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

if (failed > 0) {
  console.error(`Cannot update baseline while ${failed} test(s) are failing.`);
  process.exit(1);
}

const newBaseline = { total, skipped };
fs.writeFileSync(baselinePath, JSON.stringify(newBaseline, null, 2) + '\n');
console.log(`Updated baseline in .test-baseline.json:`, newBaseline);
