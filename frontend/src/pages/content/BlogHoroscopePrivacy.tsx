import { Link } from "react-router-dom";
import { ContentLayout } from "../../seo/ContentLayout";
import { SEOHead, articleJsonLd } from "../../seo/SEOHead";
import { getSeoForPath, SITE_ORIGIN } from "../../seo/routes";

export function BlogHoroscopePrivacy() {
  const route = getSeoForPath("/blog/horoscope-privacy");
  return (
    <>
      <SEOHead
        route={route}
        jsonLd={[
          articleJsonLd({
            title: route.title,
            description: route.description,
            url: `${SITE_ORIGIN}${route.path}`,
            datePublished: "2026-02-05",
          }),
        ]}
      />
      <ContentLayout
        heading="Kundli Privacy — Why Your Birth Details Deserve Protection"
        subheading="Your janma kundli contains some of the most sensitive personal data you'll ever share. Here's why it deserves the same protection as your bank details."
        breadcrumbs={[
          { label: "Blog", to: "/blog/horoscope-privacy" },
          { label: "Kundli Privacy" },
        ]}
      >
        <p>
          A janma kundli is built from three pieces of information: your date of birth, your exact time of birth, and your place of birth. Combined, these three things uniquely identify you with surprising precision — and they unlock a lot more than just astrological readings.
        </p>

        <h2>What your birth details can be used for</h2>
        <ul>
          <li>
            <strong>Identity verification bypass:</strong> "Mother's maiden name" and "date of birth" are common security questions. Your DOB and birth place are now public.
          </li>
          <li>
            <strong>Targeted social engineering:</strong> with your full birth details and family information from a biodata, a scammer can construct a very convincing identity.
          </li>
          <li>
            <strong>Astrological profiling at scale:</strong> some services collect kundlis to build psychological profiles for ad targeting.
          </li>
          <li>
            <strong>Marriage fraud:</strong> bad actors use detailed kundlis to fabricate "compatibility" claims to vulnerable families.
          </li>
        </ul>

        <p>
          This isn't paranoia. Indian matrimonial fraud is well-documented, and detailed biodatas (especially with kundlis) are a known vector.
        </p>

        <h2>The current default is bad</h2>
        <p>
          Most people share their full kundli — birth date, time, place, complete chart — as part of their biodata, often via PDF on WhatsApp. The kundli ends up in dozens of phones, and over years, in cloud backups, leaked databases, and screenshot libraries.
        </p>

        <h2>What a privacy-conscious approach looks like</h2>
        <h3>1. Share a kundli summary, not the full chart</h3>
        <p>
          For initial conversations, a summary — rashi, nakshatra, gotra, manglik status — is enough. The full chart with exact birth time only goes to families who are seriously considering the match and need to do detailed kundli milan.
        </p>

        <h3>2. Use per-share visibility</h3>
        <p>
          Treat your kundli detail like a tiered access permission. Summary for casual conversations, partial details for interested families, full chart only when both families are clear about proceeding to kundli milan.
        </p>

        <h3>3. Prefer secure platforms over WhatsApp</h3>
        <p>
          WhatsApp PDFs can't be revoked, get cached on every recipient's phone, and end up in cloud backups. Private share links with revocation are dramatically better.
        </p>

        <h3>4. Be skeptical of free astrology apps that ask for full birth details</h3>
        <p>
          Many free apps monetise birth-detail data. If an app asks for your full birth details upfront, check what they're doing with it. <a href="https://daanyam.in/privacy" target="_blank" rel="noopener noreferrer">Daanyam's privacy policy</a> is explicit about not selling user data.
        </p>

        <h2>How Rishte handles your kundli</h2>
        <p>
          On Rishte:
        </p>
        <ul>
          <li>You enter birth details once</li>
          <li>The kundli is generated automatically (via Daanyam) and stored against your account</li>
          <li>For each share you create, you decide whether to show: no kundli, summary only, or full chart</li>
          <li>You can revoke any share at any time</li>
        </ul>

        <p>
          This is the kind of granular control that PDF-on-WhatsApp simply can't offer. <Link to="/privacy-first-matchmaking">Read more about privacy-first matchmaking</Link>.
        </p>

        <h2>Bottom line</h2>
        <p>
          Treat your birth details with the same care you'd treat your bank account number. Share only when needed, share only the precision needed, and use tools that let you revoke later. <Link to="/onboarding">Try Rishte free</Link> if you want a better way to share.
        </p>
      </ContentLayout>
    </>
  );
}
