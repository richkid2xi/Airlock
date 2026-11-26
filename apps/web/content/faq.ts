export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What is Airlock?",
    answer:
      "A firewall for AI agent wallets. Every transaction an agent proposes is simulated, checked against the owner's policy and an AI intent check, then allowed, blocked, or held for human approval.",
  },
  {
    question: "Can the agent bypass it?",
    answer:
      "Not by design. The agent holds no spending power: funds sit in a vault that only the policy program can move, and that program enforces caps and allowlists onchain.",
  },
  {
    question: "What if your backend is compromised?",
    answer:
      "The engine is a second layer, not the only one. Hard limits live onchain, so a compromised backend still cannot exceed them.",
  },
  {
    question: "Which chain does it support?",
    answer:
      "Solana. The prototype targets devnet, and agents submit transactions through a small SDK.",
  },
  {
    question: "Is Airlock custodial?",
    answer:
      "No, by design. Funds sit in a vault controlled by an onchain program the owner configures. Airlock is a hackathon prototype and has not been audited.",
  },
];
