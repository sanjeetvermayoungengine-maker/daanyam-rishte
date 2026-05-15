import { Link } from "react-router-dom";
import { ContentLayout, FAQSection } from "../../seo/ContentLayout";
import { SEOHead, articleJsonLd, faqPageJsonLd } from "../../seo/SEOHead";
import { getSeoForPath, SITE_ORIGIN } from "../../seo/routes";

const FAQS = [
  {
    question: "Is it rude to ask for someone's biodata?",
    answer:
      "Not at all — it's the standard first step in Indian arranged matchmaking. The polite way is to ask through a mutual connection (relative, friend, broker) rather than directly. Once the other family is open to the conversation, biodatas are exchanged.",
  },
  {
    question: "Should I share my biodata on WhatsApp groups?",
    answer:
      "Avoid posting on open WhatsApp groups. Share with specific people on direct chats or in trusted, small family groups. Biodatas posted in larger groups tend to get forwarded widely without your control.",
  },
  {
    question: "What information should I leave OFF the biodata I share?",
    answer:
      "Your home address (city is fine, street is not), phone number for the version shared with brokers and acquaintances, workplace address, and social media handles. These can be shared 1:1 once a conversation is actually happening.",
  },
];

export function BlogBiodataSharingEtiquette() {
  const route = getSeoForPath("/blog/biodata-sharing-etiquette");
  return (
    <>
      <SEOHead
        route={route}
        jsonLd={[
          articleJsonLd({
            title: route.title,
            description: route.description,
            url: `${SITE_ORIGIN}${route.path}`,
            datePublished: "2026-01-20",
          }),
          faqPageJsonLd(FAQS),
        ]}
      />
      <ContentLayout
        heading="How to Share a Marriage Biodata — Etiquette &amp; Best Practices"
        subheading="The unwritten rules of sharing biodatas — when to share, who to share with, what to keep private, and how to handle awkward forwards."
        breadcrumbs={[
          { label: "Blog", to: "/blog/biodata-sharing-etiquette" },
          { label: "Sharing Etiquette" },
        ]}
      >
        <p>
          Sharing a marriage biodata is one of those things nobody teaches you. You write it, send it, and hope. But there are real conventions — and getting them right makes your matchmaking smoother. Here's the etiquette.
        </p>

        <h2>Who to share with — in order</h2>
        <ol>
          <li>
            <strong>Immediate family first:</strong> parents, married siblings. They'll review for accuracy and add anything that's missing.
          </li>
          <li>
            <strong>Extended family next:</strong> chachas, mausis, etc. who actively help with matchmaking. They'll forward selectively.
          </li>
          <li>
            <strong>Family friends and community contacts:</strong> people who know suitable families.
          </li>
          <li>
            <strong>Marriage brokers (vichola):</strong> only after research. They'll forward widely, so use a restricted-visibility version.
          </li>
          <li>
            <strong>Specific families:</strong> when you know a particular family and want to introduce yourself.
          </li>
        </ol>

        <h2>What to keep private at each tier</h2>
        <table>
          <thead>
            <tr><th>Tier</th><th>Photo</th><th>Contact</th><th>Full kundli</th></tr>
          </thead>
          <tbody>
            <tr><td>Immediate family</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Extended family</td><td>Yes</td><td>Often</td><td>Yes</td></tr>
            <tr><td>Family friends</td><td>Yes</td><td>No (let them ask you)</td><td>Yes</td></tr>
            <tr><td>Brokers</td><td>Depends — many prefer no</td><td>No</td><td>Summary only</td></tr>
            <tr><td>Specific families (initial)</td><td>Yes</td><td>No (use intermediary)</td><td>Summary only</td></tr>
            <tr><td>Specific families (post-interest)</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
          </tbody>
        </table>

        <h2>How to actually share</h2>
        <h3>The old way: PDF</h3>
        <p>
          You make a PDF, send it on WhatsApp, and it gets forwarded. You have no idea where it ends up. You can't update it after sharing. You can't restrict what's visible. This is the default — and it's bad.
        </p>

        <h3>The better way: private share links</h3>
        <p>
          Generate a unique link for each recipient. Each link has its own visibility rules. You can revoke any link if needed. Rishte does this — see{" "}
          <Link to="/privacy-first-matchmaking">privacy-first matchmaking</Link>.
        </p>

        <h2>What to write when sending</h2>
        <p>
          A short, warm note alongside the biodata. Something like:
        </p>
        <blockquote>
          "Sharing my (or my daughter's/son's) biodata for your kind consideration. Please feel free to suggest if you have any families in mind. Looking forward to your guidance."
        </blockquote>
        <p>
          Avoid: pressuring language ("please find someone urgently"), over-disclosure of preferences, or asking the recipient to "spread this widely".
        </p>

        <h2>Handling awkward forwards</h2>
        <p>
          Someone will forward your biodata without asking. It happens. Don't react — just quietly revoke the link if you were using a private sharing tool, or accept it if you sent a PDF. Take it as feedback to use private links next time.
        </p>

        <h2>When to follow up</h2>
        <p>
          7-10 days after sharing, a gentle follow-up is fine: "Was wondering if anyone in your circle might be a good fit — no rush." Don't follow up before that, and never more than twice.
        </p>

        <h2>What if the family says no?</h2>
        <p>
          Thank them gracefully. The Indian matchmaking world is small — burned bridges show up in other conversations. A polite "thank you for considering, we'll keep looking" closes the loop respectfully.
        </p>

        <h2>The privacy upgrade</h2>
        <p>
          If you're still sharing PDFs on WhatsApp, consider switching to private share links — it gives you the visibility controls these etiquette rules become much easier to follow with.{" "}
          <Link to="/onboarding">Try Rishte free</Link>.
        </p>

        <FAQSection faqs={FAQS} />
      </ContentLayout>
    </>
  );
}
