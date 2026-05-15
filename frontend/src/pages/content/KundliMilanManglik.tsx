import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is Manglik dosha?",
    answer:
      "Manglik dosha (or Mangal dosha, kuja dosha) is a Vedic astrological condition where Mars (Mangal) occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house of a person's birth chart. It's traditionally believed to cause friction in marriage if not addressed.",
  },
  {
    question: "How do I know if I'm Manglik?",
    answer:
      "Check your birth chart for Mars's house position. If Mars is in the 1st (Lagna), 2nd, 4th, 7th, 8th, or 12th house from your Ascendant or Moon, you're considered Manglik. The intensity (high, medium, low) depends on the specific house and aspects.",
  },
  {
    question: "Can a Manglik marry a non-Manglik?",
    answer:
      "Traditionally, a Manglik marrying a non-Manglik is considered to cause problems for the non-Manglik partner. Vedic remedies (kumbh vivah, mangal puja, gemstone wear) are prescribed if such a match proceeds. However, if both partners are Manglik, the dosha is said to be cancelled.",
  },
  {
    question: "Are there exceptions where Manglik dosha is cancelled?",
    answer:
      "Yes. Manglik dosha is considered cancelled (or significantly reduced) when: both partners are Manglik; Mars is in its own sign or exalted; Mars conjuncts/aspects benefic planets like Jupiter; the dosha-causing house is associated with friendly planets. A proper kundli analysis is needed to confirm.",
  },
  {
    question: "Should Manglik dosha be a dealbreaker?",
    answer:
      "It depends on family beliefs. For traditional families, yes — many won't proceed without remedies. For others, it's a data point worth understanding but not a strict dealbreaker. Many marriages thrive across Manglik / non-Manglik combinations.",
  },
];

export function KundliMilanManglik() {
  const route = getSeoForPath("/kundli-milan/manglik");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Manglik Dosha in Marriage — Effects, Types &amp; Remedies"
        subheading="A clear, balanced guide to Manglik dosha — what it actually is, when it matters, when it's cancelled, and what remedies traditional astrology offers."
        breadcrumbs={[
          { label: "Kundli Milan", to: "/kundli-milan" },
          { label: "Manglik Dosha" },
        ]}
      >
        <p>
          Manglik dosha (also called Mangal dosha or kuja dosha) is one of the most frequently discussed factors in Hindu kundli matching. Here's what it actually is, when it matters, and what families typically do about it.
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/kundli"
          heading="Check your Manglik status"
          body="Generate your kundli on Daanyam in 30 seconds to see if you're Manglik, the intensity (low/medium/high), and whether common cancellations apply."
          cta="Check on Daanyam"
        />

        <h2>What is Manglik dosha?</h2>
        <p>
          When Mars (Mangal) is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house of a person's birth chart, that person is said to be Manglik. Mars is considered a fiery, aggressive planet in Vedic astrology, and its presence in these "sensitive" houses is believed to affect marital harmony.
        </p>

        <h2>Why those specific houses?</h2>
        <ul>
          <li>
            <strong>1st house (Lagna)</strong> — affects the self and overall temperament
          </li>
          <li>
            <strong>2nd house</strong> — family wealth and speech
          </li>
          <li>
            <strong>4th house</strong> — home and emotional foundation
          </li>
          <li>
            <strong>7th house</strong> — the house of marriage itself; the most direct effect
          </li>
          <li>
            <strong>8th house</strong> — longevity and married life harmony
          </li>
          <li>
            <strong>12th house</strong> — bedroom, intimacy, expenses
          </li>
        </ul>

        <h2>Intensity: high, medium, low Manglik</h2>
        <ul>
          <li>
            <strong>High (Chandala) Manglik:</strong> Mars in 7th or 8th house — considered the strongest dosha
          </li>
          <li>
            <strong>Medium Manglik:</strong> Mars in 1st, 4th, or 12th house
          </li>
          <li>
            <strong>Low / Partial Manglik:</strong> Mars in 2nd house, or Manglik that's largely cancelled by other factors
          </li>
        </ul>

        <h2>When Manglik dosha is cancelled</h2>
        <p>
          Vedic texts list several conditions under which Manglik dosha is considered cancelled or significantly reduced:
        </p>
        <ul>
          <li>
            <strong>Both partners are Manglik</strong> — the doshas cancel each other out
          </li>
          <li>Mars is in its own sign (Aries or Scorpio) or exalted (Capricorn)</li>
          <li>Mars is aspected by Jupiter or Venus, both benefic planets</li>
          <li>Mars is conjoined with Jupiter, Moon, or Mercury in the same house</li>
          <li>Both partners are over 28 (some traditions say age weakens the dosha)</li>
          <li>The dosha appears in only Lagna chart OR only Moon chart — not both</li>
        </ul>

        <h2>Traditional remedies</h2>
        <p>
          If Manglik dosha is present and not naturally cancelled, traditional remedies include:
        </p>
        <ul>
          <li>
            <strong>Kumbh vivah / Vishnu vivah:</strong> a symbolic marriage to a clay pot or Vishnu idol before the actual marriage, said to absorb the dosha
          </li>
          <li>Mangal shanti puja performed on Tuesdays</li>
          <li>Chanting Mangal mantras and Hanuman Chalisa</li>
          <li>Wearing red coral (Moonga) — only if recommended by an astrologer for your specific chart</li>
          <li>Fasting on Tuesdays</li>
          <li>Donations to Hanuman temples</li>
        </ul>

        <h2>A balanced view</h2>
        <p>
          Manglik dosha is one of the most-discussed factors in matchmaking, but it's also one of the most context-dependent. The intensity matters. Cancellations matter. The rest of the chart matters. And ultimately, the dosha is part of a much larger picture that includes personality, family fit, and life circumstances.
        </p>
        <p>
          Many people read "Manglik" on a kundli and panic. That's rarely warranted. A proper Manglik analysis from{" "}
          <a href="https://daanyam.in/kundli" target="_blank" rel="noopener noreferrer">
            Daanyam's kundli engine
          </a>{" "}
          tells you the intensity, the cancellations that apply, and whether it's something to address or simply note.
        </p>

        <h2>How Manglik status fits into the biodata</h2>
        <p>
          On a marriage biodata, Manglik status is typically listed as "Yes / No / Anshik (partial)". On Rishte, this is auto-detected from your birth details using Daanyam's astrology engine. Read more about{" "}
          <Link to="/biodata-format">what to include in a marriage biodata</Link>.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
