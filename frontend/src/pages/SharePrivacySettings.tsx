import { useState } from "react";
import { ShareModal } from "../components/ShareModal";
import { SharePermissionToggle } from "../components/SharePermissionToggle";
import { revokeShare, updateSharePermissions, type SharePermissions } from "../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { formatDisplayDate, getPublicShareUrl } from "../utils/formHelpers";

const permissionLabels = [
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
    description: "Birth details and kundali fields"
  },
  {
    id: "viewContact" as const,
    label: "Contact",
    description: "Phone and email"
  }
];

export function SharePrivacySettings() {
  const dispatch = useAppDispatch();
  const shares = useAppSelector((state) => state.bioData.shares);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const copyShareLink = async (id: string, token: string) => {
    const link = getPublicShareUrl(token);

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    }

    setCopiedShareId(id);
    window.setTimeout(() => setCopiedShareId(null), 1600);
  };

  const updatePermission = (shareId: string, permissionId: keyof SharePermissions, checked: boolean) => {
    const share = shares.find((item) => item.id === shareId);
    if (!share) {
      return;
    }

    dispatch(
      updateSharePermissions({
        id: shareId,
        permissions: {
          ...share.permissions,
          [permissionId]: checked
        }
      })
    );
  };

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Sharing</p>
          <h1>Share & Privacy</h1>
          <p className="muted-text">Create links, set visibility, and revoke access when needed.</p>
        </div>
        <button className="button button--primary" type="button" onClick={() => setIsShareOpen(true)}>
          Create New Share
        </button>
      </div>

      {shares.length ? (
        <div className="share-list">
          {shares.map((share) => {
            const isExpired = share.expiryDate < new Date().toISOString().slice(0, 10);

            return (
              <article className="share-item" key={share.id}>
                <div className="share-item__header">
                  <div>
                    <h2>{share.recipient}</h2>
                    <p>
                      Expires {formatDisplayDate(share.expiryDate)}
                      {share.lastAccessed ? ` - Last opened ${formatDisplayDate(share.lastAccessed.slice(0, 10))}` : ""}
                    </p>
                  </div>
                  <span className={share.status === "active" && !isExpired ? "status-pill" : "status-pill status-pill--muted"}>
                    {share.status === "revoked" ? "Revoked" : isExpired ? "Expired" : "Active"}
                  </span>
                </div>

                <div className="share-link-row">
                  <input readOnly value={getPublicShareUrl(share.token)} aria-label="Share link" />
                  <button className="button button--secondary" type="button" onClick={() => copyShareLink(share.id, share.token)}>
                    {copiedShareId === share.id ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="permission-list permission-list--grid">
                  {permissionLabels.map((permission) => (
                    <SharePermissionToggle
                      key={permission.id}
                      {...permission}
                      checked={share.permissions[permission.id]}
                      onChange={(permissionId, checked) => updatePermission(share.id, permissionId, checked)}
                    />
                  ))}
                </div>

                <div className="share-item__actions">
                  <a className="text-button" href={getPublicShareUrl(share.token)}>
                    Open public view
                  </a>
                  <button
                    className="text-button text-button--danger"
                    type="button"
                    disabled={share.status === "revoked"}
                    onClick={() => {
                      if (window.confirm("Revoke this share link?")) {
                        dispatch(revokeShare(share.id));
                      }
                    }}
                  >
                    Revoke
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No shares yet</h2>
          <p>Create a share link when your biodata is ready for a recipient.</p>
          <button className="button button--primary" type="button" onClick={() => setIsShareOpen(true)}>
            Create Share
          </button>
        </div>
      )}

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </section>
  );
}
