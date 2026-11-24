import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vectorsDir = path.resolve(__dirname, '..', 'vectors');

describe('Golden Vectors Loader', () => {
  const vectorFiles = [
    'per-tx-cap.json',
    'daily-cap.json',
    'program-allowlist.json',
    'destination-allowlist.json',
    'blocked-actions.json',
    'attack-scenarios.json',
  ];

  it.each(vectorFiles)('should parse %s as an array', (filename) => {
    const filePath = path.join(vectorsDir, filename);
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed)).toBe(true);
  });
});
