import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "What should a biodata for a girl include?",
    answer:
      "A bride's biodata should include personal details (name, DOB, height, religion, caste, mother tongue), education and current occupation, family details (parents and siblings), horoscope (DOB, time, place, rashi/nakshatra/manglik), a recent photo, and a short partner preferences section.",
  },
  {
    question: "Should a working woman mention her career on the biodata?",
    answer:
      "Yes — most modern matrimonial conversations expect it. Include your role, employer, and either income or a salary range. It signals independence and is increasingly expected by good families.",
  },
  {
    question: "What kind of photo should a girl use?",
    answer:
      "A clear, recent, well-lit photo with a neutral background. Indian families often prefer one casual/professional photo plus one in traditional attire (saree, salwar, lehenga). Avoid heavily filtered photos — they damage trust.",
  },
  {
    question: "Is it okay to keep contact details off the biodata?",
    answer:
      "Yes, and strongly recommended. Don't put your phone number or full address on a biodata shared widely. Share contact details only after the families have spoken. Rishte's privacy settings let you keep contact info hidden by default on shared biodatas.",
  },
  {
    question: "How should a girl describe partner preferences?",
    answer:
      "Keep it short — 3-4 lines. Age range, education range, broad city preference, and one or two non-negotiables. Mention working-status preferences (open to working/non-working/either) and family values you'd like aligned.",
  },
];

export function BiodataFormatGirl() {
  const route = getSeoForPath("/biodata-format/girl");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="Biodata Format for Marriage for Girl"
        subheading="A complete sample biodata format for brides — sections, sample text, photo guidance, and a free template you can use in 5 minutes."
        breadcrumbs={[
          { label: "Biodata Format", to: "/biodata-format" },
          { label: "For Girl" },
        ]}
      >
        <p>
          A bride's biodata sets the tone for every conversation that follows. It should feel warm, honest, and personal — not corporate. The goal is to communicate enough that families can decide whether to take the next step, without giving away private details.
        </p>

        <h2>Sample biodata for a girl</h2>
        <div className="content-sample">
          <h4 className="content-sample__heading">Personal Details</h4>
          <dl>
            <dt>Name</dt>
            <dd>Riya Krishnan</dd>
            <dt>Date of Birth</dt>
            <dd>11 February 1998 (Age 27)</dd>
            <dt>Time of Birth</dt>
            <dd>03:14 PM</dd>
            <dt>Place of Birth</dt>
            <dd>Chennai, Tamil Nadu</dd>
            <dt>Height</dt>
            <dd>5'4" (163 cm)</dd>
            <dt>Religion / Caste</dt>
            <dd>Hindu, Iyer</dd>
            <dt>Gotra</dt>
            <dd>Bharadwaj</dd>
            <dt>Mother Tongue</dt>
            <dd>Tamil (fluent in English, Hindi)</dd>
            <dt>Current City</dt>
            <dd>Mumbai</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Education &amp; Career</h4>
          <dl>
            <dt>Education</dt>
            <dd>B.A. Economics, St. Stephen's College, Delhi — 2019</dd>
            <dt>Higher Education</dt>
            <dd>MBA, IIM Bangalore — 2022</dd>
            <dt>Occupation</dt>
            <dd>Strategy Consultant, McKinsey &amp; Company</dd>
            <dt>Annual Income</dt>
            <dd>₹38 LPA</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Family Details</h4>
          <dl>
            <dt>Father</dt>
            <dd>Krishnan Iyer — Professor, IIT Madras</dd>
            <dt>Mother</dt>
            <dd>Lakshmi Krishnan — Pediatrician (private practice)</dd>
            <dt>Brother</dt>
            <dd>Karthik Krishnan — Software Engineer, settled in San Francisco</dd>
            <dt>Family Type</dt>
            <dd>Nuclear, educated &amp; progressive</dd>
            <dt>Native Place</dt>
            <dd>Palakkad, Kerala</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Horoscope</h4>
          <dl>
            <dt>Rashi</dt>
            <dd>Kumbha (Aquarius)</dd>
            <dt>Nakshatra</dt>
            <dd>Shatabhisha</dd>
            <dt>Manglik</dt>
            <dd>No</dd>
          </dl>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">About Me</h4>
          <p style={{ margin: 0 }}>
            I'm a consultant by day and an amateur baker on weekends. I read more than I should and travel whenever I can. I'm close to my parents and value family traditions while being independent in my own life. Looking for a thoughtful partner who's curious about the world.
          </p>
        </div>

        <div className="content-sample">
          <h4 className="content-sample__heading">Partner Preferences</h4>
          <p style={{ margin: 0 }}>
            Age 28-33, postgraduate, working professional, family-oriented but progressive. Open to all sub-castes within Tamil Brahmin community. Vegetarian preferred.
          </p>
        </div>

        <h2>Section-by-section guide</h2>

        <h3>1. Personal details</h3>
        <p>
          Full name, DOB, time and place of birth, height, complexion (optional — many modern biodatas now skip this), religion, sub-caste/community, gotra, mother tongue, current city. Birth time is important if your family values kundli matching.
        </p>

        <h3>2. Education and career</h3>
        <p>
          List your highest qualification, the institute, and graduation year. Then current occupation: designation, employer, and income. Many modern families respect a strong career — share it confidently.
        </p>

        <h3>3. Family details</h3>
        <p>
          Parents' names and occupations, siblings (name, profession, marital status, location), family type (nuclear/joint), and native place. Don't include extended family unless directly relevant.
        </p>

        <h3>4. Horoscope</h3>
        <p>
          Include DOB, time, place, rashi, nakshatra, and manglik status — these matter to most traditional families. If you don't know your rashi/nakshatra,{" "}
          <a href="https://daanyam.in/kundli" target="_blank" rel="noopener noreferrer">
            Daanyam can generate your full kundli
          </a>{" "}
          from your birth details. <Link to="/kundli-milan/manglik">Read more about manglik dosha</Link> if you have questions about it.
        </p>

        <h3>5. About me</h3>
        <p>
          A short paragraph (4-5 sentences). Hobbies, what you care about, your relationship with family, what you do for fun. Authenticity beats polish here — write the way you'd describe yourself to a friend.
        </p>

        <h3>6. Partner preferences</h3>
        <p>
          Brief. Age, education, work status, location preference, and one or two values. Avoid listing 15 dealbreakers — it sends the wrong signal.
        </p>

        <h2>Privacy: what to leave OFF a girl's biodata</h2>
        <p>
          A biodata gets forwarded freely on WhatsApp. Once it's out, you can't pull it back. Keep these off the version you share widely:
        </p>
        <ul>
          <li>Your phone number — share after the families have spoken</li>
          <li>Full home address — city is fine, street isn't</li>
          <li>Workplace location specifics — "Mumbai" is fine, not your office building</li>
          <li>Social media handles</li>
          <li>Family income details beyond a rough indication</li>
        </ul>

        <p>
          Rishte was built specifically to solve this. Each share gets its own link with its own visibility settings — you can hide photos, contact, or even your full name on lower-trust shares. <Link to="/privacy-first-matchmaking">Learn more about privacy-first matchmaking</Link>.
        </p>

        <h2>Photo tips for a bride's biodata</h2>
        <ul>
          <li>Two photos work well: one professional/casual, one in traditional attire</li>
          <li>Recent — within the last 6-12 months</li>
          <li>Good natural light, neutral background</li>
          <li>No heavy filters or AI smoothing</li>
          <li>Avoid group photos, baby photos, and travel-destination photos as the primary</li>
        </ul>

        <h2>Create your biodata in 5 minutes</h2>
        <p>
          Rishte's builder walks you through each section, suggests phrasing, generates your kundli automatically, and lets you choose between four beautiful templates. Your photos and horoscope are private by default and you control visibility on every share.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
