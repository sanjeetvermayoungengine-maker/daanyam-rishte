import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { StepIndicator } from "../../components/StepIndicator";
import { setCurrentStep, updatePersonalDetails, type PersonalDetails } from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hasErrors, validatePersonalDetails } from "../../utils/validation";

const religionOptions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Other"];
const heightOptions = ["4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"+"];
const educationOptions = ["High School", "Diploma", "Bachelor's", "Master's", "Doctorate", "Professional Degree"];
const incomeOptions = ["Prefer not to say", "Under 5 LPA", "5-10 LPA", "10-20 LPA", "20-35 LPA", "35 LPA+"];

const fieldConfig: Array<{
  key: keyof PersonalDetails;
  label: string;
  type?: "text" | "date" | "email" | "tel" | "select";
  options?: string[];
  required?: boolean;
}> = [
  { key: "fullName", label: "Full Name", required: true },
  { key: "dob", label: "Date of Birth", type: "date", required: true },
  { key: "phone", label: "Phone Number", type: "tel", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "religion", label: "Religion", type: "select", options: religionOptions, required: true },
  { key: "caste", label: "Caste" },
  { key: "height", label: "Height", type: "select", options: heightOptions, required: true },
  { key: "profession", label: "Profession", required: true },
  { key: "education", label: "Education", type: "select", options: educationOptions, required: true },
  { key: "income", label: "Income", type: "select", options: incomeOptions, required: true }
];

export function Step1PersonalDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const values = useAppSelector((state) => state.bioData.personalDetails);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => validatePersonalDetails(values), [values]);
  const isInvalid = hasErrors(errors);

  const updateField = (key: keyof PersonalDetails, value: string) => {
    dispatch(updatePersonalDetails({ [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (isInvalid) {
      return;
    }

    dispatch(setCurrentStep(2));
    navigate("/biodata/photos");
  };

  return (
    <section className="page-shell page-shell--narrow">
      <form className="form-panel" onSubmit={handleSubmit}>
        <StepIndicator current={1} />
        <div className="section-heading">
          <p className="eyebrow">Personal details</p>
          <h1>Start with the essentials</h1>
          <p className="muted-text">These details appear at the top of your biodata.</p>
        </div>

        <div className="form-grid form-grid--two">
          {fieldConfig.map((field) => (
            <FormField
              key={field.key}
              label={field.label}
              name={field.key}
              value={values[field.key]}
              type={field.type}
              options={field.options}
              required={field.required}
              error={submitted ? errors[field.key] : undefined}
              onChange={(value) => updateField(field.key, value)}
            />
          ))}
        </div>

        <div className="form-actions">
          <button className="button button--secondary" type="button" onClick={() => navigate("/")}>
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
