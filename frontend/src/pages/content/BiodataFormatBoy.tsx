import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What should a biodata for a boy include?",
    answer:
      "A groom's biodata should include personal details (name, DOB, height, religion, caste, mother tongue), education (highest qualification + institute), occupation (designation, company, income), family details (parents' occupations, siblings), horoscope (DOB, time, place, rashi/nakshatra), a recent photo, and brief partner preferences.",
  },
  {
    question: "Should a boy mention his salary on the biodata?",
    answer:
      "Mentioning your annual income is standard practice in Indian matrimonial biodatas — most families look for it. Keep it accurate. If you're early in your career or income varies (entrepreneur), you can give a range or describe your role instead.",
  },
  {
    question: "What photo should a boy use on his biodata?",
    answer:
      "Use one clear, recent, well-lit photo — typically a smart-casual or formal shoulders-up shot with a neutral background. Avoid sunglasses, group photos, gym selfies, and heavily filtered images. A second photo in traditional attire is a nice optional addition.",
  },
  {
    question: "Is height important to mention in a groom's biodata?",
    answer:
      "Yes, height is one of the most-looked-at fields in Indian biodatas. State your height in both feet/inches and centimetres for clarity (e.g. 5'10\" / 178 cm).",
  },
  {
    question: "How should a boy describe partner preferences?",
    answer:
      "Keep it to 3-4 lines max. Mention age range, education range, broad city preference, and one or two values that matter (e.g. family-oriented, working / homemaker comfortable either way). Avoid long checklists — they read as picky.",
  },
];

export function BiodataFormatBoy() {
  const route = getSeoForPath("/biodata-format/boy");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Biodata Format for Marriage for Boy"
        subheading="A complete sample biodata format for grooms — what to include, how to phrase it, and a free template you can create in 5 minutes."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "For Boy" },
        ]}
      >
        <p>
          A groom's marriage biodata gets read in under 30 seconds — usually by a mother or auntie scrolling on WhatsApp. The best biodatas are easy to scan, honest, and signal stability without bragging. This guide gives you the exact sections, sample text, and a finished template.
        </p>

        <h2>Sample biodata for a boy</h2>
        <p>Here's a complete sample. Adapt the fields to your situation and tone.</p>

        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Arjun Mehta</dd>
            <dt>Date of Birth</dt>
            <dd>22 August 1995 (Age 30)</dd>
            <dt>Time of Birth</dt>
            <dd>06:42 AM</dd>
            <dt>Place of Birth</dt>
            <dd>Pune, Maharashtra</dd>
            <dt>Height</dt>
            <dd>5'10" (178 cm)</dd>
            <dt>Complexion</dt>
            <dd>Fair</dd>
            <dt>Religion / Caste</dt>
            <dd>Hindu, Brahmin (Deshastha)</dd>
            <dt>Gotra</dt>
            <dd>Vasishtha</dd>
            <dt>Mother Tongue</dt>
            <dd>Marathi (fluent in English, Hindi)</dd>
            <dt>Current City</dt>
            <dd>Bengaluru</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Education &amp; Career</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.Tech (Computer Science), IIT Bombay — 2017</dd>
            <dt>Higher Education</dt>
            <dd>MS in Machine Learning, Stanford — 2019</dd>
            <dt>Occupation</dt>
            <dd>Senior Software Engineer, Google</dd>
            <dt>Annual Income</dt>
            <dd>₹48 LPA</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Family Details</h4>
          <dl>
            <dt>Father</dt>
            <dd>Suresh Mehta — Retired Senior Manager, BHEL</dd>
            <dt>Mother</dt>
            <dd>Anjali Mehta — Homemaker (formerly school teacher)</dd>
            <dt>Sister</dt>
            <dd>Aarohi Mehta — Doctor (Cardiologist), married, settled in Pune</dd>
            <dt>Family Type</dt>
            <dd>Nuclear, traditional values</dd>
            <dt>Native Place</dt>
            <dd>Pune, Maharashtra</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Horoscope</h4>
          <dl>
            <dt>Rashi</dt>
            <dd>Vrishabha (Taurus)</dd>
            <dt>Nakshatra</dt>
            <dd>Rohini</dd>
            <dt>Manglik</dt>
            <dd>No</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">About Me</h4>
          <p style={{ margin: 0 }}>
            I work in machine learning and care a lot about my craft. Outside work I cook, run long-distance, and read non-fiction. I'm close to my parents and visit Pune often. Looking for a thoughtful, ambitious partner who values family.
          </p>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Partner Preferences</h4>
          <p style={{ margin: 0 }}>
            Age 26-30, well-educated (postgraduate preferred), working professional, family-oriented. Open to all sub-castes. Vegetarian preferred.
          </p>
        </div>

        <h2>Section-by-section guide</h2>

        <h3>1. Personal details</h3>
        <p>
          The non-negotiables: full name, DOB, birth time, birth place, height, complexion, religion/caste, gotra (if applicable), mother tongue, current city. Include birth time accurately — families with traditional values will check your kundli.
        </p>

        <h3>2. Education and career</h3>
        <p>
          List your highest qualification first, then any additional degrees, then current job (designation + company). Mention income — it's expected. If your career trajectory tells a good story (e.g. moved from one strong company to another), say so briefly.
        </p>

        <h3>3. Family details</h3>
        <p>
          Father and mother's name and occupation. Each sibling: name, profession, marital status, where they live. Family type (nuclear/joint), native place, and a one-line value description (traditional, liberal, etc.) help paint a quick picture.
        </p>

        <h3>4. Horoscope</h3>
        <p>
          At minimum: DOB, time, place. If you can, add rashi, nakshatra, gotra, and manglik status — these are the four fields families check first.{" "}
          <Link to="/kundli-milan">Learn how kundli matching works</Link> if you're curious. On Rishte, the horoscope step auto-generates all of these for you.
        </p>

        <h3>5. About me (optional but recommended)</h3>
        <p>
          Four to five sentences max. Mention what you do, one or two hobbies, your relationship with family, and what you're looking for. Avoid corporate-speak ("hardworking, results-driven") and clichés ("looking for my soulmate").
        </p>

        <h3>6. Partner preferences</h3>
        <p>
          Three to four lines. Age range, education, work status, and one or two values. Resist the urge to list dealbreakers — they read as picky and filter out exactly the people you might actually like.
        </p>

        <h2>Common mistakes to avoid</h2>
        <ul>
          <li>Photo from 5 years ago — use a recent one</li>
          <li>Inflated income or designation — families verify</li>
          <li>Listing every degree and certification — pick the top 2-3</li>
          <li>Long partner preference checklist — keep it to 3-4 things</li>
          <li>Writing in the third person ("Arjun is a smart, ambitious...") — first person reads more naturally</li>
        </ul>

        <h2>Create your biodata in 5 minutes</h2>
        <p>
          Rishte has a step-by-step biodata builder designed for Indian grooms. You enter your details, pick from four templates (traditional, modern, premium, split-photo), and generate a beautiful PDF or shareable link. Photos and horoscope details are private by default — you choose who sees what on each share.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
