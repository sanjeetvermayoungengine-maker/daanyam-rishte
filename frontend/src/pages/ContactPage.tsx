import { Link } from "react-router-dom";

export function ContactPage() {
  return (
    <section className="page-shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link to="/" className="button button--secondary" style={{ marginBottom: 32, display: "inline-flex" }}>
        ← Back to Rishte
      </Link>

      <p className="eyebrow">Get in touch</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 600, marginBottom: 8 }}>
        Contact us
      </h1>
      <p className="muted-text" style={{ marginBottom: 40 }}>
        We read every message. Typical response within 1–2 business days.
      </p>

      <div style={{ lineHeight: 1.8, color: "#3a3028" }}>
        <p style={{ marginBottom: 32 }}>
          Email us at{" "}
          <a href="mailto:hello@daanyam.in" style={{ color: "#B8860B", fontWeight: 500 }}>
            hello@daanyam.in
          </a>
          {" "}for any of the following:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Bug reports", desc: "Something broken? Tell us the URL, what you did, and what happened." },
            { label: "Privacy & data requests", desc: "To access, correct, or delete your data — see our Privacy Policy for full details." },
            { label: "Account help", desc: "OTP not arriving, can't log in, or need to change your phone number." },
            { label: "Feedback & suggestions", desc: "We're early. Your feedback directly shapes what we build next." },
            { label: "Partnership or press", desc: "Matchmakers, community organisations, or media enquiries." },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderLeft: "3px solid #B8860B",
                paddingLeft: 16,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: "#6b5e52", fontSize: "0.95rem" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ color: "#6b5e52", fontSize: "0.9rem" }}>
          Rishte is built by <a href="https://daanyam.in" target="_blank" rel="noopener noreferrer" style={{ color: "#B8860B" }}>Daanyam</a>.
          We are a small team and we do not have a phone support line.
        </p>
      </div>
    </section>
  );
}
