import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What should I include in a marriage biodata?",
    answer:
      "A complete marriage biodata typically includes personal details (name, date of birth, height, religion, caste, education, occupation), family details (parents, siblings, family type), a recent photograph, and horoscope details (birth time and place). Optional sections include hobbies, partner preferences, and contact details.",
  },
  {
    question: "How long should a marriage biodata be?",
    answer:
      "Keep your marriage biodata to 1-2 pages. The first page should cover all essential personal, educational, and family details. A second page can include additional photos or expanded family information. Anything longer tends to be skimmed.",
  },
  {
    question: "Is a photo necessary in a marriage biodata?",
    answer:
      "Yes, a clear recent photograph significantly improves response rates. Use a well-lit photo with a neutral background. Avoid heavily filtered or group photos. On Rishte you can control exactly who sees your photo on a per-share basis.",
  },
  {
    question: "Should I include horoscope details in my biodata?",
    answer:
      "In Indian matrimonial contexts, yes — most families expect to see janma kundli details. Include date, time, and place of birth at minimum. On Rishte the horoscope step auto-generates a complete kundli using Daanyam's astrology engine.",
  },
  {
    question: "How do I share my marriage biodata privately?",
    answer:
      "Avoid public matrimonial sites that list profiles for anyone to browse. Use a private sharing tool like Rishte, where you generate a unique link for each family and can revoke access at any time. WhatsApp and email are also fine for trusted families.",
  },
  {
    question: "Is Rishte free to use?",
    answer:
      "Yes, Rishte is free to start. You can create a complete biodata, generate your kundli, and share it privately with families at no cost.",
  },
];

export function BiodataFormatMaster() {
  const route = getSeoForPath("/biodata-format");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Marriage Biodata Format — The Complete Guide"
        subheading="A modern, family-friendly biodata format with sample text, templates, and the privacy controls Indian families actually need."
        breadcrumbs={[{ label: "Biodata Format" }]}
      >
        <p>
          A marriage biodata is a one-to-two page summary of who you are — what your family looks like, what you do, and what kind of partner you're hoping to find. In Indian matrimonial culture, it's the first thing families exchange. A well-crafted biodata respects the reader's time, presents your story honestly, and gives prospective families just enough to decide whether to take the next step.
        </p>

        <p>
          This guide walks through exactly what to include, in what order, with sample text you can adapt. If you want to skip the formatting and jump straight to a finished biodata, you can{" "}
          <Link to="/onboarding">create yours free on Rishte</Link> in about five minutes.
        </p>

        <h2>The sections every marriage biodata needs</h2>
        <p>
          A complete biodata has six sections. Keep each one tight — families are scanning, not reading.
        </p>

        <h3>1. Personal details</h3>
        <p>The basics. Name, date of birth, height, complexion, religion, caste/community, mother tongue, current city.</p>
        <div className="content-sample">
          <h4 className="content-sample__heading">Sample</h4>
          <dl>
            <dt>Name</dt>
            <dd>Aanya Sharma</dd>
            <dt>Date of Birth</dt>
            <dd>14 March 1997</dd>
            <dt>Height</dt>
            <dd>5'5" (165 cm)</dd>
            <dt>Religion</dt>
            <dd>Hindu, Brahmin</dd>
            <dt>Mother Tongue</dt>
            <dd>Hindi</dd>
            <dt>Current City</dt>
            <dd>Bengaluru</dd>
          </dl>
        </div>

        <h3>2. Education and career</h3>
        <p>
          Your highest qualification, the institution, and your current work. Mention designation and company if you're comfortable — many families read this section most carefully. Keep it factual rather than promotional.
        </p>
        <div className="content-sample">
          <h4 className="content-sample__heading">Sample</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.Tech in Computer Science, IIT Delhi (2019)</dd>
            <dt>Occupation</dt>
            <dd>Senior Software Engineer, Atlassian</dd>
            <dt>Annual Income</dt>
            <dd>₹28 LPA</dd>
          </dl>
        </div>

        <h3>3. Family details</h3>
        <p>
          Parents' names and occupations, siblings, family type (nuclear/joint), and native place. Families look here for cultural and economic compatibility — share what feels comfortable without oversharing.
        </p>
        <div className="content-sample">
          <h4 className="content-sample__heading">Sample</h4>
          <dl>
            <dt>Father</dt>
            <dd>Rakesh Sharma — Retired Bank Manager</dd>
            <dt>Mother</dt>
            <dd>Sunita Sharma — Homemaker</dd>
            <dt>Brother</dt>
            <dd>Aarav Sharma — Doctor, married, lives in Pune</dd>
            <dt>Family Type</dt>
            <dd>Nuclear, traditional values</dd>
            <dt>Native Place</dt>
            <dd>Lucknow, Uttar Pradesh</dd>
          </dl>
        </div>

        <h3>4. Horoscope and astrology</h3>
        <p>
          In most Indian matrimonial conversations, horoscope details come up early. Include birth date, time, and place. If you have your <Link to="/kundli-milan">kundli</Link> ready, mention rashi, nakshatra, gotra, and manglik status — these are the fields families check first.
        </p>
        <p>
          On Rishte, the horoscope step generates a full janma kundli for you, with auto-detected rashi/nakshatra/manglik using{" "}
          <a href="https://daanyam.in" target="_blank" rel="noopener noreferrer">
            Daanyam's
          </a>{" "}
          Vedic astrology engine.
        </p>

        <h3>5. Photo</h3>
        <p>
          One clear, recent, well-lit photo with a neutral background. Avoid filters, group photos, or photos where you're holding a baby (unless the baby is yours — even then, save it for later). On Rishte, photos are stored privately and only visible to families you explicitly share with.
        </p>

        <h3>6. Partner preferences (optional)</h3>
        <p>
          Keep this short and honest. Age range, education range, broad city preference, and any non-negotiables (vegetarian, religious practice, etc.). Avoid laundry lists — they tend to filter out exactly the people you'd actually like.
        </p>

        <h2>Format and visual style</h2>
        <p>
          A biodata isn't a resume. Choose a format that feels warm — most families respond well to a single-page design with a tasteful header (your name and photo), section dividers, and a serif font. Rishte ships four templates by default: a traditional layout with marigold borders, a modern minimalist layout, a premium card-based layout, and a split-image layout. All are mobile-friendly because the reality is most biodatas are first viewed on WhatsApp.
        </p>

        <h2>Dos and don'ts</h2>
        <h3>Do</h3>
        <ul>
          <li>Use a recent photo — within the last year</li>
          <li>Be honest about education, income, and family details</li>
          <li>Include your birth time accurately (down to the minute, if possible)</li>
          <li>Mention dietary preferences and lifestyle habits if relevant</li>
          <li>Proofread carefully — typos read as carelessness</li>
        </ul>

        <h3>Don't</h3>
        <ul>
          <li>Use heavily filtered or AI-edited photos</li>
          <li>Inflate income or qualifications — families do verify</li>
          <li>Include your full address or phone number on a publicly shared biodata</li>
          <li>Write a paragraph of self-praise in "About Me" — let your details speak</li>
          <li>List a partner-preference checklist longer than five items</li>
        </ul>

        <h2>Community-specific formats</h2>
        <p>
          Different communities have slightly different conventions for what to include and how it's framed. We have dedicated guides for the most common ones:
        </p>
        <ul>
          <li>
            <Link to="/biodata-format/boy">Biodata format for boys (grooms)</Link>
          </li>
          <li>
            <Link to="/biodata-format/girl">Biodata format for girls (brides)</Link>
          </li>
          <li>
            <Link to="/biodata-format/hindi">Hindi biodata format (विवाह बायोडाटा)</Link>
          </li>
          <li>
            <Link to="/biodata-format/marathi">Marathi marriage biodata format</Link>
          </li>
          <li>
            <Link to="/biodata-format/gujarati">Gujarati biodata for marriage</Link>
          </li>
          <li>
            <Link to="/biodata-format/muslim">Muslim marriage / nikah biodata format</Link>
          </li>
          <li>
            <Link to="/biodata-format/sikh">Sikh / Anand Karaj biodata format</Link>
          </li>
        </ul>

        <h2>Sharing your biodata safely</h2>
        <p>
          Once your biodata is ready, how you share it matters as much as what's in it. We've written a separate guide on <Link to="/blog/biodata-sharing-etiquette">biodata sharing etiquette</Link> — when to share, who to share with, and how to keep your photo and horoscope private without being awkward about it.
        </p>

        <p>
          Rishte was built specifically for this — every share gets its own link, you choose what's visible on each one, and you can revoke access whenever you want.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
