export interface NavItem {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export const headerNavItems: NavItem[] = [
  { label: "Use cases", href: "/#use-cases" },
  { label: "Modules", href: "/#modules" },
  { label: "How it works", href: "/#process" },
  { label: "About", href: "/#about" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Capabilities",
    links: [
      { label: "Simulation", href: "/#demo" },
      { label: "Policy limits", href: "/#demo" },
      { label: "Intent check", href: "/#demo" },
      { label: "Human approvals", href: "/#demo" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Policy Vault", href: "/#demo-agents" },
      { label: "Simulation Engine", href: "/#demo-feed" },
      { label: "Intent Check", href: "/#demo-feed" },
      { label: "Attack Lab", href: "/#demo-attacks" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "How it works", href: "/#process" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
];
