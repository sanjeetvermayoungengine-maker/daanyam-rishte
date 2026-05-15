import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is Nadi dosha?",
    answer:
      "Nadi dosha occurs when both partners share the same nadi (Adi, Madhya, or Antya) based on their birth nakshatras. Since Nadi is worth the highest 8 gunas in Ashtakoot Milan, sharing the same nadi means losing all 8 — making it a major dosha.",
  },
  {
    question: "Why is Nadi dosha considered serious?",
    answer:
      "Because nadi relates to health (in Ayurvedic terms, the three doshas — vata, pitta, kapha) and progeny, sharing the same nadi is traditionally believed to cause health complications in the marriage and difficulties having children.",
  },
  {
    question: "Can Nadi dosha be cancelled?",
    answer:
      "Yes, several exceptions exist: same nadi but different nakshatras (Eka nakshatra dosha doesn't apply); both nakshatras have the same lord; certain rashi pairings between the partners. Detailed kundli analysis is needed — Daanyam's tool flags applicable cancellations automatically.",
  },
  {
    question: "What are the remedies for Nadi dosha?",
    answer:
      "Traditional remedies include Maha Mrityunjaya Jaap, Nadi Nivaran puja, donation of cow/clothing/grain on specific days, and chanting of Nadi-specific mantras. Some families opt for these remedies before marriage to neutralise the dosha.",
  },
];

export function KundliMilanNadiDosha() {
  const route = getSeoForPath("/kundli-milan/nadi-dosha");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Nadi Dosha in Kundli Milan — Meaning, Exceptions &amp; Remedies"
        subheading="What Nadi dosha actually is, why it carries the highest weight in Ashtakoot, when it's cancelled, and what to do if it appears in your kundli match."
        breadcrumbs={[
          { label: "Kundli Milan", to: "/kundli-milan" },
          { label: "Nadi Dosha" },
        ]}
      >
        <p>
          Nadi dosha is the most-feared of all kundli matching doshas, mostly because of its weight: Nadi alone is 8 of the 36 Ashtakoot gunas. When Nadi dosha exists, the couple scores 0 on this category — which can drop an otherwise good 27 down to 19. Here's what it actually means and what to do about it.
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/kundli-milan"
          heading="Check for Nadi dosha"
          body="Daanyam's free kundli milan tool checks for Nadi dosha along with all applicable cancellations — get a clear yes/no in 30 seconds."
          cta="Check on Daanyam"
        />

        <h2>What is "nadi"?</h2>
        <p>
          In Vedic astrology, the 27 nakshatras are grouped into three nadis based on their underlying Ayurvedic energy:
        </p>
        <ul>
          <li>
            <strong>Adi nadi (Vata)</strong> — Ashwini, Ardra, Punarvasu, Uttara Phalguni, Hasta, Jyeshtha, Mula, Shatabhisha, Purva Bhadrapada
          </li>
          <li>
            <strong>Madhya nadi (Pitta)</strong> — Bharani, Mrigashira, Pushya, Purva Phalguni, Chitra, Anuradha, Purvashada, Dhanishta, Uttara Bhadrapada
          </li>
          <li>
            <strong>Antya nadi (Kapha)</strong> — Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, Uttara Ashada, Shravana, Revati
          </li>
        </ul>

        <h2>Why same-nadi is considered bad</h2>
        <p>
          The theory is that when both partners share the same nadi, they share the same Ayurvedic dosha imbalance. From a health perspective, this is believed to amplify shared weaknesses rather than balance each other. From a progeny perspective, it's traditionally associated with difficulties in conceiving healthy children.
        </p>
        <p>
          Modern interpretations sometimes frame nadi as similarity of underlying temperament — too much sameness can mean less complementarity.
        </p>

        <h2>Exceptions: when Nadi dosha doesn't apply</h2>
        <p>
          Vedic texts list several conditions where Nadi dosha is considered cancelled or significantly reduced:
        </p>
        <ul>
          <li>
            <strong>Same nadi, different nakshatras with the same lord:</strong> the dosha is often nullified
          </li>
          <li>
            <strong>Eka nakshatra rashi bheda:</strong> if both partners share the same nakshatra but have different rashis, the dosha doesn't apply
          </li>
          <li>
            <strong>Bheda nakshatra rashi bheda:</strong> different nakshatras and different rashis within the same nadi sometimes cancel
          </li>
          <li>
            <strong>Auspicious rashi positions:</strong> certain rashi-pair positions strengthen compatibility despite same nadi
          </li>
          <li>
            <strong>One partner is an "exception nakshatra":</strong> Rohini, Ardra, Magha and a few others have specific exceptions
          </li>
        </ul>

        <h2>Traditional remedies</h2>
        <ul>
          <li>
            <strong>Maha Mrityunjaya Jaap:</strong> 1.25 lakh or 1 lakh recitations, often performed by a pandit
          </li>
          <li>Nadi Nivaran Puja</li>
          <li>Donations of cow, clothing, or grain on specific days</li>
          <li>Chanting Mahamrityunjaya mantra daily</li>
          <li>Specific homas (fire rituals) for nadi dosha</li>
        </ul>

        <h2>A balanced view</h2>
        <p>
          Nadi dosha sounds frightening because of its 8-guna weight, but the exception rules cancel it in a surprisingly large fraction of cases. Before treating Nadi dosha as a dealbreaker, run the full kundli milan and check whether any of the cancellations apply. Many couples flagged with "Nadi dosha" actually have a cancellation in place.
        </p>
        <p>
          As with <Link to="/kundli-milan/manglik">Manglik dosha</Link>, the right approach is detailed analysis rather than panic. A complete Ashtakoot breakdown plus the cancellation analysis tells the real story — get yours free on{" "}
          <a href="https://daanyam.in/kundli-milan" target="_blank" rel="noopener noreferrer">
            Daanyam
          </a>
          .
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
