import { useState, FormEvent, ChangeEvent } from "react";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/layout/Section";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/airlock";

export interface ContactFormData {
  challenge: string;
  name: string;
  email: string;
  system: string;
  organization?: string;
  _hp_title?: string; // honeypot
}

export interface ContactSectionProps {
  /** Hide the centred section heading when the page already has its own H1 */
  showHeader?: boolean;
}

export function ContactSection({ showHeader = true }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    challenge: "",
    name: "",
    email: "",
    system: "",
    organization: "",
    _hp_title: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.challenge.trim()) {
      nextErrors.challenge = "Please describe what your agent does.";
    }
    if (!formData.name.trim()) {
      nextErrors.name = "Please provide your name.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Please provide your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData._hp_title) {
      // Spam honeypot triggered
      setStatus("success");
      setStatusMessage("Thank you for your note. We will review your inquiry shortly.");
      return;
    }

    if (!validate()) return;

    setStatus("submitting");

    // Client-side submission handling
    setTimeout(() => {
      setStatus("success");
      setStatusMessage("Demo form: nothing was sent.");
      setFormData({
        challenge: "",
        name: "",
        email: "",
        system: "",
        organization: "",
        _hp_title: "",
      });
    }, 600);
  };

  return (
    <Section
      id="contact"
      title={showHeader ? "Tell us what your agent does." : undefined}
      className={showHeader ? undefined : "!pt-0"}
    >
      <div className="panel contact-panel reveal-child">
        <svg className="panel-watermark" viewBox="0 0 240 240" aria-hidden="true">
          <circle cx="120" cy="120" r="72" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="2" />
          <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(15, 23, 42, 0.035)" strokeWidth="2" />
        </svg>

        <div className="relative">
          <h3 className="heading-card">A short note is enough.</h3>
          <p className="text-body mt-5">
            Describe the agent, the wallet it controls, and what you would never want it to do.
          </p>
          <dl className="fact-list">
            {CONTACT_EMAIL && (
              <div className="fact-row">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-link">
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
            )}
            <div className="fact-row">
              <dt>GitHub</dt>
              <dd>
                <a href={GITHUB_URL} className="text-link">View project</a>
              </dd>
            </div>
            <div className="fact-row">
              <dt>Demo</dt>
              <dd>
                <a href="#projects" className="text-link">See the dashboard</a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="contact-form-card relative">
          <form onSubmit={handleSubmit} noValidate>
            {/* Spam Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-hp">Do not fill this field</label>
              <input
                id="contact-hp"
                type="text"
                name="_hp_title"
                tabIndex={-1}
                autoComplete="off"
                value={formData._hp_title}
                onChange={handleChange}
              />
            </div>

            <div className="contact-field">
              <Label htmlFor="contact-challenge">What does your agent do?</Label>
              <Textarea
                id="contact-challenge"
                name="challenge"
                rows={4}
                placeholder="Describe the agent, the wallet it controls, and what it must never do."
                value={formData.challenge}
                onChange={handleChange}
                error={errors.challenge}
                required
              />
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <Label htmlFor="contact-name">Your name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
              </div>

              <div className="contact-field">
                <Label htmlFor="contact-email">Work email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <Label htmlFor="contact-system">Which agent framework or wallet do you use?</Label>
              <Input
                id="contact-system"
                name="system"
                type="text"
                placeholder="e.g. custom agent, LangChain, Solana Agent Kit (optional)"
                value={formData.system}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                className="w-full has-arrow"
                disabled={status === "submitting"}
              >
                <span>{status === "submitting" ? "Sending..." : "Request a walkthrough"}</span>
                <ArrowIcon />
              </Button>
            </div>

            {/* Accessible Live Region for Submission Status */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="mt-4 text-sm text-center min-h-[20px]"
            >
              {status === "success" && (
                <p className="m-0 text-[var(--color-eyebrow-light)]">{statusMessage}</p>
              )}
              {status === "error" && <p className="m-0 text-red-300">{statusMessage}</p>}
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
