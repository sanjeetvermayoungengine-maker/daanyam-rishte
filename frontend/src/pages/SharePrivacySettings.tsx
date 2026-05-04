import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { ShareModal } from "../components/ShareModal";
import { SharePermissionToggle } from "../components/SharePermissionToggle";
import {
  fetchShareAnalyticsSummaryApi,
  listSharesApi,
  revokeShareApi,
  updateSharePermissionsApi,
  type ShareAnalyticsSummary,
  type ShareApiRecord,
} from "../services/shareApi";
import {
  createShareDraftFromRecord,
  filterShares,
  formatShareTypeLabel,
  getShareStatus,
  listSharePresetDefinitions,
  summarizeShareSource,
  type ShareStatusFilter,
  type ShareTypeFilter,
} from "../services/shareService";
import type { SharePermissions } from "../store/bioDataSlice";
import { describeHoroscopeSharing, normalizeSharePermissions } from "../utils/sharePermissions";
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
    id: "viewContact" as const,
    label: "Contact",
    description: "Phone and email"
  }
];

export function SharePrivacySettings() {
  const { user, isConfigured } = useAuth();
  const presetDefinitions = listSharePresetDefinitions();
  const [shares, setShares] = useState<ShareApiRecord[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<ShareAnalyticsSummary | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [initialShareType, setInitialShareType] = useState<ShareTypeFilter>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ShareStatusFilter>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ShareTypeFilter>("all");
  const [prefillShareId, setPrefillShareId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const filteredShares = filterShares(shares, selectedStatusFilter, selectedTypeFilter, now);
  const selectedShare = prefillShareId ? shares.find((share) => share.id === prefillShareId) ?? null : null;
  const filterApplied = selectedStatusFilter !== "all" || selectedTypeFilter !== "all";

  const refreshShares = async () => {
    if (isConfigured && !user) {
      setShares([]);
      setError("Sign in with your phone number to manage share links.");
      setIsLoading(false);
      return;
    }
    try {
      setError("");
      const [loadedShares, summary] = await Promise.all([
        listSharesApi(),
        fetchShareAnalyticsSummaryApi(),
      ]);
      setShares(loadedShares);
      setAnalyticsSummary(summary);
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
      const nextPermissions = normalizeSharePermissions({
        ...share.permissions,
        [permissionId]: checked,
        ...(permissionId === "viewHoroscopeSummary" && !checked
          ? {
              viewHoroscopeBirthDetails: false,
              viewHoroscopeDasha: false,
              viewDetailedKundli: false,
            }
          : {}),
        ...(permissionId === "viewDetailedKundli" && checked
          ? {
              viewHoroscopeSummary: true,
              viewHoroscopeBirthDetails: true,
              viewHoroscopeDasha: true,
            }
          : {}),
        ...((permissionId === "viewHoroscopeBirthDetails" || permissionId === "viewHoroscopeDasha") && checked
          ? { viewHoroscopeSummary: true }
          : {}),
      });
      const updated = await updateSharePermissionsApi(shareId, nextPermissions);
      setShares((current) => current.map((item) => (item.id === shareId ? updated : item)));
      setAnalyticsSummary(await fetchShareAnalyticsSummaryApi());
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

      {analyticsSummary ? (
        <div className="share-summary-grid">
          <article className="share-summary-card">
            <span>Total links</span>
            <strong>{analyticsSummary.totals.shares}</strong>
            <small>{analyticsSummary.totals.active} active, {analyticsSummary.totals.expired} expired</small>
          </article>
          <article className="share-summary-card">
            <span>Total opens</span>
            <strong>{analyticsSummary.totals.opens}</strong>
            <small>{analyticsSummary.opensWindow.last7Days} in the last 7 days</small>
          </article>
          <article className="share-summary-card">
            <span>Opened links</span>
            <strong>{analyticsSummary.totals.openedShares}</strong>
            <small>{analyticsSummary.totals.uniqueVisitors} unique visitors tracked</small>
          </article>
          <article className="share-summary-card">
            <span>Top source</span>
            <strong>
              {analyticsSummary.bySource
                .slice()
                .sort((a, b) => b.opens - a.opens)[0]?.source
                ? summarizeShareSource(analyticsSummary.bySource.slice().sort((a, b) => b.opens - a.opens)[0]!.source)
                : "None"}
            </strong>
            <small>Based on share opens</small>
          </article>
        </div>
      ) : null}

      <div className="share-preset-row">
        {presetDefinitions.map((preset) => (
          <button
            key={preset.shareType}
            className="share-preset-chip"
            type="button"
            onClick={() => {
              setPrefillShareId(null);
              setInitialShareType(preset.shareType);
              setIsShareOpen(true);
            }}
          >
            <strong>{preset.label}</strong>
            <span>{preset.defaultExpiryDays} days</span>
          </button>
        ))}
      </div>

      {analyticsSummary && (analyticsSummary.topShares.length || analyticsSummary.recentActivity.length) ? (
        <div className="share-insights-grid">
          <article className="share-insight-card">
            <h2>Top performing links</h2>
            {analyticsSummary.topShares.length ? (
              <div className="activity-list">
                {analyticsSummary.topShares.map((item) => (
                  <div key={item.shareId} className="activity-list__item">
                    <strong>{item.label}</strong>
                    <span>{formatShareTypeLabel(item.shareType)} · {item.openCount} opens</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-text">No share links have been opened yet.</p>
            )}
          </article>
          <article className="share-insight-card">
            <h2>Recent activity</h2>
            {analyticsSummary.recentActivity.length ? (
              <div className="activity-list">
                {analyticsSummary.recentActivity.map((item) => (
                  <div key={`${item.shareId}-${item.occurredAt}-${item.eventType}`} className="activity-list__item">
                    <strong>{item.label}</strong>
                    <span>{item.eventType.replace(/_/g, " ")} · {formatDisplayDate(item.occurredAt.slice(0, 10))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-text">Activity will appear here after links are created or opened.</p>
            )}
          </article>
        </div>
      ) : null}

      {!isLoading && shares.length ? (
        <div className="share-filter-row">
          <label className="form-field">
            <span>Status</span>
            <select value={selectedStatusFilter} onChange={(event) => setSelectedStatusFilter(event.target.value as ShareStatusFilter)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </label>
          <label className="form-field">
            <span>Share type</span>
            <select value={selectedTypeFilter} onChange={(event) => setSelectedTypeFilter(event.target.value as ShareTypeFilter)}>
              <option value="all">All types</option>
              {presetDefinitions.map((option) => (
                <option key={option.shareType} value={option.shareType}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {filterApplied ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                setSelectedStatusFilter("all");
                setSelectedTypeFilter("all");
              }}
            >
              Reset filters
            </button>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="field-helper">{error}</p> : null}
      {isConfigured && !user ? (
        <div className="empty-state">
          <h2>Authentication required</h2>
          <p>Please sign in with Google from the header to access private share controls.</p>
        </div>
      ) : null}
      {!isConfigured || user ? (isLoading ? (
        <div className="empty-state">
          <h2>Loading share links</h2>
          <p>Fetching your latest links, permissions, and access activity.</p>
        </div>
      ) : filteredShares.length ? (
        <div className="share-list">
          {filteredShares.map((share) => {
            const shareStatus = getShareStatus(share, now);

            return (
              <article className="share-item" key={share.id}>
                <div className="share-item__header">
                  <div>
                    <h2>{share.label || share.recipient}</h2>
                    <p>{share.recipient}</p>
                    <div className="share-analytics-row">
                      <span>Type: {formatShareTypeLabel(share.shareType)}</span>
                      <span>Source: {summarizeShareSource(share.source)}</span>
                      <span>Expiry: {formatDisplayDate(share.expiryDate)}</span>
                      <span>Opens: {share.openCount}</span>
                      <span>Last opened: {share.lastOpenedAt ? formatDisplayDate(share.lastOpenedAt.slice(0, 10)) : "Never"}</span>
                    </div>
                    <div className="share-meta-row">
                      <span className="chip">Basic: {share.permissions.viewBasic ? "On" : "Off"}</span>
                      <span className="chip">Photos: {share.permissions.viewPhotos ? "On" : "Off"}</span>
                      <span className="chip">Contact: {share.permissions.viewContact ? "On" : "Off"}</span>
                      <span className="share-meta-text">Horoscope: {describeHoroscopeSharing(share.permissions)}</span>
                      {share.label ? <span className="share-meta-text">Label: {share.label}</span> : null}
                    </div>
                  </div>
                  <span className={shareStatus === "active" ? "status-pill" : "status-pill status-pill--muted"}>
                    {shareStatus === "revoked" ? "Revoked" : shareStatus === "expired" ? "Expired" : "Active"}
                  </span>
                </div>

                <div className="share-link-row">
                  <input readOnly value={getPublicShareUrl(share.token)} aria-label="Share link" />
                  <button className="button button--secondary" type="button" onClick={() => copyShareLink(share.id, share.token)}>
                    {copiedShareId === share.id ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="permission-list permission-list--grid">
                  <SharePermissionToggle
                    id="viewHoroscopeSummary"
                    label="Horoscope summary"
                    description="Rashi, nakshatra, gotra, and Mars dosha."
                    checked={share.permissions.viewHoroscopeSummary}
                    onChange={(permissionId, checked) => updatePermission(share.id, permissionId, checked)}
                  />
                  <SharePermissionToggle
                    id="viewHoroscopeBirthDetails"
                    label="Birth details"
                    description="Birth date, time, and birthplace."
                    checked={share.permissions.viewHoroscopeBirthDetails}
                    disabled={!share.permissions.viewHoroscopeSummary || share.permissions.viewDetailedKundli}
                    onChange={(permissionId, checked) => updatePermission(share.id, permissionId, checked)}
                  />
                  <SharePermissionToggle
                    id="viewHoroscopeDasha"
                    label="Dasha summary"
                    description="Expose the dasha timeline without the full chart."
                    checked={share.permissions.viewHoroscopeDasha}
                    disabled={!share.permissions.viewHoroscopeSummary || share.permissions.viewDetailedKundli}
                    onChange={(permissionId, checked) => updatePermission(share.id, permissionId, checked)}
                  />
                  <SharePermissionToggle
                    id="viewDetailedKundli"
                    label="Full kundli"
                    description="Lagna, pada, dasha, and engine output."
                    checked={share.permissions.viewDetailedKundli}
                    onChange={(permissionId, checked) => updatePermission(share.id, permissionId, checked)}
                  />
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
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setPrefillShareId(share.id);
                      setInitialShareType("all");
                      setIsShareOpen(true);
                    }}
                  >
                    Create similar
                  </button>
                  <button
                    className="text-button text-button--danger"
                    type="button"
                    disabled={share.status === "revoked"}
                    onClick={async () => {
                      if (window.confirm("Revoke this share link?")) {
                        try {
                          const revoked = await revokeShareApi(share.id);
                          setShares((current) => current.map((item) => (item.id === share.id ? revoked : item)));
                          setAnalyticsSummary(await fetchShareAnalyticsSummaryApi());
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
      ) : filterApplied ? (
        <div className="empty-state">
          <h2>No shares match these filters</h2>
          <p>Try a different status or share type to find links quickly.</p>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              setSelectedStatusFilter("all");
              setSelectedTypeFilter("all");
            }}
          >
            Clear filters
          </button>
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
        onClose={() => {
          setIsShareOpen(false);
          setPrefillShareId(null);
          setInitialShareType("all");
        }}
        source="share_dashboard"
        initialShareType={initialShareType === "all" ? undefined : initialShareType}
        prefill={selectedShare ? createShareDraftFromRecord(selectedShare) : null}
        onShareCreated={async (share) => {
          setShares((current) => [share, ...current]);
          setAnalyticsSummary(await fetchShareAnalyticsSummaryApi());
        }}
      />
    </section>
  );
}
