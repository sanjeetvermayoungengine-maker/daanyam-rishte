import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";
import {
  VIVAH_MUHURAT_LOCATION,
  VIVAH_MUHURAT_MONTHS,
  VIVAH_MUHURAT_VERIFIED,
  VIVAH_MUHURAT_YEAR,
} from "../../seo/vivahMuhurat2026.data";

const FAQS = [
  {
    question: "What is vivah muhurat?",
    answer:
      "Vivah muhurat is an auspicious time chosen for a Hindu wedding ceremony based on Vedic astrology. It considers the bride's and groom's nakshatras, the position of planets (especially Jupiter, Venus, Sun), the tithi, and avoidance of inauspicious periods like Rahu kaal and bhadra.",
  },
  {
    question: "Which months in 2026 are best for marriage?",
    answer:
      "In 2026, peak vivah muhurat months are January, February, March, April, May, June (early), November, and December. The Chaturmas period (July–November) is generally avoided. Specific dates depend on family panchang and the couple's kundli — use a personalised tool like Daanyam's muhurat calculator.",
  },
  {
    question: "Are there months with no vivah muhurat?",
    answer:
      "Yes — Chaturmas (roughly July to mid-November when Lord Vishnu is believed to be in yog nidra) typically has fewer or no muhurats. Adhik maas (a leap month every 3 years) is also avoided. Late June through October 2026 has minimal muhurat dates.",
  },
  {
    question: "Can I get a personalised muhurat for my wedding?",
    answer:
      "Yes — a personalised muhurat takes into account both the bride's and groom's kundli, ensuring the chosen date is auspicious for both. Daanyam's muhurat calculator generates dates personalised to your kundli.",
  },
];

export function VivahMuhurat2026() {
  const route = getSeoForPath("/vivah-muhurat/2026");
  const hasData = VIVAH_MUHURAT_MONTHS.length > 0;

  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading={`Vivah Muhurat ${VIVAH_MUHURAT_YEAR} — Auspicious Wedding Dates Month by Month`}
        subheading="Complete list of shubh vivah muhurat dates with tithi, nakshatra, and timings — computed live from Daanyam's Swiss Ephemeris-backed astro engine."
        breadcrumbs={[
          { label: "Vivah Muhurat", to: "/vivah-muhurat/2026" },
          { label: String(VIVAH_MUHURAT_YEAR) },
        ]}
      >
        <p>
          This page lists every shubh vivah muhurat for {VIVAH_MUHURAT_YEAR}, computed from the underlying panchang (tithi, nakshatra, vara) using{" "}
          <a href="https://daanyam.in" target="_blank" rel="noopener noreferrer">
            Daanyam
          </a>
          's Swiss Ephemeris-backed astro engine. Use it as a starting point — the truly auspicious muhurat for your wedding also depends on both partners' kundlis.
        </p>

        <p>
          <em>
            Dates are computed for {VIVAH_MUHURAT_LOCATION}. Sunrise/sunset and Rahu kaal vary slightly by location — confirm with a local pandit or with{" "}
            <a href="https://daanyam.in/panchang" target="_blank" rel="noopener noreferrer">
              Daanyam's daily panchang
            </a>
            .
          </em>
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/muhurat/calendar/vivah/2026-01"
          heading="See the full muhurat calendar"
          body="Daanyam publishes a month-by-month vivah muhurat calendar with kundli personalisation, sunrise-relative timings, and the full panchang context for each date."
          cta="Open the muhurat calendar on Daanyam"
        />

        {!hasData ? (
          <div className="content-sample" style={{ borderColor: "rgba(217,119,6,0.4)" }}>
            <h4 className="content-sample__heading">Awaiting verified data</h4>
            <p style={{ margin: 0 }}>
              We're generating engine-verified muhurat dates. In the meantime, see the live calendar on{" "}
              <a href="https://daanyam.in/muhurat/calendar/vivah/2026-01" target="_blank" rel="noopener noreferrer">
                Daanyam
              </a>
              .
            </p>
          </div>
        ) : null}

        {VIVAH_MUHURAT_MONTHS.map((m) => (
          <section key={m.name}>
            <h2>{m.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tithi</th>
                  <th>Nakshatra</th>
                  <th>Time window (abhijit / morning)</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {m.entries.map((entry) => (
                  <tr key={entry.isoDate}>
                    <td>{entry.date}</td>
                    <td>{entry.tithi}</td>
                    <td>{entry.nakshatra}</td>
                    <td>{entry.timeWindow}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <h2>Months to avoid in {VIVAH_MUHURAT_YEAR}</h2>
        <ul>
          <li>
            <strong>July to mid-November (Chaturmas):</strong> Lord Vishnu is in yog nidra; weddings are traditionally avoided.
          </li>
          <li>
            <strong>Pitru paksha (Sep 26 – Oct 11, 2026 approx):</strong> 15-day period of remembrance for ancestors; avoid auspicious ceremonies.
          </li>
          <li>
            <strong>Kharmas / Dhanu sankranti (Dec 16 – Jan 14):</strong> Period when the Sun transits Sagittarius; weddings avoided.
          </li>
        </ul>

        <h2>How to pick the right date</h2>
        <p>
          A truly auspicious wedding muhurat is the intersection of three things: the panchang's general auspicious dates (which this page lists), your two kundlis (whether the date aligns with your stars), and family practicalities (work, travel, season). Pick 3-5 candidate dates from this list, then run them through{" "}
          <a href="https://daanyam.in/muhurat" target="_blank" rel="noopener noreferrer">
            Daanyam's personalised muhurat calculator
          </a>{" "}
          to narrow down to the best one for your specific situation.
        </p>

        <h2>Planning beyond the date</h2>
        <p>
          Once your date is set, the next steps are usually the engagement ceremony, kundli matching (if not already done), and creating biodatas for sharing with extended family. We have a complete{" "}
          <Link to="/wedding-checklist">Indian wedding checklist</Link> that walks through it. If you're at the biodata stage,{" "}
          <Link to="/biodata-format">our marriage biodata format guide</Link> is the right place to start.
        </p>

        {VIVAH_MUHURAT_VERIFIED ? (
          <p style={{ fontSize: 12, color: "var(--content-ink-soft)", marginTop: 32, fontStyle: "italic" }}>
            All dates on this page are computed using Swiss Ephemeris via Daanyam's astro engine. Last verified at build time.
          </p>
        ) : (
          <p style={{ fontSize: 12, color: "var(--content-ink-soft)", marginTop: 32, fontStyle: "italic" }}>
            Dates not yet verified by the astro engine. Run{" "}
            <code>npx tsx scripts/generate-rishte-muhurat-data.ts --year 2026</code> in the Daanyam repo to regenerate.
          </p>
        )}

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
