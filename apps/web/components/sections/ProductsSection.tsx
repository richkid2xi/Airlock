'use client';

import { products } from "@/content/products";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/layout/Section";

export function ProductsSection() {
  return (
    <Section
      id="modules"
      title="Four layers, one firewall."
      intro="Each layer is built to hold even if the one before it is fooled."
    >
      <div className="product-grid">
        {products.map((product, i) => (
          <article
            key={product.number}
            className="reveal-child"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("airlock-open-demo", { detail: { view: product.id === "policy-vault" ? "Agents" : product.id === "attack-lab" ? "Attack Lab" : "Live feed" } }))}
              className="product-card has-arrow"
              aria-label={`View details for ${product.name}`}
            >
              <div className="product-media">
                <img
                  src={product.image}
                  alt=""
                  width={600}
                  height={375}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== product.imageFallback && product.imageFallback) {
                      target.src = product.imageFallback;
                    }
                  }}
                />
                <Badge>{product.number}</Badge>
                <Badge variant="status">{product.status}</Badge>
              </div>
              <div className="product-body">
                <p className="text-caption">{product.category}</p>
                <h3 className="heading-item">{product.name}</h3>
                <p className="text-small">{product.description}</p>
                <span className="text-link">
                  See in demo
                  <ArrowIcon />
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>
    </Section>
  );
}
