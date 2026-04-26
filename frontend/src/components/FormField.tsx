import type { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: Array<string | { label: string; value: string }>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"] | "textarea" | "select";
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>["rows"];
  onChange: (value: string) => void;
};

export function FormField({
  label,
  name,
  value,
  required = false,
  error,
  helperText,
  placeholder,
  options = [],
  type = "text",
  rows = 4,
  onChange
}: BaseProps) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const descriptionId = error ? errorId : helperText ? helperId : undefined;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChange(event.target.value);
  };

  return (
    <label className="form-field" htmlFor={fieldId}>
      <span className="form-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>

      {type === "select" ? (
        <select
          id={fieldId}
          name={name}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          onChange={handleChange}
        >
          <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option
              key={typeof option === "string" ? option : option.value}
              value={typeof option === "string" ? option : option.value}
            >
              {typeof option === "string" ? option : option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          onChange={handleChange}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          onChange={handleChange}
        />
      )}

      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : helperText ? (
        <span className="field-helper" id={helperId}>
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
