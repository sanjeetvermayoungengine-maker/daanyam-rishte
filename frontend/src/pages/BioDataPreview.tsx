import { useState } from "react";
import { Link } from "react-router-dom";
import { ShareModal } from "../components/ShareModal";
import { TemplateViewModern } from "../components/TemplateView_Modern";
import { TemplateViewPremium } from "../components/TemplateView_Premium";
import { TemplateViewSplit } from "../components/TemplateView_Split";
import { TemplateViewTraditional } from "../components/TemplateView_Traditional";
import { useAppSelector } from "../store/hooks";

export function BioDataPreview() {
  const bioData = useAppSelector((state) => state.bioData);
  const [isShareOpen, setIsShareOpen] = useState(false);

  function renderTemplate() {
    switch (bioData.template) {
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
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Preview</p>
          <h1>Biodata Preview</h1>
          <p className="muted-text">
            Review the selected template before sharing with families or recipients.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link className="button button--secondary" to="/biodata/personal">
            Edit
          </Link>
          <button className="button button--primary" type="button" onClick={() => setIsShareOpen(true)}>
            Share
          </button>
        </div>
      </div>

      <div className="preview-frame">
        {renderTemplate()}
      </div>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </section>
  );
}
