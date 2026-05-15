import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <section className="page-shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link to="/" className="button button--secondary" style={{ marginBottom: 32, display: "inline-flex" }}>
        ← Back to Rishte
      </Link>

      <p className="eyebrow">About</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 600, marginBottom: 8 }}>
        Rishte by Daanyam
      </h1>
      <p className="muted-text" style={{ marginBottom: 40 }}>
        A private biodata platform built for Hindu &amp; Jain families.
      </p>

      <div style={{ lineHeight: 1.8, color: "#3a3028" }}>
        <p style={{ marginBottom: 20 }}>
          Rishte is a product by <a href="https://daanyam.in" target="_blank" rel="noopener noreferrer" style={{ color: "#B8860B" }}>Daanyam</a>, a Vedic astrology and family-roots platform. We built Rishte because the way Indian families share biodatas today — WhatsApp PDFs, public matrimonial profiles, third-party brokers — strips away the dignity, privacy, and trust that every <em>रिश्ता</em> deserves.
        </p>

        <p style={{ marginBottom: 20 }}>
          With Rishte you create one beautiful, private biodata and share it with specific families using controlled links. You decide who sees the photo, who sees the horoscope, and who gets contact details. You can revoke access anytime. No public profile. No ads. No matchmaking algorithm deciding your future.
        </p>

        <p style={{ marginBottom: 20 }}>
          The platform is purpose-built for Hindu and Jain traditions — with fields for Gotra, Nakshatra, Rashi, Manglik status, Sect, and Samaj built in from day one, not bolted on. It is powered by Daanyam's Vedic astrology engine for horoscope generation and kundli details.
        </p>

        <p style={{ marginBottom: 20 }}>
          We are a small team based in India. If you have questions, feedback, or want to report an issue, please <Link to="/contact" style={{ color: "#B8860B" }}>contact us</Link>.
        </p>
      </div>
    </section>
  );
}
