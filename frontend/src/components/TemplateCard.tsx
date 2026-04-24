import type { TemplateId } from "../store/bioDataSlice";

type TemplateCardProps = {
  id: TemplateId;
  name: string;
  description: string;
  selected: boolean;
  accent: string;
  onSelect: (template: TemplateId) => void;
};

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
      <span className="template-card__preview" style={{ borderColor: accent }}>
        <span className="template-preview-line template-preview-line--title" style={{ background: accent }} />
        <span className="template-preview-line" />
        <span className="template-preview-line template-preview-line--short" />
        <span className="template-preview-grid">
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>
      <strong>{name}</strong>
      <span>{description}</span>
    </button>
  );
}
