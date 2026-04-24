import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { useAppSelector } from "../store/hooks";
import { formatDisplayDate, getPublicShareUrl, hasStartedBioData } from "../utils/formHelpers";

export function Home() {
  const bioData = useAppSelector((state) => state.bioData);
  const hasDraft = hasStartedBioData(bioData);
  const activeShares = bioData.shares.filter((share) => share.status === "active");

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
          <strong>{activeShares.length}</strong>
          <p>
            {activeShares.length
              ? "Manage recipients, access permissions, and expiry dates."
              : "Create share links after reviewing your biodata."}
          </p>
          <Link className="text-button" to="/shares">
            Manage shares
          </Link>
        </article>

        <article className="summary-card summary-card--wide">
          <span className="summary-card__label">Recent activity</span>
          {bioData.shares.length ? (
            <ul className="activity-list">
              {bioData.shares.slice(0, 3).map((share) => (
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
