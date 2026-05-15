import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is a Gujarati biodata for marriage?",
    answer:
      "A Gujarati marriage biodata is a one-page profile used in Gujarati matrimonial introductions. It typically includes personal details, gnati/community (Patel, Brahmin, Vaishnav, Lohana, Jain, Sindhi-Gujarati, etc.), kuldevi, native place (mool gaam), education, family, and horoscope.",
  },
  {
    question: "Which Gujarati communities have specific biodata conventions?",
    answer:
      "Gujarati communities like Patidar (Leuva, Kadva, Anavil), Vaishnav Vaniya, Lohana, Brahmin (Shrimali, Nagar, Audichya), Jain (Shwetambar, Digambar), and Bhanushali each have their own conventions around what to include. Gnati/sub-caste and kuldevi are almost always mentioned.",
  },
  {
    question: "Is mentioning vegetarian/Jain dietary preferences important?",
    answer:
      "Yes — for many Gujarati and Jain families this is a key compatibility check. Be specific: pure vegetarian, eggless, Jain (no root vegetables), etc. This saves both families time.",
  },
  {
    question: "Should I include business/family enterprise details?",
    answer:
      "If your family runs a business, it's standard to mention it briefly (\"Family business — textiles, since 1968\"). Many Gujarati matrimonial conversations involve business compatibility, so being upfront helps.",
  },
];

export function BiodataFormatGujarati() {
  const route = getSeoForPath("/biodata-format/gujarati");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Gujarati Biodata for Marriage — ગુજરાતી લગ્ન બાયોડેટા"
        subheading="A complete Gujarati biodata sample with gnati, kuldevi, native place, and the cultural details Gujarati families actually look for."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "Gujarati" },
        ]}
      >
        <p>
          Gujarati matrimonial biodatas have a distinct style. Beyond the standard sections, Gujarati families look for gnati (sub-caste), kuldevi (family goddess), mool gaam (native village), and — for many families — clarity on dietary preferences (vegetarian, eggless, Jain). This guide gives you a complete sample plus the cultural context.
        </p>

        <h2>Sample Gujarati biodata</h2>
        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Krish Patel (કૃષ પટેલ)</dd>
            <dt>Date of Birth</dt>
            <dd>12 October 1996</dd>
            <dt>Time of Birth</dt>
            <dd>09:30 AM</dd>
            <dt>Place of Birth</dt>
            <dd>Ahmedabad, Gujarat</dd>
            <dt>Height</dt>
            <dd>5'11" (180 cm)</dd>
            <dt>Religion / Gnati</dt>
            <dd>Hindu, Leuva Patel</dd>
            <dt>Kuldevi</dt>
            <dd>Maa Khodiyar</dd>
            <dt>Mool Gaam</dt>
            <dd>Charotar, Anand district</dd>
            <dt>Mother Tongue</dt>
            <dd>Gujarati (fluent in English, Hindi)</dd>
            <dt>Diet</dt>
            <dd>Pure vegetarian, eggless</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Education &amp; Career</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.Com, Gujarat University — 2017</dd>
            <dt>Higher Education</dt>
            <dd>MBA Finance, NMIMS Mumbai — 2020</dd>
            <dt>Occupation</dt>
            <dd>Investment Banker, Edelweiss Securities</dd>
            <dt>Annual Income</dt>
            <dd>₹35 LPA</dd>
            <dt>Family Business</dt>
            <dd>Textile manufacturing (Patel family enterprise, since 1972)</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Family</h4>
          <dl>
            <dt>Father</dt>
            <dd>Mahendrabhai Patel — Director, Patel Textiles Pvt. Ltd.</dd>
            <dt>Mother</dt>
            <dd>Rekhaben Patel — Homemaker, active in community trust</dd>
            <dt>Sister</dt>
            <dd>Khushi Patel — Chartered Accountant, married, settled in London</dd>
            <dt>Family Type</dt>
            <dd>Joint, traditional Vaishnav values</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Horoscope</h4>
          <dl>
            <dt>Rashi</dt>
            <dd>Tula (Libra)</dd>
            <dt>Nakshatra</dt>
            <dd>Swati</dd>
            <dt>Manglik</dt>
            <dd>No</dd>
          </dl>
        </div>

        <h2>What Gujarati families specifically look for</h2>
        <ul>
          <li>
            <strong>Gnati / Sub-caste</strong> — Leuva Patel, Kadva Patel, Anavil Brahmin, Audichya, Shwetambar Jain, Vaishnav Vaniya, Lohana, Bhanushali, etc.
          </li>
          <li>
            <strong>Kuldevi</strong> — Khodiyar, Bahuchara, Ambaji, Mahalakshmi, Ashapura, depending on community
          </li>
          <li>
            <strong>Mool Gaam / Native Village</strong> — important even for families settled abroad
          </li>
          <li>
            <strong>Dietary preference</strong> — vegetarian, eggless, Jain (no root vegetables), or non-vegetarian
          </li>
          <li>
            <strong>Family business or profession</strong> — Gujarati communities often have business-oriented matchmaking
          </li>
        </ul>

        <h2>Tips for a strong Gujarati biodata</h2>
        <p>
          Lead with English for readability across families and the diaspora, but include Gujarati for the name and any blessing/title. If your family has a long-running business, mention it — it's a positive signal in most Gujarati matchmaking conversations.
        </p>

        <p>
          For NRI Gujarati matches, mention current city, citizenship/visa status (briefly), and how often you visit India. <Link to="/blog/biodata-sharing-etiquette">Read our guide on how to share biodatas safely</Link>, especially when forwarding to relatives abroad.
        </p>

        <p>
          Rishte's biodata builder works beautifully for Gujarati biodatas — templates support Gujarati script (ગુજરાતી) and English side-by-side, and you can keep contact details private while still sharing with verified families.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
