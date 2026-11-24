#!/usr/bin/env bash
set -euo pipefail

# Ensure test results directory exists
mkdir -p .turbo/test-results

# Run all workspace tests with Vitest JSON reporter writing to .turbo/test-results
pnpm turbo run test:vitest

# Run test-count guard
node scripts/check-tests.mjs
