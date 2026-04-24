import { Link } from "react-router-dom";

type HeroSectionProps = {
  hasDraft: boolean;
  hasPublished: boolean;
};

export function HeroSection({ hasDraft, hasPublished }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow">Matrimonial biodata platform</p>
        <h1>Rishta</h1>
        <p className="lede">
          Create a polished biodata, choose a presentation style, and share only the sections each
          recipient should see.
        </p>
        <div className="hero-actions">
          <Link className="button button--primary" to="/biodata/personal">
            {hasDraft ? "Continue Biodata" : "Create My Biodata"}
          </Link>
          <Link className="button button--secondary" to="/preview">
            {hasPublished ? "View My Biodata" : "Preview Draft"}
          </Link>
        </div>
      </div>

      <div className="hero__preview" aria-label="Biodata preview sample">
        <div className="sample-sheet">
          <span className="sample-photo" />
          <span className="sample-line sample-line--wide" />
          <span className="sample-line" />
          <span className="sample-line sample-line--short" />
          <div className="sample-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
