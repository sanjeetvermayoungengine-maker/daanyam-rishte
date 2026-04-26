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

function PhotoPlaceholder({ size, borderRadius }: { size: number; borderRadius: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background: "#e4d3ad",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 70" fill="none">
        <circle cx="30" cy="22" r="15" fill="#c9921a" opacity="0.35" />
        <ellipse cx="30" cy="65" rx="24" ry="17" fill="#c9921a" opacity="0.22" />
      </svg>
    </div>
  );
}

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const transforms: Record<string, string> = {
    tl: "rotate(0deg)",
    tr: "rotate(90deg)",
    br: "rotate(180deg)",
    bl: "rotate(270deg)",
  };
  const posStyle: React.CSSProperties = {
    position: "absolute",
    ...(position === "tl" ? { top: 9, left: 9 } : {}),
    ...(position === "tr" ? { top: 9, right: 9 } : {}),
    ...(position === "bl" ? { bottom: 9, left: 9 } : {}),
    ...(position === "br" ? { bottom: 9, right: 9 } : {}),
    transform: transforms[position],
  };

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" style={posStyle}>
      <line x1="1" y1="25" x2="1" y2="1" stroke="#c9921a" strokeWidth="1" opacity="0.8" />
      <line x1="1" y1="1" x2="25" y2="1" stroke="#c9921a" strokeWidth="1" opacity="0.8" />
      <circle cx="1" cy="1" r="2.5" fill="#c9921a" />
      <circle cx="11" cy="11" r="2" fill="none" stroke="#c9921a" strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "11px 0" }}>
      <div
        style={{
          flex: 1,
          height: "0.5px",
          background: "linear-gradient(90deg, transparent, rgba(201,146,26,0.7))",
        }}
      />
      <svg width="14" height="8" viewBox="0 0 14 8">
        <polygon points="7,0 11,4 7,8 3,4" fill="#c9921a" />
        <circle cx="1.5" cy="4" r="1.5" fill="#c9921a" opacity="0.5" />
        <circle cx="12.5" cy="4" r="1.5" fill="#c9921a" opacity="0.5" />
      </svg>
      <div
        style={{
          flex: 1,
          height: "0.5px",
          background: "linear-gradient(90deg, rgba(201,146,26,0.7), transparent)",
        }}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 1 }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          color: "#8a6030",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "#2a1608" }}>
        {value || "—"}
      </span>
    </div>
  );
}

export function TemplateViewTraditional({
  bioData,
  showPhotos = true,
  horoscopeAccess = "detailed",
}: TemplateViewProps) {
  const primaryPhoto = getPrimaryPhoto(bioData);
  const age = getAgeFromDob(bioData.personalDetails.dob);
  const siblings = bioData.family.siblings.filter((s) => s.name || s.occupation);
  const horoscopeFields = getHoroscopeFieldsForAccess(bioData.horoscope, horoscopeAccess);

  const pills = [
    bioData.personalDetails.religion,
    bioData.personalDetails.caste,
    bioData.family.location,
  ].filter(Boolean);

  return (
    <article
      style={{
        position: "relative",
        padding: "28px 30px",
        border: "1px solid #c9921a",
        background: "#fdf5e4",
        color: "#2a1608",
        fontFamily: "var(--font-ui, Inter, sans-serif)",
        fontSize: 13,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* Inner border */}
      <div
        style={{
          position: "absolute",
          inset: 13,
          border: "0.5px solid rgba(201,146,26,0.27)",
          pointerEvents: "none",
        }}
      />

      {/* Eyebrow */}
      <p
        style={{
          textAlign: "center",
          fontSize: 9.5,
          fontWeight: 900,
          letterSpacing: "0.18em",
          color: "#b42318",
          textTransform: "uppercase",
          marginBottom: 11,
          marginTop: 0,
        }}
      >
        ✦ Vivah Biodata ✦
      </p>

      <GoldDivider />

      {/* Header */}
      <div style={{ display: "flex", gap: 18, alignItems: "center", margin: "14px 0 10px" }}>
        {showPhotos ? (
          primaryPhoto ? (
            <img
              src={primaryPhoto.url}
              alt={bioData.personalDetails.fullName}
              style={{
                width: 108,
                height: 108,
                borderRadius: 8,
                objectFit: "cover",
                border: "1.5px solid rgba(201,146,26,0.33)",
                flexShrink: 0,
              }}
            />
          ) : (
            <PhotoPlaceholder size={108} borderRadius="8px" />
          )
        ) : null}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Noto Serif', serif)",
              fontSize: 21,
              fontWeight: 700,
              color: "#1a0a04",
              margin: "0 0 4px",
            }}
          >
            {bioData.personalDetails.fullName || "Your Name"}
          </h2>
          <p style={{ fontSize: 12.5, color: "#7a5c3a", margin: "0 0 8px" }}>
            {[age ? `${age} years` : null, bioData.personalDetails.profession]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {pills.map((pill) => (
              <span
                key={pill}
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "3px 9px",
                  background: "#f5e9ca",
                  color: "#7a4a0e",
                  borderRadius: 99,
                  border: "1px solid rgba(201,146,26,0.27)",
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <GoldDivider />

      {/* Two-column body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px 28px",
          margin: "14px 0",
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
              color: "#b42318",
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
          <Field label="Height" value={bioData.personalDetails.height} />
          <Field label="Education" value={bioData.personalDetails.education} />
          <Field
            label="Profession"
            value={
              bioData.personalDetails.profession || ""
            }
          />
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
              color: "#b42318",
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
          <Field
            label="Family Type"
            value={
              [bioData.family.familyType, bioData.family.location].filter(Boolean).join(", ")
            }
          />
        </div>
      </div>

      {/* Horoscope */}
      {horoscopeFields.length > 0 && (
        <>
          <GoldDivider />
          <div style={{ marginTop: 4, marginBottom: 12, fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b42318" }}>
            {horoscopeAccess === "detailed" ? "Detailed Kundli" : "Horoscope Summary"}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px 18px",
              marginTop: 14,
            }}
          >
            {horoscopeFields.map((field) => (
              <Field key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "#a07040",
          letterSpacing: "0.1em",
          marginTop: 4,
          marginBottom: 0,
        }}
      >
        rishte.daanyam.in · Shared with love
      </p>
    </article>
  );
}
