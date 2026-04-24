import { useNavigate } from "react-router-dom";
import { PhotoUploader } from "../../components/PhotoUploader";
import { StepIndicator } from "../../components/StepIndicator";
import { setCurrentStep } from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export function Step2Photos() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photoCount = useAppSelector((state) => state.bioData.photos.items.length);

  const goNext = () => {
    dispatch(setCurrentStep(3));
    navigate("/biodata/family");
  };

  return (
    <section className="page-shell page-shell--narrow">
      <div className="form-panel">
        <StepIndicator current={2} />
        <div className="section-heading">
          <p className="eyebrow">Photos</p>
          <h1>Add profile photos</h1>
          <p className="muted-text">
            Add one or more photos and mark the primary image for biodata previews.
          </p>
        </div>

        <PhotoUploader />

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(1));
              navigate("/biodata/personal");
            }}
          >
            Back
          </button>
          <button className="button button--primary" type="button" onClick={goNext}>
            {photoCount ? "Next" : "Skip for Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
