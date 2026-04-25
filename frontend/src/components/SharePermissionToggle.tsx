import type { SharePermissions } from "../store/bioDataSlice";

type PermissionKey = keyof SharePermissions;

type SharePermissionToggleProps = {
  id: PermissionKey;
  label: string;
  description: string;
  checked: boolean;
  onChange: (id: PermissionKey, checked: boolean) => void;
};

export function SharePermissionToggle({
  id,
  label,
  description,
  checked,
  onChange
}: SharePermissionToggleProps) {
  return (
    <label className="permission-toggle">
      <span className="permission-toggle__copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className="permission-toggle__control">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(id, event.target.checked)}
        />
        <span className="permission-toggle__track" aria-hidden="true">
          <span className="permission-toggle__thumb" />
        </span>
      </span>
    </label>
  );
}
