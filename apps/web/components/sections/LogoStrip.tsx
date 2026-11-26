interface Partner {
  name: string;
  label: string;
  glyph: React.ReactNode;
}

const partners: Partner[] = [
  {
    name: "Solana",
    label: "Solana",
    glyph: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="6" />
        <path d="M16 9v14M9 16h14" />
      </>
    ),
  },
  {
    name: "Anchor",
    label: "Anchor",
    glyph: (
      <>
        <path d="M16 3 28 10v12l-12 7-12-7V10Z" />
        <circle cx="16" cy="16" r="4.5" />
      </>
    ),
  },
  {
    name: "LiteSVM",
    label: "LiteSVM",
    glyph: (
      <>
        <circle cx="16" cy="16" r="12.5" />
        <circle cx="16" cy="16" r="5.5" />
        <path d="M16 3.5V10M16 22v6.5M3.5 16H10M22 16h6.5" />
      </>
    ),
  },
  {
    name: "Next.js",
    label: "Next.js",
    glyph: (
      <>
        <path d="M16 3.5 28 10v12l-12 6.5L4 22V10Z" />
        <path d="m10.5 16 4 4 7-8" />
      </>
    ),
  },
  {
    name: "Claude",
    label: "Claude",
    glyph: (
      <>
        <rect x="4" y="4" width="24" height="24" rx="12" />
        <path d="M4.5 16c4-5 8-5 11.5 0s7.5 5 11.5 0" />
      </>
    ),
  },
];

/** Technology partner strip rendered directly below the hero. */
export function LogoStrip() {
  return (
    <div className="built-with-strip">
      <div className="built-with-strip-inner">
        <p className="built-with-label">Built with:</p>
        <ul className="built-with-list" aria-label="Technologies used">
        {partners.map((partner) => (
          <li key={partner.name} className="built-with-item" title={partner.name}>
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {partner.glyph}
            </svg>
            <span>
              {partner.label}
              {partner.label !== partner.name && <span className="sr-only"> — {partner.name}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}
