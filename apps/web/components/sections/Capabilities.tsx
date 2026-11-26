import Link from "next/link";
import { services } from "@/content/services";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { Section } from "@/components/layout/Section";

export function Capabilities() {
  return (
    <Section
      id="use-cases"
      title="Built for the agents you actually run."
      intro="Each agent gets its own limits, allowlists, and approval rules."
    >
      <div className="panel panel-list reveal-child">
        {services.map((service) => (
          <Link key={service.number} href={`#${service.id}`} className="service-row">
            <span className="row-index">{service.number}</span>
            <h3 className="heading-item">{service.title}</h3>
            <p className="text-small">{service.description}</p>
            <span className="row-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
