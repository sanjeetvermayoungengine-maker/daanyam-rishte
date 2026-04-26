import type { HoroscopeAccessLevel } from "../utils/sharePermissions";

type HoroscopeAccessControlProps = {
  name?: string;
  value: HoroscopeAccessLevel;
  onChange: (value: HoroscopeAccessLevel) => void;
};

const options: Array<{
  value: HoroscopeAccessLevel;
  label: string;
  description: string;
}> = [
  {
    value: "none",
    label: "Hidden",
    description: "Do not show horoscope or kundli details.",
  },
  {
    value: "summary",
    label: "Summary only",
    description: "Show a few key matches like rashi and nakshatra.",
  },
  {
    value: "detailed",
    label: "Full kundli",
    description: "Show detailed kundli fields and horoscope data.",
  },
];

export function HoroscopeAccessControl({ name = "horoscope-access", value, onChange }: HoroscopeAccessControlProps) {
  return (
    <div className="permission-toggle permission-toggle--stacked">
      <span className="permission-toggle__copy">
        <strong>Horoscope</strong>
        <small>Choose how much kundli information this link can reveal.</small>
      </span>
      <div className="horoscope-access-options" role="radiogroup" aria-label="Horoscope visibility">
        {options.map((option) => (
          <label
            key={option.value}
            className={value === option.value ? "horoscope-access-option horoscope-access-option--active" : "horoscope-access-option"}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
