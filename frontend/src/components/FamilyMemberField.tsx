import type { Sibling } from "../store/bioDataSlice";
import { FormField } from "./FormField";

type FamilyMemberFieldProps = {
  sibling: Sibling;
  index: number;
  canRemove: boolean;
  onChange: (id: string, updates: Partial<Omit<Sibling, "id">>) => void;
  onRemove: (id: string) => void;
};

export function FamilyMemberField({
  sibling,
  index,
  canRemove,
  onChange,
  onRemove
}: FamilyMemberFieldProps) {
  return (
    <div className="sibling-row">
      <div className="sibling-row__header">
        <h3>Sibling {index + 1}</h3>
        {canRemove ? (
          <button className="text-button" type="button" onClick={() => onRemove(sibling.id)}>
            Remove
          </button>
        ) : null}
      </div>
      <div className="form-grid form-grid--two">
        <FormField
          label="Name"
          name={`sibling-${sibling.id}-name`}
          value={sibling.name}
          placeholder="Sibling name"
          onChange={(value) => onChange(sibling.id, { name: value })}
        />
        <FormField
          label="Occupation"
          name={`sibling-${sibling.id}-occupation`}
          value={sibling.occupation}
          placeholder="Occupation or education"
          onChange={(value) => onChange(sibling.id, { occupation: value })}
        />
      </div>
    </div>
  );
}
