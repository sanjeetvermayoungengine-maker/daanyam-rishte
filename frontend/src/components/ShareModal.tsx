import { useEffect, useMemo, useState } from "react";
import type { SharePermissions, ShareRecord, ShareSource, ShareType } from "../store/bioDataSlice";
import { useAppSelector } from "../store/hooks";
import { useAuth } from "../auth/AuthContext";
import { createShareApi } from "../services/shareApi";
import {
  defaultSharePermissions,
  defaultShareType,
  getPresetExpiryDate,
  getSharePresetDefinition,
  getSharePresetPermissions,
  listSharePresetDefinitions,
  type ShareDraftPrefill,
} from "../services/shareService";
import { getPublicShareUrl } from "../utils/formHelpers";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { SharePermissionToggle } from "./SharePermissionToggle";
import { describeHoroscopeSharing, normalizeSharePermissions } from "../utils/sharePermissions";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShareCreated?: (share: ShareRecord) => void;
  source?: ShareSource;
  prefill?: ShareDraftPrefill | null;
  initialShareType?: ShareType;
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
    id: "viewContact" as const,
    label: "Contact",
    description: "Phone number and email"
  }
];

export function ShareModal({
  isOpen,
  onClose,
  onShareCreated,
  source = "direct_flow",
  prefill = null,
  initialShareType,
}: ShareModalProps) {
  const bioData = useAppSelector((state) => state.bioData);
  const { isConfigured, user } = useAuth();
  const presetDefinitions = useMemo(() => listSharePresetDefinitions(), []);
  const defaultExpiry = useMemo(() => getPresetExpiryDate(defaultShareType), []);
  const [recipient, setRecipient] = useState("");
  const [shareType, setShareType] = useState<ShareType>(defaultShareType);
  const [label, setLabel] = useState("");
  const [expiryDate, setExpiryDate] = useState(defaultExpiry);
  const [permissions, setPermissions] = useState<SharePermissions>(() => ({ ...defaultSharePermissions }));
  const [error, setError] = useState("");
  const [createdShare, setCreatedShare] = useState<ShareRecord | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveCreateShareError = (error: unknown) => {
    if (!isConfigured) {
      return "Share links are unavailable until Supabase is configured.";
    }
    if (!user) {
      return "Sign in with your phone number to create share links.";
    }
    if (typeof error === "object" && error && "response" in error) {
      const response = (error as { response?: { data?: unknown } }).response;
      const data = response?.data;
      if (typeof data === "object" && data && "error" in data && typeof data.error === "string") {
        return data.error;
      }
      if (typeof data === "object" && data && "message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
    return "Could not create share link right now. Please try again.";
  };

  const updatePermission = (id: keyof SharePermissions, checked: boolean) => {
    setPermissions((current) => {
      const next = { ...current, [id]: checked };

      if (id === "viewHoroscopeSummary" && !checked) {
        next.viewHoroscopeBirthDetails = false;
        next.viewHoroscopeDasha = false;
        next.viewDetailedKundli = false;
      }

      if ((id === "viewHoroscopeBirthDetails" || id === "viewHoroscopeDasha") && checked) {
        next.viewHoroscopeSummary = true;
      }

      if (id === "viewDetailedKundli") {
        if (checked) {
          next.viewHoroscopeSummary = true;
          next.viewHoroscopeBirthDetails = true;
          next.viewHoroscopeDasha = true;
        }
      }

      return normalizeSharePermissions(next);
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (prefill) {
      setRecipient(prefill.recipient);
      setShareType(prefill.shareType);
      setLabel(prefill.label);
      setExpiryDate(prefill.expiryDate);
      setPermissions({ ...prefill.permissions });
    } else if (initialShareType) {
      setShareType(initialShareType);
      setExpiryDate(getPresetExpiryDate(initialShareType));
      setPermissions(getSharePresetPermissions(initialShareType));
    }
    setError("");
    setCopyStatus("");
    setCreatedShare(null);
  }, [initialShareType, isOpen, prefill]);

  const resetForm = () => {
    setRecipient("");
    setShareType(defaultShareType);
    setLabel("");
    setExpiryDate(getPresetExpiryDate(defaultShareType));
    setPermissions(getSharePresetPermissions(defaultShareType));
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

  const handleSubmit = async () => {
    if (!recipient.trim() || isSubmitting) {
      setError("Add a recipient for this share.");
      return;
    }
    if (!isConfigured) {
      setError("Share links are unavailable until Supabase is configured.");
      return;
    }
    if (!user) {
      setError("Sign in with your phone number to create share links.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const share = await createShareApi({
        recipient: recipient.trim(),
        shareType,
        label,
        source,
        expiryDate,
        permissions,
        bioData,
      });
      setCreatedShare(share);
      onShareCreated?.(share);
      resetForm();
    } catch (error) {
      setError(resolveCreateShareError(error));
    } finally {
      setIsSubmitting(false);
    }
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
              <h3>{createdShare.label || createdShare.recipient}</h3>
              <p className="muted-text">
                {getSharePresetDefinition(createdShare.shareType).label}
                {" "}share. Access expires on {createdShare.expiryDate}.
              </p>
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
            <div className="share-preset-grid">
              {presetDefinitions.map((preset) => (
                <button
                  key={preset.shareType}
                  className={shareType === preset.shareType ? "share-preset-card share-preset-card--active" : "share-preset-card"}
                  type="button"
                  onClick={() => {
                    setShareType(preset.shareType);
                    setPermissions(preset.permissions);
                    setExpiryDate(getPresetExpiryDate(preset.shareType));
                  }}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.description}</span>
                  <small>{preset.recommendedFor}</small>
                </button>
              ))}
            </div>
            <FormField
              label="Recipient"
              name="share-recipient"
              value={recipient}
              required
              placeholder="name@example.com or Sharma family"
              error={error}
              onChange={setRecipient}
            />
            <FormField
              label="Share type"
              name="share-type"
              type="select"
              value={shareType}
              required
              options={presetDefinitions.map((option) => ({ label: option.label, value: option.shareType }))}
              onChange={(value) => {
                const nextType = value as ShareType;
                setShareType(nextType);
                setPermissions(getSharePresetPermissions(nextType));
                setExpiryDate(getPresetExpiryDate(nextType));
              }}
            />
            <p className="field-helper">
              {getSharePresetDefinition(shareType).description}
            </p>
            <FormField
              label="Label"
              name="share-label"
              value={label}
              placeholder="Optional internal label"
              helperText="Helpful for your own tracking. The recipient still sees the shared biodata."
              onChange={setLabel}
            />
            <FormField
              label="Expiry date"
              name="share-expiry"
              type="date"
              value={expiryDate}
              required
              onChange={setExpiryDate}
            />
            <p className="field-helper">
              Permissions start from the selected preset and can be adjusted below. Recommended duration:
              {" "}{getSharePresetDefinition(shareType).defaultExpiryDays} days.
            </p>

            <div className="permission-list">
              <div className="permission-toggle permission-toggle--stacked">
                <span className="permission-toggle__copy">
                  <strong>Horoscope visibility</strong>
                  <small>{describeHoroscopeSharing(permissions)}</small>
                </span>
              </div>
              <SharePermissionToggle
                id="viewHoroscopeSummary"
                label="Horoscope summary"
                description="Show rashi, nakshatra, gotra, and Mars dosha."
                checked={permissions.viewHoroscopeSummary}
                onChange={updatePermission}
              />
              <SharePermissionToggle
                id="viewHoroscopeBirthDetails"
                label="Birth details"
                description="Reveal kundli birth date, time, and birthplace."
                checked={permissions.viewHoroscopeBirthDetails}
                disabled={!permissions.viewHoroscopeSummary || permissions.viewDetailedKundli}
                onChange={updatePermission}
              />
              <SharePermissionToggle
                id="viewHoroscopeDasha"
                label="Dasha summary"
                description="Share the computed dasha timeline without the full kundli."
                checked={permissions.viewHoroscopeDasha}
                disabled={!permissions.viewHoroscopeSummary || permissions.viewDetailedKundli}
                onChange={updatePermission}
              />
              <SharePermissionToggle
                id="viewDetailedKundli"
                label="Full kundli"
                description="Expose detailed kundli fields such as lagna, pada, and engine output."
                checked={permissions.viewDetailedKundli}
                onChange={updatePermission}
              />
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
            <button className="button button--primary" type="button" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Creating..." : "Create Link"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
