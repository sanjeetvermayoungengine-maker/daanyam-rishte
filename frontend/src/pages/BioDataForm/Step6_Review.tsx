import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StepIndicator } from "../../components/StepIndicator";
import { TemplateViewModern } from "../../components/TemplateView_Modern";
import { TemplateViewPremium } from "../../components/TemplateView_Premium";
import { TemplateViewTraditional } from "../../components/TemplateView_Traditional";
import { setCurrentStep, submitBioData } from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const editLinks = [
  { label: "Personal details", to: "/biodata/personal" },
  { label: "Photos", to: "/biodata/photos" },
  { label: "Family", to: "/biodata/family" },
  { label: "Horoscope", to: "/biodata/horoscope" },
  { label: "Template", to: "/biodata/template" }
];

export function Step6Review() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bioData = useAppSelector((state) => state.bioData);
  const [confirmed, setConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = () => {
    if (!confirmed || isSaving) {
      return;
    }

    setIsSaving(true);
    window.setTimeout(() => {
      dispatch(submitBioData(new Date().toISOString()));
      setIsSaving(false);
      navigate("/preview");
    }, 450);
  };

  return (
    <section className="page-shell">
      <div className="review-layout">
        <aside className="review-sidebar">
          <StepIndicator current={7} />
          <div className="section-heading">
            <p className="eyebrow">Review</p>
            <h1>Review and submit</h1>
            <p className="muted-text">Check each section before publishing the biodata draft.</p>
          </div>

          <nav className="edit-list" aria-label="Edit sections">
            {editLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                Edit {link.label}
              </Link>
            ))}
          </nav>

          <label className="check-row">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>I confirm that this biodata is ready to create.</span>
          </label>

          <div className="form-actions form-actions--stacked">
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                dispatch(setCurrentStep(5));
                navigate("/biodata/template");
              }}
            >
              Back
            </button>
            <button
              className="button button--primary"
              type="button"
              disabled={!confirmed || isSaving}
              onClick={handleSubmit}
            >
              {isSaving ? "Creating..." : "Create My Biodata"}
            </button>
          </div>
        </aside>

        <div className="review-preview">
          {bioData.template === "modern" ? (
            <TemplateViewModern bioData={bioData} />
          ) : bioData.template === "premium" ? (
            <TemplateViewPremium bioData={bioData} />
          ) : (
            <TemplateViewTraditional bioData={bioData} />
          )}
        </div>
      </div>
    </section>
  );
}
