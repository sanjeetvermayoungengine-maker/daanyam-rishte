import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is kundli milan?",
    answer:
      "Kundli milan (also called gun milan or horoscope matching) is the Vedic astrological practice of comparing two people's birth charts to assess marriage compatibility. The most common method, Ashtakoot, evaluates 8 aspects (koots) of compatibility, scored out of 36 total gunas.",
  },
  {
    question: "What score in gun milan is considered good?",
    answer:
      "Out of 36 total gunas, a score of 18 or higher is generally considered acceptable. 25+ is considered very good, 30+ is excellent, and 36/36 is rare and theoretically perfect. Below 18, most pandits recommend further analysis before proceeding.",
  },
  {
    question: "Is kundli milan necessary for marriage?",
    answer:
      "It's a cultural and religious practice rather than a legal requirement. Many traditional Hindu families consider it essential. Others view it as guidance rather than gospel. Sikh, Muslim, Christian, and Jain families generally don't practice kundli milan.",
  },
  {
    question: "Can a low kundli milan score be remedied?",
    answer:
      "Vedic astrology offers various remedies (poojas, gemstones, mantras, charitable acts) for specific doshas like manglik, nadi dosha, and bhakoot dosha. Whether you pursue remedies is a personal/family decision — many couples with mid-range scores proceed without remedies.",
  },
  {
    question: "Where can I do kundli matching online?",
    answer:
      "Daanyam offers free, detailed kundli matching that goes beyond a simple score — you see each of the 8 koots, dosha analysis (manglik, nadi, bhakoot), and a recommendation. It's accurate, free, and doesn't require an account to use.",
  },
];

export function KundliMilan() {
  const route = getSeoForPath("/kundli-milan");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Kundli Milan for Marriage — The Complete Guide"
        subheading="What kundli milan is, how the 36 gunas of Ashtakoot work, what scores mean, and how to check compatibility — explained simply."
        breadcrumbs={[{ label: "Kundli Milan" }]}
      >
        <p>
          Kundli milan — also called gun milan or horoscope matching — is the Vedic practice of comparing two people's birth charts to assess marital compatibility. It's been part of Hindu matchmaking for centuries. This guide explains how it actually works, without the mystique.
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/kundli-milan"
          heading="Check your compatibility now"
          body="Daanyam's free kundli milan tool gives you the full 36-guna breakdown, dosha analysis, and a recommendation — no signup required."
          cta="Check kundli milan on Daanyam"
        />

        <h2>The basic idea</h2>
        <p>
          When you're born, the positions of the planets in the sky relative to the 12 zodiac signs and 27 nakshatras form your birth chart (kundli). Vedic astrology holds that two people whose charts harmonise are more likely to have a smooth marriage. Kundli milan is the systematic comparison of those two charts.
        </p>

        <h2>The 36 gunas (Ashtakoot Milan)</h2>
        <p>
          The most common method, <Link to="/kundli-milan/ashtakoot">Ashtakoot Milan</Link>, breaks compatibility into 8 categories (koots), each worth a different number of gunas. Total: 36.
        </p>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Koot</th>
              <th>What it measures</th>
              <th>Max gunas</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Varna</td><td>Spiritual development / ego compatibility</td><td>1</td></tr>
            <tr><td>2</td><td>Vashya</td><td>Mutual attraction and control dynamics</td><td>2</td></tr>
            <tr><td>3</td><td>Tara</td><td>Health and well-being (birth-star compatibility)</td><td>3</td></tr>
            <tr><td>4</td><td>Yoni</td><td>Sexual / instinctive compatibility</td><td>4</td></tr>
            <tr><td>5</td><td>Graha Maitri</td><td>Mental / intellectual compatibility</td><td>5</td></tr>
            <tr><td>6</td><td>Gana</td><td>Temperament (deva, manushya, rakshasa)</td><td>6</td></tr>
            <tr><td>7</td><td>Bhakoot</td><td>Emotional + financial / family compatibility</td><td>7</td></tr>
            <tr><td>8</td><td>Nadi</td><td>Health / progeny compatibility</td><td>8</td></tr>
          </tbody>
        </table>

        <h2>What a score means</h2>
        <ul>
          <li>
            <strong>30-36:</strong> Excellent match. Considered highly auspicious.
          </li>
          <li>
            <strong>25-29:</strong> Very good. Most families proceed without hesitation.
          </li>
          <li>
            <strong>18-24:</strong> Acceptable. Many marriages happen at this range.
          </li>
          <li>
            <strong>Below 18:</strong> Pandits often recommend deeper analysis. Specific doshas matter more than the total.
          </li>
        </ul>

        <h2>Beyond the score: doshas</h2>
        <p>
          The total score alone doesn't tell the whole story. Three specific doshas are looked at carefully:
        </p>
        <ul>
          <li>
            <Link to="/kundli-milan/manglik">Manglik Dosha</Link> — when Mars is in specific houses of the kundli, it's said to cause friction in marriage. Two manglik people can match safely; manglik + non-manglik needs remedies.
          </li>
          <li>
            <Link to="/kundli-milan/nadi-dosha">Nadi Dosha</Link> — when both partners have the same nadi (Adi, Madhya, Antya), it's traditionally considered inauspicious for health and progeny.
          </li>
          <li>
            <strong>Bhakoot Dosha</strong> — based on the rashi positions; certain combinations are considered unfavourable.
          </li>
        </ul>

        <h2>How to do kundli milan online</h2>
        <p>
          You need:
        </p>
        <ul>
          <li>Both partners' full date of birth</li>
          <li>Both partners' exact time of birth (down to the minute)</li>
          <li>Both partners' place of birth</li>
        </ul>
        <p>
          Plug these into{" "}
          <a href="https://daanyam.in/kundli-milan" target="_blank" rel="noopener noreferrer">
            Daanyam's kundli milan tool
          </a>{" "}
          and you'll get the full 36-guna breakdown, dosha analysis, and a clear recommendation. It's free and doesn't require an account.
        </p>

        <h2>A balanced perspective</h2>
        <p>
          Kundli milan is one data point in a marriage decision — alongside personality, shared values, family fit, and practical compatibility. Many strong marriages have low kundli scores, and many high-scoring matches don't work out. Treat it as guidance from a tradition with deep roots, not as a verdict.
        </p>

        <h2>Once you have a match: next steps</h2>
        <p>
          With a good kundli match, the natural next steps are: agreeing on a date (<Link to="/vivah-muhurat/2026">vivah muhurat</Link>), formalising the rishta, and creating biodatas to share with extended family. <Link to="/biodata-format">Our biodata format guide</Link> covers what to include.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
