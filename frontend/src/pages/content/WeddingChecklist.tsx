import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

const FAQS = [
  {
    question: "How far in advance should I start planning an Indian wedding?",
    answer:
      "Ideally 9-12 months before the wedding date. Major venues and good photographers book out a year in advance during peak season. Smaller weddings can be put together in 4-6 months but with less choice in venues and vendors.",
  },
  {
    question: "What's the first step in planning a Hindu wedding?",
    answer:
      "Get the vivah muhurat fixed — once both families have a date, every other decision can be sequenced around it. After that, in this order: venue, kundli matching, biodata exchange (if matchmaking is still in progress), guest list, catering, photographer.",
  },
  {
    question: "Do we need kundli matching before fixing the date?",
    answer:
      "If both families consider it important, yes. Most traditional families do kundli milan before committing to a date, since the kundli scores might influence which dates are auspicious for the specific couple.",
  },
  {
    question: "When should we create marriage biodatas?",
    answer:
      "Before serious matchmaking conversations begin — typically 3-6 months before you want to start meeting families. Biodatas often get forwarded multiple times before a match is found.",
  },
];

export function WeddingChecklist() {
  const route = getSeoForPath("/wedding-checklist");
  return (
    <>
      <SEOHead route={route} jsonLd={[faqPageJsonLd(FAQS)]} />
      <ContentLayout
        heading="The Complete Indian Wedding Checklist"
        subheading="A step-by-step planning guide from matchmaking and biodata exchange through the wedding day itself. What to do, in what order, and when."
        breadcrumbs={[{ label: "Wedding Checklist" }]}
      >
        <p>
          An Indian wedding is the joint effort of two families plus dozens of moving parts — vendors, ceremonies, guests, logistics. This checklist breaks it into stages so nothing gets missed.
        </p>

        <h2>Stage 1: Before the rishta (matchmaking begins)</h2>
        <ul>
          <li>
            <Link to="/biodata-format">Create your marriage biodata</Link> — name, education, family details, photo, kundli summary
          </li>
          <li>
            <a href="https://daanyam.in/kundli" target="_blank" rel="noopener noreferrer">
              Generate your kundli on Daanyam
            </a>{" "}
            so you have it ready when families ask
          </li>
          <li>Decide who in the family is the point of contact for incoming inquiries</li>
          <li>List specific preferences and dealbreakers (privately, not on the biodata)</li>
          <li>Set up a separate WhatsApp or email channel for matchmaking conversations</li>
        </ul>

        <h2>Stage 2: During the rishta conversation</h2>
        <ul>
          <li>Share biodatas privately — see <Link to="/blog/biodata-sharing-etiquette">our guide on biodata sharing etiquette</Link></li>
          <li>
            Do <Link to="/kundli-milan">kundli milan</Link> early if your family considers it important
          </li>
          <li>Verify the other family's basic facts (workplace, school, native place)</li>
          <li>Plan an initial in-person meeting at a neutral venue</li>
          <li>Discuss expectations: ceremony type, scale, location, dietary preferences</li>
        </ul>

        <h2>Stage 3: After engagement / rishta confirmed</h2>
        <h3>10-12 months out</h3>
        <ul>
          <li>
            Fix the <Link to="/vivah-muhurat/2026">vivah muhurat</Link> with both family pandits
          </li>
          <li>Decide ceremony scale (300, 500, 1000+ guests) and broad budget</li>
          <li>Book the wedding venue (especially if peak season)</li>
          <li>Book photographer + videographer</li>
          <li>Begin bridal/groom outfit research</li>
        </ul>

        <h3>6-9 months out</h3>
        <ul>
          <li>Book caterer and sample menus</li>
          <li>Book mehendi artist, makeup artist, decor team</li>
          <li>Bridal trousseau shopping</li>
          <li>Engagement ceremony if planning one</li>
          <li>Begin invitation card design</li>
          <li>Travel and accommodation for out-of-town guests</li>
        </ul>

        <h3>3-6 months out</h3>
        <ul>
          <li>Finalise outfits for all ceremonies (sangeet, mehendi, haldi, wedding, reception)</li>
          <li>Choreographer for sangeet if having one</li>
          <li>Book transportation (cars, horses for baraat)</li>
          <li>Send save-the-dates to out-of-town family</li>
          <li>Book hair, makeup, and grooming trials</li>
        </ul>

        <h3>1-3 months out</h3>
        <ul>
          <li>Print and distribute invitations</li>
          <li>Final guest count to caterer and venue</li>
          <li>Confirm pandit ji, ceremonies, and pooja material lists</li>
          <li>Trial run for hair/makeup</li>
          <li>Wedding rehearsal if having mixed-cultural elements</li>
          <li>Health: vitamins, skincare, sleep routine</li>
        </ul>

        <h3>Final 2 weeks</h3>
        <ul>
          <li>Confirm all vendor timings and contact persons</li>
          <li>Pack honeymoon bag if leaving immediately after</li>
          <li>Wedding day timeline shared with key family members</li>
          <li>Rest, hydrate, sleep</li>
        </ul>

        <h2>Common things that get forgotten</h2>
        <ul>
          <li>A "wedding day buddy" — someone whose only job is to manage your phone and answer questions</li>
          <li>Snacks/water stationed at key spots for the bride and groom during long ceremonies</li>
          <li>A flat-shoes backup for the bride after photo session</li>
          <li>Plug points and tech checks for the DJ / mic / sangeet</li>
          <li>Specific instructions to the photographer on which family combinations to capture</li>
        </ul>

        <h2>Tools that help</h2>
        <p>
          For the biodata and kundli stages,{" "}
          <Link to="/onboarding">Rishte creates your biodata</Link> in 5 minutes and{" "}
          <a href="https://daanyam.in" target="_blank" rel="noopener noreferrer">
            Daanyam
          </a>{" "}
          handles the astrology (kundli, muhurat, gun milan). For the wedding planning itself, a shared Google Sheet with vendor contacts and a Trello board for tasks both work well — fancy wedding planning apps tend to be overkill.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
