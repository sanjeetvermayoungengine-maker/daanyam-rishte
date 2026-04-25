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
        background: "#1a2540",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 70" fill="none">
        <circle cx="30" cy="22" r="15" fill="#d4a827" opacity="0.35" />
        <ellipse cx="30" cy="65" rx="24" ry="17" fill="#d4a827" opacity="0.22" />
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
    ...(position === "tl" ? { top: 5, left: 5 } : {}),
    ...(position === "tr" ? { top: 5, right: 5 } : {}),
    ...(position === "bl" ? { bottom: 5, left: 5 } : {}),
    ...(position === "br" ? { bottom: 5, right: 5 } : {}),
    transform: transforms[position],
  };

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" style={posStyle}>
      <line x1="1" y1="25" x2="1" y2="1" stroke="#d4a827" strokeWidth="1" opacity="0.8" />
      <line x1="1" y1="1" x2="25" y2="1" stroke="#d4a827" strokeWidth="1" opacity="0.8" />
      <circle cx="1" cy="1" r="2.5" fill="#d4a827" />
      <circle cx="11" cy="11" r="2" fill="none" stroke="#d4a827" strokeWidth="0.8" opacity="0.55" />
    </svg>
  );
}

function SlimDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(212,168,39,0.33)" }} />
      <svg width="8" height="8">
        <circle cx="4" cy="4" r="3" fill="none" stroke="#d4a827" strokeWidth="1" />
      </svg>
      <div style={{ flex: 1, height: "0.5px", background: "rgba(212,168,39,0.33)" }} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <span
        style={{
          fontSize: 8.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#5e7099",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12, color: "#dde4f4", lineHeight: 1.4 }}>
        {value || "—"}
      </span>
    </div>
  );
}

export function TemplateViewPremium({
  bioData,
  showPhotos = true,
  showHoroscope = true,
}: TemplateViewProps) {
  const primaryPhoto = getPrimaryPhoto(bioData);
  const age = getAgeFromDob(bioData.personalDetails.dob);
  const siblings = bioData.family.siblings.filter((s) => s.name || s.occupation);

  const pills = [
    bioData.personalDetails.religion,
    bioData.personalDetails.caste,
    bioData.personalDetails.height,
  ].filter(Boolean);

  return (
    <article
      style={{
        position: "relative",
        padding: "28px 30px",
        background: "#0c1220",
        color: "#dde4f4",
        fontFamily: "var(--font-ui, Inter, sans-serif)",
        fontSize: 13,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Outer border layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(212,168,39,0.2)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 9,
          border: "0.5px solid rgba(212,168,39,0.1)",
          pointerEvents: "none",
        }}
      />

      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* Top ornament row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "linear-gradient(90deg, transparent, #d4a827)",
          }}
        />
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 10,5 5,10 0,5" fill="#d4a827" />
        </svg>
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "#d4a827",
            textTransform: "uppercase",
          }}
        >
          Rishte · Vivah Biodata
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 10,5 5,10 0,5" fill="#d4a827" />
        </svg>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "linear-gradient(90deg, #d4a827, transparent)",
          }}
        />
      </div>

      {/* Centered header block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 20,
          gap: 8,
        }}
      >
        {showPhotos ? (
          <div
            style={{
              borderRadius: "50%",
              border: "1.5px solid #d4a827",
              padding: 3,
              display: "inline-flex",
            }}
          >
            {primaryPhoto ? (
              <img
                src={primaryPhoto.url}
                alt={bioData.personalDetails.fullName}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <PhotoPlaceholder size={90} />
            )}
          </div>
        ) : null}

        <h2
          style={{
            fontFamily: "var(--font-display, 'Noto Serif', serif)",
            fontSize: 22,
            fontWeight: 700,
            color: "#f2d688",
            margin: 0,
            textAlign: "center",
          }}
        >
          {bioData.personalDetails.fullName || "Your Name"}
        </h2>
        <p style={{ fontSize: 12, color: "#7d91bb", margin: 0, textAlign: "center" }}>
          {[
            age ? `${age} years` : null,
            bioData.personalDetails.profession,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {pills.map((pill) => (
            <span
              key={pill}
              style={{
                background: "rgba(212,168,39,0.08)",
                color: "#d4a827",
                border: "1px solid rgba(212,168,39,0.2)",
                fontSize: 10,
                fontWeight: 600,
                padding: "3px 11px",
                borderRadius: 99,
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <SlimDivider />

      {/* Two-column body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px 28px",
        }}
      >
        {/* Left — Personal */}
        <div style={{ display: "grid", gap: 10 }}>
          <span
            style={{
              fontSize: 8.5,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#d4a827",
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
          <Field label="Income" value={bioData.personalDetails.income} />
        </div>

        {/* Right — Family */}
        <div style={{ display: "grid", gap: 10 }}>
          <span
            style={{
              fontSize: 8.5,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#d4a827",
            }}
          >
            Family
          </span>
          <Field label="Father" value={bioData.family.fatherName} />
          {bioData.family.fatherOccupation ? (
            <div style={{ fontSize: 12, color: "#7d91bb", marginTop: -8 }}>
              {bioData.family.fatherOccupation}
            </div>
          ) : null}
          <Field label="Mother" value={bioData.family.motherName} />
          {bioData.family.motherOccupation ? (
            <div style={{ fontSize: 12, color: "#7d91bb", marginTop: -8 }}>
              {bioData.family.motherOccupation}
            </div>
          ) : null}
          <Field
            label="Location"
            value={[bioData.family.familyType, bioData.family.location].filter(Boolean).join(", ")}
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

      {/* Horoscope */}
      {showHoroscope && (
        <>
          <SlimDivider />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px 18px",
            }}
          >
            <Field label="Rashi" value={bioData.horoscope.rashi} />
            <Field label="Nakshatra" value={bioData.horoscope.nakshatra} />
            <Field label="Gotra" value={bioData.horoscope.gotra} />
            <Field label="Mars Dosha" value={bioData.horoscope.marsDosha} />
            <Field label="Birth Time" value={bioData.horoscope.birthTime} />
            <Field label="Birth Place" value={bioData.horoscope.birthPlace} />
          </div>
        </>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "linear-gradient(90deg, transparent, rgba(212,168,39,0.4))",
          }}
        />
        <span style={{ fontSize: 8.5, color: "rgba(212,168,39,0.53)" }}>
          rishte.daanyam.in
        </span>
        <div
          style={{
            flex: 1,
            height: "0.5px",
            background: "linear-gradient(90deg, rgba(212,168,39,0.4), transparent)",
          }}
        />
      </div>
    </article>
  );
}
