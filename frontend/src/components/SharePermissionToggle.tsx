import type { SharePermissions } from "../store/bioDataSlice";

type PermissionKey = keyof SharePermissions;

type SharePermissionToggleProps = {
  id: PermissionKey;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (id: PermissionKey, checked: boolean) => void;
};

export function SharePermissionToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange
}: SharePermissionToggleProps) {
  return (
    <label className={disabled ? "permission-toggle permission-toggle--disabled" : "permission-toggle"}>
      <span className="permission-toggle__copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className="permission-toggle__control">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(id, event.target.checked)}
        />
        <span className="permission-toggle__track" aria-hidden="true">
          <span className="permission-toggle__thumb" />
        </span>
      </span>
    </label>
  );
}
