import { faqs } from "@/content/faq";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/layout/Section";

export function Faq() {
  const accordionItems = faqs.map((faq, idx) => ({
    id: `faq-${idx}`,
    title: faq.question,
    content: faq.answer,
    defaultOpen: idx === 0,
  }));

  return (
    <Section
      id="faq"
      title="A useful place to begin."
      intro="Common questions about how Airlock works, what it protects, and what it does not."
    >
      <div className="panel faq-panel reveal-child">
        <Accordion items={accordionItems} />
      </div>
    </Section>
  );
}
