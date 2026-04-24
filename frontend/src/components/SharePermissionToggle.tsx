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
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(id, event.target.checked)}
      />
    </label>
  );
}
