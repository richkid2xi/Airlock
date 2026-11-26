export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  legalEntity: string;
}

export const siteConfig: SiteConfig = {
  name: "Airlock",
  tagline: "Firewall for AI agent wallets.",
  description:
    "Airlock simulates, checks, and enforces onchain limits on AI agent wallets, so one poisoned prompt can't drain your funds.",
  contactEmail: "",
  contactPhone: "",
  location: "Accra, Ghana",
  legalEntity: "Built for the Dev Pack 3 Solana hackathon.",
};
