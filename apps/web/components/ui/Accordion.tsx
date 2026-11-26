import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

function AccordionRow({ item }: { item: AccordionItemData }) {
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false);

  return (
    <details
      className="faq-item"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="faq-summary">
        <span>{item.title}</span>
        <span className="faq-icon" aria-hidden="true" />
      </summary>
      <div className="faq-answer">
        <p className="m-0">{item.content}</p>
      </div>
    </details>
  );
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("faq-accordion-list", className)}>
      {items.map((item) => (
        <AccordionRow key={item.id} item={item} />
      ))}
    </div>
  );
}
