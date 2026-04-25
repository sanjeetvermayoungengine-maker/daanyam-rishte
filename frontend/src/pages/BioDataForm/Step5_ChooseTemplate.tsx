import { useNavigate } from "react-router-dom";
import { StepIndicator } from "../../components/StepIndicator";
import { TemplateCard } from "../../components/TemplateCard";
import { TemplateViewModern } from "../../components/TemplateView_Modern";
import { TemplateViewPremium } from "../../components/TemplateView_Premium";
import { TemplateViewSplit } from "../../components/TemplateView_Split";
import { TemplateViewTraditional } from "../../components/TemplateView_Traditional";
import { setCurrentStep, setTemplate, type TemplateId } from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const templates: Array<{
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
}> = [
  {
    id: "traditional",
    name: "Traditional",
    description: "Parchment-style with gold ornaments and warm tones.",
    accent: "#c9921a"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean white card with a bold teal gradient header.",
    accent: "#0f766e"
  },
  {
    id: "premium",
    name: "Premium",
    description: "Dark navy with gold accents for a luxury feel.",
    accent: "#d4a827"
  },
  {
    id: "split",
    name: "Split",
    description: "Bold crimson sidebar paired with a clean white layout.",
    accent: "#b42318"
  }
];

export function Step5ChooseTemplate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bioData = useAppSelector((state) => state.bioData);

  const selectTemplate = (template: TemplateId) => {
    dispatch(setTemplate(template));
  };

  function renderPreview() {
    switch (bioData.template) {
      case "traditional":
        return <TemplateViewTraditional bioData={bioData} />;
      case "modern":
        return <TemplateViewModern bioData={bioData} />;
      case "premium":
        return <TemplateViewPremium bioData={bioData} />;
      case "split":
        return <TemplateViewSplit bioData={bioData} />;
      default:
        return <TemplateViewTraditional bioData={bioData} />;
    }
  }

  return (
    <section className="page-shell">
      <div className="form-panel">
        <StepIndicator current={5} />
        <div className="section-heading">
          <p className="eyebrow">Template</p>
          <h1>Choose a presentation style</h1>
          <p className="muted-text">Your selected template is used for preview and shared views.</p>
        </div>

        <div className="template-layout">
          <div className="template-options">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                {...template}
                selected={bioData.template === template.id}
                onSelect={selectTemplate}
              />
            ))}
          </div>

          <div className="template-preview-panel">
            {renderPreview()}
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(4));
              navigate("/biodata/horoscope");
            }}
          >
            Back
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(6));
              navigate("/biodata/review");
            }}
          >
            Review
          </button>
        </div>
      </div>
    </section>
  );
}
