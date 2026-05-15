import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is a Sikh marriage biodata?",
    answer:
      "A Sikh marriage biodata (Anand Karaj biodata) is a one-page profile used in Sikh matchmaking. It includes personal details, gotra/got (clan), level of religious practice (Amritdhari, Sahejdhari, Keshdhari), education, family details, and partner preferences. Sikh biodatas don't typically include kundli details since astrology isn't central to Sikhi.",
  },
  {
    question: "Should a Sikh biodata mention sect / amrit status?",
    answer:
      "Yes — it's a meaningful compatibility marker. Amritdhari (initiated Sikhs who follow rehat), Keshdhari (uncut hair, turban-wearing but not yet Amritdhari), Sahejdhari (those who follow Sikhi without all the outward articles), and Patit (lapsed practice) families often prefer alignment.",
  },
  {
    question: "Is gotra/got important in a Sikh biodata?",
    answer:
      "Yes, traditional Sikh families avoid same-gotra alliances. Common gotras include Sandhu, Sidhu, Brar, Dhillon, Gill, Bajwa, Cheema, Sodhi, Bedi, Sahota, and many more.",
  },
  {
    question: "Do Sikh biodatas mention kundli?",
    answer:
      "Generally no — Sikhi does not require kundli matching for marriage. Some Punjabi families do consult astrologers, but it's a cultural preference, not a religious requirement. Most Sikh biodatas focus on family values, education, and Sikhi practice instead.",
  },
];

export function BiodataFormatSikh() {
  const route = getSeoForPath("/biodata-format/sikh");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Sikh Marriage Biodata Format — Anand Karaj Biodata"
        subheading="A respectful Sikh marriage biodata format with sample text, gotra/got guidance, amrit status, and how to present a Punjabi Sikh family well."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "Sikh" },
        ]}
      >
        <p>
          Sikh marriage biodatas — used in arranging Anand Karaj ceremonies — focus on family values, education, and the level of Sikhi practice. Unlike most Hindu biodatas, kundli details are usually omitted; what matters more is gotra alignment, amrit status, and the broader cultural match.
        </p>

        <h2>Sample Sikh marriage biodata</h2>

        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Harleen Kaur Sandhu</dd>
            <dt>Date of Birth</dt>
            <dd>20 November 1996</dd>
            <dt>Place of Birth</dt>
            <dd>Amritsar, Punjab</dd>
            <dt>Height</dt>
            <dd>5'6" (168 cm)</dd>
            <dt>Religion</dt>
            <dd>Sikh, Jat Sikh</dd>
            <dt>Gotra (Got)</dt>
            <dd>Sandhu</dd>
            <dt>Practice</dt>
            <dd>Keshdhari, daily Nitnem, gurdwara every Sunday</dd>
            <dt>Mother Tongue</dt>
            <dd>Punjabi (fluent in English, Hindi)</dd>
            <dt>Current City</dt>
            <dd>Toronto, Canada (Canadian citizen)</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Education &amp; Career</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.Sc. Nursing, Punjab University — 2018</dd>
            <dt>Higher Education</dt>
            <dd>MN (Master of Nursing), University of Toronto — 2022</dd>
            <dt>Occupation</dt>
            <dd>Registered Nurse, Toronto General Hospital</dd>
            <dt>Annual Income</dt>
            <dd>CAD 95,000</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Family</h4>
          <dl>
            <dt>Father</dt>
            <dd>S. Gurpreet Singh Sandhu — Farmer / Retired Senior Officer, Punjab Police</dd>
            <dt>Mother</dt>
            <dd>Sdr.ji Harjit Kaur — Homemaker, active in gurdwara seva</dd>
            <dt>Brother</dt>
            <dd>Manpreet Singh Sandhu — Engineer, married, settled in Calgary</dd>
            <dt>Native Village</dt>
            <dd>Tarn Taran district, Punjab</dd>
            <dt>Family</dt>
            <dd>Practising Sikh family, ancestral village with strong gurdwara ties</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Partner Preferences</h4>
          <p style={{ margin: 0 }}>
            Sikh Jat / Khatri groom, age 27-32, well-educated, practising Sikh (regular Nitnem, gurdwara), family-oriented. Open to Canada-settled or India-based with willingness to relocate. Vegetarian preferred (open to discussion).
          </p>
        </div>

        <h2>What's unique about Sikh biodatas</h2>
        <ul>
          <li>
            <strong>No kundli section</strong> — Sikhi doesn't require astrological matching
          </li>
          <li>
            <strong>Got / Gotra is essential</strong> — Sandhu, Sidhu, Brar, Dhillon, Gill, Bajwa, Cheema, Sodhi, Bedi, Mann, etc.
          </li>
          <li>
            <strong>Amrit / Practice status</strong> — Amritdhari, Keshdhari, Sahejdhari, Mona Sikh — families often look for alignment
          </li>
          <li>
            <strong>Punjabi cultural fit</strong> — village/native place, family ties to specific districts, gurdwara involvement
          </li>
          <li>
            <strong>NRI status often relevant</strong> — Canada (esp. GTA), UK, USA, Australia — practical visa/relocation details help
          </li>
        </ul>

        <h2>Tips for a Sikh biodata</h2>
        <p>
          Use respectful prefixes where appropriate — "S./Sdr." (Sardar) for men, "Sdr.ji/Bibi" for women, when describing parents. Mention village/native place — it's culturally important even for second-generation NRI families. If your family is heavily involved in gurdwara seva or has religious lineage, that's worth a mention.
        </p>

        <p>
          For NRI Sikh matchmaking, mention citizenship/residency clearly. <Link to="/blog/biodata-sharing-etiquette">Read our guide on sharing biodatas safely</Link> — especially relevant when family members in India and abroad are both involved.
        </p>

        <p>
          Rishte's biodata builder works well for Sikh marriage biodatas — you can omit the kundli section if you prefer, use Punjabi script (ਪੰਜਾਬੀ) alongside English, and control who sees what on each share.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
