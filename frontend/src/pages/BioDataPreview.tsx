import { useState } from "react";
import { Link } from "react-router-dom";
import { ShareModal } from "../components/ShareModal";
import { TemplateViewModern } from "../components/TemplateView_Modern";
import { TemplateViewPremium } from "../components/TemplateView_Premium";
import { TemplateViewSplit } from "../components/TemplateView_Split";
import { TemplateViewTraditional } from "../components/TemplateView_Traditional";
import type { BioDataState } from "../store/bioDataSlice";
import { useAppSelector } from "../store/hooks";
import { hasStartedBioData } from "../utils/formHelpers";

const sampleBioData: BioDataState = {
  personalDetails: {
    fullName: "Priya Sharma",
    dob: "1998-08-15",
    phone: "",
    email: "",
    religion: "Hindu",
    caste: "Brahmin",
    height: "5'4\"",
    profession: "Software Engineer",
    education: "B.Tech, IIT Delhi",
    income: "18-25 LPA",
  },
  photos: {
    items: [],
    primaryPhotoId: null,
  },
  family: {
    fatherName: "Rajesh Sharma",
    motherName: "Sunita Sharma",
    fatherOccupation: "Chartered Accountant",
    motherOccupation: "Homemaker",
    siblings: [{ id: "sample-sibling-1", name: "Aman Sharma", occupation: "Consultant" }],
    familyType: "Nuclear",
    location: "Mumbai",
  },
  horoscope: {
    dob: "1998-08-15",
    birthTime: "09:30",
    birthPlace: "New Delhi, Delhi, India",
    selectedBirthPlaceLabel: "New Delhi, Delhi, India",
    birthLatitude: "28.6139",
    birthLongitude: "77.2090",
    birthTimezone: "Asia/Kolkata",
    birthLocation: {
      displayName: "New Delhi, Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
      country: "India",
      region: null,
      state: "Delhi",
      confidence: 0.7,
    },
    gotra: "Bharadwaj",
    marsDosha: "no",
    computedKundli: {
      status: "ready",
      error: null,
      result: {
        rashi: "Kanya",
        nakshatra: "Hasta",
        pada: 2,
        lagna: "Tula",
        dashaSummary: "Maha: Venus (2024-01-01 to 2044-01-01)",
        generatedAt: "2026-04-26T00:00:00.000Z",
        source: "astro_engine",
        engine: {
          apiVersion: "sample",
          engineSemanticVersion: "sample",
          schemaVersion: "chart_sidereal_v1",
          ayanamsa: "lahiri",
          houseSystem: "whole_sign",
        },
        rawEngineResponse: null,
      },
    },
  },
  template: "traditional",
  currentStep: 6,
  shares: [],
  submittedAt: "2026-04-26T00:00:00.000Z",
  isLoading: false,
  error: null,
};

export function BioDataPreview() {
  const bioData = useAppSelector((state) => state.bioData);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const isSamplePreview = !hasStartedBioData(bioData);
  const previewData = isSamplePreview ? sampleBioData : bioData;

  function renderTemplate() {
    switch (previewData.template) {
      case "modern":
        return <TemplateViewModern bioData={previewData} />;
      case "premium":
        return <TemplateViewPremium bioData={previewData} />;
      case "split":
        return <TemplateViewSplit bioData={previewData} />;
      default:
        return <TemplateViewTraditional bioData={previewData} />;
    }
  }

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Preview</p>
          <h1>{isSamplePreview ? "Sample Biodata" : "Biodata Preview"}</h1>
          <p className="muted-text">
            {isSamplePreview
              ? "Explore how a finished biodata looks before creating your own."
              : "Review the selected template before sharing with families or recipients."}
          </p>
        </div>
        <div className="toolbar-actions">
          <Link className="button button--secondary" to="/biodata/personal">
            {isSamplePreview ? "Create Yours" : "Edit"}
          </Link>
          {!isSamplePreview ? (
            <button className="button button--primary" type="button" onClick={() => setIsShareOpen(true)}>
              Share
            </button>
          ) : null}
        </div>
      </div>

      <div className="preview-frame">
        {renderTemplate()}
      </div>

      {!isSamplePreview ? (
        <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} source="preview_page" />
      ) : null}
    </section>
  );
}
