import { Link } from "react-router-dom";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, marginBottom: 12, color: "#1a1208" }}>
      {title}
    </h2>
    <div style={{ lineHeight: 1.8, color: "#3a3028" }}>{children}</div>
  </div>
);

export function PrivacyPage() {
  return (
    <section className="page-shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <Link to="/" className="button button--secondary" style={{ marginBottom: 32, display: "inline-flex" }}>
        ← Back to Rishte
      </Link>

      <p className="eyebrow">Legal</p>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 600, marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p className="muted-text" style={{ marginBottom: 40 }}>
        Last updated: 1 May 2026 · Applies to rishte.daanyam.in
      </p>

      <Section title="Who we are">
        <p>
          Rishte is operated by Daanyam (referred to as "we", "us", or "our"). We provide a private marriage biodata creation and sharing platform at <strong>rishte.daanyam.in</strong>. Our contact address is <a href="mailto:hello@daanyam.in" style={{ color: "#B8860B" }}>hello@daanyam.in</a>.
        </p>
      </Section>

      <Section title="What data we collect">
        <p style={{ marginBottom: 12 }}>When you use Rishte, we may collect:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={{ marginBottom: 8 }}><strong>Biodata information</strong> — name, date of birth, religion, caste, gotra, horoscope details (birth time &amp; place, rashi, nakshatra), family names and occupations, education, profession, income, photos, and contact details. You provide this voluntarily to create your biodata.</li>
          <li style={{ marginBottom: 8 }}><strong>Account information</strong> — your phone number, used for OTP-based login via Supabase Auth. We do not store passwords.</li>
          <li style={{ marginBottom: 8 }}><strong>Usage data</strong> — which share links have been opened and when, to provide view-tracking features you explicitly enable.</li>
          <li style={{ marginBottom: 8 }}><strong>Device &amp; browser data</strong> — standard server logs (IP address, user agent, timestamps) retained for up to 30 days for security purposes.</li>
        </ul>
        <p>We do not use third-party advertising trackers, social media pixels, or behavioural profiling tools.</p>
      </Section>

      <Section title="How we use your data">
        <p style={{ marginBottom: 12 }}>We use your data solely to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>Display your biodata to recipients you explicitly share it with via private links.</li>
          <li style={{ marginBottom: 8 }}>Authenticate your account via OTP.</li>
          <li style={{ marginBottom: 8 }}>Generate horoscope details using Daanyam's Vedic astrology engine.</li>
          <li style={{ marginBottom: 8 }}>Show you view-tracking information for your own share links.</li>
        </ul>
        <p style={{ marginTop: 12 }}>We never sell, rent, or share your personal data with third parties for marketing purposes.</p>
      </Section>

      <Section title="Who sees your biodata">
        <p>
          Your biodata is <strong>not public</strong>. It is only accessible to people you share a private link with. Each link can be configured to show or hide sections (photo, horoscope, contact details). You can revoke any link at any time, immediately preventing further access. Daanyam staff can access your biodata only for support purposes when you request it.
        </p>
      </Section>

      <Section title="Sensitive data">
        <p>
          Biodata for marriage purposes necessarily includes sensitive personal information: religion, caste, date of birth, birth place and time, and family details. We store this data encrypted at rest in Supabase (hosted on AWS, EU region). We do not process this data for profiling, matching, or any purpose beyond the features you explicitly use. You have the right to delete your account and all associated data at any time by contacting us.
        </p>
      </Section>

      <Section title="Data retention">
        <p>
          Your biodata and account data are retained as long as your account exists. If you delete your account, all biodata, photos, and share links are permanently deleted within 30 days. Server logs are purged after 30 days.
        </p>
      </Section>

      <Section title="Your rights">
        <p style={{ marginBottom: 12 }}>You have the right to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}><strong>Access</strong> all data we hold about you.</li>
          <li style={{ marginBottom: 8 }}><strong>Correct</strong> any inaccurate data (edit directly in the app).</li>
          <li style={{ marginBottom: 8 }}><strong>Delete</strong> your account and all data.</li>
          <li style={{ marginBottom: 8 }}><strong>Restrict</strong> or object to processing.</li>
          <li style={{ marginBottom: 8 }}><strong>Portability</strong> — export your biodata as PDF.</li>
        </ul>
        <p>To exercise any of these rights, email <a href="mailto:hello@daanyam.in" style={{ color: "#B8860B" }}>hello@daanyam.in</a>. We will respond within 7 business days.</p>
      </Section>

      <Section title="Cookies">
        <p>
          We use one essential cookie: the Supabase authentication session token. We do not use advertising cookies, analytics cookies, or any third-party tracking cookies.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We will notify you of material changes to this policy by posting a notice on the app and updating the "Last updated" date above. Continued use of Rishte after changes constitutes acceptance of the revised policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? <Link to="/contact" style={{ color: "#B8860B" }}>Contact us</Link> or email <a href="mailto:hello@daanyam.in" style={{ color: "#B8860B" }}>hello@daanyam.in</a>.
        </p>
      </Section>
    </section>
  );
}
