import { useMemo, useState } from "react";
import { createShare, type SharePermissions } from "../store/bioDataSlice";
import { useAppDispatch } from "../store/hooks";
import { defaultSharePermissions } from "../services/shareService";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { SharePermissionToggle } from "./SharePermissionToggle";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const permissionCopy = [
  {
    id: "viewBasic" as const,
    label: "Basic details",
    description: "Name, profession, education, family summary"
  },
  {
    id: "viewPhotos" as const,
    label: "Photos",
    description: "Profile and gallery photos"
  },
  {
    id: "viewHoroscope" as const,
    label: "Horoscope",
    description: "Birth time, rashi, nakshatra, gotra"
  },
  {
    id: "viewContact" as const,
    label: "Contact",
    description: "Phone number and email"
  }
];

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const dispatch = useAppDispatch();
  const defaultExpiry = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().slice(0, 10);
  }, []);
  const [recipient, setRecipient] = useState("");
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);
  const [permissions, setPermissions] = useState<SharePermissions>(defaultSharePermissions);
  const [error, setError] = useState("");

  const updatePermission = (id: keyof SharePermissions, checked: boolean) => {
    setPermissions((current) => ({ ...current, [id]: checked }));
  };

  const handleSubmit = () => {
    if (!recipient.trim()) {
      setError("Add an email or label for this share.");
      return;
    }

    dispatch(
      createShare({
        recipient: recipient.trim(),
        expiryDate,
        permissions
      })
    );

    setRecipient("");
    setPermissions(defaultSharePermissions);
    setError("");
    onClose();
  };

  return (
    <Modal title="Create Share" isOpen={isOpen} onClose={onClose}>
      <div className="modal-body">
        <FormField
          label="Recipient or label"
          name="share-recipient"
          value={recipient}
          required
          placeholder="name@example.com or Sharma family"
          error={error}
          onChange={setRecipient}
        />
        <FormField
          label="Expiry date"
          name="share-expiry"
          type="date"
          value={expiryDate}
          required
          onChange={setExpiryDate}
        />

        <div className="permission-list">
          {permissionCopy.map((permission) => (
            <SharePermissionToggle
              key={permission.id}
              {...permission}
              checked={permissions[permission.id]}
              onChange={updatePermission}
            />
          ))}
        </div>
      </div>
      <div className="modal-actions">
        <button className="button button--secondary" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="button button--primary" type="button" onClick={handleSubmit}>
          Create Link
        </button>
      </div>
    </Modal>
  );
}
