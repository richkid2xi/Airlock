import { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  intro?: string;
  id?: string;
  className?: string;
}

/** Centred light serif H2 + optional lead, used above every section panel. */
export function SectionHeader({ title, intro, id, className }: SectionHeaderProps) {
  return (
    <div className={cn("section-header", className)}>
      <h2 id={id} className="display-section">
        {title}
      </h2>
      {intro && <p className="text-lead">{intro}</p>}
    </div>
  );
}

export interface SectionProps {
  id?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, intro, children, className }: SectionProps) {
  const headingId = id && title ? `${id}-title` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("section reveal", className)}>
      <Container>
        {title && (
          <SectionHeader id={headingId} title={title} intro={intro} className="reveal-child" />
        )}
        {children}
      </Container>
    </section>
  );
}
