import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TemplateViewModern } from "../components/TemplateView_Modern";
import { TemplateViewPremium } from "../components/TemplateView_Premium";
import { TemplateViewSplit } from "../components/TemplateView_Split";
import { TemplateViewTraditional } from "../components/TemplateView_Traditional";
import { fetchPublicShareByToken, type PublicShareError, type PublicShareResponse } from "../services/shareApi";
import { formatDisplayDate } from "../utils/formHelpers";

export function PublicBioDataView() {
  const { token } = useParams();
  const [result, setResult] = useState<PublicShareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState<PublicShareError["code"] | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorCode("not_found");
      return;
    }

    setLoading(true);
    setErrorCode(null);
    void fetchPublicShareByToken(token)
      .then((data) => {
        setResult(data);
      })
      .catch((error: PublicShareError) => {
        setErrorCode(error.code);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <section className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p>Loading shared biodata...</p>
        </div>
      </section>
    );
  }

  if (!result || errorCode) {
    return (
      <section className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">Shared biodata</p>
          <h1>{errorCode === "expired" ? "This link has expired" : "Share link unavailable"}</h1>
          <p>
            {errorCode === "revoked"
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

  const { share, bioData } = result;

  function renderTemplate() {
    const props = {
      bioData,
      showPhotos: share.permissions.viewPhotos,
      showHoroscope: share.permissions.viewHoroscope,
      showContact: share.permissions.viewContact,
    };

    switch (bioData.template) {
      case "modern":
        return <TemplateViewModern {...props} />;
      case "premium":
        return <TemplateViewPremium {...props} />;
      case "split":
        return <TemplateViewSplit {...props} />;
      default:
        return <TemplateViewTraditional {...props} publicMode />;
    }
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
          {renderTemplate()}
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
