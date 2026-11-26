export interface ProcessStep {
  step: string;
  title: string;
  short: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Submit",
    short: "The agent asks, it never signs.",
    description:
      "The agent submits the transaction it wants to make along with a plain-language intent. It holds no spending power of its own.",
  },
  {
    step: "02",
    title: "Simulate",
    short: "See the real effects.",
    description:
      "The transaction is simulated to reveal balance changes, new delegations, and authority changes before anything runs.",
  },
  {
    step: "03",
    title: "Check",
    short: "Rules, then intent.",
    description:
      "Policy limits and allowlists are applied, then an AI check compares the request with what the transaction really does.",
  },
  {
    step: "04",
    title: "Enforce",
    short: "Limits that still hold.",
    description:
      "Approved transactions execute through the vault program, which re-checks caps and allowlists onchain even if the engine is compromised.",
  },
];
