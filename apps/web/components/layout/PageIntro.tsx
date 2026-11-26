import { ReactNode } from "react";
import { Container } from "./Container";

export interface PageIntroProps {
  title: string;
  intro?: string;
  children?: ReactNode;
}

/** Centred H1 block at the top of inner pages, lit by a soft palette glow. */
export function PageIntro({ title, intro, children }: PageIntroProps) {
  return (
    <header className="page-intro reveal">
      <Container>
        <div className="page-intro-inner">
          <h1 className="display-hero reveal-child">{title}</h1>
          {intro && <p className="text-lead reveal-child">{intro}</p>}
          {children}
        </div>
      </Container>
    </header>
  );
}
