import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FamilyMemberField } from "../../components/FamilyMemberField";
import { FormField } from "../../components/FormField";
import { StepIndicator } from "../../components/StepIndicator";
import {
  addSibling,
  removeSibling,
  setCurrentStep,
  updateFamily,
  updateSibling,
  type FamilyDetails
} from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hasErrors, validateFamilyDetails } from "../../utils/validation";

export function Step3Family() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const family = useAppSelector((state) => state.bioData.family);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => validateFamilyDetails(family), [family]);
  const isInvalid = hasErrors(errors);

  const updateField = (key: keyof Omit<FamilyDetails, "siblings">, value: string) => {
    dispatch(updateFamily({ [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (isInvalid) {
      return;
    }

    dispatch(setCurrentStep(4));
    navigate("/biodata/horoscope");
  };

  return (
    <section className="page-shell page-shell--narrow">
      <form className="form-panel" onSubmit={handleSubmit}>
        <StepIndicator current={3} />
        <div className="section-heading">
          <p className="eyebrow">Family</p>
          <h1>Family background</h1>
          <p className="muted-text">Add parents, siblings, and home location.</p>
        </div>

        <div className="form-grid form-grid--two">
          <FormField
            label="Father's Name"
            name="fatherName"
            value={family.fatherName}
            required
            error={submitted ? errors.fatherName : undefined}
            onChange={(value) => updateField("fatherName", value)}
          />
          <FormField
            label="Mother's Name"
            name="motherName"
            value={family.motherName}
            required
            error={submitted ? errors.motherName : undefined}
            onChange={(value) => updateField("motherName", value)}
          />
          <FormField
            label="Father's Occupation"
            name="fatherOccupation"
            value={family.fatherOccupation}
            onChange={(value) => updateField("fatherOccupation", value)}
          />
          <FormField
            label="Mother's Occupation"
            name="motherOccupation"
            value={family.motherOccupation}
            onChange={(value) => updateField("motherOccupation", value)}
          />
          <FormField
            label="Family Type"
            name="familyType"
            type="select"
            options={["Joint", "Nuclear"]}
            value={family.familyType}
            required
            error={submitted ? errors.familyType : undefined}
            onChange={(value) => updateField("familyType", value)}
          />
          <FormField
            label="Location / City"
            name="location"
            value={family.location}
            required
            error={submitted ? errors.location : undefined}
            onChange={(value) => updateField("location", value)}
          />
        </div>

        <div className="subsection-header">
          <h2>Siblings</h2>
          <button className="button button--secondary" type="button" onClick={() => dispatch(addSibling())}>
            Add Sibling
          </button>
        </div>

        <div className="stack">
          {family.siblings.map((sibling, index) => (
            <FamilyMemberField
              key={sibling.id}
              sibling={sibling}
              index={index}
              canRemove={family.siblings.length > 1}
              onChange={(id, updates) => dispatch(updateSibling({ id, updates }))}
              onRemove={(id) => dispatch(removeSibling(id))}
            />
          ))}
        </div>

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(2));
              navigate("/biodata/photos");
            }}
          >
            Back
          </button>
          <button className="button button--primary" type="submit" disabled={submitted && isInvalid}>
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
