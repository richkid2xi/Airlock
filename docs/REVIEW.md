# Second-Agent Review Checklist

A DIFFERENT AI agent than the one that wrote the code audits it. Use this checklist systematically.

## Account validation
- Are account owners explicitly verified against the expected program ID?
- Are signers, writable flags, account uniqueness, and discriminators verified?
- Are mint matches, delegations, and delegates verified on token accounts?

## Signer/CPI privilege propagation
- Which signer and writable privileges are passed to callee programs during CPI?
- Are any signer privileges passed to un-allowlisted or arbitrary programs?

## PDA and bump handling
- Are PDAs re-derived using seeds and canonical bumps?
- Is the canonical bump stored in state and verified on subsequent accesses?

## Account closing/revival
- Are closed accounts cleared (data zeroed, discriminator set to closed)?
- Are lamports transferred out completely?
- Is revival within the same transaction prevented?

## Arithmetic
- Are mathematical operations using checked arithmetic (`checked_add`, `checked_sub`, etc.) on untrusted inputs?
- Are there any potential overflow, underflow, or precision issues?

## Policy bypass attempts (can the agent key move funds without the policy program?)
- Can an agent key directly interact with the vault PDA without executing through the policy program?
- Does the policy program hold exclusive authority over the vault PDA?

## Compromised-engine scenario
- If the off-chain engine is completely compromised or malicious, can it bypass on-chain limits?
- Are hard caps (per-tx, daily) and allowlists enforced strictly on-chain?

## Test integrity (any deleted/skipped tests?)
- Have any tests been deleted, skipped (`test.skip`, `it.skip`), or weakened?
- Does the test count match or exceed the baseline in `.test-baseline.json`?

## CU regressions vs docs/cu-budget.md
- Have LiteSVM benchmarks been run for all instruction paths?
- Do the current CU measurements exceed the recorded baselines in `docs/cu-budget.md`?

---
> Verify each finding is exploitable on Solana before fixing; discard EVM-only findings.
