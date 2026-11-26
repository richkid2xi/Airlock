import { challenges } from "@/content/challenges";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { HandoverIllustration } from "@/assets/illustrations/HandoverIllustration";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

export function Introduction() {
  return (
    <Section id="need" title="Agent wallets are rarely hacked. They are tricked.">
      <div className="panel feature-panel reveal-child">
        <svg className="panel-watermark" viewBox="0 0 240 240" aria-hidden="true">
          <circle cx="120" cy="120" r="72" fill="none" stroke="rgba(15, 23, 42, 0.06)" strokeWidth="2" />
          <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="2" />
        </svg>

        <div className="relative">
          <HandoverIllustration />
        </div>

        <div className="feature-copy">
          <h3 className="heading-card">
            The gap is between what you asked and what the transaction does.
          </h3>
          <p className="text-body">
            <strong>Airlock starts there.</strong> Before anything is signed, it checks what the transaction will actually do against what you allowed.
          </p>

          <ul className="challenge-list">
            {challenges.map((item) => (
              <li key={item.number}>
                <span className="index">{item.number}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button variant="primary" href="/#process" className="has-arrow">
            <span>See how it works</span>
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </Section>
  );
}
