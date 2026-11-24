# Airlock

A firewall for AI-agent Solana wallets.

## Monorepo Map

- `apps/web`: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui setup + wallet-adapter dependencies.
- `apps/engine`: Fastify + TypeScript API (the firewall engine).
- `apps/demo-agent`: Node/TypeScript script: the "AI agent" used in demos.
- `packages/shared`: Types and Zod schemas shared across workspaces (Agent, Policy, TxEvent, Verdict, Scenario).
- `packages/policy-core`: Pure TypeScript rules evaluation (input: simulated effects + policy, output: verdict).
- `packages/golden`: Golden test vectors (JSON) shared by policy-core, engine, and program tests.
- `packages/sdk`: Agent SDK client (`airlock.submit(tx, intent)`).
- `packages/datasource`: DataSource interface + mock and live implementations.
- `packages/config`: Shared tsconfig presets, ESLint configuration, Prettier configuration.
- `programs/airlock-policy`: Anchor program (Rust): vault PDA, policy PDA, execute instruction.
- `docs/`: Architectural documentation, module roadmap, API reference, review checklists, and CU budgets.
- `scripts/`: Test runner (`test.sh`) and test-count guard (`check-tests.mjs`).

## Prerequisites

- **Node.js**: >= 20 (pinned via `.nvmrc`)
- **pnpm**: >= 9
- **Rust & Cargo**: Required for building the Anchor Solana program
- **Solana CLI**: Required for local ledger and deployment
- **Anchor CLI**: Required for Anchor program compilation

## How to Run

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run dev servers (web + engine in parallel)**:
   ```bash
   pnpm dev
   ```

3. **Run individual applications**:
   ```bash
   pnpm dev:web      # Starts Next.js app on http://localhost:3000
   pnpm dev:engine   # Starts Fastify engine on http://localhost:4000
   pnpm dev:agent    # Runs the demo agent script
   ```

4. **Typecheck & Lint**:
   ```bash
   pnpm typecheck
   pnpm lint
   ```

5. **Build**:
   ```bash
   pnpm build
   ```

6. **Test**:
   ```bash
   pnpm test
   ```

## Working with AI Agents

- **SOLANA.md**: Read before writing any Solana or Anchor code. Do not add unneeded EVM protections (re-entrancy, SafeMath).
- **Golden Vectors**: Prototype rules and policy vectors as data in `packages/golden` BEFORE writing implementation code.
- **Test-Count Guard**: `scripts/test.sh` runs `scripts/check-tests.mjs`, which enforces that tests are never deleted, commented out, or skipped. To ratchet the baseline after adding tests, run `pnpm test:baseline`.
- **CU Benchmarks**: Measure compute units with LiteSVM benchmarks and track them in `docs/cu-budget.md`.
- **Second-Agent Review**: Code must pass the checklist in `docs/REVIEW.md` audited by a separate agent.

## Module Plan (M0 - M9)

- [ ] **M0: Foundation** - Monorepo scaffold, guardrails, CI, LiteSVM test setup
- [ ] **M1: Landing + App Shell** - Next.js app shell, wallet connection, responsive layout
- [ ] **M2: Agents + Policy Editor (Mock)** - Agent registry UI, visual policy rule builder
- [ ] **M3: Feed + Tx Detail + Approvals (Mock)** - Real-time transaction feed, simulation inspector
- [ ] **M4: Attack Lab (Mock)** - Interactive attack scenarios & firewall bypass simulations
- [ ] **M5: Engine Core** - Fastify firewall API, simulation, diff engine, policy evaluator
- [ ] **M6: Anchor Program** - On-chain vault PDA, policy enforcement, instruction validation
- [ ] **M7: Intent Check** - LLM-assisted intent verification and mismatch detection
- [ ] **M8: Real Demo Agent** - Autonomous agent interacting with Airlock firewall SDK
- [ ] **M9: Polish + Pitch** - Documentation, end-to-end integration, performance tuning
