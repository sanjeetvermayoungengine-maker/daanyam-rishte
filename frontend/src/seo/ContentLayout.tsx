import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Crumb = { label: string; to?: string };

type ContentLayoutProps = {
  /** Page H1 — the main heading rendered above content. */
  heading: string;
  /** Optional subheading rendered below the H1. */
  subheading?: string;
  /** Breadcrumb trail (rendered above the heading). */
  breadcrumbs?: Crumb[];
  /** Page body. */
  children: ReactNode;
};

/**
 * Layout used by all public content pages (biodata-format, kundli-milan,
 * vivah-muhurat, blog posts, etc.).
 *
 * Deliberately does NOT depend on Auth/Redux so the page can be statically
 * prerendered and so the static HTML can be served to crawlers immediately.
 */
export function ContentLayout({ heading, subheading, breadcrumbs, children }: ContentLayoutProps) {
  return (
    <div className="content-page">
      <header className="content-header">
        <div className="content-header__inner">
          <Link className="content-brand" to="/">
            <span className="content-brand__mark" aria-hidden="true">
              र
            </span>
            <span className="content-brand__text">
              <strong>Rishte</strong>
              <small>by Daanyam</small>
            </span>
          </Link>
          <nav className="content-nav" aria-label="Primary">
            <Link to="/biodata-format" className="content-nav__link">
              Biodata Formats
            </Link>
            <Link to="/kundli-milan" className="content-nav__link">
              Kundli Milan
            </Link>
            <Link to="/vivah-muhurat/2026" className="content-nav__link">
              Vivah Muhurat
            </Link>
            <Link to="/onboarding" className="content-nav__cta">
              Create Biodata
            </Link>
          </nav>
        </div>
      </header>

      <main className="content-main">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="content-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              {breadcrumbs.map((c, i) => (
                <li key={i}>
                  {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1 className="content-heading">{heading}</h1>
        {subheading ? <p className="content-subheading">{subheading}</p> : null}

        <article className="content-article">{children}</article>

        <section className="content-cta">
          <h2 className="content-cta__heading">Ready to create your biodata?</h2>
          <p className="content-cta__body">
            Build a beautiful marriage biodata on Rishte — share it privately with families, on your terms. Free to start.
          </p>
          <Link to="/onboarding" className="content-cta__button">
            Create Your Biodata Free
          </Link>
        </section>
      </main>

      <footer className="content-footer">
        <div className="content-footer__inner">
          <div className="content-footer__col">
            <h3>Rishte by Daanyam</h3>
            <p>
              Private marriage biodata creation and sharing — powered by{" "}
              <a href="https://daanyam.in" target="_blank" rel="noopener">
                Daanyam's
              </a>{" "}
              Vedic astrology engine.
            </p>
          </div>
          <div className="content-footer__col">
            <h4>Biodata Formats</h4>
            <ul>
              <li>
                <Link to="/biodata-format">Marriage Biodata Format</Link>
              </li>
              <li>
                <Link to="/biodata-format/boy">Format for Boys</Link>
              </li>
              <li>
                <Link to="/biodata-format/girl">Format for Girls</Link>
              </li>
              <li>
                <Link to="/biodata-format/hindi">Hindi Biodata</Link>
              </li>
              <li>
                <Link to="/biodata-format/marathi">Marathi Biodata</Link>
              </li>
              <li>
                <Link to="/biodata-format/gujarati">Gujarati Biodata</Link>
              </li>
            </ul>
          </div>
          <div className="content-footer__col">
            <h4>Astrology &amp; Wedding</h4>
            <ul>
              <li>
                <Link to="/kundli-milan">Kundli Milan</Link>
              </li>
              <li>
                <Link to="/kundli-milan/ashtakoot">Ashtakoot Matching</Link>
              </li>
              <li>
                <Link to="/kundli-milan/manglik">Manglik Dosha</Link>
              </li>
              <li>
                <Link to="/vivah-muhurat/2026">Vivah Muhurat 2026</Link>
              </li>
              <li>
                <Link to="/wedding-checklist">Wedding Checklist</Link>
              </li>
            </ul>
          </div>
          <div className="content-footer__col">
            <h4>About</h4>
            <ul>
              <li>
                <Link to="/privacy-first-matchmaking">Privacy-First Matchmaking</Link>
              </li>
              <li>
                <Link to="/blog/why-not-matrimonial-sites">vs. Matrimonial Sites</Link>
              </li>
              <li>
                <a href="https://daanyam.in" target="_blank" rel="noopener">
                  Daanyam
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="content-footer__bottom">
          <small>
            © {new Date().getFullYear()} Rishte by Daanyam. Built with care for Indian families.
          </small>
        </div>
      </footer>
    </div>
  );
}

/** Small inline FAQ component that pairs with FAQPage JSON-LD on the page. */
export function FAQSection({
  faqs,
  heading = "Frequently Asked Questions",
}: {
  faqs: Array<{ question: string; answer: string }>;
  heading?: string;
}) {
  return (
    <section className="content-faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="content-faq__heading">
        {heading}
      </h2>
      <dl className="content-faq__list">
        {faqs.map((f, i) => (
          <div className="content-faq__item" key={i}>
            <dt className="content-faq__question">{f.question}</dt>
            <dd className="content-faq__answer">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Inline cross-link banner to Daanyam — used on kundli/muhurat pages. */
export function DaanyamCrossLink({
  href,
  heading,
  body,
  cta,
}: {
  href: string;
  heading: string;
  body: string;
  cta: string;
}) {
  return (
    <aside className="content-crosslink">
      <h3 className="content-crosslink__heading">{heading}</h3>
      <p className="content-crosslink__body">{body}</p>
      <a
        className="content-crosslink__cta"
        href={`${href}?utm_source=rishte&utm_medium=crosslink&utm_campaign=content`}
        target="_blank"
        rel="noopener"
      >
        {cta} →
      </a>
    </aside>
  );
}
