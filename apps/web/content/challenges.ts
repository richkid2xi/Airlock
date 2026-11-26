export interface ChallengeItem {
  number: string;
  title: string;
  description: string;
}

export const challenges: ChallengeItem[] = [
  {
    number: "01",
    title: "Tricked agents",
    description: "A poisoned webpage, token description, or message can rewrite what an agent thinks it was asked to do.",
  },
  {
    number: "02",
    title: "Unlimited keys",
    description: "A wallet key with no spending limit turns one bad decision into a total loss.",
  },
  {
    number: "03",
    title: "Server-only filters",
    description: "Checks that live only in a backend disappear the moment the backend is compromised.",
  },
  {
    number: "04",
    title: "Silent drains",
    description: "Small transfers and hidden approvals can add up before anyone is watching.",
  },
];
