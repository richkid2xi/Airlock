import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

const facts = [
  { label: "Location", value: "Accra, Ghana" },
  {
    label: "Background",
    value:
      "Built for the Dev Pack 3 Solana hackathon, November 2026",
  },
  {
    label: "Status",
    value:
      "Working prototype on simulated data; onchain program and engine in progress",
  },
  {
    label: "Focus",
    value:
      "Agent wallet security on Solana: simulation, policy limits, intent checks, onchain enforcement",
  },
  {
    label: "Team",
    value:
      "Solo builder directing AI coding agents",
  },
];

export function AboutSection() {
  return (
    <Section id="about" title="A firewall designed to fail safe.">
      <div className="panel about-panel reveal-child">
        <div className="media-frame aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
          <svg
            viewBox="0 0 600 540"
            role="img"
            aria-label="Illustration of a vault protected by an airlock ring"
            className="h-full w-full"
          >
            <rect width="600" height="540" rx="24" fill="#F1F5F9" />
            <circle cx="300" cy="270" r="150" fill="none" stroke="#2563EB" strokeWidth="24" />
            <circle cx="300" cy="270" r="96" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.1)" strokeWidth="8" />
            <rect x="236" y="210" width="128" height="128" rx="16" fill="#2563EB" />
            <circle cx="300" cy="274" r="20" fill="#EFF6FF" />
            <rect x="296" y="270" width="88" height="8" rx="4" fill="#2563EB" />
          </svg>
        </div>

        <div>
          <p className="text-body">
            Airlock is a firewall for AI agent wallets on Solana. It is designed so that a fooled agent, or even a compromised backend, still cannot move more than the owner allowed.
          </p>

          <dl className="fact-list">
            {facts.map((fact) => (
              <div key={fact.label} className="fact-row">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <Button variant="secondary" href="/#about" className="has-arrow">
            <span>About this project</span>
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </Section>
  );
}
