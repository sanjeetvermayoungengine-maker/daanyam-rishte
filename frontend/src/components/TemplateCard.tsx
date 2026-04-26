import type { TemplateId } from "../store/bioDataSlice";

type TemplateCardProps = {
  id: TemplateId;
  name: string;
  description: string;
  selected: boolean;
  accent: string;
  onSelect: (template: TemplateId) => void;
};

function TemplatePreview({ id, accent }: { id: TemplateId; accent: string }) {
  if (id === "traditional") {
    return (
      <span className="template-card__preview template-card__preview--traditional" style={{ borderColor: accent }}>
        <span className="template-mini__ornament template-mini__ornament--tl" />
        <span className="template-mini__ornament template-mini__ornament--tr" />
        <span className="template-mini__ornament template-mini__ornament--bl" />
        <span className="template-mini__ornament template-mini__ornament--br" />
        <span className="template-mini__header-line" />
        <span className="template-mini__traditional-top">
          <span className="template-mini__avatar" />
          <span className="template-mini__text-block">
            <span className="template-mini__title" />
            <span className="template-mini__line template-mini__line--short" />
          </span>
        </span>
        <span className="template-mini__grid template-mini__grid--two">
          <span />
          <span />
        </span>
      </span>
    );
  }

  if (id === "modern") {
    return (
      <span className="template-card__preview template-card__preview--modern" style={{ borderColor: accent }}>
        <span className="template-mini__modern-header">
          <span className="template-mini__modern-title" />
          <span className="template-mini__avatar template-mini__avatar--sm" />
        </span>
        <span className="template-mini__pills">
          <span />
          <span />
          <span />
        </span>
        <span className="template-mini__grid template-mini__grid--two">
          <span />
          <span />
        </span>
      </span>
    );
  }

  if (id === "premium") {
    return (
      <span className="template-card__preview template-card__preview--premium" style={{ borderColor: accent }}>
        <span className="template-mini__premium-line" />
        <span className="template-mini__avatar template-mini__avatar--gold" />
        <span className="template-mini__premium-title" />
        <span className="template-mini__grid template-mini__grid--two">
          <span />
          <span />
        </span>
      </span>
    );
  }

  return (
    <span className="template-card__preview template-card__preview--split" style={{ borderColor: accent }}>
      <span className="template-mini__split-left">
        <span className="template-mini__avatar template-mini__avatar--split" />
      </span>
      <span className="template-mini__split-right">
        <span className="template-mini__title" />
        <span className="template-mini__line" />
        <span className="template-mini__grid template-mini__grid--two">
          <span />
          <span />
        </span>
      </span>
    </span>
  );
}

export function TemplateCard({
  id,
  name,
  description,
  selected,
  accent,
  onSelect
}: TemplateCardProps) {
  return (
    <button
      className={selected ? "template-card template-card--selected" : "template-card"}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(id)}
    >
      <TemplatePreview id={id} accent={accent} />
      <strong>{name}</strong>
      <span>{description}</span>
    </button>
  );
}
