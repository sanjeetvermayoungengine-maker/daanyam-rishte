import { useMemo, useState } from "react";
import { createShare, type SharePermissions, type ShareRecord } from "../store/bioDataSlice";
import { useAppDispatch } from "../store/hooks";
import { defaultSharePermissions } from "../services/shareService";
import { getPublicShareUrl } from "../utils/formHelpers";
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
  const [createdShare, setCreatedShare] = useState<ShareRecord | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const updatePermission = (id: keyof SharePermissions, checked: boolean) => {
    setPermissions((current) => ({ ...current, [id]: checked }));
  };

  const resetForm = () => {
    setRecipient("");
    setExpiryDate(defaultExpiry);
    setPermissions(defaultSharePermissions);
    setError("");
    setCopyStatus("");
  };

  const handleClose = () => {
    resetForm();
    setCreatedShare(null);
    onClose();
  };

  const copyCreatedLink = async () => {
    if (!createdShare) {
      return;
    }

    const link = getPublicShareUrl(createdShare.token);

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus(""), 1600);
      return;
    }

    setCopyStatus("Copy manually");
  };

  const handleSubmit = () => {
    if (!recipient.trim()) {
      setError("Add an email or label for this share.");
      return;
    }

    const action = dispatch(
      createShare({
        recipient: recipient.trim(),
        expiryDate,
        permissions
      })
    );

    setCreatedShare(action.payload);
    resetForm();
  };

  const createAnotherShare = () => {
    resetForm();
    setCreatedShare(null);
  };

  return (
    <Modal title={createdShare ? "Share Link Ready" : "Create Share"} isOpen={isOpen} onClose={handleClose}>
      {createdShare ? (
        <>
          <div className="modal-body">
            <div className="share-created">
              <p className="eyebrow">Share created</p>
              <h3>{createdShare.recipient}</h3>
              <p className="muted-text">This link is ready to send. Access expires on {createdShare.expiryDate}.</p>
              <div className="share-link-row">
                <input readOnly value={getPublicShareUrl(createdShare.token)} aria-label="Created share link" />
                <button className="button button--secondary" type="button" onClick={copyCreatedLink}>
                  {copyStatus || "Copy"}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="button button--secondary" type="button" onClick={createAnotherShare}>
              Create Another
            </button>
            <a className="button button--secondary" href={getPublicShareUrl(createdShare.token)}>
              Open Link
            </a>
            <button className="button button--primary" type="button" onClick={handleClose}>
              Done
            </button>
          </div>
        </>
      ) : (
        <>
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
            <button className="button button--secondary" type="button" onClick={handleClose}>
              Cancel
            </button>
            <button className="button button--primary" type="button" onClick={handleSubmit}>
              Create Link
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
