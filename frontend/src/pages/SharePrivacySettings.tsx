import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ShareModal } from "../components/ShareModal";
import { SharePermissionToggle } from "../components/SharePermissionToggle";
import {
  listSharesApi,
  revokeShareApi,
  updateSharePermissionsApi,
  type ShareApiRecord,
} from "../services/shareApi";
import type { SharePermissions } from "../store/bioDataSlice";
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
  const { user, isConfigured } = useAuth();
  const [shares, setShares] = useState<ShareApiRecord[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refreshShares = async () => {
    if (isConfigured && !user) {
      setShares([]);
      setError("Sign in with Google to manage share links.");
      setIsLoading(false);
      return;
    }
    try {
      setError("");
      const loadedShares = await listSharesApi();
      setShares(loadedShares);
    } catch {
      setError("Could not load shares right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshShares();
  }, [isConfigured, user]);

  const copyShareLink = async (id: string, token: string) => {
    const link = getPublicShareUrl(token);

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    }

    setCopiedShareId(id);
    window.setTimeout(() => setCopiedShareId(null), 1600);
  };

  const updatePermission = async (shareId: string, permissionId: keyof SharePermissions, checked: boolean) => {
    const share = shares.find((item) => item.id === shareId);
    if (!share) {
      return;
    }

    try {
      const updated = await updateSharePermissionsApi(shareId, {
        ...share.permissions,
        [permissionId]: checked,
      });
      setShares((current) => current.map((item) => (item.id === shareId ? updated : item)));
    } catch {
      setError("Could not update permissions right now.");
    }
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

      {error ? <p className="field-helper">{error}</p> : null}
      {isConfigured && !user ? (
        <div className="empty-state">
          <h2>Authentication required</h2>
          <p>Please sign in with Google from the header to access private share controls.</p>
        </div>
      ) : null}
      {!isConfigured || user ? (isLoading ? (
        <div className="empty-state">
          <p>Loading share links...</p>
        </div>
      ) : shares.length ? (
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
                    onClick={async () => {
                      if (window.confirm("Revoke this share link?")) {
                        try {
                          const revoked = await revokeShareApi(share.id);
                          setShares((current) => current.map((item) => (item.id === share.id ? revoked : item)));
                        } catch {
                          setError("Could not revoke the share right now.");
                        }
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
      )) : null}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShareCreated={(share) => setShares((current) => [share, ...current])}
      />
    </section>
  );
}
