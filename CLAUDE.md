# Context & Rules for AI Agents

- Before writing or changing any code in programs/, read SOLANA.md.
- Before declaring any task done: run pnpm typecheck && pnpm lint && pnpm test. Never edit tests to make them pass; never reduce the test count.
- Follow the module plan in docs/modules.md. Work on one module at a time and stop at the module boundary.
- Prototype logic as golden vectors in packages/golden first.
- Keep the UI on the DataSource interface; never import mock data directly in pages.
