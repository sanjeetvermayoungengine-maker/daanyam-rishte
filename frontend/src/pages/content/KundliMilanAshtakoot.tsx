import { Link } from "react-router-dom";
import { ContentLayout, DaanyamCrossLink, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is Ashtakoot Milan?",
    answer:
      "Ashtakoot Milan is the most common method of kundli matching in Vedic astrology. It evaluates 8 specific compatibility factors (called koots), totalling 36 gunas. A higher total suggests greater compatibility.",
  },
  {
    question: "Which koot has the highest weight?",
    answer:
      "Nadi has the highest weight at 8 gunas. It relates to health and progeny compatibility. Bhakoot follows at 7, then Gana at 6, Graha Maitri at 5, Yoni at 4, Tara at 3, Vashya at 2, and Varna at 1.",
  },
  {
    question: "What is a 36 gun match?",
    answer:
      "A 36 gun match means the couple scored the maximum possible 36 out of 36 gunas across all 8 koots. It's extremely rare in practice and considered a perfect astrological match.",
  },
  {
    question: "Is Ashtakoot the only matching system?",
    answer:
      "No. South Indian traditions often use Dasakoot (10 koots) which adds two additional factors. Some pandits also use Manglik dosha analysis, Bhrigu/Nadi Jyotish, and other systems alongside Ashtakoot.",
  },
];

export function KundliMilanAshtakoot() {
  const route = getSeoForPath("/kundli-milan/ashtakoot");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Ashtakoot Matching — The 8 Koots &amp; 36 Gunas Explained"
        subheading="A complete breakdown of the 8 koots in Ashtakoot Milan — what each one measures, how points are awarded, and what scores mean for marriage compatibility."
        breadcrumbs={[
          { label: "Kundli Milan", to: "/kundli-milan" },
          { label: "Ashtakoot" },
        ]}
      >
        <p>
          Ashtakoot Milan is the system behind almost every "kundli match" you've heard about. "Ashta" means eight, "koot" means group — eight categories of compatibility, each scored, totalling 36 gunas. This page goes deeper than the basic explainer, walking through each koot.
        </p>

        <DaanyamCrossLink
          href="https://daanyam.in/kundli-milan"
          heading="Get your Ashtakoot breakdown"
          body="Daanyam's free kundli milan tool shows you the score for each of the 8 koots, with explanations for any low scores."
          cta="Check your Ashtakoot on Daanyam"
        />

        <h2>1. Varna Koot (1 guna)</h2>
        <p>
          Varna refers to the spiritual/ego classification of a person based on their moon sign. The four varnas are Brahmin (priestly), Kshatriya (warrior), Vaishya (merchant), and Shudra (worker). A point is awarded if the boy's varna is equal to or higher than the girl's.
        </p>
        <p>
          <em>Modern note: this is a classification within the kundli system, not a caste statement.</em>
        </p>

        <h2>2. Vashya Koot (2 gunas)</h2>
        <p>
          Vashya measures the natural attraction and influence between the two partners. Based on the moon signs, each zodiac is grouped into Manava (human), Vanachara (forest), Chatushpada (quadruped), Jalachara (aquatic), or Keeta (insect). Compatible groupings score full marks.
        </p>

        <h2>3. Tara Koot (3 gunas)</h2>
        <p>
          Tara is the birth-star compatibility. The girl's nakshatra is counted from the boy's nakshatra and divided by 9. The remainder tells you which "tara" the pair falls into. Auspicious taras (Sampat, Kshema, Sadhana, Mitra, Atimitra) award full points; inauspicious ones (Vipat, Pratyak, Vadha, Naidhana) award 1.5 or 0.
        </p>

        <h2>4. Yoni Koot (4 gunas)</h2>
        <p>
          Yoni assigns each nakshatra an animal symbol (horse, elephant, deer, snake, etc.). Compatibility is based on the natural relationship between the two animals. Same yoni: 4 points. Friendly yonis: 3. Neutral: 2. Inimical: 1. Enemy yonis: 0.
        </p>

        <h2>5. Graha Maitri Koot (5 gunas)</h2>
        <p>
          Graha Maitri evaluates the friendship between the lords of the two moon signs. Mutual friendship: 5 points. One-sided friendship: 4. Neutral: 3. Enmity: 0-1.
        </p>

        <h2>6. Gana Koot (6 gunas)</h2>
        <p>
          The 27 nakshatras are divided into three ganas: Deva (godly), Manushya (human), and Rakshasa (demonic). Deva-Deva or Manushya-Manushya: full 6 points. Deva-Manushya: 5. Manushya-Rakshasa: 1. Deva-Rakshasa: 0. This is one of the most-discussed koots since incompatible ganas suggest temperamental friction.
        </p>

        <h2>7. Bhakoot Koot (7 gunas)</h2>
        <p>
          Bhakoot evaluates the rashi (moon sign) positions relative to each other. Position differences of 1-7, 2-12, 3-11, 4-10, and 6-8 are considered unfavourable. Favourable distances award the full 7 points. Bhakoot Dosha (unfavourable positioning) is one of the major doshas in kundli matching.
        </p>

        <h2>8. Nadi Koot (8 gunas)</h2>
        <p>
          Nadi has the highest weight in Ashtakoot. The 27 nakshatras are divided into three nadis: Adi (first), Madhya (middle), and Antya (last). When the boy and girl share the same nadi, it's called Nadi Dosha — 0 points. Different nadis: 8 points.
        </p>
        <p>
          Because nadi has the highest weight, this single koot can swing the total significantly. <Link to="/kundli-milan/nadi-dosha">Read more about nadi dosha and its remedies</Link>.
        </p>

        <h2>What a typical breakdown looks like</h2>
        <table>
          <thead>
            <tr><th>Koot</th><th>Score</th><th>Out of</th></tr>
          </thead>
          <tbody>
            <tr><td>Varna</td><td>1</td><td>1</td></tr>
            <tr><td>Vashya</td><td>2</td><td>2</td></tr>
            <tr><td>Tara</td><td>3</td><td>3</td></tr>
            <tr><td>Yoni</td><td>3</td><td>4</td></tr>
            <tr><td>Graha Maitri</td><td>5</td><td>5</td></tr>
            <tr><td>Gana</td><td>5</td><td>6</td></tr>
            <tr><td>Bhakoot</td><td>0</td><td>7</td></tr>
            <tr><td>Nadi</td><td>8</td><td>8</td></tr>
            <tr><th>Total</th><th>27</th><th>36</th></tr>
          </tbody>
        </table>
        <p>
          In this example, the couple scores 27/36 — a very good match overall, with Bhakoot being the weak point. A pandit would typically suggest looking at the broader chart to see whether the Bhakoot Dosha is cancelled by other factors.
        </p>

        <h2>Get your own breakdown</h2>
        <p>
          You can compute your full Ashtakoot breakdown in 30 seconds on{" "}
          <a href="https://daanyam.in/kundli-milan" target="_blank" rel="noopener noreferrer">
            Daanyam
          </a>{" "}
          — enter both partners' birth details and you'll see all 8 koots with explanations, plus the overall recommendation.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
