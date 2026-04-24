import type { BioDataState } from "../store/bioDataSlice";
import { formatDisplayDate, getAgeFromDob, getPrimaryPhoto } from "../utils/formHelpers";

type TemplateViewProps = {
  bioData: BioDataState;
  compact?: boolean;
  publicMode?: boolean;
  showPhotos?: boolean;
  showHoroscope?: boolean;
  showContact?: boolean;
};

export function TemplateViewTraditional({
  bioData,
  compact = false,
  publicMode = false,
  showPhotos = true,
  showHoroscope = true,
  showContact = true
}: TemplateViewProps) {
  const primaryPhoto = getPrimaryPhoto(bioData);
  const age = getAgeFromDob(bioData.personalDetails.dob);
  const siblings = bioData.family.siblings.filter((sibling) => sibling.name || sibling.occupation);

  return (
    <article className={compact ? "biodata-sheet biodata-sheet--compact" : "biodata-sheet"}>
      <header className="biodata-sheet__header">
        {showPhotos && primaryPhoto ? (
          <img className="profile-photo" src={primaryPhoto.url} alt={bioData.personalDetails.fullName} />
        ) : (
          <div className="profile-photo profile-photo--empty" aria-hidden="true">
            R
          </div>
        )}
        <div>
          <p className="eyebrow">{publicMode ? "Shared biodata" : "Traditional template"}</p>
          <h2>{bioData.personalDetails.fullName || "Your Name"}</h2>
          <p>
            {[age ? `${age} years` : "", bioData.personalDetails.profession, bioData.family.location]
              .filter(Boolean)
              .join(" - ") || "Profile summary"}
          </p>
        </div>
      </header>

      <section className="detail-section">
        <h3>Personal Details</h3>
        <dl className="detail-grid">
          <div>
            <dt>Date of birth</dt>
            <dd>{formatDisplayDate(bioData.personalDetails.dob)}</dd>
          </div>
          <div>
            <dt>Religion</dt>
            <dd>{bioData.personalDetails.religion || "Not provided"}</dd>
          </div>
          <div>
            <dt>Caste</dt>
            <dd>{bioData.personalDetails.caste || "Not provided"}</dd>
          </div>
          <div>
            <dt>Height</dt>
            <dd>{bioData.personalDetails.height || "Not provided"}</dd>
          </div>
          <div>
            <dt>Education</dt>
            <dd>{bioData.personalDetails.education || "Not provided"}</dd>
          </div>
          <div>
            <dt>Income</dt>
            <dd>{bioData.personalDetails.income || "Not provided"}</dd>
          </div>
        </dl>
      </section>

      {showContact ? (
        <section className="detail-section">
          <h3>Contact</h3>
          <dl className="detail-grid">
            <div>
              <dt>Phone</dt>
              <dd>{bioData.personalDetails.phone || "Not provided"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{bioData.personalDetails.email || "Not provided"}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className="detail-section">
        <h3>Family</h3>
        <dl className="detail-grid">
          <div>
            <dt>Father</dt>
            <dd>
              {[bioData.family.fatherName, bioData.family.fatherOccupation].filter(Boolean).join(", ") ||
                "Not provided"}
            </dd>
          </div>
          <div>
            <dt>Mother</dt>
            <dd>
              {[bioData.family.motherName, bioData.family.motherOccupation].filter(Boolean).join(", ") ||
                "Not provided"}
            </dd>
          </div>
          <div>
            <dt>Family type</dt>
            <dd>{bioData.family.familyType || "Not provided"}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{bioData.family.location || "Not provided"}</dd>
          </div>
        </dl>
        {siblings.length ? (
          <ul className="plain-list">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                {sibling.name}
                {sibling.occupation ? ` - ${sibling.occupation}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {showHoroscope ? (
        <section className="detail-section">
          <h3>Horoscope</h3>
          <dl className="detail-grid">
            <div>
              <dt>Birth time</dt>
              <dd>{bioData.horoscope.birthTime || "Not provided"}</dd>
            </div>
            <div>
              <dt>Birth place</dt>
              <dd>{bioData.horoscope.birthPlace || "Not provided"}</dd>
            </div>
            <div>
              <dt>Rashi</dt>
              <dd>{bioData.horoscope.rashi || "Not provided"}</dd>
            </div>
            <div>
              <dt>Nakshatra</dt>
              <dd>{bioData.horoscope.nakshatra || "Not provided"}</dd>
            </div>
            <div>
              <dt>Gotra</dt>
              <dd>{bioData.horoscope.gotra || "Not provided"}</dd>
            </div>
            <div>
              <dt>Mars dosha</dt>
              <dd>{bioData.horoscope.marsDosha || "Not provided"}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {showPhotos && bioData.photos.items.length > 1 ? (
        <section className="detail-section">
          <h3>Photos</h3>
          <div className="photo-strip">
            {bioData.photos.items.map((photo) => (
              <img key={photo.id} src={photo.url} alt={photo.name} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
