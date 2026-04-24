import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TemplateViewModern } from "../components/TemplateView_Modern";
import { TemplateViewPremium } from "../components/TemplateView_Premium";
import { TemplateViewTraditional } from "../components/TemplateView_Traditional";
import { markShareAccessed } from "../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { formatDisplayDate } from "../utils/formHelpers";

export function PublicBioDataView() {
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const bioData = useAppSelector((state) => state.bioData);
  const share = bioData.shares.find((item) => item.token === token);
  const isExpired = Boolean(share && share.expiryDate < new Date().toISOString().slice(0, 10));
  const isValid = Boolean(share && share.status === "active" && !isExpired);

  useEffect(() => {
    if (token && isValid) {
      dispatch(markShareAccessed(token));
    }
  }, [dispatch, isValid, token]);

  if (!share || !isValid) {
    return (
      <section className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">Shared biodata</p>
          <h1>{share && isExpired ? "This link has expired" : "Share link unavailable"}</h1>
          <p>
            {share?.status === "revoked"
              ? "The sender has revoked this share link."
              : "Ask the sender for a fresh biodata link."}
          </p>
          <Link className="button button--secondary" to="/">
            Go Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Shared biodata</p>
          <h1>{bioData.personalDetails.fullName || "Biodata"}</h1>
          <p className="muted-text">
            Shared for {share.recipient}. Access expires {formatDisplayDate(share.expiryDate)}.
          </p>
        </div>
        {share.permissions.viewContact && bioData.personalDetails.email ? (
          <a className="button button--primary" href={`mailto:${bioData.personalDetails.email}`}>
            Contact
          </a>
        ) : null}
      </div>

      {share.permissions.viewBasic ? (
        <div className="preview-frame">
          {bioData.template === "modern" ? (
            <TemplateViewModern
              bioData={bioData}
              showPhotos={share.permissions.viewPhotos}
              showHoroscope={share.permissions.viewHoroscope}
              showContact={share.permissions.viewContact}
            />
          ) : bioData.template === "premium" ? (
            <TemplateViewPremium
              bioData={bioData}
              showPhotos={share.permissions.viewPhotos}
              showHoroscope={share.permissions.viewHoroscope}
              showContact={share.permissions.viewContact}
            />
          ) : (
            <TemplateViewTraditional
              bioData={bioData}
              publicMode
              showPhotos={share.permissions.viewPhotos}
              showHoroscope={share.permissions.viewHoroscope}
              showContact={share.permissions.viewContact}
            />
          )}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Basic details are hidden</h2>
          <p>The sender has not granted access to the biodata profile details.</p>
        </div>
      )}
    </section>
  );
}
