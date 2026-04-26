import type { BioDataState } from "../store/bioDataSlice";
import { formatDisplayDate, getAgeFromDob, getPrimaryPhoto } from "../utils/formHelpers";
import { getHoroscopeFieldsForAccess, type HoroscopeAccessLevel } from "../utils/sharePermissions";

type TemplateViewProps = {
  bioData: BioDataState;
  compact?: boolean;
  publicMode?: boolean;
  showPhotos?: boolean;
  horoscopeAccess?: HoroscopeAccessLevel;
  showContact?: boolean;
};

function PhotoPlaceholder({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        border: "2px solid rgba(255,255,255,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 70" fill="none">
        <circle cx="30" cy="22" r="15" fill="#fff" opacity="0.35" />
        <ellipse cx="30" cy="65" rx="24" ry="17" fill="#fff" opacity="0.22" />
      </svg>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div
        style={{
          fontSize: 8,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          color: "rgba(251,228,225,0.47)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 1 }}>
      <span
        style={{
          fontSize: 8.5,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          color: "#526071",
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        style={{
          fontSize: 8.5,
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: "#b42318",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
      <div style={{ height: "0.5px", background: "#e2e8f0" }} />
    </>
  );
}

export function TemplateViewSplit({
  bioData,
  showPhotos = true,
  horoscopeAccess = "detailed",
}: TemplateViewProps) {
  const primaryPhoto = getPrimaryPhoto(bioData);
  const age = getAgeFromDob(bioData.personalDetails.dob);
  const siblings = bioData.family.siblings.filter((s) => s.name || s.occupation);
  const horoscopeFields = getHoroscopeFieldsForAccess(bioData.horoscope, horoscopeAccess);

  return (
    <article
      style={{
        display: "flex",
        overflow: "hidden",
        fontFamily: "var(--font-ui, Inter, sans-serif)",
        fontSize: 13,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Left crimson panel */}
      <div
        style={{
          width: 164,
          flexShrink: 0,
          padding: "24px 18px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #b42318 0%, #7f1812 100%)",
          gap: 16,
        }}
      >
        {/* Dot overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="wdots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="8" cy="8" r="1" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wdots)" />
          </svg>
        </div>

        {/* Diagonal accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            opacity: 0.12,
            pointerEvents: "none",
          }}
        >
          <svg width="164" height="80" viewBox="0 0 164 80">
            <polygon points="0,0 164,0 164,80 0,30" fill="#fff" />
          </svg>
        </div>

        {/* Panel content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: "rgba(251,228,225,0.73)",
              textTransform: "uppercase",
            }}
          >
            Rishte
          </span>

          {showPhotos ? (
            primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={bioData.personalDetails.fullName}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.32)",
                }}
              />
            ) : (
              <PhotoPlaceholder size={96} />
            )
          ) : null}

          <h2
            style={{
              fontFamily: "var(--font-display, 'Noto Serif', serif)",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              margin: 0,
            }}
          >
            {bioData.personalDetails.fullName || "Your Name"}
          </h2>
          <span style={{ fontSize: 10.5, color: "rgba(251,228,225,0.67)" }}>
            {age ? `${age} years` : ""}
          </span>
        </div>

        {/* Quick stats */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "0.5px solid rgba(255,255,255,0.2)",
            paddingTop: 14,
            display: "grid",
            gap: 8,
          }}
        >
          <QuickStat label="Height" value={bioData.personalDetails.height} />
          <QuickStat label="Location" value={bioData.family.location} />
          <QuickStat label="Religion" value={bioData.personalDetails.religion} />
          <QuickStat label="Caste" value={bioData.personalDetails.caste} />
          <QuickStat label="Family" value={bioData.family.familyType} />
        </div>
      </div>

      {/* Right white panel */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: 22,
          display: "grid",
          gap: 14,
          alignContent: "start",
        }}
      >
        {/* Personal */}
        <div style={{ display: "grid", gap: 8 }}>
          <SectionLabel>Personal</SectionLabel>
          <Field
            label="Date of Birth"
            value={
              age
                ? `${formatDisplayDate(bioData.personalDetails.dob)} (Age ${age})`
                : formatDisplayDate(bioData.personalDetails.dob)
            }
          />
          <Field
            label="Profession"
            value={
              bioData.personalDetails.profession || ""
            }
          />
          <Field label="Education" value={bioData.personalDetails.education} />
          <Field label="Income" value={bioData.personalDetails.income} />
        </div>

        {/* Family */}
        <div style={{ display: "grid", gap: 8 }}>
          <SectionLabel>Family</SectionLabel>
          <Field
            label="Father"
            value={
              [bioData.family.fatherName, bioData.family.fatherOccupation]
                .filter(Boolean)
                .join(" · ")
            }
          />
          <Field
            label="Mother"
            value={
              [bioData.family.motherName, bioData.family.motherOccupation]
                .filter(Boolean)
                .join(" · ")
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

        {/* Horoscope */}
        {horoscopeFields.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            <SectionLabel>{horoscopeAccess === "detailed" ? "Detailed Kundli" : "Horoscope Summary"}</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 16px",
              }}
            >
              {horoscopeFields.map((field) => (
                <Field key={field.label} label={field.label} value={field.value} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{ fontSize: 9, color: "#526071", margin: 0 }}>
          via{" "}
          <strong style={{ color: "#b42318" }}>rishte.daanyam.in</strong>
        </p>
      </div>
    </article>
  );
}
