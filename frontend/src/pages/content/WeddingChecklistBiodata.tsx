import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "How long does it take to make a marriage biodata?",
    answer:
      "With a biodata builder like Rishte, about 5-10 minutes if you have your details handy (DOB, education, occupation, family details, photo). The horoscope auto-generates from your birth details — no separate kundli step needed.",
  },
  {
    question: "What information do I need to gather first?",
    answer:
      "Personal details (full legal name as it appears on documents, exact DOB and birth time/place, height), education (degrees + institutes + years), career (designation, employer, salary), family (parents and siblings with their professions), a recent photo, and kuldevta/gotra if your community uses them.",
  },
  {
    question: "Should I show my biodata to my parents before sharing?",
    answer:
      "Yes — having your parents review the biodata before sharing is standard. They might add or remove things based on what's typical in your community. Treating it as a joint family document tends to lead to better matchmaking conversations.",
  },
];

export function WeddingChecklistBiodata() {
  const route = getSeoForPath("/wedding-checklist/biodata");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="How to Make a Marriage Biodata — Step-by-Step"
        subheading="A practical, 5-minute guide to creating a marriage biodata from scratch. What to gather, how to structure it, and how to share it safely."
        breadcrumbs={[
          { label: "Wedding Checklist", to: "/wedding-checklist" },
          { label: "Make a Biodata" },
        ]}
      >
        <p>
          A marriage biodata is the first impression your family makes in any rishta conversation. Here's how to put one together in five minutes — and avoid the mistakes that make biodatas get skipped over.
        </p>

        <h2>Step 1: Gather your information (10 minutes)</h2>
        <p>Before you open any tool, collect:</p>
        <ul>
          <li>Full legal name (as on Aadhaar/passport)</li>
          <li>Date of birth, exact birth time, and place of birth</li>
          <li>Height in feet/inches and centimetres</li>
          <li>Religion, caste/community, sub-caste, gotra, kuldevta (if applicable)</li>
          <li>Mother tongue and other languages spoken</li>
          <li>Current city and native place</li>
          <li>Highest education: degree, institute, year</li>
          <li>Current job: designation, employer, annual income</li>
          <li>Parents' names and occupations</li>
          <li>Siblings: name, profession, marital status, location</li>
          <li>One recent, well-lit photograph (within the last 12 months)</li>
        </ul>

        <h2>Step 2: Pick a format (5 minutes)</h2>
        <p>
          Choose a template that matches your family's style — traditional (marigold borders, devanagari touches), modern (minimalist, clean typography), premium (card-based with subtle gold), or split-photo (the photo gets equal weight to the text).
        </p>
        <p>
          Rishte ships with all four. Don't agonise over this — the content matters more than the design.
        </p>

        <h2>Step 3: Write the sections (15 minutes)</h2>
        <ol>
          <li>
            <strong>Personal details</strong> — start here. Fill in the basic facts.
          </li>
          <li>
            <strong>Education &amp; career</strong> — highest degree first, then current role.
          </li>
          <li>
            <strong>Family details</strong> — keep it warm but factual. "Father — retired bank manager. Mother — homemaker, active in temple seva."
          </li>
          <li>
            <strong>Horoscope</strong> — DOB, birth time, birth place; rashi/nakshatra/manglik if available. <Link to="/kundli-milan">Learn more about kundli matching</Link>.
          </li>
          <li>
            <strong>About me</strong> — 4-5 sentences. What you do, hobbies, what matters to you, what you're looking for.
          </li>
          <li>
            <strong>Partner preferences</strong> — 3-4 lines max.
          </li>
        </ol>

        <h2>Step 4: Add a photo (2 minutes)</h2>
        <p>
          One clear, recent photograph. Shoulders-up, neutral background, no filters. If you're a bride, a second photo in traditional attire is a nice addition.
        </p>

        <h2>Step 5: Review with family (30 minutes)</h2>
        <p>
          Show it to your parents and one trusted sibling or close friend. They'll catch things you missed — wrong year on a degree, an outdated job title, awkward phrasing.
        </p>

        <h2>Step 6: Share privately (ongoing)</h2>
        <p>
          Don't post your biodata publicly — share via private links. On Rishte, each share gets its own URL with its own privacy settings: you can hide photos, contact details, or even your full name on lower-trust shares. <Link to="/blog/biodata-sharing-etiquette">Read more on sharing etiquette</Link>.
        </p>

        <h2>Or: skip steps 2-6 and use Rishte</h2>
        <p>
          Rishte handles the formatting, kundli generation, template selection, and privacy controls. You answer step-by-step questions, and it generates a beautiful PDF + shareable link. <Link to="/onboarding">Create yours free</Link> — no credit card needed.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
