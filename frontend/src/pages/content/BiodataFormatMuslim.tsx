import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What is a Muslim marriage biodata (nikah biodata)?",
    answer:
      "A Muslim marriage biodata is a one-page profile shared between families during the rishta process. It typically includes personal details, sect/maslak (Sunni, Shia, Deobandi, Barelvi, Ahl-e-Hadees), education, occupation, family information, deen-related practices, and partner preferences.",
  },
  {
    question: "What should a Muslim biodata include that's different from others?",
    answer:
      "A Muslim biodata typically mentions sect/maslak, level of religious practice (regular namaz, hijab/purdah observance, halal-only diet), Quran/Hadith knowledge if relevant, and whether the candidate prefers a deeni or duniyawi household. These signal compatibility on faith practice early.",
  },
  {
    question: "Should I include sect details on a nikah biodata?",
    answer:
      "Yes — it's standard. Mention Sunni/Shia and your maslak (Hanafi, Shafi'i, Maliki, Hanbali for Sunni; Ja'fari for Shia; or specific schools like Deobandi, Barelvi, Ahl-e-Hadees, Salafi). Most families look for sect alignment.",
  },
  {
    question: "Is photo necessary on a Muslim biodata?",
    answer:
      "It depends on family preference. Many practicing Muslim families exchange photos only after initial interest is mutual, while others share photos upfront. Rishte lets you share a biodata without photos and add them later — a per-share visibility control specifically designed for this.",
  },
];

export function BiodataFormatMuslim() {
  const route = getSeoForPath("/biodata-format/muslim");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Muslim Marriage Biodata Format — Nikah Biodata Sample"
        subheading="A respectful, complete Muslim marriage biodata format with sample text, sect/maslak guidance, and the deeni details families look for."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "Muslim" },
        ]}
      >
        <p>
          A Muslim marriage biodata (sometimes called a nikah biodata or rishta biodata) is shared early in the matchmaking conversation between families. Beyond the standard education and family sections, it usually mentions sect, level of religious practice, and what kind of household the candidate hopes to build.
        </p>

        <h2>Sample Muslim marriage biodata</h2>

        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Mohammed Faizan Ahmed</dd>
            <dt>Date of Birth</dt>
            <dd>5 March 1996</dd>
            <dt>Place of Birth</dt>
            <dd>Hyderabad, Telangana</dd>
            <dt>Height</dt>
            <dd>5'11" (180 cm)</dd>
            <dt>Religion / Sect</dt>
            <dd>Sunni Muslim, Hanafi (Deobandi)</dd>
            <dt>Mother Tongue</dt>
            <dd>Urdu (fluent in Hindi, English)</dd>
            <dt>Current City</dt>
            <dd>Dubai, UAE</dd>
            <dt>Nationality</dt>
            <dd>Indian (UAE work visa)</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Education &amp; Career</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.Tech (Civil Engineering), Osmania University — 2018</dd>
            <dt>Higher Education</dt>
            <dd>M.S. Structural Engineering, NIT Warangal — 2020</dd>
            <dt>Occupation</dt>
            <dd>Senior Structural Engineer, AECOM Dubai</dd>
            <dt>Annual Income</dt>
            <dd>AED 240,000 (~₹54 LPA)</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Deen &amp; Practice</h4>
          <dl>
            <dt>Namaz</dt>
            <dd>Regular five-time namazi, attends jummah</dd>
            <dt>Quran</dt>
            <dd>Hafiz of selected paaras, recites daily</dd>
            <dt>Diet</dt>
            <dd>Halal only</dd>
            <dt>Beard</dt>
            <dd>Sunnah beard</dd>
            <dt>Looking for</dt>
            <dd>A deen-conscious, hijabi partner from a practising family</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Family</h4>
          <dl>
            <dt>Father</dt>
            <dd>Mohammed Ashraf Ahmed — Retired Government Officer</dd>
            <dt>Mother</dt>
            <dd>Razia Begum — Homemaker</dd>
            <dt>Brother</dt>
            <dd>Mohammed Imran Ahmed — Doctor, married, settled in Hyderabad</dd>
            <dt>Sister</dt>
            <dd>Aisha Ahmed — Teacher, married, in-laws in Bangalore</dd>
            <dt>Family</dt>
            <dd>Practising Sunni Hanafi household</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Partner Preferences</h4>
          <p style={{ margin: 0 }}>
            Sunni Muslim sister, 24-29 years, well-educated, practising (regular namaz, hijab observant), from a deen-conscious family. Open to relocating to Dubai or returning to India eventually. Insha'Allah looking for someone with whom to build a deeni home.
          </p>
        </div>

        <h2>Sections specific to Muslim biodatas</h2>
        <ul>
          <li>
            <strong>Sect &amp; Maslak</strong> — Sunni (Hanafi, Shafi'i, Maliki, Hanbali; Deobandi, Barelvi, Ahl-e-Hadees) or Shia (Ja'fari, Ismaili, Bohra)
          </li>
          <li>
            <strong>Deen / Practice level</strong> — namaz regularity, Quran recitation, hijab/beard observance, halal diet
          </li>
          <li>
            <strong>Mehr expectations</strong> — sometimes mentioned discreetly later, not on the biodata itself
          </li>
          <li>
            <strong>Family practice</strong> — describing whether the household is practising vs. cultural Muslim
          </li>
        </ul>

        <h2>Tone and language</h2>
        <p>
          Use respectful religious language where it feels natural: "Alhamdulillah", "Insha'Allah", "by the grace of Allah". Don't over-use them — too much can feel performative. The tone should match how your family actually speaks.
        </p>

        <h2>Privacy and photos</h2>
        <p>
          Many practising Muslim families prefer to exchange photos only after initial mutual interest. Rishte was built with this in mind — you can share a biodata without photos visible, and unlock photo access on a per-share basis once both families are aligned. <Link to="/privacy-first-matchmaking">Read more about privacy-first matchmaking</Link>.
        </p>

        <p>
          The platform also supports Urdu script (اردو) and English in templates, and lets you keep WhatsApp/phone contact private until the rishta is being seriously considered.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
