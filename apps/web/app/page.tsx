'use client';

import { useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Introduction } from '@/components/sections/Introduction';
import { Capabilities } from '@/components/sections/Capabilities';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { Process } from '@/components/sections/Process';
import { AboutSection } from '@/components/sections/AboutSection';
import { Faq } from '@/components/sections/Faq';
import { ContactSection } from '@/components/sections/ContactSection';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function HomePage() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <>
      <Hero />
      <Introduction />
      <Capabilities />
      <ProductsSection />
      <Process />
      <AboutSection />
      <Faq />
      <ContactSection />
    </>
  );
}
