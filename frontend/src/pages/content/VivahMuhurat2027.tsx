import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink } from "../../seo/ContentLayout";
import { SEOHead } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

export function VivahMuhurat2027() {
  const route = getSeoForPath("/vivah-muhurat/2027");
  return (
    <>
      <SEOHead route={route} />
      <ContentLayout
        heading="Shubh Vivah Muhurat 2027 — Auspicious Wedding Dates"
        subheading="Auspicious wedding dates for 2027, based on Vedic panchang. Final dates are published closer to the year — use this page as a planning starting point."
        breadcrumbs={[
          { label: "Vivah Muhurat", to: "/vivah-muhurat/2026" },
          { label: "2027" },
        ]}
      >
        <p>
          Looking ahead to a 2027 wedding? This page will be updated through 2026 with the final list of auspicious dates as the panchang for the year is published. For now, here's the early outlook plus how to plan around it.
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/muhurat"
          heading="Get a personalised muhurat for 2027"
          body="Daanyam's muhurat calculator works from your kundli — you can already get personalised suggestions for 2027 even before the public panchang is finalised."
          cta="Plan my muhurat on Daanyam"
        />

        <h2>Approximate auspicious months for 2027</h2>
        <p>Based on the rough planetary positions and avoidance periods:</p>
        <ul>
          <li>
            <strong>January 2027:</strong> Several dates in mid-to-late month
          </li>
          <li>
            <strong>February 2027:</strong> Generally favourable throughout
          </li>
          <li>
            <strong>March 2027:</strong> Dates in the first half before Holi-related avoidance
          </li>
          <li>
            <strong>April–May 2027:</strong> Multiple muhurats, peak wedding season
          </li>
          <li>
            <strong>June 2027 (early):</strong> Final dates before Chaturmas
          </li>
          <li>
            <strong>November–December 2027:</strong> Post-Chaturmas peak season returns
          </li>
        </ul>

        <h2>Months typically avoided</h2>
        <ul>
          <li>July to mid-November 2027 — Chaturmas period</li>
          <li>December 16 to January 14 (any year) — Kharmas</li>
          <li>Pitru paksha (15 days in September/October)</li>
          <li>Adhik maas if it falls in 2027</li>
        </ul>

        <h2>When will full dates be available?</h2>
        <p>
          We publish the complete vivah muhurat list 3-4 months ahead of the year. Check back in late 2026 for the full 2027 calendar with tithi, nakshatra, and timings. In the meantime,{" "}
          <Link to="/vivah-muhurat/2026">see the complete 2026 muhurat calendar</Link>, or get a personalised 2027 muhurat directly on{" "}
          <a href="https://daanyam.in/muhurat" target="_blank" rel="noopener noreferrer">
            Daanyam
          </a>
          .
        </p>

        <h2>Plan your wedding now</h2>
        <p>
          Even if you're 12+ months out, there's plenty to do — see the{" "}
          <Link to="/wedding-checklist">Indian wedding checklist</Link>. One thing worth doing early: create your{" "}
          <Link to="/biodata-format">marriage biodata</Link> if you haven't already. It makes sharing with extended family much easier when conversations come up.
        </p>
      </ContentLayout>
    </>
  );
}
