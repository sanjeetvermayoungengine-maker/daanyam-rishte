import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { StepIndicator } from "../../components/StepIndicator";
import { setCurrentStep, updateHoroscope, type HoroscopeDetails, type MarsDosha } from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { nakshatraOptions, rashiOptions, suggestRashiFromDate } from "../../utils/astroCalculations";
import { hasErrors, validateHoroscopeDetails } from "../../utils/validation";

export function Step4Horoscope() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const horoscope = useAppSelector((state) => state.bioData.horoscope);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => validateHoroscopeDetails(horoscope), [horoscope]);
  const isInvalid = hasErrors(errors);

  const updateField = (key: keyof HoroscopeDetails, value: string) => {
    dispatch(updateHoroscope({ [key]: value }));
  };

  const handleDobChange = (value: string) => {
    dispatch(
      updateHoroscope({
        dob: value,
        rashi: horoscope.rashi || suggestRashiFromDate(value)
      })
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (isInvalid) {
      return;
    }

    dispatch(setCurrentStep(5));
    navigate("/biodata/template");
  };

  return (
    <section className="page-shell page-shell--narrow">
      <form className="form-panel" onSubmit={handleSubmit}>
        <StepIndicator current={4} />
        <div className="section-heading">
          <p className="eyebrow">Horoscope</p>
          <h1>Kundali details</h1>
          <p className="muted-text">Capture astrological information that can be shared selectively.</p>
        </div>

        <div className="form-grid form-grid--two">
          <FormField
            label="Date of Birth"
            name="horoscopeDob"
            type="date"
            value={horoscope.dob}
            required
            error={submitted ? errors.dob : undefined}
            onChange={handleDobChange}
          />
          <FormField
            label="Birth Time"
            name="birthTime"
            type="time"
            value={horoscope.birthTime}
            required
            error={submitted ? errors.birthTime : undefined}
            onChange={(value) => updateField("birthTime", value)}
          />
          <FormField
            label="Birth Place"
            name="birthPlace"
            value={horoscope.birthPlace}
            required
            error={submitted ? errors.birthPlace : undefined}
            onChange={(value) => updateField("birthPlace", value)}
          />
          <FormField
            label="Rashi"
            name="rashi"
            type="select"
            options={rashiOptions}
            value={horoscope.rashi}
            required
            error={submitted ? errors.rashi : undefined}
            onChange={(value) => updateField("rashi", value)}
          />
          <FormField
            label="Nakshatra"
            name="nakshatra"
            type="select"
            options={nakshatraOptions}
            value={horoscope.nakshatra}
            required
            error={submitted ? errors.nakshatra : undefined}
            onChange={(value) => updateField("nakshatra", value)}
          />
          <FormField
            label="Gotra"
            name="gotra"
            value={horoscope.gotra}
            onChange={(value) => updateField("gotra", value)}
          />
        </div>

        <fieldset className="segmented-field">
          <legend>Mars Dosha</legend>
          {(["yes", "no", "unknown"] as MarsDosha[]).map((option) => (
            <label key={option} className={horoscope.marsDosha === option ? "segment segment--active" : "segment"}>
              <input
                type="radio"
                name="marsDosha"
                value={option}
                checked={horoscope.marsDosha === option}
                onChange={() => updateField("marsDosha", option)}
              />
              {option === "yes" ? "Yes" : option === "no" ? "No" : "Unknown"}
            </label>
          ))}
        </fieldset>

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(3));
              navigate("/biodata/family");
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
