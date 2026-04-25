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

function PhotoPlaceholder({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#0a5450",
        border: "3px solid rgba(255,255,255,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 70" fill="none">
        <circle cx="30" cy="22" r="15" fill="#fff" opacity="0.3" />
        <ellipse cx="30" cy="65" rx="24" ry="17" fill="#fff" opacity="0.2" />
      </svg>
    </div>
  );
}

function Field({ label, value, labelColor = "#526071" }: { label: string; value: string; labelColor?: string }) {
  return (
    <div style={{ display: "grid", gap: 1 }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          color: labelColor,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "#172033" }}>
        {value || "—"}
      </span>
    </div>
  );
}

export function TemplateViewModern({
  bioData,
  showPhotos = true,
  showHoroscope = true,
}: TemplateViewProps) {
  const primaryPhoto = getPrimaryPhoto(bioData);
  const age = getAgeFromDob(bioData.personalDetails.dob);
  const siblings = bioData.family.siblings.filter((s) => s.name || s.occupation);

  const tagPills = [
    bioData.personalDetails.religion,
    bioData.personalDetails.caste,
    bioData.personalDetails.height,
    bioData.family.location,
    bioData.family.familyType,
  ].filter(Boolean);

  return (
    <article
      style={{
        background: "#ffffff",
        color: "#172033",
        fontFamily: "var(--font-ui, Inter, sans-serif)",
        fontSize: 13,
        boxSizing: "border-box",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: "linear-gradient(135deg, #0a5450, #0f766e)",
          padding: "24px 28px 20px",
          position: "relative",
          minHeight: 148,
        }}
      >
        {/* Dot-grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="mdots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="11" cy="11" r="1.4" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mdots)" />
          </svg>
        </div>

        {/* Header content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#99dcd8",
                textTransform: "uppercase",
                marginBottom: 7,
                marginTop: 0,
              }}
            >
              Matrimonial Biodata
            </p>
            <h2
              style={{
                fontFamily: "Playfair Display, Georgia, serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#ffffff",
                margin: "0 0 5px",
              }}
            >
              {bioData.personalDetails.fullName || "Your Name"}
            </h2>
            <p style={{ fontSize: 12.5, color: "#cceeec", margin: 0 }}>
              {[
                age ? `${age} yrs` : null,
                bioData.personalDetails.profession,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          {showPhotos ? (
            primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={bioData.personalDetails.fullName}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid rgba(255,255,255,0.28)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <PhotoPlaceholder size={88} />
            )
          ) : null}
        </div>
      </div>

      {/* Tag row */}
      <div
        style={{
          padding: "11px 28px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafa",
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
        }}
      >
        {tagPills.map((pill) => (
          <span
            key={pill}
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              padding: "3px 11px",
              background: "#f0faf9",
              color: "#0f766e",
              borderRadius: 99,
              border: "1px solid #cceeec",
            }}
          >
            {pill}
          </span>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 28px", display: "grid", gap: 18 }}>
        {/* Two-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 28px",
          }}
        >
          {/* Left — Personal */}
          <div style={{ display: "grid", gap: 10 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0f766e",
              }}
            >
              Personal
            </span>
            <Field
              label="Date of Birth"
              value={
                age
                  ? `${formatDisplayDate(bioData.personalDetails.dob)} (Age ${age})`
                  : formatDisplayDate(bioData.personalDetails.dob)
              }
            />
            <Field label="Education" value={bioData.personalDetails.education} />
            <Field label="Income" value={bioData.personalDetails.income} />
          </div>

          {/* Right — Family */}
          <div style={{ display: "grid", gap: 10 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0f766e",
              }}
            >
              Family
            </span>
            <Field
              label="Father"
              value={
                [bioData.family.fatherName, bioData.family.fatherOccupation]
                  .filter(Boolean)
                  .join(", ")
              }
            />
            <Field
              label="Mother"
              value={
                [bioData.family.motherName, bioData.family.motherOccupation]
                  .filter(Boolean)
                  .join(", ")
              }
            />
            {siblings.length > 0 && (
              <Field
                label="Siblings"
                value={siblings
                  .map((s) => [s.name, s.occupation].filter(Boolean).join(", "))
                  .join(" · ")}
              />
            )}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: "#e2e8f0" }} />

        {/* Horoscope */}
        {showHoroscope && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px 20px",
            }}
          >
            <Field label="Rashi" value={bioData.horoscope.rashi} />
            <Field label="Nakshatra" value={bioData.horoscope.nakshatra} />
            <Field label="Gotra" value={bioData.horoscope.gotra} />
            <Field label="Mars Dosha" value={bioData.horoscope.marsDosha} />
            <Field label="Birth Time" value={bioData.horoscope.birthTime} />
            <Field label="Birth Place" value={bioData.horoscope.birthPlace} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 28px 16px",
          borderTop: "1px solid #e2e8f0",
          fontSize: 9.5,
          color: "#526071",
        }}
      >
        Shared via{" "}
        <strong style={{ color: "#0f766e" }}>rishte.daanyam.in</strong>
      </div>
    </article>
  );
}
