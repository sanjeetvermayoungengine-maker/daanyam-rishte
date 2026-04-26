import type { BioDataState } from "../store/bioDataSlice";
import { getHoroscopeFieldsForAccess, type HoroscopeAccessLevel } from "../utils/sharePermissions";

type PublicHoroscopeCardProps = {
  horoscope: BioDataState["horoscope"];
  accessLevel: HoroscopeAccessLevel;
};

export function PublicHoroscopeCard({ horoscope, accessLevel }: PublicHoroscopeCardProps) {
  const fields = getHoroscopeFieldsForAccess(horoscope, accessLevel);

  if (!fields.length) {
    return null;
  }

  return (
    <article
      style={{
        background: "#ffffff",
        border: "1px solid #e7dcc7",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 14px 36px rgba(43, 27, 14, 0.08)",
      }}
    >
      <p className="eyebrow">{accessLevel === "detailed" ? "Detailed kundli" : "Horoscope summary"}</p>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>
        {accessLevel === "detailed" ? "Shared horoscope details" : "Shared horoscope highlights"}
      </h2>
      <p className="muted-text" style={{ marginTop: 0 }}>
        {accessLevel === "detailed"
          ? "This link includes the detailed kundli section."
          : "This link includes only a limited horoscope summary."}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        {fields.map((field) => (
          <div key={field.label} style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a6030" }}>
              {field.label}
            </span>
            <span style={{ fontSize: 15, color: "#2a1608" }}>{field.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
