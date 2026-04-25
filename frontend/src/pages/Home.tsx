import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { HeroSection } from "../components/HeroSection";
import { listSharesApi, type ShareApiRecord } from "../services/shareApi";
import { useAppSelector } from "../store/hooks";
import { formatDisplayDate, getPublicShareUrl, hasStartedBioData } from "../utils/formHelpers";

export function Home() {
  const { user, isConfigured } = useAuth();
  const bioData = useAppSelector((state) => state.bioData);
  const [shares, setShares] = useState<ShareApiRecord[]>([]);
  const hasDraft = hasStartedBioData(bioData);
  const activeShares = shares.filter((share) => share.status === "active");

  useEffect(() => {
    if (isConfigured && !user) {
      setShares([]);
      return;
    }
    void listSharesApi()
      .then((loadedShares) => setShares(loadedShares))
      .catch(() => setShares([]));
  }, [isConfigured, user]);

  return (
    <section className="page-shell">
      <HeroSection hasDraft={hasDraft} hasPublished={Boolean(bioData.submittedAt)} />

      <div className="dashboard-grid">
        <article className="summary-card">
          <span className="summary-card__label">Biodata status</span>
          <strong>{bioData.submittedAt ? "Published" : hasDraft ? "Draft in progress" : "Not started"}</strong>
          <p>
            {bioData.submittedAt
              ? `Created on ${formatDisplayDate(bioData.submittedAt.slice(0, 10))}`
              : "Complete the guided form to generate a shareable biodata."}
          </p>
          <Link className="text-button" to="/biodata/personal">
            Open form
          </Link>
        </article>

        <article className="summary-card">
          <span className="summary-card__label">Active shares</span>
          <strong>{isConfigured && !user ? "-" : activeShares.length}</strong>
          <p>
            {isConfigured && !user
              ? "Sign in with Google to manage private share links."
              : activeShares.length
              ? "Manage recipients, access permissions, and expiry dates."
              : "Create share links after reviewing your biodata."}
          </p>
          <Link className="text-button" to="/shares">
            Manage shares
          </Link>
        </article>

        <article className="summary-card summary-card--wide">
          <span className="summary-card__label">Recent activity</span>
          {shares.length ? (
            <ul className="activity-list">
              {shares.slice(0, 3).map((share) => (
                <li key={share.id}>
                  <span>
                    {share.recipient} - {share.status}
                  </span>
                  <a href={getPublicShareUrl(share.token)}>{share.token}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sharing activity yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}
