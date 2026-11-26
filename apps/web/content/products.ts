export interface ProductItem {
  id: string;
  number: string;
  name: string;
  category: string;
  status: string;
  description: string;
  image: string;
  imageFallback?: string;
  summary: string;
  features: string[];
}

export const products: ProductItem[] = [
  {
    id: "policy-vault",
    number: "01",
    name: "Policy Vault",
    category: "Onchain enforcement",
    status: "Prototype",
    description:
      "An Anchor program that holds the agent's funds in a vault with hard per-transaction and daily caps, allowlists, and a kill switch.",
    summary:
      "A Solana Anchor program designed to keep owner-configured spending limits enforceable onchain.",
    image: "https://images.pexels.com/photos/4508751/pexels-photo-4508751.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageFallback: "https://images.pexels.com/photos/5408005/pexels-photo-5408005.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Per-transaction and daily caps",
      "Destination allowlists",
      "Kill switch",
    ],
  },
  {
    id: "simulation-engine",
    number: "02",
    name: "Simulation Engine",
    category: "Pre-sign analysis",
    status: "Prototype",
    description:
      "Runs every proposed transaction through simulation to reveal balance changes, delegations, and authority changes before anything executes.",
    summary:
      "Pre-sign transaction analysis for meaningful balance and authority changes.",
    image: "https://images.pexels.com/photos/38375328/pexels-photo-38375328.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageFallback: "https://images.pexels.com/photos/11798250/pexels-photo-11798250.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Balance change analysis",
      "Delegation detection",
      "Authority change detection",
    ],
  },
  {
    id: "intent-check",
    number: "03",
    name: "Intent Check",
    category: "AI layer",
    status: "Prototype",
    description:
      "Compares what the owner asked the agent to do with what the transaction actually does, and flags mismatches that rules alone miss.",
    summary:
      "AI-assisted comparison of natural-language intent and proposed transaction effects.",
    image: "https://images.pexels.com/photos/17483874/pexels-photo-17483874.png?auto=compress&cs=tinysrgb&w=800",
    imageFallback: "https://images.pexels.com/photos/17485657/pexels-photo-17485657.png?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Plain-language intent",
      "Transaction effect comparison",
      "Mismatch flags",
    ],
  },
  {
    id: "attack-lab",
    number: "04",
    name: "Attack Lab",
    category: "Testing",
    status: "Simulated demo",
    description:
      "Replays prompt injection, hidden delegation, over-limit drains and more against a live policy to show what gets blocked and why.",
    summary:
      "A simulated attack library used to demonstrate policy and intent enforcement.",
    image: "https://images.pexels.com/photos/5408005/pexels-photo-5408005.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageFallback: "https://images.pexels.com/photos/4508751/pexels-photo-4508751.jpeg?auto=compress&cs=tinysrgb&w=800",
    features: [
      "Prompt injection replay",
      "Hidden delegation replay",
      "Over-limit drain replay",
    ],
  },
];
