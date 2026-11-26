export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  audience: string;
  deliverables: string[];
  engagement: string;
}

export const services: ServiceItem[] = [
  {
    id: "government",
    number: "01",
    title: "Trading agents",
    description:
      "Let an agent trade freely inside a hard spend cap, with every swap simulated before anything is signed.",
    audience:
      "Teams running trading agents that need hard spend limits and pre-sign analysis.",
    deliverables: [
      "Pre-sign transaction simulation",
      "Per-transaction and daily policy limits",
      "Allowlist and approval enforcement",
    ],
    engagement:
      "Prototype configuration and simulated walkthrough.",
  },
  {
    id: "private-sector",
    number: "02",
    title: "Treasury agents",
    description:
      "Pay contributors and vendors from a vault where only allowlisted destinations can receive funds.",
    audience:
      "Teams managing treasury agents and vendor payouts.",
    deliverables: [
      "Vault destination allowlists",
      "Treasury approval rules",
      "Daily payout caps",
    ],
    engagement:
      "Prototype configuration and simulated walkthrough.",
  },
  {
    id: "connected-systems",
    number: "03",
    title: "Payroll and bill-pay",
    description:
      "Recurring payouts with per-transaction and daily limits, and human approval for anything unusual.",
    audience:
      "Teams running recurring payroll and bill-pay agents.",
    deliverables: [
      "Recurring payment policies",
      "Per-transaction limits",
      "Human approval rules",
    ],
    engagement:
      "Prototype configuration and simulated walkthrough.",
  },
  {
    id: "tools",
    number: "04",
    title: "Support refunds",
    description:
      "Give a support agent small refund powers without handing it the keys to the whole balance.",
    audience:
      "Teams giving support agents limited refund authority.",
    deliverables: [
      "Small refund limits",
      "Destination restrictions",
      "Unusual request approval",
    ],
    engagement:
      "Prototype configuration and simulated walkthrough.",
  },
];
