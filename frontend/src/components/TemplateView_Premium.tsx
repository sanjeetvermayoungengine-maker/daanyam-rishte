import type { BioDataState } from "../store/bioDataSlice";
import { TemplateViewTraditional } from "./TemplateView_Traditional";

type TemplateViewPremiumProps = {
  bioData: BioDataState;
  showPhotos?: boolean;
  showHoroscope?: boolean;
  showContact?: boolean;
};

export function TemplateViewPremium({
  bioData,
  showPhotos = true,
  showHoroscope = true,
  showContact = true
}: TemplateViewPremiumProps) {
  return (
    <div className="premium-template">
      <TemplateViewTraditional
        bioData={bioData}
        showPhotos={showPhotos}
        showHoroscope={showHoroscope}
        showContact={showContact}
        variant="premium"
      />
    </div>
  );
}
