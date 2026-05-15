import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN, type SeoRoute } from "./routes";

type SEOHeadProps = {
  route: SeoRoute;
  /** Optional override for the canonical URL. Defaults to SITE_ORIGIN + route.path */
  canonical?: string;
  /** Optional additional JSON-LD blocks to inject under <head>. */
  jsonLd?: Array<Record<string, unknown>>;
};

/**
 * Imperatively updates <head> tags for the current route.
 *
 * Why imperative DOM and not react-helmet?
 *   - At prerender time, our build script renders the static HTML with the
 *     correct tags already baked in (see scripts/prerender.mjs).
 *   - At runtime, this component keeps the tags in sync when users navigate
 *     between content pages within the SPA.
 *
 * The data-managed-by="seo-head" attribute marks tags we own so we can replace
 * them on the next route change without touching tags injected by index.html.
 */
export function SEOHead({ route, canonical, jsonLd }: SEOHeadProps) {
  useEffect(() => {
    const finalCanonical = canonical ?? `${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}`;
    const ogImage = route.ogImage ?? DEFAULT_OG_IMAGE;

    // Title
    document.title = route.title;

    // Replace meta + link tags we manage
    upsertMeta({ name: "description" }, route.description);
    upsertLink({ rel: "canonical" }, finalCanonical);

    upsertMeta({ property: "og:type" }, "website");
    upsertMeta({ property: "og:site_name" }, "Rishte by Daanyam");
    upsertMeta({ property: "og:title" }, route.title);
    upsertMeta({ property: "og:description" }, route.description);
    upsertMeta({ property: "og:url" }, finalCanonical);
    upsertMeta({ property: "og:image" }, ogImage);
    upsertMeta({ property: "og:locale" }, "en_IN");

    upsertMeta({ name: "twitter:card" }, "summary_large_image");
    upsertMeta({ name: "twitter:title" }, route.title);
    upsertMeta({ name: "twitter:description" }, route.description);
    upsertMeta({ name: "twitter:image" }, ogImage);

    // Replace any prior JSON-LD blocks owned by this component
    document.querySelectorAll('script[data-managed-by="seo-head"]').forEach((el) => el.remove());
    if (jsonLd && jsonLd.length > 0) {
      jsonLd.forEach((block) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-managed-by", "seo-head");
        s.textContent = JSON.stringify(block);
        document.head.appendChild(s);
      });
    }
  }, [route, canonical, jsonLd]);

  return null;
}

function upsertMeta(selector: { name?: string; property?: string }, content: string) {
  const key = selector.name ? `name="${selector.name}"` : `property="${selector.property}"`;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}]`);
  if (!el) {
    el = document.createElement("meta");
    if (selector.name) el.setAttribute("name", selector.name);
    if (selector.property) el.setAttribute("property", selector.property);
    el.setAttribute("data-managed-by", "seo-head");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(selector: { rel: string }, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${selector.rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", selector.rel);
    el.setAttribute("data-managed-by", "seo-head");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Builds an FAQPage JSON-LD block from an array of Q&A pairs. */
export function faqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Builds an Article JSON-LD block for blog-style content. */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ?? DEFAULT_OG_IMAGE,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    author: { "@type": "Organization", name: "Rishte by Daanyam" },
    publisher: {
      "@type": "Organization",
      name: "Rishte by Daanyam",
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/logo.png` },
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
  };
}
