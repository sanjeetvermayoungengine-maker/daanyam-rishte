import type { BioDataState } from "../store/bioDataSlice";
import { TemplateViewTraditional } from "./TemplateView_Traditional";

type TemplateViewModernProps = {
  bioData: BioDataState;
  showPhotos?: boolean;
  showHoroscope?: boolean;
  showContact?: boolean;
};

export function TemplateViewModern({
  bioData,
  showPhotos = true,
  showHoroscope = true,
  showContact = true
}: TemplateViewModernProps) {
  return (
    <div className="modern-template">
      <TemplateViewTraditional
        bioData={bioData}
        showPhotos={showPhotos}
        showHoroscope={showHoroscope}
        showContact={showContact}
      />
    </div>
  );
}
